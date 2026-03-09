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

One especially important recent skill under `skills/` is:

- `spec-coding`

It provides:

- `scripts/init.sh`
- `templates/spec.md`
- `templates/tasks.md`
- `templates/checklist.md`

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

## Spec Files In The Active Coding Project

Recent non-trivial coding work can also maintain these files in the current coding project root:

- `spec.md`
- `tasks.md`
- `checklist.md`

These are not meant to live permanently in `~/.clawgo/workspace/`, and they are no longer kept as repo-root docs inside ClawGo itself.

Typical source:

- `workspace/skills/spec-coding/templates/*`

In practice:

- `workspace/skills/spec-coding/templates/` is the template source
- `spec.md`, `tasks.md`, and `checklist.md` in the active coding project are runtime collaboration artifacts
