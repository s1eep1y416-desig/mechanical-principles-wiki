<script setup lang="ts">
import { solveFourbar } from '../utils/mechanics.mjs'
import { withBase } from 'vitepress'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { parts, chapters, stats, book } from '../../data/chapters.mjs'
import StudyProgress from './StudyProgress.vue'
import FormulaQuickSearch from './FormulaQuickSearch.vue'

type Point = { x: number; y: number }
type ChapterLite = { n: number; slug: string; title: string; pages: string; tags?: string[] }
type PartLite = {
  id: string
  name: string
  en: string
  desc: string
  range: string
  chapters: ChapterLite[]
}

const partList = parts as PartLite[]
const introChapter = (chapters as Array<{ n: number; slug: string; title: string; pages: string }>).find(
  (c) => c.n === 1
)

const counts = {
  chapters: stats.chapters,
  parts: stats.parts,
  formulas: stats.formulas,
  figures: 18
}

const routes = [
  {
    tag: '路线 A · 系统学习',
    title: '从分析基础，到机构设计',
    desc: '按三篇顺序读：先建立自由度、运动分析与力分析的共同语言，再进入连杆、凸轮、齿轮与轮系的尺度综合。',
    steps: ['自由度', '运动分析', '四杆/凸轮', '齿轮与轮系'],
    link: '/guide/roadmap',
    action: '查看完整路线',
    icon: 'map'
  },
  {
    tag: '路线 B · 考前复习',
    title: '从高频公式反查知识点',
    desc: '从自由度计算、渐开线几何、轮系传动比、凸轮轮廓等计算题最常考的五类问题切入，先看清适用条件再套公式。',
    steps: ['自由度', '齿轮几何', '轮系传动比', '凸轮设计'],
    link: '/appendix/formulas',
    action: '打开公式速查',
    icon: 'bolt'
  },
  {
    tag: '路线 C · 课程设计',
    title: '走一遍机构方案设计链',
    desc: '从功能分解与执行构件运动设计开始，依次完成机构选型、变异与组合、尺度综合和方案评价。',
    steps: ['功能分析', '机构选型', '尺度综合', '方案评价'],
    link: '/guide/roadmap#课程设计路线',
    action: '查看设计流程',
    icon: 'gear'
  }
]

/* ---------------------------------------------------------------- four-bar
   A small, real loop-closure solve for the hero drawing: crank AB rotates,
   coupler BC and rocker CD follow. No dependency, no canvas. */

const A: Point = { x: 170, y: 250 }
const D: Point = { x: 550, y: 250 }
const CRANK = 105
const COUPLER = 300
const ROCKER = 190

function solve(theta: number): { B: Point; C: Point } {
  const result = solveFourbar({a:CRANK,b:COUPLER,c:ROCKER,d:D.x-A.x},theta,A)
  return { B: result.A, C: result.B }
}

const staticPose = solve(1.15)
const pose = ref(staticPose)
const trace = (() => {
  const points: string[] = []
  for (let i = 0; i <= 160; i++) {
    const { C } = solve((i / 160) * Math.PI * 2)
    points.push(`${C.x.toFixed(1)},${C.y.toFixed(1)}`)
  }
  return points.join(' ')
})()

const fixedPivots = [A, D].map((p) => ({
  triangle: `M ${p.x - 11} ${p.y + 17} L ${p.x + 11} ${p.y + 17} L ${p.x} ${p.y} Z`,
  base: `M ${p.x - 17} ${p.y + 17} h34`,
  hatches: [-12, -2, 8]
    .map((dx) => `M ${p.x + dx} ${p.y + 17} l -6 8`)
    .join(' ')
}))

const motionArc = (() => {
  const r = 58
  const start = { x: A.x + r * Math.cos((-80 * Math.PI) / 180), y: A.y - r * Math.sin((-80 * Math.PI) / 180) }
  const end = { x: A.x + r * Math.cos((8 * Math.PI) / 180), y: A.y - r * Math.sin((8 * Math.PI) / 180) }
  return `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} A ${r} ${r} 0 0 0 ${end.x.toFixed(1)} ${end.y.toFixed(1)}`
})()

const liveAngles = computed(() => {
  const { B, C } = pose.value
  const theta = Math.atan2(A.y - B.y, B.x - A.x) * (180 / Math.PI)
  const psi = Math.atan2(C.y - D.y, C.x - D.x) * (180 / Math.PI)
  const norm = (v: number) => (v < 0 ? v + 360 : v)
  return { theta: Math.round(norm(theta)), psi: Math.round(Math.abs(psi)) }
})

let raf = 0
let last = 0
let theta = 1.15
let running = false

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function frame(ts: number) {
  if (!last) last = ts
  const dt = Math.min(80, ts - last)
  last = ts
  theta += dt * 0.00082
  pose.value = solve(theta)
  raf = requestAnimationFrame(frame)
}

