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
- 当前 model、proxy 与实际生效的 provider
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

- 如果 `agents.defaults.proxy` 指向 `providers.proxies.<name>`，`status` 现在会显示当前生效 provider 的 `api_base` 和 key 状态
- 它不再只盯着 `providers.proxy` 这个默认槽位

## provider

交互式配置 provider：

```bash
clawgo provider
clawgo provider backup
```

它会提示输入：

- `api_base`
- `api_key`
- `models`
- `auth`
- `timeout_sec`
- `supports_responses_compact`

并可选择是否将其设为 `agents.defaults.proxy`。

## config

### 查询

```bash
clawgo config get providers.proxy.api_base
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
