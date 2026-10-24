import { createMarkdownRenderer, defineConfig, disposeMdItInstance } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const pagesBase = process.env.GITHUB_ACTIONS ? '/mechanical-principles-wiki/' : '/'
const SITE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const sidebar = [
  {
    text: '开始之前',
    items: [
      { text: '图解与实验', link: '/labs/' },
      { text: '使用指南', link: '/guide/' },
      { text: '教材目录与页码', link: '/guide/textbook' },
      { text: '学习路线', link: '/guide/roadmap' },
      { text: '符号与约定', link: '/guide/conventions' },
      { text: '十四章总览', link: '/chapters/' }
    ]
  },
  {
    text: '绪论',
    collapsed: false,
    items: [{ text: '01 绪论', link: '/chapters/01-introduction' }]
  },
  {
    text: '第一篇 · 机构分析基础',
    collapsed: false,
    items: [
      { text: '02 机构的结构分析', link: '/chapters/02-structural-analysis' },
      { text: '03 平面机构的运动分析', link: '/chapters/03-kinematic-analysis' },
      { text: '04 平面机构的静力分析', link: '/chapters/04-static-force-analysis' },
      { text: '05 机械的动力分析', link: '/chapters/05-dynamic-analysis' },
      { text: '06 机械的平衡', link: '/chapters/06-balancing' },
      { text: '07 机械的运转及其速度波动的调节', link: '/chapters/07-operation-speed-fluctuation' }
    ]
  },
  {
    text: '第二篇 · 常用机构设计',
    collapsed: false,
    items: [
      { text: '08 连杆机构及其设计', link: '/chapters/08-linkages' },
      { text: '09 凸轮机构及其设计', link: '/chapters/09-cams' },
      { text: '10 齿轮机构及其设计', link: '/chapters/10-gears' },
      { text: '11 齿轮系及其设计', link: '/chapters/11-gear-trains' },
      { text: '12 其他常用机构', link: '/chapters/12-other-mechanisms' }
    ]
  },
  {
    text: '第三篇 · 机械方案设计',
    collapsed: false,
    items: [
      { text: '13 机械系统的方案设计', link: '/chapters/13-scheme-design' },
      { text: '14 机器人机构及其设计', link: '/chapters/14-robots' }
    ]
  },
  {
    text: '附录',
    collapsed: false,
    items: [
      { text: '核心公式速查', link: '/appendix/formulas' },
      { text: '常用机构选型速查', link: '/appendix/mechanisms' },
      { text: '单位、符号与换算', link: '/appendix/units' }
    ]
  }
]

// 根据正文标题自动生成侧栏子目录，避免正文与导航两处维护。
const navigationMarkdown = await createMarkdownRenderer(SITE_ROOT, {
  math: true,
  headers: { level: [2] }
}, pagesBase)
type Heading = { title: string; slug: string; children: Heading[] }
type NavItem = { text: string; link: string; collapsed?: boolean; items?: NavItem[] }

function pageSections(link: string) {
  const file = path.resolve(SITE_ROOT, `${link.slice(1)}.md`)
  if (!fs.existsSync(file)) return []
  const source = fs.readFileSync(file, 'utf8')
  const env: { path: string; headers?: Heading[] } = { path: file }
  navigationMarkdown.render(source, env)
  const toItem = (heading: Heading): NavItem => ({
    text: heading.title,
    link: `${link}#${heading.slug}`,
    ...(heading.children?.length ? { items: heading.children.map(toItem), collapsed: true } : {})
  })
  return (env.headers || []).map(toItem)
}

for (const group of sidebar as any[]) {
  for (const item of group.items ?? []) {
    if (typeof item.link === 'string' && /^\/chapters\//.test(item.link)) {
      const sections = pageSections(item.link)
      if (sections.length) {
        item.collapsed = true
        item.items = sections
      }
    }
  }
}

// Release the navigation renderer so the site renderer uses its own options/base.
disposeMdItInstance()

export default defineConfig({
  base: pagesBase,
  lang: 'zh-CN',
  title: '机械原理知识库',
  titleTemplate: ':title · 机械原理知识库',
  description:
    '以孙桓、葛文杰主编《机械原理》（第九版）十四章为骨架的开放学习笔记：机构分析、机构设计、公式图解与工程直觉。',
  cleanUrls: true,
  lastUpdated: false,
  appearance: 'dark',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${pagesBase}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#0f766e' }],
    [
      'script',
      {},
      `(function(){try{var b=localStorage.getItem('tmmwiki-bg');if(b==='white'||b==='black'){document.documentElement.setAttribute('data-bg',b);localStorage.setItem('vitepress-theme-appearance',b==='black'?'dark':'light');}}catch(e){}})()`
    ],
    ['meta', { name: 'author', content: '机械原理知识库' }],
    [
      'meta',
      {
        name: 'keywords',
        content: '机械原理, 孙桓, 葛文杰, 第九版, 西北工业大学, 知识库, 机构, 自由度, 凸轮, 齿轮, 轮系'
      }
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '机械原理知识库' }],
    [
      'meta',
      {
        property: 'og:description',
        content: '把厚厚的教材，读成一张可以检索的机构知识地图。'
      }
    ]
  ],
  markdown: {
    math: true,
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark-dimmed'
    }
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '机械原理知识库',
    nav: [
      { text: '图解与实验', link: '/labs/' },
      { text: '首页', link: '/' },
      { text: '学习指南', link: '/guide/' },
      { text: '十四章', link: '/chapters/' },
      { text: '公式速查', link: '/appendix/formulas' },
      { text: '关于', link: '/about' }
    ],
    sidebar,
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    lastUpdated: {
      text: '最近更新',
      formatOptions: { dateStyle: 'medium', timeStyle: 'short' }
    },
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
    langMenuLabel: '语言',
    externalLinkIcon: true,
    footer: {
      message:
        '以《机械原理》（第九版）的知识框架为参照，独立编写的学习笔记。教材文字与插图版权归原作者及出版社所有。',
      copyright: '仅供学习交流 · Theory of Machines and Mechanisms Wiki'
    },
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        translations: {
          button: {
            buttonText: '搜索知识库',
            buttonAriaLabel: '搜索知识库'
          },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除搜索',
            backButtonTitle: '返回',
            noResultsText: '没有找到相关内容',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '回车',
              navigateText: '切换',
              navigateUpKeyAriaLabel: '上箭头',
              navigateDownKeyAriaLabel: '下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: 'Esc'
            }
          }
        }
      }
    }
  }
})