function start() {
  if (running) return
  running = true
  last = 0
  raf = requestAnimationFrame(frame)
}

function stop() {
  running = false
  cancelAnimationFrame(raf)
}

function onVisibility() {
  if (document.hidden) stop()
  else if (!prefersReducedMotion() && window.innerWidth >= 1040) start()
}

onMounted(() => {
  if (prefersReducedMotion() || window.innerWidth < 1040) {
    pose.value = staticPose
    return
  }
  start()
  document.addEventListener('visibilitychange', onVisibility)
})

onUnmounted(() => {
  stop()
  document.removeEventListener('visibilitychange', onVisibility)
})

/* --------------------------------------------------------------- helpers */

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function chapterRange(part: PartLite) {
  const first = part.chapters[0]
  const lastChapter = part.chapters[part.chapters.length - 1]
  return `${pad(first.n)}–${pad(lastChapter.n)}`
}

function openSearch() {
  const button = document.querySelector<HTMLElement>('.DocSearch-Button')
  if (button) {
    button.click()
    return
  }
  const isMac = navigator.platform.toLowerCase().includes('mac')
  document.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: isMac,
      ctrlKey: !isMac,
      bubbles: true
    })
  )
}

const year = new Date().getFullYear()
</script>

<template>
  <div class="home">
    <!-- ============================================================ hero -->
    <section class="hero">
      <div class="hero__grid" aria-hidden="true" />
      <div class="hero__copy">
        <div class="hero__eyebrow">
          <span class="pulse" />
          THEORY OF MACHINES · KNOWLEDGE BASE
        </div>
        <h1>机构怎么动，<br /><span>先算清楚，再设计。</span></h1>
        <p class="hero__lead">
          以孙桓、葛文杰《机械原理》（第九版）三篇十四章为骨架：从自由度与运动分析，到连杆、凸轮、
          齿轮与轮系设计，再到机械系统方案与机器人机构。把公式、图示与工程直觉，整理成一张可检索的机构知识地图。
        </p>
        <div class="hero__actions">
          <a class="btn btn--primary" :href="withBase('/guide/')">
            开始学习
            <span>→</span>
          </a>
          <button class="btn btn--ghost" @click="openSearch">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            搜索知识库
            <kbd>⌘ K</kbd>
          </button>
        </div>
        <dl class="hero__stats">
          <div><dt>{{ counts.chapters }}</dt><dd>章 · 三篇骨架</dd></div>
          <div><dt>{{ counts.parts }}</dt><dd>篇 · 知识分区</dd></div>
          <div><dt>{{ counts.formulas }}</dt><dd>张 · 核心公式卡</dd></div>
          <div><dt>{{ counts.figures }}</dt><dd>张 · 机构图示</dd></div>
        </dl>
      </div>

      <div class="blueprint">
        <div class="blueprint__head">
          <span>FIG. 01 — FOUR-BAR LINKAGE</span>
          <span>CRANK-ROCKER</span>
        </div>

        <svg
          class="blueprint__svg"
          viewBox="0 0 720 420"
          role="img"
          aria-label="曲柄摇杆四杆机构运动示意：曲柄 AB 整周回转，摇杆 CD 往复摆动"
        >
          <defs>
            <marker
              id="bpArrow"
              markerWidth="7"
              markerHeight="7"
              refX="5"
              refY="3.5"
              orient="auto"
            >
              <path d="M0 0 L7 3.5 L0 7 Z" fill="rgba(94, 234, 212, 0.8)" />
            </marker>
          </defs>

          <!-- frame distance -->
          <path class="bp-dim" d="M 170 384 v 12 M 550 384 v 12 M 170 390 H 550" />
          <text x="360" y="382" text-anchor="middle" class="bp-label bp-label--dim">
            AD = 380
          </text>
          <path v-for="(pivot, i) in fixedPivots" :key="'fixed' + i" :d="pivot.triangle" class="bp-fixed" />
          <path v-for="(pivot, i) in fixedPivots" :key="'base' + i" :d="pivot.base" class="bp-ground" />
          <path v-for="(pivot, i) in fixedPivots" :key="'hatch' + i" :d="pivot.hatches" class="bp-hatch" />

          <!-- motion arc of the crank -->
          <path :d="motionArc" class="bp-arc" marker-end="url(#bpArrow)" />
          <text :x="A.x + 40" :y="A.y - 66" class="bp-label bp-label--accent">ω</text>

          <!-- path traced by joint C -->
          <polyline :points="trace" class="bp-trace" />

          <!-- links -->
          <line :x1="A.x" :y1="A.y" :x2="pose.B.x" :y2="pose.B.y" class="bp-crank" />
          <line :x1="pose.B.x" :y1="pose.B.y" :x2="pose.C.x" :y2="pose.C.y" class="bp-coupler" />
          <line :x1="pose.C.x" :y1="pose.C.y" :x2="D.x" :y2="D.y" class="bp-rocker" />

          <!-- joints -->
          <circle :cx="A.x" :cy="A.y" r="7" class="bp-joint" />
          <circle :cx="D.x" :cy="D.y" r="7" class="bp-joint" />
          <circle :cx="pose.B.x" :cy="pose.B.y" r="6" class="bp-joint bp-joint--live" />
          <circle :cx="pose.C.x" :cy="pose.C.y" r="6" class="bp-joint bp-joint--live" />

          <!-- labels -->
          <text :x="A.x - 28" :y="A.y + 6" class="bp-label">A</text>
          <text :x="D.x + 14" :y="D.y + 6" class="bp-label">D</text>
          <text :x="pose.B.x + 13" :y="pose.B.y - 9" class="bp-label bp-label--accent">B</text>
          <text :x="pose.C.x + 13" :y="pose.C.y - 9" class="bp-label">C</text>
          <text x="170" y="52" class="bp-label bp-label--dim">AB 曲柄 105</text>
          <text x="330" y="52" class="bp-label bp-label--dim">BC 连杆 300</text>
          <text x="500" y="52" class="bp-label bp-label--dim">CD 摇杆 190</text>
        </svg>

        <div class="blueprint__summary">
          <span>GRASHOF · 曲柄摇杆机构</span>
          <strong>l<sub>min</sub> + l<sub>max</sub> ≤ 其余两杆之和</strong>
          <p>
            105 + 380 = 485 < 300 + 190 = 490。最短杆 AB 与机架相邻，可整周回转；摇杆 CD 往复摆动。
          </p>
          <div class="blueprint__readout">
            <span>θ <b>{{ liveAngles.theta }}°</b></span>
            <span>ψ <b>{{ liveAngles.psi }}°</b></span>
            <span>F <b>1</b></span>
          </div>
        </div>

        <div class="blueprint__foot">
          <span>PINNED AT A / D</span>
          <span>SCALE 1 : 1</span>
          <span>REV 9TH ED.</span>
        </div>
      </div>

      <div class="hero__ticker" aria-hidden="true">
        <span>DEGREE OF FREEDOM</span><i />
        <span>FOUR-BAR</span><i />
        <span>CAM PROFILE</span><i />
        <span>INVOLUTE</span><i />
        <span>GEAR TRAIN</span><i />
        <span>JACOBIAN</span>
      </div>
    </section>

    <!-- ========================================================== routes -->
    <section class="home-section">
      <div class="section-head">
        <div>
          <span class="section-eyebrow">START HERE · 三种读法</span>
          <h2>你现在处在哪一步？</h2>
        </div>
        <p>同一个知识库，可以有三种完全不同的读法。选一条与你的目标最接近的路线。</p>
      </div>

      <div class="route-grid">
        <article v-for="route in routes" :key="route.title" class="route-card">
          <div class="route-card__tag">{{ route.tag }}</div>
          <div class="route-card__icon">
            <svg v-if="route.icon === 'map'" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M5 8.5 12 5l8 3.5L27 5v18.5L19 27l-8-3.5L5 27z" />
              <path d="M12 5v18.5M19 8.5V27" />
            </svg>
            <svg v-else-if="route.icon === 'bolt'" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M11 5h10l2 5-4 3v14h-6V13L9 10z" />
              <path d="M13 18h6M13 22h6" />
            </svg>
            <svg v-else viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="16" cy="16" r="7" />
              <circle cx="16" cy="16" r="2.3" />
              <path
                d="M16 5v4M16 23v4M5 16h4M23 16h4M8.2 8.2l2.8 2.8M21 21l2.8 2.8M23.8 8.2 21 11M11 21l-2.8 2.8"
              />
            </svg>
          </div>
          <h3>{{ route.title }}</h3>
          <p>{{ route.desc }}</p>
          <div class="route-card__steps">
            <span v-for="(step, i) in route.steps" :key="step"
              >{{ step }}<i v-if="i < route.steps.length - 1">→</i></span
            >
          </div>
          <a :href="withBase(route.link)" class="route-card__link">{{ route.action }} <span>→</span></a>
        </article>
      </div>
    </section>

    <!-- ============================================================= map -->
    <section class="home-section">
      <div class="section-head section-head--tight">
        <div>
          <span class="section-eyebrow">KNOWLEDGE MAP · 三篇十四章</span>
          <h2>一张机构地图，十四章</h2>
        </div>
        <p>先看全局，再进入局部。每一章都包含问题背景、运动与受力模型、核心公式、例题与易错点。</p>
      </div>

      <a v-if="introChapter" :href="withBase(`/chapters/${introChapter.slug}`)" class="intro-row">
        <span class="intro-row__num">01</span>
        <b>{{ introChapter.title }}</b>
        <span class="intro-row__desc">全书地图 · 课程语境 · 学习方法</span>
        <span class="intro-row__arrow">↗</span>
      </a>

      <div class="map">
        <div v-for="part in partList" :key="part.id" class="map-part">
          <div class="map-part__meta">
            <span class="map-part__roman">{{ part.id }}</span>
            <div>
              <h3>{{ part.name }}</h3>
              <span>{{ part.en }}</span>
            </div>
            <p>{{ part.desc }}</p>
            <em>p.{{ part.range }} · 第 {{ chapterRange(part) }} 章</em>
          </div>
          <div class="map-part__chapters">
            <a
              v-for="chapter in part.chapters"
              :key="chapter.n"
              :href="withBase(`/chapters/${chapter.slug}`)"
              class="chapter-tile"
            >
              <span class="chapter-tile__num">{{ pad(chapter.n) }}</span>
              <span class="chapter-tile__title">{{ chapter.title }}</span>
              <span class="chapter-tile__key">{{ (chapter.tags || []).join(' · ') }}</span>
              <span class="chapter-tile__pages">p.{{ chapter.pages }}</span>
              <span class="chapter-tile__arrow">↗</span>
            </a>
          </div>
        </div>
      </div>

      <a class="map-all" :href="withBase('/chapters/')">
        查看十四章总览
        <span>→</span>
      </a>
    </section>

    <!-- ========================================================= formulas -->
    <section class="home-section home-section--tinted">
      <FormulaQuickSearch compact :limit="6" />
    </section>

    <!-- ========================================================= progress -->
    <section class="home-section">
      <StudyProgress compact />
    </section>

    <!-- ========================================================= textbook -->
    <section class="home-section">
      <div class="section-head">
        <div>
          <span class="section-eyebrow">TEXTBOOK · 教材目录</span>
          <h2>按教材页码，逐节对应</h2>
        </div>
        <p>本站章节号、小节号与页码均与第九版教材一致，复习时可以按页码快速回查。</p>
      </div>

      <a :href="withBase('/guide/textbook')" class="book-card">
        <div class="book-spine">
          <span>教材</span>
          <b>{{ book.title }}</b>
          <i>{{ book.edition }}</i>
        </div>
        <div class="book-body">
          <div class="book-head">
            <span>{{ book.authors }} 主编</span>
            <span>{{ book.publisher }} · {{ book.year }} · {{ book.pages }} 页</span>
          </div>
          <ul class="book-parts">
            <li v-if="introChapter">
              <span class="book-parts__id">0</span>
              <span class="book-parts__name">绪论</span>
              <span class="book-parts__range">p.{{ introChapter.pages }}</span>
              <span class="book-parts__ch">第 01 章</span>
            </li>
            <li v-for="part in partList" :key="part.id">
              <span class="book-parts__id">{{ part.id }}</span>
              <span class="book-parts__name">{{ part.name }}</span>
              <span class="book-parts__range">p.{{ part.range }}</span>
              <span class="book-parts__ch">第 {{ chapterRange(part) }} 章</span>
            </li>
          </ul>
          <div class="book-foot">
            <span>共 14 章 · 含 * 号拓展小节 · 目录逐条列出节号与起始页</span>
            <span class="book-foot__link">打开完整教材目录 →</span>
          </div>
        </div>
      </a>
    </section>

    <!-- ============================================================= how -->
    <section class="home-section how">
      <div class="how__intro">
        <span class="section-eyebrow">HOW TO USE · 阅读方法</span>
        <h2>不要从头背到尾</h2>
        <p>
          机械原理的难点不是“记住”，而是知道一个公式从哪里来、在什么条件下成立、机构什么时候会卡死或自锁。
          这个站点按“问题 → 模型 → 公式 → 机构图 → 易错点”组织每一章。
        </p>
        <a :href="withBase('/guide/')">阅读使用指南 <span>→</span></a>
      </div>
      <ol class="how__steps">
        <li>
          <span>01</span>
          <div>
            <b>先问：机构怎样动？</b>
            <p>画机构简图、数构件与运动副、算自由度，再看运动是否确定。图看不清楚，后面的公式都会算错。</p>
          </div>
        </li>
        <li>
          <span>02</span>
          <div>
            <b>再推：公式在算什么？</b>
            <p>不急着套数，先看清速度图、受力图、啮合线和单位。公式只是模型的压缩表达。</p>
          </div>
        </li>
        <li>
          <span>03</span>
          <div>
            <b>最后：用自己的话复述一遍</b>
            <p>能不看笔记讲清适用条件、死点与自锁、重合度和传动比，才算真正掌握。学习进度自动保存在本地。</p>
          </div>
        </li>
      </ol>
    </section>

    <!-- ============================================================= cta -->
    <section class="home-cta">
      <div>
        <span>READY WHEN YOU ARE</span>
        <h2>从第一章，或者从最痛的那一章开始。</h2>
      </div>
      <div class="home-cta__actions">
        <a :href="withBase('/chapters/01-introduction')" class="btn btn--light">进入第一章 →</a>
        <a :href="withBase('/appendix/formulas')" class="btn btn--outline-light">直接查公式</a>
      </div>
    </section>

    <footer class="home-foot">
      <span>THEORY OF MACHINES WIKI · {{ year }}</span>
      <span>以教材目录为框架独立编写的学习笔记，仅供学习交流。</span>
    </footer>
  </div>
