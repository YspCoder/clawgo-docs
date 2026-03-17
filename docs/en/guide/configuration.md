# Configuration

## Config File Location

Default config file:

```text
~/.clawgo/config.json
```

In debug mode:

```text
.clawgo/config.json
```

## Top-Level Structure

The current top-level shape is:

- `agents`
- `channels`
- `models`
- `gateway`
- `cron`
- `tools`
- `logging`
- `sentinel`
- `memory`

## Normalized View

The persisted file remains raw config, but some APIs also expose a normalized view:

- `core.default_provider`
- `core.default_model`
- `core.main_agent_id`
- `core.subagents`
- `runtime.router`
- `runtime.providers`

Important detail: the normalized core still uses `core.subagents`, not `core.agents`.

## `agents.defaults`

Important fields:

- `workspace`
- `model.primary`
- `max_tokens`
- `temperature`
- `max_tool_iterations`
- `heartbeat`
- `context_compaction`
- `execution`
- `summary_policy`

`model.primary` uses:

```text
provider/model
```

For example:

```json
{
  "model": {
    "primary": "codex/gpt-5.4"
  }
}
```

## `agents.router`

The router dispatches requests between `main` and the registered subagents.

Important fields:

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

This section controls threaded agent-to-agent communication.

Fields:

- `mode`
- `persist_threads`
- `persist_messages`
- `max_messages_per_thread`
- `dead_letter_queue`
- `default_message_ttl_sec`

## `agents.subagents`

This is the main role-registry section.

Common fields:

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

Current rules:

- enabled local subagents must define `system_prompt_file`
- `system_prompt_file` must be workspace-relative
- `accept_from` and `can_talk_to` must reference declared subagents

## `models.providers`

Provider configuration lives under:

```json
{
  "models": {
    "providers": {}
  }
}
```

Common fields:

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

Supported `auth` values:

- `bearer`
- `oauth`
- `hybrid`
- `none`

## `tools.mcp`

Current MCP transports include:

- `stdio`
- `http`
- `streamable_http`
- `sse`

Common per-server fields:

- `enabled`
- `transport`
- `command`
- `args`
- `url`
- `working_dir`
- `permission`
- `package`

## Minimal Raw Shape

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
