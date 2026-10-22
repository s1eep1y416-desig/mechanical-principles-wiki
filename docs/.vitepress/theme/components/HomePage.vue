<script setup lang="ts">
import { withBase } from 'vitepress'

const parts = [
  {
    id: 'I', name: '机构分析基础', en: 'ANALYSIS', desc: '先看清机构怎样组成、怎样运动、力从哪里来。',
    chapters: [
      ['02', '机构的结构分析', '自由度 · 组成原理', '02-structural-analysis'],
      ['03', '平面机构的运动分析', '速度 · 加速度', '03-kinematic-analysis'],
      ['04', '平面机构的静力分析', '摩擦 · 自锁 · 效率', '04-static-force-analysis'],
      ['05', '机械的动力分析', '惯性力 · 动静法', '05-dynamic-analysis'],
      ['06', '机械的平衡', '转子 · 平面机构', '06-balancing'],
      ['07', '机械运转与速度波动', '等效量 · 飞轮', '07-speed-fluctuation']
    ]
  },
  {
    id: 'II', name: '常用机构设计', en: 'MECHANISMS', desc: '把运动规律落实为连杆、凸轮、齿轮和组合机构。',
    chapters: [
      ['08', '连杆机构及其设计', '四杆机构 · 综合', '08-linkage-design'],
      ['09', '凸轮机构及其设计', '运动规律 · 轮廓', '09-cam-design'],
      ['10', '齿轮机构及其设计', '渐开线 · 变位', '10-gear-mechanisms'],
      ['11', '齿轮系及其设计', '周转轮系 · 功能', '11-gear-trains'],
      ['12', '其他常用机构', '间歇 · 挠性 · 组合', '12-other-mechanisms']
    ]
  },
  {
    id: 'III', name: '机械方案设计', en: 'SYNTHESIS', desc: '从功能与运动需求出发，完成机构选型与系统方案。',
    chapters: [
      ['13', '机械系统的方案设计', '功能 · 选型 · 组合', '13-system-concept-design'],
      ['14', '机器人机构及其设计', '位姿 · 雅可比 · 构型', '14-robot-mechanisms']
    ]
  }
]

const routes = [
  { tag: '路线 A · 第一次学习', title: '沿分析链逐步建立模型', desc: '先掌握自由度，再学习运动、受力与动力学，最后进入机构设计。', steps: ['自由度', '速度加速度', '受力', '机构设计'], link: '/guide/roadmap#系统学习' },
  { tag: '路线 B · 计算题复习', title: '从核心公式反查条件', desc: '公式旁同时记录对象、正负号、参考系和适用条件，避免只会代数。', steps: ['自由度', '齿轮比', '飞轮', '平衡'], link: '/appendix/formulas' },
  { tag: '路线 C · 机构创新', title: '从任务回到运动方案', desc: '先定义输出运动，再选择、变异和组合机构，最后核对动力性能。', steps: ['功能', '运动', '机构', '评价'], link: '/chapters/13-system-concept-design' }
]

function openSearch() {
  document.querySelector<HTMLElement>('.DocSearch-Button')?.click()
}
</script>

