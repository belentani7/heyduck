import { timingSafeEqual } from "node:crypto";
import { spawn } from "node:child_process";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "private, no-store, max-age=0" };
const error = (status: number, code: string) =>
  NextResponse.json({ ok: false, error: code }, { status, headers: noStore });

// Demo reset is deliberately inaccessible in production. No public route may
// delete or replace user data, even when the demo has no login page.
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development" || process.env.ENABLE_DEMO_RESET !== "true") {
    return error(404, "not_found");
  }

  // Explicitly opt-in only for local development; do not trust forwarded host.
  const url = new URL(request.url);
  if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
    return error(403, "local_only");
  }

  const secret = process.env.DEMO_RESET_ADMIN_KEY;
  if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
    return error(503, "reset_not_configured");
  }
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const expected = Buffer.from(secret, "utf8");
  const actual = Buffer.from(token, "utf8");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return error(401, "unauthorized");
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== url.origin) return error(403, "origin_denied");
    } catch {
      return error(403, "origin_denied");
    }
  }

  // Constant executable and arguments: no command input, no shell, no sync
  // blocking of the Next.js worker. Use the local CLI for routine resets.
  const completed = await new Promise<boolean>(resolve => {
    const child = spawn("bun", ["run", "seed"], {
      cwd: process.cwd(),
      shell: false,
      stdio: "ignore",
      timeout: 30_000,
    });
    child.once("error", () => resolve(false));
    child.once("close", code => resolve(code === 0));
  });

  return completed
    ? NextResponse.json({ ok: true, message: "Ambiente de demonstração reiniciado." }, { headers: noStore })
    : error(500, "reset_failed");
}
