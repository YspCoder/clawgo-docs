# 配置说明

## 配置文件位置

默认配置文件：

```text
~/.clawgo/config.json
```

调试模式下会使用：

```text
.clawgo/config.json
```

加载策略是：

- 先构造默认配置
- 再读取 JSON
- 使用严格解码，未知字段会报错
- 最后应用环境变量覆盖

## 顶层结构

当前顶层结构是：

- `agents`
- `channels`
- `models`
- `gateway`
- `cron`
- `tools`
- `logging`
- `sentinel`
- `memory`

这里要注意，provider 已经挂在 `models.providers`，不是旧文档里的顶层 `providers`。

## normalized schema

最近 WebUI 和部分运行时接口优先读写 normalized view：

- `core.default_provider`
- `core.default_model`
- `core.main_agent_id`
- `core.agents`
- `core.tools`
- `core.gateway`
- `runtime.providers`

它的意义是：

- 给 WebUI 更稳定的配置编辑面
- 让远端节点和控制面不依赖底层字段细节
- 把核心 actor 拓扑和 provider runtime 配置拆开

## `agents`

### `agents.defaults`

这部分定义全局默认行为，最关键的字段包括：

- `workspace`
- `model.primary`
- `max_tokens`
- `temperature`
- `max_tool_iterations`
- `heartbeat`
- `context_compaction`
- `execution`
- `summary_policy`

最近要特别注意的是：

- 默认 provider 不再建议写成旧的 `proxy`
- 当前主模型引用来自 `agents.defaults.model.primary`
- 值的形态是 `provider/model`

例如：

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "openai/gpt-5.4"
      }
    }
  }
}
```

### `agents.defaults.context_compaction`

字段：

- `enabled`
- `mode`
- `trigger_messages`
- `keep_recent_messages`
- `max_summary_chars`
- `max_transcript_chars`

`mode` 允许：

- `summary`
- `responses_compact`
- `hybrid`

### `agents.defaults.execution`

字段：

- `run_state_ttl_seconds`
- `run_state_max`
- `tool_parallel_safe_names`
- `tool_max_parallel_calls`

这部分控制运行态缓存与工具并发。

## `agents.agents`

这是当前最重要的配置区域。每个条目都代表一个 actor，可以是：

- 普通 `agent`
- 世界里的 `npc`
- 远端 `node` branch

常见字段：

- `enabled`
- `kind`
- `type`
- `transport`
- `node_id`
- `parent_agent_id`
- `display_name`
- `role`
- `description`
- `persona`
- `traits`
- `faction`
- `home_location`
- `default_goals`
- `perception_scope`
- `schedule_hint`
- `world_tags`
- `prompt_file`
- `memory_namespace`
- `tools.allowlist`
- `tools.denylist`
- `tools.max_parallel_calls`
- `runtime.provider`
- `runtime.model`
- `runtime.temperature`
- `runtime.timeout_sec`
- `runtime.max_retries`
- `runtime.retry_backoff_ms`
- `runtime.max_task_chars`
- `runtime.max_result_chars`
- `runtime.max_parallel_runs`

使用建议：

- `main` 通常写成 `type: "agent"` 并绑定 `prompt_file`
- `npc` 通过 `kind: "npc"` 进入 world runtime
- 远端分支用 `transport: "node"`，同时配置 `node_id` 与 `parent_agent_id`
- 启用的执行型 agent 应提供 `prompt_file`
- `prompt_file` 必须是 workspace 内相对路径

## `channels`

当前支持的主要通道：

- `telegram`
- `discord`
- `feishu`
- `dingtalk`
- `whatsapp`
- `qq`
- `maixcam`

公共字段：

- `inbound_message_id_dedupe_ttl_seconds`
- `inbound_content_dedupe_window_seconds`
- `outbound_dedupe_window_seconds`

## `models.providers`

provider 配置现在在这里：

```json
{
  "models": {
    "providers": {
      "openai": {}
    }
  }
}
```

常见字段：

- `api_key`
- `api_base`
- `models`
- `supports_responses_compact`
- `auth`
- `timeout_sec`
- `runtime_persist`
- `runtime_history_file`
- `runtime_history_max`
- `oauth`
- `responses`

`auth` 允许：

- `bearer`
- `oauth`
- `hybrid`
- `none`

## `tools.mcp`

字段：

- `enabled`
- `request_timeout_sec`
- `servers`

每个 server 当前支持：

- `transport`
- `command`
- `args`
- `url`
- `env`
- `working_dir`
- `permission`
- `description`
- `package`
- `installer`
- `mcp_server_checks`

## `gateway`

常用字段：

- `host`
- `port`
- `token`

最近独立部署 WebUI 的常见接入方式是：

- URL 带 `?token=<gateway.token>`
- 或用 `Authorization: Bearer <gateway.token>`

## 一个更贴近当前代码的最小片段

```json
{
  "agents": {
    "defaults": {
      "workspace": "~/.clawgo/workspace",
      "model": {
        "primary": "openai/gpt-5.4"
      }
    },
    "agents": {
      "main": {
        "enabled": true,
        "type": "agent",
        "role": "orchestrator",
        "prompt_file": "agents/main/AGENT.md"
      },
      "guard": {
        "enabled": true,
        "kind": "npc",
        "persona": "A cautious town guard",
        "home_location": "gate",
        "default_goals": ["patrol the square"]
      }
    }
  },
  "models": {
    "providers": {
      "openai": {
        "api_key": "YOUR_KEY",
        "api_base": "https://api.openai.com/v1",
        "models": ["gpt-5.4"],
        "auth": "bearer"
      }
    }
  }
}
```
