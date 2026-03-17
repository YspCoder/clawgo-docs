# Node P2P 历史示例说明

这页现在只保留给历史版本读者做迁移说明。

最近这轮 `clawgo` upstream 已经移除了：

- 节点运行面
- 节点 CLI
- 节点 API
- `gateway.nodes.*` 配置
- 旧版 Node P2P / relay / webrtc 默认路径

所以这份 E2E 流程不再适用于当前默认版本。

## 如果你仍在维护旧版节点 / P2P 部署

建议这样处理：

1. 锁定你自己的历史 tag 或 fork
2. 按那个版本源码维护专属运维文档
3. 不要把这份流程继续当作当前 upstream 的标准示例

## 当前版本建议看的示例

对当前 upstream，更合适的示例页是：

- [最小 Subagent 示例](/examples/minimal-world)
