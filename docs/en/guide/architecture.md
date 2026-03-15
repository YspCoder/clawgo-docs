# Architecture

## The Current Core Model

After the recent refactor, ClawGo is better described as a **World Runtime** than as a multi-agent chat orchestrator.

The main flow is:

```text
user -> main(world mind) -> npc/agent intents -> arbitrate -> apply -> render -> user
```

Two differences matter:

- `main` is not just a router, it is the world-level decision entrypoint
- `npc` and `agent` actors produce intents, while the runtime decides what becomes final world state

## Runtime Layers

ClawGo can now be understood in four layers:

1. Entry layer
   CLI, Gateway API, separately deployed WebUI, cron, and external channels
2. World Runtime layer
   world event ingestion, actor scheduling, arbitration, state application, and rendering
3. Capability layer
   tools, skills, MCP, nodes, filesystem, shell, and memory
4. Persistence and observability layer
   world store, agent runtime store, provider runtime, EKG, logs, and audit

## Core Runtime Objects

### `main`

`main` is the world will:

- accepts user input
- dispatches other actors by rule or context
- aggregates intents
- decides which changes become committed world truth

### `agent`

Regular `agent` actors are good for explicit execution roles such as:

- coding
- testing
- external integrations
- remote node branches

They are execution roles with tools and provider/runtime settings.

### `npc`

An `npc` enters the runtime through `kind: "npc"`. NPCs usually carry:

- `persona`
- `home_location`
- `default_goals`
- `perception_scope`
- their own world-decision context

## Core Loop

The README and code now organize around this loop:

1. `ingest`
2. `perceive`
3. `decide`
4. `arbitrate`
5. `apply`
6. `render`

In practice:

- external input becomes a world event first
- actors see only their visible world slice
- actors return decisions or intents
- the runtime arbitrates which intents apply
- world state and NPC state are updated
- the final result is rendered back to users or the frontend

## Config View

The real config surface is now `agents.agents`, not the older `agents.subagents` wording.

A typical shape looks like:

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "codex/gpt-5.4"
      }
    },
    "agents": {
      "main": {
        "enabled": true,
        "type": "agent",
        "role": "orchestrator",
        "prompt_file": "agents/main/AGENT.md"
      },
      "guard": {
        "enabled": true,
        "kind": "npc",
        "persona": "A cautious town guard",
        "home_location": "gate",
        "default_goals": ["patrol the square"]
      },
      "coder": {
        "enabled": true,
        "type": "agent",
        "prompt_file": "agents/coder/AGENT.md"
      }
    }
  }
}
```

## Persistence

The World Runtime persists core state under `workspace/agents/runtime/`:

- `world_state.json`
- `npc_state.json`
- `world_events.jsonl`
- `agent_runs.jsonl`
- `agent_events.jsonl`
- `agent_messages.jsonl`

That means recovery is about more than chat history. It recovers:

- world state
- NPC state
- active runtime records
- inter-actor message traces

## API and WebUI

Gateway exposes the `/api/*` control surface. Important runtime-facing endpoints now include:

- `GET /api/runtime`
- `GET /api/runtime/live`
- `GET /api/config?mode=normalized`
- `POST /api/config?mode=normalized`
- `GET /api/logs/live`

The runtime snapshot also carries a world payload for the standalone WebUI, including:

- NPC count
- active NPC list
- location occupancy
- recent world events

## Why This Is Not A Simple Agent Chat Shell

Because the runtime now has these properties:

- world state and actor state are modeled separately
- intents are separated from final world mutation
- long-running persistence and restart recovery are built in
- runtime snapshot, runtime live, and provider runtime share one observability model
- local actors, NPCs, and remote node branches can participate in the same world topology