</template>

<style scoped>
.home {
  max-width: 1180px;
  margin: 0 auto;
  padding: 24px 28px 0;
}

/* ---------------------------------------------------------------- hero */
.hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(400px, 0.9fr);
  gap: 34px;
  overflow: hidden;
  padding: 52px 48px 0;
  border: 1px solid rgba(94, 234, 212, 0.16);
  border-radius: 26px;
  background:
    radial-gradient(72% 110% at 90% -8%, rgba(20, 184, 166, 0.28), transparent 58%),
    radial-gradient(52% 80% at 4% 108%, rgba(217, 119, 6, 0.1), transparent 55%),
    #06211e;
  color: #e8faf6;
  box-shadow: 0 30px 80px rgba(4, 22, 19, 0.26);
}

.hero__grid {
  position: absolute;
  inset: 0;
  opacity: 0.5;
  background-image:
    linear-gradient(rgba(94, 234, 212, 0.075) 1px, transparent 1px),
    linear-gradient(90deg, rgba(94, 234, 212, 0.075) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(82% 84% at 50% 30%, #000, transparent 82%);
  pointer-events: none;
}

.hero__copy {
  position: relative;
  z-index: 2;
  padding-bottom: 78px;
}

.hero__eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #6ec8b9;
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
}

.pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #5eead4;
  box-shadow: 0 0 0 4px rgba(94, 234, 212, 0.12);
  animation: hero-pulse 2.4s ease-out infinite;
}

