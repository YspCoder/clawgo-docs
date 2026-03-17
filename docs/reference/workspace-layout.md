# 工作区与持久化目录

## 默认根目录

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

初始化时会拷贝模板，例如：

- `AGENTS.md`
- `BOOT.md`
- `MEMORY.md`
- `TOOLS.md`
- `HEARTBEAT.md`
- `skills/`
- `memory/`

## `workspace/agents/runtime/`

当前最关键的运行时目录，常见文件：

- `subagent_runs.jsonl`
- `subagent_events.jsonl`
- `threads.jsonl`
- `agent_messages.jsonl`

## `workspace/memory/`

常见文件：

- `heartbeat.log`
- `skill-audit.jsonl`
- `nodes-dispatch-audit.jsonl`
- `process-sessions.json`

## `sessions/`

会话索引和历史位于：

```text
~/.clawgo/sessions/
```

其中 `sessions.json` 是元数据索引。

## 模板目录与运行目录

仓库中的：

```text
/Users/lpf/Desktop/project/clawgo/workspace
```

是模板源文件。

运行时实际使用的通常是：

```text
~/.clawgo/workspace
```
