# CLI 命令

## 总览

`clawgo` 的顶层命令有：

- `onboard`
- `agent`
- `gateway`
- `status`
- `provider`
- `config`
- `cron`
- `node`
- `tui`
- `channel`
- `skills`
- `version`
- `uninstall`

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
- 当前 CLI 不再提供旧文档里提到的 `--sync-webui`

## agent

直接与 AgentLoop 交互。

```bash
clawgo agent
clawgo agent -m "Hello"
clawgo agent -s cli:my-session -m "修复一个 bug"
```

参数：

- `-m`, `--message`: 单条输入
- `-s`, `--session`: 指定 session key
- `-d`, `--debug`: 调试模式

## gateway

### 运行

```bash
clawgo gateway run
```

### 服务控制

```bash
clawgo gateway start
clawgo gateway stop
clawgo gateway restart
clawgo gateway status
```

如果直接执行 `clawgo gateway`，代码会尝试注册系统服务。

Gateway 启动后会打印：

- 启用的 channels
- 监听地址
- Cron 与 Heartbeat 启动状态
- Sentinel 启动状态

## status

查看当前运行状态：

```bash
clawgo status
```

输出重点包括：

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
- 节点在线情况与能力分布
- Node P2P 启用状态、transport 与 ICE 配置数量
- 节点派发使用的 transport 与 fallback 次数

这是运维排障时最优先跑的命令之一。

注意：

- `status` 会按当前激活 provider 输出 `api_base` 和 key 状态
- 这比只看配置文件里某个默认 provider 槽位更接近真实运行态

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

`configure` 常见会提示这些字段：

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

并可选择是否更新默认 `agents.defaults.model.primary` 所指向的 provider/model。

## config

### 查询

```bash
clawgo config get models.providers.openai.api_base
```

### 设置

```bash
clawgo config set channels.telegram.enabled true
```

### 校验

```bash
clawgo config check
```

### 热更新

```bash
clawgo config reload
```

## cron

### 列表

```bash
clawgo cron list
```

### 添加

```bash
clawgo cron add -n daily-report -m "总结今天的日志" -c "0 9 * * *"
clawgo cron add -n heartbeat -m "检查系统状态" -e 300
```

可选参数：

- `-n`, `--name`
- `-m`, `--message`
- `-e`, `--every`
- `-c`, `--cron`
- `-d`, `--deliver`
- `--channel`
- `--to`

### 启停与删除

```bash
clawgo cron enable <job_id>
clawgo cron disable <job_id>
clawgo cron remove <job_id>
```

## node

用于把远端执行节点注册到 Gateway，或单独发送节点心跳。

### 注册节点

```bash
clawgo node register --gateway http://127.0.0.1:18790 --id edge-dev --endpoint http://10.0.0.8:8080
```

常用参数：

- `--gateway`: Gateway 地址
- `--token`: Gateway token
- `--node-token`: 节点自身 endpoint 的 Bearer token
- `--id`: 节点 ID
- `--name`: 节点显示名
- `--endpoint`: 节点公开 endpoint
- `--actions`: 支持的动作列表
- `--models`: 支持的模型列表
- `--tags`: 节点标签，用于匹配派发策略，例如 `gpu,vision,build`
- `--capabilities`: 能力标记，例如 `run,invoke,model,camera,screen,location,canvas`
- `--watch`: 保持 websocket 连接并持续发心跳
- `--heartbeat-sec`: `--watch` 模式下的心跳周期

默认情况下，`register` 只发一次注册请求就退出。带上 `--watch` 后，会：

- 建立 websocket 连接
- 自动发送 heartbeat
- 在循环里处理 Gateway 下发的节点请求
- 为后续 `websocket_tunnel` / `webrtc` 提供信令与数据面基础

### 单次发送心跳

```bash
clawgo node heartbeat --gateway http://127.0.0.1:18790 --id edge-dev
```

常用参数：

- `--gateway`
- `--token`
- `--id`

这个子命令适合外部调度器或你自己的节点守护逻辑手动保活。

## tui

终端内置聊天界面。

```bash
clawgo tui
clawgo tui --session main
clawgo tui --token <gateway-token>
```

常用参数：

- `--token`: 显式指定 Gateway token
- `--session`, `-s`: 初始打开的 session，默认 `main`
- `--no-history`: 启动时跳过历史记录加载

使用说明：

- 它会直接连接 Gateway 的 WebUI/API 接口
- 适合在服务器、SSH 或纯终端环境下做会话切换和聊天
- 支持多 pane 视图，最多同时打开 4 个 session pane
- 启动后可通过 `/help` 查看内置命令

注意：

- `clawgo tui` 依赖 `with_tui` build tag
- 当前发布变体里，`full` 和 `-nochannels` / `none` 版本都会带上 TUI
- 如果当前二进制没编入 TUI，命令会提示你安装带 TUI 的构建变体

## channel

当前只暴露了测试子命令：

```bash
clawgo channel test --channel telegram --to 123456 -m "hello"
```

这会启动 channel manager 并尝试向指定收件人发测试消息。

## skills

### 查看与展示

```bash
clawgo skills list
clawgo skills show <name>
clawgo skills list-builtin
clawgo skills search
```

### 安装与卸载

```bash
clawgo skills install YspCoder/clawgo-skills/weather
clawgo skills remove weather
```

还有一个 `install-builtin`，但当前实现里默认安装的是 `weather/news/stock/calculator`，而仓库内置 workspace skills 已经明显演进成另一套，这部分在使用时要以实际目录为准，不要完全依赖帮助文案。

## uninstall

```bash
clawgo uninstall
clawgo uninstall --purge
clawgo uninstall --remove-bin
```

行为：

- 卸载 gateway service
- 删除 PID 文件
- 可选清空整个配置与工作区目录
- 可选删除可执行文件
