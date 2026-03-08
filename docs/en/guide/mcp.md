# MCP Integration

## Overview

ClawGo ships MCP as a built-in runtime capability under `tools.mcp`. It is wired into configuration, runtime discovery, dynamic tool registration, and the WebUI:

- dedicated config schema under `tools.mcp`
- startup creates `MCPTool`
- remote MCP tools are discovered automatically
- discovered remote tools are registered as local ClawGo tools
- the WebUI has a dedicated MCP page
- the Gateway exposes an install endpoint for MCP servers

## Supported Scope

Based on `pkg/tools/mcp.go`, `pkg/config/validate.go`, and the recent README changes, the supported transports are:

- `stdio`
- `http`
- `streamable_http`
- `sse`

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
          "working_dir": "tools/context7",
          "permission": "workspace",
          "description": "Context7 MCP server",
          "package": "@upstash/context7-mcp"
        }
      }
    }
  }
}
```

Per-server fields:

- `enabled`
- `transport`
- `command`
- `args`
- `url`
- `env`
- `working_dir`
- `permission`
- `description`
- `package`

## Configuration Examples

### Example 1: Minimal `stdio` Setup

This matches the current `config.example.json` shape:

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
          "working_dir": "tools/context7",
          "permission": "workspace",
          "package": "@upstash/context7-mcp"
        }
      }
    }
  }
}
```

### Example 2: Pin A Resolved Binary Path

```json
{
  "enabled": true,
  "transport": "stdio",
  "command": "/usr/local/bin/context7-mcp",
  "args": [],
  "permission": "full",
  "working_dir": "/Users/example/project/tools/context7",
  "package": "@upstash/context7-mcp"
}
```

### Example 3: Use A Hosted MCP Endpoint

```json
{
  "enabled": true,
  "transport": "streamable_http",
  "url": "https://mcp.example.com",
  "description": "Hosted MCP server"
}
```

### Example 4: Pass Environment Variables

```json
{
  "enabled": true,
  "transport": "stdio",
  "command": "npx",
  "args": ["-y", "@scope/example-mcp"],
  "env": {
    "EXAMPLE_API_KEY": "YOUR_KEY"
  },
  "permission": "workspace",
  "working_dir": "tools/example"
}
```

## Validation Rules

The validator checks:

- `tools.mcp.request_timeout_sec > 0`
- server names are non-empty
- `transport` must be one of `stdio`, `http`, `streamable_http`, or `sse`
- `stdio` servers must define `command`
- `http`, `streamable_http`, and `sse` servers must define `url`
- `permission` must be `workspace` or `full`
- with `permission = workspace`, `working_dir` may be relative but must resolve inside the workspace
- with `permission = full`, `working_dir` may be absolute

## What Happens At Startup

In `pkg/agent/loop.go`, when `cfg.Tools.MCP.Enabled` is true, ClawGo:

1. creates `MCPTool`
2. registers the `mcp` bridge tool
3. creates a discovery context from `request_timeout_sec`
4. calls `DiscoverTools()`
5. registers each discovered remote tool as a local tool

That means the model can either call the generic `mcp` bridge or directly call discovered tools.

For `http` transport, initialization now also sends `notifications/initialized` as a real MCP notification without an `id`. This improves compatibility with stricter MCP servers.

## Dynamic Tool Naming

Discovered remote tools are mapped into:

```text
mcp__<server>__<tool>
```

Examples:

```text
mcp__context7__resolve_library_id
mcp__context7__query_docs
```

The names are sanitized, so spaces, dots, and other special characters are converted into safe identifiers.

## MCP Bridge Tool Examples

### List Configured Servers

```json
{
  "action": "list_servers"
}
```

### List Remote Tools

```json
{
  "action": "list_tools",
  "server": "context7"
}
```

### Call A Remote Tool

```json
{
  "action": "call_tool",
  "server": "context7",
  "tool": "resolve-library-id",
  "arguments": {
    "libraryName": "vitepress",
    "query": "How do I configure locales?"
  }
}
```

### Read A Resource

```json
{
  "action": "read_resource",
  "server": "context7",
  "uri": "file:///absolute/path/to/file"
}
```

### Get A Prompt

```json
{
  "action": "get_prompt",
  "server": "context7",
  "prompt": "default",
  "arguments": {
    "topic": "vitepress locales"
  }
}
```

## Dynamic Tool Usage Examples

After discovery, remote MCP tools can be called like normal local tools.

Example generated tool:

```text
mcp__context7__resolve_library_id
```

Arguments:

```json
{
  "libraryName": "vitepress",
  "query": "How do I configure locales?"
}
```

Another example:

```text
mcp__context7__query_docs
```

```json
{
  "libraryId": "/vitejs/vitepress",
  "query": "How do I add multiple locales?"
}
```

## WebUI Support

There is a dedicated page in:

- `webui/src/pages/MCP.tsx`

It supports:

- adding and removing MCP servers
- switching between `stdio`, `http`, `streamable_http`, and `sse`
- editing `command`, `args`, `url`, `working_dir`, `permission`, and `package`
- checking whether the configured command exists
- suggesting install commands based on the package
- installing MCP servers with `npm`, `uv`, or `bun`
- viewing discovered `mcp__<server>__<tool>` tools

## Related WebUI APIs

### `GET /webui/api/tools`

Returns all tools and also:

- `mcp_tools`
- `mcp_server_checks`

The first list is for discovered remote tools. The second contains command-check results for configured servers.

### `POST /webui/api/mcp/install`

Example input:

```json
{
  "package": "@upstash/context7-mcp",
  "installer": "npm"
}
```

The server:

1. ensures the required runtime is available
2. runs the installer
3. resolves the exposed binary
4. returns `bin_name` and `bin_path`

Supported installers:

- `npm`
- `uv`
- `bun`

## Recommended Usage

### For Fast Trials

- use `stdio + npx`
- keep `permission` as `workspace`
- use a workspace-relative `working_dir`

### For Stable Deployments

- pin `command` to the resolved binary path
- use `http` or `streamable_http` for hosted MCP services
- only use `permission: "full"` when you really need it

## Current Limits

There are still a few practical boundaries:

- dynamic tool discovery happens during startup
- changing an MCP server requires saving config and going through the follow-up discovery path
- transport support is broader now, but compatibility still depends on the target MCP server implementation

## Suggested Reading Order

1. This page
2. [Configuration](/en/guide/configuration)
3. [WebUI Console](/en/guide/webui)
4. [WebUI API Reference](/en/reference/webui-api)
