import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'ClawGo 文档',
  description: 'ClawGo 的完整使用与架构文档',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/clawgo-logo.png' }]
  ],
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        logo: '/clawgo-logo.svg',
        nav: [
          { text: '概念', link: '/concepts/' },
          { text: '使用', link: '/guide/' },
          { text: '示例', link: '/examples/minimal-world' },
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
              { text: 'MCP 集成', link: '/guide/mcp' },
              { text: 'CLI 命令', link: '/guide/cli' },
              { text: 'WebUI 控制台', link: '/guide/webui' },
              { text: '通道使用篇', link: '/guide/channels' },
              { text: 'Cron 使用篇', link: '/guide/cron' },
              { text: 'EKG 使用篇', link: '/guide/ekg' },
              { text: '节点能力迁移说明', link: '/guide/nodes' }
            ]
          },
          {
            text: '示例',
            items: [
              { text: '最小 Subagent 示例', link: '/examples/minimal-world' },
              { text: 'Node P2P 历史示例说明', link: '/examples/node-p2p-e2e' }
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
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'ClawGo Docs',
      description: 'Comprehensive documentation for ClawGo',
      themeConfig: {
        logo: '/clawgo-logo.svg',
        nav: [
          { text: 'Concepts', link: '/en/concepts/' },
          { text: 'Guides', link: '/en/guide/' },
          { text: 'Examples', link: '/en/examples/minimal-world' },
          { text: 'Reference', link: '/en/reference/' },
          { text: 'Ops & Dev', link: '/en/ops/' }
        ],
        sidebar: [
          {
            text: 'Start',
            items: [
              { text: 'Home', link: '/en/' },
              { text: 'Guide Index', link: '/en/guide/' },
              { text: 'Quick Start', link: '/en/guide/quick-start' }
            ]
          },
          {
            text: 'Concepts',
            items: [
              { text: 'Concept Overview', link: '/en/concepts/' },
              { text: 'Architecture', link: '/en/guide/architecture' },
              { text: 'Runtime, Storage, and Recovery', link: '/en/guide/runtime-storage' },
              { text: 'Subagents and Skills', link: '/en/guide/subagents-and-skills' }
            ]
          },
          {
            text: 'Guides',
            items: [
              { text: 'Guide Index', link: '/en/guide/' },
              { text: 'Quick Start', link: '/en/guide/quick-start' },
              { text: 'Configuration', link: '/en/guide/configuration' },
              { text: 'MCP Integration', link: '/en/guide/mcp' },
              { text: 'CLI', link: '/en/guide/cli' },
              { text: 'WebUI Console', link: '/en/guide/webui' },
              { text: 'Channels Guide', link: '/en/guide/channels' },
              { text: 'Cron Guide', link: '/en/guide/cron' },
              { text: 'EKG Guide', link: '/en/guide/ekg' },
              { text: 'Node Migration Note', link: '/en/guide/nodes' }
            ]
          },
          {
            text: 'Examples',
            items: [
              { text: 'Minimal Subagent Example', link: '/en/examples/minimal-world' },
              { text: 'Node P2P Historical Note', link: '/en/examples/node-p2p-e2e' }
            ]
          },
          {
            text: 'Reference',
            items: [
              { text: 'Reference Index', link: '/en/reference/' },
              { text: 'Config Reference', link: '/en/reference/config-reference' },
              { text: 'WebUI API Reference', link: '/en/reference/webui-api' },
              { text: 'Workspace Layout', link: '/en/reference/workspace-layout' }
            ]
          },
          {
            text: 'Ops & Dev',
            items: [
              { text: 'Ops & Dev Index', link: '/en/ops/' },
              { text: 'Operations and API', link: '/en/guide/operations' },
              { text: 'Development and Build', link: '/en/guide/development' }
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
          prev: 'Previous',
          next: 'Next'
        },
        outline: {
          level: [2, 3],
          label: 'On This Page'
        }
      }
    }
  }
})
