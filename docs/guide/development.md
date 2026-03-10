# 开发与构建

## 仓库结构

核心目录建议按下面理解：

- `cmd/clawgo`: CLI 与程序入口
- `pkg`: 核心业务实现
- `webui`: React 控制台
- `workspace`: 初始化时复制给用户的默认工作区模版
- `docs`: 主仓库自带的说明资源

最近 `workspace/skills` 里有一个重要变化：

- `spec-coding` 成为默认的复杂编码工作流技能

它的模板目录在：

```text
workspace/skills/spec-coding/templates
```

包含：

- `spec.md`
- `tasks.md`
- `checklist.md`

注意这些文件的真实落点不是 `clawgo` 仓库根目录，而是“当前被编码的项目根目录”。

## Go 构建

常用命令：

```bash
make build
make build-variants
make build-all
make build-all-variants
make build-linux-slim
make test
```

默认构建会把版本与构建时间写入二进制：

- `main.version`
- `main.buildTime`

## WebUI 构建

```bash
make build-webui
```

Makefile 会：

1. 在 `webui/` 下安装依赖
2. 执行前端 build
3. 生成 `webui/dist`

最近 WebUI 路由已经改成 `React.lazy + Suspense`，并在 Vite 构建配置里按依赖拆 chunk。当前手工拆分的重点包包括：

- `react-vendor`
- `motion`
- `icons`

这会影响你分析 bundle、排查首屏加载问题和嵌入式 WebUI 的静态文件结构。

## 嵌入式资源同步

ClawGo 发布时依赖 Go `embed` 打包 workspace 模版与 WebUI 静态资源。

相关目标：

```bash
make sync-embed-workspace
make sync-embed-workspace-base
make sync-embed-webui
make cleanup-embed-workspace
```

同步目标目录是：

```text
cmd/workspace
```

## 开发模式

```bash
make dev
```

Makefile 中默认开发参数会偏向：

- 使用本地 `config.json` 或 `~/.clawgo/config.json`
- 启动 `gateway run`
- 使用工作区和本地 WebUI 目录

## 发布打包

```bash
make package-all
```

会生成：

- 各平台 full / no-channel / 单通道变体压缩包
- `checksums.txt`

## install.sh 的发布约定

安装脚本默认从 GitHub Release 拉取：

- `clawgo-<os>-<arch>.tar.gz`
- `clawgo-<os>-<arch>-nochannels.tar.gz`
- `clawgo-<os>-<arch>-<channel>.tar.gz`

其中 `<channel>` 目前对应：

- `telegram`
- `discord`
- `feishu`
- `maixcam`
- `qq`
- `dingtalk`
- `whatsapp`

WebUI 已经内嵌在二进制里，所以 release 不再需要单独上传 `webui.tar.gz`。

## Channel-Specific Build Variants

最近 Makefile 和 release 流程新增了 channel-specific build variants。

关键目标：

- `make build-variants`
- `make build-all-variants`
- `make package-all`

含义：

- `full`：完整通道构建
- `none`：去掉所有通道，对应 `-nochannels`，但会额外带上 `with_tui`
- 单通道变体：只保留某一个 channel，其他 channel 通过 `omit_<channel>` build tags 被裁掉

这意味着当前 release 里的 no-channel 变体，不是“什么入口都没有”，而是更偏运维和 SSH 场景：

- 不包含外部消息通道
- 保留 `clawgo tui` 这个终端界面入口
- 适合本地调试、远端值班或只通过 Gateway/API 使用系统

安装脚本也已经支持：

```bash
./install.sh --variant telegram
```

## 测试

仓库中已有较多测试，主要覆盖：

- config 校验
- channels 去重
- provider/tool call 协议
- session planner
- subagent 配置与路由
- task watchdog
- shell timeout
- memory namespace

建议最少执行：

```bash
go test ./...
```

## Spec-Driven Coding

最近的 agent context 和 workspace prompt 已经把 spec-driven coding 接进主流程。

当请求被判断为“非 trivial 编码任务”时，运行时会优先围绕当前项目根目录维护：

- `spec.md`：范围、目标、决策、取舍
- `tasks.md`：当前任务拆解与进度
- `checklist.md`：最后的验证闸门

实现层面的关键点：

- 缺失文件可从 `workspace/skills/spec-coding/templates` 自动补齐
- context builder 会在这些文件存在时把它们视为活跃项目上下文的一部分
- 任务完成时会更新 `tasks.md` / `checklist.md`
- 任务返工或回归失败时会把任务重新打开，并重置 checklist

这意味着如果你在调试“为什么 agent 会自动生成 spec/task/checklist 文件”，应该先看：

- `pkg/agent/context.go`
- `pkg/agent/spec_coding.go`
- `workspace/skills/spec-coding/`

## 文档维护建议

如果后续你继续演进项目，建议文档优先跟着这些变更同步：

- `config.go` 的 schema 变化
- `cmd/clawgo` 新增命令
- `pkg/api/server.go` 新增 API
- `pkg/tools` 新增内置工具
- `webui/src/pages` 新增页面
