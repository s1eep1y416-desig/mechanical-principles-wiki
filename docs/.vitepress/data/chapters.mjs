// 《机械原理》（孙桓、葛文杰主编，第九版，高等教育出版社）教材结构数据。
// 页码为教材正文页码（非 PDF 页）。section 中带 star 的为教材 * 号拓展小节。

export const book = {
  title: '机械原理',
  edition: '第九版',
  authors: '孙桓、葛文杰',
  publisher: '高等教育出版社',
  year: 2021,
  pages: 406,
  note: '“十二五”普通高等教育本科国家级规划教材'
}

export const parts = [
  {
    id: 'I',
    name: '机构分析基础',
    en: 'FOUNDATIONS OF MECHANISM ANALYSIS',
    desc: '从机构组成、运动确定性出发，建立运动分析、力分析与动力分析的统一语言。',
    range: '013–174',
    chapters: [
      {
        n: 2,
        slug: '02-structural-analysis',
        title: '机构的结构分析',
        en: 'Structural Analysis of Mechanisms',
        pages: '013–054',
        lead: '一台机器由哪些构件、哪些运动副组成？给定一个机构，怎样判断它有没有确定的运动？这一章给出机构分析的“语法”。',
        tags: ['运动副', '自由度', '组成原理'],
        sections: [
          { no: '2.1', title: '机构结构分析的内容及目的', page: '13' },
          { no: '2.2', title: '机构的组成、分类及其简图表达', page: '13' },
          { no: '2.3', title: '机构的运动确定性及其自由度分析', page: '25' },
          { no: '2.4', title: '平面机构的组成原理、结构分类及分析与综合', page: '33' },
          { no: '2.5', title: '机构的变换原理及其结构创新设计', page: '36' },
          { no: '2.6', title: '机构结构的型综合及其合理设计', page: '43', star: true }
        ]
      },
      {
        n: 3,
        slug: '03-kinematic-analysis',
        title: '平面机构的运动分析',
        en: 'Kinematic Analysis of Planar Mechanisms',
        pages: '055–081',
        lead: '已知构件尺寸与原动件运动，怎样求出各点的位移、速度和加速度？图解法给出几何直觉，解析法给出可编程的精确解。',
        tags: ['瞬心', '速度图', '加速度'],
        sections: [
          { no: '3.1', title: '机构运动分析的任务、目的和方法', page: '55' },
          { no: '3.2', title: '用图解法作机构的运动分析', page: '55' },
          { no: '3.3', title: '用解析法作机构的运动分析', page: '66' }
        ]
      },
      {
        n: 4,
        slug: '04-static-force-analysis',
        title: '平面机构的静力分析',
        en: 'Static Force Analysis of Planar Mechanisms',
        pages: '082–112',
        lead: '不计惯性力时，机构各构件受什么力？摩擦怎样改变力的传递？效率与自锁又如何从受力分析中长出来？',
        tags: ['摩擦', '效率', '自锁'],
        sections: [
          { no: '4.1', title: '机构力分析的任务、目的和方法', page: '82' },
          { no: '4.2', title: '运动副中摩擦力的确定', page: '84' },
          { no: '4.3', title: '考虑摩擦时机构的静力分析', page: '89' },
          { no: '4.4', title: '机械的效率及其计算与提高措施', page: '95' },
          { no: '4.5', title: '机械的自锁及其自锁条件的确定与应用', page: '99' }
        ]
      },
      {
        n: 5,
        slug: '05-dynamic-analysis',
        title: '机械的动力分析',
        en: 'Dynamic Force Analysis of Machinery',
        pages: '113–126',
        lead: '高速机械不能忽略惯性力。把惯性力当作“假想外力”加进静力平衡，就得到动态静力分析。',
        tags: ['惯性力', '动态静力', '平衡力'],
        sections: [
          { no: '5.1', title: '机械动力分析的任务、目的及方法', page: '113' },
          { no: '5.2', title: '构件惯性力的确定', page: '114' },
          { no: '5.3', title: '不考虑摩擦时机构的动态静力分析', page: '116' }
        ]
      },
      {
        n: 6,
        slug: '06-balancing',
        title: '机械的平衡',
        en: 'Balancing of Machinery',
        pages: '127–145',
        lead: '转子为什么会在高速下剧烈振动？怎样用配重把惯性力系“抵消”掉？这一章讨论刚性转子和平面机构的平衡。',
        tags: ['静平衡', '动平衡', '惯性力'],
        sections: [
          { no: '6.1', title: '机械平衡的目的及内容', page: '127' },
          { no: '6.2', title: '刚性转子的平衡', page: '128' },
          { no: '6.3', title: '平面机构的平衡', page: '137' }
        ]
      },
      {
        n: 7,
        slug: '07-operation-speed-fluctuation',
        title: '机械的运转及其速度波动的调节',
        en: 'Operation of Machinery and Regulation of Speed Fluctuation',
        pages: '146–174',
        lead: '机器在启动、稳定运转和停车中各经历什么？周期性速度波动从哪里来，飞轮为什么能“削峰填谷”？',
        tags: ['等效动力学模型', '飞轮', '速度波动'],
        sections: [
          { no: '7.1', title: '概述', page: '146' },
          { no: '7.2', title: '机械的运动方程式', page: '148' },
          { no: '7.3', title: '机械运动方程式的求解', page: '153' },
          { no: '7.4', title: '稳定运转状态下机械的周期性速度波动及其调节', page: '157' },
          { no: '7.5', title: '机械的非周期性速度波动及其调节', page: '164' },
          { no: '7.6', title: '考虑构件弹性时的机械运转简介', page: '166', star: true }
        ]
      }
    ]
  },
  {
    id: 'II',
    name: '常用机构设计',
    en: 'DESIGN OF COMMON MECHANISMS',
    desc: '连杆、凸轮、齿轮、轮系与间歇机构：从运动方案到尺度综合。',
    range: '175–364',
    chapters: [
      {
        n: 8,
        slug: '08-linkages',
        title: '连杆机构及其设计',
        en: 'Linkage Mechanisms and Their Design',
        pages: '175–227',
        lead: '四杆机构能实现丰富的运动规律，但尺寸稍变，运动性能就会改变。关键是抓住整转副、急回特性、压力角与死点。',
        tags: ['四杆机构', '格拉肖夫', '急回特性'],
        sections: [
          { no: '8.1', title: '连杆机构及其传动特点', page: '175' },
          { no: '8.2', title: '平面四杆机构的基本类型及应用', page: '177' },
          { no: '8.3', title: '平面四杆机构的基本特性', page: '185' },
          { no: '8.4', title: '平面四杆机构的设计', page: '194' },
          { no: '8.5', title: '平面多杆机构', page: '211' },
          { no: '8.6', title: '空间连杆机构简介', page: '217' }
        ]
      },
      {
        n: 9,
        slug: '09-cams',
        title: '凸轮机构及其设计',
        en: 'Cam Mechanisms and Their Design',
        pages: '228–257',
        lead: '凸轮可以把连续的转动变成任意预期的往复运动。设计分两步：先选推杆运动规律，再反求凸轮轮廓。',
        tags: ['运动规律', '轮廓设计', '压力角'],
        sections: [
          { no: '9.1', title: '凸轮机构的应用、分类和选型', page: '228' },
          { no: '9.2', title: '推杆的运动规律', page: '232' },
          { no: '9.3', title: '凸轮轮廓曲线的设计', page: '240' },
          { no: '9.4', title: '凸轮机构基本尺寸的确定', page: '245' },
          { no: '9.5', title: '凸轮机构的分析与反求设计', page: '250' },
          { no: '9.6', title: '高速凸轮机构简介', page: '252', star: true }
        ]
      },
      {
        n: 10,
        slug: '10-gears',
        title: '齿轮机构及其设计',
        en: 'Gear Mechanisms and Their Design',
        pages: '258–303',
        lead: '渐开线为什么能保证定传动比？模数、压力角、齿数怎样决定齿轮的几何与啮合质量？这一章是机械原理计算量最大的一章。',
        tags: ['渐开线', '啮合', '变位'],
        sections: [
          { no: '10.1', title: '齿轮机构的类型及传动特点', page: '258' },
          { no: '10.2', title: '齿轮的齿廓曲线', page: '261' },
          { no: '10.3', title: '渐开线直齿圆柱齿轮传动', page: '262' },
          { no: '10.4', title: '渐开线变位齿轮简介', page: '276' },
          { no: '10.5', title: '斜齿圆柱齿轮传动', page: '280' },
          { no: '10.6', title: '直齿锥齿轮传动', page: '286' },
          { no: '10.7', title: '蜗轮蜗杆传动', page: '289' },
          { no: '10.8', title: '其他齿轮传动简介', page: '292', star: true },
          { no: '10.9', title: '齿轮机构动力学简介', page: '298', star: true }
        ]
      },
      {
        n: 11,
        slug: '11-gear-trains',
        title: '齿轮系及其设计',
        en: 'Gear Trains and Their Design',
        pages: '304–328',
        lead: '多个齿轮组合起来，可以得到很大的传动比、换向、分路与合成运动。周转轮系的关键是“转化机构”。',
        tags: ['定轴轮系', '周转轮系', '传动比'],
        sections: [
          { no: '11.1', title: '齿轮系及其分类', page: '304' },
          { no: '11.2', title: '轮系的传动比', page: '306' },
          { no: '11.3', title: '轮系的功用及创新应用', page: '310' },
          { no: '11.4', title: '行星轮系的效率', page: '315' },
          { no: '11.5', title: '行星轮系的选型及设计的基本知识', page: '316' },
          { no: '11.6', title: '其他新型行星齿轮传动简介', page: '321', star: true }
        ]
      },
      {
        n: 12,
        slug: '12-other-mechanisms',
        title: '其他常用机构',
        en: 'Other Common Mechanisms',
        pages: '329–364',
        lead: '间歇运动、摩擦传动、挠性件传动、组合机构与广义机构——当连杆、凸轮、齿轮都不够用时，工程师还有哪些选择？',
        tags: ['棘轮', '槽轮', '组合机构'],
        sections: [
          { no: '12.1', title: '间歇运动机构', page: '329' },
          { no: '12.2', title: '摩擦轮传动机构', page: '344' },
          { no: '12.3', title: '带有挠性元件的传动机构', page: '348', star: true },
          { no: '12.4', title: '组合机构', page: '354' },
          { no: '12.5', title: '含有某些特殊元器件的广义机构', page: '359' }
        ]
      }
    ]
  },
  {
    id: 'III',
    name: '机械方案设计',
    en: 'MECHANICAL SCHEME DESIGN',
    desc: '从功能分解到机构选型、组合与评价，再到机器人机构的设计。',
    range: '365–406',
    chapters: [
      {
        n: 13,
        slug: '13-scheme-design',
        title: '机械系统的方案设计',
        en: 'Scheme Design of Mechanical Systems',
        pages: '365–386',
        lead: '方案设计决定了一台机器的“骨架”。这一章把功能分解、运动设计、机构选型与组合串成一条可操作的设计流程。',
        tags: ['功能分析', '机构选型', '方案评价'],
        sections: [
          { no: '13.1', title: '概述', page: '365' },
          { no: '13.2', title: '机械工作原理的拟定', page: '366' },
          { no: '13.3', title: '执行构件的运动设计和原动机的选择', page: '368' },
          { no: '13.4', title: '机构的选型和变异', page: '372' },
          { no: '13.5', title: '机构的组合', page: '375' },
          { no: '13.6', title: '机械系统方案的拟定', page: '378' },
          { no: '13.7', title: '机械系统方案拟定举例', page: '381', star: true },
          { no: '13.8', title: '现代机械系统发展情况简介', page: '385', star: true }
        ]
      },
      {
        n: 14,
        slug: '14-robots',
        title: '机器人机构及其设计',
        en: 'Robot Mechanisms and Their Design',
        pages: '387–406',
        lead: '机器人是机械原理的集大成应用：开链、闭链、自由度、位姿、速度雅可比、静力与动力学都在这里汇合。',
        tags: ['开链', '位姿', '雅可比'],
        sections: [
          { no: '14.1', title: '概述', page: '387' },
          { no: '14.2', title: '机器人的分类及主要技术指标', page: '387' },
          { no: '14.3', title: '机器人机构的运动分析', page: '391' },
          { no: '14.4', title: '机器人机构的静力和动力分析', page: '398' },
          { no: '14.5', title: '机器人机构的设计', page: '399' }
        ]
      }
    ]
  }
]

