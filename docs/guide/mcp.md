# MCP 集成

## 概览

ClawGo 已经把 MCP 做成了内置运行时能力，入口在 `tools.mcp`。按当前实现，它不只是一个“外部插件说明”，而是完整接进了配置、运行时、动态工具注册和 WebUI：

- 配置层有独立 schema：`tools.mcp`
- 启动时会创建 `MCPTool`
- 会自动发现远端 MCP tools
- 发现结果会注册成 ClawGo 本地工具
- WebUI 有独立的 MCP 管理页面
- Gateway 提供 MCP server 安装接口

最近 WebUI 里的 MCP 管理流程也重做成了“server 卡片 + 模态编辑”：

- 主列表按 server 展示摘要卡片
- 新建和编辑都在弹窗里完成
- 保存时会直接写回 `/api/config`
- discovered tools 区域和 server 配置区分开显示
- 如果 `command` 缺失或命令不可用，会在卡片和弹窗里给出安装建议

`stdio` server 的安装辅助现在还能根据这些信息推断安装方式：

- `package`
- `installer`
- `command + args` 里的 `npx` / `uvx` / `bunx`

## 当前支持范围

根据 `pkg/tools/mcp.go`、`pkg/config/validate.go` 和最近的 README 变更，当前支持的 transport 包括：

- `stdio`
- `http`
- `streamable_http`
- `sse`

桥接动作包括：

- `list_servers`
- `list_tools`
- `call_tool`
- `list_resources`
- `read_resource`
- `list_prompts`
- `get_prompt`

## 配置结构

配置入口：

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

字段说明：

- `enabled`: 是否启用 MCP 总开关
- `request_timeout_sec`: MCP 请求超时
- `servers.<name>.enabled`: 单个 server 是否启用
- `servers.<name>.transport`: `stdio` / `http` / `streamable_http` / `sse`
- `servers.<name>.command`: `stdio` 模式下的启动命令
- `servers.<name>.args`: `stdio` 模式下的命令参数
- `servers.<name>.url`: `http` / `streamable_http` / `sse` 使用的 MCP endpoint
- `servers.<name>.env`: 环境变量覆盖
- `servers.<name>.working_dir`: 工作目录
- `servers.<name>.permission`: `workspace` 或 `full`
- `servers.<name>.description`: 描述
- `servers.<name>.package`: 供 WebUI 安装辅助使用的包名

## 配置示例

### 方式一：最小 `stdio` 配置

这也是 `config.example.json` 当前的写法：

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

### 方式二：固定二进制路径

适合安装完成后固定命令路径：

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

### 方式三：HTTP 类 transport

适合远端托管的 MCP server：

```json
{
  "enabled": true,
  "transport": "streamable_http",
  "url": "https://mcp.example.com",
  "description": "Hosted MCP server"
}
```

### 方式四：带环境变量的 `stdio` server

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

## 校验规则

`pkg/config/validate.go` 中会检查：

- `tools.mcp.request_timeout_sec > 0`
- server 名不能是空字符串
- `transport` 必须是 `stdio` / `http` / `streamable_http` / `sse`
- `stdio` 模式必须提供 `command`
- `http` / `streamable_http` / `sse` 必须提供 `url`
- `permission` 只能是 `workspace` 或 `full`
- `permission = workspace` 时，`working_dir` 可以写相对路径，但解析后必须仍在 workspace 下
- `permission = full` 时，`working_dir` 可以写绝对路径

## 启动时发生了什么

在 `pkg/agent/loop.go` 中，如果 `cfg.Tools.MCP.Enabled` 为真，ClawGo 会：

1. 创建 `MCPTool`
2. 先把 `mcp` 桥接工具注册进工具表
3. 用 `request_timeout_sec` 建一个 discovery context
4. 调 `DiscoverTools()`
5. 把发现到的每个远端工具动态注册成本地工具

这意味着模型既可以直接使用 `mcp` 桥接工具，也可以直接调用自动注册后的具体工具。

对 `http` transport 来说，初始化阶段现在也会显式发送 `notifications/initialized`，并按 MCP 规范作为 notification 发送，不带 `id`。这能提升和更严格 MCP server 的兼容性。

## 动态工具命名

发现到的远端工具会映射成：

```text
mcp__<server>__<tool>
```

例如：

```text
mcp__context7__resolve_library_id
mcp__context7__query_docs
```

命名过程中会做 sanitize，所以带空格、点号或特殊字符的 server/tool 名会被转成安全标识符。

## MCP 桥接工具示例

### 列出 server

```json
{
  "action": "list_servers"
}
```

### 列出远端工具

```json
{
  "action": "list_tools",
  "server": "context7"
}
```

### 调用远端工具

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

### 读取资源

```json
{
  "action": "read_resource",
  "server": "context7",
  "uri": "file:///absolute/path/to/file"
}
```

### 获取 prompt

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

## 动态工具调用示例

发现完成后，远端 MCP tool 会像普通本地工具一样可直接调用。

例如：

```text
mcp__context7__resolve_library_id
```

调用参数：

```json
{
  "libraryName": "vitepress",
  "query": "How do I configure locales?"
}
```

另一个典型例子：

```text
mcp__context7__query_docs
```

```json
{
  "libraryId": "/vitejs/vitepress",
  "query": "How do I add multiple locales?"
}
```

## WebUI 支持

前端有独立页面：

- `webui/src/pages/MCP.tsx`

它支持：

- 新增/删除 MCP server
- 在 `stdio` / `http` / `streamable_http` / `sse` 间切换 transport
- 编辑 `command`、`args`、`url`、`working_dir`、`permission`、`package`
- 对 `command` 做存在性检查
- 基于 package 给出建议安装命令
- 通过 `npm`、`uv`、`bun` 安装 MCP server
- 查看已发现的 `mcp__<server>__<tool>` 工具

## WebUI 相关接口

### `GET /api/tools`

返回全部工具，同时会额外返回：

- `mcp_tools`
- `mcp_server_checks`

前者用于展示发现到的远端工具，后者用于展示各 server 的命令检查状态。

### `POST /api/mcp/install`

入参示例：

```json
{
  "package": "@upstash/context7-mcp",
  "installer": "npm"
}
```

服务端会：

1. 检查/准备对应运行环境
2. 执行安装命令
3. 解析包暴露的 bin
4. 返回 `bin_name` 和 `bin_path`

`installer` 当前支持：

- `npm`
- `uv`
- `bun`

## 推荐使用方式

### 快速试用

- 用 `stdio + npx`
- `permission` 保持 `workspace`
- `working_dir` 使用 workspace 内相对路径

### 稳定部署

- 安装后固定 `command` 为解析出的二进制路径
- 对托管服务使用 `http` 或 `streamable_http`
- 只在确实需要时才用 `permission: "full"`

## 实际限制

按当前实现，仍有几个边界：

- 动态工具发现发生在启动期
- 修改 MCP server 后，需要重新保存配置并走后续发现流程
- transport 已扩展，但不同第三方 server 的兼容性仍取决于对方实现

## 建议阅读顺序

1. 本页
2. [配置说明](/guide/configuration)
3. [WebUI 控制台](/guide/webui)
4. [WebUI API 参考](/reference/webui-api)
