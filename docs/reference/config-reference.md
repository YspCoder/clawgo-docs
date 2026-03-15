# 配置参考

这页是对 [配置说明](/guide/configuration) 的字段索引版。

## 顶层键

```json
{
  "agents": {},
  "channels": {},
  "models": {},
  "gateway": {},
  "cron": {},
  "tools": {},
  "logging": {},
  "sentinel": {},
  "memory": {}
}
```

## `agents.defaults`

| 字段 | 作用 |
| --- | --- |
| `workspace` | 工作区路径 |
| `model.primary` | 默认模型引用，格式为 `provider/model` |
| `max_tokens` | 默认 token 上限 |
| `temperature` | 默认温度 |
| `max_tool_iterations` | 工具迭代上限 |

## `agents.defaults.heartbeat`

| 字段 | 作用 |
| --- | --- |
| `enabled` | 是否启用心跳 |
| `every_sec` | 心跳周期 |
| `ack_max_chars` | ACK 最大字符数 |
| `prompt_template` | 心跳提示模板 |

## `agents.defaults.context_compaction`

| 字段 | 作用 |
| --- | --- |
| `enabled` | 是否启用压缩 |
| `mode` | `summary` / `responses_compact` / `hybrid` |
| `trigger_messages` | 触发阈值 |
| `keep_recent_messages` | 保留最近消息数 |
| `max_summary_chars` | 摘要最大长度 |
| `max_transcript_chars` | 转录最大长度 |

## `agents.defaults.execution`

| 字段 | 作用 |
| --- | --- |
| `run_state_ttl_seconds` | 运行态缓存 TTL |
| `run_state_max` | 运行态缓存数量上限 |
| `tool_parallel_safe_names` | 可安全并发的工具名 |
| `tool_max_parallel_calls` | 工具并发调用上限 |

## `agents.agents.<id>`

| 字段 | 作用 |
| --- | --- |
| `enabled` | 是否启用 |
| `kind` | actor kind，例如 `npc` |
| `type` | actor type，例如 `agent` |
| `transport` | `local` 或 `node` |
| `node_id` | 远端节点 ID |
| `parent_agent_id` | 父 actor |
| `display_name` | 显示名称 |
| `role` | 角色 |
| `description` | 描述 |
| `persona` | NPC 人设 |
| `traits` | 特征标签 |
| `faction` | 阵营 |
| `home_location` | NPC 初始地点 |
| `default_goals` | 默认目标 |
| `perception_scope` | 感知范围 |
| `schedule_hint` | 调度提示 |
| `world_tags` | 世界标签 |
| `prompt_file` | prompt 文件 |
| `memory_namespace` | 记忆命名空间 |
| `tools.allowlist` | 工具白名单 |
| `tools.denylist` | 工具黑名单 |
| `tools.max_parallel_calls` | actor 级工具并发上限 |
| `runtime.provider` | actor 绑定 provider |
| `runtime.model` | actor 绑定 model |
| `runtime.timeout_sec` | 超时秒数 |
| `runtime.max_retries` | 最大重试次数 |
| `runtime.retry_backoff_ms` | 重试退避 |
| `runtime.max_task_chars` | 最大任务长度 |
| `runtime.max_result_chars` | 最大结果长度 |
| `runtime.max_parallel_runs` | actor 运行并发上限 |

说明：

- 世界角色通过 `kind: "npc"` 进入 runtime
- 执行型 agent 通常使用 `prompt_file`
- `prompt_file` 必须是 workspace 内相对路径

## `channels`

公共字段：

| 字段 | 作用 |
| --- | --- |
| `inbound_message_id_dedupe_ttl_seconds` | 入站消息 ID 去重时间 |
| `inbound_content_dedupe_window_seconds` | 入站内容去重窗口 |
| `outbound_dedupe_window_seconds` | 出站去重窗口 |

子项：

- `telegram`
- `discord`
- `feishu`
- `dingtalk`
- `whatsapp`
- `qq`
- `maixcam`

## `models.providers.<name>`

| 字段 | 作用 |
| --- | --- |
| `api_key` | API 密钥 |
| `api_base` | API 基地址 |
| `models` | 模型列表 |
| `supports_responses_compact` | 是否支持 compact responses |
| `auth` | `bearer` / `oauth` / `hybrid` / `none` |
| `timeout_sec` | 超时秒数 |
| `runtime_persist` | 是否持久化 provider runtime |
| `runtime_history_file` | runtime 历史文件 |
| `runtime_history_max` | 历史上限 |
| `oauth.*` | OAuth 配置 |
| `responses.*` | responses API 参数 |

## `gateway`

| 字段 | 作用 |
| --- | --- |
| `host` | 监听地址 |
| `port` | 监听端口 |
| `token` | 网关访问令牌 |

## `gateway.nodes.p2p`

| 字段 | 作用 |
| --- | --- |
| `enabled` | 是否启用节点 P2P |
| `transport` | `websocket_tunnel` / `webrtc` |
| `stun_servers` | STUN URL 列表 |
| `ice_servers` | 结构化 ICE server 列表 |

## `gateway.nodes.dispatch`

| 字段 | 作用 |
| --- | --- |
| `prefer_local` | 优先本地执行 |
| `prefer_p2p` | 优先 P2P |
| `allow_relay_fallback` | P2P 失败时允许 relay 回退 |
| `action_tags` | action 必须命中的 node tags |
| `agent_tags` | actor 必须命中的 node tags |
| `allow_actions` | action 允许的 node tags |
| `deny_actions` | action 禁止的 node tags |
| `allow_agents` | actor 允许的 node tags |
| `deny_agents` | actor 禁止的 node tags |

## `gateway.nodes.artifacts`

| 字段 | 作用 |
| --- | --- |
| `enabled` | 是否启用节点产物保留 |
| `keep_latest` | 保留最近数量 |
| `retain_days` | 最长保留天数 |
| `prune_on_read` | 读取时自动清理 |

## `tools.mcp`

| 字段 | 作用 |
| --- | --- |
| `enabled` | MCP 总开关 |
| `request_timeout_sec` | 请求超时 |
| `servers` | MCP server 声明 |

## `tools.mcp.servers.<name>`

| 字段 | 作用 |
| --- | --- |
| `enabled` | 是否启用 |
| `transport` | `stdio` / `http` / `streamable_http` / `sse` |
| `command` | `stdio` 启动命令 |
| `args` | `stdio` 启动参数 |
| `url` | 远端 transport URL |
| `env` | 环境变量覆盖 |
| `working_dir` | 工作目录 |
| `permission` | `workspace` / `full` |
| `description` | 描述 |
| `package` | 安装包名 |
| `installer` | `npx` / `uvx` / `bunx` 等安装器 |
| `mcp_server_checks` | 命令检查或安装前置条件 |
