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

## `workspace/`

Default workspace:

```text
~/.clawgo/workspace
```

Seeded template contents typically include:

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

## `workspace/agents/runtime/`

This is now the most important runtime directory.

The world runtime and actor runtime currently persist:

- `world_state.json`
- `npc_state.json`
- `world_events.jsonl`
- `agent_runs.jsonl`
- `agent_events.jsonl`
- `agent_messages.jsonl`

Meaning:

- `world_state.json` stores structured world state
- `npc_state.json` stores NPC state
- `world_events.jsonl` stores the world event stream
- `agent_runs.jsonl` and `agent_events.jsonl` store actor runtime records
- `agent_messages.jsonl` stores actor-to-actor messages

## `workspace/memory/`

This is the audit and observability directory. Common files include:

- `heartbeat.log`
- `trigger-audit.jsonl`
- `trigger-stats.json`
- `skill-audit.jsonl`
- `nodes-audit.jsonl`
- `nodes-state.json`
- `nodes-dispatch-audit.jsonl`

## `sessions/`

Session indexes and history live under:

```text
~/.clawgo/sessions/
```

This is more about CLI and session history than world persistence itself.

## `logs/`

Default log path:

```text
~/.clawgo/logs/clawgo.log
```

## `cron/`

Cron storage file:

```text
~/.clawgo/cron/jobs.json
```

## `skills/`

One especially important template skill under `workspace/skills/` is:

- `spec-coding`

It provides:

- `scripts/init.sh`
- `templates/spec.md`
- `templates/tasks.md`
- `templates/checklist.md`

## Spec Files In The Active Coding Project

Recent non-trivial coding work may create these files in the active coding project root:

- `spec.md`
- `tasks.md`
- `checklist.md`

These are runtime collaboration artifacts, not permanent files in `~/.clawgo/workspace/`.

## Template Directories vs Runtime Directories

Inside the repo:

```text
/Users/lpf/Desktop/project/clawgo/workspace
```

is the template source.

At runtime, the actual working directory is usually:

```text
~/.clawgo/workspace
```

During release builds, templates are also synced into:

```text
cmd/workspace
```

for embedding.
