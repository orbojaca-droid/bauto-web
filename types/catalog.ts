/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co)
 * @Propósito: Tipos canónicos del catálogo, tipologías oficiales, tallas y carrito transaccional.
 */

// 1. Tipologías oficiales consolidadas del centro de mando de BAUTO
export const DEFAULT_TIPOLOGIAS = [
  "Camisa",
  "Camisón",
  "Chaqueta",
  "Pantalón",
  "Pantaloneta",
  "Pañoleta",
  "Short",
  "Sombrero",
  "Toalla",
  "Postal",
  "Tula",
  "Saco Capotero",
] as const;

export type TipologiaOficial = (typeof DEFAULT_TIPOLOGIAS)[number] | string;

// 2. Tallas estándar de confección BAUTO
export type Talla = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "ÚNICA" | string;

export interface StockPorTalla {
  [talla: string]: number;
}

// 3. Ficha completa del producto normalizada desde Google Sheets (Master DB)
export interface Product {
  id: string;
  reference: string; // SKU (ej. "CMS-LNO-01")
  slug: string; // URL amigable (ej. "camisa-guayabera-lino-blanca")
  name: string;
  price: number; // Precio en COP numérico
  formattedPrice: string; // Ej. "$ 280.000 COP"
  usdPrice?: number; // Precio referencial en USD
  description: string; // Descripción poética/IA
  tipologia: TipologiaOficial; // Tipología oficial
  material: string; // Ej. "100% Lino Europeo", "Algodón Orgánico"
  images: string[]; // URLs de fotos en alta resolución
  primaryImage: string; // Foto principal
  secondaryImage?: string; // Foto de hover/movimiento
  sizes: Talla[]; // Tallas con existencias > 0
  stockPerSize: StockPorTalla; // Desglose exacto de inventario por talla
  totalStock: number; // Suma de existencias
  isExclusiveInStore: boolean; // True si solo queda 1 unidad en tienda física
  careInstructions?: string; // Cuidados de la prenda
  fabricGrammage?: string; // Ej. "165 g/m²"
  fabricTransparency?: "Opaco" | "Ligeramente traslúcido" | "Calado ventilado";
}

// 4. Elemento dentro de la Bolsa de Compras
export interface CartItem {
  id: string; // Combinación única `${product.id}-${talla}`
  product: Product;
  selectedSize: Talla;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// 5. Estado global de la Bolsa de Compras
export interface CartState {
  items: CartItem[];
  subtotal: number;
  freeShippingThreshold: number; // Ej. $300.000 COP
  needsShipping: boolean;
  isGiftPackaging: boolean;
  giftDedicationNote: string;
  isOpen: boolean; // Estado del Drawer/Bottom Sheet
}

// 6. Información de Rastreo de Envíos (MiPaquete V2)
export type TrackingStatus =
  | "EN_TALLER"
  | "EN_TRANSITO"
  | "EN_REPARTO"
  | "ENTREGADO"
  | "NOVEDAD";

export interface TrackingInfo {
  orderId: string;
  guideNumber: string;
  carrier: string;
  status: TrackingStatus;
  statusTitle: string;
  statusDescription: string;
  originCity: string; // "Santa Marta"
  destinationCity: string;
  estimatedDeliveryDate?: string;
  history: Array<{
    date: string;
    description: string;
    city?: string;
  }>;
}
