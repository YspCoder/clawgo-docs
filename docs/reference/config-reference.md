# 配置参考

这页是 [配置说明](/guide/configuration) 的字段索引版。

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
| `model.primary` | 默认模型引用，格式 `provider/model` |
| `max_tokens` | 默认 token 上限 |
| `temperature` | 默认温度 |
| `max_tool_iterations` | 工具迭代上限 |

## `agents.router`

| 字段 | 作用 |
| --- | --- |
| `enabled` | 是否启用 router |
| `main_agent_id` | 主 agent ID |
| `strategy` | `rules_first` / `round_robin` / `manual` |
| `rules` | 关键字派发规则 |
| `max_hops` | 最大跳数 |
| `default_timeout_sec` | 默认超时 |
| `sticky_thread_owner` | thread owner 是否粘性 |

## `agents.communication`

| 字段 | 作用 |
| --- | --- |
| `mode` | 协作模式 |
| `persist_threads` | 是否持久化 threads |
| `persist_messages` | 是否持久化 messages |
| `max_messages_per_thread` | 单线程消息上限 |
| `dead_letter_queue` | 是否启用死信队列 |
| `default_message_ttl_sec` | 默认消息 TTL |

## `agents.subagents.<id>`

| 字段 | 作用 |
| --- | --- |
| `enabled` | 是否启用 |
| `type` | `router` / `worker` / `reviewer` / `observer` |
| `transport` | 当前默认文档化为 `local` |
| `parent_agent_id` | 父 agent |
| `notify_main_policy` | 主代理通知策略 |
| `display_name` | 显示名称 |
| `role` | 角色 |
| `description` | 描述 |
| `system_prompt_file` | prompt 文件 |
| `memory_namespace` | 记忆命名空间 |
| `accept_from` | 允许接收来源 |
| `can_talk_to` | 允许通信对象 |
| `requires_main_mediation` | 是否要求主代理中介 |
| `default_reply_to` | 默认回复目标 |
| `tools.allowlist` | 工具白名单 |
| `tools.denylist` | 工具黑名单 |
| `tools.max_parallel_calls` | 工具并发上限 |
| `runtime.*` | provider、重试、超时、长度限制等 |

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
| `responses.*` | responses 参数 |

## `gateway`

| 字段 | 作用 |
| --- | --- |
| `host` | 监听地址 |
| `port` | 监听端口 |
| `token` | 网关访问令牌 |

当前 upstream 默认文档不再继续展开旧版 `gateway.nodes.*`。

## `tools.mcp.servers.<name>`

| 字段 | 作用 |
| --- | --- |
| `enabled` | 是否启用 |
| `transport` | `stdio` / `http` / `streamable_http` / `sse` |
| `command` | `stdio` 启动命令 |
| `args` | `stdio` 启动参数 |
| `url` | 远端 transport URL |
| `working_dir` | 工作目录 |
| `permission` | `workspace` / `full` |
| `package` | 安装包名 |
