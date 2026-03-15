# 概念总览

这一部分回答的是“ClawGo 到底是什么，以及它为什么这样设计”。

如果你把 ClawGo 只理解成一个聊天机器人，很容易误判它的边界。按当前代码来看，它更接近一个长期运行的 World Runtime，核心目标是：

- 让 world state、NPC state 和 actor runtime 长期运行
- 让 `main`、`agent`、`npc` 协作可视、可追踪、可恢复
- 让 prompt、工具、角色、通道、定时任务都能工程化管理

## 建议阅读顺序

1. [架构总览](/guide/architecture)
2. [运行时、存储与恢复](/guide/runtime-storage)
3. [Agents、NPC 与 Skills](/guide/subagents-and-skills)

## 这一部分重点理解什么

### 1. Runtime 而不是 Chat Shell

ClawGo 有自己的：

- AgentLoop
- 消息总线
- 会话与线程
- 持久化与恢复
- 热更新与运维面

这决定了它不是简单“用户说一句，模型回一句”。

### 2. World Actor 协作是第一等公民

配置、WebUI 和运行时都把以下对象作为核心实体：

- `main`
- `agent`
- `npc`
- node-backed branch
- world event
- task / run / event

### 3. 可恢复与可观测是默认能力

从 jsonl 审计、sessions、logs、task audit 到 EKG，整个系统明显偏向生产场景，而不是 demo。

## 适合谁读

- 想先建立整体心智模型的开发者
- 准备改 runtime、router、actor / NPC 的贡献者
- 想把它接进自己现有 Agent 系统的人
