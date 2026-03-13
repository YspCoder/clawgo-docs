# 节点使用篇

## 概览

ClawGo 的节点系统用于把远端设备或远端执行端接进主运行时。核心抽象在 `pkg/nodes`：

- `Manager`：维护节点状态与注册信息
- `Router`：根据模式选择派发路径
- `Transport`：负责 `relay` 或 `p2p`

Gateway 暴露的基础节点接口包括：

- `POST /nodes/register`
- `POST /nodes/heartbeat`

远端节点可以进一步挂成主拓扑中的 agent branch。

## 能做什么

当前节点能力模型覆盖：

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

仓库里还会默认注册一个 `local` 节点，用来统一本地能力和远端能力的调用模型。

如果节点本身带有 agent 描述，Gateway 还会把它们镜像成远端 branch，例如：

- `node.edge-a.main`
- `node.edge-a.vision`

这样主拓扑里不仅能看到节点本身，也能看到节点下挂的远端 agent 树。

## 派发模式

节点调度支持三种模式：

- `auto`
- `p2p`
- `relay`

大致行为：

- `auto`：优先尝试 P2P，失败时回退到 relay
- `p2p`：强制走点对点路径
- `relay`：强制走 HTTP relay 路径

最近的审计里会记录：

- `used_transport`
- `fallback_from`
- `artifact_count`
- `artifact_kinds`

这样你可以直接看一次请求最终走了哪条链路，是否发生过回退。

## 派发策略

最近的版本把节点调度策略单独放到了 `gateway.nodes.dispatch`。

常见字段：

- `prefer_local`
- `prefer_p2p`
- `allow_relay_fallback`
- `action_tags`
- `agent_tags`
- `allow_actions`
- `deny_actions`
- `allow_agents`
- `deny_agents`

实用理解：

- `prefer_local`：本地节点与远端节点都能做时，是否先试本地
- `prefer_p2p`：远端节点可直连时，是否先试 P2P
- `action_tags` / `agent_tags`：某个 action 或远端 agent 只有命中标签才允许派发
- `allow_*` / `deny_*`：更强的白名单 / 黑名单约束

节点标签来源有两处：

- 节点注册时的 `clawgo node register --tags`
- 节点上报的 `NodeInfo.tags`

适合的例子：

- `camera_clip` 只打到 `vision`
- `agent_task` 的某个远端 agent 只打到 `gpu`
- 某些高风险动作拒绝落到 `public` 标签节点

## Node P2P

最近的版本把节点数据面扩展成两条可选路径：

- `websocket_tunnel`
- `webrtc`

默认仍然关闭，只有显式配置 `gateway.nodes.p2p.enabled = true` 才会启用。建议上线顺序是：

1. 先用 `websocket_tunnel` 验证链路
2. 再切换到 `webrtc`

## 配置示例

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

字段要点：

- `stun_servers`：兼容旧配置的简单 STUN 列表
- `ice_servers`：推荐的新结构
- `ice_servers[].urls` 支持 `stun:`、`turn:`、`turns:`
- `turn:` / `turns:` URL 必须同时提供 `username` 和 `credential`

## websocket_tunnel

这是当前最稳妥的 P2P 过渡方案。

特点：

- 复用节点与 Gateway 之间的持久 websocket
- 节点请求通过 websocket 做 request/response tunnel
- 不需要额外的 WebRTC 协商

适用场景：

- 先验证节点连通性
- 网络环境复杂，不想先引入 ICE/TURN
- 需要一个比纯 relay 更直接、但更容易调试的路径

## WebRTC

`webrtc` 是更完整的点对点数据面。

当前实现特点：

- Gateway 会通过 websocket 做 signaling relay
- 节点与 Gateway 建立 WebRTC data channel
- 初始化时会尝试 offer / answer / candidate 协商
- 建连失败时，调度层仍可回退到 relay / tunnel

最近还暴露了会话健康信息，例如：

