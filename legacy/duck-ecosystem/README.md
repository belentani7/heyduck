# DUCK ECOSYSTEM

> **One machine. Many original systems. Nothing gets erased.**

Duck Ecosystem is the integration layer that gives the existing Duck / Zion / Studio / Gema / local / AI projects a common operating model without replacing their original repositories.

## The core idea

```text
                         DUCK ECOSYSTEM
                              │
             ┌────────────────┼────────────────┐
             │                │                │
        EXPERIENCE        ORCHESTRATOR      MEMORY
             │                │                │
     ┌───────┼───────┐        │         ┌──────┴──────┐
     │       │       │        │         │             │
   STUDIO   ZION    GEMA   EVENT BUS   PROJECTS    KNOWLEDGE
     │       │       │        │         │             │
     └───────┴───────┴────────┴─────────┴─────────────┘
                              │
                    ORIGINAL REPOSITORIES
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
    duck-full-studio    DUCK-ZION-PREMIUM   Duck Studio OS
          │                   │                   │
       originals            originals           originals

        NO REPOSITORY IS MOVED, DELETED OR REWRITTEN.
        THE ECOSYSTEM ADDS A COMMON CONTROL PLANE.
```

## What this repository is

This repository is **not another replacement for the existing projects**. It is the **machine above them**.

It provides:

- a canonical registry of existing systems;
- capability discovery;
- normalized projects, assets, agents and actions;
- an event bus;
- adapters/simulators for systems that cannot yet be connected directly;
- provenance, source-repository references and non-destructive integration;
- an orchestration layer capable of turning a creative intention into a chain of actions;
- a browser-based control surface that demonstrates the ecosystem even before every adapter is live.

## The important distinction

There are three states for an integration:

1. **REAL** — connected to an actual system/API/local process.
2. **SIMULATED** — the same contract works, but the action is represented by a safe simulator.
3. **PLANNED** — capability is declared but no adapter exists yet.

The ecosystem never pretends that a simulation is a real integration.

## Initial canonical domains

| Domain | Meaning |
|---|---|
| `studio` | production, projects, stems, versions, QC |
| `zion` | narrative/interface/experience layer |
| `gema` | premium toolkit and creative instruments |
| `local` | local producer workstation / knowledge / plugins |
| `ai` | models, prompts, agents and reasoning services |
| `workforce` | orchestrated agent/action layer |
| `memory` | provenance, decisions, assets and project state |
| `portal` | clients, collaboration and delivery |

## First machine

The first executable concept is deliberately small: an **Ecosystem Engine** receives an intention such as:

> `prepare a new track for Duck`

and resolves it through:

```text
INTENTION
  ↓
CAPABILITIES
  ↓
PROJECT CONTEXT
  ↓
PLAN
  ↓
ADAPTERS
  ↓
EVENTS
  ↓
STATE / AUDIT
```

If an adapter is unavailable, the engine can use a simulator while preserving the exact intended action and its provenance.

## Non-destructive rule

Original repositories remain authoritative for their own source code. This repository stores **references and integration metadata**, not copied source code by default.

Example:

```json
{
  "id": "duck-studio-pro",
  "source": {
    "repository": "belentani7/duck-full-studio-pro",
    "preserveOriginal": true
  },
  "integration": {
    "mode": "simulated"
  }
}
```

## Current known source systems

The registry intentionally references existing work rather than absorbing it:

- `belentani7/duck-full-studio-pro`
- `belentani7/DUCK-ZION-PREMIUM`
- `belentani7/duck-ecosystem` (this repository)
- `belentani7/duck-studio-os-protected`
- `belentani7/DUCK-ZION-GITHUB`
- `belentani7/duck-zion-studio`
- `belentani7/DUCK-A-GEMA-1-LAB`
- `belentani7/DUCK-STUDIO-LOCAL-WIN11`
- `belentani7/duck-omega`
- `belentani7/belentani_Omega`
- `belentani7/08-AION-WORKFORCE`
- `belentani7/nexus-aion-enterprise`
- `belentani7/nexus-workforce-enterprise`
- `belentani7/NOIACORE`

Some names may represent experiments, packaging repositories or historical states. The registry is designed to make that explicit rather than silently merging them.

## Roadmap

### Phase 1 — Integration map
- registry
- canonical IDs
- capabilities
- provenance
- simulator

### Phase 2 — Working machine
- event bus
- orchestrator
- project memory
- adapter contract
- browser control surface

### Phase 3 — Real adapters
- Duck Studio
- local workstation
- storage
- DAW bridge
- AI providers

### Phase 4 — Autonomous creative workflows
- intent → plan → execution
- human approval gates
- audit trail
- reusable agent chains

### Phase 5 — Ecosystem

The ecosystem becomes the common operating layer while the original projects remain independently usable.

---

## Principle

> **Do not merge the projects by destroying their differences. Merge them by giving them a language they can all speak.**
