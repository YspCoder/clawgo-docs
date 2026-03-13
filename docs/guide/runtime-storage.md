# 运行时、存储与恢复

## 运行时持久化是核心特性

ClawGo 明显是按“长期运行”目标设计的，因此持久化不是附加项。

README 和代码都强调了以下文件：

- `subagent_runs.jsonl`
- `subagent_events.jsonl`
- `threads.jsonl`
- `agent_messages.jsonl`

这些文件配合 sessions、memory 和 logs，构成完整运行现场。

## Session

`pkg/session/manager.go` 负责会话历史。CLI `agent` 模式和 WebUI Chat 都依赖 session history。

CLI 默认使用：

```text
cli:default
```

你也可以显式指定自定义 session key。

## Threads 与 Agent Messages

当启用 `agents.communication.persist_threads/persist_messages` 时，agent 间协作会被持久化，这使得：

- WebUI 能展示内部消息流
- 系统可恢复 reply 关系
- 任务审计可以还原上下文

## Memory

Memory 模块当前包含：

- `memory_search`
- `memory_get`
- `memory_write`

同时配置层还有 layered memory 开关：

- `profile`
- `project`
- `procedures`

这说明 ClawGo 的 memory 不只是一个平面文件夹，而是朝分层记忆演进的。

## Heartbeat

Heartbeat service 会定期运行，并把记录落到：

```text
workspace/memory/heartbeat.log
```

`status` 命令会直接统计心跳次数和最后一次记录。

## Trigger Audit

与触发器相关的审计会落到：

```text
workspace/memory/trigger-audit.jsonl
workspace/memory/trigger-stats.json
```

`status` 会聚合最近错误和按 trigger 分类的错误计数。

## Skill Audit

Skill 执行审计文件：

```text
workspace/memory/skill-audit.jsonl
```

`status` 会读取：

- total
- ok
- fail
- reason coverage
- top skill

## 节点状态

节点相关数据包括：

- `nodes-audit.jsonl`
- `nodes-state.json`
- `nodes-dispatch-audit.jsonl`

它们分别对应节点注册/状态、当前状态快照和派发记录。

## Watchdog 与进展续时

从 README 和测试文件名可以看出，ClawGo 对 timeout 采取了“按进展续时”的 watchdog 思路，而不是固定墙钟超时。

这点很关键，因为长任务并不一定应该被杀掉，真正需要判定的是任务是否还在推进。

## Context Compaction

为了长期对话可持续，运行时支持 context compaction：

- 到达消息阈值后压缩上下文
- 保留最近消息
- 通过 summary 或 compact 响应格式减小上下文成本

这让系统更适合长 session。

## EKG

EKG 是运行态监控面的一部分，后端通过 `/api/ekg_stats` 暴露数据，前端有专门页面展示。

它的意义是把 agent runtime 的健康状况变成可以观察的趋势数据。
