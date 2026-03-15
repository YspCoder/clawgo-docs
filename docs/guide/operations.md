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
- 或请求头里带 `Authorization: Bearer <gateway.token>`

最近 Gateway 的 HTTP 包装层也统一放开了通用 CORS：

- `Access-Control-Allow-Origin: *`
- 支持常见 `GET/POST/PUT/PATCH/DELETE/OPTIONS`

这更适合：

- 外部控制台直接调 `/api/*`
- 反向代理前再挂一层前端
- 设备侧或本地 bridge 做轻量集成

## WebUI API 能力分组

### 配置与版本

- `/api/config`
- `/api/version`

其中配置写入的高风险确认现在会覆盖 `models.providers.<name>` 下的敏感字段，例如：

- `models.providers.openai.api_base`
- `models.providers.openai.api_key`
- `models.providers.<name>.api_base`
- `models.providers.<name>.api_key`

### 对话与上传

- `/api/chat`
- `/api/chat/history`
- `/api/chat/stream`
- `/api/chat/live`
- `/api/upload`

### 运行资源

- `/api/nodes`
- `/api/runtime`
- `/api/sessions`
- `/api/memory`
- `/api/subagents_runtime`
- `/api/subagents_runtime/live`
- `/api/subagent_profiles`
- `/api/tool_allowlist_groups`

其中 `/api/nodes` 现在除了节点列表和拓扑，还会返回 `p2p` 摘要，包含：

- `enabled`
- `transport`
- `active_sessions`
- `configured_stun`
- `configured_ice`
- WebRTC 会话健康状态列表

最近还扩展了：

- `dispatches`
- `alerts`
- `artifact_retention`

另外还有单独的节点运行态接口：

- `/api/node_dispatches`
- `/api/node_dispatches/replay`
- `/api/node_artifacts`
- `/api/node_artifacts/export`
- `/api/node_artifacts/download`
- `/api/node_artifacts/delete`
- `/api/node_artifacts/prune`

Provider 侧这轮也新增了独立运维接口：

- `/api/provider/oauth/start`
- `/api/provider/oauth/complete`
- `/api/provider/oauth/import`
- `/api/provider/oauth/accounts`
- `/api/provider/runtime`
- `/api/provider/runtime/summary`

这组接口主要用于：

- 浏览器内完成 OAuth 登录
- 导入已有 auth JSON
- 查看 provider runtime 健康度、cooldown 和候选顺序
- 手动触发 refresh / rerank / cooldown 清理

### 运维与审计

- `/api/task_audit`
- `/api/task_queue`
- `/api/ekg_stats`
- `/api/exec_approvals`
- `/api/logs/recent`
- `/api/logs/stream`

如果你要专门看 EKG 指标、窗口和 provider / errsig 排名，直接看：

- [EKG 使用篇](/guide/ekg)

节点审计最近还增加了：

- `used_transport`
- `fallback_from`
- `artifact_count`
- `artifact_kinds`
- `artifacts`

其中 replay 接口可以把一次历史节点派发重新送回当前 node dispatch handler。

`/api/runtime` 和 `/api/subagents_runtime/live` 现在都支持 websocket 形式的实时快照，用于前端 runtime 汇总和 subagent 细节联动。

### 自动化

- `/api/cron`
- `/api/skills`

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

这比只看某个默认 provider 配置槽位更接近真实运行态。

在节点侧，`status` 也新增了：

- `Nodes P2P`
- `Nodes P2P ICE`
- `Nodes Dispatch Top Transport`
- `Nodes Dispatch Fallbacks`

如果你正在排查 WebRTC 建连或 relay 回退，这几个字段是第一手线索。

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

最近这套服务化逻辑已经补成跨平台：

- Linux：`systemd`，支持 `user` / `system` scope
- macOS：`launchd`
- Windows：计划任务

默认直接执行：

```bash
clawgo gateway
```

就会尝试为当前平台注册 gateway service。

卸载时 `clawgo uninstall` 会尝试清理安装的 gateway service。

## 推荐的运维检查顺序

1. `clawgo config check`
2. `clawgo status`
3. `clawgo gateway status`
4. 打开你独立部署的 WebUI
5. 检查 Logs、Task Audit、Subagents、EKG
