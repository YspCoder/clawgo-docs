# WebUI API 参考

这页按接口分组整理 `pkg/api/server.go` 当前显式注册的 `/api/*` 能力。

## 鉴权

访问前提：

- URL 上带 `?token=<gateway.token>`，或
- 请求头带 `Authorization: Bearer <gateway.token>`

## 配置类

### `GET /api/config`

读取当前配置。

### `POST /api/config`

写入配置，并触发后续 hook。WebUI 侧支持高风险变更确认。

最近的实现里，高风险字段会动态收集，除了默认 provider 之外，也包括：

- `providers.proxies.<name>.api_base`
- `providers.proxies.<name>.api_key`

当这些字段被改动且未确认时，接口会返回 `requires_confirm: true`。

### `GET /api/version`

返回 Gateway/WebUI 版本信息。

WebUI Header 里的“检查最新版本”按钮会用当前返回值和 GitHub latest release 做对比。

最近这里还增加了：

- `compiled_channels`

用于告诉前端“当前二进制实际编译进了哪些 channel”。

## 聊天与上传

### `POST /api/chat`

向指定 session 投递消息。

常见用途：

- 主聊天面板发送消息
- 携带上传文件后的媒体引用

### `GET /api/chat/history`

读取指定 session 历史消息。

### `GET /api/chat/stream`

提供聊天流式输出或事件流。

### `GET /api/chat/live`

基于 websocket 的聊天流接口。

发送首条 JSON 消息后，会按块返回：

- `chat_chunk`
- `chat_done`
- `chat_error`

### `POST /api/upload`

上传附件，返回服务端可引用路径。

## 资源与运行态

### `GET /api/tools`

返回工具目录。当前 MCP 页面会读取：

- `tools`
- `mcp_tools`
- `mcp_server_checks`

### `GET /api/runtime`

基于 websocket 的 runtime 汇总快照。

返回类型：

- `runtime_snapshot`

当前聚合：

- version
- nodes
- sessions
- task queue
- ekg summary
- subagents runtime
- providers runtime summary

其中 `version` 快照里现在也会带：

- `compiled_channels`

WebUI 会用它来裁剪 channel settings 路由和菜单。

### `GET /api/nodes`

查询节点与拓扑相关信息。

最近返回值里还增加了：

- `p2p`
- `dispatches`
- `alerts`
- `artifact_retention`

其中会包含 Node P2P 的运行态摘要，例如：

- `enabled`
- `transport`
- `active_sessions`
- `configured_stun`
- `configured_ice`
- `nodes[]` 中的 WebRTC 会话健康字段

节点摘要里也会带出：

- 节点 tags
- 最近 dispatch 统计
- 节点告警
- 产物 retention 摘要

### `GET /api/node_dispatches`

读取节点派发审计。

典型字段：

- `used_transport`
- `fallback_from`
- `artifact_count`
- `artifact_kinds`
- `artifacts`

### `POST /api/node_dispatches/replay`

把一条历史节点派发重新送回当前 node dispatch handler。

适合：

- 验证新的路由策略
- 回放一次失败请求
- 检查 P2P / relay 选择变化

### `GET /api/node_artifacts`

读取节点产物列表与 retention 摘要。

支持按这些维度过滤：

- `node`
- `action`
- `kind`
- `limit`

### `GET /api/node_artifacts/export`

导出当前筛选命中的节点产物。

### `GET /api/node_artifacts/download`

下载单个节点产物。

### `POST /api/node_artifacts/delete`

删除单个节点产物记录及关联文件。

### `POST /api/node_artifacts/prune`

按筛选条件触发一次 prune。

请求体里常见字段：

- `node`
- `action`
- `kind`
- `keep_latest`

### `GET /api/sessions`

查询 session 列表与历史。

### `GET/POST /api/memory`

查看或修改 memory 文件。

### `GET/POST /api/subagent_profiles`

管理 profile 化 subagent。

### `GET/POST /api/subagents_runtime`

查询 subagent runtime 状态，或执行运行时动作。

WebUI 当前会用它做：

- 读取内部 stream
- 查询任务列表
- 读取 prompt file
- 获取 registry / topology

### `GET /api/subagents_runtime/live`

基于 websocket 的 subagent 实时详情接口。

常用 query 参数：

- `task_id`
- `preview_task_id`

返回类型：

- `subagents_live`

当前会带：

- 选中任务对应的 thread / messages
- inbox
- preview task 对应的 stream 摘要

### `GET /api/tool_allowlist_groups`

获取工具白名单分组定义，供 profile 编辑器使用。

### `POST /api/provider/oauth/start`

启动一次 provider OAuth 登录流，返回授权地址和 flow id。

### `POST /api/provider/oauth/complete`

提交 OAuth 回调参数，完成一次登录并把 credential 信息写回 provider 配置。

### `POST /api/provider/oauth/import`

导入 auth JSON，并更新 provider 的 credential 与 models。

### `GET/POST /api/provider/oauth/accounts`

读取或维护某个 provider 的 OAuth 账户。

`POST` 常见动作：

- `refresh`
- `delete`
- `clear_cooldown`

### `GET/POST /api/provider/runtime`

读取 provider runtime 明细，或执行运维动作。

`POST` 常见动作：

- `clear_api_cooldown`
- `clear_history`
- `refresh_now`
- `rerank`

### `GET /api/provider/runtime/summary`

返回 provider runtime 汇总，供 Providers 页面总览使用。

### `POST /api/mcp/install`

安装一个 MCP server 包，并返回解析出的可执行文件信息。

请求体除了 `package` 之外，还支持：

- `installer`

当前安装器包括：

- `npm`
- `uv`
- `bun`

典型返回值包括：

- `package`
- `output`
- `bin_name`
- `bin_path`

## 调度与自动化

### `GET/POST /api/cron`

支持：

- `list`
- `get`
- `create`
- `update`
- `enable`
- `disable`
- `delete`

### `GET/POST /api/skills`

查看、安装、卸载或刷新 skills。

## 审计与日志

### `GET /api/task_audit`

读取任务审计明细。

### `GET /api/task_queue`

读取任务队列或近期任务状态。

### `GET /api/ekg_stats`

读取运行态 EKG 统计。

### `GET/POST /api/exec_approvals`

与执行审批流相关。

### `GET /api/logs/recent`

读取最近日志。

### `GET /api/logs/stream`

以流的方式读取日志。

## 前端页面与接口对应

| 页面 | 主要接口 |
| --- | --- |
| MCP | `tools`, `mcp/install`, `config` |
| Chat | `chat`, `chat/history`, `chat/stream`, `chat/live`, `subagents_runtime` |
| Config | `config` |
| Cron | `cron` |
| Skills | `skills` |
| Memory | `memory` |
| SubagentProfiles | `subagent_profiles`, `tool_allowlist_groups`, `subagents_runtime` |
| Subagents | `runtime`, `nodes`, `subagents_runtime`, `subagents_runtime/live` |
| Nodes | `nodes`, `node_dispatches`, `node_artifacts` |
| NodeArtifacts | `node_artifacts`, `node_artifacts/export`, `node_artifacts/download`, `node_artifacts/delete`, `node_artifacts/prune` |
| TaskAudit | `task_queue`, `task_audit`, `node_dispatches`, `node_dispatches/replay` |
| EKG | `ekg_stats` |
| Logs | `logs/recent`, `logs/stream` |

## 使用建议

如果你要二次开发前端，建议优先把这些接口按“配置、聊天、运行态、审计”四组封装，而不是每个页面各自散着调。
