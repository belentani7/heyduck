/**
 * Gmail vía MCP Superpowers.
 * Reemplaza o complementa el servicio de notificaciones de Forge.
 * Permite enviar emails de notificación, facturas, comunicaciones
 * a clientes y alertas de automatización.
 *
 * Requiere scope de OAuth: https://www.googleapis.com/auth/gmail.send
 */

import { mcpGmailList, mcpGmailRead, mcpGmailSend } from "./mcpClient";
import { ENV } from "./env";

export type GmailMessage = {
  id: string;
  threadId?: string;
  snippet?: string;
  internalDate?: string;
};

export type GmailListResult = {
  messages: GmailMessage[];
  nextPageToken?: string;
};

/**
 * Lista mensajes de Gmail. Opcionalmente filtra por query (sintaxis Gmail).
 */
export async function gmailList(maxResults = 10, query?: string): Promise<GmailListResult> {
  const result = await mcpGmailList(maxResults, query);
  if (!result.ok) {
    throw new Error(`Gmail list failed: ${result.error}`);
  }
  const data = result.data as { messages?: Array<{ id: string; threadId?: string; snippet?: string }>; nextPageToken?: string };
  return {
    messages: (data.messages ?? []).map((m) => ({
      id: m.id,
      threadId: m.threadId,
      snippet: m.snippet,
    })),
    nextPageToken: data.nextPageToken,
  };
}

/**
 * Lee un mensaje de Gmail por ID.
 */
export async function gmailRead(id: string): Promise<{ id: string; snippet?: string; body?: string }> {
  const result = await mcpGmailRead(id);
  if (!result.ok) {
    throw new Error(`Gmail read failed: ${result.error}`);
  }
  const data = result.data as { id: string; snippet?: string; body?: string };
  return data;
}

/**
 * Envía un email vía Gmail.
 * Requiere scope: https://www.googleapis.com/auth/gmail.send
 */
export async function gmailSend(to: string, subject: string, body: string): Promise<{ ok: boolean; id?: string; error?: string }> {
  const result = await mcpGmailSend(to, subject, body);
  if (!result.ok) {
    return { ok: false, error: result.error };
  }
  const data = result.data as { id?: string };
  return { ok: true, id: data.id };
}

/**
 * Envía notificación de automatización vía Gmail.
 * Usada por automationEngine cuando el dueño debe ser notificado.
 */
export async function sendAutomationEmail(
  to: string,
  automationName: string,
  trigger: string,
  detail: string
): Promise<{ ok: boolean; error?: string }> {
  const subject = `[Ω-MAX] Automatización: ${automationName}`;
  const body = `
La regla de automatización «${automationName}}» se activó por: ${trigger}

Detalle:
${detail}

---
Duck Ω-MAX Studio OS
Sistema de automatización inteligente
  `.trim();
  return gmailSend(to, subject, body);
}

/**
 * Envía factura por email a un cliente.
 */
export async function sendInvoiceEmail(
  to: string,
  invoiceNumber: string,
  amount: string,
  pdfUrl?: string
): Promise<{ ok: boolean; error?: string }> {
  const subject = `[Ω-MAX] Factura ${invoiceNumber}`;
  const body = `
Hola,

Adjunto encontrarás la factura ${invoice_number} por un monto de ${amount} EUR.

${pdfUrl ? `Puedes descargarla aquí: ${pdfUrl}` : ""}

Recuerda que ninguna cobro se ejecuta automáticamente. Toda solicitud de pago
requiere tu aprobación explícita desde el módulo de Finanzas de Duck Ω-MAX.

Gracias por confiar en Duck Ω-MAX Studio OS.
  `.replace("${invoice_number}", invoiceNumber).trim();
  return gmailSend(to, subject, body);
}

/**
 * Verifica que Gmail esté accesible vía MCP.
 */
export async function gmailHealthCheck(): Promise<{ ok: boolean; error?: string }> {
  try {
    const result = await gmailList(1);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "unknown gmail error" };
  }
}

/**
 * Configuración requerida para Gmail vía MCP.
 * Se obtiene ejecutando la herramienta google_oauth_setup del MCP hub.
 */
export function getGmailScopes(): string[] {
  return [
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.readonly",
  ];
}
