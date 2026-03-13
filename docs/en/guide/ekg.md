# EKG Guide

## Overview

EKG in ClawGo is not traditional host monitoring. It is a health surface for the AI runtime itself, focusing on:

- which providers are under the most pressure
- which error signatures appear most often
- which sources and channels are currently active
- whether escalations are increasing

The same signals are used both in the WebUI and inside runtime decision support.

## Where The Data Comes From

The backend EKG engine writes data into the workspace:

```text
workspace/memory/ekg-events.jsonl
workspace/memory/ekg-snapshot.json
```

From the current implementation, those signals are consumed by:

- the WebUI EKG page
- the Dashboard summary
- `/api/ekg_stats`
- the session planner for task hints and provider-selection assistance

## What You See In The WebUI

The WebUI has a dedicated EKG page:

- `/webui/ekg`

Supported time windows:

- `6h`
- `24h`
- `7d`

Main sections include:

- `Escalations`
- `Source Stats`
- `Channel Stats`
- `Top Providers (workload)`
- `Top Providers (all)`
- `Top Error Signatures (workload)`
- `Top Error Signatures (all)`

The Dashboard also uses the `24h` EKG summary for its overview cards.

## API Shape

Core endpoint:

```text
GET /api/ekg_stats?window=24h
```

Common response fields include:

- `source_stats`
- `channel_stats`
- `provider_top`
- `provider_top_workload`
- `errsig_top`
- `errsig_top_workload`
- `escalation_count`

If you build on top of ClawGo, this is the main EKG API surface.

## What These Metrics Mean

### Source Stats

Shows the recent activity distribution by source.  
Typical sources may include:

- main sessions
- subagents
- provider fallback flows

It answers: “Where is the runtime activity coming from?”

### Channel Stats

Shows the recent activity distribution by channel.

It helps answer:

- which channel is busiest
- which channel may be producing repeated failures
- whether one automation entry point is unusually active

### Top Providers

There are two related views:

- `provider_top_workload`
- `provider_top`

The first is more workload-oriented. The second is more all-events oriented.

They help answer:

- which provider is currently under the most pressure
- which provider is most associated with load or incidents

### Top Error Signatures

Also split into two views:

- `errsig_top_workload`
- `errsig_top`

These aggregate normalized error signatures and help answer:

- what the most frequent failure mode is
- whether the current issue is a brief spike or a sustained pattern

### Escalations

`escalation_count` is the number of escalation-level events in the selected window.

If this rises suddenly, it often means:

- one provider or model has degraded
- one automation path is repeatedly failing
- a class of errors has crossed into something that needs operator attention

## How It Connects To Task Planning

EKG is not only for display. In the current implementation, the session planner also reads EKG signals to add task hints and assist with provider selection based on historical error patterns.

So EKG has two values:

- an operator-facing observability surface
- a runtime-facing decision aid

## Recommended Usage

### Daily Checks

Start with:

1. `Escalations`
2. `Top Error Signatures`
3. `Top Providers (workload)`

That is the fastest way to tell whether the system is merely busy or actually unhealthy.

### Troubleshooting

If you are debugging a channel, provider, or automation path, read together:

- the EKG page
- Logs
- Task Audit
- `clawgo status`

EKG is good at showing trends, but it does not replace raw logs.

### Capacity And Trend Watching

If you want to watch load changes over time, prefer:

- `24h`
- `7d`

Short windows are best for spikes. Longer windows are better for trends.

## Related Pages

- [WebUI Console](/en/guide/webui)
- [Operations and API](/en/guide/operations)
- [Runtime, Storage, and Recovery](/en/guide/runtime-storage)
- [WebUI API Reference](/en/reference/webui-api)
