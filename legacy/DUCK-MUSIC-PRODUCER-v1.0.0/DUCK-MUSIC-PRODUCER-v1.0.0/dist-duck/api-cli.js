// server/duck/api-cli.ts
import express2 from "express";

// server/duck/api.ts
import express from "express";

// server/duck/contracts.ts
import { z } from "zod";
var duckEntityTypes = ["clients", "projects", "tasks", "automations", "qc", "finance", "calendar", "audio", "daw", "protocol", "jobs"];
var DuckStatus = z.enum(["active", "paused", "completed", "archived", "blocked"]);
var DuckClientInput = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  company: z.string().optional(),
  notes: z.string().optional()
});
var DuckProjectInput = z.object({
  name: z.string().min(1),
  clientId: z.string().optional(),
  type: z.enum(["music", "creative", "campaign", "release", "other"]).default("music"),
  deadline: z.string().optional(),
  budgetCents: z.number().int().nonnegative().default(0),
  notes: z.string().optional()
});
var DuckTaskInput = z.object({
  projectId: z.string(),
  title: z.string().min(1),
  category: z.enum(["production", "mixing", "mastering", "vocal", "visual", "admin", "qc", "other"]).default("other"),
  dueAt: z.string().optional(),
  assignee: z.string().optional()
});
var DuckAutomationInput = z.object({
  name: z.string().min(1),
  trigger: z.enum(["manual", "project.created", "task.completed", "qc.failed", "deadline.near", "schedule"]),
  action: z.enum(["create_task", "run_chain", "notify", "create_invoice", "export_report", "sync_daw"]),
  enabled: z.boolean().default(true),
  config: z.record(z.string(), z.unknown()).default({})
});
var DuckJobInput = z.object({
  action: z.enum(["run_chain", "complete_task", "notify", "export_report"]),
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  chainId: z.string().optional(),
  assetIds: z.array(z.string()).default([]),
  payload: z.record(z.string(), z.unknown()).default({})
});
var DuckQcInput = z.object({
  projectId: z.string(),
  category: z.enum(["technical", "mix", "master", "vocal", "metadata", "delivery"]),
  item: z.string().min(1),
  passed: z.boolean().default(false),
  note: z.string().optional()
});
var DuckCalendarInput = z.object({
  projectId: z.string().optional(),
  title: z.string().min(1),
  kind: z.enum(["deadline", "session", "task", "invoice", "release"]).default("task"),
  startsAt: z.string(),
  endsAt: z.string().optional(),
  notes: z.string().optional()
});
var DuckFinanceInput = z.object({
  projectId: z.string().optional(),
  kind: z.enum(["income", "expense", "invoice"]),
  description: z.string().min(1),
  amountCents: z.number().int(),
  currency: z.string().length(3).default("EUR"),
  dueAt: z.string().optional()
});
var DuckAudioInput = z.object({
  projectId: z.string(),
  assetPath: z.string().min(1),
  kind: z.enum(["track", "stem", "mix", "master", "voice", "video"]),
  durationMs: z.number().int().nonnegative().optional(),
  sampleRate: z.number().int().positive().optional(),
  loudnessLufs: z.number().optional(),
  notes: z.string().optional()
});
var DuckDawInput = z.object({
  daw: z.enum(["ableton", "logic", "pro-tools", "fl-studio", "cubase", "reaper", "studio-one"]),
  capability: z.enum(["open", "export", "render", "markers", "stems", "metadata"]),
  available: z.boolean().default(false),
  detail: z.string().optional()
});
var DuckProtocolInput = z.object({
  archetype: z.enum(["Judas", "Pedro", "Marcos", "Santos", "Belentani", "The Body Human"]),
  jewel: z.enum(["truth", "memory", "perception", "creation", "evolution"]),
  state: z.enum(["observing", "transmitting", "integrating", "stable", "blocked"]).default("observing"),
  payload: z.record(z.string(), z.unknown()).default({})
});

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
async function enqueueJob(input) {
  return createRecord("jobs", input);
}
async function updateEntity(type, id, patch) {
  return updateRecord(type, id, patch);
}
async function listEntity(type) {
  return listRecords(type);
}
async function getEntity(type, id) {
  return getRecord(type, id);
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

// server/duck/api.ts
var creators = {
  calendar: DuckCalendarInput,
  clients: DuckClientInput,
  projects: DuckProjectInput,
  tasks: DuckTaskInput,
  automations: DuckAutomationInput,
  qc: DuckQcInput,
  finance: DuckFinanceInput,
  audio: DuckAudioInput,
  daw: DuckDawInput,
  protocol: DuckProtocolInput,
  jobs: DuckJobInput
};
function createDuckRouter() {
  const router = express.Router();
  router.use(express.json({ limit: "2mb" }));
  router.get("/health", (_req, res) => res.json({ ok: true, service: "duck-studio-os", protocol: { archetype: "Judas", state: "stable" } }));
  router.get("/events", async (req, res) => res.json(await events(Number(req.query.limit ?? 100))));
  router.get("/qc/summary", async (req, res) => res.json(await qcSummary(typeof req.query.projectId === "string" ? req.query.projectId : void 0)));
  router.post("/chains/:chainId/run", async (req, res) => {
    try {
      return res.status(202).json(await runChain(req.params.chainId, String(req.body.projectId), Array.isArray(req.body.assetIds) ? req.body.assetIds : []));
    } catch (error) {
      return res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
    }
  });
  router.post("/tasks/:id/complete", async (req, res) => {
    try {
      return res.json(await completeTask(req.params.id));
    } catch (error) {
      return res.status(404).json({ error: error instanceof Error ? error.message : String(error) });
    }
  });
  for (const type of duckEntityTypes) {
    router.get(`/${type}`, async (_req, res) => res.json(await listEntity(type)));
    router.get(`/${type}/:id`, async (req, res) => {
      try {
        return res.json(await getEntity(type, req.params.id));
      } catch {
        return res.status(404).json({ error: "record not found" });
      }
    });
    if (type in creators) {
      router.post(`/${type}`, async (req, res) => {
        try {
          const input = creators[type].parse(req.body);
          const record = type === "calendar" ? await createCalendar(input) : type === "clients" ? await createClient(input) : type === "projects" ? await createProject(input) : type === "tasks" ? await createTask(input) : type === "automations" ? await createAutomation(input) : type === "qc" ? await createQc(input) : type === "finance" ? await createFinance(input) : type === "audio" ? await createAudio(input) : type === "daw" ? await createDaw(input) : type === "protocol" ? await createProtocol(input) : await enqueueJob(input);
          return res.status(201).json(record);
        } catch (error) {
          return res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
        }
      });
    }
    router.patch(`/${type}/:id`, async (req, res) => {
      try {
        return res.json(await updateEntity(type, req.params.id, req.body));
      } catch (error) {
        return res.status(404).json({ error: error instanceof Error ? error.message : String(error) });
      }
    });
  }
  return router;
}

// server/duck/api-cli.ts
var app = express2();
var port = Number(process.env.DUCK_PORT ?? process.env.PORT ?? 4200);
app.use("/api/duck", createDuckRouter());
var server = app.listen(port, "0.0.0.0", () => {
  console.debug(JSON.stringify({ event: "duck.api.start", service: "duck-music-producer", port, pid: process.pid, at: (/* @__PURE__ */ new Date()).toISOString() }));
});
var shutdown = (signal) => {
  console.debug(JSON.stringify({ event: "duck.api.stop", signal, at: (/* @__PURE__ */ new Date()).toISOString() }));
  server.close(() => process.exit(0));
};
process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
