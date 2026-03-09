# WebUI API Reference

This page groups the currently registered `/webui/api/*` endpoints from `pkg/api/server.go`.

## Auth

Access requires either:

- `?token=<gateway.token>` in the URL, or
- a token cookie set after visiting `/webui`

## Config

- `GET /webui/api/config`
- `POST /webui/api/config`
- `GET /webui/api/version`

`POST /webui/api/config` supports risky-change confirmation. Recent changes expanded that logic to include named providers under `providers.proxies.<name>`, not only the default provider. When a sensitive field changes without confirmation, the response returns `requires_confirm: true`.

The WebUI header version-check action compares this version payload with the latest GitHub release.

## Chat and Upload

- `POST /webui/api/chat`
- `GET /webui/api/chat/history`
- `GET /webui/api/chat/stream`
- `GET /webui/api/chat/live`
- `POST /webui/api/upload`

`GET /webui/api/chat/live` is the websocket chat streaming endpoint. After the first JSON message, it sends:

- `chat_chunk`
- `chat_done`
- `chat_error`

## Runtime Resources

- `GET /webui/api/tools`
- `GET /webui/api/runtime`
- `GET /webui/api/nodes`
- `GET /webui/api/sessions`
- `GET/POST /webui/api/memory`
- `GET/POST /webui/api/subagent_profiles`
- `GET/POST /webui/api/subagents_runtime`
- `GET /webui/api/subagents_runtime/live`
- `GET /webui/api/tool_allowlist_groups`
- `POST /webui/api/mcp/install`

`GET /webui/api/runtime` is the websocket runtime snapshot endpoint. It emits `runtime_snapshot` payloads aggregating version, nodes, sessions, task queue, EKG summary, and subagent runtime.

`GET /webui/api/nodes` now also returns a `p2p` runtime summary. That payload is used for Node P2P visibility in the Dashboard and node views, including transport, active sessions, configured STUN/ICE counts, and WebRTC session health rows.

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

- `GET /webui/api/node_dispatches`
- `POST /webui/api/node_dispatches/replay`
- `GET /webui/api/node_artifacts`
- `GET /webui/api/node_artifacts/export`
- `GET /webui/api/node_artifacts/download`
- `POST /webui/api/node_artifacts/delete`
- `POST /webui/api/node_artifacts/prune`

`GET /webui/api/node_dispatches` returns node dispatch audit rows, including:

- `used_transport`
- `fallback_from`
- `artifact_count`
- `artifact_kinds`
- `artifacts`

`POST /webui/api/node_dispatches/replay` replays a historical node dispatch through the current node dispatch handler.

`GET /webui/api/node_artifacts` reads node artifact rows and retention summary. Common filters include `node`, `action`, `kind`, and `limit`.

`POST /webui/api/node_artifacts/prune` accepts common fields such as `node`, `action`, `kind`, and `keep_latest`.

`GET /webui/api/subagents_runtime/live` is the websocket subagent detail feed. Common query params are `task_id` and `preview_task_id`, and the payload type is `subagents_live`.

`GET /webui/api/tools` is also used by the MCP page for:

- `tools`
- `mcp_tools`
- `mcp_server_checks`

`POST /webui/api/mcp/install` accepts:

- `package`
- `installer`

Supported installers:

- `npm`
- `uv`
- `bun`

## Automation

- `GET/POST /webui/api/cron`
- `GET/POST /webui/api/skills`

## Audit and Logs

- `GET /webui/api/task_audit`
- `GET /webui/api/task_queue`
- `GET /webui/api/ekg_stats`
- `GET/POST /webui/api/exec_approvals`
- `GET /webui/api/logs/recent`
- `GET /webui/api/logs/stream`

## Page To API Mapping

| Page | Main APIs |
| --- | --- |
| MCP | `tools`, `mcp/install`, `config` |
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
| Logs | `logs/recent`, `logs/stream` |

## Usage Notes

If you are building on top of the WebUI, it is cleaner to wrap these APIs by capability group, such as config, chat, runtime, and audit, instead of coupling them directly to individual pages.
