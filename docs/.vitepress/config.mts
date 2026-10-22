import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3'

const pagesBase = process.env.GITHUB_ACTIONS ? '/mechanical-principles-wiki/' : '/'

const chapter = (text: string, link: string, sections: string[]) => ({
  text,
  link,
  collapsed: true,
  items: sections.map(section => ({
    text: section,
    link: `${link}#${section.replace(/^(\d+)\.(\d+)/, '_$1-$2').replace(/\s+/g, '-').toLowerCase()}`
  }))
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
    logo: `${pagesBase}logo.svg`,
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
        items: [chapter('01 绪论', '/chapters/01-introduction', ['1.1 本书研究的对象及内容', '1.2 学习机械原理课程的目的', '1.3 机械原理课程的学习方法', '1.4 机械原理学科发展现状简介'])]
      },
      {
        text: '第一篇 · 机构分析基础',
        collapsed: false,
        items: [
          chapter('02 机构的结构分析', '/chapters/02-structural-analysis', ['2.1 机构结构分析的内容及目的', '2.2 机构的组成、分类及其简图表达', '2.3 机构的运动确定性及其自由度分析', '2.4 平面机构的组成原理、结构分类及分析与综合', '2.5 机构的变换原理及其结构创新设计', '2.6 机构结构的型综合及其合理设计']),
          chapter('03 平面机构的运动分析', '/chapters/03-kinematic-analysis', ['3.1 机构运动分析的任务、目的和方法', '3.2 用图解法作机构的运动分析', '3.3 用解析法作机构的运动分析']),
          chapter('04 平面机构的静力分析', '/chapters/04-static-force-analysis', ['4.1 机构力分析的任务、目的和方法', '4.2 运动副中摩擦力的确定', '4.3 考虑摩擦时机构的静力分析', '4.4 机械的效率及其计算与提高措施', '4.5 机械的自锁及其自锁条件的确定与应用']),
          chapter('05 机械的动力分析', '/chapters/05-dynamic-analysis', ['5.1 机械动力分析的任务、目的及方法', '5.2 构件惯性力的确定', '5.3 不考虑摩擦时机构的动态静力分析']),
          chapter('06 机械的平衡', '/chapters/06-balancing', ['6.1 机械平衡的目的及内容', '6.2 刚性转子的平衡', '6.3 平面机构的平衡']),
          chapter('07 机械运转与速度波动', '/chapters/07-speed-fluctuation', ['7.1 概述', '7.2 机械的运动方程式', '7.3 机械运动方程式的求解', '7.4 稳定运转状态下机械的周期性速度波动及其调节', '7.5 机械的非周期性速度波动及其调节', '7.6 考虑构件弹性时的机械运转简介'])
        ]
      },
      {
        text: '第二篇 · 常用机构设计',
        collapsed: false,
        items: [
          chapter('08 连杆机构及其设计', '/chapters/08-linkage-design', ['8.1 连杆机构及其传动特点', '8.2 平面四杆机构的基本类型及应用', '8.3 平面四杆机构的基本特性', '8.4 平面四杆机构的设计', '8.5 平面多杆机构', '8.6 空间连杆机构简介']),
          chapter('09 凸轮机构及其设计', '/chapters/09-cam-design', ['9.1 凸轮机构的应用、分类和选型', '9.2 推杆的运动规律', '9.3 凸轮轮廓曲线的设计', '9.4 凸轮机构基本尺寸的确定', '9.5 凸轮机构的分析与反求设计', '9.6 高速凸轮机构简介']),
          chapter('10 齿轮机构及其设计', '/chapters/10-gear-mechanisms', ['10.1 齿轮机构的类型及传动特点', '10.2 齿轮的齿廓曲线', '10.3 渐开线直齿圆柱齿轮传动', '10.4 渐开线变位齿轮简介', '10.5 斜齿圆柱齿轮传动', '10.6 直齿锥齿轮传动', '10.7 蜗轮蜗杆传动', '10.8 其他齿轮传动简介', '10.9 齿轮机构动力学简介']),
          chapter('11 齿轮系及其设计', '/chapters/11-gear-trains', ['11.1 齿轮系及其分类', '11.2 轮系的传动比', '11.3 轮系的功用及创新应用', '11.4 行星轮系的效率', '11.5 行星轮系的选型及设计的基本知识', '11.6 其他新型行星齿轮传动简介']),
          chapter('12 其他常用机构', '/chapters/12-other-mechanisms', ['12.1 间歇运动机构', '12.2 摩擦轮传动机构', '12.3 带有挠性元件的传动机构', '12.4 组合机构', '12.5 含有某些特殊元器件的广义机构'])
        ]
      },
      {
        text: '第三篇 · 机械方案设计',
        collapsed: false,
        items: [
          chapter('13 机械系统的方案设计', '/chapters/13-system-concept-design', ['13.1 概述', '13.2 机械工作原理的拟定', '13.3 执行构件的运动设计和原动机的选择', '13.4 机构的选型和变异', '13.5 机构的组合', '13.6 机械系统方案的拟定', '13.7 机械系统方案拟定举例', '13.8 现代机械系统发展情况简介']),
          chapter('14 机器人机构及其设计', '/chapters/14-robot-mechanisms', ['14.1 概述', '14.2 机器人的分类及主要技术指标', '14.3 机器人机构的运动分析', '14.4 机器人机构的静力和动力分析', '14.5 机器人机构的设计'])
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
