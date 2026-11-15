/**
 * Almacenamiento Google Drive vía MCP Superpowers.
 * Reemplaza o complementa Forge/S3 para archivos de clientes,
 * entregables de portal, facturas, música generada, etc.
 *
 * Usa google_drive_list y google_drive_read del servidor belentani-hub.
 * Requiere OAuth autorizado (ver google_oauth_setup en el MCP hub).
 */

import { mcpDriveList, mcpDriveRead } from "./mcpClient";
import { ENV } from "./env";

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink?: string;
  content?: string; // solo para archivos de texto
};

export type DriveListResult = {
  files: DriveFile[];
  nextPageToken?: string;
};

/**
 * Lista archivos en Google Drive. Opcionalmente filtra por query (sintaxis Drive API).
 */
export async function driveList(query?: string, pageSize = 20): Promise<DriveListResult> {
  const result = await mcpDriveList(query, pageSize);
  if (!result.ok) {
    throw new Error(`Drive list failed: ${result.error}`);
  }
  const data = result.data as { files?: Array<{ id: string; name: string; mimeType: string; size?: string; webViewLink?: string }>; nextPageToken?: string };
  return {
    files: (data.files ?? []).map((f) => ({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      size: f.size,
      webViewLink: f.webViewLink,
    })),
    nextPageToken: data.nextPageToken,
  };
}

/**
 * Lee metadatos y contenido de un archivo de Drive.
 * Solo devuelve contenido de texto para mimeTypes de texto/JSON/CSV.
 */
export async function driveRead(fileId: string): Promise<DriveFile> {
  const result = await mcpDriveRead(fileId);
  if (!result.ok) {
    throw new Error(`Drive read failed: ${result.error}`);
  }
  const data = result.data as { file: { id: string; name: string; mimeType: string; size?: string; webViewLink?: string; content?: string } };
  return {
    id: data.file.id,
    name: data.file.name,
    mimeType: data.file.mimeType,
    size: data.file.size,
    webViewLink: data.file.webViewLink,
    content: data.file.content,
  };
}

/**
 * Busca archivos de un cliente/proyecto específico en Drive.
 * query ejemplo: "name contains 'cliente-123' and trashed=false"
 */
export async function driveFindClientFiles(clientId: string | number): Promise<DriveFile[]> {
  const query = `name contains '${clientId}' and trashed=false`;
  const result = await driveList(query, 50);
  return result.files;
}

/**
 * Verifica que Google Drive esté accesible vía MCP.
 */
export async function driveHealthCheck(): Promise<{ ok: boolean; error?: string }> {
  try {
    const result = await driveList(undefined, 1);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "unknown drive error" };
  }
}

/**
 * Configuración de Google Application Credentials.
 * El archivo JSON de servicio debe estar en GOOGLE_APPLICATION_CREDENTIALS.
 */
export function getGoogleCredentialsPath(): string {
  return ENV.googleApplicationCredentials;
}
