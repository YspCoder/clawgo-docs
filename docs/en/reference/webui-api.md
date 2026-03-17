# WebUI API Reference

This page follows the `/api/*` routes explicitly registered in `pkg/api/server.go`.

## Auth

Common access patterns:

- `?token=<gateway.token>`
- `Authorization: Bearer <gateway.token>`

### `POST /api/auth/session`

If you split the frontend out yourself, this endpoint can be used to bootstrap a session cookie.

```bash
curl -X POST \
  -H 'Authorization: Bearer YOUR_GATEWAY_TOKEN' \
  http://127.0.0.1:18790/api/auth/session
```

## Config and Version

- `GET /api/config`
- `POST /api/config`
- `GET /api/version`

`GET /api/config?mode=normalized` returns:

- `config`
- `raw_config`

Current normalized keys include:

- `core.default_provider`
- `core.default_model`
- `core.main_agent_id`
- `core.subagents`
- `runtime.router`
- `runtime.providers`

## Chat and Upload

- `POST /api/chat`
- `GET /api/chat/history`
- `GET /api/chat/live`
- `POST /api/upload`

One important detail: the currently registered public routes are `chat`, `chat/history`, and `chat/live`, not the broader runtime-control surface described by the previous docs revision.

## Provider and OAuth

- `POST /api/provider/oauth/start`
- `POST /api/provider/oauth/complete`
- `POST /api/provider/oauth/import`
- `GET/POST /api/provider/oauth/accounts`
- `POST /api/provider/models`
- `GET/POST /api/provider/runtime`

This is one of the most stable operational API groups in the current WebUI.

## Nodes and Artifacts

- `GET /api/nodes`
- `GET /api/node_dispatches`
- `POST /api/node_dispatches/replay`
- `GET /api/node_artifacts`
- `GET /api/node_artifacts/export`
- `GET /api/node_artifacts/download`
- `POST /api/node_artifacts/delete`
- `POST /api/node_artifacts/prune`

## Cron / Skills / Sessions / Memory

- `GET/POST /api/cron`
- `GET/POST /api/skills`
- `GET /api/sessions`
- `GET/POST /api/memory`
- `GET/POST /api/workspace_file`

## Tools and MCP

- `GET /api/tools`
- `GET /api/tool_allowlist_groups`
- `POST /api/mcp/install`

## Logs and Channel Helper Endpoints

- `GET /api/logs/live`
- `GET /api/logs/recent`
- `GET /api/whatsapp/status`
- `POST /api/whatsapp/logout`
- `GET /api/whatsapp/qr.svg`

## What This Revision Explicitly Fixes

The current codebase does not explicitly register these public routes anymore:

- `/api/runtime`
- `/api/world`
- `/api/subagents_runtime`
- `/api/subagent_profiles`
- `/api/task_queue`
- `/api/ekg_stats`

So the docs no longer present them as part of clawgo’s default WebUI API surface.
