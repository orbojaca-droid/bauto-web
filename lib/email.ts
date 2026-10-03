/**
 * @BAUTO_ECOSYSTEM 2026-09-28
 * @Modulo: WEB (bauto.com.co) - Motor de Notificaciones Transaccionales (Resend)
 * @Propósito: Envía confirmaciones de pedido por correo electrónico con diseño de lujo
 *             alineado al BRAND & DESIGN SYSTEM de BAUTO Resort Wear ($0 en tier gratuito).
 */

import { formatCOP } from "./grammar";

export interface OrderEmailItem {
  reference: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderEmailData {
  to: string;
  clientName: string;
  orderReference: string;
  ventaId?: string | number;
  items: OrderEmailItem[];
  subtotal: number;
  shippingCost: number;
  totalCOP: number;
  paymentMethod?: string;
  shippingAddress: {
    direccion: string;
    complemento?: string;
    barrio?: string;
    ciudad: string;
    telefono?: string;
  };
  trackingGuide?: string;
}

export async function sendOrderConfirmationEmail(
  data: OrderEmailData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.info(
      `[SIMULACIÓN EMAIL RESEND] Correo de confirmación para ${data.to} (Pedido: ${data.orderReference}). Configure RESEND_API_KEY para envíos reales.`
    );
    return { success: true, id: `sim_${Date.now()}` };
  }

