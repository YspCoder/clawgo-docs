# Runtime, Storage, and Recovery

## Persistence Is Now Centered On The World Runtime

In the current codebase, persistence is no longer primarily about the older `subagent_runs.jsonl` and `subagent_events.jsonl` wording. It is centered on:

```text
workspace/agents/runtime/
```

That directory now stores world state, NPC state, and actor runtime records together.

## World Store

The core world-store files are:

- `world_state.json`
- `npc_state.json`
- `world_events.jsonl`

They represent:

- `world_state.json`: structured world state such as locations, entities, quests, and clock
- `npc_state.json`: current NPC state, location, goals, beliefs, and related data
- `world_events.jsonl`: append-only world event audit

Together they determine whether the world can resume after restart.

## Agent Runtime Store

The same directory also stores actor runtime records:

- `agent_runs.jsonl`
- `agent_events.jsonl`
- `agent_messages.jsonl`

These are used for:

- per-run input, output, and status
- runtime events, errors, and retries
- inter-actor message collaboration

The runtime snapshot model is now unified around:

- `tasks`
- `runs`
- `events`
- `world`

So execution records and world state now show up in the same observability view.

## Sessions And Workspace Are A Separate Layer

Outside `workspace/agents/runtime/`, the system still keeps:

- `~/.clawgo/sessions/`
- `~/.clawgo/logs/`
- `~/.clawgo/cron/`
- `workspace/memory/`

Those are used for:

- CLI and session history
- gateway logs
- cron jobs
- heartbeat, skill audit, node audit, and trigger audit

## Why This Refactor Matters

Recovery is no longer just about restoring a chat transcript. It is about restoring:

- world state
- NPC state
- active tasks and runtime events
- inter-actor message traces

That is what makes ClawGo much closer to a long-running simulation runtime.

## Runtime Snapshot

Recent APIs and the WebUI consume a unified snapshot through:

- `GET /api/runtime`
- `GET /api/runtime/live`

The `world` payload includes data such as:

- `npc_count`
- `active_npcs`
- location occupancy
- recent world events

That is the basis for the world overview in the standalone WebUI.

## Provider Runtime Persists Too

In addition to the world/runtime core, provider runtime can persist:

- OAuth account state
- candidate order
- most recent successful provider
- runtime history

That part is mainly controlled by `models.providers.<name>.runtime_*`.

## `workspace/memory` Still Matters

Common files under `workspace/memory/` include:

- `heartbeat.log`
- `trigger-audit.jsonl`
- `trigger-stats.json`
- `skill-audit.jsonl`
- `nodes-audit.jsonl`
- `nodes-state.json`
- `nodes-dispatch-audit.jsonl`

So the world/runtime directory is the execution core, while `memory/` is more about audit and operational observability.

## Where To Check First During Recovery Issues

Start with:

1. `workspace/agents/runtime/world_state.json`
2. `workspace/agents/runtime/npc_state.json`
3. `workspace/agents/runtime/world_events.jsonl`
4. `workspace/agents/runtime/agent_runs.jsonl`
5. `workspace/agents/runtime/agent_events.jsonl`

If those files are not advancing, common causes are:

- the runtime never entered the world loop
- actors were not scheduled successfully
- provider setup or config validation failed early
