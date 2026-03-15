# WebUI Console

## Tech Stack

The frontend lives in `webui/` and is built with:

- React 19
- React Router 7
- Vite 6
- TypeScript
- Tailwind CSS 4
- i18next

The standalone frontend repository is:

- [YspCoder/clawgo-web](https://github.com/YspCoder/clawgo-web)

If you want the actual standalone deployment flow, see:

- [WebUI Deployment](/en/guide/webui-deployment)

## Access

The docs now assume the WebUI is deployed separately instead of being mounted under Gateway `/webui`.

Common access patterns:

- enter the Gateway address and token on the login page
- let the frontend call `POST /api/auth/session` to establish the session cookie
- then reuse `Authorization` headers or the cookie for `/api/*`

The header now also includes two utility actions:

- a GitHub repository link
- a latest-release version check

The version check compares the current Gateway/WebUI versions with the latest GitHub release.

The header and runtime bootstrap now also receive `compiled_channels`, which the UI uses to prune channel-specific routes and settings dynamically.

## Major Pages

### Dashboard

Runtime overview.

The Dashboard now also includes a Node P2P view with:

- current transport
- active session count
- retry count
- STUN / ICE config counts
- dispatch artifact counts and preview summaries

### Chat

Supports both:

- main chat history
- subagent internal stream

Uses:

- `/api/chat`
- `/api/chat/history`
- `/api/chat/stream`
- `/api/chat/live`
- `/api/subagents_runtime`

Recent versions also subscribe to:

- `/api/subagents_runtime/live`

to refresh:

- thread and message detail for the selected task
- inbox messages
- the latest stream preview used by topology tooltips

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
- normalized schema mode
- hot-reload field filtering
- diff view
- risky change confirmation

Risk confirmation now covers sensitive fields under `models.providers.<name>`, for example:

- `models.providers.openai.api_base`
- `models.providers.openai.api_key`
- `models.providers.<name>.api_base`
- `models.providers.<name>.api_key`

When the `gateway` section is active in form mode, the page can now edit Node P2P fields directly:

- `enabled`
- `transport`
- `stun_servers`
- `ice_servers[].urls`
- `ice_servers[].username`
- `ice_servers[].credential`

The same page also edits:

- `gateway.nodes.dispatch`
- `gateway.nodes.artifacts`

Including:

- `prefer_local`
- `prefer_p2p`
- `allow_relay_fallback`
- `action_tags` / `agent_tags`
- `allow_actions` / `deny_actions`
- `allow_agents` / `deny_agents`
- `keep_latest`
- `retain_days`
- `prune_on_read`

There is also an important channel-page behavior change:

- the page only shows channels actually compiled into the current binary
- a single-channel build no longer exposes unrelated channel forms
- a `-nochannels` / `none` build hides channel settings and falls back to the generic config page

The config page now prefers the normalized schema when reading and saving:

- `GET /api/config?mode=normalized`
- `POST /api/config?mode=normalized`

That view separates configuration into:

- `core.*`
- `runtime.*`

which is a better fit for frontend form sections.

### Providers

Dedicated provider workspace for managing:

- `models.providers.*`
- bearer, oauth, and hybrid auth modes
- provider runtime summaries and candidate ordering
- OAuth account login, import, refresh, delete, and cooldown cleanup

This page is more operations-focused than a generic config editor:

- providers are split into tabs
- each provider shows runtime health, cooldown state, recent errors, and candidate order
- `oauth` and `hybrid` providers can log in through the browser flow or import auth JSON directly

Uses:

- `/api/provider/oauth/start`
- `/api/provider/oauth/complete`
- `/api/provider/oauth/import`
- `/api/provider/oauth/accounts`
- `/api/provider/models`
- `/api/provider/runtime`
- `/api/provider/runtime/summary`

### MCP

Dedicated management page for MCP servers and discovered remote tools. It supports:

- adding and removing MCP servers
- switching between `stdio`, `http`, `streamable_http`, and `sse`
- editing `command`, `args`, `url`, `working_dir`, `permission`, and `package`
- checking whether the configured `command` exists
- suggesting install choices from the package value
- installing MCP servers with `npm`, `uv`, or `bun`
- viewing discovered `mcp__<server>__<tool>` tools

Recent changes also moved this page to a server-card plus modal-editor workflow:

- the main list shows compact server summaries
- create, edit, and install actions happen in the modal
- save writes config immediately
- discovered tools are separated from server configuration

Uses:

- `/api/tools`
- `/api/mcp/install`
- `/api/config`

### Logs

Recent logs and log streaming.

Uses:

- `/api/logs/live`
- `/api/logs/stream`
- `/api/logs/recent`

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

Inline `system_prompt` editing has also been removed from this page. The profile now expects `system_prompt_file` as the source of role definition.

### TaskAudit

Inspect task queue state and detailed audit records.

Recent versions also add a node dispatch audit view with:

- `used_transport`
- `fallback_from`
- `artifact_count`
- `artifact_kinds`
- `artifacts`

If the backend wires `SetNodeDispatchHandler(...)`, the page can also replay a node dispatch request.

Uses:

- `/api/task_queue`
- `/api/task_audit`
- `/api/node_dispatches`
- `/api/node_dispatches/replay`

### Nodes

Dedicated node detail workspace.

It currently shows:

- online state, version, OS/arch, endpoint, and tags
- capabilities, actions, and models
- remote agent tree
- P2P session health
- recent dispatch rows
- recent artifacts and raw JSON

Uses:

- `/api/nodes`
- `/api/node_dispatches`
- `/api/node_artifacts`

### NodeArtifacts

Node artifact listing page.

It supports:

- filtering by node / action / kind
- downloading a single artifact
- exporting filtered results
- deleting a single artifact
- triggering prune
- viewing the current retention summary

Uses:

- `/api/node_artifacts`
- `/api/node_artifacts/export`
- `/api/node_artifacts/download`
- `/api/node_artifacts/delete`
- `/api/node_artifacts/prune`

### EKG

Uses `/api/ekg_stats` to show runtime health trends.

For windows, rankings, error signatures, and escalation semantics, see:

- [EKG Guide](/en/guide/ekg)

## WebUI API Surface

Current registered endpoints:

- `/api/config`
- `/api/chat`
- `/api/chat/history`
- `/api/chat/stream`
- `/api/chat/live`
- `/api/runtime`
- `/api/version`
- `/api/upload`
- `/api/nodes`
- `/api/node_dispatches`
- `/api/node_dispatches/replay`
- `/api/node_artifacts`
- `/api/node_artifacts/export`
- `/api/node_artifacts/download`
- `/api/node_artifacts/delete`
- `/api/node_artifacts/prune`
- `/api/cron`
- `/api/skills`
- `/api/sessions`
- `/api/memory`
- `/api/subagent_profiles`
- `/api/subagents_runtime`
- `/api/subagents_runtime/live`
- `/api/tool_allowlist_groups`
- `/api/task_audit`
- `/api/task_queue`
- `/api/ekg_stats`
- `/api/exec_approvals`
- `/api/logs/stream`
- `/api/logs/recent`

`/api/nodes` now also includes:

- `p2p`
- `dispatches`
- `alerts`
- `artifact_retention`

Those fields are used by the Dashboard, Nodes, NodeArtifacts, and TaskAudit pages.

`/api/runtime` is now the live runtime snapshot websocket used by AppContext to aggregate:

- version
- nodes
- sessions
- task queue
- ekg summary
- subagent runtime
- provider runtime summary

## Build and Release

The recommended deployment model now treats WebUI as a separate frontend project:

1. build it from [YspCoder/clawgo-web](https://github.com/YspCoder/clawgo-web)
2. deploy it to your own static host or Pages setup
3. let the frontend call Gateway `/api/*` directly

The frontend lazy-loads routes and splits vendor bundles into manual chunks such as:

- `react-vendor`
- `motion`
- `icons`

That reduces how much code the initial page load has to fetch.
