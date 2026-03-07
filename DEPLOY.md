# Cloudflare Pages 部署

这个项目已经配置好了 Cloudflare Pages 的直接上传部署。

注意：

- 当前方案使用的是 `Direct Upload`
- 按 Cloudflare 官方说明，Direct Upload 项目之后不能直接切换成 Git Integration；如果未来要改成 Git Integration，需要新建一个 Pages 项目

## 约定

- Pages 项目名：`clawgo`
- 生产地址：`https://clawgo.pages.dev`
- 自定义域名：`https://clawgo.dev`

## 本地首次部署

先登录 Cloudflare：

```bash
npx wrangler login
```

然后构建并部署：

```bash
npm run cf:deploy
```

如果 Cloudflare 上还没有 `clawgo` 这个 Pages 项目，`wrangler pages deploy` 会引导你创建项目并确认生产分支。

预览部署：

```bash
npm run cf:preview
```

## GitHub Actions 自动部署

仓库里已经提供：

```text
.github/workflows/deploy-pages.yml
```

需要在 GitHub 仓库 Secrets 中设置：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

权限建议：

- `Account`
- `Cloudflare Pages`
- `Edit`

触发规则：

- `main` 分支 push：部署生产环境
- `pull_request`：部署 preview 分支别名

## 绑定 `clawgo.dev`

`clawgo.dev` 是 apex 域名，不是子域名。Cloudflare Pages 官方要求：

- 这个 apex 域名必须已经作为 zone 托管在同一个 Cloudflare 账户下
- 域名的 nameserver 需要切到 Cloudflare

绑定步骤：

1. 进入 Cloudflare `Workers & Pages`
2. 选择 `clawgo` 项目
3. 打开 `Custom domains`
4. 选择 `Set up a domain`
5. 输入 `clawgo.dev`
6. 按提示完成

如果 `clawgo.dev` 已经在 Cloudflare 管理，Pages 会自动帮你创建需要的 DNS 记录。

## 常用命令

本地开发：

```bash
npm run docs:dev
```

本地构建：

```bash
npm run docs:build
```

部署生产：

```bash
npm run cf:deploy
```

部署预览：

```bash
npm run cf:preview
```
