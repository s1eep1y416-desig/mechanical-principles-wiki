import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3'

const pagesBase = process.env.GITHUB_ACTIONS ? '/mechanical-principles-wiki/' : '/'

const chapter = (text: string, link: string, sections: string[]) => ({
  text,
  link,
  collapsed: true,
  items: sections.map(section => ({ text: section, link: `${link}#${section.replace(/\s+/g, '-').toLowerCase()}` }))
})

export default defineConfig({
  base: pagesBase,
  lang: 'zh-CN',
  title: '机械原理知识库',
  description: '以《机械原理》第九版为目录骨架的机构学学习网站',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: `${pagesBase}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#0b63ce' }]
  ],
  markdown: {
    config(md) {
      md.use(mathjax3)
    }
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '机械原理知识库',
    outline: { level: [2, 3], label: '本页目录' },
    search: { provider: 'local' },
    nav: [
      { text: '开始学习', link: '/guide/' },
      { text: '十四章', link: '/chapters/' },
      { text: '公式速查', link: '/appendix/formulas' },
      { text: '教材目录', link: '/guide/textbook' }
    ],
    sidebar: [
      {
        text: '开始',
        items: [
          { text: '学习指南', link: '/guide/' },
          { text: '教材目录与页码', link: '/guide/textbook' },
          { text: '学习路线', link: '/guide/roadmap' },
          { text: '符号与约定', link: '/guide/conventions' }
        ]
      },
      {
        text: '绪论',
        items: [chapter('01 绪论', '/chapters/01-introduction', ['四个基本概念', '课程主线', '与机械设计的衔接'])]
      },
      {
        text: '第一篇 · 机构分析基础',
        collapsed: false,
        items: [
          chapter('02 机构的结构分析', '/chapters/02-structural-analysis', ['机构简图', '平面机构自由度', '三类高频陷阱', '组成原理']),
          chapter('03 平面机构的运动分析', '/chapters/03-kinematic-analysis', ['分析链', '相对速度方程', '相对加速度方程', '解析法']),
          chapter('04 平面机构的静力分析', '/chapters/04-static-force-analysis', ['从隔离体图开始', '运动副中的摩擦', '机械效率', '自锁']),
          chapter('05 机械的动力分析', '/chapters/05-dynamic-analysis', ['达朗贝尔原理', '一般平面运动构件', '分析流程']),
          chapter('06 机械的平衡', '/chapters/06-balancing', ['刚性转子的静平衡', '刚性转子的动平衡', '平面机构平衡']),
          chapter('07 机械运转与速度波动', '/chapters/07-speed-fluctuation', ['机械运转的三个阶段', '等效动力模型', '周期性速度波动与飞轮', '非周期性速度波动'])
        ]
      },
      {
        text: '第二篇 · 常用机构设计',
        collapsed: false,
        items: [
          chapter('08 连杆机构及其设计', '/chapters/08-linkage-design', ['四杆机构的基本类型', 'grashof-条件', '传力与运动特性', '设计问题']),
          chapter('09 凸轮机构及其设计', '/chapters/09-cam-design', ['从动件运动规律', '反转法设计轮廓', '压力角与基圆']),
          chapter('10 齿轮机构及其设计', '/chapters/10-gear-mechanisms', ['齿廓啮合基本定律', '渐开线性质', '基本参数与正确啮合', '连续传动、根切与变位', '拓展机构']),
          chapter('11 齿轮系及其设计', '/chapters/11-gear-trains', ['定轴轮系', '周转轮系', '复合轮系', '功能与设计']),
          chapter('12 其他常用机构', '/chapters/12-other-mechanisms', ['间歇运动机构', '摩擦轮机构', '挠性元件传动', '组合机构'])
        ]
      },
      {
        text: '第三篇 · 机械方案设计',
        collapsed: false,
        items: [
          chapter('13 机械系统的方案设计', '/chapters/13-system-concept-design', ['方案形成链', '1-明确功能', '2-设计输出运动', '3-机构选型与变异', '4-组合与协调', '5-多指标评价']),
          chapter('14 机器人机构及其设计', '/chapters/14-robot-mechanisms', ['构型与自由度', '正运动学', '逆运动学与多解', '速度与静力关系', '设计关注点'])
        ]
      },
      {
        text: '附录',
        items: [
          { text: '核心公式速查', link: '/appendix/formulas' },
          { text: '常见错误', link: '/appendix/common-errors' }
        ]
      }
    ],
    docFooter: { prev: '上一章', next: '下一章' },
    footer: {
      message: '依据《机械原理》第九版目录整理 · 内容为独立学习笔记',
      copyright: 'Mechanical Principles Wiki'
    }
  }
})
