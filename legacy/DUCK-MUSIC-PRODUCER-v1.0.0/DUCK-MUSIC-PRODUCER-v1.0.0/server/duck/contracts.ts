import { z } from "zod";

export const duckEntityTypes = ["clients", "projects", "tasks", "automations", "qc", "finance", "calendar", "audio", "daw", "protocol", "jobs"] as const;
export type DuckEntityType = (typeof duckEntityTypes)[number];

export const DuckStatus = z.enum(["active", "paused", "completed", "archived", "blocked"]);
export type DuckStatus = z.infer<typeof DuckStatus>;

export const DuckClientInput = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
});
export type DuckClientInput = z.infer<typeof DuckClientInput>;

export const DuckProjectInput = z.object({
  name: z.string().min(1),
  clientId: z.string().optional(),
  type: z.enum(["music", "creative", "campaign", "release", "other"]).default("music"),
  deadline: z.string().optional(),
  budgetCents: z.number().int().nonnegative().default(0),
  notes: z.string().optional(),
});
export type DuckProjectInput = z.infer<typeof DuckProjectInput>;

export const DuckTaskInput = z.object({
  projectId: z.string(),
  title: z.string().min(1),
  category: z.enum(["production", "mixing", "mastering", "vocal", "visual", "admin", "qc", "other"]).default("other"),
  dueAt: z.string().optional(),
  assignee: z.string().optional(),
});
export type DuckTaskInput = z.infer<typeof DuckTaskInput>;

export const DuckAutomationInput = z.object({
  name: z.string().min(1),
  trigger: z.enum(["manual", "project.created", "task.completed", "qc.failed", "deadline.near", "schedule"]),
  action: z.enum(["create_task", "run_chain", "notify", "create_invoice", "export_report", "sync_daw"]),
  enabled: z.boolean().default(true),
  config: z.record(z.string(), z.unknown()).default({}),
});
export type DuckAutomationInput = z.infer<typeof DuckAutomationInput>;

export const DuckJobInput = z.object({
  action: z.enum(["run_chain", "complete_task", "notify", "export_report"]),
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  chainId: z.string().optional(),
  assetIds: z.array(z.string()).default([]),
  payload: z.record(z.string(), z.unknown()).default({}),
});
export type DuckJobInput = z.infer<typeof DuckJobInput>;

export const DuckQcInput = z.object({
  projectId: z.string(),
  category: z.enum(["technical", "mix", "master", "vocal", "metadata", "delivery"]),
  item: z.string().min(1),
  passed: z.boolean().default(false),
  note: z.string().optional(),
});
export type DuckQcInput = z.infer<typeof DuckQcInput>;

export const DuckCalendarInput = z.object({
  projectId: z.string().optional(),
  title: z.string().min(1),
  kind: z.enum(["deadline", "session", "task", "invoice", "release"]).default("task"),
  startsAt: z.string(),
  endsAt: z.string().optional(),
  notes: z.string().optional(),
});
export type DuckCalendarInput = z.infer<typeof DuckCalendarInput>;

export const DuckFinanceInput = z.object({
  projectId: z.string().optional(),
  kind: z.enum(["income", "expense", "invoice"]),
  description: z.string().min(1),
  amountCents: z.number().int(),
  currency: z.string().length(3).default("EUR"),
  dueAt: z.string().optional(),
});
export type DuckFinanceInput = z.infer<typeof DuckFinanceInput>;

export const DuckAudioInput = z.object({
  projectId: z.string(),
  assetPath: z.string().min(1),
  kind: z.enum(["track", "stem", "mix", "master", "voice", "video"]),
  durationMs: z.number().int().nonnegative().optional(),
  sampleRate: z.number().int().positive().optional(),
  loudnessLufs: z.number().optional(),
  notes: z.string().optional(),
});
export type DuckAudioInput = z.infer<typeof DuckAudioInput>;

export const DuckDawInput = z.object({
  daw: z.enum(["ableton", "logic", "pro-tools", "fl-studio", "cubase", "reaper", "studio-one"]),
  capability: z.enum(["open", "export", "render", "markers", "stems", "metadata"]),
  available: z.boolean().default(false),
  detail: z.string().optional(),
});
export type DuckDawInput = z.infer<typeof DuckDawInput>;

export const DuckProtocolInput = z.object({
  archetype: z.enum(["Judas", "Pedro", "Marcos", "Santos", "Belentani", "The Body Human"]),
  jewel: z.enum(["truth", "memory", "perception", "creation", "evolution"]),
  state: z.enum(["observing", "transmitting", "integrating", "stable", "blocked"]).default("observing"),
  payload: z.record(z.string(), z.unknown()).default({}),
});
export type DuckProtocolInput = z.infer<typeof DuckProtocolInput>;

export type DuckRecord = {
  id: string;
  type: DuckEntityType;
  status: DuckStatus;
  createdAt: string;
  updatedAt: string;
  data: Record<string, unknown>;
  attempts?: number;
  maxAttempts?: number;
  leaseUntil?: string;
  heartbeatAt?: string;
  workerId?: string;
  claimedAt?: string;
};

export type DuckEvent = {
  id: string;
  at: string;
  type: string;
  entityType: DuckEntityType;
  entityId: string;
  payload: Record<string, unknown>;
};

export type DuckChain = {
  id: string;
  name: string;
  steps: Array<"gain_stage" | "eq" | "compression" | "saturation" | "stereo" | "limiter" | "export">;
  status: "ready" | "running" | "completed" | "failed";
};
