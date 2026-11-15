/**
 * MCP Client para belentani-hub — Superpowers integration
 * Conecta al servidor MCP unificado con 24 herramientas en 4 grupos:
 *  - google: gcloud_projects, gcloud_billing_accounts, gcloud_enabled_apis,
 *    google_cloud_enable_api, google_oauth_setup, google_drive_list,
 *    google_drive_read, google_gmail_list, google_gmail_read,
 *    google_gmail_send, google_gemini_generate, google_colab_notebooks,
 *    google_colab_execute
 *  - github: github_codespaces, github_repositories, github_issues,
 *    github_pull_requests
 *  - ai: openai_chat, google_gemini_generate, suno_generate
 *  - social: linkedin_profile, linkedin_post, distrokid_artist,
 *    distrokid_release
 *
 * El servidor MCP expone herramientas JSON-RPC por stdio. Este cliente
 * las invoca mediante procesos Node.js spawn.
 */

import { spawn } from "child_process";
import { readFileSync } from "fs";

const MCP_SERVER = "C:\\Users\\USER\\workspace\\agent-mcp-hub\\server.mjs";

export type McpToolName =
  | "hub_status"
  | "gcloud_projects"
  | "gcloud_billing_accounts"
  | "gcloud_enabled_apis"
  | "google_cloud_enable_api"
  | "google_oauth_setup"
  | "google_drive_list"
  | "google_drive_read"
  | "google_gmail_list"
  | "google_gmail_read"
  | "google_gmail_send"
  | "google_gemini_generate"
  | "google_colab_notebooks"
  | "google_colab_execute"
  | "github_codespaces"
  | "github_repositories"
  | "github_issues"
  | "github_pull_requests"
  | "openai_chat"
  | "suno_generate"
  | "linkedin_profile"
  | "linkedin_post"
  | "distrokid_artist"
  | "distrokid_release";

export type McpToolResult =
  | { ok: true; data: unknown }
  | { ok: false; error: string };

type McpJsonRpcRequest = {
  jsonrpc: "2.0";
  id: number;
  method: "initialize" | "tools/list" | "ping" | "tools/call";
  params?: { name?: string; arguments?: Record<string, unknown> };
};

type McpJsonRpcResponse = {
  jsonrpc: "2.0";
  id: number;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
};

let mcpCounter = 0;
let mcpProcess: ReturnType<typeof spawn> | null = null;
let mcpBuf = Buffer.alloc(0);
let mcpPending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();

function ensureMcpProcess() {
  if (mcpProcess) return mcpProcess;
  mcpProcess = spawn("node", [MCP_SERVER], {
    stdio: ["pipe", "pipe", "pipe"],
    env: { ...process.env, CLOUDSDK_CORE_DISABLE_PROMPTS: "1" },
  });
  mcpProcess.stderr.on("data", () => {}); // silenciar stderr del servidor MCP
  mcpProcess.stdout.on("data", (chunk) => {
    mcpBuf = Buffer.concat([mcpBuf, chunk]);
    while (true) {
      const i = mcpBuf.indexOf("\r\n\r\n");
      if (i < 0) break;
      const match = /content-length:\s*(\d+)/i.exec(mcpBuf.subarray(0, i).toString());
      if (!match) { mcpBuf = mcpBuf.subarray(i + 4); continue; }
      const n = Number(match[1]);
      if (mcpBuf.length < i + 4 + n) break;
      const data = mcpBuf.subarray(i + 4, i + 4 + n);
      mcpBuf = mcpBuf.subarray(i + 4 + n);
      try {
        const msg = JSON.parse(data.toString()) as McpJsonRpcResponse;
        const pending = mcpPending.get(msg.id);
        if (pending) {
          mcpPending.delete(msg.id);
          if (msg.error) pending.reject(new Error(msg.error.message || "MCP error"));
          else pending.resolve(msg.result);
        }
      } catch {}
    }
  });
  return mcpProcess;
}

