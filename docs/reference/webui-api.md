# WebUI API 参考

这页按接口分组整理 `pkg/api/server.go` 当前显式注册的 `/webui/api/*` 能力。

## 鉴权

访问前提：

- URL 上带 `?token=<gateway.token>`，或
- 先访问 `/webui`，由服务端写入 token Cookie

## 配置类

### `GET /webui/api/config`

读取当前配置。

### `POST /webui/api/config`

写入配置，并触发后续 hook。WebUI 侧支持高风险变更确认。

最近的实现里，高风险字段会动态收集，除了默认 provider 之外，也包括：

- `providers.proxies.<name>.api_base`
- `providers.proxies.<name>.api_key`

当这些字段被改动且未确认时，接口会返回 `requires_confirm: true`。

### `GET /webui/api/version`

返回 Gateway/WebUI 版本信息。

## 聊天与上传

### `POST /webui/api/chat`

向指定 session 投递消息。

常见用途：

- 主聊天面板发送消息
- 携带上传文件后的媒体引用

### `GET /webui/api/chat/history`

读取指定 session 历史消息。

### `GET /webui/api/chat/stream`

提供聊天流式输出或事件流。

### `POST /webui/api/upload`

上传附件，返回服务端可引用路径。

## 资源与运行态

### `GET /webui/api/tools`

返回工具目录。当前 MCP 页面会读取：

- `tools`
- `mcp_tools`
- `mcp_server_checks`

### `GET /webui/api/nodes`

查询节点与拓扑相关信息。

### `GET /webui/api/sessions`

查询 session 列表与历史。

### `GET/POST /webui/api/memory`

查看或修改 memory 文件。

### `GET/POST /webui/api/subagent_profiles`

管理 profile 化 subagent。

### `GET/POST /webui/api/subagents_runtime`

查询 subagent runtime 状态，或执行运行时动作。

WebUI 当前会用它做：

- 读取内部 stream
- 查询任务列表
- 读取 prompt file
- 获取 registry / topology

### `GET /webui/api/tool_allowlist_groups`

获取工具白名单分组定义，供 profile 编辑器使用。

### `POST /webui/api/mcp/install`

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

### `GET/POST /webui/api/cron`

支持：

- `list`
- `get`
- `create`
- `update`
- `enable`
- `disable`
- `delete`

### `GET/POST /webui/api/skills`

查看、安装、卸载或刷新 skills。

## 审计与日志

### `GET /webui/api/task_audit`

读取任务审计明细。

### `GET /webui/api/task_queue`

读取任务队列或近期任务状态。

### `GET /webui/api/ekg_stats`

读取运行态 EKG 统计。

### `GET/POST /webui/api/exec_approvals`

与执行审批流相关。

### `GET /webui/api/logs/recent`

读取最近日志。

### `GET /webui/api/logs/stream`

以流的方式读取日志。

## 前端页面与接口对应

| 页面 | 主要接口 |
| --- | --- |
| MCP | `tools`, `mcp/install`, `config` |
| Chat | `chat`, `chat/history`, `chat/stream`, `subagents_runtime` |
| Config | `config` |
| Cron | `cron` |
| Skills | `skills` |
| Memory | `memory` |
| SubagentProfiles | `subagent_profiles`, `tool_allowlist_groups`, `subagents_runtime` |
| Subagents | `nodes`, `subagents_runtime` |
| TaskAudit | `task_queue`, `task_audit` |
| EKG | `ekg_stats` |
| Logs | `logs/recent`, `logs/stream` |

## 使用建议

如果你要二次开发前端，建议优先把这些接口按“配置、聊天、运行态、审计”四组封装，而不是每个页面各自散着调。
