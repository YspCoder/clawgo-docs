# Subagent 与 Skills

## 当前核心还是 `agents.subagents`

当前代码和 `config.example.json` 的真实结构仍然是：

```text
agents.subagents
```

不是上一版文档里写的 `agents.agents`。

## 为什么有 subagent

ClawGo 不是一个所有任务都塞给主 agent 的系统。

它把执行单元拆成：

- `main`
- `coder`
- `tester`
- 远端 node branch

这样主会话可以保持整洁，而内部执行仍然可追踪。

## subagent 常见字段

每个 subagent 都可以独立拥有：

- `role`
- `display_name`
- `system_prompt_file`
- `memory_namespace`
- `tools.allowlist`
- `runtime.provider`

对当前版本来说，`system_prompt_file` 仍然是正式配置方式。

## 运行模式

当前 subagent 主要有两种：

### 本地 subagent

由本地 provider 和工具直接执行。

### node-backed branch

配置例如：

```json
{
  "transport": "node",
  "node_id": "edge-dev",
  "parent_agent_id": "main"
}
```

这会把远端节点挂到主拓扑里。

## 工具权限

subagent 仍然通过这些字段控制工具可见性：

- `tools.allowlist`
- `tools.denylist`
- `tools.max_parallel_calls`

常见拆分：

- `main` 拿调度和查询工具
- `coder` 拿 filesystem / shell
- `tester` 拿验证和 process manager

## `spawn` 与 `subagent_profile`

README 当前明确保留了两个关键能力：

- `spawn`
- `subagent_profile`

它们分别用于：

- 触发 subagent 执行
- 创建和管理 subagent 定义

## Skills

Skills 仍然以 `SKILL.md` 为中心，由 `skill_exec` 暴露给运行时。

当前加载来源仍包括：

- workspace skills
- global skills
- builtin skills

## `spec-coding`

当前最重要的工程技能仍然是 `spec-coding`。

它适用于非 trivial 编码任务，会在当前编码项目根目录维护：

- `spec.md`
- `tasks.md`
- `checklist.md`

## 推荐实践

- `main` 只负责派发和汇总
- 高风险执行交给 `coder` / `tester`
- 角色 prompt 放在 `AGENT.md`
- 远端执行通过 node-backed branch 接入
