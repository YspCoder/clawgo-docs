# Node P2P E2E 验证

这份示例用于验证 `gateway.nodes.p2p` 的两条真实数据面：

- `websocket_tunnel`
- `webrtc`

它不是单元测试，也不是本地 mock，而是多台真实机器上的端到端联通验证。

## 适用场景

适合你在这些时候使用：

- 第一次把远端 node 接进同一个 gateway
- 想确认 `websocket_tunnel` 真的在工作
- 想确认 `webrtc` 真的建立了 DataChannel，而不是只完成 signaling
- 想区分“HTTP relay 成功”与“P2P 真正成功”

## 验证目标

验证通过应同时满足：

1. 两台远端 node 都能成功注册到同一个 gateway
2. `websocket_tunnel` 模式下，远端 node 任务可成功完成
3. `webrtc` 模式下，远端 node 任务可成功完成
4. `webrtc` 模式下，`/api/nodes` 的 `p2p.active_sessions` 大于 `0`
5. Dashboard / Subagents 能看到 node P2P 会话状态和最近调度路径

## 拓扑准备

最小验证拓扑：

- 1 台 gateway 机器
- 2 台远端 node 机器

要求：

- 三台机器都能运行 `clawgo`
- 远端机器有 `python3`
- gateway 对外开放 WebUI / node registry 端口

建议顺序：

1. 先验证 `websocket_tunnel`
2. 再切到 `webrtc`
3. `webrtc` 至少先配置一个可用的 `stun_servers`

## 核心判定思路

为了避免把 HTTP relay 误判成 P2P，建议让目标 node 的 `endpoint` 故意写成只对该 node 本机有效的地址，例如：

```text
http://127.0.0.1:<port>
```

这样如果任务仍然能成功完成，就说明请求不是 gateway 直接通过公网 HTTP relay 打过去，而是走了 node P2P 通道。

## Gateway 建议配置

### 方案一：`websocket_tunnel`

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

### 方案二：`webrtc`

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

如果你需要 TURN，建议直接使用 `ice_servers`：

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

## 最小 node endpoint

在每台远端 node 上启动一个最小 HTTP 服务，用来返回固定结果：

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

启动示例：

```bash
PORT=19081 NODE_LABEL=node-a python3 mini_node.py
```

## 注册远端 node

在每台 node 上执行：

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

这里有两个关键点：

- `--endpoint` 故意用 `127.0.0.1`
- `--watch` 必须开，后续 websocket tunnel 和 WebRTC signaling 都依赖它

## 验证注册状态

在 gateway 机器上查看：

```bash
curl -s -H 'Authorization: Bearer YOUR_GATEWAY_TOKEN' \
  http://<gateway-host>:18790/api/nodes
```

预期：

- 远端 node 出现在 `nodes`
- `online = true`
- 主拓扑里出现 `node.<id>.main`

## 建议的任务验证方法

不要把“普通聊天 prompt 能否最终完成任务”作为主判据。  
更稳定的方式，是直接通过 `subagents_runtime` 把任务派给远端 node branch：

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

预期：

- `ok = true`
- `result.reply.status = completed`
- `result.reply.result` 含远端 endpoint 返回内容

## `websocket_tunnel` 判定

在 `websocket_tunnel` 模式下，执行上面的 `dispatch_and_wait`，应能成功完成。

如果目标 node 的 `endpoint` 明明配置成了 `127.0.0.1:<port>`，任务仍然成功，就说明：

- 不是 gateway 直接 HTTP relay 到一个公网 endpoint
- 实际请求已经通过 node websocket tunnel 送达目标 node

## `webrtc` 判定

切到 `webrtc` 配置后，重复同样的 `dispatch_and_wait`。

随后查看：

```bash
curl -s -H 'Authorization: Bearer YOUR_GATEWAY_TOKEN' \
  http://<gateway-host>:18790/api/nodes
```

预期 `p2p` 段包含：

- `transport = "webrtc"`
- `active_sessions > 0`
- `nodes[].status = "open"`
- `nodes[].last_ready_at` 非空

这才表示 WebRTC DataChannel 已经真正建立，而不只是 signaling 被触发。

## WebUI 判定

页面验证建议看：

### Dashboard

应能看到：

- Node P2P 会话摘要
- 最近 transport
- active sessions
- retry count

### Subagents

远端 node branch 的卡片或 tooltip 应能显示：

- P2P transport
- session status
- retry count
- last ready
- last error

## 常见问题

### 1. gateway 端口上跑的其实还是旧实例

现象：

- 配置明明改了，但 `/api/nodes` 仍表现出旧行为

处理：

- 先确认端口上实际监听的是哪个 `clawgo` 进程
- 再启动当前测试实例

### 2. 聊天路由干扰了 node 数据面验证

现象：

- 普通聊天请求被 router、skill 或别的工具链分流
- 没有真正命中 nodes 数据面

处理：

- 直接使用 `/api/subagents_runtime`
- 用 `dispatch_and_wait`
- 明确指定 `node.<id>.main`

### 3. WebRTC 开了但 `active_sessions` 还是 0

优先检查：

- `stun_servers` 是否可达
- `ice_servers` 是否有效
- TURN 凭证是否完整
- 节点是否保持 `--watch` 长连接

### 4. 明明成功了，但不确定是不是回退到 relay

看这几处：

- `/api/nodes` 的 `p2p` 状态
- `nodes-dispatch-audit.jsonl` 里的 `used_transport`
- `nodes-dispatch-audit.jsonl` 里的 `fallback_from`
- `clawgo status` 里的 `Nodes Dispatch Fallbacks`

## 结果记录建议

建议每次 E2E 验证至少记录：

- gateway 配置版本
- 两台 node 的注册参数
- `websocket_tunnel` 是否成功
- `webrtc` 是否成功
- `active_sessions` 数值
- 是否发生 fallback

这样后续改 transport、signaling、ICE 配置时才有对照基线。

## 相关页面

- [节点使用篇](/guide/nodes)
- [WebUI 控制台](/guide/webui)
- [运维与 API](/guide/operations)
- [WebUI API 参考](/reference/webui-api)
