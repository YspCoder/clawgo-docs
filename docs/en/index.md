---
layout: home

hero:
  name: "ClawGo"
  text: "A Production-Oriented, Go-Native Agent Runtime"
  tagline: Long-running, observable, recoverable, orchestrated runtime for real agent systems
  image:
    src: /clawgo-logo.svg
    alt: ClawGo Logo
  actions:
    - theme: brand
      text: Quick Start
      link: /en/guide/quick-start
    - theme: alt
      text: Architecture
      link: /en/guide/architecture

features:
  - title: "🕸️ Multi-Agent Topology"
    details: "A unified `main / subagents / remote branches` model where internal collaboration stays observable without polluting user-facing chat."
  - title: "♻️ Recoverable Execution"
    details: "`subagent_runs.jsonl`, `subagent_events.jsonl`, `threads.jsonl`, and `agent_messages.jsonl` allow recovery after restart."
  - title: "🛠️ Operational Engineering"
    details: "Use `config.json`, `AGENT.md`, logs, memory, nodes, OAuth, and WebUI as a full runtime control surface."
---

## 🦞 What ClawGo Is

ClawGo is currently an **Agent Runtime**, not a world simulator and not just a chat wrapper.

The main model is:

- `main agent` handles entry, routing, dispatch, and merge
- `subagent runtime` executes local and remote branches
- `runtime store` persists runs, events, threads, messages, and memory
- WebUI focuses on inspection, status views, and account management

Default collaboration flow:

```text
user -> main -> worker -> main -> user
```

## 📚 What This Documentation Covers

- installation, onboarding, provider selection, and provider login
- the `agents.subagents` registry and tool-permission model
- subagent run, thread, and message persistence
- CLI, Gateway, WebUI, nodes, MCP, cron, and channels
- local development, build, deployment, and workspace templates

## 🗂️ Documentation Sections

### 🧠 Concepts

- [Concept Overview](/en/concepts/)
- [Architecture](/en/guide/architecture)
- [Runtime, Storage, and Recovery](/en/guide/runtime-storage)
- [Subagents and Skills](/en/guide/subagents-and-skills)

### 🚀 Guides

- [Guide Index](/en/guide/)
- [Quick Start](/en/guide/quick-start)
- [Configuration](/en/guide/configuration)
- [CLI](/en/guide/cli)
- [WebUI Console](/en/guide/webui)
- [Channels Guide](/en/guide/channels)

### 📖 Reference

- [Reference Index](/en/reference/)
- [Config Reference](/en/reference/config-reference)
- [WebUI API Reference](/en/reference/webui-api)
- [Workspace Layout](/en/reference/workspace-layout)

### 🔧 Ops & Dev

- [Ops & Dev Index](/en/ops/)
- [Operations and API](/en/guide/operations)
- [Development and Build](/en/guide/development)

## ✅ Suggested Reading Order

1. [Quick Start](/en/guide/quick-start)
2. [Architecture](/en/guide/architecture)
3. [Configuration](/en/guide/configuration)
4. [Runtime, Storage, and Recovery](/en/guide/runtime-storage)
5. [Subagents and Skills](/en/guide/subagents-and-skills)

## 📮 Contact

- WeChat: `Coding_001`
- Telegram: [@YspCoder](https://t.me/YspCoder)
