# 工作区与持久化目录

这页回答两个问题：

1. ClawGo 默认把文件写到哪里
2. 哪些目录属于模板，哪些目录属于运行时产物

## 默认根目录

正常模式下：

```text
~/.clawgo
```

主要内容包括：

- `config.json`
- `workspace/`
- `logs/`
- `cron/`
- `sessions/`
- `gateway.pid`

## workspace

默认工作区：

```text
~/.clawgo/workspace
```

初始化时会从仓库内置模板拷贝以下内容：

- `AGENTS.md`
- `BOOT.md`
- `BOOTSTRAP.md`
- `IDENTITY.md`
- `MEMORY.md`
- `SOUL.md`
- `TOOLS.md`
- `USER.md`
- `HEARTBEAT.md`
- `memory/`
- `skills/`
- `webui/`（安装脚本或发布产物会放这里）

`skills/` 里最近一个重要的模板技能是：

- `spec-coding`

它会提供：

- `scripts/init.sh`
- `templates/spec.md`
- `templates/tasks.md`
- `templates/checklist.md`

## logs

默认日志：

```text
~/.clawgo/logs/clawgo.log
```

日志目录由 `logging.dir` 决定。

## cron

Cron 存储文件：

```text
~/.clawgo/cron/jobs.json
```

CLI `cron` 命令和 Gateway `CronService` 都会使用它。

## sessions

Session 索引和历史位于：

```text
~/.clawgo/sessions/
```

`status` 命令会读取 `sessions.json` 之类的索引产物做统计。

## workspace/memory

这是最值得关注的运行时目录之一，常见文件包括：

- `heartbeat.log`
- `trigger-stats.json`
- `trigger-audit.jsonl`
- `skill-audit.jsonl`
- `nodes-audit.jsonl`
- `nodes-state.json`
- `nodes-dispatch-audit.jsonl`

另外，memory 工具和 layered memory 也会围绕这个目录工作。

## Agent 间协作相关文件

根据 README 和 runtime 设计，还会有：

- `subagent_runs.jsonl`
- `subagent_events.jsonl`
- `threads.jsonl`
- `agent_messages.jsonl`

这些文件是恢复和审计的重要基础。

## 当前编码项目根目录中的 Spec 文件

最近复杂编码任务会额外在“当前被编码的项目根目录”维护：

- `spec.md`
- `tasks.md`
- `checklist.md`

注意这三者不是固定写在 `~/.clawgo/workspace/` 根目录，也不是常驻保留在 `clawgo` 仓库根目录。

它们的典型来源是：

- `workspace/skills/spec-coding/templates/*`

也就是说：

- `workspace/skills/spec-coding/templates/` 是模板
- 当前编码项目根目录下的 `spec.md` / `tasks.md` / `checklist.md` 是运行期协作产物

## 仓库内的 workspace 与用户 workspace 区别

仓库中的：

```text
/Users/lpf/Desktop/project/clawgo/workspace
```

是模板源文件。

真正运行时使用的通常是用户目录中的：

```text
~/.clawgo/workspace
```

发布构建时，Makefile 会把模板同步到：

```text
cmd/clawgo/workspace
```

用于 `go:embed`。

## 开发时要注意

- 改仓库 `workspace/` 是在改模板
- 改 `~/.clawgo/workspace/` 是在改本地实例数据
- 改 `cmd/clawgo/workspace/` 通常只是构建期同步产物，不应手工长期维护