  const fromEmail = process.env.EMAIL_FROM || "BAUTO <onboarding@resend.dev>";
  const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://bauto-web.vercel.app"}/rastreo?guia=${encodeURIComponent(
    data.trackingGuide || data.orderReference
  )}`;

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #E5E0D8; font-size: 13px; color: #2C2C2C;">
          <strong>${item.name}</strong><br>
          <span style="font-size: 11px; color: #6E6E6E;">Ref: ${item.reference} · Talla: ${item.size}</span>
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #E5E0D8; font-size: 13px; color: #2C2C2C; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #E5E0D8; font-size: 13px; color: #2C2C2C; text-align: right; font-weight: 600;">
          ${formatCOP(item.totalPrice)}
        </td>
      </tr>`
    )
    .join("");

  const emailHtml = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Pedido BAUTO</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #FAF9F6; font-family: -apple-system, BlinkMacSystemFont, 'Montserrat', 'Lato', 'Segoe UI', Roboto, sans-serif; color: #2C2C2C; line-height: 1.6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF9F6; padding: 40px 15px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #EBE7DF; box-shadow: 0 4px 20px rgba(44, 44, 44, 0.04);">
            
            <!-- HEADER LOGO -->
            <tr>
              <td align="center" style="padding: 40px 30px 20px 30px; border-bottom: 1px solid #F2F0EB;">
                <h1 style="margin: 0; font-size: 26px; font-weight: 300; letter-spacing: 6px; color: #1C1917; text-transform: uppercase;">BAUTO</h1>
                <p style="margin: 6px 0 0 0; font-size: 10px; font-weight: 600; letter-spacing: 2px; color: #B85C38; text-transform: uppercase;">Resort Wear · Santa Marta</p>
              </td>
            </tr>

            <!-- SALUDO Y MENSAJE DE CONFIRMACIÓN -->
            <tr>
              <td style="padding: 35px 35px 20px 35px;">
                <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #1C1917;">Gracias por elegir la calma, ${data.clientName}.</h2>
                <p style="margin: 0 0 16px 0; font-size: 13px; color: #6E6E6E; line-height: 1.7;">
                  Hemos recibido tu pago con éxito. Tu pedido ha sido confirmado y nuestro taller caribeño en Santa Marta ya se encuentra preparando cada una de tus piezas con sumo cuidado.
                </p>
                <div style="background-color: #F8F6F1; border-left: 3px solid #B85C38; padding: 12px 16px; border-radius: 4px; margin-bottom: 25px;">
                  <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6E6E6E; font-weight: 600;">Referencia de Pedido</span><br>
                  <strong style="font-size: 15px; color: #1C1917; font-family: monospace;">${data.orderReference}</strong>
                  ${data.ventaId ? `<span style="font-size: 12px; color: #6E6E6E; margin-left: 8px;">(Venta #${data.ventaId})</span>` : ""}
                </div>
              </td>
            </tr>

            <!-- TABLA DE PRENDAS -->
            <tr>
              <td style="padding: 0 35px 20px 35px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                  <thead>
                    <tr style="border-bottom: 2px solid #EBE7DF;">
                      <th align="left" style="padding: 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #6E6E6E; font-weight: 600;">Prenda</th>
                      <th align="center" style="padding: 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #6E6E6E; font-weight: 600;">Cant.</th>
                      <th align="right" style="padding: 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #6E6E6E; font-weight: 600;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- TOTALES -->
            <tr>
              <td style="padding: 10px 35px 25px 35px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; line-height: 2;">
                  <tr>
                    <td align="left" style="color: #6E6E6E;">Subtotal:</td>
                    <td align="right" style="color: #2C2C2C; font-weight: 500;">${formatCOP(data.subtotal)}</td>
                  </tr>
                  <tr>
                    <td align="left" style="color: #6E6E6E;">Envío nacional:</td>
                    <td align="right" style="color: #2C2C2C; font-weight: 500;">
                      ${formatCOP(data.shippingCost)}
                    </td>
                  </tr>
                  <tr style="border-top: 1px solid #E5E0D8;">
                    <td align="left" style="padding-top: 10px; font-size: 15px; font-weight: 700; color: #1C1917;">Total Pagado:</td>
                    <td align="right" style="padding-top: 10px; font-size: 17px; font-weight: 700; color: #B85C38;">${formatCOP(data.totalCOP)}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- DATOS DE ENTREGA -->
            <tr>
              <td style="padding: 0 35px 30px 35px;">
                <div style="background-color: #FAF9F6; border: 1px solid #EBE7DF; border-radius: 8px; padding: 18px 20px;">
                  <h3 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #6E6E6E; font-weight: 600;">Destino de Envío</h3>
                  <p style="margin: 0; font-size: 13px; color: #2C2C2C; line-height: 1.5;">
                    <strong>${data.clientName}</strong><br>
                    ${data.shippingAddress.direccion} ${data.shippingAddress.complemento ? `· ${data.shippingAddress.complemento}` : ""}<br>
                    ${data.shippingAddress.barrio ? `Barrio ${data.shippingAddress.barrio}, ` : ""}${data.shippingAddress.ciudad}<br>
                    ${data.shippingAddress.telefono ? `Tel: ${data.shippingAddress.telefono}` : ""}
                  </p>
                </div>
              </td>
            </tr>

            <!-- BOTÓN DE RASTREO -->
            <tr>
              <td align="center" style="padding: 0 35px 40px 35px;">
                <a href="${trackingUrl}" style="display: inline-block; background-color: #B85C38; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 4px 12px rgba(184, 92, 56, 0.25);">
                  Rastrear mi pedido en tiempo real
                </a>
              </td>
            </tr>

            <!-- FOOTER EDITORIAL -->
            <tr>
              <td align="center" style="background-color: #FAF9F6; border-top: 1px solid #EBE7DF; padding: 30px 20px;">
                <p style="margin: 0 0 8px 0; font-size: 11px; color: #6E6E6E;">
                  BAUTO Resort Wear · Confort y movimiento del Trópico
                </p>
                <p style="margin: 0; font-size: 10px; color: #8C8880;">
                  Tienda Física: Calle 20 # 2-36, Centro Histórico, Santa Marta, Colombia<br>
                  <a href="https://www.bauto.com.co" style="color: #B85C38; text-decoration: none;">www.bauto.com.co</a>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [data.to],
        subject: `Confirmación de tu pedido BAUTO #${data.orderReference}`,
        html: emailHtml,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      console.error("Fallo al enviar correo con Resend:", json);
      return { success: false, error: json.message || "Error al enviar correo" };
    }

    return { success: true, id: json.id };
  } catch (error: any) {
    console.error("Excepción en sendOrderConfirmationEmail:", error);
    return { success: false, error: error.message };
  }
}
