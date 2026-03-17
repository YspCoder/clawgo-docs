# EKG Guide

## Current Status

This page now serves mainly as a migration note for older deployments.

In the current `clawgo` codebase, the default public WebUI/API surface no longer treats EKG as a standard module. The following older entry points should not be documented as current default behavior:

- `/api/ekg_stats`
- Dashboard EKG summary cards
- a dedicated EKG page

## What To Use Instead

For current runtime health and operational visibility, use:

- [Operations and API](/en/guide/operations)
- [WebUI Console](/en/guide/webui)
- [Runtime, Storage, and Recovery](/en/guide/runtime-storage)
- `clawgo status`
- `/api/logs/recent`
- `/api/logs/live`
- `/api/provider/runtime`

These cover the observability surface that still exists in current versions:

- provider health and cooldown state
- recent logs and live log streaming
- session, memory, skills, and cron traces

## If You Still Run An Older Deployment

If you still keep historical EKG data files or a private extension route, read this page as a reminder that upstream no longer presents EKG as a default public module.

The safer migration path is:

1. verify the exact `clawgo` binary version you run
2. compare it with the default registered routes in the [WebUI API Reference](/en/reference/webui-api)
3. move your operational scripts toward `status`, `logs`, and `provider runtime`
