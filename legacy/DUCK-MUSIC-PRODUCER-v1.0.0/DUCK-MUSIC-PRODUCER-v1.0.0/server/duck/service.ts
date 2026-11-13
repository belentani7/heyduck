import { randomUUID } from "node:crypto";
import { appendEvent, claimJob, createRecord, getRecord, listEvents, listRecords, updateRecord } from "./store";
import type { DuckAudioInput, DuckCalendarInput, DuckChain, DuckClientInput, DuckDawInput, DuckFinanceInput, DuckEntityType, DuckJobInput, DuckProjectInput, DuckQcInput, DuckProtocolInput, DuckTaskInput, DuckAutomationInput } from "./contracts";

export async function createClient(input: DuckClientInput) { return createRecord("clients", input); }
export async function createProject(input: DuckProjectInput) { return createRecord("projects", input); }
export async function createTask(input: DuckTaskInput) { return createRecord("tasks", input); }
export async function createAutomation(input: DuckAutomationInput) { return createRecord("automations", input); }
export async function createQc(input: DuckQcInput) { return createRecord("qc", input, input.passed ? "completed" : "active"); }
export async function createFinance(input: DuckFinanceInput) { return createRecord("finance", input); }
export async function createCalendar(input: DuckCalendarInput) { return createRecord("calendar", input); }
export async function createAudio(input: DuckAudioInput) { return createRecord("audio", input); }
export async function createDaw(input: DuckDawInput) { return createRecord("daw", input, input.available ? "active" : "blocked"); }
export async function createProtocol(input: DuckProtocolInput) { return createRecord("protocol", input, input.state === "blocked" ? "blocked" : "active"); }
export async function enqueueJob(input: DuckJobInput) { return createRecord("jobs", input); }

export async function updateEntity(type: DuckEntityType, id: string, patch: { status?: "active" | "paused" | "completed" | "archived" | "blocked"; data?: Record<string, unknown> }) {
  return updateRecord(type, id, patch);
}

export async function listEntity(type: DuckEntityType) { return listRecords(type); }
export async function getEntity(type: DuckEntityType, id: string) { return getRecord(type, id); }
export async function events(limit = 100) { return listEvents(limit); }

export const defaultChains: DuckChain[] = [
  { id: "mastering-clean", name: "Mastering Clean", steps: ["gain_stage", "eq", "compression", "stereo", "limiter", "export"], status: "ready" },
  { id: "mix-vocal", name: "Mix Vocal", steps: ["gain_stage", "eq", "compression", "saturation", "stereo", "export"], status: "ready" },
  { id: "delivery-stems", name: "Delivery Stems", steps: ["gain_stage", "export"], status: "ready" },
];

export async function runChain(chainId: string, projectId: string, assetIds: string[] = []) {
  const chain = defaultChains.find((candidate) => candidate.id === chainId);
  if (!chain) throw new Error(`unknown chain: ${chainId}`);
  const runId = randomUUID();
  await appendEvent({ type: "chain.started", entityType: "projects", entityId: projectId, payload: { runId, chainId, assetIds, steps: chain.steps } });
  await appendEvent({ type: "chain.completed", entityType: "projects", entityId: projectId, payload: { runId, chainId, output: `data/duck/runs/${runId}`, steps: chain.steps } });
  return { runId, chain, projectId, assetIds, status: "completed" as const };
}

export async function processNextJob(workerId = `duck-worker-${randomUUID()}`) {
  const leaseMs = Number(process.env.DUCK_JOB_LEASE_MS ?? 30_000);
  const heartbeatMs = Math.max(250, Math.floor(leaseMs / 3));
  const job = await claimJob(workerId, leaseMs);
  if (!job) return null;
  const input = job.data as unknown as DuckJobInput;
  const heartbeat = setInterval(() => {
    void getRecord("jobs", job.id).then((current) => {
      if (current.workerId === workerId && current.status === "paused") {
        const at = new Date().toISOString();
        return updateRecord("jobs", job.id, { heartbeatAt: at, leaseUntil: new Date(Date.now() + leaseMs).toISOString() });
      }
      return undefined;
    }).catch(() => undefined);
  }, heartbeatMs);
  try {
    const result = input.action === "run_chain" && input.projectId && input.chainId ? await runChain(input.chainId, input.projectId, input.assetIds) : input.action === "complete_task" && input.taskId ? await completeTask(input.taskId) : { status: "completed", action: input.action };
    clearInterval(heartbeat);
    await updateRecord("jobs", job.id, { status: "completed", data: { result }, leaseUntil: undefined, heartbeatAt: new Date().toISOString() });
    await appendEvent({ type: "job.completed", entityType: "jobs", entityId: job.id, payload: { action: input.action, attempts: job.attempts, workerId } });
    return { jobId: job.id, result, attempts: job.attempts };
  } catch (error) {
    clearInterval(heartbeat);
    const terminal = (job.attempts ?? 1) >= (job.maxAttempts ?? 3);
    await updateRecord("jobs", job.id, { status: terminal ? "blocked" : "active", data: { error: error instanceof Error ? error.message : String(error) }, leaseUntil: undefined, heartbeatAt: new Date().toISOString() });
    await appendEvent({ type: terminal ? "job.failed" : "job.retrying", entityType: "jobs", entityId: job.id, payload: { error: error instanceof Error ? error.message : String(error), attempts: job.attempts, workerId } });
    throw error;
  }
}

export async function completeTask(taskId: string) {
  const task = await updateRecord("tasks", taskId, { status: "completed" });
  await appendEvent({ type: "task.completed", entityType: "tasks", entityId: taskId, payload: { projectId: task.data.projectId } });
  return task;
}

export async function qcSummary(projectId?: string) {
  const records = await listRecords("qc");
  const filtered = projectId ? records.filter((record) => record.data.projectId === projectId) : records;
  return { total: filtered.length, passed: filtered.filter((record) => record.status === "completed").length, failed: filtered.filter((record) => record.status === "blocked").length, pending: filtered.filter((record) => record.status === "active").length };
}
