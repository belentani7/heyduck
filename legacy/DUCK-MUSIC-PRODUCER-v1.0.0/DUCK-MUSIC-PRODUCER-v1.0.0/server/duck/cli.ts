#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { createAudio, createAutomation, createCalendar, createClient, createDaw, createFinance, createProject, createProtocol, createQc, createTask, completeTask, events, listEntity, qcSummary, runChain } from "./service";
import type { DuckEntityType } from "./contracts";

const [, , command, resource, argument] = process.argv;
const payload = async () => argument?.startsWith("@") ? JSON.parse(await readFile(argument.slice(1), "utf8")) : JSON.parse(argument ?? "{}");

async function main() {
  if (command === "list" && resource) return console.log(JSON.stringify(await listEntity(resource as DuckEntityType), null, 2));
  if (command === "events") return console.log(JSON.stringify(await events(Number(resource ?? 100)), null, 2));
  if (command === "qc") return console.log(JSON.stringify(await qcSummary(resource), null, 2));
  if (command === "chain") {
    const input = await payload();
    return console.log(JSON.stringify(await runChain(resource, String(input.projectId), Array.isArray(input.assetIds) ? input.assetIds : []), null, 2));
  }
  if (command === "complete-task") return console.log(JSON.stringify(await completeTask(resource), null, 2));
  if (command === "create" && resource) {
    const input = await payload();
    const creators = { calendar: createCalendar, clients: createClient, projects: createProject, tasks: createTask, automations: createAutomation, qc: createQc, finance: createFinance, audio: createAudio, daw: createDaw, protocol: createProtocol } as const;
    const creator = creators[resource as keyof typeof creators];
    if (!creator) throw new Error(`unknown resource: ${resource}`);
    return console.log(JSON.stringify(await creator(input as never), null, 2));
  }
  throw new Error("Usage: pnpm duck create <resource> '<json>' | list <resource> | chain <chain-id> '<json>' | complete-task <id> | qc [project-id] | events [limit]");
}

main().catch((error) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
