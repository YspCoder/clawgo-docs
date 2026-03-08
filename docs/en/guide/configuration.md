# Configuration

## Config File Location

Default config file:

```text
~/.clawgo/config.json
```

In debug mode, it switches to:

```text
.clawgo/config.json
```

Load strategy:

- start from `DefaultConfig()`
- read JSON
- use strict decoding, so unknown fields fail
- apply environment variable overrides for fields with `env` tags

## Top-Level Structure

The top-level `Config` includes:

- `agents`
- `channels`
- `providers`
- `gateway`
- `cron`
- `tools`
- `logging`
- `sentinel`
- `memory`

## agents

### `agents.defaults`

Global defaults that shape runtime behavior.

Important fields:

- `workspace`
- `proxy`
- `proxy_fallbacks`
- `max_tokens`
- `temperature`
- `max_tool_iterations`
- `heartbeat`
- `context_compaction`
- `execution`
- `summary_policy`

### `context_compaction`

- `enabled`
- `mode`
- `trigger_messages`
- `keep_recent_messages`
- `max_summary_chars`
- `max_transcript_chars`

Supported `mode` values:

- `summary`
- `responses_compact`
- `hybrid`

If you use `responses_compact`, the active provider must declare `supports_responses_compact: true`.

### `execution`

- `run_state_ttl_seconds`
- `run_state_max`
- `tool_parallel_safe_names`
- `tool_max_parallel_calls`

This controls tool concurrency and runtime state retention.

## `agents.router`

The router supports keyword-based dispatch from the main agent.

Important fields:

- `enabled`
- `main_agent_id`
- `strategy`
- `policy.intent_max_input_chars`
- `policy.max_rounds_without_user`
- `rules`
- `allow_direct_agent_chat`
- `max_hops`
- `default_timeout_sec`
- `default_wait_reply`
- `sticky_thread_owner`

Supported `strategy` values:

- `rules_first`
- `round_robin`
- `manual`

## `agents.subagents`

Each subagent is an independently declared item.

Common fields:

- `enabled`
- `type`
- `transport`
- `node_id`
- `parent_agent_id`
- `notify_main_policy`
- `display_name`
- `role`
- `system_prompt`
- `system_prompt_file`
- `memory_namespace`
- `accept_from`
- `can_talk_to`
- `tools.allowlist`
- `tools.denylist`
- `runtime.*`

Notes:

- enabled local subagents should normally define `system_prompt_file`
- node-backed branches require `transport: "node"`, `node_id`, and `parent_agent_id`

## channels

Supported channel configs:

- `telegram`
- `discord`
- `feishu`
- `dingtalk`
- `whatsapp`
- `qq`
- `maixcam`

Shared dedupe settings:

- `inbound_message_id_dedupe_ttl_seconds`
- `inbound_content_dedupe_window_seconds`
- `outbound_dedupe_window_seconds`

## `tools.mcp`

Fields:

- `enabled`
- `request_timeout_sec`
- `servers`

Per-server fields:

- `enabled`
- `transport`
- `command`
- `args`
- `env`
- `working_dir`
- `description`
- `package`

The current implementation only supports:

```text
transport = "stdio"
```

See [MCP Integration](/en/guide/mcp) for details.

## providers

Structured as:

- `providers.proxy`
- `providers.proxies.<name>`

Fields:

- `api_key`
- `api_base`
- `models`
- `supports_responses_compact`
- `auth`
- `timeout_sec`
- `responses`

## gateway

- `host`
- `port`
- `token`

Default port is `18790`.

## `tools.mcp`

The MCP entry point is `tools.mcp`.

Top-level fields:

- `enabled`
- `request_timeout_sec`
- `servers`

Common per-server fields:

- `enabled`
- `transport`
- `command`
- `args`
- `url`
- `env`
- `working_dir`
- `permission`
- `description`
- `package`

Supported `transport` values:

- `stdio`
- `http`
- `streamable_http`
- `sse`

Rules:

- `stdio` requires `command`
- `http`, `streamable_http`, and `sse` require `url`
- `permission` must be `workspace` or `full`
- with `permission: "workspace"`, `working_dir` may be relative but must resolve inside the workspace
- with `permission: "full"`, `working_dir` may be absolute

See [MCP Integration](/en/guide/mcp) for the full guide.

## Validation

Run:

```bash
clawgo config check
```

The validator checks:

- numeric bounds
- provider existence
- fallback validity
- router rules referencing existing agents
- required credentials for enabled channels
- compatibility of `responses_compact`
