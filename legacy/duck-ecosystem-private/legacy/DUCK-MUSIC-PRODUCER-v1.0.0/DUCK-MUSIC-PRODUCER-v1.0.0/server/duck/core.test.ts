import express from "express";
import { describe, expect, it } from "vitest";
import { createDuckRouter } from "./api";
import { claimJob, listRecords, updateRecord } from "./store";
import { createCalendar, createProject, createQc, createTask, completeTask, enqueueJob, processNextJob, runChain } from "./service";

async function retireOtherJobs(exceptId: string) {
  for (const candidate of await listRecords("jobs")) {
    if (candidate.id !== exceptId && candidate.status !== "completed") await updateRecord("jobs", candidate.id, { status: "completed", leaseUntil: undefined, workerId: undefined });
  }
}

describe("DUCK STUDIO OS operational core", () => {
  it("persists a project workflow, completes QC/task state, and emits chain events", async () => {
    const project = await createProject({ name: `duck-test-${Date.now()}`, type: "music", budgetCents: 10000 });
    const calendar = await createCalendar({ projectId: project.id, title: "Release deadline", kind: "deadline", startsAt: "2030-01-01T12:00:00Z" });
    const task = await createTask({ projectId: project.id, title: "Master final", category: "mastering" });
    const qc = await createQc({ projectId: project.id, category: "master", item: "Integrated loudness checked", passed: true });
    const completed = await completeTask(task.id);
    const chain = await runChain("mastering-clean", project.id, ["master-asset"]);
    expect(calendar.data.kind).toBe("deadline");
    expect(completed.status).toBe("completed");
    expect(qc.status).toBe("completed");
    expect(chain.status).toBe("completed");
  });

  it("processes a durable chain job through the independent DUCK worker", async () => {
    const project = await createProject({ name: `duck-job-${Date.now()}`, type: "release", budgetCents: 0 });
    const job = await enqueueJob({ action: "run_chain", projectId: project.id, chainId: "delivery-stems", assetIds: ["stem-1"] });
    await retireOtherJobs(job.id);
    const processed = await processNextJob();
    expect(processed?.jobId).toBe(job.id);
    expect(processed?.result).toMatchObject({ status: "completed", projectId: project.id });
  });

  it("reclaims an expired lease with a new worker and records ownership", async () => {
    const project = await createProject({ name: `duck-recovery-${Date.now()}`, type: "release", budgetCents: 0 });
    const job = await enqueueJob({ action: "run_chain", projectId: project.id, chainId: "delivery-stems", assetIds: ["recovery-stem"] });
    await retireOtherJobs(job.id);
    await updateRecord("jobs", job.id, { status: "paused", workerId: "dead-worker", claimedAt: new Date(Date.now() - 5000).toISOString(), leaseUntil: new Date(Date.now() - 1000).toISOString(), heartbeatAt: new Date(Date.now() - 5000).toISOString(), attempts: 1 });
    const recovered = await processNextJob("recovery-worker");
    expect(recovered?.jobId).toBe(job.id);
    expect(recovered?.attempts).toBe(2);
    const events = await (await import("./service")).events(50);
    expect(events.some((event) => event.type === "job.completed" && event.payload.workerId === "recovery-worker")).toBe(true);
  });

  it("allows only one concurrent worker to claim a job", async () => {
    const raceJob = await enqueueJob({ action: "notify", payload: { race: true } });
    await retireOtherJobs(raceJob.id);
    const [first, second] = await Promise.all([claimJob("race-worker-a", 30_000), claimJob("race-worker-b", 30_000)]);
    expect([first, second].filter(Boolean)).toHaveLength(1);
    const winner = first ?? second;
    expect(["race-worker-a", "race-worker-b"]).toContain(winner?.workerId);
  });

  it("serves the standalone DUCK API without a frontend", async () => {
    const app = express();
    app.use("/api/duck", createDuckRouter());
    const server = await new Promise<ReturnType<typeof app.listen>>((resolve) => {
      const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
    });
    try {
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("duck API did not start");
      const base = `http://127.0.0.1:${address.port}/api/duck`;
      const created = await fetch(`${base}/projects`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: `api-duck-${Date.now()}`, type: "creative", budgetCents: 0 }) });
      expect(created.status).toBe(201);
      const project = await created.json();
      const health = await fetch(`${base}/health`);
      expect((await health.json()).service).toBe("duck-studio-os");
      const projects = await fetch(`${base}/projects`);
      expect((await projects.json()).some((item: { id: string }) => item.id === project.id)).toBe(true);
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });
});
