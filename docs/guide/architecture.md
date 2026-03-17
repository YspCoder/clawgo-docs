# 架构总览

## 当前主模型

ClawGo 当前是更典型的 **Agent Runtime**，不是 world runtime。

默认协作流：

```text
user -> main -> worker -> main -> user
```

当前应重点理解的对象是：

- `main agent`
- `subagents`
- `runtime store`

## 四层结构

可以把当前系统理解成四层：

1. 入口层
   CLI、Gateway、WebUI、Cron、Channels
2. 编排层
   `main agent`、router、session planner、message bus
3. 执行层
   本地 subagents、tools、skills、MCP
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

## router 与 planner

当前路由由 `agents.router` 负责，核心字段包括：

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

这套设计记录的是执行过程、内部消息和恢复点，而不是单纯聊天文本。

## WebUI 当前角色

WebUI 现在偏向检查和管理：

- Dashboard
- Agent 拓扑
- Config 查看
- OAuth 账号与 provider runtime
- 日志与记忆

README 当前明确强调两点：

- WebUI 负责 inspection、status、account management
- runtime config 的正式修改路径仍以文件驱动为主

## 最近删掉了什么

最近一轮精简移除了不少 legacy surface，文档层面最重要的是：

- `runtime_control` 已移除
- 公开 task runtime 控制面已收缩
- 旧版节点运行面已从默认 upstream 能力中移除

所以当前心智模型更简单：

- 配置靠 `config.json`
- 角色靠 `AGENT.md`
- 执行靠 `main + subagents`
- 观测靠 WebUI、logs、memory、audit
