import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'ClawGo 文档',
  description: 'ClawGo 的完整使用与架构文档',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: '/clawgo-logo.svg',
    nav: [
      { text: '概念', link: '/concepts/' },
      { text: '使用', link: '/guide/' },
      { text: '参考', link: '/reference/' },
      { text: '运维开发', link: '/ops/' }
    ],
    sidebar: [
      {
        text: '开始',
        items: [
          { text: '首页', link: '/' },
          { text: '文档导览', link: '/guide/' },
          { text: '快速开始', link: '/guide/quick-start' }
        ]
      },
      {
        text: '概念篇',
        items: [
          { text: '概念总览', link: '/concepts/' },
          { text: '架构总览', link: '/guide/architecture' },
          { text: '运行时、存储与恢复', link: '/guide/runtime-storage' },
          { text: 'Subagent 与 Skills', link: '/guide/subagents-and-skills' }
        ]
      },
      {
        text: '使用篇',
        items: [
          { text: '使用导览', link: '/guide/' },
          { text: '快速开始', link: '/guide/quick-start' },
          { text: '配置说明', link: '/guide/configuration' },
          { text: 'CLI 命令', link: '/guide/cli' },
          { text: 'WebUI 控制台', link: '/guide/webui' },
          { text: '通道、Cron 与节点', link: '/guide/integrations' }
        ]
      },
      {
        text: '参考篇',
        items: [
          { text: '参考总览', link: '/reference/' },
          { text: '配置参考', link: '/reference/config-reference' },
          { text: 'WebUI API 参考', link: '/reference/webui-api' },
          { text: '工作区与持久化目录', link: '/reference/workspace-layout' }
        ]
      },
      {
        text: '运维与开发',
        items: [
          { text: '运维开发导览', link: '/ops/' },
          { text: '运维与 API', link: '/guide/operations' },
          { text: '开发与构建', link: '/guide/development' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/YspCoder/clawgo' }
    ],
    search: {
      provider: 'local'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      level: [2, 3],
      label: '本页目录'
    }
  }
})
