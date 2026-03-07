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

## Configuration Examples

### Example 1: Minimal Context7 Setup With `npx`

This is the simplest practical setup and matches the shape used in `config.example.json`:

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
          "description": "Context7 MCP server",
          "package": "@upstash/context7-mcp"
        }
      }
    }
  }
}
```

### Example 2: Pin A Resolved Binary Path

After installing from the WebUI or from the shell, you may want to pin the resolved executable path instead of relying on `npx`:

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
          "command": "/usr/local/bin/context7-mcp",
          "args": [],
          "env": {},
          "working_dir": "/absolute/path/to/project",
          "description": "Context7 MCP server",
          "package": "@upstash/context7-mcp"
        }
      }
    }
  }
}
```

### Example 3: Pass Environment Variables To An MCP Server

If the MCP server needs API keys or other configuration, use `env`:

```json
{
  "tools": {
    "mcp": {
      "enabled": true,
      "request_timeout_sec": 20,
      "servers": {
        "example": {
          "enabled": true,
          "transport": "stdio",
          "command": "npx",
          "args": ["-y", "@scope/example-mcp"],
          "env": {
            "EXAMPLE_API_KEY": "YOUR_KEY"
          },
          "working_dir": "/absolute/path/to/project",
          "description": "Example MCP server",
          "package": "@scope/example-mcp"
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

The codebase also has tests showing sanitized names such as:

```text
mcp__helper__echo
mcp__context7_server__resolve_library_id
```

That matters when a server name or remote tool name contains spaces, dots, or other non-identifier characters.

## MCP Bridge Tool Examples

### Example: List Configured MCP Servers

Using the generic `mcp` bridge tool:

```json
{
  "action": "list_servers"
}
```

### Example: List Remote Tools From A Server

```json
{
  "action": "list_tools",
  "server": "context7"
}
```

### Example: Call A Remote MCP Tool Through The Bridge

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

### Example: Read A Resource

```json
{
  "action": "read_resource",
  "server": "context7",
  "uri": "file:///absolute/path/to/file"
}
```

### Example: Get A Prompt

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

## Dynamic Tool Usage Examples

After discovery, a remote MCP tool is registered as a normal local tool with a generated name.

For example, if Context7 exposes `resolve-library-id`, ClawGo may register:

```text
mcp__context7__resolve_library_id
```

You can then call it like a normal tool using its own input schema:

```json
{
  "libraryName": "vitepress",
  "query": "How do I configure locales?"
}
```

Likewise, a discovered docs query tool may look like:

```text
mcp__context7__query_docs
```

Example arguments:

```json
{
  "libraryId": "/vitejs/vitepress",
  "query": "How do I add multiple locales?"
}
```

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

### Option 3: Start With The Bridge Tool, Then Move To Dynamic Tools

A practical adoption path is:

1. configure one MCP server
2. use `mcp` with `list_tools` to confirm the remote capability surface
3. restart or reload into a state where discovered tools are available
4. switch your agent prompts or workflows to the discovered `mcp__<server>__<tool>` names

That keeps debugging simple at the beginning and makes later tool usage more natural.

## Current Limits

Based on the current implementation:

- only `stdio` is supported
- tool discovery happens at startup
- new or modified MCP servers require save + rediscovery flow
- server processes are created per request/client lifecycle, not as one shared long-lived pool

## Troubleshooting

### No MCP Tools Are Discovered

Check:

- `tools.mcp.enabled` is `true`
- the target server has `enabled: true`
- `command` is valid
- `working_dir` is absolute if provided
- the server process can actually start from the host environment

### The Server Starts But Calls Fail

Check:

- required environment variables in `env`
- package-specific setup for the MCP server
- `request_timeout_sec` if the server is slow to initialize

### The MCP Page Shows No Remote Tools

The WebUI MCP page reads discovered tools from:

- `GET /webui/api/tools`

If `mcp_tools` is empty, discovery likely failed earlier in runtime startup.