async function mcpCall<T = unknown>(
  name: McpToolName,
  arguments_: Record<string, unknown> = {},
  timeoutMs = 30000
): Promise<McpToolResult> {
  const proc = ensureMcpProcess();
  const id = ++mcpCounter;
  const request: McpJsonRpcRequest = {
    jsonrpc: "2.0",
    id,
    method: "tools/call",
    params: { name, arguments: arguments_ },
  };

  const promise = new Promise<McpToolResult>((resolve, reject) => {
    mcpPending.set(id, { resolve, reject });
    const payload = JSON.stringify(request);
    const header = `Content-Length: ${Buffer.byteLength(payload)}\r\n\r\n`;
    proc.stdin.write(header + payload);
    setTimeout(() => {
      if (mcpPending.has(id)) {
        mcpPending.delete(id);
        reject(new Error(`MCP timeout: ${name}`));
      }
    }, timeoutMs);
  });

  try {
    const result = await promise;
    return { ok: true, data: result };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async mcpInitialize() {
  const proc = ensureMcpProcess();
  const id = ++mcpCounter;
  const request: McpJsonRpcRequest = {
    jsonrpc: "2.0",
    id,
    method: "initialize",
    params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "omega-max-duck", version: "1.0.0" } },
  };
  await new Promise<void>((resolve, reject) => {
    mcpPending.set(id, { resolve, reject as (e: Error) => void });
    const payload = JSON.stringify(request);
    const header = `Content-Length: ${Buffer.byteLength(payload)}\r\n\r\n`;
    proc.stdin.write(header + payload);
    setTimeout(() => reject(new Error("MCP initialize timeout")), 10000);
  });
}

export async mcpListTools() {
  const id = ++mcpCounter;
  const request: McpJsonRpcRequest = { jsonrpc: "2.0", id, method: "tools/list" };
  await new Promise<void>((resolve, reject) => {
    mcpPending.set(id, { resolve, reject as (e: Error) => void });
    const payload = JSON.stringify(request);
    const header = `Content-Length: ${Buffer.byteLength(payload)}\r\n\r\n`;
    ensureMcpProcess().stdin.write(header + payload);
    setTimeout(() => reject(new Error("MCP tools/list timeout")), 10000);
  });
}

/**
 * Funciones de conveniencia por grupo de superpowers
 */

export async function mcpDriveList(query?: string, pageSize = 10) {
  return mcpCall("google_drive_list", { pageSize, query });
}

export async function mcpDriveRead(fileId: string) {
  return mcpCall("google_drive_read", { fileId });
}

export async function mcpGmailList(maxResults = 10, query?: string) {
  return mcpCall("google_gmail_list", { maxResults, query });
}

export async function mcpGmailRead(id: string) {
  return mcpCall("google_gmail_read", { id });
}

export async function mcpGmailSend(to: string, subject: string, body: string) {
  return mcpCall("google_gmail_send", { to, subject, body });
}

export async function mcpGeminiGenerate(prompt: string, model = "gemini-2.0-flash", systemInstruction?: string) {
  return mcpCall("google_gemini_generate", { model, prompt, systemInstruction });
}

export async function mcpColabNotebooks(pageSize = 10) {
  return mcpCall("google_colab_notebooks", { pageSize });
}

export async function mcpColabExecute(notebookId: string, cellSource: string) {
  return mcpCall("google_colab_execute", { notebookId, cellSource });
}

export async function mcpGcloudProjects() {
  return mcpCall("gcloud_projects", {});
}

export async function mcpGcloudEnableApi(projectId: string, api: string) {
  return mcpCall("google_cloud_enable_api", { projectId, api });
}

export async function mcpGithubIssues(repo = "belentani7/belentani-hub") {
  return mcpCall("github_issues", { repo });
}

export async function mcpGithubPullRequests(repo = "belentani7/belentani-hub") {
  return mcpCall("github_pull_requests", { repo });
}

export async function mcpOpenAIChat(prompt: string, model = "gpt-4o-mini", apiKey?: string) {
  return mcpCall("openai_chat", { model, prompt, apiKey });
}

export async function mcpSunoGenerate(title: string, style: string, mood: string) {
  return mcpCall("suno_generate", { title, style, mood });
}

export async function mcpLinkedInProfile(username = "belentani7") {
  return mcpCall("linkedin_profile", { username });
}

export async function mcpLinkedInPost(text: string, visibility = "CONNECTIONS") {
  return mcpCall("linkedin_post", { text, visibility });
}

export async function mcpDistroKidArtist(artistName: string) {
  return mcpCall("distrokid_artist", { artistName });
}

export async function mcpDistroKidRelease(releaseTitle: string) {
  return mcpCall("distrokid_release", { releaseTitle });
}

export async function mcpOAuthSetup() {
  return mcpCall("google_oauth_setup", {});
}
