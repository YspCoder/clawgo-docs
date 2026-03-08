# 通道、Cron 与节点

## 外部通道

ClawGo 已实现的通道适配器位于 `pkg/channels`：

- `telegram.go`
- `discord.go`
- `feishu.go`
- `dingtalk.go`
- `qq.go`
- `whatsapp.go`
- `maixcam.go`

通道管理器统一负责：

- 初始化启用的适配器
- 启动与停止
- 入站消息投递到 bus
- 出站消息按 channel 分发
- 去重窗口与消息重复抑制

## Telegram

配置字段包括：

- `token`
- `streaming`
- `allow_from`
- `allow_chats`
- `enable_groups`
- `require_mention_in_groups`

适合最常见的个人 bot 接入。

## Feishu / DingTalk / QQ / Discord / WhatsApp

这几类主要差异在鉴权方式和允许来源字段上，但整体接入模型相同：

- 入站变成 runtime 的消息
- 出站由 message bus 回推

## MaixCam

`maixcam` 更偏设备端接入，配置中包含：

- `host`
- `port`
- `allow_from`

## Cron

ClawGo 的 Cron 不是简单 shell 计划任务，而是把计划任务回投给 Agent Runtime。

一个 Cron Job 包含：

- `name`
- `schedule`
- `message`
- `deliver`
- `channel`
- `to`
- `enabled`
- `state`

支持的计划形式：

- `every`
- `cron`
- `at`

Gateway 启动时会构造 `CronService`，并将 job 触发结果重新派发到 runtime。

## remind 与 cron tools

当 `CronService` 存在时，AgentLoop 会额外注册：

- `remind`
- `cron`

这意味着 agent 可以在运行中自我安排提醒或周期任务，而不是只能靠外部 CLI 创建。

## 节点系统

`pkg/nodes` 提供了一套远端执行抽象。当前设计重点是：

- `Manager` 维护节点状态
- `Router` 负责派发
- `Transport` 负责 relay/p2p 通信

Gateway 暴露：

- `POST /nodes/register`
- `POST /nodes/heartbeat`

远端节点可被挂载为主拓扑中的 agent branch。

## Node P2P

最近的提交把 Node 数据面扩展成两条可选路径：

- `websocket_tunnel`
- `webrtc`

默认仍然关闭，只有显式配置 `gateway.nodes.p2p.enabled = true` 才启用。建议实践顺序是：

1. 先用 `websocket_tunnel` 验证链路
2. 再切换到 `webrtc`

当前 P2P 配置入口：

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

字段含义：

- `stun_servers`: 兼容旧配置的简单 STUN 列表
- `ice_servers`: 推荐的新结构，支持 `stun:`、`turn:`、`turns:`
- `turn:` / `turns:` URL 需要同时提供 `username` 和 `credential`

运行时行为：

- `auto` 模式下优先尝试 P2P
- P2P 失败时会回退到 relay / tunnel 路径
- 节点审计会记录 `used_transport` 和 `fallback_from`

WebRTC 还会暴露会话健康状态，例如：

- `status`
- `last_error`
- `retry_count`
- `last_attempt`
- `last_ready_at`

## local 模拟节点

代码里默认注册了一个 `local` 节点，用于模拟：

- `run`
- `agent_task`
- `camera_snap`
- `camera_clip`
- `screen_snapshot`
- `screen_record`
- `location_get`
- `canvas_snapshot`
- `canvas_action`

它的意义是先统一能力模型，再决定能力来自本机、relay 还是真实远端节点。

## 节点审计

节点调用会记录到：

```text
workspace/memory/nodes-dispatch-audit.jsonl
```

`clawgo status` 也会汇总节点数量、在线数、能力分布和派发统计。

最近还新增了这些可观测字段：

- `Nodes P2P: enabled=<bool> transport=<name>`
- `Nodes P2P ICE: stun=<n> ice=<n>`
- `Nodes Dispatch Top Transport`
- `Nodes Dispatch Fallbacks`
