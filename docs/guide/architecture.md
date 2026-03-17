# 架构总览

## 当前主模型

ClawGo 当前不是 world runtime，而是更典型的 **Agent Runtime**。

默认协作流：

```text
user -> main -> worker -> main -> user
```

这里的关键对象是：

- `main agent`
- `subagents`
- `node-backed branches`
- `runtime store`

## 四层结构

可以把当前系统理解成四层：

1. 入口层
   CLI、Gateway、WebUI、Cron、Channels
2. 编排层
   `main agent`、router、session planner、message bus
3. 执行层
   本地 subagents、远端 node branches、tools、skills、MCP
4. 持久化与观测层
   subagent runs、events、threads、messages、sessions、logs、memory、task audit

## `main agent`

`main` 负责：

- 用户入口
- 路由和派发
- 子任务汇总
- 最终回复整理

它不是简单的系统 prompt，而是整个运行时的协调中心。

## `subagents`

本地 subagent 通过 `config.json -> agents.subagents` 声明。

每个 subagent 可独立拥有：

- `role`
- `display_name`
- `system_prompt_file`
- `memory_namespace`
- `tools.allowlist`
- `runtime.provider`

典型角色仍然是：

- `main`
- `coder`
- `tester`

## `node-backed branches`

远端节点可以被挂成受控 branch，配置上通常依赖：

- `transport: "node"`
- `node_id`
- `parent_agent_id`

这样主拓扑里可以同时存在：

- 本地 worker
- 远端 branch
- 节点能力入口

## router 与 planner

当前路由仍由 `agents.router` 负责，核心字段包括：

- `main_agent_id`
- `strategy`
- `rules`
- `max_hops`
- `default_timeout_sec`

planner 会把适合拆分的请求转成多个执行单元，再交给 subagent runtime 分发。

## runtime store

当前真正重要的持久化产物包括：

- `subagent_runs.jsonl`
- `subagent_events.jsonl`
- `threads.jsonl`
- `agent_messages.jsonl`

这套设计的目的不是记录聊天文本，而是记录执行过程、内部消息和恢复点。

## WebUI 当前角色

WebUI 现在偏向检查和管理：

- Dashboard
- Agent 拓扑
- Config 查看
- OAuth 账号与 provider runtime
- 日志、记忆、节点状态

README 当前明确强调两点：

- WebUI 负责 inspection、status、account management
- runtime config 的正式修改路径仍以文件驱动为主

## 最近删掉了什么

最近一轮精简移除了不少 legacy surface，文档上最值得记住的是：

- `runtime_control` 已移除
- 公开 task runtime 控制面已收缩
- 旧的兼容 helper 和部分 legacy interface 被清掉

这意味着当前对外心智模型更简单：

- 配置靠 `config.json`
- 角色靠 `AGENT.md`
- 执行靠 `main + subagents + nodes`
- 观测靠 WebUI、logs、memory、audit
