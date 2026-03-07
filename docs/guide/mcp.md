# MCP 集成

## 概览

ClawGo 现在已经内置了对 MCP 的接入能力，位置在 `tools.mcp`。按当前代码实现，它不是一个“外部插件说明”，而是运行时的一等能力：

- 配置层有独立 schema：`tools.mcp`
- 启动时会创建 `MCPTool`
- 会自动发现远端 MCP tools
- 已发现的远端工具会注册成 ClawGo 本地工具
- WebUI 里有独立的 MCP 管理页面
- Gateway 还提供了 MCP 包安装接口

## 当前支持范围

根据 `pkg/tools/mcp.go` 和 README，当前支持的是 `stdio` 型 MCP server。

支持的桥接动作包括：

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
          "working_dir": "/absolute/path/to/project",
          "description": "Example MCP server",
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
- `servers.<name>.transport`: 当前仅支持 `stdio`
- `servers.<name>.command`: 启动命令
- `servers.<name>.args`: 命令参数
- `servers.<name>.env`: 环境变量覆盖
- `servers.<name>.working_dir`: 工作目录
- `servers.<name>.description`: 描述
- `servers.<name>.package`: 用于 WebUI 安装提示的 npm 包名

## 校验规则

`pkg/config/validate.go` 中的 MCP 校验会检查：

- `tools.mcp.request_timeout_sec > 0`
- server 名不能是空字符串
- 启用的 server 必须有 `command`
- `transport` 必须是 `stdio`
- `working_dir` 如果填写，必须是绝对路径

## 启动时发生了什么

在 `pkg/agent/loop.go` 中，如果 `cfg.Tools.MCP.Enabled` 为真，ClawGo 会：

1. 创建 `MCPTool`
2. 先把 `mcp` 桥接工具本身注册进工具表
3. 用 `request_timeout_sec` 建一个 discovery context
4. 调 `DiscoverTools()`
5. 把发现到的每个远端工具动态注册成本地工具

这意味着模型既可以直接使用通用的 `mcp` 桥接工具，也可以直接调用自动注册后的具体工具。

## 动态工具命名

发现到的远端工具会被映射成：

```text
mcp__<server>__<tool>
```

例如：

```text
mcp__context7__resolve_library_id
mcp__context7__query_docs
```

命名过程中会做 sanitize，避免远端工具名里带特殊字符。

## MCP 桥接工具

`mcp` 这个内置工具本身支持的参数结构大致是：

- `action`
- `server`
- `tool`
- `arguments`
- `uri`
- `prompt`

适用场景：

- 你想先列 server
- 你想列远端 tools/resources/prompts
- 你想按 server + tool 的形式手动调用

## WebUI 支持

前端已经有独立页面：

- `webui/src/pages/MCP.tsx`

它支持：

- 新增/删除 MCP server
- 编辑 `command`、`args`、`working_dir`、`package`
- 触发保存配置
- 查看已发现的 MCP tools
- 通过 npm 包名安装 MCP server 对应的命令行包

## WebUI 相关接口

### `GET /webui/api/tools`

返回全部工具，同时会额外返回：

- `mcp_tools`

用于 MCP 页面单独展示已发现的远端工具。

### `POST /webui/api/mcp/install`

入参：

```json
{
  "package": "@upstash/context7-mcp"
}
```

服务端行为：

1. 检查/准备 Node 运行环境
2. 执行 `npm i -g <package>`
3. 解析 npm 包暴露的 bin
4. 返回 `bin_name` 和 `bin_path`

这样 WebUI 可以自动把 `command` 写成解析出来的可执行文件路径。

## 推荐使用方式

### 方式一：直接用 `npx`

适合快速试用：

```json
{
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp"]
}
```

### 方式二：先在 WebUI 安装，再写入绝对路径

适合更稳定的生产环境：

- 在 MCP 页面点击安装
- 让系统解析出实际 `bin_path`
- 把 `command` 固定为解析出来的二进制路径

## 实际限制

按当前实现，MCP 支持仍有几个明确边界：

- 只支持 `stdio`
- 动态工具发现发生在启动时
- 新增/修改 MCP server 后，要经过配置保存和后续重新发现流程
- server 进程是按请求创建 client，不是长驻共享连接池

## 建议文档使用场景

如果你要给团队说明如何接入 MCP，建议阅读顺序是：

1. 本页
2. [配置说明](/guide/configuration)
3. [WebUI 控制台](/guide/webui)
4. [WebUI API 参考](/reference/webui-api)
