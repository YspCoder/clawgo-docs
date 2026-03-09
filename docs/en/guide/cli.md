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
- `node`
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
- active model, proxy, and effective provider
- the active provider `api_base`
- whether the active provider API key is set
- logging configuration
- heartbeat and cron runtime settings
- heartbeat and trigger stats
- skill execution stats
- session kind counts
- node state and capability summary
- node P2P enablement, transport, and ICE config counts
- node dispatch transport usage and fallback counts

Note:

- if `agents.defaults.proxy` points to `providers.proxies.<name>`, `status` now reports the active provider details
- it no longer only reflects the default `providers.proxy` slot

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

## `node`

Used to register a remote execution node with Gateway or send a standalone heartbeat.

### Register A Node

```bash
clawgo node register --gateway http://127.0.0.1:18790 --id edge-dev --endpoint http://10.0.0.8:8080
```

Common parameters:

- `--gateway`: Gateway base URL
- `--token`: Gateway token
- `--node-token`: Bearer token for the node endpoint itself
- `--id`: node ID
- `--name`: display name
- `--endpoint`: public node endpoint
- `--actions`: supported action list
- `--models`: supported model list
- `--tags`: node tags used by dispatch policy, such as `gpu,vision,build`
- `--capabilities`: capability flags such as `run,invoke,model,camera,screen,location,canvas`
- `--watch`: keep the websocket open and continue sending heartbeats
- `--heartbeat-sec`: heartbeat interval while `--watch` is enabled

Without `--watch`, `register` sends a single registration request and exits. With `--watch`, it will:

- establish a websocket connection
- send heartbeats automatically
- handle node requests pushed from Gateway
- provide the signaling and data-plane base for `websocket_tunnel` and `webrtc`

### Send A Single Heartbeat

```bash
clawgo node heartbeat --gateway http://127.0.0.1:18790 --id edge-dev
```

Common parameters:

- `--gateway`
- `--token`
- `--id`

This is useful when you want an external scheduler or your own node supervisor to keep the node alive.

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
