# WebUI 控制台

## 技术栈

前端位于 `webui/`，基于：

- React 19
- React Router 7
- Vite 6
- TypeScript
- Tailwind CSS 4
- i18next

当前独立部署的前端仓库是：

- [YspCoder/clawgo-web](https://github.com/YspCoder/clawgo-web)

## 访问方式

当前文档以“WebUI 独立部署”为准，不再假设它由 Gateway 挂在 `/webui` 下。

```text
https://<your-webui-host>?token=<gateway.token>
```

常见接入方式：

- 在 WebUI 地址上带 `?token=<gateway.token>`
- 或由前端在请求 `/api/*` 时附带 `Authorization: Bearer <gateway.token>`

后端 API 仍然是 Gateway 暴露的 `/api/*`，只是前端不再要求和 Gateway 静态资源一起部署。

顶部 Header 最近还加了两个常用动作：

- GitHub 仓库入口
- 最新 release 版本检查

版本检查会直接对比当前 Gateway/WebUI 版本和 GitHub latest release。

另外，Header 和 runtime 初始化现在还会拿到当前二进制的 `compiled_channels`，供路由和配置页动态裁剪通道入口。

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

- `/api/chat`
- `/api/chat/history`
- `/api/chat/stream`
- `/api/chat/live`
- `/api/subagents_runtime`

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

最近这个页面还会订阅：

- `/api/subagents_runtime/live`

用于实时刷新：

- 选中任务的 thread / messages
- inbox 消息
- tooltip 对应 subagent 的最近 stream 预览

### Config

配置编辑工作台，支持：

- 表单模式
- Raw JSON 模式
- normalized schema 模式
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

最近通道配置页还有一个很实用的行为变化：

- 页面只显示当前二进制真实编译进来的 channels
- 如果你部署的是单通道变体，配置页不会再出现其他无效平台
- 如果你部署的是 `-nochannels` / `none` 变体，WebUI 会隐藏 channel 配置入口并回退到通用配置页

后端接口：

- `GET /api/config`
- `POST /api/config`

最近这个页面保存配置时会优先走 normalized schema：

- `GET /api/config?mode=normalized`
- `POST /api/config?mode=normalized`

这层视图会把配置拆成：

- `core.*`
- `runtime.*`

更适合前端按“核心设置 / 运行时策略”组织表单。

### Providers

独立的 provider 工作台，专门管理：

- `models.providers.*`
- bearer / oauth / hybrid 几种鉴权模式
- provider runtime 摘要与候选排序
- OAuth 账户登录、导入、刷新、删除和冷却清理

相比把 provider 塞在通用配置页里，这个页面更偏运维视角：

- 顶部按 provider 分 tab
- 每个 provider 都能看 runtime health、cooldown、最近错误和候选顺序
- `oauth` / `hybrid` 模式下可以直接走浏览器登录或导入 auth JSON

接口：

- `/api/provider/oauth/start`
- `/api/provider/oauth/complete`
- `/api/provider/oauth/import`
- `/api/provider/oauth/accounts`
- `/api/provider/models`
- `/api/provider/runtime`
- `/api/provider/runtime/summary`

### MCP

用于管理 MCP server 和查看已发现的远端工具，支持：

- 新增/删除 MCP server
- 在 `stdio` / `http` / `streamable_http` / `sse` 间切换 transport
- 编辑 `command`、`args`、`url`、`working_dir`、`permission`、`package`
- 检查 `command` 是否存在
- 根据 package 给出建议安装方式
- 通过 `npm`、`uv`、`bun` 安装 MCP server 对应包
- 查看已发现的 `mcp__<server>__<tool>` 工具

最近这个页面改成了“server 卡片 + 弹窗编辑”模式：

- 主列表只展示 server 摘要
- 新建、编辑、安装都在弹窗里完成
- 保存会立即写回配置
- discovered tools 独立显示，便于区分“配置”和“发现结果”

接口：

- `/api/tools`
- `/api/mcp/install`
- `/api/config`

### Logs

用于实时日志流和最近日志查看。

后端接口：

- `/api/logs/live`
- `/api/logs/stream`
- `/api/logs/recent`

### Skills

用于查看、安装、刷新 skills，并检测例如 clawhub 等依赖状态。

接口：

- `/api/skills`

### Memory

查看和编辑 memory 文件。

接口：

- `/api/memory`

### Cron

管理定时任务，支持：

- list
- create
- update
- enable
- disable
- delete

接口：

- `/api/cron`

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

最近这里已经移除了 inline `system_prompt` 编辑入口，保存时要求：

- 必须提供 `system_prompt_file`
- 路径要能在 workspace 内解析
- 角色变化要对应 prompt 文件内容一起维护

接口：

- `/api/subagent_profiles`
- `/api/tool_allowlist_groups`
- `/api/subagents_runtime`

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

- `/api/task_queue`
- `/api/task_audit`
- `/api/node_dispatches`
- `/api/node_dispatches/replay`

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

- `/api/nodes`
- `/api/node_dispatches`
- `/api/node_artifacts`

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

- `/api/node_artifacts`
- `/api/node_artifacts/export`
- `/api/node_artifacts/download`
- `/api/node_artifacts/delete`
- `/api/node_artifacts/prune`

### EKG

对应 `/api/ekg_stats`，用于展示运行时状态趋势。

如果你要单独理解窗口、排名项、错误签名和 escalation 的含义，直接看：

- [EKG 使用篇](/guide/ekg)

### Exec Approvals / Logs / Log Codes

这几页用于运维和审计辅助。

## WebUI API 总表

当前后端显式注册了这些接口：

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

`/api/nodes` 最近除了 `nodes` 和 `trees` 之外，还会带上：

- `p2p`
- `dispatches`
- `alerts`
- `artifact_retention`

用于 Dashboard、Nodes、NodeArtifacts 和 TaskAudit 页面展示。

`/api/runtime` 现在是一个基于 websocket 的 live runtime snapshot 入口，AppContext 会用它聚合：

- version
- nodes
- sessions
- task queue
- ekg summary
- subagents runtime
- providers runtime summary

## 构建与发布

当前更推荐把 WebUI 当成独立前端项目部署：

1. 从 [YspCoder/clawgo-web](https://github.com/YspCoder/clawgo-web) 构建前端
2. 部署到自己的静态站点或 Pages
3. 让前端直接请求 Gateway 的 `/api/*`

前端路由已经按页面懒加载，并在 Vite 构建里拆出了手工 chunk，例如：

- `react-vendor`
- `motion`
- `icons`

这样首屏不会一次把所有页面代码都下载下来。
