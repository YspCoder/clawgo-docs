# Operations and API

## Gateway HTTP Surface

Gateway is more than a static WebUI host. `pkg/api/server.go` exposes:

1. health checks
2. node registration and heartbeat
3. WebUI control APIs

## Base Endpoints

### Health

```text
GET /health
```

Returns `ok`.

### Node Endpoints

```text
POST /nodes/register
POST /nodes/heartbeat
```

Both require token-based auth.

## WebUI API Groups

### Config and Version

- `/webui/api/config`
- `/webui/api/version`

### Chat and Upload

- `/webui/api/chat`
- `/webui/api/chat/history`
- `/webui/api/chat/stream`
- `/webui/api/upload`

### Runtime Resources

- `/webui/api/nodes`
- `/webui/api/sessions`
- `/webui/api/memory`
- `/webui/api/subagents_runtime`
- `/webui/api/subagent_profiles`
- `/webui/api/tool_allowlist_groups`

### Audit and Logs

- `/webui/api/task_audit`
- `/webui/api/task_queue`
- `/webui/api/ekg_stats`
- `/webui/api/exec_approvals`
- `/webui/api/logs/recent`
- `/webui/api/logs/stream`

### Automation

- `/webui/api/cron`
- `/webui/api/skills`

## Sentinel

Sentinel is initialized during Gateway startup and uses:

- `enabled`
- `interval_sec`
- `auto_heal`
- `notify_channel`
- `notify_chat_id`

## Logs

Default log path:

```text
~/.clawgo/logs/clawgo.log
```

The WebUI can also read recent logs and stream them.

## Recommended Checks

1. `clawgo config check`
2. `clawgo status`
3. `clawgo gateway status`
4. open `/webui`
5. inspect Logs, Task Audit, Subagents, and EKG
