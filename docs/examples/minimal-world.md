# 最小 World 示例

这份示例不是测试代码，而是一份最小可运行配置，目标是让你最快验证：

- `main` 能作为 world mind 工作
- `npc` 能进入 world runtime
- world state 会落盘
- WebUI / API 能读到 world snapshot

## 最小配置

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
        "default_goals": ["patrol the square", "observe visitors"],
        "perception_scope": 1,
        "world_tags": ["security", "starter"]
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
  },
  "gateway": {
    "host": "0.0.0.0",
    "port": 18790,
    "token": "YOUR_GATEWAY_TOKEN"
  }
}
```

## 配套 prompt

最小前提是：

- `agents/main/AGENT.md` 已存在

如果你想让首轮结果更稳定，`main` 的 prompt 至少应明确：

- 先把用户输入当成 world event
- 优先描述世界状态变化
- 不要把 NPC intent 和最终 world truth 混为一谈

## 启动

```bash
clawgo gateway run
```

或直接交互：

```bash
clawgo agent -m "我走到 gate，看 guard 在做什么"
```

## 预期产物

首次成功运行后，应该能看到：

```text
~/.clawgo/workspace/agents/runtime/world_state.json
~/.clawgo/workspace/agents/runtime/npc_state.json
~/.clawgo/workspace/agents/runtime/world_events.jsonl
```

## world state 预期样子

一个精简的 world snapshot 可能接近：

```json
{
  "world_id": "main-world",
  "tick": 3,
  "npc_count": 1,
  "active_npcs": ["guard"]
}
```

这不是完整返回体，只是你最容易观察的几个字段。

## 通过 API 查看

### 读取 runtime snapshot

```bash
curl -H 'Authorization: Bearer YOUR_GATEWAY_TOKEN' \
  http://127.0.0.1:18790/api/runtime
```

返回是 websocket snapshot 流，首帧里会包含：

```json
{
  "ok": true,
  "type": "runtime_snapshot",
  "snapshot": {
    "version": {
      "gateway_version": "dev",
      "webui_version": "dev",
      "compiled_channels": ["telegram"]
    },
    "config": {
      "core": {
        "main_agent_id": "main",
        "agents": {
          "main": {
            "enabled": true,
            "role": "orchestrator",
            "prompt": "agents/main/AGENT.md"
          }
        }
      }
    },
    "world": {
      "world_id": "main-world",
      "tick": 3,
      "npc_count": 1,
      "active_npcs": ["guard"]
    }
  }
}
```

### 单独读取 world 视图

```bash
curl -H 'Authorization: Bearer YOUR_GATEWAY_TOKEN' \
  'http://127.0.0.1:18790/api/world?limit=20'
```

返回体常见形态：

```json
{
  "found": true,
  "world": {
    "world_id": "main-world",
    "tick": 3,
    "npc_count": 1,
    "active_npcs": ["guard"]
  }
}
```

## 推荐的首条消息

```text
我走进 square，观察 guard 的状态，并给出当前世界快照摘要
```

这类输入能同时验证：

- 用户输入是否进入 world event
- `main` 是否在做世界级总结
- `npc` 是否已开始参与 runtime
- `world_state.json` 是否有增量变化

## 下一步怎么扩

从这个最小 world 出发，下一步最自然的是补：

- 第二个 NPC，例如 `merchant`
- entity，例如 `gate` 或 `quest_board`
- quest
- 远端 node branch

这样你可以逐步把它扩成一个真实的小世界。
