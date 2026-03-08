# Nodes Guide

## Overview

ClawGo nodes are the mechanism for attaching remote devices or remote executors to the main runtime. The core abstractions live in `pkg/nodes`:

- `Manager`: tracks node state and registration data
- `Router`: chooses the dispatch path
- `Transport`: handles `relay` or `p2p`

Gateway exposes the base node endpoints:

- `POST /nodes/register`
- `POST /nodes/heartbeat`

Remote nodes can also be mounted as agent branches inside the main topology.

## What Nodes Can Do

The current node capability model includes:

- `run`
- `invoke`
- `agent_task`
- `camera_snap`
- `camera_clip`
- `screen_snapshot`
- `screen_record`
- `location_get`
- `canvas_snapshot`
- `canvas_action`

The repository also registers a default `local` node so the same invocation model works for both local and remote capabilities.

## Dispatch Modes

Node dispatch supports three modes:

- `auto`
- `p2p`
- `relay`

Behavior at a high level:

- `auto`: try P2P first, then fall back to relay
- `p2p`: force the point-to-point path
- `relay`: force the HTTP relay path

Recent audit rows also record:

- `used_transport`
- `fallback_from`

That makes it easy to see which path actually handled a request.

## Node P2P

Recent versions expanded the node data plane into two optional paths:

- `websocket_tunnel`
- `webrtc`

It is still disabled by default and only activates when `gateway.nodes.p2p.enabled = true` is set explicitly. A practical rollout order is:

1. start with `websocket_tunnel`
2. switch to `webrtc`

## Config Example

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

Field highlights:

- `stun_servers`: legacy-compatible flat STUN list
- `ice_servers`: the recommended structured form
- `ice_servers[].urls` supports `stun:`, `turn:`, and `turns:`
- `turn:` / `turns:` URLs require both `username` and `credential`

## `websocket_tunnel`

This is the safest transitional P2P option right now.

Characteristics:

- reuses the persistent websocket between the node and Gateway
- tunnels node request/response traffic through that websocket
- does not require full WebRTC negotiation

Good for:

- proving basic connectivity first
- complex network environments where you do not want ICE/TURN in the first rollout
- a more direct path than pure relay, while still being easier to debug

## WebRTC

`webrtc` is the fuller point-to-point data plane.

Current behavior:

- Gateway uses websocket signaling relay
- the node and Gateway establish a WebRTC data channel
- startup attempts offer / answer / candidate negotiation
- if setup fails, dispatch can still fall back to relay / tunnel

Recent changes also expose session health fields such as:

- `status`
- `last_error`
- `retry_count`
- `last_attempt`
- `last_ready_at`

Those fields are important when debugging why a direct session is not coming up.

## What You See In The WebUI

Recent WebUI updates already surface node P2P:

- the Dashboard shows a Node P2P card
- the Config page can edit `gateway.nodes.p2p`
- `/webui/api/nodes` returns a `p2p` runtime summary

The Dashboard currently shows:

- transport
- active sessions
- retry count
- STUN / ICE config counts

## What You See In `status`

`clawgo status` now also prints:

- `Nodes P2P: enabled=<bool> transport=<name>`
- `Nodes P2P ICE: stun=<n> ice=<n>`
- `Nodes Dispatch Top Transport`
- `Nodes Dispatch Fallbacks`

Those lines are the fastest clues when you are debugging WebRTC setup, relay fallback, or whether the tunnel path is actually being used.

## Troubleshooting

### P2P Never Comes Up

Check:

- `gateway.nodes.p2p.enabled = true`
- whether `transport` is really set to the value you expect
- whether `stun_servers` / `ice_servers` are valid
- if you use `turn:` / `turns:`, whether username and credential are both set

### Dispatch Always Falls Back To Relay

Check:

- `Nodes Dispatch Fallbacks` in `status`
- `used_transport` and `fallback_from` in `nodes-dispatch-audit.jsonl`
- the session state in `/webui/api/nodes` under `p2p.nodes[]`

### When Not To Start With WebRTC

If your immediate goal is simply to get node dispatch working, start with:

- `websocket_tunnel`

After registration, heartbeat, permissions, and routing are stable, then move to `webrtc`.

## Related Pages

- [Channels and Cron](/en/guide/integrations)
- [Configuration](/en/guide/configuration)
- [WebUI Console](/en/guide/webui)
- [Operations and API](/en/guide/operations)
- [WebUI API Reference](/en/reference/webui-api)
