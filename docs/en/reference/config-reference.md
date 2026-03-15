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
| `model.primary` | default model reference in `provider/model` form |
| `max_tokens` | default token limit |
| `temperature` | default temperature |
| `max_tool_iterations` | max tool iterations |

## `agents.defaults.heartbeat`

| Field | Purpose |
| --- | --- |
| `enabled` | enable heartbeat |
| `every_sec` | heartbeat interval |
| `ack_max_chars` | max ACK characters |
| `prompt_template` | heartbeat prompt template |

## `agents.defaults.context_compaction`

| Field | Purpose |
| --- | --- |
| `enabled` | enable compaction |
| `mode` | `summary`, `responses_compact`, or `hybrid` |
| `trigger_messages` | compaction trigger threshold |
| `keep_recent_messages` | recent messages kept |
| `max_summary_chars` | max summary length |
| `max_transcript_chars` | max transcript length |

## `agents.defaults.execution`

| Field | Purpose |
| --- | --- |
| `run_state_ttl_seconds` | runtime-state TTL |
| `run_state_max` | max cached runtime entries |
| `tool_parallel_safe_names` | tools safe for parallel execution |
| `tool_max_parallel_calls` | max concurrent tool calls |

## `agents.agents.<id>`

| Field | Purpose |
| --- | --- |
| `enabled` | whether enabled |
| `kind` | actor kind, such as `npc` |
| `type` | actor type, such as `agent` |
| `transport` | `local` or `node` |
| `node_id` | remote node ID |
| `parent_agent_id` | parent actor |
| `display_name` | display name |
| `role` | role |
| `description` | description |
| `persona` | NPC persona |
| `traits` | trait labels |
| `faction` | faction |
| `home_location` | NPC home location |
| `default_goals` | default goals |
| `perception_scope` | perception scope |
| `schedule_hint` | scheduling hint |
| `world_tags` | world tags |
| `prompt_file` | prompt file |
| `memory_namespace` | memory namespace |
| `tools.allowlist` | tool allowlist |
| `tools.denylist` | tool denylist |
| `tools.max_parallel_calls` | actor-level tool concurrency limit |
| `runtime.provider` | bound provider |
| `runtime.model` | bound model |
| `runtime.timeout_sec` | timeout seconds |
| `runtime.max_retries` | max retries |
| `runtime.retry_backoff_ms` | retry backoff |
| `runtime.max_task_chars` | max task length |
| `runtime.max_result_chars` | max result length |
| `runtime.max_parallel_runs` | actor runtime concurrency limit |

Notes:

- world roles enter through `kind: "npc"`
- executable agents typically use `prompt_file`
- `prompt_file` must remain workspace-relative

## `channels`

Shared fields:

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

## `models.providers.<name>`

| Field | Purpose |
| --- | --- |
| `api_key` | API key |
| `api_base` | API base URL |
| `models` | model list |
| `supports_responses_compact` | whether compact responses are supported |
| `auth` | `bearer`, `oauth`, `hybrid`, or `none` |
| `timeout_sec` | timeout seconds |
| `runtime_persist` | persist provider runtime |
| `runtime_history_file` | runtime history file |
| `runtime_history_max` | runtime history limit |
| `oauth.*` | OAuth settings |
| `responses.*` | Responses API settings |

## `gateway`

| Field | Purpose |
| --- | --- |
| `host` | listen host |
| `port` | listen port |
| `token` | gateway access token |

## `gateway.nodes.p2p`

| Field | Purpose |
| --- | --- |
| `enabled` | whether node P2P is enabled |
| `transport` | `websocket_tunnel` or `webrtc` |
| `stun_servers` | list of STUN URLs |
| `ice_servers` | structured ICE server list |

## `gateway.nodes.dispatch`

| Field | Purpose |
| --- | --- |
| `prefer_local` | prefer local execution |
| `prefer_p2p` | prefer P2P |
| `allow_relay_fallback` | allow relay fallback when P2P fails |
| `action_tags` | required node tags for an action |
| `agent_tags` | required node tags for an actor |
| `allow_actions` | allowed node tags for an action |
| `deny_actions` | denied node tags for an action |
| `allow_agents` | allowed node tags for an actor |
| `deny_agents` | denied node tags for an actor |

## `gateway.nodes.artifacts`

| Field | Purpose |
| --- | --- |
| `enabled` | enable node artifact retention |
| `keep_latest` | number of recent artifacts to keep |
| `retain_days` | max retention days |
| `prune_on_read` | prune while reading |

## `tools.mcp`

| Field | Purpose |
| --- | --- |
| `enabled` | global MCP switch |
| `request_timeout_sec` | request timeout |
| `servers` | MCP server declarations |

## `tools.mcp.servers.<name>`

| Field | Purpose |
| --- | --- |
| `enabled` | whether enabled |
| `transport` | `stdio`, `http`, `streamable_http`, or `sse` |
| `command` | launch command for `stdio` |
| `args` | launch args for `stdio` |
| `url` | remote transport URL |
| `env` | env var overrides |
| `working_dir` | working directory |
| `permission` | `workspace` or `full` |
| `description` | description |
| `package` | package name |
| `installer` | installer such as `npx`, `uvx`, or `bunx` |
| `mcp_server_checks` | command checks or install prerequisites |
