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

Recent UI changes also surface tool visibility details, including:

- tool visibility mode
- inherited tools
- effective allowlist and denylist results

The tooltip preview was also simplified. It now focuses on the latest internal stream item instead of packing several older previews into the same card.

### Config

Configuration workspace with:

- form mode
- raw JSON mode
- hot-reload field filtering
- diff view
- risky change confirmation

Risk confirmation now also covers sensitive fields on named providers, not only the default provider:

- `providers.proxy.api_base`
- `providers.proxy.api_key`
- `providers.proxies.<name>.api_base`
- `providers.proxies.<name>.api_key`

### MCP

Dedicated management page for MCP servers and discovered remote tools. It supports:

- adding and removing MCP servers
- switching between `stdio`, `http`, `streamable_http`, and `sse`
- editing `command`, `args`, `url`, `working_dir`, `permission`, and `package`
- checking whether the configured `command` exists
- suggesting install choices from the package value
- installing MCP servers with `npm`, `uv`, or `bun`
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

The page now also surfaces:

- inherited tools
- tool visibility mode
- automatic inheritance of `skill_exec` for subagents

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

The frontend now also lazy-loads routes and splits vendor bundles into manual chunks such as:

- `react-vendor`
- `motion`
- `icons`

That reduces how much code the initial page load has to fetch.
