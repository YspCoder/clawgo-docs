# 配置说明

## 配置文件位置

默认配置文件：

```text
~/.clawgo/config.json
```

调试模式下会使用当前目录下的：

```text
.clawgo/config.json
```

配置加载策略：

- 先构造 `DefaultConfig()`
- 再读取 JSON
- 使用严格解码，未知字段会报错
- 最后再用环境变量覆盖带 `env` tag 的字段

这意味着配置是“有 schema 的”，不是自由 JSON。

## 顶层结构

顶层 `Config` 包含：

- `agents`
- `channels`
- `providers`
- `gateway`
- `cron`
- `tools`
- `logging`
- `sentinel`
- `memory`

## agents

### agents.defaults

全局默认值，影响运行时的基础行为。

关键字段：

- `workspace`: 工作区路径
- `proxy`: 默认 provider 名称
- `proxy_fallbacks`: provider fallback 链
- `max_tokens`
- `temperature`
- `max_tool_iterations`
- `heartbeat`
- `context_compaction`
- `execution`
- `summary_policy`

### heartbeat

- `enabled`
- `every_sec`
- `ack_max_chars`
- `prompt_template`

开启后 Gateway 会启动 heartbeat service，定期记录心跳状态。

### context_compaction

- `enabled`
- `mode`
- `trigger_messages`
- `keep_recent_messages`
- `max_summary_chars`
- `max_transcript_chars`

支持的 `mode`：

- `summary`
- `responses_compact`
- `hybrid`

如果使用 `responses_compact`，当前激活的 provider 必须显式声明 `supports_responses_compact: true`。

### execution

- `run_state_ttl_seconds`
- `run_state_max`
- `tool_parallel_safe_names`
- `tool_max_parallel_calls`

这部分决定：

- 工具并发上限
- 哪些工具可安全并发
- 运行态缓存保留多久

### summary_policy

用于约束系统任务总结格式，例如：

- `marker`
- `completed_prefix`
- `changes_prefix`
- `outcome_prefix`

如果你希望输出格式更稳定，这部分很关键。

## agents.router

ClawGo 的路由器支持基于关键字的主 agent 派发。

关键字段：

- `enabled`
- `main_agent_id`
- `strategy`
- `policy.intent_max_input_chars`
- `policy.max_rounds_without_user`
- `rules`
- `allow_direct_agent_chat`
- `max_hops`
- `default_timeout_sec`
- `default_wait_reply`
- `sticky_thread_owner`

当前 `strategy` 允许：

- `rules_first`
- `round_robin`
- `manual`

## agents.communication

负责 agent 间线程化消息协作：

- `mode`
- `persist_threads`
- `persist_messages`
- `max_messages_per_thread`
- `dead_letter_queue`
- `default_message_ttl_sec`

默认值倾向于保留线程和消息，以便恢复和审计。

## agents.subagents

每个 subagent 都是一个独立声明项。

常用字段：

- `enabled`
- `type`
- `transport`
- `node_id`
- `parent_agent_id`
- `notify_main_policy`
- `display_name`
- `role`
- `description`
- `system_prompt_file`
- `memory_namespace`
- `accept_from`
- `can_talk_to`
- `requires_main_mediation`
- `default_reply_to`
- `tools.allowlist`
- `tools.denylist`
- `runtime.proxy`
- `runtime.model`
- `runtime.temperature`
- `runtime.timeout_sec`
- `runtime.max_retries`
- `runtime.retry_backoff_ms`
- `runtime.max_task_chars`
- `runtime.max_result_chars`
- `runtime.max_parallel_runs`

注意：

- 启用的 subagent 现在应使用 `system_prompt_file`
- `system_prompt_file` 为必填时，路径必须是相对路径，且必须留在 workspace 内
- 使用 `transport: "node"` 时必须有 `node_id` 和 `parent_agent_id`
- 旧的 `system_prompt` 字段只建议视为兼容性历史遗留，不应继续作为正式配置使用

## channels

当前支持的通道配置：

- `telegram`
- `discord`
- `feishu`
- `dingtalk`
- `whatsapp`
- `qq`
- `maixcam`

公共去重配置：

- `inbound_message_id_dedupe_ttl_seconds`
- `inbound_content_dedupe_window_seconds`
- `outbound_dedupe_window_seconds`

部分通道特性示例：

- Telegram 支持 `streaming`
- Telegram/Feishu 支持群聊 mention 约束
- WhatsApp 依赖 bridge URL
- MaixCam 使用 host/port 本地服务

## providers

结构上分为：

- `providers.proxy`
- `providers.proxies.<name>`

字段包括：

- `api_key`
- `api_base`
- `models`
- `supports_responses_compact`
- `auth`
- `timeout_sec`
- `responses`

`responses` 进一步包含：

- `web_search_enabled`
- `web_search_context_size`
- `file_search_vector_store_ids`
- `file_search_max_num_results`
- `include`
- `stream_include_usage`

## gateway

- `host`
- `port`
- `token`

