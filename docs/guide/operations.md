# 运维与 API

## Gateway HTTP 能力

Gateway 并不只是 WebUI 静态资源服务器。`pkg/api/server.go` 暴露了三类能力：

1. 健康检查
2. 节点注册与心跳
3. WebUI 控制 API

## 基础接口

### 健康检查

```text
GET /health
```

返回 `ok`。

### 节点接口

```text
POST /nodes/register
POST /nodes/heartbeat
```

都要求通过 token 鉴权。

## 鉴权方式

WebUI 与 API 受 `gateway.token` 保护。

常见访问方式：

- URL query 中附带 `?token=...`
- 访问 `/webui` 后由服务端设置 Cookie

## WebUI API 能力分组

### 配置与版本

- `/webui/api/config`
- `/webui/api/version`

其中配置写入的高风险确认现在不只覆盖默认 provider，也会覆盖：

- `providers.proxies.<name>.api_base`
- `providers.proxies.<name>.api_key`

### 对话与上传

- `/webui/api/chat`
- `/webui/api/chat/history`
- `/webui/api/chat/stream`
- `/webui/api/upload`

### 运行资源

- `/webui/api/nodes`
- `/webui/api/sessions`
- `/webui/api/memory`
- `/webui/api/subagents_runtime`
- `/webui/api/subagent_profiles`
- `/webui/api/tool_allowlist_groups`

### 运维与审计

- `/webui/api/task_audit`
- `/webui/api/task_queue`
- `/webui/api/ekg_stats`
- `/webui/api/exec_approvals`
- `/webui/api/logs/recent`
- `/webui/api/logs/stream`

### 自动化

- `/webui/api/cron`
- `/webui/api/skills`

## status 命令的运维价值

相比单纯查配置文件，`clawgo status` 会直接读取实际产物：

- 日志文件
- 心跳记录
- trigger audit
- skill audit
- sessions 索引
- nodes manager 当前状态

这意味着它是“运行结果视角”的诊断命令。

而且在多 provider 场景下，`status` 现在会按当前激活的 provider 输出：

- `Provider API Base`
- `Provider API Key`

这比只看 `providers.proxy` 更接近真实运行态。

## Sentinel

Sentinel 在 Gateway 启动时初始化，接受这些配置：

- `enabled`
- `interval_sec`
- `auto_heal`
- `notify_channel`
- `notify_chat_id`

当配置了通知通道时，巡检异常可直接回推到外部消息通道。

## 日志

日志路径由：

- `logging.dir`
- `logging.filename`

共同决定。

默认值：

```text
~/.clawgo/logs/clawgo.log
```

WebUI 还能直接查看最近日志和日志流。

## 热更新与回滚

`clawgo config set` 的实现比较工程化：

- 先修改配置
- 原子写入
- 保留备份
- 尝试通知 Gateway reload
- 如果 reload 失败且 Gateway 正在运行，则回滚配置

这避免了配置改坏后直接把运行时打崩。

## 服务化部署

`clawgo gateway` 支持服务控制语义：

- `start`
- `stop`
- `restart`
- `status`

卸载时 `clawgo uninstall` 会尝试清理安装的 gateway service。

## 推荐的运维检查顺序

1. `clawgo config check`
2. `clawgo status`
3. `clawgo gateway status`
4. 打开 `/webui`
5. 检查 Logs、Task Audit、Subagents、EKG
