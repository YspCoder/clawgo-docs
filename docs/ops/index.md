# 运维开发导览

这一部分面向两类人：

- 负责部署、排障、巡检的使用者
- 需要改代码、构建、发布的开发者

## 建议阅读顺序

1. [运维与 API](/guide/operations)
2. [开发与构建](/guide/development)
3. [工作区与持久化目录](/reference/workspace-layout)
4. [WebUI API 参考](/reference/webui-api)

## 适合处理的问题

### 服务启动失败

先看：

- [运维与 API](/guide/operations)
- [工作区与持久化目录](/reference/workspace-layout)

### WebUI 或 Gateway 对接问题

先看：

- [WebUI 控制台](/guide/webui)
- [WebUI API 参考](/reference/webui-api)

### 想从源码构建和发布

先看：

- [开发与构建](/guide/development)

## 推荐排障动作

1. `clawgo config check`
2. `clawgo status`
3. 查看日志和 Task Audit
4. 检查 `workspace/memory` 下的审计文件
