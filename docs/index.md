---
layout: home

hero:
  name: "ClawGo"
  text: "面向生产的 Go 原生 Agent Runtime"
  tagline: 可长期运行、可恢复、可观测、可编排的多 Agent 运行时
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
  - title: "🦀 多 Agent 编排"
    details: 内置 main agent、subagent、远端 node branch 协作模型，支持拓扑可视化与任务分发。
  - title: "♻️ 运行时恢复"
    details: 会话、线程、消息、子任务、审计事件都会持久化，进程重启后可继续恢复执行现场。
  - title: "🛠️ 工程化运维"
    details: 通过 config.json、AGENT.md、热更新、WebUI、日志、审计、Cron 和通道接入完成整套运维闭环。
---

## 🦞 ClawGo 是什么

ClawGo 不是单纯的聊天壳子，也不是只会调用工具的一层 prompt 包装。它更像一个围绕 Agent 运行生命周期设计的 Go Runtime：

- 负责接收来自 CLI、WebUI、Cron 和外部通道的任务
- 负责把任务交给主 Agent、子 Agent 或远端节点
- 负责保存运行轨迹、消息线程、任务状态和记忆
- 负责提供可观测面，包括日志、拓扑、任务审计和 EKG

## 📚 文档内容

文档基于 `clawgo` 当前代码整理，覆盖以下主题：

- 安装、初始化、模型配置与启动方式·
- `config.json` 的完整结构与关键字段
- `clawgo` CLI 的主要命令
- WebUI 页面功能和后端 API 对应关系
- Subagent、Skills、Channels、Cron、Nodes 的协作方式
- 运行时持久化、恢复策略、日志与监控能力
- 本地开发、构建、发布和嵌入式资源同步流程

## 🗂️ 文档分类

### 🧠 概念篇

面向先建立整体理解的读者，建议先看：

- [概念总览](/concepts/)
- [架构总览](/guide/architecture)
- [运行时、存储与恢复](/guide/runtime-storage)
- [Subagent 与 Skills](/guide/subagents-and-skills)

### 🚀 使用篇

面向准备直接部署和使用的读者：

- [使用导览](/guide/)
- [快速开始](/guide/quick-start)
- [配置说明](/guide/configuration)
- [CLI 命令](/guide/cli)
- [WebUI 控制台](/guide/webui)
- [通道、Cron 与节点](/guide/integrations)

### 📖 参考篇

面向查字段、查接口、查目录约定：

- [参考总览](/reference/)
- [配置参考](/reference/config-reference)
- [WebUI API 参考](/reference/webui-api)
- [工作区与持久化目录](/reference/workspace-layout)

### 🔧 运维与开发

面向运行、排障、构建和发布：

- [运维开发导览](/ops/)
- [运维与 API](/guide/operations)
- [开发与构建](/guide/development)

## ✅ 建议阅读顺序

1. [快速开始](/guide/quick-start)
2. [架构总览](/guide/architecture)
3. [配置说明](/guide/configuration)
4. [CLI 命令](/guide/cli)
5. [WebUI 控制台](/guide/webui)
