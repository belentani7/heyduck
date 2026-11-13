import { processNextJob } from "./service";

const once = process.argv.includes("--once");
const intervalMs = Number(process.env.DUCK_WORKER_INTERVAL_MS ?? 5000);

async function tick() {
  const result = await processNextJob();
  if (result) console.log(JSON.stringify({ event: "duck.job.complete", ...result, at: new Date().toISOString() }));
}

async function main() {
  await tick();
  if (once) return;
  setInterval(() => void tick().catch((error) => console.error(JSON.stringify({ event: "duck.job.error", message: error instanceof Error ? error.message : String(error), at: new Date().toISOString() }))), intervalMs);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
