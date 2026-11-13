# DUCK ECOSYSTEM — Canonical Architecture

> The machine that makes independent creative systems behave as one ecosystem without erasing their identity.

## 1. Prime directive

Duck Ecosystem is an integration/runtime layer, not a repository merger.

Original repositories remain authoritative. The ecosystem references them through manifests and adapters.

**REFERENCE, DON'T REPLACE.**

## 2. Canonical flow

```text
ACTOR
  ↓
INTENT
  ↓
CONTEXT / MEMORY
  ↓
PLAN
  ↓
CAPABILITY DISCOVERY
  ↓
POLICY / PERMISSION
  ↓
APPROVAL (when required)
  ↓
ADAPTER
  ↓
REAL | SIMULATED | PLANNED
  ↓
ACTION
  ↓
EVENT
  ↓
PROVENANCE
  ↓
STATE / MEMORY
  ↓
RESULT
```

## 3. Planes

### Control Plane
Identity, registry, policy, permissions, health, configuration and orchestration.

### Creative Plane
Studio, projects, tracks, stems, versions, comments, analysis, mastering, delivery and client experience.

### Intelligence Plane
Duck Omega, AION, agents, model routing, planning and analysis.

### Local Plane
Windows workstation, DAW, plugins, local files, local models and device capabilities.

### Experience Plane
ZION, Gema, visual identity, portals and presentation layers.

### Evidence Plane
Events, audit, provenance, validation, truth status and reproducibility.

## 4. Canonical entities

Actor, Identity, Intent, Plan, Capability, System, Adapter, Project, Track, Stem, Asset, Version, Comment, Task, Client, Agent, Action, Approval, Event, Evidence, Provenance, Policy, Credential and Environment.

## 5. Modes

- `real`: the adapter can perform or verify the operation.
- `simulated`: the system can demonstrate the operation but does not claim external execution.
- `planned`: capability is designed but not yet implemented.
- `unknown`: capability has not been verified.

Never upgrade a state without evidence.

## 6. Truth model

Every important system claim should carry one of:

`OBSERVED` · `VERIFIED` · `INFERRED` · `SIMULATED` · `PROPOSED` · `UNKNOWN`

## 7. Integration rule

A new system enters the ecosystem through a manifest and adapter. It does not get rewritten merely to fit the ecosystem.

Minimum adapter responsibilities:

- identify system
- expose capabilities
- declare mode
- declare permissions
- expose health
- translate canonical actions
- emit canonical events
- preserve source provenance
- fail safely

## 8. Failure model

Prefer an explicit unavailable state over a fabricated success.

```text
NO ADAPTER → SIMULATE
NO EVIDENCE → UNKNOWN
NO PERMISSION → BLOCK
EXECUTION ERROR → FAILED EVENT
AMBIGUOUS INTENT → REQUEST CLARIFICATION
```

## 9. Canonical demo

The first complete vertical slice is:

`prepare_track_for_duck`

It should demonstrate discovery of a project, loading context, version/stem inspection, analysis planning, approval, execution or simulation, event emission and a provenance-backed result.

## 10. Future tools

Claude, Codex, OpenHands, local agents, AION or other automation systems are clients of the ecosystem contract. They must not create parallel truths or bypass policy merely because they have direct repository access.
