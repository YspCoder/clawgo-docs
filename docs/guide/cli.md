# CLI 命令

## 总览

当前 `clawgo` 顶层命令有：

- `onboard`
- `agent`
- `gateway`
- `status`
- `provider`
- `config`
- `cron`
- `tui`
- `channel`
- `skills`
- `version`
- `uninstall`

最近这轮 upstream 已经移除了旧版 `node` 命令，所以文档不再把它当作当前 CLI 面的一部分。

## onboard

初始化配置和工作区：

```bash
clawgo onboard
```

作用：

- 生成默认配置
- 创建 workspace 模板
- 自动生成 `gateway.token`
- 初始化后再通过 `provider` 子命令选择默认 provider/model

## agent

直接与 AgentLoop 交互：

```bash
clawgo agent
clawgo agent -m "Hello"
clawgo agent -s cli:my-session -m "修复一个 bug"
```

常用参数：

- `-m`, `--message`
- `-s`, `--session`
- `-d`, `--debug`

## gateway

前台运行：

```bash
clawgo gateway run
```

服务控制：

```bash
clawgo gateway start
clawgo gateway stop
clawgo gateway restart
clawgo gateway status
```

如果直接执行 `clawgo gateway`，程序会尝试注册系统服务。

## status

查看当前运行状态：

```bash
clawgo status
```

当前更值得关注的输出包括：

- 配置文件路径
- workspace 路径
- 当前 model 与实际生效的 provider
- 当前 provider 的 `api_base`
- 当前 provider 的 API key 是否已配置
- 日志配置
- Heartbeat 与 Cron runtime 参数
- 心跳日志与触发统计
- Skill 执行统计
- Session 分类统计

`status` 会按当前激活 provider 输出真实运行态，而不只是回显某个默认配置槽位。

## provider

Provider 相关命令：

```bash
clawgo provider list
clawgo provider use openai/gpt-5.4
clawgo provider configure
clawgo provider login codex
clawgo provider login codex --manual
```

说明：

- `list`: 列出当前声明的 provider 与模型
- `use <provider/model>`: 更新 `agents.defaults.model.primary`
- `configure`: 进入交互式 provider 编辑
- `login <provider>`: 为 OAuth 型 provider 建立登录会话
- `login <provider> --manual`: 在服务器或无浏览器环境下使用手动回调流程

`configure` 常见字段：

- `api_base`
- `api_key`
- `models`
- `auth`
- `timeout_sec`
- `supports_responses_compact`
- `oauth.provider`
- `oauth.credential_file`
- `oauth.callback_port`
- `oauth.cooldown_sec`

## config

查询：

```bash
clawgo config get models.providers.openai.api_base
```

设置：

```bash
clawgo config set channels.telegram.enabled true
```

校验：

```bash
clawgo config check
```

热更新：

```bash
clawgo config reload
```

## cron

列表：

```bash
clawgo cron list
```

添加：

```bash
clawgo cron add -n daily-report -m "总结今天的日志" -c "0 9 * * *"
clawgo cron add -n heartbeat -m "检查系统状态" -e 300
```

常用参数：

- `-n`, `--name`
- `-m`, `--message`
- `-e`, `--every`
- `-c`, `--cron`
- `-d`, `--deliver`
- `--channel`
- `--to`

启停与删除：

```bash
clawgo cron enable <job_id>
clawgo cron disable <job_id>
clawgo cron remove <job_id>
```

## tui

终端内置聊天界面：

```bash
clawgo tui
clawgo tui --session main
clawgo tui --token <gateway-token>
```

常用参数：

- `--token`
- `--session`, `-s`
- `--no-history`

使用说明：

- 它直接连接 Gateway 的 API
- 适合服务器、SSH 或纯终端环境
- 如果当前二进制未带 `with_tui`，命令会提示你安装包含 TUI 的构建变体