Gateway 同时负责：

- API 服务
- WebUI 宿主
- 节点注册

默认端口是 `18790`。

### gateway.nodes.p2p

节点 P2P 入口位于 `gateway.nodes.p2p`。

字段：

- `enabled`
- `transport`
- `stun_servers`
- `ice_servers`

### gateway.nodes.dispatch

节点调度策略位于 `gateway.nodes.dispatch`。

字段：

- `prefer_local`
- `prefer_p2p`
- `allow_relay_fallback`
- `action_tags`
- `agent_tags`
- `allow_actions`
- `deny_actions`
- `allow_agents`
- `deny_agents`

这组配置会决定：

- 优先走本地节点还是远端节点
- P2P 不可用时是否允许回退到 relay
- 某个 action 或远端 agent 需要哪些 node tags
- 某个 action 或 agent 允许或拒绝哪些标签集合

`action_tags` 和 `agent_tags` 更适合做“必须命中这些标签才能派发”，
`allow_*` / `deny_*` 适合做更硬的准入约束。

### gateway.nodes.artifacts

节点产物保留策略位于 `gateway.nodes.artifacts`。

字段：

- `enabled`
- `keep_latest`
- `retain_days`
- `prune_on_read`

默认值：

- `enabled = false`
- `keep_latest = 500`
- `retain_days = 7`
- `prune_on_read = true`

校验规则：

- `enabled = true` 时，`keep_latest` 必须大于 `0`
- `keep_latest` 不能小于 `0`
- `retain_days` 不能小于 `0`

开启后，Gateway 会在读取节点产物列表时按“最近保留数量 + 最长保留天数”做自动清理。

当前 `transport` 允许：

- `websocket_tunnel`
- `webrtc`

规则：

- 默认关闭，必须显式启用
- `stun_servers` 是兼容旧写法的简单列表
- `ice_servers` 是推荐的新结构，支持 `urls`、`username`、`credential`
- 如果 `ice_servers[].urls` 中包含 `turn:` 或 `turns:`，则必须填写 `username` 和 `credential`

## cron

- `min_sleep_sec`
- `max_sleep_sec`
- `retry_backoff_base_sec`
- `retry_backoff_max_sec`
- `max_consecutive_failure_retries`
- `max_workers`

这部分控制的是 Cron Runtime 行为，不是单个 Cron Job 的表达式。

## tools.mcp

MCP 的总入口在 `tools.mcp`。

顶层字段：

- `enabled`
- `request_timeout_sec`
- `servers`

`servers.<name>` 的常用字段：

- `enabled`
- `transport`
- `command`
- `args`
- `url`
- `env`
- `working_dir`
- `permission`
- `description`
- `package`

当前支持的 `transport`：

- `stdio`
- `http`
- `streamable_http`
- `sse`

使用规则：

- `stdio` 需要 `command`
- `http` / `streamable_http` / `sse` 需要 `url`
- `permission` 只能是 `workspace` 或 `full`
- `permission: "workspace"` 时，`working_dir` 可以写相对路径，但最终必须落在 workspace 内
- `permission: "full"` 时，`working_dir` 可以使用绝对路径

更多细节见 [MCP 集成](/guide/mcp)。

## tools

当前顶层配置较少，主要是：

- `tools.shell`
- `tools.web`
- `tools.filesystem`
- `tools.mcp`

### tools.shell

- `enabled`
- `working_dir`
- `timeout`
- `auto_install_missing`
- `sandbox.enabled`
- `sandbox.image`

### tools.web.search

- `api_key`
- `max_results`

### tools.mcp

- `enabled`
- `request_timeout_sec`
- `servers`

单个 server 字段：

- `enabled`
- `transport`
- `command`
- `args`
- `env`
- `working_dir`
- `description`
- `package`

当前实现只支持：

```text
transport = "stdio"
```

更多说明见 [MCP 集成](/guide/mcp)。

## logging

- `enabled`
- `dir`
- `filename`
- `max_size_mb`
- `retention_days`

默认日志启用，默认文件是：

```text
~/.clawgo/logs/clawgo.log
```

## sentinel

- `enabled`
- `interval_sec`
- `auto_heal`
- `notify_channel`
- `notify_chat_id`

Sentinel 用来做周期性巡检和自动恢复。

## memory

- `layered`
- `recent_days`
- `layers.profile`
- `layers.project`
- `layers.procedures`

这部分控制 layered memory 的启用范围。

## 配置校验

执行：

```bash
clawgo config check
```

校验器会检查：

- 数值上下界
- provider 是否存在
- fallback provider 是否有效
- router rule 中的 agent 是否存在
- 通道启用时是否填写必要凭据
- `responses_compact` 与 provider 能力是否匹配

## 热更新

两种方式：

```bash
clawgo config set channels.telegram.enabled true
clawgo config reload
```

`config set` 会在成功写入后尝试触发 Gateway 热更新；如果热更新失败且网关正在运行，代码会尝试从备份回滚。