@keyframes hero-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 3px rgba(94, 234, 212, 0.14);
  }
  50% {
    box-shadow: 0 0 0 7px rgba(94, 234, 212, 0.02);
  }
}

.hero h1 {
  margin: 22px 0 0;
  font-size: clamp(40px, 4.8vw, 60px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.045em;
}

.hero h1 span {
  color: #5eead4;
}

.hero__lead {
  max-width: 590px;
  margin: 24px 0 0;
  color: #b9d7d0;
  font-size: 14.5px;
  line-height: 1.85;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 11px;
  margin-top: 28px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  height: 44px;
  padding: 0 19px;
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.18s,
    background 0.18s,
    border-color 0.18s;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn--primary {
  background: #5eead4;
  color: #05201d;
  box-shadow: 0 10px 30px rgba(94, 234, 212, 0.16);
}

.btn--primary span {
  color: #0f766e;
}

.btn--ghost {
  border-color: rgba(94, 234, 212, 0.26);
  background: rgba(7, 34, 30, 0.6);
  color: #bfe9e1;
}

.btn--ghost svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
}

.btn--ghost kbd {
  margin-left: 4px;
  padding: 1px 5px;
  border: 1px solid rgba(94, 234, 212, 0.24);
  border-radius: 4px;
  color: #7faea5;
  font-family: var(--vp-font-family-mono);
  font-size: 9.5px;
}

.hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  margin: 42px 0 0;
  padding: 0;
}

