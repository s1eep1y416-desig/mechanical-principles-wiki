<script setup lang="ts">
import { withBase } from 'vitepress'

const groups = [
  { roman: '0', name: '绪论', en: 'INTRODUCTION', desc: '课程对象、研究内容与学习方法。', chapters: [['01','绪论','机器、机构、构件与零件的边界。',['术语','课程地图'],'01-introduction']] },
  { roman: 'I', name: '机构分析基础', en: 'ANALYSIS', desc: '从结构、运动、力与动力性能认识机构。', chapters: [
    ['02','机构的结构分析','运动副、运动链、机构简图与自由度。',['自由度','机构简图'],'02-structural-analysis'],
    ['03','平面机构的运动分析','速度瞬心、相对运动和解析法。',['速度','加速度'],'03-kinematic-analysis'],
    ['04','平面机构的静力分析','考虑摩擦的受力、效率与自锁。',['摩擦','自锁'],'04-static-force-analysis'],
    ['05','机械的动力分析','惯性力、惯性力偶与动静法。',['惯性力','动静法'],'05-dynamic-analysis'],
    ['06','机械的平衡','刚性转子与平面机构的平衡。',['静平衡','动平衡'],'06-balancing'],
    ['07','机械运转与速度波动','等效动力模型、周期与非周期波动。',['飞轮','等效量'],'07-speed-fluctuation']
  ]},
  { roman: 'II', name: '常用机构设计', en: 'MECHANISMS', desc: '由运动要求选择并设计常用机构。', chapters: [
    ['08','连杆机构及其设计','四杆机构特性、演化与尺度综合。',['四杆机构','急回'],'08-linkage-design'],
    ['09','凸轮机构及其设计','从动件运动规律和轮廓设计。',['运动规律','压力角'],'09-cam-design'],
    ['10','齿轮机构及其设计','渐开线、正确啮合、根切与变位。',['渐开线','变位'],'10-gear-mechanisms'],
    ['11','齿轮系及其设计','定轴、周转与复合轮系传动比。',['周转轮系','Willis'],'11-gear-trains'],
    ['12','其他常用机构','间歇、摩擦、挠性与组合机构。',['棘轮','槽轮'],'12-other-mechanisms']
  ]},
  { roman: 'III', name: '机械方案设计', en: 'SYNTHESIS', desc: '从功能需求完成运动方案与机构系统。', chapters: [
    ['13','机械系统的方案设计','原理构思、机构选型、变异与组合。',['功能分解','方案评价'],'13-system-concept-design'],
    ['14','机器人机构及其设计','构型、位姿、速度、静力学与设计。',['位姿','雅可比'],'14-robot-mechanisms']
  ]}
]
</script>

<template>
  <div class="catalog">
    <section v-for="group in groups" :key="group.roman" class="catalog-group">
      <header class="catalog-group__head"><span class="catalog-group__roman">{{ group.roman }}</span><div><h2>{{ group.name }}</h2><span>{{ group.en }}</span></div><p>{{ group.desc }}</p></header>
      <div class="catalog-grid">
        <a v-for="ch in group.chapters" :key="ch[0]" :href="withBase(`/chapters/${ch[4]}`)" class="catalog-card">
          <div class="catalog-card__top"><span class="catalog-card__num">{{ ch[0] }}</span><span class="catalog-card__arrow">↗</span></div>
          <h3>{{ ch[1] }}</h3><p>{{ ch[2] }}</p><div class="catalog-card__tags"><span v-for="tag in ch[3]" :key="tag">{{ tag }}</span></div>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.catalog { margin: 10px 0 36px; }
.catalog-group { padding: 28px 0; border-top: 1px solid var(--vp-c-divider); }
.catalog-group:first-child { border-top: 0; }
.catalog-group__head { display: grid; grid-template-columns: 34px 170px 1fr; gap: 14px; align-items: baseline; margin-bottom: 16px; }
.catalog-group__roman, .catalog-card__num { color: var(--vp-c-brand-1); font: 700 13px var(--vp-font-family-mono); }
.catalog-group__head h2 { margin: 0; padding: 0; border: 0; font-size: 19px; }
.catalog-group__head div > span { color: var(--vp-c-text-3); font: 8px var(--vp-font-family-mono); letter-spacing: .12em; }
.catalog-group__head p { margin: 0; color: var(--vp-c-text-3); font-size: 12px; }
.catalog-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.catalog-card { display: block; padding: 18px; border: 1px solid var(--vp-c-divider); border-radius: 10px; color: inherit; background: var(--vp-c-bg); transition: .18s ease; }
.catalog-card:hover { transform: translateY(-2px); border-color: var(--vp-c-brand-1); box-shadow: 0 12px 28px rgba(16,35,63,.08); }
.catalog-card__top { display: flex; justify-content: space-between; }
.catalog-card__arrow { color: var(--vp-c-text-3); }
.catalog-card h3 { margin: 18px 0 7px; font-size: 16px; }
.catalog-card p { min-height: 38px; margin: 0 0 14px; color: var(--vp-c-text-2); font-size: 12px; line-height: 1.6; }
.catalog-card__tags { display: flex; gap: 6px; flex-wrap: wrap; }
.catalog-card__tags span { padding: 3px 7px; border-radius: 4px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-3); font-size: 10px; }
@media (max-width: 720px) { .catalog-group__head { grid-template-columns: 26px 1fr; } .catalog-group__head p { grid-column: 2; } .catalog-grid { grid-template-columns: 1fr; } }
</style>