- `status`
- `last_error`
- `retry_count`
- `last_attempt`
- `last_ready_at`

这对排查“为什么没直连成功”很关键。

## 节点产物

最近节点执行除了返回文本结果，还会把媒体和文件产物挂到审计里。

常见来源：

- `agent_task`
- `camera_snap`
- `camera_clip`
- `screen_snapshot`
- `screen_record`

最近的审计与 WebUI 里会看到：

- `artifact_count`
- `artifact_kinds`
- `artifacts[]`

如果是 `agent_task`，最近实现还支持把 `artifact_paths` 一起上送，便于把远端执行生成的文件纳入统一下载与审计链路。

### 保留策略

`gateway.nodes.artifacts` 控制节点产物保留：

- `enabled`
- `keep_latest`
- `retain_days`
- `prune_on_read`

默认值是：

- `enabled = false`
- `keep_latest = 500`
- `retain_days = 7`
- `prune_on_read = true`

启用后，Gateway 会在读取产物列表时自动清理过期或超量记录。

## WebUI 里怎么看

最近的 WebUI 已经把节点 P2P 接进去了：

- Dashboard 会展示 Node P2P 卡片
- Config 页面能直接编辑 `gateway.nodes.p2p`
- Config 页面还能直接编辑 `gateway.nodes.dispatch` 与 `gateway.nodes.artifacts`
- Nodes 页面会展示节点详情、远端 agent 树、最近派发、P2P 会话和产物
- NodeArtifacts 页面会展示产物列表、导出、下载、删除和 prune
- TaskAudit 页面会追加 node dispatch 审计视图
- `/api/nodes` 会返回 `p2p`、`dispatches`、`alerts`、`artifact_retention`

Dashboard 当前会展示：

- transport
- active sessions
- retry count
- STUN / ICE 配置数量
- 节点派发的产物数量与预览摘要

Nodes 详情页当前能直接查看：

- 节点标签、能力、动作、模型
- 在线状态、last seen、endpoint、版本、OS/arch
- 远端 agent tree
- 最近派发记录与 replay
- 最近产物与原始 JSON

## `status` 怎么看

`clawgo status` 现在会额外输出：

- `Nodes P2P: enabled=<bool> transport=<name>`
- `Nodes P2P ICE: stun=<n> ice=<n>`
- `Nodes Dispatch Top Transport`
- `Nodes Dispatch Fallbacks`

如果你正在排查 WebRTC 建连、relay 回退或 tunnel 是否真正生效，这几个字段是第一手线索。

## 排障建议

### P2P 一直没起来

先确认：

- `gateway.nodes.p2p.enabled = true`
- `transport` 是否真的切到了你预期的值
- `stun_servers` / `ice_servers` 是否有效
- TURN 地址如果用了 `turn:` / `turns:`，用户名和凭证是否完整

### 调度总是回退到 relay

先看：

- `status` 输出里的 `Nodes Dispatch Fallbacks`
- `nodes-dispatch-audit.jsonl` 里的 `used_transport` 和 `fallback_from`
- `/api/nodes` 返回的 `p2p.nodes[]` 会话状态
- `/api/node_dispatches` 返回的节点派发审计

### 节点产物越来越多

先确认：

- `gateway.nodes.artifacts.enabled`
- `keep_latest`
- `retain_days`
- `prune_on_read`

如果你希望人工收口，也可以直接在 WebUI 的 NodeArtifacts 页面触发 prune。

### 什么时候先别上 WebRTC

如果你只是想先把节点调通，建议先用：

- `websocket_tunnel`

等链路、权限、节点注册和心跳都稳定后，再切到 `webrtc`。

## 相关页面

- [通道与 Cron](/guide/integrations)
- [配置说明](/guide/configuration)
- [WebUI 控制台](/guide/webui)
- [运维与 API](/guide/operations)
- [WebUI API 参考](/reference/webui-api)
