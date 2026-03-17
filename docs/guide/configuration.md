# 配置说明

## 配置文件位置

默认配置文件：

```text
~/.clawgo/config.json
```

调试模式下：

```text
.clawgo/config.json
```

## 顶层结构

当前真实顶层结构是：

- `agents`
- `channels`
- `models`
- `gateway`
- `cron`
- `tools`
- `logging`
- `sentinel`
- `memory`

## normalized view

虽然落盘文件还是 raw config，但部分接口会提供 normalized view：

- `core.default_provider`
- `core.default_model`
- `core.main_agent_id`
- `core.subagents`
- `runtime.router`
- `runtime.providers`

这里要注意：当前 normalized 核心字段仍然是 `core.subagents`，不是 `core.agents`。

## `agents.defaults`

关键字段：

- `workspace`
- `model.primary`
- `max_tokens`
- `temperature`
- `max_tool_iterations`
- `heartbeat`
- `context_compaction`
- `execution`
- `summary_policy`

`model.primary` 的格式是：

```text
provider/model
```

例如：

```json
{
  "model": {
    "primary": "codex/gpt-5.4"
  }
}
```

## `agents.router`

当前 router 负责把用户请求派给 `main` 和各个 subagent。

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
- `sticky_thread_owner`

## `agents.communication`

负责 agent 间线程化消息协作。

字段：

- `mode`
- `persist_threads`
- `persist_messages`
- `max_messages_per_thread`
- `dead_letter_queue`
- `default_message_ttl_sec`

## `agents.subagents`

这是当前最重要的角色配置区域。

常见字段：

- `enabled`
- `type`
- `transport`
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

当前约束：

- 启用中的本地 subagent 必须配置 `system_prompt_file`
- `system_prompt_file` 必须是 workspace 内相对路径
- `accept_from` / `can_talk_to` 需要引用已存在的 subagent

## `models.providers`

provider 配置在：

```json
{
  "models": {
    "providers": {}
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

当前支持：

- `stdio`
- `http`
- `streamable_http`
- `sse`

server 级字段常见有：

- `enabled`
- `transport`
- `command`
- `args`
- `url`
- `working_dir`
- `permission`
- `package`

## 一个最小原始结构

```json
{
  "agents": {
    "router": {
      "enabled": true,
      "main_agent_id": "main",
      "strategy": "rules_first",
      "rules": []
    },
    "subagents": {
      "main": {
        "enabled": true,
        "type": "router",
        "role": "orchestrator",
        "system_prompt_file": "agents/main/AGENT.md"
      },
      "coder": {
        "enabled": true,
        "type": "worker",
        "role": "code",
        "system_prompt_file": "agents/coder/AGENT.md"
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
