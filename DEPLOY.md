# Cloudflare Pages 部署

这个项目现在按 `Git integration` 方式准备，也就是：

- 代码推到 GitHub
- 在 Cloudflare Pages 控制台里关联这个 GitHub 仓库
- 由 Cloudflare 在线构建和发布

不再使用本地 `wrangler pages deploy`，也不再使用 GitHub Actions 代替 Pages 发布。

## 官方前提

按照 Cloudflare 官方文档：

- Git integration 会在你每次 push 到选定分支时自动构建和部署
- 如果要把 apex 域名绑定到 Pages，例如 `clawgo.dev`，这个域名必须已经托管在同一个 Cloudflare 账户下，并将 nameserver 指向 Cloudflare

## 推荐项目设置

建议在 Cloudflare Pages 控制台中这样配置：

- Framework preset: `None`
- Build command: `npm run docs:build`
- Build output directory: `docs/.vitepress/dist`
- Root directory: 留空
- Production branch: `main`

如果你把文档目录以后放进 monorepo 子目录，再单独设置 Root directory。

## 关联 GitHub 仓库

1. 把当前项目推到 GitHub
2. 打开 Cloudflare Dashboard
3. 进入 `Workers & Pages`
4. 选择 `Create application` 或 `Create Pages project`
5. 选择 `Pages` -> `Connect to Git`
6. 授权 Cloudflare 访问你的 GitHub 仓库
7. 选择这个仓库
8. 填入上面的构建配置
9. 完成首次部署

## 绑定 `clawgo.dev`

1. 在 Cloudflare 的 `Workers & Pages` 中打开这个 Pages 项目
2. 进入 `Custom domains`
3. 选择 `Set up a domain`
4. 输入 `clawgo.dev`
5. 按面板提示完成

如果 `clawgo.dev` 已经是 Cloudflare zone，Pages 通常会自动创建所需 DNS 记录。

## 预览部署

Git integration 模式下：

- `main` 通常对应生产环境
- 其他分支或 PR 可用于 preview deployment

你可以在 Pages 的 `Settings > Builds > Branch control` 中控制：

- 哪个分支是生产分支
- 哪些分支会自动触发 preview

## 本地命令

本地开发：

```bash
npm run docs:dev
```

本地构建：

```bash
npm run docs:build
```

本地预览：

```bash
npm run docs:preview
```

## 为什么移除了 wrangler 和 GitHub Actions

因为你现在明确要走 Cloudflare Pages 的在线 Git 关联部署。继续保留下面这些会让仓库职责混乱：

- `wrangler.toml`
- `wrangler pages deploy`
- GitHub Actions 里的 Pages 直传流程

现在仓库只保留 Cloudflare Pages 在线构建所需的最小配置。