const intro = {
  n: 1,
  slug: '01-introduction',
  title: '绪论',
  en: 'Introduction',
  pages: '001–012',
  lead: '先回答三个问题：机械原理研究什么、为什么学、怎样学。这一章给出全书的地图与工程语境。',
  tags: ['研究对象', '课程地图', '学习方法'],
  sections: [
    { no: '1.1', title: '本书研究的对象及内容', page: '1' },
    { no: '1.2', title: '学习机械原理课程的目的', page: '7' },
    { no: '1.3', title: '机械原理课程的学习方法', page: '8' },
    { no: '1.4', title: '机械原理学科发展现状简介', page: '9' }
  ]
}

export const chapters = [
  intro,
  ...parts.flatMap((p) =>
    p.chapters.map((c) => ({ ...c, part: p.id, partName: p.name }))
  )
]

export const chapterBySlug = Object.fromEntries(chapters.map((c) => [c.slug, c]))

export const stats = {
  chapters: chapters.length,
  parts: parts.length,
  sections: chapters.reduce((n, c) => n + c.sections.filter((s) => !s.star).length, 0),
  formulas: 56
}

export const partOf = (n) => {
  if (n === 1) return { id: '0', name: '绪论', en: 'INTRODUCTION' }
  return parts.find((p) => p.chapters.some((c) => c.n === n))
}