<template>
  <div class="home">
    <section class="home-hero principle-hero">
      <div class="home-hero__grid" aria-hidden="true" />
      <div class="home-hero__copy">
        <div class="home-hero__eyebrow"><span class="pulse" />MECHANICAL PRINCIPLES · KNOWLEDGE BASE</div>
        <h1>把机械原理，<br /><span>学成一套分析方法。</span></h1>
        <p class="home-hero__lead">以《机械原理》第九版三篇十四章为骨架，把“组成—运动—受力—设计”串成可以检索、推导和复习的知识地图。</p>
        <div class="home-hero__actions">
          <a class="btn btn--primary" :href="withBase('/guide/')">开始学习 <span>→</span></a>
          <button class="btn btn--ghost" @click="openSearch">搜索知识库 <kbd>⌘ K</kbd></button>
        </div>
        <dl class="home-hero__stats">
          <div><dt>14</dt><dd>章 · 教材主线</dd></div>
          <div><dt>3</dt><dd>篇 · 分析到综合</dd></div>
          <div><dt>415</dt><dd>页 · 扫描教材</dd></div>
          <div><dt>75</dt><dd>节 · 教材小节</dd></div>
        </dl>
      </div>

      <div class="blueprint linkage-blueprint">
        <div class="blueprint__head"><span>FIG. 00 — FOUR-BAR LINKAGE</span><span>1 DOF · CRANK INPUT</span></div>
        <svg class="linkage" viewBox="0 0 560 390" role="img" aria-label="曲柄摇杆机构原理图">
          <defs><pattern id="bp-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="currentColor" opacity=".08" /></pattern></defs>
          <rect width="560" height="390" fill="url(#bp-grid)" />
          <path class="ground" d="M85 296H475M115 296v20m330-20v20" />
          <path class="bar input" d="M120 290L210 205" />
          <path class="bar coupler" d="M210 205L390 170" />
          <path class="bar output" d="M390 170L445 290" />
          <circle class="joint fixed" cx="120" cy="290" r="13" /><circle class="joint" cx="210" cy="205" r="11" />
          <circle class="joint" cx="390" cy="170" r="11" /><circle class="joint fixed" cx="445" cy="290" r="13" />
          <path class="motion" d="M82 245a58 58 0 0 1 70-67" /><path class="motion" d="M420 135a72 72 0 0 1 53 54" />
          <text x="87" y="338">机架</text><text x="145" y="229">曲柄</text><text x="275" y="174">连杆</text><text x="414" y="220">摇杆</text>
          <text x="76" y="157">ω₁</text><text x="478" y="186">ψ</text>
        </svg>
        <div class="blueprint__summary"><span>平面四杆机构</span><strong>F = 3n − 2P<sub>L</sub> − P<sub>H</sub> = 1</strong><p>一个原动件给定后，各构件运动随之确定。</p></div>
        <div class="blueprint__foot"><span>INPUT → OUTPUT</span><span>REVOLUTE PAIRS</span><span>MOTION TRANSFORMATION</span></div>
      </div>
      <div class="home-hero__ticker" aria-hidden="true"><span>MOBILITY</span><i/><span>KINEMATICS</span><i/><span>FORCE</span><i/><span>BALANCE</span><i/><span>SYNTHESIS</span></div>
    </section>

    <section class="home-section">
      <div class="section-head"><div><span class="section-eyebrow">START HERE</span><h2>选择一条学习路线</h2></div><p>同一套内容，可以按课程顺序、计算专题或方案设计来读。</p></div>
      <div class="route-grid">
        <article v-for="route in routes" :key="route.title" class="route-card">
          <div class="route-card__tag">{{ route.tag }}</div><h3>{{ route.title }}</h3><p>{{ route.desc }}</p>
          <div class="route-card__steps"><span v-for="(step, i) in route.steps" :key="step">{{ step }}<i v-if="i < route.steps.length - 1">→</i></span></div>
          <a :href="withBase(route.link)" class="route-card__link">进入路线 <span>→</span></a>
        </article>
      </div>
    </section>

    <section class="home-section">
      <div class="section-head section-head--tight"><div><span class="section-eyebrow">KNOWLEDGE MAP</span><h2>三篇，十四章，一张地图</h2></div><p>绪论之外，课程从分析基础走向机构设计，再走向系统方案。</p></div>
      <div class="map">
        <div v-for="part in parts" :key="part.id" class="map-part">
          <div class="map-part__meta"><span class="map-part__roman">{{ part.id }}</span><div><h3>{{ part.name }}</h3><span>{{ part.en }}</span></div><p>{{ part.desc }}</p></div>
          <div class="map-part__chapters"><a v-for="ch in part.chapters" :key="ch[0]" :href="withBase(`/chapters/${ch[3]}`)"><b>{{ ch[0] }}</b><span><strong>{{ ch[1] }}</strong><small>{{ ch[2] }}</small></span><i>↗</i></a></div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home { width: 100%; overflow: hidden; background: var(--vp-c-bg); }
