# Quick Start

## The Current Recommended Path

According to the current README, the shortest path is:

1. install `clawgo`
2. run `clawgo onboard`
3. choose a provider and model
4. start `agent` mode or `gateway run`

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/YspCoder/clawgo/main/install.sh | bash
```

## Initialize

```bash
clawgo onboard
```

It will:

- create the default config
- initialize the workspace
- generate `gateway.token`

## Choose A Provider And Model

The current README path is:

```bash
clawgo provider list
clawgo provider use openai/gpt-5.4
clawgo provider configure
```

For OAuth-backed providers such as `codex`, `anthropic`, `antigravity`, `gemini`, `kimi`, and `qwen`:

```bash
clawgo provider login codex
clawgo provider login codex --manual
```

If the same provider has both an API key and OAuth accounts, `auth: "hybrid"` is the recommended setup.

## Start

Interactive mode:

```bash
clawgo agent
clawgo agent -m "Hello"
```

Gateway mode:

```bash
clawgo gateway run
```

Development mode:

```bash
make dev
```

## WebUI Access

According to the current README, the WebUI is accessed through Gateway directly:

```text
http://<host>:<port>/?token=<gateway.token>
```

That is also the default assumption used in this docs set.

## Minimal Config Mental Model

The real config center is now:

- `agents.defaults`
- `agents.router`
- `agents.communication`
- `agents.subagents`
- `models.providers`

not the earlier `agents.agents` wording.

## A Minimal Subagent Topology

```json
{
  "agents": {
    "router": {
      "enabled": true,
      "main_agent_id": "main",
      "strategy": "rules_first",
      "rules": []
    },
    "subagents": {
      "main": {
        "enabled": true,
        "type": "router",
        "role": "orchestrator",
        "system_prompt_file": "agents/main/AGENT.md"
      },
      "coder": {
        "enabled": true,
        "type": "worker",
        "role": "code",
        "system_prompt_file": "agents/coder/AGENT.md"
      }
    }
  }
}
```

## First Validation

Start with:

```bash
clawgo status
clawgo config check
```

Then verify that these runtime files begin to appear:

- `subagent_runs.jsonl`
- `subagent_events.jsonl`
- `threads.jsonl`
- `agent_messages.jsonl`

## A Better First Prompt For The Current Runtime

```bash
clawgo agent -m "Implement a new endpoint and let coder and tester split the work"
```

That is closer to the current runtime model:

- `main` dispatches
- a `subagent` executes
- internal messages stay separate
- the result comes back to the main session
