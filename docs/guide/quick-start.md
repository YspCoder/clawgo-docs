# 快速开始

## 项目定位

ClawGo 是一个 Go 编写的 Agent Runtime。代码入口在 `cmd/clawgo`，核心能力分布在：

- `pkg/agent`: 主循环、任务拆分、上下文构造、路由与恢复
- `pkg/tools`: 内置工具系统
- `pkg/api`: Gateway HTTP API 与 WebUI API
- `pkg/channels`: Telegram、Discord、Feishu、DingTalk、WhatsApp、QQ、MaixCam 等通道
- `pkg/cron`: 定时任务
- `pkg/nodes`: 远端节点与 relay/router
- `webui`: React + Vite 运维控制台

## 安装方式

### 方式一：安装脚本

```bash
curl -fsSL https://clawgo.dev/install.sh | bash
```

如果你只想装某一个 channel 变体，最近也可以显式指定：

```bash
curl -fsSL https://clawgo.dev/install.sh | bash -s -- --variant telegram
```

`install.sh` 会：

- 根据系统与架构下载最新 release 二进制
- 支持 `full` / `none` / `telegram` / `discord` / `feishu` / `maixcam` / `qq` / `dingtalk` / `whatsapp` 这些安装变体
- 文档站会同步托管一份脚本，所以可以直接通过 `https://clawgo.dev/install.sh` 安装
- 不再单独下载 `webui.tar.gz`
- 安装完成后会调用 `clawgo onboard --sync-webui`，把嵌入式 WebUI 同步到 `~/.clawgo/workspace/webui`
- 可选执行 OpenClaw 到 ClawGo 的迁移
- 如果还没有配置文件，会提示是否继续执行 `clawgo onboard`

### 方式二：源码构建

```bash
git clone https://github.com/YspCoder/clawgo.git
cd clawgo
make build
```

默认产物在 `build/clawgo-<platform>-<arch>`。

## 初始化

首次执行：

```bash
clawgo onboard
```

这个命令会：

- 在 `~/.clawgo/config.json` 生成默认配置
- 自动生成 `gateway.token`
- 将内置工作区模板拷贝到 `~/.clawgo/workspace`

如果只是升级后刷新嵌入式 WebUI，不想重建配置，可以执行：

```bash
clawgo onboard --sync-webui
```

默认工作区中会包含：

- `AGENTS.md`
- `BOOT.md`
- `BOOTSTRAP.md`
- `IDENTITY.md`
- `MEMORY.md`
- `SOUL.md`
- `TOOLS.md`
- `USER.md`
- `HEARTBEAT.md`
- `memory/`
- `skills/`

## 配置模型提供方

最关键的是配置 `providers` 与 `agents.defaults.proxy`。

交互式配置：

```bash
clawgo provider
```

最小可用配置通常至少包含：

```json
{
  "agents": {
    "defaults": {
      "proxy": "proxy"
    }
  },
  "providers": {
    "proxy": {
      "api_key": "YOUR_KEY",
      "api_base": "http://localhost:8080/v1",
      "models": ["glm-4.7"],
      "auth": "bearer",
      "timeout_sec": 90
    }
  }
}
```

代码中默认假设你前面还有一个兼容 OpenAI 风格接口的代理层，例如 README 中提到的 CLIProxyAPI。

最近还有一个对多 provider 场景比较实用的变化：

- 即使你没有显式写 `agents.defaults.proxy_fallbacks`
- 运行时也会根据当前已声明的 provider 自动推断 fallback 链
- 显式 `proxy_fallbacks` 仍然适合在你想强约束优先级时使用

## 启动方式

### 交互式 Agent

```bash
clawgo agent
```

直接发送单条消息：

```bash
clawgo agent -m "Hello"
```

指定 session：

```bash
clawgo agent -s cli:demo -m "实现一个配置热更新方案"
```

### Gateway 模式

```bash
clawgo gateway run
```

这是更完整的运行方式，会同时启动：

- Gateway HTTP 服务
- WebUI API
- Channel Manager
- Cron Service
- Heartbeat Service
- Sentinel

### 开发模式

```bash
make dev
```

适合本地开发联调。

## WebUI 入口

默认地址：

```text
http://<host>:<port>/webui?token=<gateway.token>
```

默认端口来自 `gateway.port`，默认值是 `18790`。

## 第一次排查建议

启动后先执行：

```bash
clawgo status
clawgo config check
```

这两个命令能最快确认：

- 配置文件是否存在
- workspace 是否存在
- provider 是否配置完整
- 日志、心跳、Cron、节点统计是否正常
