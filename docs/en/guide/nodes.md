# Node Migration Note

## Current Status

The latest `clawgo` upstream revision has removed the older node runtime surface from the default product, including:

- the `clawgo node` CLI
- `/nodes/register`
- `/nodes/heartbeat`
- `/api/nodes`
- `/api/node_dispatches*`
- `/api/node_artifacts*`
- `gateway.nodes.*`
- the older Node P2P / relay / webrtc runtime path

So this page is no longer a current feature guide. It is now a migration note.

## What To Focus On Instead

The default upstream runtime is now centered on:

- `main + local subagents`
- provider runtime
- sessions / memory / logs
- cron / skills / MCP

If you are upgrading from an older revision, remove node-runtime assumptions from your day-to-day operations and docs.

## What Changed In This Docs Revision

This docs update now reflects that removal by:

1. removing `node` from the CLI guide
2. removing node endpoints from the default API reference
3. collapsing `gateway.nodes.*` out of current config docs
4. turning the Node P2P example into a historical note rather than a current onboarding path

## If You Still Maintain An Older Deployment

If you still operate a private fork or historical deployment that kept the node/P2P surface:

- pin that version explicitly
- document it against its own source tree
- avoid mixing those instructions into the current upstream docs