.hero__stats div {
  padding: 0 22px;
  border-left: 1px solid rgba(94, 234, 212, 0.16);
}

.hero__stats div:first-child {
  padding-left: 0;
  border-left: 0;
}

.hero__stats dt {
  color: #fff;
  font-family: var(--vp-font-family-mono);
  font-size: 23px;
  font-weight: 700;
}

.hero__stats dd {
  margin: 2px 0 0;
  color: #8fb5ac;
  font-size: 10.5px;
}

.hero__ticker {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 48px;
  border-top: 1px solid rgba(94, 234, 212, 0.13);
  background: rgba(3, 17, 15, 0.4);
  color: #6b9c92;
  font-family: var(--vp-font-family-mono);
  font-size: 8.5px;
  letter-spacing: 0.13em;
}

.hero__ticker i {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(94, 234, 212, 0.2), transparent);
}

/* --------------------------------------------------------- blueprint */
.blueprint {
  position: relative;
  z-index: 1;
  align-self: stretch;
  margin: 0 -10px -1px 0;
  padding: 14px 14px 46px;
  border-left: 1px solid rgba(94, 234, 212, 0.13);
  font-family: var(--vp-font-family-mono);
}

.blueprint__head,
.blueprint__foot {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: #55837a;
  font-size: 8px;
  letter-spacing: 0.1em;
}

.blueprint__svg {
  display: block;
  width: 100%;
  height: auto;
  margin: 6px 0 4px;
  overflow: visible;
}

.bp-ground {
  fill: none;
  stroke: rgba(214, 245, 238, 0.44);
  stroke-width: 1.2;
}

