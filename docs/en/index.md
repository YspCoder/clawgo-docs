---
layout: home

hero:
  name: "ClawGo"
  text: "A Production-Oriented, Go-Native Agent Runtime"
  tagline: Long-running, recoverable, observable, and orchestrated multi-agent runtime
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
  - title: "🦀 Multi-Agent Orchestration"
    details: Built-in main agent, subagents, and remote node branches with observable topology and task dispatch.
  - title: "♻️ Runtime Recovery"
    details: Sessions, threads, messages, sub-tasks, and audit events are persisted so execution can resume after restart.
  - title: "🛠️ Operational Engineering"
    details: Manage the full lifecycle with config.json, AGENT.md, hot reload, WebUI, logs, audit, cron, and channels.
---

## 🦞 What ClawGo Is

ClawGo is not just a chat shell and not merely a prompt wrapper around tool calling. It is a Go runtime built around the full execution lifecycle of agents:

- Accepts tasks from CLI, WebUI, cron, and external channels
- Dispatches tasks to the main agent, subagents, or remote nodes
- Persists execution traces, message threads, task states, and memory
- Provides observability through logs, topology, task audit, and EKG

## 📚 What This Documentation Covers

This documentation is organized from the current codebase in `/Users/lpf/Desktop/project/clawgo` and covers:

- Installation, onboarding, model configuration, and startup
- The structure and important fields of `config.json`
- The major `clawgo` CLI commands
- WebUI pages and their backend API mappings
- How subagents, skills, channels, cron, and nodes work together
- Runtime persistence, recovery, logging, and observability
- Local development, build, release, and embedded asset sync

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
- [Channels, Cron, and Nodes](/en/guide/integrations)

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
4. [CLI](/en/guide/cli)
5. [WebUI Console](/en/guide/webui)
