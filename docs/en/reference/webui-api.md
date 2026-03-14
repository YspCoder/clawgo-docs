# WebUI API Reference

This page groups the currently registered `/api/*` endpoints from `pkg/api/server.go`.

## Auth

Access requires either:

- `?token=<gateway.token>` in the URL, or
- `Authorization: Bearer <gateway.token>` in the request headers

## Config

- `GET /api/config`
- `POST /api/config`
- `GET /api/version`

`GET /api/config?mode=normalized` returns the normalized schema first and also includes:

- `config`
- `raw_config`

`POST /api/config?mode=normalized` accepts the normalized schema and applies it back to the real config file.

`POST /api/config` supports risky-change confirmation. Recent changes expanded that logic to include named providers under `providers.proxies.<name>`, not only the default provider. When a sensitive field changes without confirmation, the response returns `requires_confirm: true`.

The WebUI header version-check action compares this version payload with the latest GitHub release.

Recent versions also add:

- `compiled_channels`

The UI uses that field to know which channel adapters are actually compiled into the current binary.

## Chat and Upload

- `POST /api/chat`
- `GET /api/chat/history`
- `GET /api/chat/stream`
- `GET /api/chat/live`
- `POST /api/upload`

`GET /api/chat/live` is the websocket chat streaming endpoint. After the first JSON message, it sends:

- `chat_chunk`
- `chat_done`
- `chat_error`

## Runtime Resources

- `GET /api/tools`
- `GET /api/runtime`
- `GET /api/nodes`
- `GET /api/sessions`
- `GET/POST /api/memory`
- `GET/POST /api/subagent_profiles`
- `GET/POST /api/subagents_runtime`
- `GET /api/subagents_runtime/live`
- `GET /api/tool_allowlist_groups`
- `POST /api/mcp/install`

`GET /api/runtime` is the websocket runtime snapshot endpoint. It emits `runtime_snapshot` payloads aggregating version, nodes, sessions, task queue, EKG summary, and subagent runtime.

Recent runtime snapshots also include provider runtime summary data for the dedicated Providers page.

The `version` part of that snapshot now also includes:

- `compiled_channels`

This lets the WebUI prune channel settings routes and menus at runtime.

`GET /api/nodes` now also returns a `p2p` runtime summary. That payload is used for Node P2P visibility in the Dashboard and node views, including transport, active sessions, configured STUN/ICE counts, and WebRTC session health rows.

Recent versions also add:

- `dispatches`
- `alerts`
- `artifact_retention`

Node summaries also expose:

- node tags
- recent dispatch statistics
- node alerts
- artifact retention summary

Additional node-specific runtime APIs:

- `GET /api/node_dispatches`
- `POST /api/node_dispatches/replay`
- `GET /api/node_artifacts`
- `GET /api/node_artifacts/export`
- `GET /api/node_artifacts/download`
- `POST /api/node_artifacts/delete`
- `POST /api/node_artifacts/prune`

`GET /api/node_dispatches` returns node dispatch audit rows, including:

- `used_transport`
- `fallback_from`
- `artifact_count`
- `artifact_kinds`
- `artifacts`

`POST /api/node_dispatches/replay` replays a historical node dispatch through the current node dispatch handler.

`GET /api/node_artifacts` reads node artifact rows and retention summary. Common filters include `node`, `action`, `kind`, and `limit`.

`POST /api/node_artifacts/prune` accepts common fields such as `node`, `action`, `kind`, and `keep_latest`.

`GET /api/subagents_runtime/live` is the websocket subagent detail feed. Common query params are `task_id` and `preview_task_id`, and the payload type is `subagents_live`.

`GET /api/tools` is also used by the MCP page for:

- `tools`
- `mcp_tools`
- `mcp_server_checks`

`POST /api/mcp/install` accepts:

- `package`
- `installer`

Supported installers:

- `npm`
- `uv`
- `bun`

Additional provider-management APIs:

- `POST /api/provider/oauth/start`
- `POST /api/provider/oauth/complete`
- `POST /api/provider/oauth/import`
- `GET/POST /api/provider/oauth/accounts`
- `POST /api/provider/models`
- `GET/POST /api/provider/runtime`
- `GET /api/provider/runtime/summary`

Typical provider runtime actions include:

- `clear_api_cooldown`
- `clear_history`
- `refresh_now`
- `rerank`

## Automation

- `GET/POST /api/cron`
- `GET/POST /api/skills`

## Audit and Logs

- `GET /api/task_audit`
- `GET /api/task_queue`
- `GET /api/ekg_stats`
- `GET/POST /api/exec_approvals`
- `GET /api/logs/live`
- `GET /api/logs/recent`
- `GET /api/logs/stream`

## Page To API Mapping

| Page | Main APIs |
| --- | --- |
| MCP | `tools`, `mcp/install`, `config` |
| Providers | `provider/oauth/start`, `provider/oauth/complete`, `provider/oauth/import`, `provider/oauth/accounts`, `provider/models`, `provider/runtime`, `provider/runtime/summary` |
| Chat | `chat`, `chat/history`, `chat/stream`, `chat/live`, `subagents_runtime` |
| Config | `config` |
| Cron | `cron` |
| Skills | `skills` |
| Memory | `memory` |
| SubagentProfiles | `subagent_profiles`, `tool_allowlist_groups`, `subagents_runtime` |
| Subagents | `runtime`, `nodes`, `subagents_runtime`, `subagents_runtime/live` |
| Nodes | `nodes`, `node_dispatches`, `node_artifacts` |
| NodeArtifacts | `node_artifacts`, `node_artifacts/export`, `node_artifacts/download`, `node_artifacts/delete`, `node_artifacts/prune` |
| TaskAudit | `task_queue`, `task_audit`, `node_dispatches`, `node_dispatches/replay` |
| EKG | `ekg_stats` |
| Logs | `logs/live`, `logs/recent`, `logs/stream` |

## Usage Notes

If you are building on top of the WebUI, it is cleaner to wrap these APIs by capability group, such as config, chat, runtime, and audit, instead of coupling them directly to individual pages.
