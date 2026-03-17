# Workspace Layout

## Default Root

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

## `workspace/`

Default workspace:

```text
~/.clawgo/workspace
```

Seeded templates include:

- `AGENTS.md`
- `BOOT.md`
- `MEMORY.md`
- `TOOLS.md`
- `HEARTBEAT.md`
- `skills/`
- `memory/`

## `workspace/agents/runtime/`

This is the most important runtime directory. Common files:

- `subagent_runs.jsonl`
- `subagent_events.jsonl`
- `threads.jsonl`
- `agent_messages.jsonl`

## `workspace/memory/`

Common files:

- `heartbeat.log`
- `skill-audit.jsonl`
- `nodes-dispatch-audit.jsonl`
- `process-sessions.json`

## `sessions/`

Session indexes and history live under:

```text
~/.clawgo/sessions/
```

`sessions.json` is the metadata index.

## Template Directory vs Runtime Directory

Inside the repo:

```text
/Users/lpf/Desktop/project/clawgo/workspace
```

is the template source.

At runtime, the active workspace is usually:

```text
~/.clawgo/workspace
```
