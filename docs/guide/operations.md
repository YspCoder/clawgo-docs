# 运维与 API

## Gateway HTTP 能力

按当前 `pkg/api/server.go`，Gateway 默认公开的能力主要是：

1. 健康检查
2. Gateway 托管的 WebUI 入口
3. WebUI 控制 API

## 基础接口

### 健康检查

```text
GET /health
```

返回 `ok`。

## 鉴权方式

WebUI 与 API 受 `gateway.token` 保护。

当前默认访问模型仍然是 README 里给出的：

```text
http://<host>:<port>/?token=<gateway.token>
```

代码里实际接受三种鉴权形态：

- `?token=<gateway.token>`
- `Authorization: Bearer <gateway.token>`
- `clawgo_webui_token` cookie

同时 Gateway 的 HTTP 包装层默认放开了通用 CORS，方便外部前端或控制台直接消费 `/api/*`。

## WebUI API 分组

### 配置与版本

- `/api/config`
- `/api/version`

其中 `GET /api/config?mode=normalized` 会返回：

- `config`
- `raw_config`

normalized 关键字段包括：

- `core.default_provider`
- `core.default_model`
- `core.main_agent_id`
- `core.subagents`
- `runtime.router`
- `runtime.providers`

### 对话与上传

- `/api/chat`
- `/api/chat/history`
- `/api/chat/live`
- `/api/upload`

### Provider 与 OAuth

- `/api/provider/oauth/start`
- `/api/provider/oauth/complete`
- `/api/provider/oauth/import`
- `/api/provider/oauth/accounts`
- `/api/provider/models`
- `/api/provider/runtime`

主要用于：

- 浏览器内完成 OAuth 登录
- 导入已有 auth JSON
- 查询 provider 当前模型列表
- 查看 provider runtime 健康度、cooldown 和候选顺序

### 运行资源

- `/api/sessions`
- `/api/memory`
- `/api/workspace_file`
- `/api/tool_allowlist_groups`
- `/api/tools`
- `/api/mcp/install`
- `/api/cron`
- `/api/skills`

### 日志与通道辅助接口

- `/api/logs/recent`
- `/api/logs/live`
- `/api/whatsapp/status`
- `/api/whatsapp/logout`
- `/api/whatsapp/qr.svg`

## `status` 命令的运维价值

`clawgo status` 读取运行时产物，而不是只回显配置文件。

当前更有用的输出包括：

- 当前激活 provider
- `Provider API Base`
- `Provider API Key`
- heartbeat / cron 状态
- skills 执行统计
- sessions 统计

这比只盯着配置文件里某个 provider 槽位更接近真实运行态。

## Sentinel

Sentinel 在 Gateway 启动时初始化，使用这些字段：

- `enabled`
- `interval_sec`
- `auto_heal`
- `notify_channel`
- `notify_chat_id`

## 日志

默认日志路径：

```text
~/.clawgo/logs/clawgo.log
```

当前默认日志接口是：

- `/api/logs/recent`
- `/api/logs/live`

而不是旧版文档里出现过的 `/api/logs/stream`。

## 热更新与回滚

`clawgo config set` 的实现会：

1. 修改配置
2. 原子写回
3. 保留备份
4. 尝试通知 Gateway reload
5. 如果 reload 失败且 Gateway 正在运行，则执行回滚

## 服务化部署

`clawgo gateway` 支持：

- `start`
- `stop`
- `restart`
- `status`

如果直接运行：

```bash
clawgo gateway
```

程序会尝试为当前平台注册 gateway 服务；前台调试仍建议显式使用：

```bash
clawgo gateway run
```
