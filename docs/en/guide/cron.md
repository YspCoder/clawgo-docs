# Cron Guide

## Overview

ClawGo Cron is not just shell scheduling. Triggered jobs are fed back into the Agent Runtime so they continue through the model, tool, and message-delivery pipeline.

A Cron job usually includes:

- `name`
- `schedule`
- `message`
- `deliver`
- `channel`
- `to`
- `enabled`
- `state`

Supported schedule forms:

- `every`
- `cron`
- `at`

Gateway builds a `CronService` during startup and redispatches job triggers into the runtime.

## What Makes It Different

Compared with OS cron, the point is not simply “run a command on time,” but:

- deliver a task into an agent
- continue using tools
- keep sending messages through channels
- keep the task auditable, pausable, and retryable

That fits AI-runtime automation much better.

## Cron Tools In Runtime

When `CronService` exists, AgentLoop also registers:

- `remind`
- `cron`

That means an agent can schedule reminders or recurring tasks for itself during runtime instead of depending only on the external CLI.

## Common CLI Usage

```bash
clawgo cron list
clawgo cron add -n daily-report -m "Summarize today's logs" -c "0 9 * * *"
clawgo cron add -n heartbeat -m "Check system status" -e 300
clawgo cron enable <job_id>
clawgo cron disable <job_id>
clawgo cron remove <job_id>
```

Common parameters:

- `-n`, `--name`
- `-m`, `--message`
- `-e`, `--every`
- `-c`, `--cron`
- `-d`, `--deliver`
- `--channel`
- `--to`

## Managing It In The WebUI

The WebUI Cron page supports:

- `list`
- `create`
- `update`
- `enable`
- `disable`
- `delete`

If operators or non-developers need to manage recurring jobs, the WebUI is usually the better entry point.

## Good Use Cases

### Routine Summaries

Examples:

- daily log summaries
- hourly system checks
- scheduled external fetches followed by a routed response

### Proactive Reminders

Examples:

- send reminders to a chat or user at a fixed time
- periodically check approvals, alerts, or queue backlog

### Agent Self-Scheduling

Once an agent has access to `cron` or `remind`, it can schedule follow-up actions during the task itself.

## Usage Advice

### Start With Idempotent Jobs

At first, prefer:

- summary jobs
- read-only checks
- tasks that are safe to run repeatedly

### Add Delivery Jobs Later

Jobs that use `deliver/channel/to` are best added after the basic flow is already stable.

### Separate Cron Output From User Traffic

If one channel handles both user messages and Cron output, isolate the target chat or recipient.

## Related Pages

- [Channels Guide](/en/guide/channels)
- [CLI](/en/guide/cli)
- [WebUI Console](/en/guide/webui)
- [Operations and API](/en/guide/operations)
