# 配置参考

这页是对 [配置说明](/guide/configuration) 的压缩索引版，更偏“字段手册”。

## 顶层键

```json
{
  "agents": {},
  "channels": {},
  "providers": {},
  "gateway": {},
  "cron": {},
  "tools": {},
  "logging": {},
  "sentinel": {},
  "memory": {}
}
```

## agents

### `agents.defaults`

| 字段 | 作用 |
| --- | --- |
| `workspace` | 工作区路径 |
| `proxy` | 默认 provider 名称 |
| `proxy_fallbacks` | provider 回退链 |
| `max_tokens` | 默认 token 上限 |
| `temperature` | 默认温度 |
| `max_tool_iterations` | 单轮工具迭代上限 |

### `agents.defaults.heartbeat`

| 字段 | 作用 |
| --- | --- |
| `enabled` | 是否开启心跳 |
| `every_sec` | 心跳周期 |
| `ack_max_chars` | ACK 最大字符数 |
| `prompt_template` | 心跳提示模板 |

### `agents.defaults.context_compaction`

| 字段 | 作用 |
| --- | --- |
| `enabled` | 是否启用压缩 |
| `mode` | `summary` / `responses_compact` / `hybrid` |
| `trigger_messages` | 触发压缩的消息数 |
| `keep_recent_messages` | 保留的最近消息数 |
| `max_summary_chars` | 摘要最大字符数 |
| `max_transcript_chars` | 转录最大字符数 |

### `agents.defaults.execution`

| 字段 | 作用 |
| --- | --- |
| `run_state_ttl_seconds` | 运行态缓存 TTL |
| `run_state_max` | 运行态缓存数量上限 |
| `tool_parallel_safe_names` | 可安全并发的工具名 |
| `tool_max_parallel_calls` | 工具并发调用上限 |

### `agents.router`

| 字段 | 作用 |
| --- | --- |
| `enabled` | 是否启用路由器 |
| `main_agent_id` | 主 agent ID |
| `strategy` | `rules_first` / `round_robin` / `manual` |
| `policy.intent_max_input_chars` | 意图识别输入上限 |
| `policy.max_rounds_without_user` | 无用户参与时最大轮数 |
| `rules` | 关键字到 agent 的规则 |
| `max_hops` | 最大跳数 |
| `default_timeout_sec` | 默认超时 |
| `default_wait_reply` | 是否等待回复 |
| `sticky_thread_owner` | 是否粘住 thread owner |

### `agents.subagents.<id>`

| 字段 | 作用 |
| --- | --- |
| `enabled` | 是否启用 |
| `type` | `router` / `worker` |
| `transport` | 本地或 `node` |
| `node_id` | 节点 ID |
| `parent_agent_id` | 父 agent |
| `notify_main_policy` | 主代理通知策略 |
| `display_name` | 显示名称 |
| `role` | 角色 |
| `system_prompt` | 直接 prompt |
| `system_prompt_file` | prompt 文件路径 |
| `memory_namespace` | 记忆命名空间 |
| `accept_from` | 接收来源 |
| `can_talk_to` | 允许通信对象 |
| `tools.allowlist` | 工具白名单 |
| `tools.denylist` | 工具黑名单 |
| `runtime.*` | 模型、重试、并发等运行时参数 |

## channels

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

## providers

### `providers.proxy` / `providers.proxies.<name>`

| 字段 | 作用 |
| --- | --- |
| `api_key` | API 密钥 |
| `api_base` | API 基地址 |
| `models` | 模型列表 |
| `supports_responses_compact` | 是否支持 compact responses |
| `auth` | `bearer` / `oauth` / `none` |
| `timeout_sec` | 超时秒数 |
| `responses.*` | responses API 细节参数 |

## gateway

| 字段 | 作用 |
| --- | --- |
| `host` | 监听地址 |
| `port` | 监听端口 |
| `token` | 网关访问令牌 |

### `gateway.nodes.p2p`

| 字段 | 作用 |
| --- | --- |
| `enabled` | 是否启用节点 P2P |
| `transport` | `websocket_tunnel` / `webrtc` |
| `stun_servers` | STUN URL 列表 |
| `ice_servers` | 结构化 ICE server 列表 |

### `gateway.nodes.p2p.ice_servers[]`

| 字段 | 作用 |
| --- | --- |
| `urls` | `stun:` / `turn:` / `turns:` URL 列表 |
| `username` | TURN 用户名 |
| `credential` | TURN 凭证 |

## cron

| 字段 | 作用 |
| --- | --- |
| `min_sleep_sec` | worker 最小休眠 |
| `max_sleep_sec` | worker 最大休眠 |
| `retry_backoff_base_sec` | 重试退避基数 |
| `retry_backoff_max_sec` | 重试退避上限 |
| `max_consecutive_failure_retries` | 最大连续失败重试数 |
| `max_workers` | worker 数量 |

## tools

### `tools.shell`

| 字段 | 作用 |
| --- | --- |
| `enabled` | 是否启用 |
| `working_dir` | 默认工作目录 |
| `timeout` | 超时 |
| `auto_install_missing` | 缺依赖是否自动安装 |
| `sandbox.enabled` | 是否启用 sandbox |
| `sandbox.image` | sandbox 镜像 |

### `tools.web.search`

| 字段 | 作用 |
| --- | --- |
| `api_key` | 搜索 API key |
| `max_results` | 搜索结果数 |

### `tools.mcp`

| 字段 | 作用 |
| --- | --- |
| `enabled` | 是否启用 MCP 总开关 |
| `request_timeout_sec` | MCP 请求超时 |
| `servers` | MCP server 声明表 |

### `tools.mcp.servers.<name>`

| 字段 | 作用 |
| --- | --- |
| `enabled` | 是否启用该 server |
| `transport` | `stdio` / `http` / `streamable_http` / `sse` |
| `command` | `stdio` 模式下的启动命令 |
| `args` | `stdio` 模式下的启动参数 |
| `url` | `http` / `streamable_http` / `sse` 使用的 endpoint |
| `env` | 环境变量覆盖 |
| `working_dir` | 工作目录；`workspace` 权限下可用相对路径，`full` 权限下可用绝对路径 |
| `permission` | `workspace` / `full` |
| `description` | 描述 |
| `package` | 包名，供 WebUI 安装辅助使用 |

## logging / sentinel / memory

这三块建议直接结合 [配置说明](/guide/configuration) 查看：

- `logging`: 日志开关、目录、轮转
- `sentinel`: 巡检、自愈、通知
- `memory`: layered memory 开关与 recent days
