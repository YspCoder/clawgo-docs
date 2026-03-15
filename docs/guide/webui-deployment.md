# WebUI 部署

## 仓库与定位

独立部署的前端仓库是：

- [YspCoder/clawgo-web](https://github.com/YspCoder/clawgo-web)

它不再要求和 Gateway 静态资源放在一起，也不再依赖旧的 `/webui` 挂载路径。

## 本地开发

```bash
git clone https://github.com/YspCoder/clawgo-web.git
cd clawgo-web
npm install
npm run dev
```

常用命令：

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## 生产构建

```bash
npm install
npm run build
```

构建产物是：

```text
dist/
```

可以直接部署到静态站点平台，例如 Cloudflare Pages、Vercel、Netlify，或你自己的 Nginx。

## 登录与连接方式

最近的 `clawgo-web` 已经不再推荐 `?token=` 直链。

当前推荐流程是：

1. 打开 WebUI
2. 在登录页输入 Gateway 地址和 `gateway.token`
3. 前端用 `Authorization: Bearer <gateway.token>` 调用 `POST /api/auth/session`
4. Gateway 写入会话 cookie
5. 后续 `fetch('/api/*')` 和 websocket 连接统一带 cookie

这也是为什么跨域部署时更推荐 HTTPS。

## 前端保存了什么

前端会把这两项保存在浏览器本地：

- `clawgo.api_base_url`
- `clawgo.api_token`

对应意义：

- `api_base_url`：Gateway 的基础地址
- `api_token`：访问 Gateway 的 token

## API 地址格式

如果你在登录页里填：

```text
https://gateway.example.com
```

前端后续会把本地 `/api/*` 请求重写到：

```text
https://gateway.example.com/api/*
```

websocket 也会同步重写到：

- `wss://gateway.example.com/api/runtime`
- `wss://gateway.example.com/api/chat/live`
- `wss://gateway.example.com/api/logs/live`

## 最小联通检查

假设：

- WebUI 域名：`https://ui.example.com`
- Gateway 域名：`https://gateway.example.com`

先确保 Gateway 能正常返回：

```bash
curl -H 'Authorization: Bearer YOUR_GATEWAY_TOKEN' \
  https://gateway.example.com/api/version
```

再在 WebUI 登录页填写：

- API Address: `https://gateway.example.com`
- Token: `YOUR_GATEWAY_TOKEN`

登录成功后，前端应该至少能正常读取：

- `/api/version`
- `/api/config`
- `/api/runtime`

## 跨域要求

最近 Gateway 默认放开了通用 CORS，但要注意两点：

- origin 必须是合法的 `http/https`
- 跨域实时能力依赖 cookie，生产环境应使用 HTTPS

否则常见问题是：

- 登录成功但 websocket 建不起来
- 跨域 cookie 被浏览器丢弃

## 页面与 API 的最小映射

- Dashboard: `/api/runtime`、`/api/nodes`、`/api/world`
- Chat: `/api/chat`、`/api/chat/history`、`/api/chat/live`
- Config: `/api/config`、`/api/config?mode=normalized`
- Providers: `/api/provider/models`、`/api/provider/runtime`
- Logs: `/api/logs/live`、`/api/logs/recent`

## 常见部署方式

### 方式一：纯静态站点

适合：

- Cloudflare Pages
- Vercel
- Netlify

要求是前端能直连 Gateway。

### 方式二：前端域名 + 独立 Gateway 域名

例如：

- `https://clawgo.dev`
- `https://api.clawgo.dev`

这种方式最清晰，也最接近当前实现。

### 方式三：反向代理同域

你也可以把静态前端和 Gateway API 反代到同一域名下，例如：

- `/` -> WebUI 静态文件
- `/api/` -> Gateway

这样可以减少跨域 cookie 问题。

## 建议

- 开发环境先用登录页填写 `api_base_url` 和 token
- 生产环境尽量使用 HTTPS
- 如果跨域 websocket 不稳定，优先排查 cookie、origin 和反向代理头