.bp-fixed {
  fill: none;
  stroke: rgba(214, 245, 238, 0.5);
  stroke-width: 1.2;
}

.bp-hatch {
  fill: none;
  stroke: rgba(148, 196, 187, 0.42);
  stroke-width: 1;
}

.bp-dim {
  fill: none;
  stroke: rgba(148, 196, 187, 0.4);
  stroke-width: 1;
}

.bp-arc {
  fill: none;
  stroke: rgba(94, 234, 212, 0.55);
  stroke-width: 1.2;
  stroke-dasharray: 4 5;
}

.bp-trace {
  fill: none;
  stroke: rgba(94, 234, 212, 0.3);
  stroke-width: 1;
  stroke-dasharray: 3 5;
}

.bp-crank {
  stroke: #5eead4;
  stroke-width: 4;
  stroke-linecap: round;
}

.bp-coupler {
  stroke: rgba(232, 250, 246, 0.92);
  stroke-width: 3.4;
  stroke-linecap: round;
}

.bp-rocker {
  stroke: #fbbf24;
  stroke-width: 3.2;
  stroke-linecap: round;
}

.bp-joint {
  fill: #06211e;
  stroke: #5eead4;
  stroke-width: 2.4;
}

.bp-joint--live {
  fill: #fbbf24;
  stroke: #06211e;
  stroke-width: 2;
}

.bp-label {
  fill: #d7f4ed;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  font-weight: 600;
}

.bp-label--dim {
  fill: #6d9a90;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.04em;
}

.bp-label--accent {
  fill: #5eead4;
}

.blueprint__summary {
  padding: 13px 15px;
  margin: 6px 0 14px;
  border: 1px solid rgba(94, 234, 212, 0.18);
  border-radius: 10px;
  background: rgba(5, 30, 26, 0.55);
}

.blueprint__summary > span {
  display: block;
  margin-bottom: 6px;
  color: #8ab3aa;
  font-size: 9px;
  letter-spacing: 0.06em;
}

.blueprint__summary strong {
  color: #fcd34d;
  font-family: 'Times New Roman', 'STIXGeneral', serif;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.blueprint__summary strong sub {
  font-size: 0.72em;
}

.blueprint__summary p {
  margin: 7px 0 0;
  color: #91b4ac;
  font-family: var(--vp-font-family-base);
  font-size: 10.5px;
  line-height: 1.65;
}

.blueprint__readout {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed rgba(94, 234, 212, 0.16);
  color: #6f9a90;
  font-size: 9.5px;
}

.blueprint__readout b {
  color: #5eead4;
  font-weight: 600;
}

.blueprint__foot {
  margin-top: 2px;
  padding-top: 9px;
  border-top: 1px solid rgba(94, 234, 212, 0.12);
}

/* --------------------------------------------------------- sections */
.home-section {
  padding: 76px 0 0;
}

.home-section--tinted {
  margin-top: 76px;
  padding: 38px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 22px;
  background:
    radial-gradient(100% 100% at 100% 0%, var(--tmm-tint, rgba(15, 118, 110, 0.06)), transparent 55%),
    var(--vp-c-bg-soft);
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 26px;
}

.section-head--tight {
  align-items: flex-start;
}

.section-eyebrow {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.section-head h2,
.how h2 {
  margin: 5px 0 0;
  font-size: clamp(25px, 3vw, 34px);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.section-head > p {
  max-width: 380px;
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 13px;
  line-height: 1.75;
}

/* ------------------------------------------------------------ routes */
.route-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.route-card {
  position: relative;
  padding: 24px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg);
  transition:
    border-color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
}

.route-card:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 50%, transparent);
  transform: translateY(-3px);
  box-shadow: 0 16px 40px color-mix(in srgb, var(--vp-c-brand-3) 9%, transparent);
}

.route-card__tag {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
  letter-spacing: 0.08em;
}

.route-card__icon {
  display: grid;
  width: 42px;
  height: 42px;
  margin-top: 18px;
  border-radius: 11px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  place-items: center;
}

.route-card__icon svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.route-card h3 {
  margin: 16px 0 0;
  font-size: 18px;
  letter-spacing: -0.02em;
}

.route-card p {
  margin: 8px 0 0;
  color: var(--vp-c-text-3);
  font-size: 12.5px;
  line-height: 1.72;
}

.route-card__steps {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 15px;
}

.route-card__steps span {
  color: var(--vp-c-text-2);
  font-size: 10.5px;
}

.route-card__steps i {
  margin-left: 4px;
  color: var(--vp-c-text-3);
  font-style: normal;
}

.route-card__link {
  display: inline-block;
  margin-top: 20px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.route-card__link span {
  display: inline-block;
  transition: transform 0.18s;
}

.route-card__link:hover span {
  transform: translateX(3px);
}

/* --------------------------------------------------------------- map */
.intro-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 9px;
  padding: 13px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 11px;
  background: var(--vp-c-bg);
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.18s,
    background 0.18s;
}

