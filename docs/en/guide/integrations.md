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

## Node P2P

Recent changes expanded the node data plane into two optional paths:

- `websocket_tunnel`
- `webrtc`

It is still disabled by default. P2P only activates when `gateway.nodes.p2p.enabled = true` is set explicitly. A practical rollout order is:

1. start with `websocket_tunnel`
2. switch to `webrtc` after connectivity is verified

Current config shape:

```json
{
  "gateway": {
    "nodes": {
      "p2p": {
        "enabled": true,
        "transport": "webrtc",
        "stun_servers": ["stun:stun.l.google.com:19302"],
        "ice_servers": [
          {
            "urls": ["turn:turn.example.com:3478"],
            "username": "demo",
            "credential": "secret"
          }
        ]
      }
    }
  }
}
```

Field meaning:

- `stun_servers`: legacy-compatible flat STUN list
- `ice_servers`: preferred structured form for `stun:`, `turn:`, and `turns:`
- `turn:` / `turns:` URLs require both `username` and `credential`

Runtime behavior:

- `auto` mode tries P2P first
- if P2P fails, dispatch falls back to relay / tunnel
- node audit rows now include `used_transport` and `fallback_from`

WebRTC also exposes session health signals such as:

- `status`
- `last_error`
- `retry_count`
- `last_attempt`
- `last_ready_at`

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

Recent observability additions also show up in `clawgo status`, including:

- `Nodes P2P: enabled=<bool> transport=<name>`
- `Nodes P2P ICE: stun=<n> ice=<n>`
- `Nodes Dispatch Top Transport`
- `Nodes Dispatch Fallbacks`