.home-hero { position: relative; display: grid; grid-template-columns: minmax(0,1.05fr) minmax(420px,.95fr); gap: 48px; min-height: calc(100vh - var(--vp-nav-height)); padding: 76px max(5vw,40px) 92px; align-items: center; border-bottom: 1px solid var(--vp-c-divider); }
.home-hero__grid { position: absolute; inset: 0; pointer-events: none; opacity: .42; background-image: linear-gradient(var(--vp-c-divider) 1px,transparent 1px),linear-gradient(90deg,var(--vp-c-divider) 1px,transparent 1px); background-size: 48px 48px; mask-image: linear-gradient(to bottom,#000 0,transparent 86%); }
.home-hero__copy,.blueprint { position: relative; z-index: 1; }
.home-hero__eyebrow,.section-eyebrow { display: flex; align-items: center; gap: 9px; color: var(--vp-c-brand-1); font: 700 10px var(--vp-font-family-mono); letter-spacing: .14em; }
.pulse { width: 7px; height: 7px; border-radius: 50%; background: #39a078; box-shadow: 0 0 0 5px rgba(57,160,120,.12); }
.home-hero h1 { margin: 20px 0 18px; border: 0; color: var(--vp-c-text-1); font-size: clamp(40px,5vw,72px); line-height: 1.06; letter-spacing: -.055em; }
.home-hero h1 span { color: var(--vp-c-brand-1); }
.home-hero__lead { max-width: 680px; margin: 0; color: var(--vp-c-text-2); font-size: 16px; line-height: 1.9; }
.home-hero__actions { display: flex; gap: 10px; margin-top: 30px; }
.btn { display: inline-flex; min-height: 44px; align-items: center; justify-content: center; gap: 10px; padding: 0 18px; border: 1px solid var(--vp-c-divider); border-radius: 8px; color: var(--vp-c-text-1); background: var(--vp-c-bg); font-weight: 650; font-size: 13px; cursor: pointer; }
.btn--primary { border-color: var(--vp-c-brand-1); color: #fff; background: var(--vp-c-brand-1); }
.btn--ghost kbd { padding: 2px 6px; border: 1px solid var(--vp-c-divider); border-radius: 4px; color: var(--vp-c-text-3); background: var(--vp-c-bg-soft); font-size: 10px; }
.home-hero__stats { display: grid; grid-template-columns: repeat(4,1fr); margin: 42px 0 0; padding-top: 22px; border-top: 1px solid var(--vp-c-divider); }
.home-hero__stats div { min-width: 0; padding: 0 14px; border-left: 1px solid var(--vp-c-divider); }
.home-hero__stats div:first-child { padding-left: 0; border-left: 0; }
.home-hero__stats dt { color: var(--vp-c-text-1); font: 700 25px var(--vp-font-family-mono); }
.home-hero__stats dd { margin: 4px 0 0; color: var(--vp-c-text-3); font-size: 10px; white-space: nowrap; }
.blueprint { overflow: hidden; border: 1px solid color-mix(in srgb,var(--vp-c-brand-1) 45%,var(--vp-c-divider)); border-radius: 13px; background: color-mix(in srgb,var(--vp-c-bg) 92%,var(--vp-c-brand-soft)); box-shadow: 0 28px 70px rgba(12,35,68,.12); }
.blueprint__head,.blueprint__foot { display: flex; justify-content: space-between; gap: 12px; padding: 11px 14px; color: var(--vp-c-text-3); font: 9px var(--vp-font-family-mono); letter-spacing: .08em; }
.blueprint__head { border-bottom: 1px solid var(--vp-c-divider); }
.blueprint__foot { border-top: 1px solid var(--vp-c-divider); }
.blueprint__drawing { padding: 10px; }
.blueprint__summary { padding: 16px 18px; border-top: 1px solid var(--vp-c-divider); }
.blueprint__summary > span { display: block; color: var(--vp-c-brand-1); font-size: 11px; }
.blueprint__summary strong { display: block; margin: 5px 0; color: var(--vp-c-text-1); font-family: var(--vp-font-family-mono); }
.blueprint__summary p { margin: 0; color: var(--vp-c-text-3); font-size: 11px; }
.home-hero__ticker { position: absolute; z-index: 1; right: 0; bottom: 0; left: 0; display: flex; gap: 18px; align-items: center; overflow: hidden; padding: 11px max(5vw,40px); border-top: 1px solid var(--vp-c-divider); color: var(--vp-c-text-3); font: 8px var(--vp-font-family-mono); letter-spacing: .14em; white-space: nowrap; }
.home-hero__ticker i { width: 3px; height: 3px; border-radius: 50%; background: var(--vp-c-brand-1); }
.home-section { max-width: 1260px; margin: 0 auto; padding: 76px 36px; }
.home-section + .home-section { border-top: 1px solid var(--vp-c-divider); }
.section-head { display: flex; justify-content: space-between; gap: 50px; align-items: end; margin-bottom: 30px; }
.section-head h2 { margin: 10px 0 0; border: 0; font-size: 31px; letter-spacing: -.03em; }
.section-head > p { max-width: 430px; margin: 0; color: var(--vp-c-text-3); font-size: 13px; line-height: 1.7; }
.route-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
.route-card { position: relative; display: flex; min-height: 260px; flex-direction: column; padding: 24px; border: 1px solid var(--vp-c-divider); border-radius: 11px; background: var(--vp-c-bg); transition: .2s ease; }
.route-card:hover { transform: translateY(-3px); border-color: var(--vp-c-brand-1); box-shadow: 0 16px 36px rgba(14,33,61,.08); }
.route-card__tag { color: var(--vp-c-brand-1); font: 700 10px var(--vp-font-family-mono); }
.route-card h3 { margin: 22px 0 8px; font-size: 18px; }
.route-card > p { margin: 0; color: var(--vp-c-text-2); font-size: 12px; line-height: 1.7; }
.route-card__steps { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 18px; color: var(--vp-c-text-3); font-size: 10px; }
.route-card__steps i { margin-left: 6px; font-style: normal; color: var(--vp-c-brand-1); }
.route-card__link { margin-top: auto; padding-top: 20px; color: var(--vp-c-text-1); font-size: 12px; font-weight: 650; }
.map { border-top: 1px solid var(--vp-c-divider); }
.map-part { display: grid; grid-template-columns: minmax(260px,.7fr) 1.3fr; gap: 44px; padding: 32px 0; border-bottom: 1px solid var(--vp-c-divider); }
.map-part__meta { display: grid; grid-template-columns: 34px 1fr; align-content: start; }
.map-part__roman { color: var(--vp-c-brand-1); font: 700 13px var(--vp-font-family-mono); }
.map-part__meta h3 { margin: 0; font-size: 19px; }
.map-part__meta div > span { color: var(--vp-c-text-3); font: 8px var(--vp-font-family-mono); letter-spacing: .12em; }
.map-part__meta p { grid-column: 2; margin: 12px 0 0; color: var(--vp-c-text-3); font-size: 11px; line-height: 1.65; }
.map-part__chapters { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; }
.map-part__chapters a { display: grid; grid-template-columns: 28px 1fr 16px; gap: 10px; align-items: center; padding: 12px; border: 1px solid var(--vp-c-divider); border-radius: 7px; color: inherit; background: var(--vp-c-bg); }
.map-part__chapters a:hover { border-color: var(--vp-c-brand-1); }
.map-part__chapters b { color: var(--vp-c-brand-1); font: 700 11px var(--vp-font-family-mono); }
.map-part__chapters strong,.map-part__chapters small { display: block; }
.map-part__chapters strong { font-size: 12px; }
.map-part__chapters small { margin-top: 2px; color: var(--vp-c-text-3); font-size: 9px; }
.map-part__chapters i { color: var(--vp-c-text-3); font-style: normal; }
.linkage { width: 100%; color: var(--vp-c-brand-1); }
.linkage .ground, .linkage .bar { fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; }
.linkage .ground { stroke-width: 2; opacity: .55; }
.linkage .bar { stroke-width: 12; }
.linkage .input { stroke: #eb7b32; }
.linkage .coupler { stroke: #2f7fd7; }
.linkage .output { stroke: #38a078; }
.linkage .joint { fill: var(--vp-c-bg); stroke: currentColor; stroke-width: 4; }
.linkage .fixed { fill: var(--vp-c-brand-1); stroke: var(--vp-c-bg); }
.linkage .motion { fill: none; stroke: #eb7b32; stroke-width: 3; stroke-dasharray: 7 6; }
.linkage text { fill: var(--vp-c-text-2); font: 13px var(--vp-font-family-mono); }
.principle-hero .blueprint__summary strong { font-size: 17px; }
@media (prefers-reduced-motion: no-preference) { .linkage .input { animation: linkage-pulse 2.8s ease-in-out infinite; } }
@keyframes linkage-pulse { 50% { filter: drop-shadow(0 0 7px rgba(235,123,50,.55)); } }
@media (max-width: 980px) { .home-hero { grid-template-columns: 1fr; padding-top: 54px; } .blueprint { max-width: 700px; } .route-grid { grid-template-columns: 1fr; } .route-card { min-height: 210px; } }
@media (max-width: 720px) { .home-hero { gap: 30px; padding: 42px 20px 82px; } .home-hero h1 { font-size: 41px; } .home-hero__actions { align-items: stretch; flex-direction: column; } .home-hero__stats { grid-template-columns: repeat(2,1fr); gap: 16px 0; } .home-hero__stats div:nth-child(3) { padding-left: 0; border-left: 0; } .blueprint__foot span:nth-child(2) { display:none; } .home-section { padding: 54px 20px; } .section-head { align-items: start; flex-direction: column; gap: 10px; } .map-part { grid-template-columns: 1fr; gap: 20px; } .map-part__chapters { grid-template-columns: 1fr; } }
</style>
