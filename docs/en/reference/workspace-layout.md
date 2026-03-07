# Workspace Layout

This page answers two practical questions:

1. where ClawGo writes files by default
2. which directories are templates and which are runtime outputs

## Default Root

Normal mode:

```text
~/.clawgo
```

Typical contents:

- `config.json`
- `workspace/`
- `logs/`
- `cron/`
- `sessions/`
- `gateway.pid`

## Workspace

Default workspace:

```text
~/.clawgo/workspace
```

Typical seeded contents include:

- `AGENTS.md`
- `BOOT.md`
- `BOOTSTRAP.md`
- `IDENTITY.md`
- `MEMORY.md`
- `SOUL.md`
- `TOOLS.md`
- `USER.md`
- `HEARTBEAT.md`
- `memory/`
- `skills/`

## Runtime Files

Common runtime files include:

- `workspace/memory/heartbeat.log`
- `workspace/memory/trigger-audit.jsonl`
- `workspace/memory/skill-audit.jsonl`
- `workspace/memory/nodes-state.json`
- `subagent_runs.jsonl`
- `subagent_events.jsonl`
- `threads.jsonl`
- `agent_messages.jsonl`
