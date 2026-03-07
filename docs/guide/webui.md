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

### Config

配置编辑工作台，支持：

- 表单模式
- Raw JSON 模式
- 按热更新字段过滤
- 差异对比
- 提交高风险配置前确认

后端接口：

- `GET /webui/api/config`
- `POST /webui/api/config`

### MCP

用于管理 MCP server 和查看已发现的远端工具，支持：

- 新增/删除 MCP server
- 编辑 `command`、`args`、`working_dir`、`package`
- 通过 npm 安装 MCP server 对应包
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

接口：

- `/webui/api/task_queue`
- `/webui/api/task_audit`

### EKG

对应 `/webui/api/ekg_stats`，用于展示运行时状态趋势。

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

## 构建与嵌入

WebUI 不是独立部署前提。仓库里的 Makefile 会：

1. 构建 `webui/dist`
2. 同步到 `cmd/clawgo/workspace/webui`
3. 让 Go 的 `embed` 机制在发布时带上这些静态资源

因此 release 包同时能分发 runtime 和控制台。
