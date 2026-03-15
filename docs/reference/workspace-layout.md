# 工作区与持久化目录

这页回答两个问题：

1. ClawGo 默认把文件写到哪里
2. 哪些目录是模板，哪些目录是运行时产物

## 默认根目录

正常模式下：

```text
~/.clawgo
```

常见内容：

- `config.json`
- `workspace/`
- `logs/`
- `cron/`
- `sessions/`
- `gateway.pid`

## `workspace/`

默认工作区：

```text
~/.clawgo/workspace
```

初始化时会拷贝模板内容，例如：

- `AGENTS.md`
- `BOOT.md`
- `BOOTSTRAP.md`
- `IDENTITY.md`
- `MEMORY.md`
- `SOUL.md`
- `TOOLS.md`
- `USER.md`
- `HEARTBEAT.md`
- `memory/`
- `skills/`

## `workspace/agents/runtime/`

这是最近最关键的运行时目录。

当前 world runtime 与 actor runtime 会写入：

- `world_state.json`
- `npc_state.json`
- `world_events.jsonl`
- `agent_runs.jsonl`
- `agent_events.jsonl`
- `agent_messages.jsonl`

含义：

- `world_state.json` 保存世界结构化状态
- `npc_state.json` 保存 NPC 状态表
- `world_events.jsonl` 保存世界事件流
- `agent_runs.jsonl` / `agent_events.jsonl` 保存 actor 运行记录
- `agent_messages.jsonl` 保存 actor 间消息

## `workspace/memory/`

这是审计和观测目录，常见文件包括：

- `heartbeat.log`
- `trigger-audit.jsonl`
- `trigger-stats.json`
- `skill-audit.jsonl`
- `nodes-audit.jsonl`
- `nodes-state.json`
- `nodes-dispatch-audit.jsonl`

## `sessions/`

会话索引与历史位于：

```text
~/.clawgo/sessions/
```

这层更偏 CLI / 会话历史，而不是 world store 本身。

## `logs/`

默认日志：

```text
~/.clawgo/logs/clawgo.log
```

## `cron/`

Cron 存储文件：

```text
~/.clawgo/cron/jobs.json
```

## `skills/`

`workspace/skills/` 里当前重要模板之一是：

- `spec-coding`

它会提供：

- `scripts/init.sh`
- `templates/spec.md`
- `templates/tasks.md`
- `templates/checklist.md`

## 当前编码项目根目录里的 spec 文件

最近复杂编码任务会在“当前被编码的项目根目录”写入：

- `spec.md`
- `tasks.md`
- `checklist.md`

这三者不是固定写在 `~/.clawgo/workspace/` 根目录，而是运行时协作产物。

## 模板目录与实际运行目录的区别

仓库中的：

```text
/Users/lpf/Desktop/project/clawgo/workspace
```

是模板源文件。

真正运行时使用的通常是：

```text
~/.clawgo/workspace
```

发布构建时，模板还会同步到：

```text
cmd/workspace
```

用于 embed。
