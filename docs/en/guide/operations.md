# Operations and API

## Gateway HTTP Surface

According to the current `pkg/api/server.go`, Gateway now exposes three main things by default:

1. health checks
2. a Gateway-hosted WebUI entrypoint
3. WebUI control APIs

## Base Endpoint

### Health

```text
GET /health
```

Returns `ok`.

## Auth

WebUI and API requests are protected by `gateway.token`.

The current default entrypoint remains the README pattern:

```text
http://<host>:<port>/?token=<gateway.token>
```

The code currently accepts:

- `?token=<gateway.token>`
- `Authorization: Bearer <gateway.token>`
- `clawgo_webui_token` cookie

Gateway also enables permissive CORS by default, which makes `/api/*` easier to consume from external frontends or control panels.

## WebUI API Groups

### Config and Version

- `/api/config`
- `/api/version`

`GET /api/config?mode=normalized` returns:

- `config`
- `raw_config`

Important normalized keys include:

- `core.default_provider`
- `core.default_model`
- `core.main_agent_id`
- `core.subagents`
- `runtime.router`
- `runtime.providers`

### Chat and Upload

- `/api/chat`
- `/api/chat/history`
- `/api/chat/live`
- `/api/upload`

### Provider and OAuth

- `/api/provider/oauth/start`
- `/api/provider/oauth/complete`
- `/api/provider/oauth/import`
- `/api/provider/oauth/accounts`
- `/api/provider/models`
- `/api/provider/runtime`

These are mainly used for:

- browser-driven OAuth login
- importing existing auth JSON
- querying provider model lists
- inspecting provider runtime health, cooldown state, and candidate ordering

### Runtime Resources

- `/api/sessions`
- `/api/memory`
- `/api/workspace_file`
- `/api/tool_allowlist_groups`
- `/api/tools`
- `/api/mcp/install`
- `/api/cron`
- `/api/skills`

### Logs and Channel Helpers

- `/api/logs/recent`
- `/api/logs/live`
- `/api/whatsapp/status`
- `/api/whatsapp/logout`
- `/api/whatsapp/qr.svg`

## `status` As An Operational Check

`clawgo status` reads runtime-facing artifacts rather than only echoing config.

The most useful lines now include:

- active provider
- `Provider API Base`
- `Provider API Key`
- heartbeat / cron state
- skill execution stats
- session stats

That makes it much closer to the real runtime state than looking at one static provider slot in config.

## Sentinel

Sentinel is initialized at Gateway startup and uses:

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

The default log endpoints are:

- `/api/logs/recent`
- `/api/logs/live`

not the older `/api/logs/stream` name from previous docs.

## Hot Reload and Rollback

`clawgo config set` currently:

1. updates config
2. writes atomically
3. keeps a backup
4. attempts Gateway reload
5. rolls back if reload fails while Gateway is running

## Service Deployment

`clawgo gateway` supports:

- `start`
- `stop`
- `restart`
- `status`

Running:

```bash
clawgo gateway
```

attempts to register the gateway service for the current platform. For foreground debugging, prefer:

```bash
clawgo gateway run
```
