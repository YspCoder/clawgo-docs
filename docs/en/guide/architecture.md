# Architecture

## High-Level Layers

ClawGo can be understood in four layers:

1. Entry layer
   CLI, Gateway HTTP, WebUI, cron, and external channels
2. Agent runtime layer
   `AgentLoop`, router, session planner, message bus, and subagent manager
3. Execution capability layer
   tools, skills, nodes, browser, shell, memory, and filesystem
4. Persistence and observability layer
   sessions, threads, messages, jsonl audit logs, logs, EKG, and task audit

## Main Entry

The entrypoint is `cmd/clawgo/main.go`. Top-level commands include:

- `onboard`
- `agent`
- `gateway`
- `status`
- `provider`
- `config`
- `cron`
- `channel`
- `skills`
- `uninstall`

`agent` is direct local interaction. `gateway run` starts the fuller runtime.

## AgentLoop

`pkg/agent/loop.go` contains `AgentLoop`, the core runtime loop. Its responsibilities include:

- managing the active provider and fallback providers
- maintaining the session manager
- registering built-in tools
- building model context
- processing user, system, and internal messages
- coordinating subagent execution and runtime state access
- maintaining EKG and trigger audit

## Task Planning

`pkg/agent/session_planner.go` can split one user request into multiple tasks and run them concurrently.

Typical triggers:

- numbered or bulleted lists
- strong separators such as semicolons

Each planned task gets:

- its own derived resource keys
- its own call into `processMessage`
- optional progress publication back into the system

## Subagent Model

Subagents are configured in `agents.subagents`. They can be:

- local workers
- local routers
- remote node-backed branches

Important fields include:

- `type`
- `transport`
- `node_id`
- `parent_agent_id`
- `notify_main_policy`
- `system_prompt_file`
- `memory_namespace`
- `accept_from`
- `can_talk_to`
- `tools.allowlist`
- `runtime.*`

## Messages and Threads

Agent collaboration is not just plain string forwarding. It uses a message and thread model:

- `communication.mode` controls collaboration mode
- `persist_threads` and `persist_messages` control persistence
- each agent message may carry `reply_to`, `correlation_id`, and `requires_reply`

That is why the WebUI can reconstruct topology, internal streams, and task state.

## Gateway and WebUI

`pkg/api/server.go` exposes two broad surfaces:

- node registration and heartbeat endpoints
- WebUI pages and `/webui/api/*` endpoints

It is both the runtime API gateway and the host for the static UI.
