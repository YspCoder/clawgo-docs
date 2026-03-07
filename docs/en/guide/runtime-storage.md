# Runtime, Storage, and Recovery

## Persistence Is A Core Capability

ClawGo is clearly built for long-running behavior, so persistence is central rather than optional.

The codebase and README emphasize files such as:

- `subagent_runs.jsonl`
- `subagent_events.jsonl`
- `threads.jsonl`
- `agent_messages.jsonl`

Together with sessions, memory, and logs, these form the runtime record.

## Sessions

`pkg/session/manager.go` manages session history. CLI `agent` mode and WebUI Chat both depend on it.

The default CLI session key is:

```text
cli:default
```

## Memory

Current memory-related tools include:

- `memory_search`
- `memory_get`
- `memory_write`

The config also supports layered memory:

- `profile`
- `project`
- `procedures`

## Heartbeat

Heartbeat logs are written to:

```text
workspace/memory/heartbeat.log
```

`clawgo status` reads and summarizes them.

## Trigger and Skill Audit

Examples:

- `workspace/memory/trigger-audit.jsonl`
- `workspace/memory/trigger-stats.json`
- `workspace/memory/skill-audit.jsonl`

Those are used by status reporting and observability.

## Context Compaction

For long sessions, the runtime supports context compaction:

- compress once message count passes a threshold
- keep recent messages
- summarize or compact older context

That is one of the reasons the system is more suitable for long-running sessions.
