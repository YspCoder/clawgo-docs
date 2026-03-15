# 快速开始

## 先建立正确预期

ClawGo 当前更适合被理解为一个 **World Runtime**，而不是单纯的命令行聊天工具。

它的基础能力包括：

- 维护长期 world state 与 NPC state
- 通过 `main` 统一处理 world event
- 让 `agent` / `npc` 在同一个运行时里协作
- 把执行记录、provider 运行态和 world snapshot 一起落盘

## 安装

### 方式一：安装脚本

```bash
curl -fsSL https://clawgo.dev/install.sh | bash
```

安装指定变体：

```bash
curl -fsSL https://clawgo.dev/install.sh | bash -s -- --variant telegram
```

当前支持的主要变体包括：

- `full`
- `none`
- `telegram`
- `discord`
- `feishu`
- `maixcam`
- `qq`
- `dingtalk`
- `whatsapp`

### 方式二：源码构建

```bash
git clone https://github.com/YspCoder/clawgo.git
cd clawgo
make build
```

## 初始化

首次执行：

```bash
clawgo onboard
```

它会：

- 生成 `~/.clawgo/config.json`
- 创建 `~/.clawgo/workspace`
- 生成 `gateway.token`
- 拷贝内置 workspace 模板

## 最小可用配置

最近真实配置中心已经切到 `agents.agents` 和 `models.providers`。

一个最小示例：

```json
{
  "agents": {
    "defaults": {
      "workspace": "~/.clawgo/workspace",
      "model": {
        "primary": "openai/gpt-5.4"
      }
    },
    "agents": {
      "main": {
        "enabled": true,
        "type": "agent",
        "role": "orchestrator",
        "prompt_file": "agents/main/AGENT.md"
      },
      "guard": {
        "enabled": true,
        "kind": "npc",
        "persona": "A cautious town guard",
        "home_location": "gate",
        "default_goals": ["patrol the square"]
      }
    }
  },
  "models": {
    "providers": {
      "openai": {
        "api_key": "YOUR_KEY",
        "api_base": "https://api.openai.com/v1",
        "models": ["gpt-5.4"],
        "auth": "bearer",
        "timeout_sec": 90
      }
    }
  }
}
```

这个配置表达的是：

- 默认模型来自 `agents.defaults.model.primary`
- actor 与 NPC 都在 `agents.agents`
- provider 定义在 `models.providers`

## 配置 Provider

交互式方式：

```bash
clawgo provider
```

最近多 provider 的行为也更实用：

- 主 provider 由 `agents.defaults.model.primary` 决定
- 即使没显式写 fallback 链，运行时也会根据已声明的 provider 推断候选顺序
- 如果你要强约束优先级，再显式维护 fallback 顺序

## 启动

### 交互式模式

```bash
clawgo agent
```

一次性发消息：

```bash
clawgo agent -m "我走到 gate，看看守卫现在在做什么"
```

### Gateway 模式

```bash
clawgo gateway run
```

这是更完整的运行方式，会同时启动：

- Gateway API
- runtime snapshot / runtime live
- Channels
- Cron
- Sentinel

## WebUI

WebUI 当前建议独立部署，前端仓库：

- [YspCoder/clawgo-web](https://github.com/YspCoder/clawgo-web)

前端拿到 `gateway.token` 后直接请求 Gateway `/api/*` 即可，例如：

```text
https://<your-webui-host>?token=<gateway.token>
```

## 第一次验证

先检查基础状态：

```bash
clawgo status
clawgo config check
```

如果你想确认 world runtime 已经开始工作，可以再看：

- `~/.clawgo/workspace/agents/runtime/world_state.json`
- `~/.clawgo/workspace/agents/runtime/npc_state.json`
- `~/.clawgo/workspace/agents/runtime/world_events.jsonl`

## 一个更贴近当前模型的首条消息

你可以直接这样测试：

```bash
clawgo agent -m "我走进 square，观察 guard 和 merchant 的状态，并给出当前世界快照摘要"
```

这类输入更能直接验证：

- world event ingestion
- `main` 的世界级判断
- NPC intent 与渲染结果
- world store 是否已经开始落盘
