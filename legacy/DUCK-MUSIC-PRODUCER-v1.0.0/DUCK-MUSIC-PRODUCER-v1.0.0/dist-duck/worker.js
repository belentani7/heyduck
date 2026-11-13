// server/duck/service.ts
import { randomUUID as randomUUID2 } from "node:crypto";

// server/duck/store.ts
import { appendFile, mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
var root = path.resolve(process.env.MANOS_DATA_DIR ?? "data", "duck");
var recordPath = (type, id) => path.join(root, type, `${id}.json`);
var eventPath = () => path.join(root, "events.jsonl");
var now = () => (/* @__PURE__ */ new Date()).toISOString();
async function ensure(type) {
  await mkdir(type ? path.join(root, type) : root, { recursive: true });
}
async function getRecord(type, id) {
  return JSON.parse(await readFile(recordPath(type, id), "utf8"));
}
async function listRecords(type) {
  await ensure(type);
  const names = (await readdir(path.join(root, type))).filter((name) => name.endsWith(".json"));
  return Promise.all(names.map((name) => readFile(path.join(root, type, name), "utf8").then((value) => JSON.parse(value))));
}
async function claimJob(workerId, leaseMs) {
  const jobs = await listRecords("jobs");
  const nowMs = Date.now();
  for (const job of jobs) {
    const expired = job.status === "paused" && job.leaseUntil && Date.parse(job.leaseUntil) <= nowMs;
    if (job.status !== "active" && !expired) continue;
    const lock = path.join(root, "jobs", `${job.id}.claim.lock`);
    let lockCreated = false;
    try {
      await writeFile(lock, workerId, { flag: "wx" });
      lockCreated = true;
      const fresh = await getRecord("jobs", job.id);
      const freshExpired = fresh.status === "paused" && fresh.leaseUntil && Date.parse(fresh.leaseUntil) <= Date.now();
      if (fresh.status !== "active" && !freshExpired) {
        await unlink(lock).catch(() => void 0);
        lockCreated = false;
        continue;
      }
      const claimedAt = now();
      const leaseUntil = new Date(Date.now() + leaseMs).toISOString();
      const updated = await updateRecord("jobs", fresh.id, { status: "paused", workerId, claimedAt, leaseUntil, heartbeatAt: claimedAt, attempts: (fresh.attempts ?? 0) + 1 });
      await unlink(lock).catch(() => void 0);
      lockCreated = false;
      return updated;
    } catch {
      if (lockCreated) await unlink(lock).catch(() => void 0);
    }
  }
  return null;
}
async function updateRecord(type, id, patch) {
  const current = await getRecord(type, id);
  const updated = { ...current, ...patch, data: { ...current.data, ...patch.data ?? {} }, updatedAt: now() };
  await writeFile(recordPath(type, id), JSON.stringify(updated, null, 2));
  await appendEvent({ type: "updated", entityType: type, entityId: id, payload: patch.data ?? { status: patch.status } });
  return updated;
}
async function appendEvent(input) {
  await ensure();
  const event = { id: randomUUID(), at: now(), ...input };
  await appendFile(eventPath(), JSON.stringify(event) + "\n");
  return event;
}

// server/duck/service.ts
var defaultChains = [
  { id: "mastering-clean", name: "Mastering Clean", steps: ["gain_stage", "eq", "compression", "stereo", "limiter", "export"], status: "ready" },
  { id: "mix-vocal", name: "Mix Vocal", steps: ["gain_stage", "eq", "compression", "saturation", "stereo", "export"], status: "ready" },
  { id: "delivery-stems", name: "Delivery Stems", steps: ["gain_stage", "export"], status: "ready" }
];
async function runChain(chainId, projectId, assetIds = []) {
  const chain = defaultChains.find((candidate) => candidate.id === chainId);
  if (!chain) throw new Error(`unknown chain: ${chainId}`);
  const runId = randomUUID2();
  await appendEvent({ type: "chain.started", entityType: "projects", entityId: projectId, payload: { runId, chainId, assetIds, steps: chain.steps } });
  await appendEvent({ type: "chain.completed", entityType: "projects", entityId: projectId, payload: { runId, chainId, output: `data/duck/runs/${runId}`, steps: chain.steps } });
  return { runId, chain, projectId, assetIds, status: "completed" };
}
async function processNextJob(workerId = `duck-worker-${randomUUID2()}`) {
  const leaseMs = Number(process.env.DUCK_JOB_LEASE_MS ?? 3e4);
  const heartbeatMs = Math.max(250, Math.floor(leaseMs / 3));
  const job = await claimJob(workerId, leaseMs);
  if (!job) return null;
  const input = job.data;
  const heartbeat = setInterval(() => {
    void getRecord("jobs", job.id).then((current) => {
      if (current.workerId === workerId && current.status === "paused") {
        const at = (/* @__PURE__ */ new Date()).toISOString();
        return updateRecord("jobs", job.id, { heartbeatAt: at, leaseUntil: new Date(Date.now() + leaseMs).toISOString() });
      }
      return void 0;
    }).catch(() => void 0);
  }, heartbeatMs);
  try {
    const result = input.action === "run_chain" && input.projectId && input.chainId ? await runChain(input.chainId, input.projectId, input.assetIds) : input.action === "complete_task" && input.taskId ? await completeTask(input.taskId) : { status: "completed", action: input.action };
    clearInterval(heartbeat);
    await updateRecord("jobs", job.id, { status: "completed", data: { result }, leaseUntil: void 0, heartbeatAt: (/* @__PURE__ */ new Date()).toISOString() });
    await appendEvent({ type: "job.completed", entityType: "jobs", entityId: job.id, payload: { action: input.action, attempts: job.attempts, workerId } });
    return { jobId: job.id, result, attempts: job.attempts };
  } catch (error) {
    clearInterval(heartbeat);
    const terminal = (job.attempts ?? 1) >= (job.maxAttempts ?? 3);
    await updateRecord("jobs", job.id, { status: terminal ? "blocked" : "active", data: { error: error instanceof Error ? error.message : String(error) }, leaseUntil: void 0, heartbeatAt: (/* @__PURE__ */ new Date()).toISOString() });
    await appendEvent({ type: terminal ? "job.failed" : "job.retrying", entityType: "jobs", entityId: job.id, payload: { error: error instanceof Error ? error.message : String(error), attempts: job.attempts, workerId } });
    throw error;
  }
}
async function completeTask(taskId) {
  const task = await updateRecord("tasks", taskId, { status: "completed" });
  await appendEvent({ type: "task.completed", entityType: "tasks", entityId: taskId, payload: { projectId: task.data.projectId } });
  return task;
}

// server/duck/worker.ts
var once = process.argv.includes("--once");
var intervalMs = Number(process.env.DUCK_WORKER_INTERVAL_MS ?? 5e3);
async function tick() {
  const result = await processNextJob();
  if (result) console.debug(JSON.stringify({ event: "duck.job.complete", ...result, at: (/* @__PURE__ */ new Date()).toISOString() }));
}
async function main() {
  await tick();
  if (once) return;
  setInterval(() => void tick().catch((error) => console.error(JSON.stringify({ event: "duck.job.error", message: error instanceof Error ? error.message : String(error), at: (/* @__PURE__ */ new Date()).toISOString() }))), intervalMs);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
