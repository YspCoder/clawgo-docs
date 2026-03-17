# 节点能力迁移说明

## 当前状态

最近这轮 `clawgo` upstream 已经把旧版节点运行面从默认产品能力里移除，包括：

- `clawgo node` CLI
- `/nodes/register`
- `/nodes/heartbeat`
- `/api/nodes`
- `/api/node_dispatches*`
- `/api/node_artifacts*`
- `gateway.nodes.*`
- 旧版 Node P2P / relay / webrtc 文档口径

所以这页不再作为“当前功能指南”，而是保留成迁移说明。

## 现在应该关注什么

当前 upstream 默认公开模型更聚焦于：

- `main + local subagents`
- provider runtime
- sessions / memory / logs
- cron / skills / MCP

如果你是从旧版本升级上来，需要把节点执行面从日常操作、巡检脚本和 WebUI 预期里移除。

## 文档层面的变化

这一轮文档已经同步做了这些收口：

1. CLI 不再列 `node`
2. API 参考不再把节点接口写成默认公开面
3. 配置参考不再继续展开 `gateway.nodes.*`
4. Node P2P E2E 页面改成历史说明

## 如果你维护的是旧部署

如果你仍在维护保留节点/P2P 面的历史版本或私有 fork：

- 锁定你自己的版本
- 按那个版本源码维护专属文档
- 不要把那套节点/P2P 操作继续混写进当前 upstream 文档
