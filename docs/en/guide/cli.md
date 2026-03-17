# CLI

## Overview

Current top-level `clawgo` commands:

- `onboard`
- `agent`
- `gateway`
- `status`
- `provider`
- `config`
- `cron`
- `tui`
- `channel`
- `skills`
- `version`
- `uninstall`

The latest upstream revision has removed the older `node` command, so this docs set no longer treats it as part of the current CLI surface.

## `onboard`

Initialize config and workspace:

```bash
clawgo onboard
```

It:

- creates default config
- creates workspace templates
- generates `gateway.token`
- leaves provider/model selection to the `provider` subcommands

## `agent`

Direct interaction with the AgentLoop:

```bash
clawgo agent
clawgo agent -m "Hello"
clawgo agent -s cli:demo -m "Fix a bug"
```

Common parameters:

- `-m`, `--message`
- `-s`, `--session`
- `-d`, `--debug`

## `gateway`

Foreground run:

```bash
clawgo gateway run
```

Service control:

```bash
clawgo gateway start
clawgo gateway stop
clawgo gateway restart
clawgo gateway status
```

Running `clawgo gateway` without a subcommand attempts to register the gateway service.

## `status`

Inspect current runtime state:

```bash
clawgo status
```

The most useful lines now include:

- config path
- workspace path
- active model and effective provider
- active provider `api_base`
- whether the active provider API key is set
- logging configuration
- heartbeat and cron runtime settings
- heartbeat and trigger stats
- skill execution stats
- session counts

`status` now reflects the active provider state rather than only echoing a static default slot.

## `provider`

Provider-related commands:

```bash
clawgo provider list
clawgo provider use openai/gpt-5.4
clawgo provider configure
clawgo provider login codex
clawgo provider login codex --manual
```

Meaning:

- `list`: show declared providers and models
- `use <provider/model>`: update `agents.defaults.model.primary`
- `configure`: open the interactive provider editor
- `login <provider>`: create an OAuth session
- `login <provider> --manual`: use a manual callback flow on servers or browserless environments

Typical `configure` fields:

- `api_base`
- `api_key`
- `models`
- `auth`
- `timeout_sec`
- `supports_responses_compact`
- `oauth.provider`
- `oauth.credential_file`
- `oauth.callback_port`
- `oauth.cooldown_sec`

## `config`

Read:

```bash
clawgo config get models.providers.openai.api_base
```

Write:

```bash
clawgo config set channels.telegram.enabled true
```

Validate:

```bash
clawgo config check
```

Reload:

```bash
clawgo config reload
```

## `cron`

List:

```bash
clawgo cron list
```

Add:

```bash
clawgo cron add -n daily-report -m "Summarize today's logs" -c "0 9 * * *"
clawgo cron add -n heartbeat -m "Check system state" -e 300
```

Common parameters:

- `-n`, `--name`
- `-m`, `--message`
- `-e`, `--every`
- `-c`, `--cron`
- `-d`, `--deliver`
- `--channel`
- `--to`

Enable, disable, remove:

```bash
clawgo cron enable <job_id>
clawgo cron disable <job_id>
clawgo cron remove <job_id>
```

## `tui`

Terminal-native chat UI:

```bash
clawgo tui
clawgo tui --session main
clawgo tui --token <gateway-token>
```

Common parameters:

- `--token`
- `--session`, `-s`
- `--no-history`

Notes:

- it connects directly to Gateway APIs
- it is useful on servers, SSH sessions, and terminal-only environments
- if the current binary was built without `with_tui`, the command tells you to install a build variant that includes TUI
