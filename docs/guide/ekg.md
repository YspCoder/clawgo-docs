# EKG 使用篇

## 当前状态

这页主要给历史版本读者做迁移说明。

当前这轮 `clawgo` 默认公开接口已经不再把 EKG 作为标准 WebUI/API 模块对外暴露。旧版文档里出现过的这些入口，当前默认服务面里都不应再当作可直接使用的能力：

- `/api/ekg_stats`
- Dashboard EKG 摘要卡片
- 独立 EKG 页面

## 现在应该看什么

如果你的目标是观察当前运行时健康，优先看这些仍然保留的能力：

- [运维与 API](/guide/operations)
- [WebUI 控制台](/guide/webui)
- [运行时、存储与恢复](/guide/runtime-storage)
- `clawgo status`
- `/api/logs/recent`
- `/api/logs/live`
- `/api/provider/runtime`

这些接口已经覆盖当前版本最核心的观测面：

- provider 健康和 cooldown 状态
- 近期日志与实时日志流
- session、memory、skills、cron 的运行痕迹

## 如果你维护的是旧部署

如果你本地还保留了历史 EKG 数据文件或私有扩展路由，可以把这页当成“旧功能已下线”的标记。

更稳妥的迁移方式是：

1. 先确认你当前运行的 `clawgo` 二进制版本
2. 对照 [WebUI API 参考](/reference/webui-api) 中列出的默认注册路由
3. 把巡检脚本迁移到 `status`、`logs`、`provider runtime` 这些当前仍保留的能力
