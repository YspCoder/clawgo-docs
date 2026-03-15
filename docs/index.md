---
layout: home

hero:
  name: "ClawGo"
  text: "面向长期世界模拟的 Go Runtime"
  tagline: 以 world state、NPC state 和 runtime recovery 为核心的 World Runtime
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
  - title: "🌍 World Runtime"
    details: "`main` 作为 world mind，`npc` 作为自治角色，系统围绕 ingest、decide、arbitrate、apply、render 推进世界。"
  - title: "♻️ 可恢复运行"
    details: "`world_state.json`、`npc_state.json`、`world_events.jsonl` 以及 runtime 记录都会落盘，进程重启后可继续推进。"
  - title: "🧭 工程化控制面"
    details: "通过 CLI、Gateway API、独立部署的 WebUI、日志、EKG、节点与通道构成完整运维面。"
---

## 🦞 ClawGo 是什么

ClawGo 现在的核心定位不是“通用多 Agent 聊天壳”，而是一个 **World Runtime**：

- 用户输入先进入 world event
- `main` 负责世界级判断与仲裁
- `agent` / `npc` 产生 intent，而不是直接改写最终世界状态
- runtime 负责把状态、事件、执行记录和观测面长期保存下来

典型执行链路是：

```text
user -> main(world mind) -> npc/agent intents -> arbitrate -> apply -> render -> user
```

## 📚 这套文档覆盖什么

- 安装、初始化、provider 配置与启动方式
- `agents.agents` 驱动的 actor / NPC 配置
- world runtime、runtime snapshot 与恢复机制
- CLI、Gateway API、独立部署 WebUI 的使用方式
- MCP、Channels、Cron、Nodes、EKG 与示例验证
- 本地开发、构建、发布与工作区模板

## 🗂️ 文档分类

### 🧠 概念篇

- [概念总览](/concepts/)
- [架构总览](/guide/architecture)
- [运行时、存储与恢复](/guide/runtime-storage)
- [Agents、NPC 与 Skills](/guide/subagents-and-skills)

### 🚀 使用篇

- [使用导览](/guide/)
- [快速开始](/guide/quick-start)
- [配置说明](/guide/configuration)
- [CLI 命令](/guide/cli)
- [WebUI 控制台](/guide/webui)
- [节点使用篇](/guide/nodes)

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
5. [Agents、NPC 与 Skills](/guide/subagents-and-skills)

## 📮 联系方式

- 微信：`Coding_001`
- Telegram：[`@YspCoder`](https://t.me/YspCoder)
