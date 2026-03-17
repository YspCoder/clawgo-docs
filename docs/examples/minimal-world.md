# 最小 Subagent 示例

这页取代旧的 world 示例，给出一个更贴近当前 clawgo 的最小 subagent 拓扑。

## 目标

快速验证：

- `main` 能派发任务
- `coder` 能作为 subagent 执行
- 运行产物会落盘
- 最终结果会回到主会话

## 最小配置

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
        "system_prompt_file": "agents/coder/AGENT.md",
        "tools": {
          "allowlist": ["filesystem", "shell", "sessions"]
        },
        "runtime": {
          "provider": "openai",
          "max_parallel_runs": 1
        }
      }
    }
  }
}
```

## 启动

```bash
clawgo agent -m "实现一个最小的 health 接口，并让 coder 完成"
```

## 预期产物

运行后，重点检查：

- `subagent_runs.jsonl`
- `subagent_events.jsonl`
- `threads.jsonl`
- `agent_messages.jsonl`

这些文件通常位于：

```text
~/.clawgo/workspace/agents/runtime/
```

## 预期行为

- `main` 接收用户请求
- router 决定是否派发到 `coder`
- `coder` 执行任务
- 内部消息流写入 thread / message store
- 最终结果回到主通道

## 下一步

你可以在这个最小示例上继续补：

- `tester`
- 远端 node branch
- 更严格的 `accept_from` / `can_talk_to`
- `subagent_profile` 驱动的角色模板
