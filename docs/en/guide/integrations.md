# Channels and Cron

## External Channels

Channel adapters live in `pkg/channels`:

- `telegram.go`
- `discord.go`
- `feishu.go`
- `dingtalk.go`
- `qq.go`
- `whatsapp.go`
- `maixcam.go`

The channel manager is responsible for:

- initializing enabled adapters
- starting and stopping them
- sending inbound messages into the bus
- routing outbound messages by channel
- applying dedupe windows

## Cron

ClawGo cron is not just OS-level scheduling. Cron jobs are fed back into the agent runtime.

A cron job contains:

- `name`
- `schedule`
- `message`
- `deliver`
- `channel`
- `to`
- `enabled`
- `state`

Supported schedule forms:

- `every`
- `cron`
- `at`

## Nodes

Nodes now have a dedicated guide:

- [Nodes Guide](/en/guide/nodes)

Use that page for:

- remote node registration and heartbeat
- relay / p2p / auto dispatch
- `websocket_tunnel` and `webrtc`
- `stun_servers` / `ice_servers`
- P2P observability in Dashboard, `status`, and `/webui/api/nodes`
