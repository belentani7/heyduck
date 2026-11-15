/**
 * LLM mejorado con Superpowers MCP.
 * Soporta:
 *  - Gemini vía MCP (google_gemini_generate) — primario
 *  - OpenAI ChatGPT vía MCP (openai_chat) — fallback
 *  - Forge/Manus (existente) — legacy
 *
 * El cliente MCP (mcpClient.ts) se encarga de la conexión stdio al
 * servidor belentani-hub. Si MCP no está disponible, se intenta Forge.
 */

import { ENV } from "./env";
import {
  mcpGeminiGenerate,
  mcpOpenAIChat,
  mcpInitialize,
} from "./mcpClient";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type ImageContent = {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
};

export type FileContent = {
  type: "file_url";
  file_url: {
    url: string;
    mime_type?: string;
  };
};

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type InvokeParams = {
  messages: Message[];
  tools?: Tool[];
  toolChoice?: "none" | "auto" | "required";
  maxTokens?: number;
  model?: string;
  thinking?: Record<string, unknown>;
  reasoning?: Record<string, unknown>;
  systemInstruction?: string;
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string | Array<TextContent | ImageContent | FileContent>;
      tool_calls?: Array<{ id: string; type: "function"; function: { name: string; arguments: string } }>;
    };
    finish_reason: string | null;
  }>;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  provider: "gemini" | "openai" | "forge";
};

const ensureArray = (value: MessageContent | MessageContent[]): MessageContent[] =>
  Array.isArray(value) ? value : [value];

const normalizeContentPart = (part: MessageContent): TextContent | ImageContent | FileContent => {
  if (typeof part === "string") return { type: "text", text: part };
  if (part.type === "text") return part;
  if (part.type === "image_url") return part;
  if (part.type === "file_url") return part;
  throw new Error("Unsupported message content part");
};

const buildMcpPrompt = (messages: Message[], systemInstruction?: string): string => {
  const parts: string[] = [];
  if (systemInstruction) parts.push(`SYSTEM: ${systemInstruction}`);
  for (const msg of messages) {
    const roleLabel = msg.role === "user" ? "USER" : msg.role === "assistant" ? "ASSISTANT" : msg.role === "system" ? "SYSTEM" : msg.role;
    const contentParts = ensureArray(msg.content).map(normalizeContentPart);
    const text = contentParts.map((p) => (p.type === "text" ? p.text : `[${p.type}]`)).join(" ");
    parts.push(`${roleLabel}: ${text}`);
  }
  return parts.join("\n\n");
};

let mcpInitialized = false;

async function ensureMcp() {
  if (!mcpInitialized) {
    try {
      await mcpInitialize();
      mcpInitialized = true;
    } catch {
      // MCP no disponible, se usará Forge como fallback
    }
  }
}

/**
 * Invoca LLM con prioridad:
 *  1. Gemini vía MCP (si hay GEMINI_API_KEY o GOOGLE_APPLICATION_CREDENTIALS)
 *  2. OpenAI ChatGPT vía MCP (si hay OPENAI_API_KEY)
 *  3. Forge/Manus (legacy, si hay BUILT_IN_FORGE_API_KEY)
 */
export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  const { messages, systemInstruction, model } = params;
  const mcpPrompt = buildMcpPrompt(messages, systemInstruction);

  // --- Opción 1: Gemini vía MCP ---
  if (ENV.geminiApiKey || ENV.googleApplicationCredentials) {
    await ensureMcp();
    try {
      const result = await mcpGeminiGenerate(mcpPrompt, model ?? "gemini-2.0-flash", systemInstruction);
      if (result.ok && result.data) {
        const data = result.data as { text?: string; raw?: unknown };
        return {
          id: "mcp-gemini",
          created: Math.floor(Date.now() / 1000),
          model: model ?? "gemini-2.0-flash",
          choices: [
            {
              index: 0,
              message: { role: "assistant", content: data.text ?? "" },
              finish_reason: "stop",
            },
          ],
          provider: "gemini",
        };
      }
    } catch {
      // caer al siguiente proveedor
    }
  }

  // --- Opción 2: OpenAI ChatGPT vía MCP ---
  if (ENV.openaiApiKey) {
    await ensureMcp();
    try {
      const result = await mcpOpenAIChat(mcpPrompt, model ?? "gpt-4o-mini", ENV.openaiApiKey);
      if (result.ok && result.data) {
        const data = result.data as { text?: string };
        return {
          id: "mcp-openai",
          created: Math.floor(Date.now() / 1000),
          model: model ?? "gpt-4o-mini",
          choices: [
            {
              index: 0,
              message: { role: "assistant", content: data.text ?? "" },
              finish_reason: "stop",
            },
          ],
          provider: "openai",
        };
      }
    } catch {
      // caer a Forge
    }
  }

  // --- Opción 3: Forge/Manus (legacy) ---
  if (ENV.forgeApiKey) {
    // Reutilizar la implementación existente de forge (se importa dinámicamente)
    const { invokeLLM: invokeForgeLLM } = await import("./llmForge");
    return invokeForgeLLM(params);
  }

  throw new Error(
    "No LLM provider configurado. Configura GEMINI_API_KEY, OPENAI_API_KEY o BUILT_IN_FORGE_API_KEY."
  );
}

/**
 * Lista modelos disponibles vía MCP (Gemini + OpenAI)
 */
export async function listLLMModels() {
  const models: Array<{ id: string; name: string; provider: "gemini" | "openai" }> = [];
  if (ENV.geminiApiKey || ENV.googleApplicationCredentials) {
    models.push(
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "gemini" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "gemini" },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "gemini" }
    );
  }
  if (ENV.openaiApiKey) {
    models.push(
      { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "openai" },
      { id: "gpt-4o", name: "GPT-4o", provider: "openai" }
    );
  }
  return { models };
}

/**
 * Verifica qué proveedores de LLM están configurados
 */
export function getConfiguredLlmProviders() {
  return {
    gemini: Boolean(ENV.geminiApiKey || ENV.googleApplicationCredentials),
    openai: Boolean(ENV.openaiApiKey),
    forge: Boolean(ENV.forgeApiKey),
  };
}
