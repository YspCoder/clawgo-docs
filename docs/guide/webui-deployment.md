# WebUI 部署

## 当前推荐方式

按最新 README，当前推荐访问方式是 Gateway 直接提供 WebUI：

```text
http://<host>:<port>/?token=<gateway.token>
```

所以对大多数使用者来说，并不需要单独部署前端。

## 前端源码仓库

如果你确实要单独研究或自定义前端，源码仓库是：

- [YspCoder/clawgo-web](https://github.com/YspCoder/clawgo-web)

## 本地开发

```bash
git clone https://github.com/YspCoder/clawgo-web.git
cd clawgo-web
npm install
npm run dev
```

## 生产构建

```bash
npm run build
```

构建产物是：

```text
dist/
```

## 什么时候才需要单独部署

通常只有这些场景才值得单独拆开：

- 你要自己改前端样式或路由
- 你需要把前端挂到独立域名
- 你要做自定义反向代理或静态托管

否则直接用 Gateway 自带入口更简单，也更贴近当前文档主线。
