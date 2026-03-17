# 快速开始

## 当前推荐路径

按当前 README，推荐上手顺序是：

1. 安装 `clawgo`
2. 执行 `clawgo onboard`
3. 选择 provider 和 model
4. 进入 `agent` 或 `gateway run`

## 安装

```bash
curl -fsSL https://raw.githubusercontent.com/YspCoder/clawgo/main/install.sh | bash
```

## 初始化

```bash
clawgo onboard
```

它会：

- 生成默认配置
- 初始化 workspace
- 生成 `gateway.token`

## 选择 provider 和 model

当前 README 推荐的最短路径是：

```bash
clawgo provider list
clawgo provider use openai/gpt-5.4
clawgo provider configure
```

如果使用 OAuth 型 provider，例如 `codex`、`anthropic`、`antigravity`、`gemini`、`kimi`、`qwen`：

```bash
clawgo provider login codex
clawgo provider login codex --manual
```

如果同一个 provider 同时有 API key 和 OAuth 账号，推荐 `auth: "hybrid"`。

## 启动

交互模式：

```bash
clawgo agent
clawgo agent -m "Hello"
```

网关模式：

```bash
clawgo gateway run
```

开发模式：

```bash
make dev
```

## WebUI 访问

按当前 README，WebUI 直接通过 Gateway 访问：

```text
http://<host>:<port>/?token=<gateway.token>
```

这也是当前文档默认假设的访问方式。

## 推荐的最小配置理解

当前真实配置核心是：

- `agents.defaults`
- `agents.router`
- `agents.communication`
- `agents.subagents`
- `models.providers`

不是之前那版文档里的 `agents.agents`。

## 一个最小 subagent 拓扑

```json
{
  "agents": {
    "router": {
      "enabled": true,
      "main_agent_id": "main",
      "strategy": "rules_first",
      "rules": []
    },
    "subagents": {
      "main": {
        "enabled": true,
        "type": "router",
        "role": "orchestrator",
        "system_prompt_file": "agents/main/AGENT.md"
      },
      "coder": {
        "enabled": true,
        "type": "worker",
        "role": "code",
        "system_prompt_file": "agents/coder/AGENT.md"
      }
    }
  }
}
```

## 首次验证

先执行：

```bash
clawgo status
clawgo config check
```

再看这些运行产物是否出现：

- `subagent_runs.jsonl`
- `subagent_events.jsonl`
- `threads.jsonl`
- `agent_messages.jsonl`

## 第一条更贴近当前模型的消息

```bash
clawgo agent -m "实现一个新接口，并让 coder 和 tester 分工完成"
```

这类请求更接近当前系统真正擅长的场景：

- `main` 派发
- `subagent` 执行
- 内部消息分流
- 最终回到主会话
