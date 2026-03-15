# Minimal World Example

This is not a test fixture. It is a minimal runnable example meant to verify:

- `main` is acting as the world mind
- an `npc` can participate in the world runtime
- world state is persisted
- the WebUI and API can read the world snapshot

## Minimal Config

```json
{
  "agents": {
    "defaults": {
      "workspace": "~/.clawgo/workspace",
      "model": {
        "primary": "openai/gpt-5.4"
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
        "default_goals": ["patrol the square", "observe visitors"],
        "perception_scope": 1,
        "world_tags": ["security", "starter"]
      }
    }
  },
  "models": {
    "providers": {
      "openai": {
        "api_key": "YOUR_KEY",
        "api_base": "https://api.openai.com/v1",
        "models": ["gpt-5.4"],
        "auth": "bearer",
        "timeout_sec": 90
      }
    }
  },
  "gateway": {
    "host": "0.0.0.0",
    "port": 18790,
    "token": "YOUR_GATEWAY_TOKEN"
  }
}
```

## Matching Prompt

The minimum requirement is:

- `agents/main/AGENT.md` exists

If you want more stable early results, the `main` prompt should at least state:

- user input should be treated as a world event first
- world-state changes should be described clearly
- NPC intent and final world truth should not be conflated

## Start The Runtime

```bash
clawgo gateway run
```

Or interact directly:

```bash
clawgo agent -m "I walk to the gate and inspect what the guard is doing"
```

## Expected Files

After the first successful run, you should see:

```text
~/.clawgo/workspace/agents/runtime/world_state.json
~/.clawgo/workspace/agents/runtime/npc_state.json
~/.clawgo/workspace/agents/runtime/world_events.jsonl
```

## What The World Snapshot Usually Looks Like

A compact world snapshot may look like:

```json
{
  "world_id": "main-world",
  "tick": 3,
  "npc_count": 1,
  "active_npcs": ["guard"]
}
```

This is not the full payload, only the most visible fields.

## Inspect Through The API

### Runtime Snapshot

```bash
curl -H 'Authorization: Bearer YOUR_GATEWAY_TOKEN' \
  http://127.0.0.1:18790/api/runtime
```

The first websocket frame includes a payload like:

```json
{
  "ok": true,
  "type": "runtime_snapshot",
  "snapshot": {
    "version": {
      "gateway_version": "dev",
      "webui_version": "dev",
      "compiled_channels": ["telegram"]
    },
    "config": {
      "core": {
        "main_agent_id": "main",
        "agents": {
          "main": {
            "enabled": true,
            "role": "orchestrator",
            "prompt": "agents/main/AGENT.md"
          }
        }
      }
    },
    "world": {
      "world_id": "main-world",
      "tick": 3,
      "npc_count": 1,
      "active_npcs": ["guard"]
    }
  }
}
```

### World View Only

```bash
curl -H 'Authorization: Bearer YOUR_GATEWAY_TOKEN' \
  'http://127.0.0.1:18790/api/world?limit=20'
```

Common shape:

```json
{
  "found": true,
  "world": {
    "world_id": "main-world",
    "tick": 3,
    "npc_count": 1,
    "active_npcs": ["guard"]
  }
}
```

## Recommended First Prompt

```text
I enter the square, inspect the guard, and summarize the current world snapshot
```

That validates:

- user input becoming a world event
- `main` performing world-level summarization
- `npc` participation in the runtime
- incremental changes in `world_state.json`

## Natural Next Steps

From this minimal world, the most natural expansions are:

- a second NPC such as `merchant`
- an entity such as `gate` or `quest_board`
- a quest
- a remote node branch

That is the easiest path from a minimal demo to a real small world.
