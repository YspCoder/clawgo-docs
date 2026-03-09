# WebUI 控制台

## 技术栈

前端位于 `webui/`，基于：

- React 19
- React Router 7
- Vite 6
- TypeScript
- Tailwind CSS 4
- i18next

## 访问方式

正常情况下由 Gateway 托管：

```text
http://<host>:<port>/webui?token=<gateway.token>
```

Gateway 会在 `/webui` 首次访问时写入 `clawgo_webui_token` Cookie。

## 页面结构

从 `webui/src/pages` 可以看出控制台并不是单一聊天页，而是运维工作台。

### Dashboard

总览页面，展示运行时关键统计。

最近 Dashboard 还会展示 Node P2P 卡片，内容包括：

- 当前 transport
- 活跃会话数
- 重试次数
- STUN / ICE 配置数量
- 节点派发的产物数量与预览摘要

### Chat

支持两类视图：

- 主对话历史
- subagent 内部流

它会调用：

- `/webui/api/chat`
- `/webui/api/chat/history`
- `/webui/api/chat/stream`
- `/webui/api/subagents_runtime`

这也是最能体现“主通道与内部协作流分离”的页面。

### Subagents

用于查看统一 agent 拓扑、任务、线程、消息和节点分支。

它不仅展示本地 subagent，也展示：

- node-backed branch
- node 在线状态
- agent tree
- stream items

最近的界面也会把工具可见性一起呈现出来，包括：

- tool visibility mode
- inherited tools
- allowlist/denylist 生效结果

tooltip 预览也做了收敛，当前更偏向展示最近一条内部流，而不是一次塞进多条摘要。

### Config

配置编辑工作台，支持：

- 表单模式
- Raw JSON 模式
- 按热更新字段过滤
- 差异对比
- 提交高风险配置前确认

高风险确认现在会覆盖命名 provider 的敏感字段，而不只是默认 provider：

- `providers.proxy.api_base`
- `providers.proxy.api_key`
- `providers.proxies.<name>.api_base`
- `providers.proxies.<name>.api_key`

当切到 `gateway` 配置页时，表单模式现在还能直接编辑 Node P2P：

- `enabled`
- `transport`
- `stun_servers`
- `ice_servers[].urls`
- `ice_servers[].username`
- `ice_servers[].credential`

同一页里也能直接维护：

- `gateway.nodes.dispatch`
- `gateway.nodes.artifacts`

其中包括：

- `prefer_local`
- `prefer_p2p`
- `allow_relay_fallback`
- `action_tags` / `agent_tags`
- `allow_actions` / `deny_actions`
- `allow_agents` / `deny_agents`
- `keep_latest`
- `retain_days`
- `prune_on_read`

后端接口：

- `GET /webui/api/config`
- `POST /webui/api/config`

### MCP

用于管理 MCP server 和查看已发现的远端工具，支持：

- 新增/删除 MCP server
- 在 `stdio` / `http` / `streamable_http` / `sse` 间切换 transport
- 编辑 `command`、`args`、`url`、`working_dir`、`permission`、`package`
- 检查 `command` 是否存在
- 根据 package 给出建议安装方式
- 通过 `npm`、`uv`、`bun` 安装 MCP server 对应包
- 查看已发现的 `mcp__<server>__<tool>` 工具

接口：

- `/webui/api/tools`
- `/webui/api/mcp/install`
- `/webui/api/config`

### Logs

用于实时日志流和最近日志查看。

后端接口：

- `/webui/api/logs/stream`
- `/webui/api/logs/recent`

### Skills

用于查看、安装、刷新 skills，并检测例如 clawhub 等依赖状态。

接口：

- `/webui/api/skills`

### Memory

查看和编辑 memory 文件。

接口：

- `/webui/api/memory`

### Cron

管理定时任务，支持：

- list
- create
- update
- enable
- disable
- delete

接口：

- `/webui/api/cron`

### SubagentProfiles

对 profile 化的 subagent 进行管理，支持：

- 新建 profile
- 修改 allowlist
- 编辑 `system_prompt_file`
- 启停 profile

当前页面也会显式展示工具继承关系，尤其是：

- inherited tools
- tool visibility mode
- `skill_exec` 会被自动继承给 subagent

接口：

- `/webui/api/subagent_profiles`
- `/webui/api/tool_allowlist_groups`
- `/webui/api/subagents_runtime`

### TaskAudit

查看任务队列与审计记录，字段非常丰富，包括：

- `task_id`
- `status`
- `source`
- `duration_ms`
- `retry_count`
- `provider`
- `model`
- `input_preview`
- `logs`
- `media_items`

最近这个页面还加了 node dispatch 审计视图，能直接看到：

- `used_transport`
- `fallback_from`
- `artifact_count`
- `artifact_kinds`
- `artifacts`

如果后端挂了 `SetNodeDispatchHandler(...)`，页面上还能直接 replay 一次节点派发请求。

接口：

- `/webui/api/task_queue`
- `/webui/api/task_audit`
- `/webui/api/node_dispatches`
- `/webui/api/node_dispatches/replay`

### Nodes

节点详情工作台。

当前会展示：

- 节点在线状态、版本、OS/arch、endpoint、tags
- capabilities、actions、models
- 远端 agent tree
- P2P 会话健康信息
- 最近派发记录
- 最近产物与原始 JSON

接口：

- `/webui/api/nodes`
- `/webui/api/node_dispatches`
- `/webui/api/node_artifacts`

### NodeArtifacts

节点产物列表页。

支持：

- 按 node / action / kind 过滤
- 下载单个产物
- 导出筛选结果
- 删除单个产物
- 触发 prune
- 查看当前 retention 摘要

接口：

- `/webui/api/node_artifacts`
- `/webui/api/node_artifacts/export`
- `/webui/api/node_artifacts/download`
- `/webui/api/node_artifacts/delete`
- `/webui/api/node_artifacts/prune`

### EKG

对应 `/webui/api/ekg_stats`，用于展示运行时状态趋势。

如果你要单独理解窗口、排名项、错误签名和 escalation 的含义，直接看：

- [EKG 使用篇](/guide/ekg)

### Exec Approvals / Logs / Log Codes

这几页用于运维和审计辅助。

## WebUI API 总表

当前后端显式注册了这些接口：

- `/webui/api/config`
- `/webui/api/chat`
- `/webui/api/chat/history`
- `/webui/api/chat/stream`
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
- `/webui/api/tool_allowlist_groups`
- `/webui/api/task_audit`
- `/webui/api/task_queue`
- `/webui/api/ekg_stats`
- `/webui/api/exec_approvals`
- `/webui/api/logs/stream`
- `/webui/api/logs/recent`

`/webui/api/nodes` 最近除了 `nodes` 和 `trees` 之外，还会带上：

- `p2p`
- `dispatches`
- `alerts`
- `artifact_retention`

用于 Dashboard、Nodes、NodeArtifacts 和 TaskAudit 页面展示。

## 构建与嵌入

WebUI 不是独立部署前提。仓库里的 Makefile 会：

1. 构建 `webui/dist`
2. 同步到 `cmd/clawgo/workspace/webui`
3. 让 Go 的 `embed` 机制在发布时带上这些静态资源

最近前端路由也改成了按页面懒加载，并在 Vite 构建里拆出了手工 chunk，例如：

- `react-vendor`
- `motion`
- `icons`

这样首屏不会一次把所有页面代码都下载下来。

因此 release 包同时能分发 runtime 和控制台。