.intro-row:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 55%, transparent);
  background: var(--vp-c-bg-soft);
}

.intro-row__num {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  font-weight: 700;
}

.intro-row b {
  color: var(--vp-c-text-1);
  font-size: 13.5px;
}

.intro-row__desc {
  flex: 1;
  color: var(--vp-c-text-3);
  font-size: 11px;
}

.intro-row__arrow {
  color: var(--vp-c-text-3);
  font-size: 11px;
  opacity: 0;
  transition: opacity 0.18s;
}

.intro-row:hover .intro-row__arrow {
  opacity: 1;
  color: var(--vp-c-brand-1);
}

.map {
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg);
}

.map-part {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 26px;
  padding: 24px 28px;
  border-top: 1px solid var(--vp-c-divider);
}

.map-part:first-child {
  border-top: 0;
}

.map-part__meta {
  position: relative;
  padding-left: 46px;
}

.map-part__roman {
  position: absolute;
  top: 0;
  left: 0;
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  font-weight: 700;
  opacity: 0.65;
}

.map-part__meta h3 {
  margin: 0;
  font-size: 17px;
  letter-spacing: -0.01em;
}

.map-part__meta > div > span {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 8px;
  letter-spacing: 0.14em;
}

.map-part__meta p {
  margin: 11px 0 0;
  color: var(--vp-c-text-3);
  font-size: 11.5px;
  line-height: 1.65;
}

.map-part__meta em {
  display: block;
  margin-top: 10px;
  color: var(--tmm-amber, #b45309);
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.03em;
}

.map-part__chapters {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}

.chapter-tile {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto;
  gap: 2px 8px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 9px;
  color: inherit;
  text-decoration: none;
  transition:
    background 0.17s,
    border-color 0.17s;
}

.chapter-tile:hover {
  border-color: var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.chapter-tile__num {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  font-weight: 700;
  grid-row: span 2;
}

.chapter-tile__title {
  overflow: hidden;
  color: var(--vp-c-text-1);
  font-size: 12.5px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chapter-tile__key {
  overflow: hidden;
  color: var(--vp-c-text-3);
  font-size: 9.5px;
  grid-column: 2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chapter-tile__pages {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 8.5px;
  grid-column: 3;
  grid-row: 1;
}

.chapter-tile__arrow {
  color: var(--vp-c-text-3);
  font-size: 10px;
  grid-column: 3;
  grid-row: 2;
  text-align: right;
  opacity: 0;
  transition: opacity 0.17s;
}

.chapter-tile:hover .chapter-tile__arrow {
  opacity: 1;
  color: var(--vp-c-brand-1);
}

.map-all {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition:
    border-color 0.18s,
    color 0.18s;
}

.map-all:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

/* ---------------------------------------------------------- textbook */
.book-card {
  display: grid;
  grid-template-columns: 158px minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg);
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.18s,
    box-shadow 0.18s;
}

.book-card:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 50%, transparent);
  box-shadow: 0 18px 46px color-mix(in srgb, var(--vp-c-brand-3) 8%, transparent);
}

.book-spine {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 26px 22px;
  border-right: 1px solid var(--vp-c-divider);
  background:
    linear-gradient(160deg, var(--vp-c-brand-soft), transparent 72%),
    var(--vp-c-bg-soft);
}

.book-spine::before {
  position: absolute;
  top: 14px;
  bottom: 14px;
  left: 9px;
  width: 2px;
  border-radius: 2px;
  background: var(--vp-c-brand-1);
  content: '';
  opacity: 0.55;
}

.book-spine span {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
  letter-spacing: 0.16em;
}

.book-spine b {
  color: var(--vp-c-text-1);
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.book-spine i {
  color: var(--tmm-amber, #b45309);
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
}

.book-body {
  display: flex;
  flex-direction: column;
  padding: 22px 26px;
}

.book-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  font-size: 10.5px;
}

.book-parts {
  margin: 0;
  padding: 0;
  list-style: none;
}

.book-parts li {
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr) auto auto;
  gap: 12px;
  align-items: baseline;
  padding: 10px 0;
  border-top: 1px dashed var(--vp-c-divider);
}

.book-parts li:first-child {
  border-top: 0;
}

.book-parts__id {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  font-weight: 700;
}

.book-parts__name {
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 600;
}

.book-parts__range,
.book-parts__ch {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 9.5px;
  white-space: nowrap;
}

.book-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  font-size: 9.5px;
}

.book-foot__link {
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 600;
}

/* --------------------------------------------------------------- how */
.how {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 64px;
  padding-top: 82px;
}

.how__intro p {
  margin: 15px 0 0;
  color: var(--vp-c-text-3);
  font-size: 13px;
  line-height: 1.85;
}

