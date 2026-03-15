# Agents、NPC 与 Skills

## 当前配置核心已经是 `agents.agents`

这一页虽然沿用旧路径，但当前代码里的真实配置已经从 `agents.subagents` 切到 `agents.agents`。

每个条目都可以是：

- `agent`
- `npc`
- 远端 `node` 分支

这比旧的“main + coder + tester 的 subagent 树”更接近现在的产品模型。

## `main`、`agent`、`npc` 的区别

### `main`

`main` 仍然是主入口，但现在更准确的角色是 world mind：

- 接收用户输入
- 汇总 actor intent
- 进行仲裁
- 决定哪些变化写入世界

### `agent`

普通 `agent` 更适合承担明确执行工作，例如：

- `coder`
- `tester`
- provider-bound 工具型角色
- 远端节点上的 branch agent

常见字段：

- `type`
- `prompt_file`
- `runtime.provider`
- `tools.allowlist`
- `memory_namespace`

### `npc`

`npc` 是 world runtime 里的自治角色，常见字段：

- `kind: "npc"`
- `persona`
- `home_location`
- `default_goals`
- `perception_scope`
- `world_tags`

NPC 的核心意义不是直接跑工具，而是根据可见世界切片产出 intent。

## 远端 node branch 仍然成立

如果一个 agent 走远端节点执行，可以配置：

```json
{
  "transport": "node",
  "node_id": "edge-dev",
  "parent_agent_id": "main"
}
```

这类配置仍然属于 `agents.agents.<id>`，只是 runtime class 不再局限于本地 actor。

## prompt 文件现在应当用 `prompt_file`

最近代码里的约束已经切到：

- 用 `prompt_file` 定义 agent 角色
- 路径必须是 workspace 内相对路径
- 启用状态下不能为空

更推荐的目录约定仍然是：

```text
agents/<agent_id>/AGENT.md
```

## 工具权限

每个 actor 仍然可以通过以下字段控制工具权限：

- `tools.allowlist`
- `tools.denylist`
- `tools.max_parallel_calls`

工程上常见做法：

- `main` 只持有低风险调度和查询工具
- `coder` 持有 filesystem / shell / repo 类工具
- `tester` 持有验证与进程控制工具

## Skills 仍然是重要扩展点

Skills 仍然以 `SKILL.md` 为中心，由 `skill_exec` 暴露给运行时。

当前加载来源仍包括：

- workspace skills
- global skills
- builtin skills

审计里也会记录：

- `caller_agent`
- `caller_scope`

这样你能知道 skill 是被哪个 actor 触发的。

## `spec-coding`

当前最重要的工程技能仍然是 `spec-coding`。

它面向非 trivial 编码任务，会在当前编码项目根目录维护：

- `spec.md`
- `tasks.md`
- `checklist.md`

模板来自：

```text
workspace/skills/spec-coding/templates
```

运行时最近的联动行为包括：

- 缺失时自动补齐 spec 文件
- 编码完成或返工时回写 `tasks.md` / `checklist.md`

## 推荐实践

- 用 `main` 负责 world-level 判断，不要让它承担所有高风险执行
- 把执行型角色建成 `agent`
- 把自治世界角色建成 `npc`
- 所有 prompt 尽量走 `prompt_file`
- 对多阶段工程任务优先使用 `spec-coding`
