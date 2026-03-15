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

The load flow is:

- start from the default config
- read JSON
- fail on unknown fields through strict decoding
- apply environment variable overrides last

## Top-Level Structure

The current top-level keys are:

- `agents`
- `channels`
- `models`
- `gateway`
- `cron`
- `tools`
- `logging`
- `sentinel`
- `memory`

One important change: providers now live under `models.providers`, not under the older top-level `providers` wording.

## Normalized Schema

Recent WebUI and runtime-facing endpoints prefer a normalized view:

- `core.default_provider`
- `core.default_model`
- `core.main_agent_id`
- `core.agents`
- `core.tools`
- `core.gateway`
- `runtime.providers`

This exists to:

- give the WebUI a more stable edit surface
- let remote nodes and control-plane code avoid depending on raw internal layout
- separate actor topology from provider runtime config

## `agents`

### `agents.defaults`

This section defines global defaults. Important fields include:

- `workspace`
- `model.primary`
- `max_tokens`
- `temperature`
- `max_tool_iterations`
- `heartbeat`
- `context_compaction`
- `execution`
- `summary_policy`

One important current detail:

- the default provider should no longer be documented with the old `proxy` wording
- the active default model now comes from `agents.defaults.model.primary`
- the value shape is `provider/model`

Example:

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

Fields:

- `enabled`
- `mode`
- `trigger_messages`
- `keep_recent_messages`
- `max_summary_chars`
- `max_transcript_chars`

Supported `mode` values:

- `summary`
- `responses_compact`
- `hybrid`

### `agents.defaults.execution`

Fields:

- `run_state_ttl_seconds`
- `run_state_max`
- `tool_parallel_safe_names`
- `tool_max_parallel_calls`

This area controls runtime-state retention and safe tool concurrency.

## `agents.agents`

This is now the most important config area. Each entry is an actor and can be:

- a regular `agent`
- a world `npc`
- a remote `node` branch

Common fields:

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

Usage guidance:

- `main` is usually a `type: "agent"` actor with a `prompt_file`
- an NPC enters the world runtime through `kind: "npc"`
- remote branches use `transport: "node"` together with `node_id` and `parent_agent_id`
- enabled executable agents should provide `prompt_file`
- `prompt_file` must stay workspace-relative

## `channels`

Major supported channels include:

- `telegram`
- `discord`
- `feishu`
- `dingtalk`
- `whatsapp`
- `qq`
- `maixcam`

Shared fields:

- `inbound_message_id_dedupe_ttl_seconds`
- `inbound_content_dedupe_window_seconds`
- `outbound_dedupe_window_seconds`

## `models.providers`

Provider configuration now lives here:

```json
{
  "models": {
    "providers": {
      "openai": {}
    }
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

Fields:

- `enabled`
- `request_timeout_sec`
- `servers`

Per-server fields currently include:

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

Common fields:

- `host`
- `port`
- `token`

For the separately deployed WebUI, the usual auth patterns are:

- `?token=<gateway.token>`
- or `Authorization: Bearer <gateway.token>`

## A Minimal Config Closer To The Current Code

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
