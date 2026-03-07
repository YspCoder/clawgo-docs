# MCP Integration

## Overview

ClawGo now includes built-in MCP integration under `tools.mcp`. In the current implementation this is a first-class runtime capability, not just an external note:

- configuration schema exists under `tools.mcp`
- startup creates an `MCPTool`
- remote MCP tools are discovered automatically
- discovered remote tools are registered as local ClawGo tools
- the WebUI has a dedicated MCP page
- the Gateway exposes an MCP package install endpoint

## Supported Scope

From `pkg/tools/mcp.go` and the README, the current implementation supports `stdio` MCP servers.

Supported bridge actions:

- `list_servers`
- `list_tools`
- `call_tool`
- `list_resources`
- `read_resource`
- `list_prompts`
- `get_prompt`

## Config Structure

Entry point:

```json
{
  "tools": {
    "mcp": {
      "enabled": true,
      "request_timeout_sec": 20,
      "servers": {
        "context7": {
          "enabled": true,
          "transport": "stdio",
          "command": "npx",
          "args": ["-y", "@upstash/context7-mcp"],
          "env": {},
          "working_dir": "/absolute/path/to/project",
          "description": "Example MCP server",
          "package": "@upstash/context7-mcp"
        }
      }
    }
  }
}
```

## Validation Rules

The MCP validator checks:

- `tools.mcp.request_timeout_sec > 0`
- server names are non-empty
- enabled servers must define `command`
- `transport` must be `stdio`
- `working_dir`, if present, must be an absolute path

## What Happens At Startup

In `pkg/agent/loop.go`, when `cfg.Tools.MCP.Enabled` is true, ClawGo:

1. creates `MCPTool`
2. registers the `mcp` bridge tool itself
3. creates a discovery context from `request_timeout_sec`
4. calls `DiscoverTools()`
5. registers each discovered remote tool as a local tool

That means the model can either call the generic `mcp` bridge or directly call discovered tools.

## Dynamic Tool Naming

Discovered remote tools are mapped into:

```text
mcp__<server>__<tool>
```

For example:

```text
mcp__context7__resolve_library_id
mcp__context7__query_docs
```

## WebUI Support

There is already a dedicated page:

- `webui/src/pages/MCP.tsx`

It supports:

- adding and removing MCP servers
- editing `command`, `args`, `working_dir`, and `package`
- saving config
- viewing discovered MCP tools
- installing npm packages for MCP servers

## Related WebUI APIs

### `GET /webui/api/tools`

Returns all tools and also:

- `mcp_tools`

### `POST /webui/api/mcp/install`

Input:

```json
{
  "package": "@upstash/context7-mcp"
}
```

Server behavior:

1. ensures Node runtime is available
2. runs `npm i -g <package>`
3. resolves the package binary
4. returns `bin_name` and `bin_path`

## Recommended Usage

### Option 1: Use `npx`

Good for quick trials:

```json
{
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp"]
}
```

### Option 2: Install from WebUI and pin the binary path

Better for more stable environments:

- install from the MCP page
- let the server resolve the actual binary path
- store that binary path in `command`

## Current Limits

Based on the current implementation:

- only `stdio` is supported
- tool discovery happens at startup
- new or modified MCP servers require save + rediscovery flow
- server processes are created per request/client lifecycle, not as one shared long-lived pool
