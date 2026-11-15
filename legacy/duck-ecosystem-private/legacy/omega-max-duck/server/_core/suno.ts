/**
 * Suno AI música vía MCP Superpowers.
 * Genera letras y metatags (style_prompt) listos para copiar-pegar en Suno.
 * Ideal para el módulo de producción musical de Duck Ω-MAX:
 *  - Generar tracks para proyectos de clientes
 *  - Crear música de fondo para contenido
 *  - Prototipar ideas musicales rápido
 *
 * Requiere: Cuenta de Suno (web) para copiar los resultados.
 * El MCP devuelve style_prompt + letras estructuradas.
 */

import { mcpSunoGenerate } from "./mcpClient";
import { ENV } from "./env";

export type SunoGenerateResult = {
  ok: boolean;
  title: string;
  style: string;
  mood: string;
  emotion: string;
  style_prompt: string;
  lyrics: string;
  instructions: string;
  error?: string;
};

export type SunoEmotion =
  | "nostalgia_esperanzadora"
  | "empoderamiento_heroico"
  | "ruptura_dolorosa"
  | "misterio_oscuridad"
  | "amor_intimo"
  | "euforia_dance"
  | "unknown";

/**
 * Genera una canción completa (letras + style_prompt) para Suno.
 * Usa los prompts estructurados de 03_PROMPTS_SUNO.json del MCP.
 */
export async function sunoGenerateSong(
  title: string,
  style: string,
  mood: string
): Promise<SunoGenerateResult> {
  const result = await mcpSunoGenerate(title, style, mood);
  if (!result.ok) {
    return { ok: false, title, style, mood, emotion: "unknown", style_prompt: "", lyrics: "", instructions: "", error: result.error };
  }
  const data = result.data as {
    title: string;
    style: string;
    mood: string;
    emotion: string;
    style_prompt: string;
    lyrics: string;
    instructions: string;
  };
  return {
    ok: true,
    title: data.title,
    style: data.style,
    mood: data.mood,
    emotion: data.emotion as SunoEmotion,
    style_prompt: data.style_prompt,
    lyrics: data.lyrics,
    instructions: data.instructions,
  };
}

/**
 * Genera música específicamente para un proyecto de producción musical.
 * Crea una canción con metadatos de proyecto.
 */
export async function sunoGenerateForProject(
  projectName: string,
  genre: string,
  mood: string
): Promise<SunoGenerateResult> {
  return sunoGenerateSong(`Track: ${projectName}`, genre, mood);
}

/**
 * Lista de emociones disponibles en Suno (desde 03_PROMPTS_SUNO.json).
 */
export function getSunoEmotions(): SunoEmotion[] {
  return [
    "nostalgia_esperanzadora",
    "empoderamiento_heroico",
    "ruptura_dolorosa",
    "misterio_oscuridad",
    "amor_intimo",
    "euforia_dance",
  ];
}

/**
 * Verifica que Suno esté disponible vía MCP.
 */
export async function sunoHealthCheck(): Promise<{ ok: boolean; error?: string }> {
  try {
    const result = await sunoGenerateSong("Test", "pop", "energético");
    return { ok: result.ok, error: result.error };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "suno check failed" };
  }
}

/**
 * Instrucciones para usar Suno con los resultados generados.
 */
export function getSunoInstructions(): string[] {
  return [
    "1. Ejecuta sunoGenerateSong() para obtener style_prompt y letras.",
    "2. Ve a suno.com y crea una canción nueva.",
    "3. Pega el style_prompt en el campo 'Style'.",
    "4. Pega las letras en el campo 'Lyrics'.",
    "5. Genera y descarga el resultado.",
  ];
}
