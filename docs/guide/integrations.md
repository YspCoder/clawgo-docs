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
