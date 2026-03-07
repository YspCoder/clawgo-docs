# 架构总览

## 整体分层

ClawGo 当前大致可分为 4 层：

1. 入口层
   CLI、Gateway HTTP、WebUI、Cron、外部通道
2. Agent Runtime 层
   `AgentLoop`、router、session planner、message bus、subagent manager
3. 执行能力层
   tools、skills、nodes、browser、shell、memory、filesystem
4. 持久化与观测层
   sessions、threads、messages、jsonl 审计日志、logs、EKG、task audit

## 核心入口

主入口在 `cmd/clawgo/main.go`。顶层命令包括：

- `onboard`
- `agent`
- `gateway`
- `status`
- `provider`
- `config`
- `cron`
- `channel`
- `skills`
- `uninstall`

`agent` 模式偏单机交互；`gateway run` 则启动完整运行时。

## AgentLoop

`pkg/agent/loop.go` 中的 `AgentLoop` 是核心运行循环，主要职责：

- 管理 provider 与 fallback provider
- 维护 session manager
- 注册内置工具
- 构建对模型的上下文
- 处理用户消息、系统消息和内部消息
- 负责 subagent 调度与运行态查询
- 维护 EKG 与任务审计

初始化时默认注册的关键工具包括：

- 文件类：`read_file`、`write_file`、`list_dir`、`edit_file`
- 兼容别名：`read`、`write`、`edit`
- 执行类：`exec`、`process`
- 网络类：`web_search`、`web_fetch`、`parallel_fetch`
- 代理协作：`spawn`、`subagents`、`subagent_config`、`subagent_profile`
- 会话与记忆：`sessions`、`memory_search`、`memory_get`、`memory_write`
- 调度与系统：`cron`、`remind`、`parallel`、`system_info`
- 设备与浏览器：`browser`、`camera`
- 节点：`nodes`
- 消息：`message`

## 任务拆分

`pkg/agent/session_planner.go` 支持将用户输入自动拆分成多个子任务并发执行。它主要有两种触发方式：

- 用户输入本身是列表，如 `1. ... 2. ...`
- 文本使用强分隔符，例如分号分隔的多个明确任务

拆分后，每个子任务会：

- 单独派发到 `processMessage`
- 派生自己的资源键
- 在必要时向外发布阶段性进度

这意味着 ClawGo 不只是在“逐轮聊天”，而是会把某些自然语言任务转成结构化执行单元。

## Subagent 模型

Subagent 配置位于 `agents.subagents`。一个 subagent 可被声明为：

- 本地 worker
- 本地 router
- 远端 node-backed branch

关键字段包括：

- `type`
- `transport`
- `node_id`
- `parent_agent_id`
- `notify_main_policy`
- `system_prompt_file`
- `memory_namespace`
- `accept_from`
- `can_talk_to`
- `tools.allowlist`
- `runtime.*`

默认协作流是：

```text
user -> main -> subagent -> main -> user
```

## 消息与线程

Agent 间通信不是简单字符串转发，而是通过 bus、thread、message 体系组织：

- `communication.mode` 决定协作模式，默认是 `mediated`
- `persist_threads` 和 `persist_messages` 控制是否持久化
- 每条 agent message 可带 `reply_to`、`correlation_id`、`requires_reply`

这套机制使 WebUI 能重建拓扑、内部流和任务状态。

## Gateway 与 WebUI

Gateway 在 `pkg/api/server.go` 中暴露两类能力：

- 节点注册与心跳接口
- WebUI 页面和 `/webui/api/*` 控制接口

它既是运行时的 API 门户，也是静态前端的宿主。

## 节点与远端分支

`pkg/nodes` 提供节点管理能力。当前有：

- `Manager`: 节点注册表
- `Router`: 本地/Relay 路由
- `HTTPRelayTransport`: 通过 HTTP 中继

本地默认会注入一个 `local` 模拟节点，暴露运行、相机、屏幕、位置、canvas 等能力，便于统一抽象。

## 观测面

ClawGo 的观测能力不是附加功能，而是 runtime 的核心设计：

- 日志：`logging`
- 任务审计：`task audit`
- 节点审计：`nodes-dispatch-audit.jsonl`
- Trigger 审计：`trigger-audit.jsonl`
- Skill 审计：`skill-audit.jsonl`
- 心跳记录：`memory/heartbeat.log`
- EKG：运行状态统计与趋势

## 为什么说它是 Runtime

从代码实现看，ClawGo 明显不是一个“问答应用”：

- 它有完整的进程内运行循环
- 有任务拆分和任务状态机
- 有可热更新配置
- 有定时任务、通道、远端节点和消息线程
- 有恢复、审计、日志、监控和 WebUI

这就是它与普通 Agent Chat 项目的根本区别。
