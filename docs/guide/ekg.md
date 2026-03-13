# EKG 使用篇

## 概览

ClawGo 里的 EKG 不是传统主机监控，而是面向 AI runtime 的运行态健康面。它更关注：

- 哪些 provider 压力最大
- 哪些错误签名最常出现
- 哪些 source / channel 正在活跃
- 最近有没有 escalation

对应的数据既会进入 WebUI，也会被 runtime 用来辅助任务决策。

## 数据从哪来

后端的 EKG 引擎会把事件写进 workspace：

```text
workspace/memory/ekg-events.jsonl
workspace/memory/ekg-snapshot.json
```

从代码实现看，EKG 数据会被这些环节消费：

- WebUI 的 EKG 页面
- Dashboard 的 EKG 摘要
- `/api/ekg_stats`
- session planner 的任务提示与 provider 选择辅助

## WebUI 里能看到什么

WebUI 有独立的 EKG 页面，对应：

- `/webui/ekg`

当前页面支持的窗口包括：

- `6h`
- `24h`
- `7d`

主要展示项包括：

- `Escalations`
- `Source Stats`
- `Channel Stats`
- `Top Providers (workload)`
- `Top Providers (all)`
- `Top Error Signatures (workload)`
- `Top Error Signatures (all)`

Dashboard 首页也会拿 `24h` 窗口的 EKG 摘要做卡片展示。

## API 结构

核心接口：

```text
GET /api/ekg_stats?window=24h
```

常见返回字段包括：

- `source_stats`
- `channel_stats`
- `provider_top`
- `provider_top_workload`
- `errsig_top`
- `errsig_top_workload`
- `escalation_count`

如果你做二次开发，这个接口就是 EKG 的主要消费面。

## 这些指标分别代表什么

### Source Stats

表示最近窗口内，不同来源的活跃分布。  
常见来源可能包括：

- 主会话
- subagent
- provider fallback

它适合回答：“最近系统的主要活动来自哪里？”

### Channel Stats

表示最近窗口内，不同通道的活跃分布。

它适合回答：

- 哪个通道最忙
- 哪个通道正在持续报错
- 某个自动化消息入口是否异常活跃

### Top Providers

分两类：

- `provider_top_workload`
- `provider_top`

前者更偏业务负载下的压力视角，后者更偏全量视角。

它适合回答：

- 最近最吃压的是哪个 provider
- 哪个 provider 关联了最多问题或最多负载

### Top Error Signatures

分两类：

- `errsig_top_workload`
- `errsig_top`

它们用标准化错误签名做聚合，适合回答：

- 当前最频繁的失败模式是什么
- 是临时波动，还是持续性错误模式

### Escalations

`escalation_count` 表示最近窗口内的升级拦截次数。

当这个值突然抬高时，通常意味着：

- 某个 provider 或模型质量明显下降
- 某条自动化链路在持续失败
- 某类错误已经进入需要人工关注的程度

## 它和任务调度的关系

EKG 不只是展示。按当前实现，session planner 也会读取 EKG 信号，给任务补充提示，并在 provider 选择时利用历史错误模式做辅助判断。

这意味着 EKG 的价值有两层：

- 面向运维的可视化观测
- 面向 runtime 的决策辅助

## 推荐使用方式

### 日常巡检

建议先看：

1. `Escalations`
2. `Top Error Signatures`
3. `Top Providers (workload)`

这样能最快知道系统是“忙”还是“坏”。

### 排障

如果你在排查某个通道、provider 或自动化任务，建议连着看：

- EKG 页面
- Logs
- Task Audit
- `clawgo status`

EKG 擅长发现趋势，但不替代具体日志。

### 做容量观察

如果你想看系统负载是否在变化，优先看：

- `24h`
- `7d`

短窗口适合看突发，长窗口适合看趋势。

## 相关页面

- [WebUI 控制台](/guide/webui)
- [运维与 API](/guide/operations)
- [运行时、存储与恢复](/guide/runtime-storage)
- [WebUI API 参考](/reference/webui-api)
