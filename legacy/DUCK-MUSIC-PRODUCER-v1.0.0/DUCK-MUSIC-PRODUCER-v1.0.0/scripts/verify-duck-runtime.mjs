import { spawn } from "node:child_process";

const port = process.env.DUCK_VERIFY_PORT ?? "4212";
const dataDir = process.env.MANOS_DATA_DIR ?? "/tmp/duck-runtime-verification";
const child = spawn(process.execPath, ["dist-duck/api-cli.js"], {
  cwd: process.cwd(),
  env: { ...process.env, DUCK_PORT: port, MANOS_DATA_DIR: dataDir },
  stdio: ["ignore", "pipe", "pipe"]
});
let output = "";
child.stdout.on("data", (chunk) => { output += chunk; process.stdout.write(chunk); });
child.stderr.on("data", (chunk) => { output += chunk; process.stderr.write(chunk); });
const stop = () => { if (!child.killed) child.kill("SIGTERM"); };
try {
  let response;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { response = await fetch(`http://127.0.0.1:${port}/api/duck/health`); if (response.ok) break; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (!response?.ok) throw new Error(`DUCK health failed on port ${port}`);
  const body = await response.json();
  if (body.service !== "duck-studio-os") throw new Error(`Unexpected service: ${JSON.stringify(body)}`);
  console.debug(JSON.stringify({ verification: "duck-runtime", port: Number(port), health: body }));
} finally {
  stop();
  await new Promise((resolve) => child.once("exit", resolve));
}
if (!output.includes('"event":"duck.api.start"')) throw new Error("DUCK API start event was not observed");
