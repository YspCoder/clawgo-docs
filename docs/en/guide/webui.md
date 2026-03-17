# WebUI Console

## Current Positioning

According to the latest README, the WebUI is currently used mainly for:

- Dashboard and agent-topology views
- node, log, memory, and runtime inspection
- OAuth account management

It should no longer be described as a full public runtime-control surface.

## Access

The current recommended entrypoint is still through Gateway:

```text
http://<host>:<port>/?token=<gateway.token>
```

That is also the explicit default shown in the current clawgo README.

## Main Pages

### Dashboard

Used for overall status, including:

- version
- node state
- provider runtime info
- recent runtime overview

### Agent Topology

The main focus is:

- `main`
- local subagents
- remote node-backed branches

This is the clearest view of who is coordinating and who is executing.

### Config

The current emphasis is viewing and checking configuration.

The docs and README now put canonical config changes back into:

- `config.json`
- `AGENT.md`

rather than treating the WebUI as the primary edit path.

### Provider / OAuth

This is one of the clearest and most stable management surfaces in the current WebUI:

- OAuth login
- account import
- account refresh
- account deletion
- provider runtime status

### Logs / Memory / Nodes / Skills

These pages are mainly for:

- log inspection
- memory-file inspection
- node and dispatch status
- skill browsing and installation

## The Most Useful Pages To Open First

If this is your first time opening the WebUI, start with:

1. Agent Topology
2. Provider OAuth / runtime
3. Logs
4. Nodes

Those pages best reflect the current Agent Runtime state.

## Frontend Repository

The frontend source repository is still:

- [YspCoder/clawgo-web](https://github.com/YspCoder/clawgo-web)

But according to the current clawgo README, the default access model is still Gateway-hosted WebUI.
