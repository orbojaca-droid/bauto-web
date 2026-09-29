/**
 * @BAUTO_ECOSYSTEM 2026-09-29
 * @Modulo: WEB (Gateway API - Google Apps Script)
 * @Propósito: Backend soberano y seguro para la tienda web oficial (bauto.com.co).
 *             Conecta Master Stock DB y Ventas DB en modo 100% privado en Google Drive.
 *             Procesa lecturas de inventario en vivo y asentamiento atómico de ventas con LockService.
 * @Capa: Capa 2 - Lógica Funcional / Seguridad
 * @Riesgo_Evaluado: Alto - Manejo transaccional de inventario y ventas
 */

const STOCK_SPREADSHEET_ID = '1cKL-Rt04R6e_Xdesg_2RkQufN6DKmTcSQpxVVTySZxg';
const VENTAS_SPREADSHEET_ID = '1tZeAgLCeeYpeesZQhxvtGNqKI6d9qfOZyYWCdAMzSH0';

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      service: 'BAUTO WEB GATEWAY API',
      status: 'ONLINE',
      timestamp: new Date().toISOString()
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    let body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch (err) {
      body = {};
    }

    const secretoConfigurado = PropertiesService.getScriptProperties().getProperty('SECRETO_VENTA_SERVICIO') || 'SECRETO_VENTA_SERVICIO';
    if (!body.secreto || body.secreto !== secretoConfigurado) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: 'SECRETO_INVALIDO' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Acción 1: Obtener catálogo activo con stock real y fotos CDN
    if (body.accion === 'obtenerCatalogoWeb') {
      const productos = obtenerCatalogoWeb_();
      return ContentService.createTextOutput(
        JSON.stringify({ success: true, products: productos })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Acción 2: Asentamiento atómico de venta confirmada por Wompi
    if (body.accion === 'registrarVentaWeb') {
      const resultado = registrarVentaWeb_(body.payload);
      return ContentService.createTextOutput(
        JSON.stringify(resultado)
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Acción 3: Ping de verificación
    if (body.accion === 'ping') {
      return ContentService.createTextOutput(
        JSON.stringify({ success: true, status: 'ONLINE', date: new Date().toISOString() })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: 'ACCION_NO_RECONOCIDA' })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('Error en doPost WEB Gateway: ' + err.message);
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: 'ERROR_INTERNO: ' + err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Normaliza cadenas eliminando acentos y espacios sobrantes para coincidencia de cabeceras
 */
function normalizeText(str) {
  if (!str) return '';
  return str.toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();
}

/**
 * Convierte enlaces de Google Drive en miniaturas de alta compatibilidad y velocidad CDN
 */
function driveLinkToThumbnail(url, sz) {
  if (!url) return '';
  const s = url.toString().trim();
  if (!s) return '';
  const match = s.match(/\/file\/d\/([a-zA-Z0-9-_]+)/) || s.match(/id=([a-zA-Z0-9-_]+)/) || s.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const size = sz || 800;
    return 'https://drive.google.com/thumbnail?id=' + match[1] + '&sz=w' + size;
  }
  return s;
}

/**
 * Convierte representaciones numéricas o de moneda en enteros limpios
 */
function parseCurrencyNumber(val) {
  if (!val) return 0;
  if (typeof val === 'number') return Math.round(val);
  const clean = val.toString().replace(/[^0-9]/g, '');
  return parseInt(clean, 10) || 0;
}

/**
 * Lectura en batch de la hoja privada STOCK en Master DB.
 * Excluye rigurosamente costos, compras, márgenes y proveedores.
 */
function obtenerCatalogoWeb_() {
  const ss = SpreadsheetApp.openById(STOCK_SPREADSHEET_ID);
  const sheet = ss.getSheetByName('STOCK');
  if (!sheet) throw new Error('Hoja STOCK no encontrada en Master DB');

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0];
  const refIdx = headers.findIndex(h => normalizeText(h) === 'REFERENCIA' || normalizeText(h) === 'SKU' || normalizeText(h) === 'REF');
  const matIdx = headers.findIndex(h => normalizeText(h) === 'MATERIAL' || normalizeText(h) === 'TELA');
  let nameIdx = headers.findIndex(h => normalizeText(h) === 'NOMBRE CREATIVO');
  if (nameIdx === -1) nameIdx = headers.findIndex(h => normalizeText(h) === 'PRODUCTO' || normalizeText(h) === 'NOMBRE');
  const tipoIdx = headers.findIndex(h => normalizeText(h) === 'TIPOLOGIA' || normalizeText(h) === 'CATEGORIA');
  const precioIdx = headers.findIndex(h => normalizeText(h) === 'PRECIO' || normalizeText(h) === 'VALOR' || normalizeText(h) === 'PRECIO VENTA');
  const descIdx = headers.findIndex(h => normalizeText(h) === 'DESCRIPCION IA' || normalizeText(h) === 'DESCRIPCION');

  // Identificar índices de fotos
  const fotoIdxs = [];
  headers.forEach((h, idx) => {
    const norm = normalizeText(h);
    if (norm.includes('FOTO') || norm.includes('IMAGEN') || norm.includes('PORTADA') || norm === 'DRIVE') {
      fotoIdxs.push(idx);
    }
  });

  // Mapeo dinámico de columnas de tallas (TDA, BOD y consolidado)
  const sizeKeys = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'UNICA'];
  const sizeColIndices = {};

  sizeKeys.forEach(talla => {
    const aliases = [
      'STO-' + talla, 'STOCK ' + talla, 'TDA-' + talla, 'BOD-' + talla,
      talla === 'UNICA' ? 'STO-U' : '', talla === 'UNICA' ? 'STO-Ú' : '',
      talla === 'UNICA' ? 'TDA-U' : '', talla === 'UNICA' ? 'TDA-Ú' : '',
      talla === 'UNICA' ? 'BOD-U' : '', talla === 'UNICA' ? 'BOD-Ú' : '',
      talla === 'UNICA' ? 'UNICA' : '', talla === 'UNICA' ? 'ÚNICA' : '',
      talla
    ].filter(Boolean);

    headers.forEach((h, idx) => {
      const norm = normalizeText(h);
      if (aliases.some(a => norm === normalizeText(a))) {
        if (!sizeColIndices[talla]) sizeColIndices[talla] = [];
        if (!sizeColIndices[talla].includes(idx)) sizeColIndices[talla].push(idx);
      }
    });
  });

  if (refIdx === -1) throw new Error('Columna REFERENCIA no encontrada en la hoja STOCK');

  const products = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const ref = row[refIdx] ? row[refIdx].toString().trim().toUpperCase() : '';
    if (!ref || ref === 'REFERENCIA') continue;

    const rawName = nameIdx !== -1 && row[nameIdx] ? row[nameIdx].toString().trim() : ('Prenda ' + ref);
    const price = precioIdx !== -1 ? parseCurrencyNumber(row[precioIdx]) : 0;
    if (price <= 0) continue;

    const material = matIdx !== -1 && row[matIdx] ? row[matIdx].toString().trim() : 'Lino y fibras nobles';
    const tipologia = tipoIdx !== -1 && row[tipoIdx] ? row[tipoIdx].toString().trim() : 'Prendas';
    const description = descIdx !== -1 && row[descIdx] ? row[descIdx].toString().trim() : '';

    // Extracción de fotografías
    const images = [];
    fotoIdxs.forEach(idx => {
      const val = row[idx] ? row[idx].toString().trim() : '';
      if (val && val.startsWith('http')) {
        const thumb = driveLinkToThumbnail(val, 800);
        if (thumb && !images.includes(thumb)) images.push(thumb);
      }
    });

    // Cálculo consolidado de stock por talla
    const stockPerSize = {};
    const availableSizes = [];
    let totalStock = 0;

    sizeKeys.forEach(talla => {
      const colList = sizeColIndices[talla] || [];
      let countForSize = 0;
      colList.forEach(cIdx => {
        const val = row[cIdx];
        const num = parseCurrencyNumber(val);
        countForSize += num;
      });
      const finalCount = Math.max(0, countForSize);
      const displayKey = talla === 'UNICA' ? 'ÚNICA' : talla;
      stockPerSize[displayKey] = finalCount;
      totalStock += finalCount;
      if (finalCount > 0) {
        availableSizes.push(displayKey);
      }
    });

    if (totalStock === 0) continue;

    const isExclusiveInStore = totalStock === 1;

    products.push({
      id: ref,
      reference: ref,
      name: rawName,
      price: price,
      material: material,
      tipologia: tipologia,
      description: description,
      images: images,
      primaryImage: images[0] || '',
      secondaryImage: images[1] || '',
      sizes: availableSizes,
      stockPerSize: stockPerSize,
      totalStock: totalStock,
      isExclusiveInStore: isExclusiveInStore
    });
  }

  return products;
}

