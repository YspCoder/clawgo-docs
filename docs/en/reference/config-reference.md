# Config Reference

This page is the field index companion to [Configuration](/en/guide/configuration).

## Top-Level Keys

```json
{
  "agents": {},
  "channels": {},
  "models": {},
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
| `model.primary` | default model ref in `provider/model` form |
| `max_tokens` | default token limit |
| `temperature` | default temperature |
| `max_tool_iterations` | max tool iterations |

## `agents.router`

| Field | Purpose |
| --- | --- |
| `enabled` | enable router |
| `main_agent_id` | main agent ID |
| `strategy` | `rules_first`, `round_robin`, or `manual` |
| `rules` | keyword dispatch rules |
| `max_hops` | maximum hop count |
| `default_timeout_sec` | default timeout |
| `sticky_thread_owner` | sticky thread ownership |

## `agents.communication`

| Field | Purpose |
| --- | --- |
| `mode` | collaboration mode |
| `persist_threads` | persist threads |
| `persist_messages` | persist messages |
| `max_messages_per_thread` | max messages per thread |
| `dead_letter_queue` | enable dead-letter queue |
| `default_message_ttl_sec` | default message TTL |

## `agents.subagents.<id>`

| Field | Purpose |
| --- | --- |
| `enabled` | whether enabled |
| `type` | `router`, `worker`, `reviewer`, or `observer` |
| `transport` | currently documented as `local` in the default upstream surface |
| `parent_agent_id` | parent agent |
| `notify_main_policy` | main notification policy |
| `display_name` | display name |
| `role` | role |
| `description` | description |
| `system_prompt_file` | prompt file |
| `memory_namespace` | memory namespace |
| `accept_from` | allowed senders |
| `can_talk_to` | allowed targets |
| `requires_main_mediation` | require main mediation |
| `default_reply_to` | default reply target |
| `tools.allowlist` | tool allowlist |
| `tools.denylist` | tool denylist |
| `tools.max_parallel_calls` | tool concurrency limit |
| `runtime.*` | provider, retries, timeouts, length limits |

## `models.providers.<name>`

| Field | Purpose |
| --- | --- |
| `api_key` | API key |
| `api_base` | API base URL |
| `models` | model list |
| `supports_responses_compact` | compact responses support |
| `auth` | `bearer`, `oauth`, `hybrid`, or `none` |
| `timeout_sec` | timeout seconds |
| `runtime_persist` | persist provider runtime |
| `runtime_history_file` | runtime history file |
| `runtime_history_max` | history limit |
| `oauth.*` | OAuth config |
| `responses.*` | Responses API config |

## `gateway`

| Field | Purpose |
| --- | --- |
| `host` | listen host |
| `port` | listen port |
| `token` | gateway access token |

The current upstream docs no longer expand the older `gateway.nodes.*` surface.

## `tools.mcp.servers.<name>`

| Field | Purpose |
| --- | --- |
| `enabled` | whether enabled |
| `transport` | `stdio`, `http`, `streamable_http`, or `sse` |
| `command` | launch command for `stdio` |
| `args` | launch args for `stdio` |
| `url` | remote transport URL |
| `working_dir` | working directory |
| `permission` | `workspace` or `full` |
| `package` | install package name |
