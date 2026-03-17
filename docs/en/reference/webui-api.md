# WebUI API Reference

This page follows the `/api/*` routes explicitly registered in the current `pkg/api/server.go`.

## Auth

Common access patterns:

- `?token=<gateway.token>`
- `Authorization: Bearer <gateway.token>`
- `clawgo_webui_token` cookie

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

## Provider and OAuth

- `POST /api/provider/oauth/start`
- `POST /api/provider/oauth/complete`
- `POST /api/provider/oauth/import`
- `GET/POST /api/provider/oauth/accounts`
- `POST /api/provider/models`
- `GET/POST /api/provider/runtime`

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
- `/api/auth/session`
- `/api/nodes`
- `/api/node_dispatches`
- `/api/node_artifacts`
- `/api/task_queue`
- `/api/ekg_stats`

So the docs no longer present them as part of clawgo’s default WebUI API surface.
