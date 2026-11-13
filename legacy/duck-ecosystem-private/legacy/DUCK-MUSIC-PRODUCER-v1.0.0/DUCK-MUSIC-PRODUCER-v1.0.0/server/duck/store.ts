import { appendFile, mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { DuckEntityType, DuckEvent, DuckRecord, DuckStatus } from "./contracts";

const root = path.resolve(process.env.MANOS_DATA_DIR ?? "data", "duck");
const recordPath = (type: DuckEntityType, id: string) => path.join(root, type, `${id}.json`);
const eventPath = () => path.join(root, "events.jsonl");
const now = () => new Date().toISOString();

async function ensure(type?: DuckEntityType) {
  await mkdir(type ? path.join(root, type) : root, { recursive: true });
}

export async function createRecord(type: DuckEntityType, data: Record<string, unknown>, status: DuckStatus = "active") {
  await ensure(type);
  const timestamp = now();
  const record: DuckRecord = { id: randomUUID(), type, status, createdAt: timestamp, updatedAt: timestamp, data, attempts: type === "jobs" ? 0 : undefined, maxAttempts: type === "jobs" ? 3 : undefined };
  await writeFile(recordPath(type, record.id), JSON.stringify(record, null, 2));
  await appendEvent({ type: "created", entityType: type, entityId: record.id, payload: data });
  return record;
}

export async function getRecord(type: DuckEntityType, id: string) {
  return JSON.parse(await readFile(recordPath(type, id), "utf8")) as DuckRecord;
}

export async function listRecords(type: DuckEntityType) {
  await ensure(type);
  const names = (await readdir(path.join(root, type))).filter((name) => name.endsWith(".json"));
  return Promise.all(names.map((name) => readFile(path.join(root, type, name), "utf8").then((value) => JSON.parse(value) as DuckRecord)));
}

export async function claimJob(workerId: string, leaseMs: number) {
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
      if (fresh.status !== "active" && !freshExpired) { await unlink(lock).catch(() => undefined); lockCreated = false; continue; }
      const claimedAt = now();
      const leaseUntil = new Date(Date.now() + leaseMs).toISOString();
      const updated = await updateRecord("jobs", fresh.id, { status: "paused", workerId, claimedAt, leaseUntil, heartbeatAt: claimedAt, attempts: (fresh.attempts ?? 0) + 1 });
      await unlink(lock).catch(() => undefined);
      lockCreated = false;
      return updated;
    } catch {
      if (lockCreated) await unlink(lock).catch(() => undefined);
    }
  }
  return null;
}

export async function updateRecord(type: DuckEntityType, id: string, patch: Partial<Pick<DuckRecord, "status" | "data" | "attempts" | "maxAttempts" | "leaseUntil" | "heartbeatAt" | "workerId" | "claimedAt">>) {
  const current = await getRecord(type, id);
  const updated: DuckRecord = { ...current, ...patch, data: { ...current.data, ...(patch.data ?? {}) }, updatedAt: now() };
  await writeFile(recordPath(type, id), JSON.stringify(updated, null, 2));
  await appendEvent({ type: "updated", entityType: type, entityId: id, payload: patch.data ?? { status: patch.status } });
  return updated;
}

export async function appendEvent(input: Omit<DuckEvent, "id" | "at">) {
  await ensure();
  const event: DuckEvent = { id: randomUUID(), at: now(), ...input };
  await appendFile(eventPath(), JSON.stringify(event) + "\n");
  return event;
}

export async function listEvents(limit = 100) {
  await ensure();
  try {
    const lines = (await readFile(eventPath(), "utf8")).trim().split("\n").filter(Boolean);
    return lines.slice(-limit).map((line) => JSON.parse(line) as DuckEvent);
  } catch {
    return [];
  }
}

export function duckDataRoot() {
  return root;
}
