---
layout: home

hero:
  name: "ClawGo"
  text: "A Go Runtime For Long-Running Simulated Worlds"
  tagline: A World Runtime centered on world state, NPC state, and recoverable execution
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
  - title: "🌍 World Runtime"
    details: "`main` acts as the world mind, `npc` acts as an autonomous character, and the system advances through ingest, decide, arbitrate, apply, and render."
  - title: "♻️ Recoverable Execution"
    details: "`world_state.json`, `npc_state.json`, `world_events.jsonl`, and runtime records persist across restart."
  - title: "🧭 Operational Surface"
    details: "CLI, Gateway API, a standalone WebUI, logs, EKG, nodes, and channels form the full control plane."
---

## 🦞 What ClawGo Is

ClawGo is no longer documented as a generic multi-agent chat shell. Its current core model is a **World Runtime**:

- user input becomes a world event first
- `main` performs world-level judgment and arbitration
- `agent` and `npc` actors produce intents instead of directly mutating final world truth
- the runtime persists state, events, execution records, and observability data

The typical flow is:

```text
user -> main(world mind) -> npc/agent intents -> arbitrate -> apply -> render -> user
```

## 📚 What This Documentation Covers

- installation, onboarding, provider setup, and startup
- actor and NPC configuration centered on `agents.agents`
- world runtime, runtime snapshots, and recovery
- CLI, Gateway API, and the separately deployed WebUI
- MCP, channels, cron, nodes, EKG, and runnable examples
- local development, build, release, and workspace templates

## 🗂️ Documentation Sections

### 🧠 Concepts

- [Concept Overview](/en/concepts/)
- [Architecture](/en/guide/architecture)
- [Runtime, Storage, and Recovery](/en/guide/runtime-storage)
- [Agents, NPCs, and Skills](/en/guide/subagents-and-skills)

### 🚀 Guides

- [Guide Index](/en/guide/)
- [Quick Start](/en/guide/quick-start)
- [Configuration](/en/guide/configuration)
- [CLI](/en/guide/cli)
- [WebUI Console](/en/guide/webui)
- [Nodes Guide](/en/guide/nodes)

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
5. [Agents, NPCs, and Skills](/en/guide/subagents-and-skills)

## 📮 Contact

- WeChat: `Coding_001`
- Telegram: [@YspCoder](https://t.me/YspCoder)
