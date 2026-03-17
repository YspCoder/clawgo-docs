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

Common auth patterns for the API:

- `?token=<gateway.token>`
- `Authorization: Bearer <gateway.token>`

The standalone WebUI also usually calls:

```text
POST /api/auth/session
```

so Gateway can set the `clawgo_webui_token` cookie for later websocket and page requests.

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

Risk confirmation on config writes now covers sensitive fields under `models.providers.<name>`, for example:

- `models.providers.openai.api_base`
- `models.providers.openai.api_key`
- `models.providers.<name>.api_base`
- `models.providers.<name>.api_key`

### Chat and Upload

- `/api/chat`
- `/api/chat/history`
- `/api/chat/live`
- `/api/upload`

### Runtime Resources

- `/api/nodes`
- `/api/sessions`
- `/api/memory`
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
- `/api/provider/models`
- `/api/provider/runtime`

These are used for:

- browser-driven OAuth login
- importing existing auth JSON
- querying the provider's available models
- inspecting provider runtime health, cooldown state, and candidate ordering

### Audit and Logs

- `/api/logs/recent`
- `/api/logs/live`

Node audit now also includes:

- `used_transport`
- `fallback_from`
- `artifact_count`
- `artifact_kinds`
- `artifacts`

The replay endpoint can resend a historical node dispatch through the current node dispatch handler.

### Automation

- `/api/cron`
- `/api/skills`
- `/api/tools`
- `/api/mcp/install`

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

The current default log endpoints are:

- `/api/logs/recent`
- `/api/logs/live`

not the older `/api/logs/stream` name from previous docs.

## `status` As An Operational Check

`clawgo status` reads runtime-facing artifacts rather than only echoing config. In multi-provider setups it now reports the active provider details:

- `Provider API Base`
- `Provider API Key`

That makes the command more accurate than looking at only one configured default provider slot.

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
4. open your separately deployed WebUI
5. inspect Logs, Task Audit, Subagents, and EKG
