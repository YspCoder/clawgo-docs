# Quick Start

## Set The Right Expectation First

ClawGo is now better understood as a **World Runtime** than as a plain CLI chat tool.

Its core capabilities include:

- maintaining long-running world state and NPC state
- processing world events through `main`
- letting `agent` and `npc` actors cooperate in one runtime
- persisting execution records, provider runtime, and world snapshots together

## Installation

### Option 1: Install Script

```bash
curl -fsSL https://clawgo.dev/install.sh | bash
```

Install a specific variant:

```bash
curl -fsSL https://clawgo.dev/install.sh | bash -s -- --variant telegram
```

Current major variants include:

- `full`
- `none`
- `telegram`
- `discord`
- `feishu`
- `maixcam`
- `qq`
- `dingtalk`
- `whatsapp`

### Option 2: Build From Source

```bash
git clone https://github.com/YspCoder/clawgo.git
cd clawgo
make build
```

## Onboarding

Run this once:

```bash
clawgo onboard
```

It will:

- create `~/.clawgo/config.json`
- create `~/.clawgo/workspace`
- generate `gateway.token`
- copy the built-in workspace template

## Minimal Working Config

The real config center now lives in `agents.agents` and `models.providers`.

A minimal example:

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
        "default_goals": ["patrol the square"]
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
  }
}
```

This means:

- the default model comes from `agents.defaults.model.primary`
- actors and NPCs live under `agents.agents`
- providers are declared under `models.providers`

## Configure A Provider

Interactive setup:

```bash
clawgo provider
```

Recent multi-provider behavior is also more practical now:

- the primary provider is derived from `agents.defaults.model.primary`
- even without an explicit fallback list, the runtime can infer candidates from declared providers
- maintain an explicit fallback order only when you need strict control

## Start The Runtime

### Interactive Mode

```bash
clawgo agent
```

One-shot message:

```bash
clawgo agent -m "I walk to the gate and inspect what the guard is doing"
```

### Gateway Mode

```bash
clawgo gateway run
```

This starts the fuller runtime surface:

- Gateway API
- runtime snapshot and runtime live
- channels
- cron
- sentinel

## WebUI

The WebUI is now intended to be deployed separately. Frontend repository:

- [YspCoder/clawgo-web](https://github.com/YspCoder/clawgo-web)

The frontend should call Gateway `/api/*` with `gateway.token`, for example:

```text
https://<your-webui-host>?token=<gateway.token>
```

## First Validation

Start with:

```bash
clawgo status
clawgo config check
```

If you want to verify that the world runtime is actually active, also check:

- `~/.clawgo/workspace/agents/runtime/world_state.json`
- `~/.clawgo/workspace/agents/runtime/npc_state.json`
- `~/.clawgo/workspace/agents/runtime/world_events.jsonl`

## A Better First Prompt For The Current Model

Try this:

```bash
clawgo agent -m "I enter the square, inspect the guard and merchant, and summarize the current world snapshot"
```

That validates:

- world event ingestion
- world-level decision making by `main`
- NPC intent plus rendered output
- world store persistence
