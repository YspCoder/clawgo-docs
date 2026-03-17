# WebUI API 参考

这页按 `pkg/api/server.go` 当前显式注册的 `/api/*` 路由整理。

## 鉴权

常见访问方式：

- `?token=<gateway.token>`
- `Authorization: Bearer <gateway.token>`

### `POST /api/auth/session`

如果你自己拆前端，可以先调用这个接口建立会话 cookie。

```bash
curl -X POST \
  -H 'Authorization: Bearer YOUR_GATEWAY_TOKEN' \
  http://127.0.0.1:18790/api/auth/session
```

## 配置与版本

- `GET /api/config`
- `POST /api/config`
- `GET /api/version`

`GET /api/config?mode=normalized` 会返回：

- `config`
- `raw_config`

当前 normalized 关键字段包括：

- `core.default_provider`
- `core.default_model`
- `core.main_agent_id`
- `core.subagents`
- `runtime.router`
- `runtime.providers`

## 聊天与上传

- `POST /api/chat`
- `GET /api/chat/history`
- `GET /api/chat/live`
- `POST /api/upload`

这里要注意：当前显式注册的是 `chat`、`chat/history`、`chat/live`，不是之前文档里那批更大的公开 runtime 控制面。

## Provider 与 OAuth

- `POST /api/provider/oauth/start`
- `POST /api/provider/oauth/complete`
- `POST /api/provider/oauth/import`
- `GET/POST /api/provider/oauth/accounts`
- `POST /api/provider/models`
- `GET/POST /api/provider/runtime`

这是当前 WebUI 最稳定的运维 API 之一。

## 节点与产物

- `GET /api/nodes`
- `GET /api/node_dispatches`
- `POST /api/node_dispatches/replay`
- `GET /api/node_artifacts`
- `GET /api/node_artifacts/export`
- `GET /api/node_artifacts/download`
- `POST /api/node_artifacts/delete`
- `POST /api/node_artifacts/prune`

## Cron / Skills / Sessions / Memory

- `GET/POST /api/cron`
- `GET/POST /api/skills`
- `GET /api/sessions`
- `GET/POST /api/memory`
- `GET/POST /api/workspace_file`

## 工具与 MCP

- `GET /api/tools`
- `GET /api/tool_allowlist_groups`
- `POST /api/mcp/install`

## 日志与通道辅助接口

- `GET /api/logs/live`
- `GET /api/logs/recent`
- `GET /api/whatsapp/status`
- `POST /api/whatsapp/logout`
- `GET /api/whatsapp/qr.svg`

## 这轮文档特别修正了什么

当前代码里已经没有这些显式公开路由：

- `/api/runtime`
- `/api/world`
- `/api/subagents_runtime`
- `/api/subagent_profiles`
- `/api/task_queue`
- `/api/ekg_stats`

所以文档不再把它们写成 clawgo 当前默认暴露的 WebUI API。
