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

Recent WebUI and runtime-facing APIs also prefer a unified normalized view:

- `core.default_provider`
- `core.default_model`
- `core.main_agent_id`
- `core.subagents`
- `runtime.router`
- `runtime.providers`

That normalized schema mainly exists to:

- make WebUI config editing more stable
- let remote node views read main-agent and subagent topology without depending on old field layout
- separate core configuration from runtime-oriented settings

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

Provider fallback behavior now has one more practical rule:

- `proxy` still selects the primary provider
- `proxy_fallbacks` is the explicit way to enforce a strict order
- if `proxy_fallbacks` is omitted, the runtime can now infer candidates from declared providers
- that inferred chain is useful when you want several providers available without hand-maintaining every fallback entry

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
- `system_prompt_file`
- `memory_namespace`
- `accept_from`
- `can_talk_to`
- `tools.allowlist`
- `tools.denylist`
- `runtime.*`

Notes:

- enabled subagents should now use `system_prompt_file`
- when required, `system_prompt_file` must be relative and stay inside the workspace
- node-backed branches require `transport: "node"`, `node_id`, and `parent_agent_id`
- the old inline `system_prompt` field should be treated as legacy compatibility only, not as the normal configuration path

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

Examples of channel-specific behavior:

- Telegram supports `streaming`
- Telegram and Feishu support mention constraints in groups
- WhatsApp can use the embedded bridge flow or an explicit `bridge_url`
- MaixCam uses a local host/port service

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
- `runtime_persist`
- `runtime_history_file`
- `runtime_history_max`
- `oauth`
- `responses`

Supported `auth` values:

- `bearer`
- `oauth`
- `hybrid`
- `none`

OAuth-related fields include:

- `provider`
- `network_proxy`
- `credential_file`
- `credential_files`
- `callback_port`
- `client_id`
- `client_secret`
- `auth_url`
- `token_url`
- `redirect_url`
- `scopes`
- `cooldown_sec`
- `refresh_scan_sec`
- `refresh_lead_sec`

Notes:

- `auth=oauth` requires `oauth.provider`
- `auth=hybrid` means API key and OAuth accounts can both participate in provider candidate selection
- `runtime_persist` and `runtime_history_*` retain provider runtime events and candidate-order history
- in multi-provider setups, declared providers can also join the automatic fallback chain even when `proxy_fallbacks` is omitted

## gateway

- `host`
- `port`
- `token`

Default port is `18790`.

### `gateway.nodes.p2p`

The node P2P entry point lives under `gateway.nodes.p2p`.

Fields:

- `enabled`
- `transport`
- `stun_servers`
- `ice_servers`

Supported `transport` values:

- `websocket_tunnel`
- `webrtc`

Rules:

- it is disabled by default and must be enabled explicitly
- `stun_servers` is the legacy-compatible flat list
- `ice_servers` is the preferred structured form with `urls`, `username`, and `credential`
- if any `ice_servers[].urls` entry uses `turn:` or `turns:`, both `username` and `credential` are required

### `gateway.nodes.dispatch`

Node dispatch policy lives under `gateway.nodes.dispatch`.

Fields:

- `prefer_local`
- `prefer_p2p`
- `allow_relay_fallback`
- `action_tags`
- `agent_tags`
- `allow_actions`
- `deny_actions`
- `allow_agents`
- `deny_agents`

These fields control:

- whether local execution should be preferred over remote nodes
- whether relay fallback is allowed when P2P is unavailable
- which node tags are required for a given action or remote agent
- which tag sets are explicitly allowed or denied for an action or agent

Use `action_tags` and `agent_tags` for tag requirements, and `allow_*` / `deny_*` for stricter admission rules.

### `gateway.nodes.artifacts`

Node artifact retention lives under `gateway.nodes.artifacts`.

Fields:

- `enabled`
- `keep_latest`
- `retain_days`
- `prune_on_read`

Defaults:

- `enabled = false`
- `keep_latest = 500`
- `retain_days = 7`
- `prune_on_read = true`

Validation:

- when `enabled = true`, `keep_latest` must be greater than `0`
- `keep_latest` cannot be negative
- `retain_days` cannot be negative

When enabled, Gateway prunes node artifacts on read using both the latest-count and retain-days limits.

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
