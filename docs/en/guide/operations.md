# Operations and API

## Gateway HTTP Surface

Gateway is more than a static WebUI host. `pkg/api/server.go` exposes:

1. health checks
2. node registration and heartbeat
3. WebUI control APIs

## Base Endpoints

### Health

```text
GET /health
```

Returns `ok`.

### Node Endpoints

```text
POST /nodes/register
POST /nodes/heartbeat
```

Both require token-based auth.

## WebUI API Groups

### Config and Version

- `/webui/api/config`
- `/webui/api/version`

Risk confirmation on config writes now covers not only the default provider, but also:

- `providers.proxies.<name>.api_base`
- `providers.proxies.<name>.api_key`

### Chat and Upload

- `/webui/api/chat`
- `/webui/api/chat/history`
- `/webui/api/chat/stream`
- `/webui/api/chat/live`
- `/webui/api/upload`

### Runtime Resources

- `/webui/api/nodes`
- `/webui/api/runtime`
- `/webui/api/sessions`
- `/webui/api/memory`
- `/webui/api/subagents_runtime`
- `/webui/api/subagents_runtime/live`
- `/webui/api/subagent_profiles`
- `/webui/api/tool_allowlist_groups`

`/webui/api/nodes` now returns more than the node list and trees. It also includes a `p2p` summary with:

- `enabled`
- `transport`
- `active_sessions`
- `configured_stun`
- `configured_ice`
- WebRTC session health rows

Recent versions also add:

- `dispatches`
- `alerts`
- `artifact_retention`

There are also dedicated node runtime endpoints:

- `/webui/api/node_dispatches`
- `/webui/api/node_dispatches/replay`
- `/webui/api/node_artifacts`
- `/webui/api/node_artifacts/export`
- `/webui/api/node_artifacts/download`
- `/webui/api/node_artifacts/delete`
- `/webui/api/node_artifacts/prune`

Recent versions also add dedicated provider operations endpoints:

- `/webui/api/provider/oauth/start`
- `/webui/api/provider/oauth/complete`
- `/webui/api/provider/oauth/import`
- `/webui/api/provider/oauth/accounts`
- `/webui/api/provider/runtime`
- `/webui/api/provider/runtime/summary`

These are used for:

- browser-driven OAuth login
- importing existing auth JSON
- inspecting provider runtime health, cooldown state, and candidate ordering
- triggering refresh, rerank, or cooldown cleanup manually

### Audit and Logs

- `/webui/api/task_audit`
- `/webui/api/task_queue`
- `/webui/api/ekg_stats`
- `/webui/api/exec_approvals`
- `/webui/api/logs/recent`
- `/webui/api/logs/stream`

For a dedicated explanation of EKG metrics, windows, and rankings, see:

- [EKG Guide](/en/guide/ekg)

Node audit now also includes:

- `used_transport`
- `fallback_from`
- `artifact_count`
- `artifact_kinds`
- `artifacts`

The replay endpoint can resend a historical node dispatch through the current node dispatch handler.

`/webui/api/runtime` and `/webui/api/subagents_runtime/live` now provide websocket-based live snapshots for the frontend runtime overview and subagent detail views.

### Automation

- `/webui/api/cron`
- `/webui/api/skills`

## Sentinel

Sentinel is initialized during Gateway startup and uses:

- `enabled`
- `interval_sec`
- `auto_heal`
- `notify_channel`
- `notify_chat_id`

## Logs

Default log path:

```text
~/.clawgo/logs/clawgo.log
```

The WebUI can also read recent logs and stream them.

## `status` As An Operational Check

`clawgo status` reads runtime-facing artifacts rather than only echoing config. In multi-provider setups it now reports the active provider details:

- `Provider API Base`
- `Provider API Key`

That makes the command more accurate when `agents.defaults.proxy` points to a named provider under `providers.proxies`.

For node troubleshooting, `status` also now includes:

- `Nodes P2P`
- `Nodes P2P ICE`
- `Nodes Dispatch Top Transport`
- `Nodes Dispatch Fallbacks`

Those lines are the fastest way to spot failed WebRTC setup or relay fallback behavior.

## Service Deployment

`clawgo gateway` now supports service control across desktop and server environments:

- Linux: `systemd`, with `user` or `system` scope
- macOS: `launchd`
- Windows: Scheduled Task

Running:

```bash
clawgo gateway
```

attempts to register the gateway service for the current platform.

`clawgo uninstall` also tries to remove the installed gateway service.

## Recommended Checks

1. `clawgo config check`
2. `clawgo status`
3. `clawgo gateway status`
4. open `/webui`
5. inspect Logs, Task Audit, Subagents, and EKG
