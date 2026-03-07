# WebUI Console

## Tech Stack

The frontend lives in `webui/` and is built with:

- React 19
- React Router 7
- Vite 6
- TypeScript
- Tailwind CSS 4
- i18next

## Access

Usually served by the Gateway:

```text
http://<host>:<port>/webui?token=<gateway.token>
```

## Major Pages

### Dashboard

Runtime overview.

### Chat

Supports both:

- main chat history
- subagent internal stream

Uses:

- `/webui/api/chat`
- `/webui/api/chat/history`
- `/webui/api/chat/stream`
- `/webui/api/subagents_runtime`

### Subagents

Unified topology view for agents, tasks, threads, messages, and node branches.

### Config

Configuration workspace with:

- form mode
- raw JSON mode
- hot-reload field filtering
- diff view
- risky change confirmation

### MCP

Dedicated management page for MCP servers and discovered remote tools. It supports:

- adding and removing MCP servers
- editing `command`, `args`, `working_dir`, and `package`
- installing npm packages for MCP servers
- viewing discovered `mcp__<server>__<tool>` tools

Uses:

- `/webui/api/tools`
- `/webui/api/mcp/install`
- `/webui/api/config`

### Logs

Recent logs and log streaming.

### Skills

View, install, and refresh skills.

### Memory

Inspect and edit memory files.

### Cron

Manage scheduled jobs.

### SubagentProfiles

Manage profile-like subagent definitions and prompt files.

### TaskAudit

Inspect task queue state and detailed audit records.

## WebUI API Surface

Current registered endpoints:

- `/webui/api/config`
- `/webui/api/chat`
- `/webui/api/chat/history`
- `/webui/api/chat/stream`
- `/webui/api/version`
- `/webui/api/upload`
- `/webui/api/nodes`
- `/webui/api/cron`
- `/webui/api/skills`
- `/webui/api/sessions`
- `/webui/api/memory`
- `/webui/api/subagent_profiles`
- `/webui/api/subagents_runtime`
- `/webui/api/tool_allowlist_groups`
- `/webui/api/task_audit`
- `/webui/api/task_queue`
- `/webui/api/ekg_stats`
- `/webui/api/exec_approvals`
- `/webui/api/logs/stream`
- `/webui/api/logs/recent`

## Build and Embed

The WebUI is not assumed to be deployed separately. The Makefile flow:

1. builds `webui/dist`
2. syncs it into `cmd/clawgo/workspace/webui`
3. lets Go `embed` package those assets into release builds
