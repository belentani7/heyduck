/**
 * Notificaciones mejoradas con Superpowers.
 * Soporta:
 *  - Forge/Manus Notification Service (existente)
 *  - Gmail vía MCP (nuevo, fallback cuando Forge no está disponible)
 *
 * El dueño (Duck/Elika) recibe notificaciones por ambos canales
 * para mayor confiabilidad.
 */

import { TRPCError } from "@trpc/server";
import { ENV } from "./env";
import { gmailSend } from "./gmail";

export type NotificationPayload = {
  title: string;
  content: string;
};

const TITLE_MAX_LENGTH = 1200;
const CONTENT_MAX_LENGTH = 20000;

const trimValue = (value: string): string => value.trim();
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const buildEndpointUrl = (baseUrl: string): string => {
  const normalizedBase = baseUrl.endsWith("/")
    ? baseUrl
    : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};

const validatePayload = (input: NotificationPayload): NotificationPayload => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Notification title is required." });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Notification content is required." });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({ code: "BAD_REQUEST", message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.` });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({ code: "BAD_REQUEST", message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.` });
  }
  return { title, content };
};

/**
 * Dispatches notification via Forge (original) with Gmail fallback.
 */
export async function notifyOwner(
  payload: NotificationPayload
): Promise<boolean> {
  const { title, content } = validatePayload(payload);

  // Intento 1: Forge Notification Service
  if (ENV.forgeApiUrl && ENV.forgeApiKey) {
    try {
      const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${ENV.forgeApiKey}`,
          "content-type": "application/json",
          "connect-protocol-version": "1",
        },
        body: JSON.stringify({ title, content }),
      });
      if (response.ok) {
        return true;
      }
      console.warn(`[Notification] Forge failed (${response.status}), trying Gmail fallback`);
    } catch (error) {
      console.warn("[Notification] Forge error, trying Gmail fallback", error);
    }
  }

  // Intento 2: Gmail vía MCP (fallback)
  const ownerEmail = ENV.ownerOpenId; // usar como email si está configurado
  if (ownerEmail && ENV.ownerOpenId.includes("@")) {
    try {
      const result = await gmailSend(ownerEmail, `[Ω-MAX] ${title}`, content);
      if (result.ok) {
        return true;
      }
      console.warn("[Notification] Gmail fallback failed:", result.error);
    } catch (error) {
      console.warn("[Notification] Gmail fallback error:", error);
    }
  }

  // Si no hay configuración ni Forge ni Gmail, lanzar error
  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service not configured. Set BUILT_IN_FORGE_API_URL/KEY or configure Gmail via MCP.",
    });
  }

  return false;
}

/**
 * Envía notificación tanto vía Forge como Gmail (doble canal).
 * Devuelve true si al menos uno entregó.
 */
export async function notifyOwnerDualChannel(
  payload: NotificationPayload
): Promise<{ forge: boolean; gmail: boolean }> {
  const { title, content } = validatePayload(payload);

  let forge = false;
  let gmail = false;

  if (ENV.forgeApiUrl && ENV.forgeApiKey) {
    try {
      const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${ENV.forgeApiKey}`,
          "content-type": "application/json",
          "connect-protocol-version": "1",
        },
        body: JSON.stringify({ title, content }),
      });
      forge = response.ok;
    } catch {
      forge = false;
    }
  }

  const ownerEmail = ENV.ownerOpenId;
  if (ownerEmail && ownerEmail.includes("@")) {
    try {
      const result = await gmailSend(ownerEmail, `[Ω-MAX] ${title}`, content);
      gmail = result.ok;
    } catch {
      gmail = false;
    }
  }

  return { forge, gmail };
}
