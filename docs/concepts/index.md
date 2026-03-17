# 概念总览

这一部分回答的是：ClawGo 当前到底是什么。

按最新 README 和配置结构，它更接近一个长期运行的 **Agent Runtime**，核心目标是：

- 让 `main` 和 `subagents` 分工执行
- 让内部协作流可视、可追踪、可恢复
- 让 prompt、工具、角色、provider、节点都能工程化管理

## 建议阅读顺序

1. [架构总览](/guide/architecture)
2. [运行时、存储与恢复](/guide/runtime-storage)
3. [Subagent 与 Skills](/guide/subagents-and-skills)
