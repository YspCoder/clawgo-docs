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

- `/webui/api/chat`
- `/webui/api/chat/history`
- `/webui/api/chat/stream`
- `/webui/api/chat/live`
- `/webui/api/subagents_runtime`

Recent versions also subscribe to:

- `/webui/api/subagents_runtime/live`

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
- hot-reload field filtering
- diff view
- risky change confirmation

Risk confirmation now also covers sensitive fields on named providers, not only the default provider:

- `providers.proxy.api_base`
- `providers.proxy.api_key`
- `providers.proxies.<name>.api_base`
- `providers.proxies.<name>.api_key`

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

- `/webui/api/task_queue`
- `/webui/api/task_audit`
- `/webui/api/node_dispatches`
- `/webui/api/node_dispatches/replay`

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

- `/webui/api/nodes`
- `/webui/api/node_dispatches`
- `/webui/api/node_artifacts`

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

- `/webui/api/node_artifacts`
- `/webui/api/node_artifacts/export`
- `/webui/api/node_artifacts/download`
- `/webui/api/node_artifacts/delete`
- `/webui/api/node_artifacts/prune`

### EKG

Uses `/webui/api/ekg_stats` to show runtime health trends.

For windows, rankings, error signatures, and escalation semantics, see:

- [EKG Guide](/en/guide/ekg)

## WebUI API Surface

Current registered endpoints:

- `/webui/api/config`
- `/webui/api/chat`
- `/webui/api/chat/history`
- `/webui/api/chat/stream`
- `/webui/api/chat/live`
- `/webui/api/runtime`
- `/webui/api/version`
- `/webui/api/upload`
- `/webui/api/nodes`
- `/webui/api/node_dispatches`
- `/webui/api/node_dispatches/replay`
- `/webui/api/node_artifacts`
- `/webui/api/node_artifacts/export`
- `/webui/api/node_artifacts/download`
- `/webui/api/node_artifacts/delete`
- `/webui/api/node_artifacts/prune`
- `/webui/api/cron`
- `/webui/api/skills`
- `/webui/api/sessions`
- `/webui/api/memory`
- `/webui/api/subagent_profiles`
- `/webui/api/subagents_runtime`
- `/webui/api/subagents_runtime/live`
- `/webui/api/tool_allowlist_groups`
- `/webui/api/task_audit`
- `/webui/api/task_queue`
- `/webui/api/ekg_stats`
- `/webui/api/exec_approvals`
- `/webui/api/logs/stream`
- `/webui/api/logs/recent`

`/webui/api/nodes` now also includes:

- `p2p`
- `dispatches`
- `alerts`
- `artifact_retention`

Those fields are used by the Dashboard, Nodes, NodeArtifacts, and TaskAudit pages.

`/webui/api/runtime` is now the live runtime snapshot websocket used by AppContext to aggregate:

- version
- nodes
- sessions
- task queue
- ekg summary
- subagent runtime

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
