# 运行时、存储与恢复

## 当前落盘重点已经变成 world runtime

最近版本里，ClawGo 的持久化重点不再是旧文档里的 `subagent_runs.jsonl` / `subagent_events.jsonl`，而是统一收敛到：

```text
workspace/agents/runtime/
```

这里同时保存 world state、NPC state 和 actor runtime 记录。

## world store

当前 world store 的核心文件是：

- `world_state.json`
- `npc_state.json`
- `world_events.jsonl`

含义分别是：

- `world_state.json`: 世界结构化状态，例如 locations、entities、quests、clock
- `npc_state.json`: 每个 NPC 当前状态、位置、目标、beliefs 等
- `world_events.jsonl`: 世界事件审计流，按时间追加

这三者共同决定“重启后世界还能不能继续跑”。

## agent runtime store

同一目录下还有 actor 运行态记录：

- `agent_runs.jsonl`
- `agent_events.jsonl`
- `agent_messages.jsonl`

它们分别承担：

- 记录一次 run 的输入、输出、状态
- 记录运行事件、错误和重试
- 记录 actor 间消息协作

最近 runtime snapshot 结构已经统一成：

- `tasks`
- `runs`
- `events`
- `world`

也就是运行记录和世界快照在同一个观测模型里出现。

## Session 与工作区是另一层

除了 `workspace/agents/runtime/`，系统仍然还有：

- `~/.clawgo/sessions/`
- `~/.clawgo/logs/`
- `~/.clawgo/cron/`
- `workspace/memory/`

这些目录分别服务于：

- CLI / 会话历史
- 网关日志
- Cron 作业
- 心跳、技能审计、节点审计、trigger 审计

## 为什么这次重构重要

因为恢复的粒度已经不是“恢复一段聊天上下文”，而是：

- 恢复 world state
- 恢复 NPC state
- 恢复正在进行的任务与运行事件
- 恢复 actor 间消息轨迹

这使得 ClawGo 更接近一个可长期运行的 simulation runtime。

## runtime snapshot

最近 API 与 WebUI 消费的是统一 snapshot：

- `GET /api/runtime`
- `GET /api/runtime/live`

其中 `world` payload 会包含：

- `npc_count`
- `active_npcs`
- location occupancy
- recent world events

这也是独立 WebUI 能展示世界概览的基础。

## provider runtime 也会一起持久化

除了 world/runtime 本体，provider 侧还有自己的 runtime 持久化能力，例如：

- OAuth 账户状态
- candidate order
- 最近成功 provider
- runtime history

这部分主要由 `models.providers.<name>.runtime_*` 控制。

## workspace/memory 仍然重要

`workspace/memory/` 当前常见文件包括：

- `heartbeat.log`
- `trigger-audit.jsonl`
- `trigger-stats.json`
- `skill-audit.jsonl`
- `nodes-audit.jsonl`
- `nodes-state.json`
- `nodes-dispatch-audit.jsonl`

也就是说，world/runtime 是核心执行面，`memory/` 更偏审计与运维观测面。

## 排查恢复问题时先看哪里

优先检查：

1. `workspace/agents/runtime/world_state.json`
2. `workspace/agents/runtime/npc_state.json`
3. `workspace/agents/runtime/world_events.jsonl`
4. `workspace/agents/runtime/agent_runs.jsonl`
5. `workspace/agents/runtime/agent_events.jsonl`

如果这些文件没有更新，通常说明：

- runtime 没真正进入世界循环
- actor 没被成功调度
- provider 或配置校验提前失败
