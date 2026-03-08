# Channels Guide

## Overview

ClawGo channel adapters live in `pkg/channels`. They bring external messages into the runtime and send runtime output back to the target platform.

Currently implemented channels include:

- `telegram`
- `discord`
- `feishu`
- `dingtalk`
- `qq`
- `whatsapp`
- `maixcam`

The channel manager is responsible for:

- initializing enabled adapters
- starting and stopping them
- delivering inbound messages into the bus
- routing outbound messages by channel
- applying dedupe windows and duplicate suppression

## Common Settings

The exact fields vary by channel, but shared dedupe-related settings include:

- `inbound_message_id_dedupe_ttl_seconds`
- `inbound_content_dedupe_window_seconds`
- `outbound_dedupe_window_seconds`

These settings control:

- how long repeated inbound message IDs are ignored
- whether repeated inbound content is treated as duplicate
- whether repeated outbound sends are suppressed

## Telegram

Telegram is one of the most common ways to start.

Common fields:

- `token`
- `streaming`
- `allow_from`
- `allow_chats`
- `enable_groups`
- `require_mention_in_groups`

Good for:

- personal bots
- small-group operational entry points
- streaming replies

## Feishu / DingTalk / QQ / Discord / WhatsApp

The main differences across these channels are:

- authentication style
- allowed-origin fields
- group vs direct-message constraints

But the integration model is the same:

- inbound messages enter the runtime
- outbound messages are pushed back through the message bus

## MaixCam

`maixcam` is more device-oriented.

Common fields:

- `host`
- `port`
- `allow_from`

This is more relevant for edge devices, camera workflows, or local hardware integrations.

## Usage Advice

### Start With One Channel

Start with a single channel such as Telegram and verify:

- Gateway starts correctly
- the token is valid
- allow rules are correct
- inbound messages reach a session

### Tune Dedupe After That

If you later see:

- webhook replays
- repeated platform deliveries
- duplicate outbound messages

then tune the dedupe settings.

### Separate User And Ops Entry Points

If you use multiple channels, split:

- user-facing entry points
- operator-facing entry points

That keeps Cron, Sentinel, approvals, and normal user traffic from getting mixed together.

## Related Pages

- [Cron Guide](/en/guide/cron)
- [Nodes Guide](/en/guide/nodes)
- [Configuration](/en/guide/configuration)
- [Operations and API](/en/guide/operations)