/**
 * Asienta la venta confirmada de Wompi con exclusión mutua en LockService.
 * Descuenta unidades en STOCK y crea registro en VENTAS y MOVIMIENTOS.
 */
function registrarVentaWeb_(payload) {
  if (!payload || !payload.cart || !Array.isArray(payload.cart) || payload.cart.length === 0) {
    return { success: false, error: 'CARRITO_VACIO' };
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (e) {
    return { success: false, error: 'SERVIDOR_OCUPADO_REINTENTAR' };
  }

  try {
    const ssStock = SpreadsheetApp.openById(STOCK_SPREADSHEET_ID);
    const ssVentas = SpreadsheetApp.openById(VENTAS_SPREADSHEET_ID);
    const stockSheet = ssStock.getSheetByName('STOCK');
    const ventasSheet = ssVentas.getSheetByName('HistoricoVentas') || ssVentas.getSheetByName('Ventas') || ssVentas.getSheets()[0];
    const movSheet = ssStock.getSheetByName('MOVIMIENTOS');

    const stockData = stockSheet.getDataRange().getValues();
    const headers = stockData[0];
    const refIdx = headers.findIndex(h => normalizeText(h) === 'REFERENCIA' || normalizeText(h) === 'REF');
    if (refIdx === -1) throw new Error('Columna REFERENCIA no encontrada en STOCK');

    // Descontar inventario en la hoja STOCK
    payload.cart.forEach(item => {
      const itemRef = normalizeText(item.ref || item.reference);
      const qty = parseInt(item.qty || item.quantity || 1, 10);
      const talla = normalizeText(item.talla || item.size || 'UNICA');

      // Buscar columna de la talla en STOCK
      const targetHeader = 'STO-' + talla;
      let colIdx = headers.findIndex(h => normalizeText(h) === targetHeader);
      if (colIdx === -1) {
        colIdx = headers.findIndex(h => normalizeText(h) === 'STOCK ' + talla || normalizeText(h) === talla);
      }

      if (colIdx !== -1) {
        for (let r = 1; r < stockData.length; r++) {
          if (normalizeText(stockData[r][refIdx]) === itemRef) {
            const currentStock = parseCurrencyNumber(stockData[r][colIdx]);
            const newStock = Math.max(0, currentStock - qty);
            stockSheet.getRange(r + 1, colIdx + 1).setValue(newStock);
            break;
          }
        }
      }

      // Anotar movimiento en MOVIMIENTOS si existe la hoja
      if (movSheet) {
        movSheet.appendRow([
          new Date(),
          'VENTA_WEB',
          item.ref || item.reference,
          item.talla || item.size,
          -qty,
          'Wompi Web: ' + (payload.notas || '')
        ]);
      }
    });

    // Generar consecutivo para VENTAS
    const lastRow = ventasSheet.getLastRow();
    const consecutivo = 'VTA-WEB-' + (lastRow > 1 ? lastRow : 1001);

    // Asentar en la hoja de Ventas
    const fechaHora = new Date();
    ventasSheet.appendRow([
      consecutivo,
      fechaHora,
      payload.clientName || 'Cliente Web',
      payload.clientDi || '',
      payload.telefono || '',
      payload.clientEmail || '',
      payload.direccion || '',
      payload.ciudad || 'Santa Marta',
      payload.cart.map(i => (i.ref || i.reference) + ' (' + (i.talla || i.size) + ') x' + (i.qty || i.quantity)).join(', '),
      payload.total || payload.valor || 0,
      'WOMPI',
      'CONFIRMADO',
      payload.notas || ''
    ]);

    SpreadsheetApp.flush();
    return { success: true, ventaId: consecutivo, fecha: fechaHora.toISOString() };

  } catch (err) {
    Logger.log('Fallo en registrarVentaWeb_: ' + err.message);
    return { success: false, error: err.message };
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {}
  }
}
