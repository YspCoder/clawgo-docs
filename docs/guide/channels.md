# 通道使用篇

## 概览

ClawGo 的外部通道适配器位于 `pkg/channels`。它们负责把外部消息接入运行时，并把运行时输出再分发回目标平台。

当前已实现的通道包括：

- `telegram`
- `discord`
- `feishu`
- `dingtalk`
- `qq`
- `whatsapp`
- `maixcam`

通道管理器统一负责：

- 初始化已启用的适配器
- 启动与停止
- 入站消息投递到 bus
- 出站消息按 channel 分发
- 去重窗口与重复抑制

## 常见配置项

不同通道字段各不相同，但公共去重相关字段包括：

- `inbound_message_id_dedupe_ttl_seconds`
- `inbound_content_dedupe_window_seconds`
- `outbound_dedupe_window_seconds`

这组配置决定：

- 相同消息 ID 多久内不重复处理
- 相同内容在窗口期内是否视为重复
- 相同出站消息是否要抑制重复发送

## Telegram

Telegram 是最常见的接入方式之一。

常用字段：

- `token`
- `streaming`
- `allow_from`
- `allow_chats`
- `enable_groups`
- `require_mention_in_groups`

适用场景：

- 个人 bot
- 小规模群聊运维入口
- 需要流式回复展示的场景

## Feishu / DingTalk / QQ / Discord

这些通道的差异主要在：

- 鉴权方式
- 允许来源字段
- 群聊与私聊约束

但总体接入模型是一致的：

- 入站消息进入 runtime
- 出站消息由 message bus 回推

## WhatsApp

WhatsApp 最近更接近“bridge 作为一等通道服务”的模式。

你可以有两种理解方式：

- 使用默认嵌入式 bridge 流程
- 显式配置 `channels.whatsapp.bridge_url`

常见字段：

- `enabled`
- `bridge_url`
- `allow_from`
- `enable_groups`
- `require_mention_in_groups`

如果你使用 WebUI 的频道设置页，还能直接看到：

- bridge 状态
- 当前账号
- 最近事件
- QR code 可用性

这更适合做手机侧接入、个人消息入口或群聊值班入口。

## MaixCam

`maixcam` 更偏设备端接入。

常见字段：

- `host`
- `port`
- `allow_from`

如果你在做边缘设备、摄像头或本地设备联动，这类通道更有意义。

## 使用建议

### 先接一个通道

建议先从单一通道开始，例如 Telegram，先验证：

- Gateway 是否能正常启动
- token 是否有效
- allow 规则是否正确
- 入站消息能否进入会话

### 再补去重配置

如果你上线后发现：

- webhook 重放
- 外部平台重复投递
- 同一消息被转发多次

再回头细调 dedupe 相关字段。

### 把消息入口和运维入口分开

如果你有多个通道，建议区分：

- 面向用户的外部入口
- 面向维护者的运维入口

这样能避免 Cron、Sentinel、审批消息和普通用户消息混在一起。

## 相关页面

- [Cron 使用篇](/guide/cron)
- [节点使用篇](/guide/nodes)
- [配置说明](/guide/configuration)
- [运维与 API](/guide/operations)
