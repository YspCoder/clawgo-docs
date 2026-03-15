# 架构总览

## 当前主模型

ClawGo 最近一轮重构后，主模型已经从“多 agent 聊天编排器”转成 **World Runtime**。

核心关系可以概括为：

```text
user -> main(world mind) -> npc/agent intents -> arbitrate -> apply -> render -> user
```

这里有两个关键区别：

- `main` 不只是一个 router，而是世界级决策入口
- `npc` / `agent` 产生的是 intent，最终世界状态由 runtime 仲裁并落盘

## 运行层次

可以把 ClawGo 看成 4 层：

1. 入口层
   CLI、Gateway API、独立部署 WebUI、Cron、外部 Channels
2. World Runtime 层
   world event ingestion、actor 调度、仲裁、状态应用、结果渲染
3. 能力层
   tools、skills、MCP、nodes、filesystem、shell、memory
4. 持久化与观测层
   world store、agent runtime store、provider runtime、EKG、日志、审计

## World Runtime 核心对象

### `main`

`main` 是世界意志：

- 接收用户输入
- 根据规则或上下文调度其他 actor
- 汇总 intent
- 决定哪些变化真正写入世界状态

### `agent`

普通 `agent` 适合承担显式执行任务，例如：

- 编码
- 测试
- 外部集成
- 远端 node branch

它们更像带工具权限和 provider 绑定的执行角色。

### `npc`

`npc` 是世界中的自治角色，配置上通过 `kind: "npc"` 进入 runtime。它们通常具备：

- `persona`
- `home_location`
- `default_goals`
- `perception_scope`
- 独立的 world decision 上下文

## 核心循环

当前 README 与实现都围绕这条主循环组织：

1. `ingest`
2. `perceive`
3. `decide`
4. `arbitrate`
5. `apply`
6. `render`

含义是：

- 外部输入先变成 world event
- actor 看见自己可见的世界切片
- actor 产出 decision / intent
- runtime 仲裁哪些 intent 生效
- 世界状态与 NPC 状态被更新
- 最终把可读结果渲染给用户或前端

## 配置视角

当前真实配置核心已经是 `agents.agents`，不是旧文档里的 `agents.subagents`。

一个典型结构是：

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "codex/gpt-5.4"
      }
    },
    "agents": {
      "main": {
        "enabled": true,
        "type": "agent",
        "role": "orchestrator",
        "prompt_file": "agents/main/AGENT.md"
      },
      "guard": {
        "enabled": true,
        "kind": "npc",
        "persona": "A cautious town guard",
        "home_location": "gate",
        "default_goals": ["patrol the square"]
      },
      "coder": {
        "enabled": true,
        "type": "agent",
        "prompt_file": "agents/coder/AGENT.md"
      }
    }
  }
}
```

## 持久化面

World Runtime 现在会把核心状态落到 `workspace/agents/runtime/`：

- `world_state.json`
- `npc_state.json`
- `world_events.jsonl`
- `agent_runs.jsonl`
- `agent_events.jsonl`
- `agent_messages.jsonl`

这意味着恢复时不只是恢复“聊天历史”，而是恢复：

- 世界状态
- NPC 状态
- 运行中任务与事件
- actor 间消息协作痕迹

## API 与 WebUI

Gateway 暴露的是 `/api/*` 控制面。最近重要的运行态接口包括：

- `GET /api/runtime`
- `GET /api/runtime/live`
- `GET /api/config?mode=normalized`
- `POST /api/config?mode=normalized`
- `GET /api/logs/live`

其中 runtime snapshot 会额外带 world payload，供独立 WebUI 展示：

- NPC 数量
- active NPC 列表
- location occupancy
- recent world events

## 为什么说它不是普通 Agent Chat

因为当前系统已经具备这些运行时特征：

- 世界状态与 actor 状态分开建模
- intent 与最终 world mutation 分离
- 长期落盘与可恢复执行
- runtime snapshot / runtime live / provider runtime 统一观测
- 本地 actor、NPC、远端 node branch 可以进入同一世界拓扑
