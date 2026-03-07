# Channels, Cron, and Nodes

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

`pkg/nodes` defines a remote execution abstraction:

- `Manager` maintains node state
- `Router` dispatches requests
- `Transport` handles relay or p2p behavior

Gateway exposes:

- `POST /nodes/register`
- `POST /nodes/heartbeat`

Remote nodes can then be mounted as agent branches in the main topology.

## Local Simulated Node

The code registers a default `local` node to simulate capabilities such as:

- `run`
- `agent_task`
- `camera_snap`
- `camera_clip`
- `screen_snapshot`
- `screen_record`
- `location_get`
- `canvas_snapshot`
- `canvas_action`
