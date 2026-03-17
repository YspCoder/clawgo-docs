# 运行时、存储与恢复

## 当前持久化核心

当前版本的恢复主线仍然围绕 subagent runtime，而不是 world state。

最关键的文件是：

- `subagent_runs.jsonl`
- `subagent_events.jsonl`
- `threads.jsonl`
- `agent_messages.jsonl`

这些文件共同记录：

- subagent 执行过程
- 运行事件与重试
- agent 间线程关系
- 内部消息流

## 文件位置

这些文件当前都落在：

```text
workspace/agents/runtime/
```

## `subagent_runs.jsonl`

记录 run 级别信息，例如：

- run id
- agent id
- task
- status
- output
- created / updated 时间

这是恢复进行中任务和审计执行结果的基础。

## `subagent_events.jsonl`

记录运行事件，例如：

- `spawned`
- `running`
- `completed`
- `failed`
- 重试次数

它是“subagent 为什么成功或失败”的直接线索。

## `threads.jsonl`

保存 agent thread 元数据，例如：

- `thread_id`
- `owner`
- `participants`
- `status`
- `topic`

这层让内部协作不是简单字符串拼接，而是可追踪的 thread model。

## `agent_messages.jsonl`

保存具体消息流，例如：

- `from_agent`
- `to_agent`
- `reply_to`
- `correlation_id`
- `requires_reply`
- `content`

这也是 WebUI 能重建内部协作流的原因之一。

## sessions 与 memory

除了 `workspace/agents/runtime/`，还有两类持久化很重要：

- `~/.clawgo/sessions/`
- `workspace/memory/`

前者偏主会话历史，后者偏：

- `heartbeat.log`
- `skill-audit.jsonl`
- `nodes-dispatch-audit.jsonl`
- trigger / process / node 相关审计

## 为什么这套设计重要

恢复不是“恢复一段聊天”，而是恢复：

- 哪个 subagent 在跑
- 跑到了什么阶段
- 内部 thread 到了哪里
- 上一次结果和错误是什么

这也是当前 Agent Runtime 和普通 chat shell 的本质区别。
