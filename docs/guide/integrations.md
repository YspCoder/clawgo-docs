# 通道与 Cron

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

## 节点

节点已经单独拆成使用篇：

- [节点使用篇](/guide/nodes)

如果你要看：

- 远端节点注册与心跳
- relay / p2p / auto 派发
- `websocket_tunnel` 与 `webrtc`
- `stun_servers` / `ice_servers`
- Dashboard、`status` 与 `/webui/api/nodes` 里的 P2P 可观测信息

直接去节点页更完整。
