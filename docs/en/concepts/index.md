# Concept Overview

This section answers a simple question: what exactly ClawGo is, and why it is designed this way.

If you think of ClawGo as only a chatbot, you will misread its boundaries. From the current codebase, it is much closer to a long-running agent runtime with three main goals:

- Make agents execute continuously instead of only replying
- Make multi-agent collaboration visible, traceable, and recoverable
- Make prompts, tools, roles, channels, and scheduled tasks manageable as engineering assets

## Suggested Reading Order

1. [Architecture](/en/guide/architecture)
2. [Runtime, Storage, and Recovery](/en/guide/runtime-storage)
3. [Subagents and Skills](/en/guide/subagents-and-skills)

## What To Understand Here

### 1. Runtime, Not Chat Shell

ClawGo has its own:

- `AgentLoop`
- message bus
- sessions and threads
- persistence and recovery
- hot reload and operations surface

That is why it is not just “user says one thing, model says one thing back.”

### 2. Multi-Agent Collaboration Is First-Class

The configuration, WebUI, and runtime all treat these as core entities:

- main agent
- subagent
- node-backed branch
- thread
- message
- task

### 3. Recovery and Observability Are Default Capabilities

From jsonl audit logs and sessions to logs, task audit, and EKG, the system is clearly shaped for production-oriented runtime behavior, not just demos.
