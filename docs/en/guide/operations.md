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

The Gateway HTTP wrapper now also enables permissive CORS by default:

- `Access-Control-Allow-Origin: *`
- common `GET/POST/PUT/PATCH/DELETE/OPTIONS` methods are allowed

That makes it easier to:

- call `/api/*` from an external console
- place another frontend behind a reverse proxy
- build lightweight device-side or local bridge integrations

## WebUI API Groups

### Config and Version

- `/api/config`
- `/api/version`

Risk confirmation on config writes now covers not only the default provider, but also:

- `providers.proxies.<name>.api_base`
- `providers.proxies.<name>.api_key`

### Chat and Upload

- `/api/chat`
- `/api/chat/history`
- `/api/chat/stream`
- `/api/chat/live`
- `/api/upload`

### Runtime Resources

- `/api/nodes`
- `/api/runtime`
- `/api/sessions`
- `/api/memory`
- `/api/subagents_runtime`
- `/api/subagents_runtime/live`
- `/api/subagent_profiles`
- `/api/tool_allowlist_groups`

`/api/nodes` now returns more than the node list and trees. It also includes a `p2p` summary with:

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

- `/api/node_dispatches`
- `/api/node_dispatches/replay`
- `/api/node_artifacts`
- `/api/node_artifacts/export`
- `/api/node_artifacts/download`
- `/api/node_artifacts/delete`
- `/api/node_artifacts/prune`

Recent versions also add dedicated provider operations endpoints:

- `/api/provider/oauth/start`
- `/api/provider/oauth/complete`
- `/api/provider/oauth/import`
- `/api/provider/oauth/accounts`
- `/api/provider/runtime`
- `/api/provider/runtime/summary`

These are used for:

- browser-driven OAuth login
- importing existing auth JSON
- inspecting provider runtime health, cooldown state, and candidate ordering
- triggering refresh, rerank, or cooldown cleanup manually

### Audit and Logs

- `/api/task_audit`
- `/api/task_queue`
- `/api/ekg_stats`
- `/api/exec_approvals`
- `/api/logs/recent`
- `/api/logs/stream`

For a dedicated explanation of EKG metrics, windows, and rankings, see:

- [EKG Guide](/en/guide/ekg)

Node audit now also includes:

- `used_transport`
- `fallback_from`
- `artifact_count`
- `artifact_kinds`
- `artifacts`

The replay endpoint can resend a historical node dispatch through the current node dispatch handler.

`/api/runtime` and `/api/subagents_runtime/live` now provide websocket-based live snapshots for the frontend runtime overview and subagent detail views.

### Automation

- `/api/cron`
- `/api/skills`

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
