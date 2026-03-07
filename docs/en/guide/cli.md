# CLI

## Overview

Top-level `clawgo` commands:

- `onboard`
- `agent`
- `gateway`
- `status`
- `provider`
- `config`
- `cron`
- `channel`
- `skills`
- `version`
- `uninstall`

## `onboard`

Initialize config and workspace:

```bash
clawgo onboard
```

It creates default config, workspace templates, and a gateway token.

## `agent`

Direct interaction with `AgentLoop`.

```bash
clawgo agent
clawgo agent -m "Hello"
clawgo agent -s cli:demo -m "Fix a bug"
```

Parameters:

- `-m`, `--message`
- `-s`, `--session`
- `-d`, `--debug`

## `gateway`

### Run

```bash
clawgo gateway run
```

### Service-like control

```bash
clawgo gateway start
clawgo gateway stop
clawgo gateway restart
clawgo gateway status
```

If you run `clawgo gateway` without a subcommand, the program attempts to register the gateway service.

## `status`

Inspect runtime state:

```bash
clawgo status
```

It reports:

- config and workspace status
- active model and proxy
- logging configuration
- heartbeat and cron runtime settings
- heartbeat and trigger stats
- skill execution stats
- session kind counts
- node state and capability summary

## `provider`

Interactive provider configuration:

```bash
clawgo provider
clawgo provider backup
```

## `config`

### Read

```bash
clawgo config get providers.proxy.api_base
```

### Write

```bash
clawgo config set channels.telegram.enabled true
```

### Validate

```bash
clawgo config check
```

### Reload

```bash
clawgo config reload
```

## `cron`

### List

```bash
clawgo cron list
```

### Add

```bash
clawgo cron add -n daily-report -m "Summarize today's logs" -c "0 9 * * *"
```

### Enable, disable, remove

```bash
clawgo cron enable <job_id>
clawgo cron disable <job_id>
clawgo cron remove <job_id>
```

## `channel`

Current exposed subcommand:

```bash
clawgo channel test --channel telegram --to 123456 -m "hello"
```

## `skills`

Typical usage:

```bash
clawgo skills list
clawgo skills install YspCoder/clawgo-skills/weather
clawgo skills remove weather
clawgo skills show weather
```

## `uninstall`

```bash
clawgo uninstall
clawgo uninstall --purge
clawgo uninstall --remove-bin
```
