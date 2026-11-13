#!/usr/bin/env node

// server/duck/cli.ts
import { readFile as readFile2 } from "node:fs/promises";

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
async function createRecord(type, data, status = "active") {
  await ensure(type);
  const timestamp = now();
  const record = { id: randomUUID(), type, status, createdAt: timestamp, updatedAt: timestamp, data, attempts: type === "jobs" ? 0 : void 0, maxAttempts: type === "jobs" ? 3 : void 0 };
  await writeFile(recordPath(type, record.id), JSON.stringify(record, null, 2));
  await appendEvent({ type: "created", entityType: type, entityId: record.id, payload: data });
  return record;
}
async function getRecord(type, id) {
  return JSON.parse(await readFile(recordPath(type, id), "utf8"));
}
async function listRecords(type) {
  await ensure(type);
  const names = (await readdir(path.join(root, type))).filter((name) => name.endsWith(".json"));
  return Promise.all(names.map((name) => readFile(path.join(root, type, name), "utf8").then((value) => JSON.parse(value))));
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
async function listEvents(limit = 100) {
  await ensure();
  try {
    const lines = (await readFile(eventPath(), "utf8")).trim().split("\n").filter(Boolean);
    return lines.slice(-limit).map((line) => JSON.parse(line));
  } catch {
    return [];
  }
}

// server/duck/service.ts
async function createClient(input) {
  return createRecord("clients", input);
}
async function createProject(input) {
  return createRecord("projects", input);
}
async function createTask(input) {
  return createRecord("tasks", input);
}
async function createAutomation(input) {
  return createRecord("automations", input);
}
async function createQc(input) {
  return createRecord("qc", input, input.passed ? "completed" : "active");
}
async function createFinance(input) {
  return createRecord("finance", input);
}
async function createCalendar(input) {
  return createRecord("calendar", input);
}
async function createAudio(input) {
  return createRecord("audio", input);
}
async function createDaw(input) {
  return createRecord("daw", input, input.available ? "active" : "blocked");
}
async function createProtocol(input) {
  return createRecord("protocol", input, input.state === "blocked" ? "blocked" : "active");
}
async function listEntity(type) {
  return listRecords(type);
}
async function events(limit = 100) {
  return listEvents(limit);
}
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
async function completeTask(taskId) {
  const task = await updateRecord("tasks", taskId, { status: "completed" });
  await appendEvent({ type: "task.completed", entityType: "tasks", entityId: taskId, payload: { projectId: task.data.projectId } });
  return task;
}
async function qcSummary(projectId) {
  const records = await listRecords("qc");
  const filtered = projectId ? records.filter((record) => record.data.projectId === projectId) : records;
  return { total: filtered.length, passed: filtered.filter((record) => record.status === "completed").length, failed: filtered.filter((record) => record.status === "blocked").length, pending: filtered.filter((record) => record.status === "active").length };
}

// server/duck/cli.ts
var [, , command, resource, argument] = process.argv;
var payload = async () => argument?.startsWith("@") ? JSON.parse(await readFile2(argument.slice(1), "utf8")) : JSON.parse(argument ?? "{}");
async function main() {
  if (command === "list" && resource) return console.debug(JSON.stringify(await listEntity(resource), null, 2));
  if (command === "events") return console.debug(JSON.stringify(await events(Number(resource ?? 100)), null, 2));
  if (command === "qc") return console.debug(JSON.stringify(await qcSummary(resource), null, 2));
  if (command === "chain") {
    const input = await payload();
    return console.debug(JSON.stringify(await runChain(resource, String(input.projectId), Array.isArray(input.assetIds) ? input.assetIds : []), null, 2));
  }
  if (command === "complete-task") return console.debug(JSON.stringify(await completeTask(resource), null, 2));
  if (command === "create" && resource) {
    const input = await payload();
    const creators = { calendar: createCalendar, clients: createClient, projects: createProject, tasks: createTask, automations: createAutomation, qc: createQc, finance: createFinance, audio: createAudio, daw: createDaw, protocol: createProtocol };
    const creator = creators[resource];
    if (!creator) throw new Error(`unknown resource: ${resource}`);
    return console.debug(JSON.stringify(await creator(input), null, 2));
  }
  throw new Error("Usage: pnpm duck create <resource> '<json>' | list <resource> | chain <chain-id> '<json>' | complete-task <id> | qc [project-id] | events [limit]");
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
