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

## Chat and Upload

- `POST /webui/api/chat`
- `GET /webui/api/chat/history`
- `GET /webui/api/chat/stream`
- `POST /webui/api/upload`

## Runtime Resources

- `GET /webui/api/tools`
- `GET /webui/api/nodes`
- `GET /webui/api/sessions`
- `GET/POST /webui/api/memory`
- `GET/POST /webui/api/subagent_profiles`
- `GET/POST /webui/api/subagents_runtime`
- `GET /webui/api/tool_allowlist_groups`
- `POST /webui/api/mcp/install`

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
| Chat | `chat`, `chat/history`, `chat/stream`, `subagents_runtime` |
| Config | `config` |
| Cron | `cron` |
| Skills | `skills` |
