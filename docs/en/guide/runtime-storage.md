# Runtime, Storage, and Recovery

## The Current Persistence Core

The current recovery model is still centered on the subagent runtime, not on world state.

The most important files are:

- `subagent_runs.jsonl`
- `subagent_events.jsonl`
- `threads.jsonl`
- `agent_messages.jsonl`

Together they record:

- subagent execution
- runtime events and retries
- agent thread relationships
- internal message flows

## File Location

These files are currently written under:

```text
workspace/agents/runtime/
```

## `subagent_runs.jsonl`

Stores run-level records such as:

- run id
- agent id
- task
- status
- output
- created / updated timestamps

This is the basis for recovering in-flight work and auditing outcomes.

## `subagent_events.jsonl`

Stores runtime events such as:

- `spawned`
- `running`
- `completed`
- `failed`
- retry counts

It is the direct trail for understanding why a subagent succeeded or failed.

## `threads.jsonl`

Stores agent thread metadata such as:

- `thread_id`
- `owner`
- `participants`
- `status`
- `topic`

That is what makes internal collaboration a thread model instead of plain text forwarding.

## `agent_messages.jsonl`

Stores the actual message flow, such as:

- `from_agent`
- `to_agent`
- `reply_to`
- `correlation_id`
- `requires_reply`
- `content`

This is also one of the reasons the WebUI can reconstruct internal collaboration streams.

## Sessions And Memory

Outside `workspace/agents/runtime/`, two other persistence areas matter:

- `~/.clawgo/sessions/`
- `workspace/memory/`

The first is more about primary session history. The second is more about:

- `heartbeat.log`
- `skill-audit.jsonl`
- `nodes-dispatch-audit.jsonl`
- trigger / process / node audit data

## Why This Design Matters

Recovery here does not mean “restore a chat transcript.” It means restoring:

- which subagent was running
- what stage it reached
- where the internal thread was
- what the last output or error looked like

That is one of the key differences between the current Agent Runtime and a regular chat shell.
