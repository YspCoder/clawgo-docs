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
| `system_prompt` | inline prompt |
| `system_prompt_file` | prompt file path |
| `memory_namespace` | memory namespace |
| `tools.allowlist` | tool allowlist |
| `tools.denylist` | tool denylist |
| `runtime.*` | runtime controls |

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
- `responses.*`
