# Cron 使用篇

## 概览

ClawGo 的 Cron 不是简单的 shell 定时任务。它会把定时触发重新投递回 Agent Runtime，让任务继续走模型、工具和消息分发链路。

一个 Cron Job 通常包含：

- `name`
- `schedule`
- `message`
- `deliver`
- `channel`
- `to`
- `enabled`
- `state`

支持的计划形式：

- `every`
- `cron`
- `at`

Gateway 启动时会构造 `CronService`，并把 job 触发结果重新派发到 runtime。

## 有什么区别

和系统 crontab 相比，ClawGo Cron 的重点不是“定时执行命令”，而是：

- 定时向 agent 投递任务
- 可以继续调用工具
- 可以继续发消息到通道
- 可以被审计、启停和重试

这更适合 AI runtime 的自动化场景。

## runtime 里的 Cron tools

当 `CronService` 存在时，AgentLoop 会额外注册：

- `remind`
- `cron`

这意味着 agent 可以在运行中自我安排提醒或周期任务，而不只是依赖外部 CLI 创建。

## CLI 常见用法

```bash
clawgo cron list
clawgo cron add -n daily-report -m "总结今天的日志" -c "0 9 * * *"
clawgo cron add -n heartbeat -m "检查系统状态" -e 300
clawgo cron enable <job_id>
clawgo cron disable <job_id>
clawgo cron remove <job_id>
```

常用参数：

- `-n`, `--name`
- `-m`, `--message`
- `-e`, `--every`
- `-c`, `--cron`
- `-d`, `--deliver`
- `--channel`
- `--to`

## WebUI 里怎么管理

WebUI 的 Cron 页面支持：

- `list`
- `create`
- `update`
- `enable`
- `disable`
- `delete`

如果你希望运营同学或维护者通过页面管理周期任务，优先用 WebUI 会更稳。

## 适合的使用场景

### 例行总结

例如：

- 每天汇总日志
- 每小时检查系统状态
- 定时拉取外部信息再回传

### 主动提醒

例如：

- 到点提醒某个群或某个用户
- 到点检查审批、告警、队列积压

### Agent 自主安排

当 agent 具备 `cron` / `remind` 工具后，它可以在一次任务里给自己安排后续动作。

## 使用建议

### 先做幂等任务

刚开始最好先安排：

- 总结类任务
- 只读检查类任务
- 重复执行也不会造成副作用的任务

### 再做会发消息的任务

带 `deliver/channel/to` 的任务更适合在前面验证稳定后再上线。

### 把 Cron 和外部用户消息分开

如果某个通道既承接用户消息又接收 Cron 输出，建议对目标 chat 或接收人做隔离。

## 相关页面

- [通道使用篇](/guide/channels)
- [CLI 命令](/guide/cli)
- [WebUI 控制台](/guide/webui)
- [运维与 API](/guide/operations)
