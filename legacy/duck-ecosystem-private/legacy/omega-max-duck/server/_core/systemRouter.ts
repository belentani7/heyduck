import { z } from "zod";
import { notifyOwner, notifyOwnerDualChannel } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";
import {
  mcpGcloudProjects,
  mcpGeminiGenerate,
  mcpGmailList,
  mcpDriveList,
  mcpGithubIssues,
  mcpOpenAIChat,
  mcpSunoGenerate,
  mcpColabNotebooks,
} from "./mcpClient";
import { ENV } from "./env";

type McpHealthStatus = {
  name: string;
  ok: boolean;
  error?: string;
};

async function checkMcpTool(
  name: string,
  fn: () => Promise<{ ok: boolean; error?: string; data?: unknown }>
): Promise<McpHealthStatus> {
  try {
    const result = await fn();
    return { name, ok: result.ok, error: result.ok ? undefined : result.error };
  } catch (error) {
    return {
      name,
      ok: false,
      error: error instanceof Error ? error.message : "unknown error",
    };
  }
}

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  notifyOwnerDual: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const result = await notifyOwnerDualChannel(input);
      return {
        forge: result.forge,
        gmail: result.gmail,
        delivered: result.forge || result.gmail,
      } as const;
    }),

  mcpHealth: publicProcedure.query(async () => {
    const checks: McpHealthStatus[] = [];

    // Google Cloud
    checks.push(
      await checkMcpTool("gcloud_projects", async () => {
        const r = await mcpGcloudProjects();
        return { ok: r.ok, error: r.error, data: r.data };
      })
    );

    // Gemini
    checks.push(
      await checkMcpTool("google_gemini_generate", async () => {
        const r = await mcpGeminiGenerate("Di solo: OK", "gemini-2.0-flash");
        return { ok: r.ok, error: r.error, data: r.data };
      })
    );

    // Gmail
    checks.push(
      await checkMcpTool("google_gmail_list", async () => {
        const r = await mcpGmailList(1);
        return { ok: r.ok, error: r.error, data: r.data };
      })
    );

    // Drive
    checks.push(
      await checkMcpTool("google_drive_list", async () => {
        const r = await mcpDriveList(undefined, 1);
        return { ok: r.ok, error: r.error, data: r.data };
      })
    );

    // GitHub
    checks.push(
      await checkMcpTool("github_issues", async () => {
        const r = await mcpGithubIssues(`${ENV.githubOwner}/belentani-hub`);
        return { ok: r.ok, error: r.error, data: r.data };
      })
    );

    // OpenAI
    checks.push(
      await checkMcpTool("openai_chat", async () => {
        const r = await mcpOpenAIChat("Di solo: OK", "gpt-4o-mini");
        return { ok: r.ok, error: r.error, data: r.data };
      })
    );

    // Suno
    checks.push(
      await checkMcpTool("suno_generate", async () => {
        const r = await mcpSunoGenerate("Test MCP", "pop", "energético");
        return { ok: r.ok, error: r.error, data: r.data };
      })
    );

    // Colab
    checks.push(
      await checkMcpTool("google_colab_notebooks", async () => {
        const r = await mcpColabNotebooks(1);
        return { ok: r.ok, error: r.error, data: r.data };
      })
    );

    const allOk = checks.every((c) => c.ok);
    return {
      allOk,
      total: checks.length,
      passing: checks.filter((c) => c.ok).length,
      failing: checks.filter((c) => !c.ok).length,
      checks,
    };
  }),

  mcpProviders: publicProcedure.query(() => {
    return {
      gemini: Boolean(ENV.geminiApiKey || ENV.googleApplicationCredentials),
      openai: Boolean(ENV.openaiApiKey),
      forge: Boolean(ENV.forgeApiKey),
      github: Boolean(ENV.githubToken),
      suno: Boolean(ENV.sunoApiKey),
      linkedin: Boolean(ENV.linkedinAccessToken),
      distrokid: Boolean(ENV.distrokidApiKey),
      googleDrive: Boolean(ENV.googleApplicationCredentials),
      gmail: Boolean(ENV.googleApplicationCredentials),
    };
  }),
});
