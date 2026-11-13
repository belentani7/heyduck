import express from "express";
import { DuckCalendarInput, duckEntityTypes } from "./contracts";
import { createAudio, createAutomation, createCalendar, createClient, createDaw, createFinance, createProject, createProtocol, createQc, createTask, completeTask, enqueueJob, events, getEntity, listEntity, qcSummary, runChain, updateEntity } from "./service";
import { DuckAudioInput, DuckAutomationInput, DuckClientInput, DuckDawInput, DuckFinanceInput, DuckJobInput, DuckProjectInput, DuckProtocolInput, DuckQcInput, DuckTaskInput } from "./contracts";

const creators = {
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
  jobs: DuckJobInput,
} as const;

export function createDuckRouter() {
  const router = express.Router();
  router.use(express.json({ limit: "2mb" }));
  router.get("/health", (_req, res) => res.json({ ok: true, service: "duck-studio-os", protocol: { archetype: "Judas", state: "stable" } }));
  router.get("/events", async (req, res) => res.json(await events(Number(req.query.limit ?? 100))));
  router.get("/qc/summary", async (req, res) => res.json(await qcSummary(typeof req.query.projectId === "string" ? req.query.projectId : undefined)));
  router.post("/chains/:chainId/run", async (req, res) => {
    try { return res.status(202).json(await runChain(req.params.chainId, String(req.body.projectId), Array.isArray(req.body.assetIds) ? req.body.assetIds : [])); }
    catch (error) { return res.status(400).json({ error: error instanceof Error ? error.message : String(error) }); }
  });
  router.post("/tasks/:id/complete", async (req, res) => {
    try { return res.json(await completeTask(req.params.id)); }
    catch (error) { return res.status(404).json({ error: error instanceof Error ? error.message : String(error) }); }
  });
  for (const type of duckEntityTypes) {
    router.get(`/${type}`, async (_req, res) => res.json(await listEntity(type)));
    router.get(`/${type}/:id`, async (req, res) => {
      try { return res.json(await getEntity(type, req.params.id)); }
      catch { return res.status(404).json({ error: "record not found" }); }
    });
    if (type in creators) {
      router.post(`/${type}`, async (req, res) => {
        try {
          const input = creators[type as keyof typeof creators].parse(req.body);
          const record = type === "calendar" ? await createCalendar(input as never) : type === "clients" ? await createClient(input as never) : type === "projects" ? await createProject(input as never) : type === "tasks" ? await createTask(input as never) : type === "automations" ? await createAutomation(input as never) : type === "qc" ? await createQc(input as never) : type === "finance" ? await createFinance(input as never) : type === "audio" ? await createAudio(input as never) : type === "daw" ? await createDaw(input as never) : type === "protocol" ? await createProtocol(input as never) : await enqueueJob(input as never);
          return res.status(201).json(record);
        } catch (error) { return res.status(400).json({ error: error instanceof Error ? error.message : String(error) }); }
      });
    }
    router.patch(`/${type}/:id`, async (req, res) => {
      try { return res.json(await updateEntity(type, req.params.id, req.body)); }
      catch (error) { return res.status(404).json({ error: error instanceof Error ? error.message : String(error) }); }
    });
  }
  return router;
}
