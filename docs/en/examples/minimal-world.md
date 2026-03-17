# Minimal Subagent Example

This page replaces the older world example with a minimal subagent topology that matches the current clawgo model more closely.

## Goal

Quickly verify that:

- `main` can dispatch work
- `coder` can execute as a subagent
- runtime artifacts are persisted
- the final result returns to the main session

## Minimal Config

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
        "system_prompt_file": "agents/coder/AGENT.md",
        "tools": {
          "allowlist": ["filesystem", "shell", "sessions"]
        },
        "runtime": {
          "provider": "openai",
          "max_parallel_runs": 1
        }
      }
    }
  }
}
```

## Start

```bash
clawgo agent -m "Implement a minimal health endpoint and let coder handle it"
```

## Expected Artifacts

After execution, the main files to inspect are:

- `subagent_runs.jsonl`
- `subagent_events.jsonl`
- `threads.jsonl`
- `agent_messages.jsonl`

These are typically stored under:

```text
~/.clawgo/workspace/agents/runtime/
```

## Expected Behavior

- `main` receives the request
- the router decides whether to dispatch to `coder`
- `coder` executes the task
- internal collaboration is written into thread and message stores
- the final result comes back to the main channel

## Next Steps

From this minimal example, you can extend it with:

- `tester`
- a remote node branch
- stricter `accept_from` / `can_talk_to`
- `subagent_profile` driven role templates