.how__intro a {
  display: inline-block;
  margin-top: 18px;
  color: var(--vp-c-brand-1);
  font-size: 12.5px;
  font-weight: 700;
  text-decoration: none;
}

.how__steps {
  margin: 0;
  padding: 0;
  list-style: none;
}

.how__steps li {
  display: flex;
  gap: 18px;
  padding: 17px 0;
  border-top: 1px solid var(--vp-c-divider);
}

.how__steps li:first-child {
  padding-top: 0;
  border-top: 0;
}

.how__steps > li > span {
  flex: none;
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  font-weight: 700;
  line-height: 24px;
}

.how__steps b {
  display: block;
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.how__steps p {
  margin: 5px 0 0;
  color: var(--vp-c-text-3);
  font-size: 12px;
  line-height: 1.7;
}

/* --------------------------------------------------------------- cta */
.home-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  margin-top: 82px;
  padding: 38px 42px;
  border-radius: 20px;
  background:
    radial-gradient(80% 160% at 100% 0%, rgba(94, 234, 212, 0.16), transparent 55%),
    #072521;
  color: #fff;
}

.home-cta span {
  color: #6ec8b9;
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
  letter-spacing: 0.14em;
}

.home-cta h2 {
  max-width: 560px;
  margin: 7px 0 0;
  font-size: clamp(22px, 2.6vw, 30px);
  letter-spacing: -0.025em;
}

.home-cta__actions {
  display: flex;
  flex: none;
  flex-wrap: wrap;
  gap: 9px;
}

.btn--light {
  background: #5eead4;
  color: #05201d;
}

.btn--outline-light {
  border-color: rgba(94, 234, 212, 0.32);
  color: #d3f2ec;
}

.home-foot {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 36px;
  padding: 18px 0 26px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
  letter-spacing: 0.06em;
}

/* -------------------------------------------------------- responsive */
@media (max-width: 1040px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 44px 38px 0;
  }

  .hero__copy {
    padding-bottom: 22px;
  }

  .blueprint {
    display: none;
  }

  .hero__ticker {
    padding: 11px 38px;
  }

  .route-grid {
    grid-template-columns: 1fr;
  }

  .route-card {
    display: grid;
    grid-template-columns: 54px 1fr;
    gap: 0 16px;
  }

  .route-card__tag {
    grid-column: 2;
  }

  .route-card__icon {
    grid-row: 1 / span 2;
    margin-top: 0;
  }

  .route-card h3,
  .route-card p,
  .route-card__steps,
  .route-card__link {
    grid-column: 2;
  }

  .how {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .book-card {
    grid-template-columns: 130px minmax(0, 1fr);
  }
}

@media (max-width: 760px) {
  .home {
    padding: 16px 16px 0;
  }

  .hero {
    padding: 32px 22px 0;
    border-radius: 18px;
  }

  .hero h1 {
    font-size: clamp(30px, 8.4vw, 40px);
    letter-spacing: 0.01em;
  }

  .hero__lead {
    font-size: 13.5px;
  }

  .hero__stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px 0;
    margin-top: 30px;
  }

  .hero__stats div {
    padding: 0 16px;
  }

  .hero__stats div:nth-child(3) {
    padding-left: 0;
    border-left: 0;
  }

  .hero__ticker {
    position: static;
    margin: 26px -22px 0;
    padding: 10px 22px;
    overflow: hidden;
    font-size: 7.5px;
  }

  .hero__ticker span:nth-of-type(n + 4),
  .hero__ticker i:nth-of-type(n + 3) {
    display: none;
  }

  .home-section {
    padding-top: 54px;
  }

  .home-section--tinted {
    margin-top: 54px;
    padding: 22px 18px;
  }

  .section-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .section-head h2,
  .how h2 {
    font-size: 25px;
  }

  .map-part {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 20px 18px;
  }

  .map-part__chapters {
    grid-template-columns: 1fr;
  }

  .route-card {
    display: block;
    padding: 20px;
  }

  .route-card__icon {
    margin-top: 14px;
  }

  .book-card {
    grid-template-columns: 1fr;
  }

  .book-spine {
    flex-direction: row;
    align-items: baseline;
    gap: 10px;
    padding: 16px 18px;
    border-right: 0;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .book-spine::before {
    display: none;
  }

  .book-spine b {
    font-size: 19px;
  }

  .book-body {
    padding: 18px;
  }

  .book-parts li {
    grid-template-columns: 22px minmax(0, 1fr) auto;
    gap: 4px 10px;
  }

  .book-parts__ch {
    grid-column: 2;
  }

  .book-parts__range {
    grid-column: 3;
    grid-row: 1;
  }

  .home-cta {
    align-items: flex-start;
    flex-direction: column;
    margin-top: 54px;
    padding: 26px 22px;
  }

  .home-foot {
    flex-direction: column;
    gap: 7px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pulse {
    animation: none;
  }

  .btn,
  .route-card,
  .chapter-tile {
    transition: none;
  }
}
</style>
