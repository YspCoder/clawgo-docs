---
layout: home

hero:
  name: "ClawGo"
  text: "面向生产的 Go 原生 Agent Runtime"
  tagline: 可长期运行、可观测、可恢复、可编排的多 Agent 运行时
  image:
    src: /clawgo-logo.svg
    alt: ClawGo Logo
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start
    - theme: alt
      text: 架构总览
      link: /guide/architecture

features:
  - title: "🕸️ 多 Agent 拓扑"
    details: "统一组织 `main / subagents / remote branches`，内部协作流可观测，但不会污染用户主通道。"
  - title: "♻️ 可恢复执行"
    details: "`subagent_runs.jsonl`、`subagent_events.jsonl`、`threads.jsonl`、`agent_messages.jsonl` 持久化后可在重启后继续恢复。"
  - title: "🛠️ 工程化运维"
    details: "通过 `config.json`、`AGENT.md`、日志、记忆、节点、OAuth 和 WebUI 形成完整运行闭环。"
---

## 🦞 ClawGo 是什么

ClawGo 当前的真实定位是 **Agent Runtime**，不是 world simulator，也不是单纯的聊天壳子。

当前主线模型是：

- `main agent` 负责入口、路由、派发与汇总
- `subagent runtime` 负责本地或远端分支执行
- `runtime store` 负责保存 run、event、thread、message 与 memory
- WebUI 负责检查、状态展示和账号管理

默认协作流：

```text
user -> main -> worker -> main -> user
```

## 📚 文档覆盖内容

- 安装、初始化、provider 选择与登录
- `agents.subagents` 驱动的 subagent 注册与权限模型
- subagent run、thread、message 的持久化与恢复
- CLI、Gateway、WebUI、节点、MCP、Cron、Channels
- 本地开发、构建、部署和工作区模板

## 🗂️ 文档分类

### 🧠 概念篇

- [概念总览](/concepts/)
- [架构总览](/guide/architecture)
- [运行时、存储与恢复](/guide/runtime-storage)
- [Subagent 与 Skills](/guide/subagents-and-skills)

### 🚀 使用篇

- [使用导览](/guide/)
- [快速开始](/guide/quick-start)
- [配置说明](/guide/configuration)
- [CLI 命令](/guide/cli)
- [WebUI 控制台](/guide/webui)
- [通道使用篇](/guide/channels)

### 📖 参考篇

- [参考总览](/reference/)
- [配置参考](/reference/config-reference)
- [WebUI API 参考](/reference/webui-api)
- [工作区与持久化目录](/reference/workspace-layout)

### 🔧 运维与开发

- [运维开发导览](/ops/)
- [运维与 API](/guide/operations)
- [开发与构建](/guide/development)

## ✅ 建议阅读顺序

1. [快速开始](/guide/quick-start)
2. [架构总览](/guide/architecture)
3. [配置说明](/guide/configuration)
4. [运行时、存储与恢复](/guide/runtime-storage)
5. [Subagent 与 Skills](/guide/subagents-and-skills)

## 📮 联系方式

- 微信：`Coding_001`
- Telegram：[`@YspCoder`](https://t.me/YspCoder)
