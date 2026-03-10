# Quick Start

## Project Positioning

ClawGo is an agent runtime written in Go. The codebase is centered around:

- `pkg/agent`: main loop, task planning, context building, routing, and recovery
- `pkg/tools`: built-in tool system
- `pkg/api`: Gateway HTTP API and WebUI API
- `pkg/channels`: Telegram, Discord, Feishu, DingTalk, WhatsApp, QQ, and MaixCam
- `pkg/cron`: scheduled tasks
- `pkg/nodes`: remote nodes and relay/router logic
- `webui`: React + Vite operations console

## Installation

### Option 1: Install Script

```bash
curl -fsSL https://raw.githubusercontent.com/YspCoder/clawgo/main/install.sh | bash
```

If you only want one channel-specific variant, you can now pass it explicitly:

```bash
curl -fsSL https://raw.githubusercontent.com/YspCoder/clawgo/main/install.sh | bash -s -- --variant telegram
```

The script:

- detects OS and architecture
- downloads the latest release binary
- supports `full`, `none`, `telegram`, `discord`, `feishu`, `maixcam`, `qq`, `dingtalk`, and `whatsapp` install variants
- no longer downloads `webui.tar.gz` separately
- runs `clawgo onboard --sync-webui` after install so the embedded WebUI is refreshed into `~/.clawgo/workspace/webui`
- optionally migrates from OpenClaw
- prompts for `clawgo onboard` only when no config exists yet

### Option 2: Build From Source

```bash
git clone https://github.com/YspCoder/clawgo.git
cd clawgo
make build
```

The default binary output is `build/clawgo-<platform>-<arch>`.

## Onboarding

Run this once:

```bash
clawgo onboard
```

It will:

- create `~/.clawgo/config.json`
- generate `gateway.token`
- copy the default workspace template into `~/.clawgo/workspace`

If you only want to refresh the embedded WebUI after an upgrade, run:

```bash
clawgo onboard --sync-webui
```

## Configure A Provider

The most important part is configuring `providers` and `agents.defaults.proxy`.

Interactive setup:

```bash
clawgo provider
```

A minimal working example usually looks like:

```json
{
  "agents": {
    "defaults": {
      "proxy": "proxy"
    }
  },
  "providers": {
    "proxy": {
      "api_key": "YOUR_KEY",
      "api_base": "http://localhost:8080/v1",
      "models": ["glm-4.7"],
      "auth": "bearer",
      "timeout_sec": 90
    }
  }
}
```

## Startup Modes

### Interactive Agent

```bash
clawgo agent
```

Direct one-shot message:

```bash
clawgo agent -m "Hello"
```

### Gateway Mode

```bash
clawgo gateway run
```

This starts the fuller runtime surface:

- Gateway HTTP server
- WebUI API
- Channel manager
- Cron service
- Heartbeat service
- Sentinel

### Development Mode

```bash
make dev
```

## WebUI

Default URL:

```text
http://<host>:<port>/webui?token=<gateway.token>
```

The default port is `18790`.

## First Checks

After startup, run:

```bash
clawgo status
clawgo config check
```

Those two commands give the fastest signal on:

- config availability
- workspace availability
- provider configuration
- log, heartbeat, cron, and node state
