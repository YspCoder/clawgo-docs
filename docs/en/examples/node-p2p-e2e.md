# Node P2P E2E Validation

This example validates the two real data-plane modes behind `gateway.nodes.p2p`:

- `websocket_tunnel`
- `webrtc`

It is not a unit test and not a local mock. It is intended for real end-to-end connectivity checks across multiple machines.

## When To Use This

Use this example when you want to:

- connect remote nodes to one gateway for the first time
- prove that `websocket_tunnel` is actually carrying requests
- prove that `webrtc` really established a DataChannel rather than only completing signaling
- distinguish a successful HTTP relay from a true P2P success

## Validation Targets

The validation should satisfy all of the following:

1. two remote nodes register successfully to the same gateway
2. remote node tasks succeed in `websocket_tunnel` mode
3. remote node tasks succeed in `webrtc` mode
4. in `webrtc` mode, `/api/nodes` reports `p2p.active_sessions > 0`
5. Dashboard and Subagents show node P2P session state and recent dispatch path

## Topology

Minimum test topology:

- 1 gateway machine
- 2 remote node machines

Requirements:

- all three machines can run `clawgo`
- remote machines have `python3`
- the gateway exposes the WebUI and node registry port

Recommended order:

1. validate `websocket_tunnel` first
2. switch to `webrtc`
3. for `webrtc`, configure at least one working `stun_servers` entry

## Core Verification Trick

To avoid mistaking HTTP relay for P2P, deliberately set the target node `endpoint` to an address that is only valid on the node itself, for example:

```text
http://127.0.0.1:<port>
```

If tasks still succeed, then the gateway did not reach the node over direct public HTTP relay. The request must have gone through the node P2P path.

## Recommended Gateway Config

### Option 1: `websocket_tunnel`

```json
{
  "gateway": {
    "host": "0.0.0.0",
    "port": 18790,
    "token": "YOUR_GATEWAY_TOKEN",
    "nodes": {
      "p2p": {
        "enabled": true,
        "transport": "websocket_tunnel",
        "stun_servers": [],
        "ice_servers": []
      }
    }
  }
}
```

### Option 2: `webrtc`

```json
{
  "gateway": {
    "host": "0.0.0.0",
    "port": 18790,
    "token": "YOUR_GATEWAY_TOKEN",
    "nodes": {
      "p2p": {
        "enabled": true,
        "transport": "webrtc",
        "stun_servers": ["stun:stun.l.google.com:19302"],
        "ice_servers": []
      }
    }
  }
}
```

If you need TURN, prefer `ice_servers`:

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

## Minimal Node Endpoint

Run this minimal HTTP server on each remote node:

```python
#!/usr/bin/env python3
import json
import os
import socket
from http.server import BaseHTTPRequestHandler, HTTPServer

PORT = int(os.environ.get("PORT", "19081"))
LABEL = os.environ.get("NODE_LABEL", socket.gethostname())

class H(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass

    def do_POST(self):
        length = int(self.headers.get("Content-Length", "0") or 0)
        raw = self.rfile.read(length) if length else b"{}"
        try:
            req = json.loads(raw.decode("utf-8") or "{}")
        except Exception:
            req = {}
        action = req.get("action") or self.path.strip("/")
        payload = {
            "handler": LABEL,
            "hostname": socket.gethostname(),
            "path": self.path,
            "echo": req,
        }
        if action == "agent_task":
            payload["result"] = f"agent_task from {LABEL}"
        else:
            payload["result"] = f"{action} from {LABEL}"
        body = json.dumps({
            "ok": True,
            "code": "ok",
            "node": LABEL,
            "action": action,
            "payload": payload,
        }).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

HTTPServer(("0.0.0.0", PORT), H).serve_forever()
```

Example start command:

```bash
PORT=19081 NODE_LABEL=node-a python3 mini_node.py
```

## Register Remote Nodes

On each node, run:

```bash
clawgo node register \
  --gateway http://<gateway-host>:18790 \
  --token YOUR_GATEWAY_TOKEN \
  --id <node-id> \
  --name <node-name> \
  --endpoint http://127.0.0.1:<endpoint-port> \
  --actions run,agent_task \
  --models gpt-4o-mini \
  --capabilities run,invoke,model \
  --watch \
  --heartbeat-sec 10
```

