# Config Reference

This page is the lookup companion to [Configuration](/en/guide/configuration).

## Top-Level Keys

```json
{
  "agents": {},
  "channels": {},
  "providers": {},
  "gateway": {},
  "cron": {},
  "tools": {},
  "logging": {},
  "sentinel": {},
  "memory": {}
}
```

## `agents.defaults`

| Field | Purpose |
| --- | --- |
| `workspace` | workspace path |
| `proxy` | default provider name |
| `proxy_fallbacks` | provider fallback chain |
| `max_tokens` | default token limit |
| `temperature` | default temperature |
| `max_tool_iterations` | max tool iterations |

## `agents.router`

| Field | Purpose |
| --- | --- |
| `enabled` | enable router |
| `main_agent_id` | main agent ID |
| `strategy` | `rules_first`, `round_robin`, or `manual` |
| `rules` | keyword-based dispatch rules |
| `max_hops` | maximum hop count |
| `default_timeout_sec` | default timeout |
| `default_wait_reply` | whether to wait for reply |
| `sticky_thread_owner` | keep thread ownership sticky |

## `agents.subagents.<id>`

| Field | Purpose |
| --- | --- |
| `enabled` | whether enabled |
| `type` | `router` or `worker` |
| `transport` | local or `node` |
| `node_id` | node ID |
| `parent_agent_id` | parent agent |
| `notify_main_policy` | main notification policy |
| `display_name` | display name |
| `role` | role |
| `system_prompt_file` | prompt file path |
| `memory_namespace` | memory namespace |
| `tools.allowlist` | tool allowlist |
| `tools.denylist` | tool denylist |
| `runtime.*` | runtime controls |

Notes:

- enabled subagents should define `system_prompt_file`
- `system_prompt_file` must be a relative path inside the workspace

## `channels`

Shared dedupe fields:

- `inbound_message_id_dedupe_ttl_seconds`
- `inbound_content_dedupe_window_seconds`
- `outbound_dedupe_window_seconds`

Channel groups:

- `telegram`
- `discord`
- `feishu`
- `dingtalk`
- `whatsapp`
- `qq`
- `maixcam`

## `providers`

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
- `oauth.*`
- `responses.*`

`auth` supports `bearer`, `oauth`, `hybrid`, and `none`.

## `providers.proxy.oauth` / `providers.proxies.<name>.oauth`

| Field | Purpose |
| --- | --- |
| `provider` | OAuth provider name |
| `network_proxy` | network proxy for OAuth login and refresh |
| `credential_file` | primary credential file |
| `credential_files` | bound credential file list |
| `callback_port` | local callback port |
| `client_id` | OAuth client id |
| `client_secret` | OAuth client secret |
| `auth_url` | custom authorization URL |
| `token_url` | custom token URL |
| `redirect_url` | custom redirect URL |
| `scopes` | OAuth scopes |
| `cooldown_sec` | failure cooldown window |
| `refresh_scan_sec` | refresh scan interval |
| `refresh_lead_sec` | proactive refresh lead window |

## `gateway.nodes.p2p`

| Field | Purpose |
| --- | --- |
| `enabled` | whether node P2P is enabled |
| `transport` | `websocket_tunnel` or `webrtc` |
| `stun_servers` | list of STUN URLs |
| `ice_servers` | structured ICE server list |

## `gateway.nodes.p2p.ice_servers[]`

| Field | Purpose |
| --- | --- |
| `urls` | list of `stun:`, `turn:`, or `turns:` URLs |
| `username` | TURN username |
| `credential` | TURN credential |

## `gateway.nodes.dispatch`

| Field | Purpose |
| --- | --- |
| `prefer_local` | prefer local execution or local-node routing |
| `prefer_p2p` | prefer P2P when available |
| `allow_relay_fallback` | allow fallback to relay when P2P is unavailable |
| `action_tags` | required node tags for a given action |
| `agent_tags` | required node tags for a given remote agent |
| `allow_actions` | allowed node tags for a given action |
| `deny_actions` | denied node tags for a given action |
| `allow_agents` | allowed node tags for a given remote agent |
| `deny_agents` | denied node tags for a given remote agent |

## `gateway.nodes.artifacts`

| Field | Purpose |
| --- | --- |
| `enabled` | enable node artifact retention and cleanup |
| `keep_latest` | number of latest artifacts kept on each read |
| `retain_days` | max retention days, `0` disables age-based pruning |
| `prune_on_read` | whether reads automatically prune old artifacts |

## `tools.mcp`

| Field | Purpose |
| --- | --- |
| `enabled` | global MCP enable switch |
| `request_timeout_sec` | request timeout |
| `servers` | MCP server declarations |

## `tools.mcp.servers.<name>`

| Field | Purpose |
| --- | --- |
| `enabled` | whether the server is enabled |
| `transport` | `stdio`, `http`, `streamable_http`, or `sse` |
| `command` | launch command for `stdio` servers |
| `args` | launch args for `stdio` servers |
| `url` | endpoint URL for `http`, `streamable_http`, or `sse` |
| `env` | env var overrides |
| `working_dir` | working directory; relative under `workspace`, absolute under `full` |
| `permission` | `workspace` or `full` |
| `description` | description |
| `package` | package name for WebUI-assisted install |
