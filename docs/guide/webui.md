# WebUI 控制台

## 当前定位

按最新 README，WebUI 当前主要用于：

- Dashboard 与 Agent 拓扑查看
- 日志、记忆、运行态检查
- OAuth 账号管理

它当前不应被理解成“完整 runtime 控制面”。

## 访问方式

当前推荐访问方式仍然是通过 Gateway：

```text
http://<host>:<port>/?token=<gateway.token>
```

这也是 clawgo 当前 README 中明确给出的默认入口。

## 页面重点

### Dashboard

用于看总体状态，包括：

- 版本
- provider 运行信息
- 近期运行概览

### Agent Topology

当前重点是：

- `main`
- 本地 subagents

用于理解“谁在协作、谁在执行”。

### Config

当前以查看和检查为主。

文档和 README 现在都把正式配置修改路径放回：

- `config.json`
- `AGENT.md`

而不是把 WebUI 当作唯一配置入口。

### Provider / OAuth

这是当前 WebUI 最明确、最稳定的管理面之一，主要管理：

- OAuth 登录
- 账号导入
- 账号刷新
- 账号删除
- provider runtime 状态

### Logs / Memory / Skills

这几页主要承担：

- 日志查看
- memory 文件检查
- skills 浏览与安装

## 当前最值得看的能力

如果你第一次打开 WebUI，建议先看：

1. Agent 拓扑
2. Provider OAuth / runtime
3. Logs
4. Memory

这几页最能反映当前 Agent Runtime 的真实状态。

## 前端仓库

前端源码仓库仍然是：

- [YspCoder/clawgo-web](https://github.com/YspCoder/clawgo-web)

但按当前 clawgo README，默认访问模型仍然是 Gateway 直接提供 WebUI。