Two important points:

- keep `--endpoint` on `127.0.0.1`
- `--watch` must be enabled because websocket tunnel and WebRTC signaling both depend on it

## Verify Registration

From the gateway machine:

```bash
curl -s -H 'Authorization: Bearer YOUR_GATEWAY_TOKEN' \
  http://<gateway-host>:18790/api/nodes
```

Expected:

- the remote nodes appear in `nodes`
- `online = true`
- the topology includes `node.<id>.main`

## Recommended Task Validation Method

Do not use “a normal chat prompt eventually worked” as the main success criterion.  
The more stable path is to dispatch directly to the remote node branch through `subagents_runtime`:

```bash
curl -s \
  -H 'Authorization: Bearer YOUR_GATEWAY_TOKEN' \
  -H 'Content-Type: application/json' \
  http://<gateway-host>:18790/api/subagents_runtime \
  -d '{
    "action": "dispatch_and_wait",
    "agent_id": "node.<node-id>.main",
    "task": "Return exactly the string NODE_P2P_OK",
    "wait_timeout_sec": 30
  }'
```

Expected:

- `ok = true`
- `result.reply.status = completed`
- `result.reply.result` includes the remote endpoint response

## How To Judge `websocket_tunnel`

In `websocket_tunnel` mode, the `dispatch_and_wait` call above should succeed.

If the target node `endpoint` is deliberately set to `127.0.0.1:<port>` and the task still succeeds, then:

- the gateway did not reach the node over public HTTP relay
- the request actually traveled through the node websocket tunnel

## How To Judge `webrtc`

Switch to `webrtc` config and run the same `dispatch_and_wait` call again.

Then inspect:

```bash
curl -s -H 'Authorization: Bearer YOUR_GATEWAY_TOKEN' \
  http://<gateway-host>:18790/api/nodes
```

Expected `p2p` values include:

- `transport = "webrtc"`
- `active_sessions > 0`
- `nodes[].status = "open"`
- `nodes[].last_ready_at` is non-empty

That is what proves a WebRTC DataChannel was really established instead of signaling merely being attempted.

## WebUI Checks

Recommended page checks:

### Dashboard

You should see:

- Node P2P session summary
- recent transport
- active sessions
- retry count

### Subagents

The remote node branch card or tooltip should show:

- P2P transport
- session status
- retry count
- last ready
- last error

## Common Problems

### 1. The Gateway Port Is Still Served By An Old Process

Symptom:

- config looks updated, but `/api/nodes` still behaves like the old runtime

Action:

- verify which `clawgo` process is actually listening on the port
- restart the intended instance

### 2. Chat Routing Interferes With Node Validation

Symptom:

- a normal chat request is routed through skills or another tool chain
- the nodes data plane was never truly exercised

Action:

- use `/api/subagents_runtime`
- use `dispatch_and_wait`
- target `node.<id>.main` explicitly

### 3. WebRTC Is Enabled But `active_sessions` Stays 0

Check:

- whether `stun_servers` is reachable
- whether `ice_servers` is valid
- whether TURN credentials are complete
- whether the node is still running with `--watch`

### 4. The Task Succeeds But You Cannot Tell If It Fell Back To Relay

Check:

- the `p2p` status in `/api/nodes`
- `used_transport` in `nodes-dispatch-audit.jsonl`
- `fallback_from` in `nodes-dispatch-audit.jsonl`
- `Nodes Dispatch Fallbacks` in `clawgo status`

## What To Record After Each Run

For each E2E run, record at least:

- gateway config version
- node registration arguments
- whether `websocket_tunnel` succeeded
- whether `webrtc` succeeded
- the `active_sessions` value
- whether any fallback occurred

That gives you a stable baseline when you later change transport, signaling, or ICE settings.

## Related Pages

- [Nodes Guide](/en/guide/nodes)
- [WebUI Console](/en/guide/webui)
- [Operations and API](/en/guide/operations)
- [WebUI API Reference](/en/reference/webui-api)
