# Subagent 与 Skills

## Subagent 的角色

ClawGo 不是只让一个 agent 自言自语。它通过 `agents.subagents` 把角色拆成多个执行单元。

示例角色通常包括：

- `main`: 编排与汇总
- `coder`: 编码执行
- `tester`: 测试与回归

从 `config.example.json` 可以看出，每个 subagent 都有独立：

- `role`
- `display_name`
- `system_prompt_file`
- `memory_namespace`
- `tools.allowlist`
- `runtime` 参数

## 运行模式

Subagent 主要有两类：

### 本地 subagent

由本地 provider 和本地工具直接执行。

### 远端 node-backed branch

通过：

```json
{
  "transport": "node",
  "node_id": "edge-dev",
  "parent_agent_id": "main"
}
```

挂到主拓扑里，成为一个受控远端分支。

## Subagent 工具权限

每个 subagent 可配置：

- `tools.allowlist`
- `tools.denylist`
- `tools.max_parallel_calls`

这比“全局给所有工具”更适合工程场景，例如：

- `main` 只负责路由、会话、记忆查询
- `coder` 才有文件和 shell 能力
- `tester` 多拿 process manager

最近的实现里还有一个重要例外：

- `skill_exec` 会被自动注入到 subagent 的可用工具集合

也就是说，即使它不在显式 allowlist 中，subagent 仍然可以执行 skill。WebUI 的 `SubagentProfiles` 页面现在也会把这一点作为 inherited tool 展示出来。

## notify_main_policy

示例配置里能看到：

- `final_only`
- `on_blocked`
- `internal_only`

这决定子代理在什么时机把状态回传给主代理。

## Profile 化管理

WebUI 里有 `SubagentProfiles` 页面，对应后端的 profile store。它解决的是“运行期可维护的 subagent 模版”问题，而不只是静态配置。

可管理项包括：

- `agent_id`
- `name`
- `notify_main_policy`
- `role`
- `system_prompt`
- `system_prompt_file`
- `tool_allowlist`
- `memory_namespace`
- `max_retries`
- `retry_backoff_ms`
- `max_task_chars`
- `max_result_chars`
- `status`

## Skills 的作用

Skill 是放在 workspace 或全局目录中的可复用能力包，通常以 `SKILL.md` 为入口说明。

当前代码中 loader 会从多个位置加载 skills：

- workspace skills
- global skills
- builtin skills

`skill_exec` 工具负责把这些 skills 暴露给运行时，并且最近的审计记录中会额外记录：

- `caller_agent`
- `caller_scope`

这让你在任务审计里能区分 skill 是由主 agent 还是某个 subagent 触发的。

仓库自带的 workspace skills 包括：

- `tmux`
- `coding-agent`
- `healthcheck`
- `clawhub`
- `context7`
- `github`
- `clawgo-node-child`
- `skill-creator`

## Skills CLI

命令层支持：

- `skills list`
- `skills install`
- `skills remove`
- `skills search`
- `skills show`

安装器支持从 GitHub 安装 skill。

## 需要注意的一点

当前 `skills install-builtin` 代码中硬编码的默认 builtin 列表还是 `weather/news/stock/calculator`，但仓库现有 workspace skills 已明显不是这一套。文档和帮助信息在这一点上与代码现状有偏差，使用时应优先检查实际目录与 loader 逻辑。

## 推荐实践

- 用 `main` 作为总控，只暴露少量安全工具
- 把高风险执行集中给 `coder` / `tester`
- 所有角色都用 `system_prompt_file` 管理，而不是直接把 prompt 写死在 JSON 里
- 将 memory namespace 与 agent role 对齐，方便后续检索与审计
- 对远端 node 分支设置清晰的 `parent_agent_id`
