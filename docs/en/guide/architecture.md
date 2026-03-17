# Architecture

## The Current Core Model

ClawGo is currently best described as an **Agent Runtime**, not as a world runtime.

Default collaboration flow:

```text
user -> main -> worker -> main -> user
```

The main objects to understand are:

- `main agent`
- `subagents`
- `runtime store`

## Four Runtime Layers

The current system can be understood in four layers:

1. Entry layer
   CLI, Gateway, WebUI, cron, and channels
2. Orchestration layer
   `main agent`, router, session planner, and message bus
3. Execution layer
   local subagents, tools, skills, and MCP
4. Persistence and observability layer
   subagent runs, events, threads, messages, sessions, logs, memory, and task audit

## `main agent`

`main` is responsible for:

- user entry
- routing and dispatch
- subtask merge
- final response assembly

It is the coordination center of the runtime, not just a static system prompt.

## `subagents`

Local subagents are declared in `config.json -> agents.subagents`.

Each subagent can define:

- `role`
- `display_name`
- `system_prompt_file`
- `memory_namespace`
- `tools.allowlist`
- `runtime.provider`

Typical roles are still:

- `main`
- `coder`
- `tester`

## Router and Planner

Routing is handled by `agents.router`, with fields such as:

- `main_agent_id`
- `strategy`
- `rules`
- `max_hops`
- `default_timeout_sec`

The planner can split suitable user requests into multiple execution units and hand them to the subagent runtime.

## Runtime Store

The core persisted artifacts are:

- `subagent_runs.jsonl`
- `subagent_events.jsonl`
- `threads.jsonl`
- `agent_messages.jsonl`

These files preserve execution state, internal messaging, and recovery points, not just chat text.

## The Current Role Of The WebUI

The WebUI is focused on inspection and management of:

- Dashboard
- agent topology
- config viewing
- OAuth accounts and provider runtime
- logs and memory

The README currently stresses two things:

- WebUI is for inspection, status, and account management
- the canonical path for runtime configuration is still file-driven

## What Was Removed Recently

Recent cleanup removed several legacy surfaces. The most important docs-level changes are:

- `runtime_control` has been removed
- the public task-runtime control surface has been reduced
- the older node runtime surface is no longer part of the default upstream product

The resulting mental model is simpler:

- configuration through `config.json`
- role prompts through `AGENT.md`
- execution through `main + subagents`
- observability through WebUI, logs, memory, and audit
