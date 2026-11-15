/**
 * GitHub vía MCP Superpowers.
 * Permite:
 *  - Listar issues y pull requests del repositorio
 *  - Crear issues para errores de automatización
 *  - Crear PRs para cambios de esquema (migraciones Drizzle)
 *  - Listar codespaces
 *
 * Requiere: GITHUB_TOKEN con scopes repo, workflow, user
 */

import { mcpGithubIssues, mcpGithubPullRequests, mcpGcloudProjects } from "./mcpClient";
import { ENV } from "./env";

export type GithubIssue = {
  number: number;
  title: string;
  state: string;
  url: string;
  createdAt: string;
};

export type GithubPr = {
  number: number;
  title: string;
  state: string;
  url: string;
  head: string;
  base: string;
};

export type GithubIssueResult = {
  issues: GithubIssue[];
};

export type GithubPrResult = {
  pulls: GithubPr[];
};

/**
 * Lista issues abiertos de un repositorio GitHub.
 */
export async function githubListIssues(repo = `${ENV.githubOwner}/omega-max-duck`): Promise<GithubIssueResult> {
  const result = await mcpGithubIssues(repo);
  if (!result.ok) {
    throw new Error(`GitHub issues failed: ${result.error}`);
  }
  const data = result.data as { issues?: Array<{ number: number; title: string; state: string; url: string; created_at: string }> };
  return {
    issues: (data.issues ?? []).map((i) => ({
      number: i.number,
      title: i.title,
      state: i.state,
      url: i.url,
      createdAt: i.created_at,
    })),
  };
}

/**
 * Lista pull requests abiertos de un repositorio GitHub.
 */
export async function githubListPullRequests(repo = `${ENV.githubOwner}/omega-max-duck`): Promise<GithubPrResult> {
  const result = await mcpGithubPullRequests(repo);
  if (!result.ok) {
    throw new Error(`GitHub pulls failed: ${result.error}`);
  }
  const data = result.data as { pulls?: Array<{ number: number; title: string; state: string; url: string; head: { ref: string }; base: { ref: string } }> };
  return {
    pulls: (data.pulls ?? []).map((p) => ({
      number: p.number,
      title: p.title,
      state: p.state,
      url: p.url,
      head: p.head.ref,
      base: p.base.ref,
    })),
  };
}

/**
 * Crea un issue para un error de automatización.
 * Nota: La creación de issues vía MCP requiere el endpoint de GitHub API.
 * Esta función devuelve la información necesaria para crear el issue manualmente
 * o vía gh CLI.
 */
export async function createAutomationIssue(
  title: string,
  body: string,
  repo = `${ENV.githubOwner}/omega-max-duck`
): Promise<{ ok: boolean; issueNumber?: number; error?: string }> {
  // MCP hub actualmente soporta listar issues/PRs. Para crear issues
  // se recomienda usar gh CLI directamente o extender el MCP hub.
  try {
    const { spawn } = await import("child_process");
    const proc = spawn("gh.exe", ["issue", "create", "--repo", repo, "--title", title, "--body", body], {
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    proc.stdout.on("data", (c) => (stdout += c.toString()));
    await new Promise<void>((resolve, reject) => {
      proc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`gh exit code ${code}`))));
      proc.on("error", reject);
    });
    const match = stdout.match(/https:\/\/github\.com\/[^/]+\/[^/]+\/issues\/(\d+)/);
    return {
      ok: true,
      issueNumber: match ? parseInt(match[1], 10) : undefined,
    };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "unknown gh error" };
  }
}

/**
 * Verifica que GitHub CLI esté autenticado.
 */
export async function githubHealthCheck(): Promise<{ ok: boolean; error?: string }> {
  try {
    const result = await githubListIssues(ENV.githubOwner + "/belentani-hub", 1);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "github check failed" };
  }
}

/**
 * Obtiene información del proyecto de Google Cloud asociado.
 * Útil para verificar facturación y APIs habilitadas.
 */
export async function gcloudProjectInfo(projectId = ENV.googleProjectId) {
  const result = await mcpGcloudProjects();
  if (!result.ok) {
    return { ok: false, error: result.error };
  }
  const projects = result.data as Array<{ projectId: string; name: string; lifecycleState: string }>;
  const project = projects.find((p) => p.projectId === projectId);
  return { ok: true, project };
}
