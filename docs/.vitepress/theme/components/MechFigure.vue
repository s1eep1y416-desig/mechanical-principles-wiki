<script setup lang="ts">
import { computed } from 'vue'
import EngineeringDiagram from './EngineeringDiagram.vue'
import DetailPlate from './DetailPlate.vue'
const detailed = ['motion-pairs','cam-types','rotor-balance','intermittent','robot-arm']
const upgraded: Record<string,string> = {'gear-mesh':'gear','gear-train':'geartrain','cam-profile':'cam','friction-wedge':'wedge','involute':'involute','four-bar-types':'linkage-types','quick-return':'quick','crank-slider':'slider-angle'}

const props = withDefaults(
  defineProps<{
    type: string
    caption?: string
  }>(),
  { caption: '' }
)

type Pt = [number, number]

function mapY(v: number, y0: number, h: number, lo: number, hi: number) {
  return y0 + h - ((v - lo) / (hi - lo)) * h
}

function chart(
  fn: (x: number) => number,
  x0: number,
  y0: number,
  w: number,
  h: number,
  lo: number,
  hi: number,
  n = 60
) {
  const pts: Pt[] = []
  for (let i = 0; i <= n; i++) {
    const x = i / n
    pts.push([x0 + x * w, mapY(fn(x), y0, h, lo, hi)])
  }
  return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
}

/* 凸轮四种运动规律的小图 */
const laws = [
  {
    name: '等速',
    note: '刚性冲击',
    s: (x: number) => x,
    v: (x: number) => 1,
    a: (x: number) => 0,
    vmax: 1.2,
    amax: 1.2
  },
  {
    name: '等加速等减速',
    note: '柔性冲击',
    s: (x: number) => (x < 0.5 ? 2 * x * x : 1 - 2 * (1 - x) * (1 - x)),
    v: (x: number) => (x < 0.5 ? 4 * x : 4 * (1 - x)),
    a: (x: number) => (x < 0.5 ? 4 : -4),
    vmax: 2.3,
    amax: 4.6
  },
  {
    name: '余弦加速度',
    note: '柔性冲击',
    s: (x: number) => (1 - Math.cos(Math.PI * x)) / 2,
    v: (x: number) => (Math.PI / 2) * Math.sin(Math.PI * x),
    a: (x: number) => ((Math.PI * Math.PI) / 2) * Math.cos(Math.PI * x),
    vmax: 1.8,
    amax: 5.2
  },
  {
    name: '正弦加速度',
    note: '无冲击',
    s: (x: number) => x - Math.sin(2 * Math.PI * x) / (2 * Math.PI),
    v: (x: number) => 1 - Math.cos(2 * Math.PI * x),
    a: (x: number) => 2 * Math.PI * Math.sin(2 * Math.PI * x),
    vmax: 2.2,
    amax: 7
  }
]

const camRows = laws.map((law, i) => {
  const y0 = 76 + i * 78
  const h = 46
  return {
    ...law,
    y0,
    h,
    sPath: chart(law.s, 96, y0, 160, h, 0, 1),
    vPath: chart(law.v, 316, y0, 160, h, -law.vmax, law.vmax),
    aPath: chart(law.a, 536, y0, 160, h, -law.amax, law.amax)
  }
})

/* 渐开线 */
const involutePath = computed(() => {
  const cx = 280
  const cy = 250
  const rb = 90
  const pts: string[] = []
  for (let i = 0; i <= 48; i++) {
    const t = (i / 48) * 1.5
    const x = cx + rb * (Math.cos(t) + t * Math.sin(t))
    const y = cy - rb * (Math.sin(t) - t * Math.cos(t))
    pts.push(`${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return pts.join(' ')
})

/* 凸轮轮廓（带一个顶部凸起） */
const camProfilePath = computed(() => {
  const cx = 320
  const cy = 200
  const rb = 86
  const pts: string[] = []
  for (let i = 0; i <= 160; i++) {
    const deg = (i / 160) * 360
    const rad = (deg * Math.PI) / 180
    const lobe = 30 * Math.pow(Math.max(0, Math.cos(((deg - 90) * Math.PI) / 180)), 2)
    const r = rb + lobe
    const x = cx + r * Math.cos(rad)
    const y = cy - r * Math.sin(rad)
    pts.push(`${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return pts.join(' ') + ' Z'
})

const camRadii = [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
  const rad = (deg * Math.PI) / 180
  const lobe = 30 * Math.pow(Math.max(0, Math.cos(((deg - 90) * Math.PI) / 180)), 2)
  const r = 86 + lobe + 14
  return {
    deg,
    x: 320 + r * Math.cos(rad),
    y: 200 - r * Math.sin(rad),
    ox: 320 + (r - 14) * Math.cos(rad),
    oy: 200 - (r - 14) * Math.sin(rad)
  }
})

/* 速度波动图 */
const sfTop = computed(() => chart((x) => 0.8 + 0.42 * Math.sin(2 * Math.PI * x), 96, 66, 540, 140, 0.2, 1.4))
const sfBottom = computed(() => chart((x) => 1 + 0.06 * Math.sin(2 * Math.PI * x + 0.5), 96, 288, 540, 72, 0.92, 1.08))
</script>

<template>
  <DetailPlate v-if="detailed.includes(type)" :type="type" :caption="caption" />
  <EngineeringDiagram v-else-if="upgraded[type]" :type="upgraded[type]" :caption="caption" />
  <figure v-else class="mech-figure" :data-figure-type="type">
    <!-- ============================================================ 运动副 -->
    <svg v-if="type === 'motion-pairs'" viewBox="0 0 720 380" role="img" aria-label="转动副、移动副与高副简图">
      <defs>
        <marker :id="'arr-' + type" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
          <path d="M0,0 L8,4.5 L0,9 Z" fill="var(--vp-c-brand-1)" />
        </marker>
      </defs>
      <line class="aux" x1="240" y1="30" x2="240" y2="350" />
      <line class="aux" x1="480" y1="30" x2="480" y2="350" />

      <!-- 转动副 -->
      <g>
        <line class="ln" x1="130" y1="230" x2="130" y2="118" />
        <line class="mov" x1="130" y1="230" x2="204" y2="166" />
        <circle class="joint" cx="130" cy="230" r="8" />
        <path class="ground" d="M100 230 l60 0 M108 242 l44 -24 M116 254 l28 -28" />
        <text class="lbl-brand" x="138" y="222">A</text>
        <text class="lbl" x="130" y="300" text-anchor="middle">转动副</text>
        <text class="lbl-sm" x="130" y="322" text-anchor="middle">低副 · 面接触</text>
        <path class="mov" d="M84 198 a56 56 0 0 1 16 -38" :marker-end="'url(#arr-' + type + ')'" />
      </g>

      <!-- 移动副 -->
      <g>
        <line class="ln" x1="282" y1="160" x2="462" y2="160" />
        <line class="ln" x1="282" y1="204" x2="462" y2="204" />
        <rect class="mov" x="326" y="160" width="70" height="44" rx="3" />
        <line class="ln" x1="396" y1="182" x2="452" y2="182" />
        <path class="ground" d="M300 204 l8 12 M330 204 l8 12 M360 204 l8 12 M390 204 l8 12 M420 204 l8 12 M450 204 l8 12" />
        <text class="lbl" x="370" y="300" text-anchor="middle">移动副</text>
        <text class="lbl-sm" x="370" y="322" text-anchor="middle">低副 · 面接触</text>
        <path class="mov" d="M318 132 h70" :marker-end="'url(#arr-' + type + ')'" />
      </g>

      <!-- 高副 -->
      <g>
        <circle class="ln" cx="610" cy="228" r="55" />
        <circle class="mov" cx="610" cy="155" r="15" />
        <circle class="hot" cx="610" cy="170" r="3.5" />
        <line class="ln" x1="610" y1="140" x2="610" y2="92" />
        <rect class="aux" x="588" y="78" width="44" height="18" rx="2" />
        <path class="ground" d="M590 78 l7 -10 M606 78 l7 -10 M622 78 l7 -10" />
        <path class="mov" d="M610 183 l0 28" :marker-end="'url(#arr-' + type + ')'" />
        <text class="lbl" x="610" y="300" text-anchor="middle">高副</text>
        <text class="lbl-sm" x="610" y="322" text-anchor="middle">点 / 线接触</text>
      </g>
    </svg>

    <!-- ============================================================ 四杆类型 -->

    <!-- ============================================================ 急回特性 -->

    <!-- ============================================================ 凸轮类型 -->
    <svg v-else-if="type === 'cam-types'" viewBox="0 0 720 380" role="img" aria-label="盘形、移动与圆柱凸轮">
      <defs>
        <marker :id="'arr-' + type" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
          <path d="M0,0 L8,4.5 L0,9 Z" fill="var(--vp-c-brand-1)" />
        </marker>
      </defs>
      <line class="aux" x1="240" y1="30" x2="240" y2="344" />
      <line class="aux" x1="480" y1="30" x2="480" y2="344" />

      <!-- 盘形凸轮 -->
      <g>
        <circle class="ln" cx="128" cy="214" r="58" />
        <path class="mov" d="M128 156 a58 58 0 0 1 34 12 l-34 46 Z" />
        <circle class="joint" cx="128" cy="214" r="5" />
        <circle class="mov" cx="128" cy="136" r="13" />
        <circle class="hot" cx="128" cy="149" r="3" />
        <line class="ln" x1="128" y1="123" x2="128" y2="84" />
        <rect class="aux" x="106" y="72" width="44" height="14" rx="2" />
        <path class="mov" d="M74 250 a58 58 0 0 0 12 26" :marker-end="'url(#arr-' + type + ')'" />
        <text class="lbl" x="128" y="316" text-anchor="middle">盘形凸轮</text>
        <text class="lbl-sm" x="128" y="338" text-anchor="middle">绕固定轴转动</text>
      </g>

      <!-- 移动凸轮 -->
      <g>
        <path class="ln" d="M286 204 L444 204 L444 250 L286 250 Z" />
        <path class="mov" d="M286 204 L330 168 L444 168 L444 204 Z" />
        <line class="ln" x1="330" y1="168" x2="272" y2="168" />
        <circle class="mov" cx="262" cy="168" r="12" />
        <circle class="joint" cx="262" cy="168" r="3" />
        <path class="mov" d="M300 286 h64" :marker-end="'url(#arr-' + type + ')'" />
        <text class="lbl" x="366" y="316" text-anchor="middle">移动凸轮</text>
        <text class="lbl-sm" x="366" y="338" text-anchor="middle">作往复直线移动</text>
      </g>

      <!-- 圆柱凸轮 -->
      <g>
        <rect class="ln" x="520" y="112" width="150" height="160" rx="10" />
        <line class="aux" x1="520" y1="192" x2="670" y2="192" stroke-dasharray="14 8" />
        <path class="mov" d="M520 150 C570 120 620 210 670 170" />
        <line class="ln" x1="650" y1="150" x2="696" y2="150" />
        <circle class="mov" cx="650" cy="150" r="12" />
        <circle class="joint" cx="650" cy="150" r="3" />
        <path class="mov" d="M532 292 a74 30 0 0 1 120 0" :marker-end="'url(#arr-' + type + ')'" />
        <text class="lbl" x="595" y="316" text-anchor="middle">圆柱凸轮</text>
        <text class="lbl-sm" x="595" y="338" text-anchor="middle">空间凸轮 · 凹槽推动滚子</text>
      </g>
    </svg>

    <!-- ============================================================ 凸轮运动规律 -->
    <svg v-else-if="type === 'cam-motion'" viewBox="0 0 720 390" role="img" aria-label="四种推杆运动规律的位移速度加速度线图">
      <text class="lbl-sm" x="176" y="34" text-anchor="middle">位移 s</text>
      <text class="lbl-sm" x="396" y="34" text-anchor="middle">速度 v</text>
      <text class="lbl-sm" x="616" y="34" text-anchor="middle">加速度 a</text>
      <g v-for="row in camRows" :key="row.name">
        <text class="lbl" x="8" :y="row.y0 + row.h / 2 - 2">{{ row.name }}</text>
        <text class="lbl-sm" x="8" :y="row.y0 + row.h / 2 + 16">{{ row.note }}</text>
        <line class="aux" x1="96" :y1="row.y0 + row.h" x2="696" :y2="row.y0 + row.h" />
        <line class="aux" x1="96" :y1="row.y0" x2="96" :y2="row.y0 + row.h" />
        <line class="aux" x1="316" :y1="row.y0" x2="316" :y2="row.y0 + row.h" />
        <line class="aux" x1="536" :y1="row.y0" x2="536" :y2="row.y0 + row.h" />
        <path class="curve-s" :d="row.sPath" />
        <path class="curve-v" :d="row.vPath" />
        <path class="curve-a" :d="row.aPath" />
      </g>
      <text class="lbl-sm" x="176" y="384" text-anchor="middle">推程运动角 Φ（0 → 1）</text>
    </svg>

    <!-- ============================================================ 渐开线 -->

    <!-- ============================================================ 齿轮啮合 -->

    <!-- ============================================================ 轮系 -->

    <!-- ============================================================ 速度波动 -->
    <svg v-else-if="type === 'speed-fluctuation'" viewBox="0 0 720 430" role="img" aria-label="等效力矩与速度波动曲线">
      <line class="aux" x1="96" y1="66" x2="96" y2="206" />
      <line class="aux" x1="96" y1="206" x2="636" y2="206" />
      <line class="ln" x1="96" y1="116" x2="636" y2="116" />
      <path class="mov" :d="sfTop" />
      <line class="dash" x1="216" y1="66" x2="216" y2="206" />
      <line class="dash" x1="426" y1="66" x2="426" y2="206" />
      <path class="aux" d="M216 92 L426 92" />
      <path class="dim" d="M216 84 L216 100 M426 84 L426 100" />
      <text class="lbl-sm" x="321" y="82" text-anchor="middle">ΔW_max</text>
      <text class="lbl-sm" x="646" y="120">M_d</text>
      <text class="lbl-sm" x="646" y="176">M_r</text>
      <text class="lbl-sm" x="78" y="112" text-anchor="end">M</text>
      <text class="lbl-sm" x="360" y="236" text-anchor="middle">φ</text>

      <line class="aux" x1="96" y1="288" x2="96" y2="374" />
      <line class="aux" x1="96" y1="374" x2="636" y2="374" />
      <line class="dash" x1="96" y1="297" x2="636" y2="297" />
      <line class="dash" x1="96" y1="351" x2="636" y2="351" />
      <line class="aux" x1="96" y1="324" x2="636" y2="324" />
      <path class="mov" :d="sfBottom" />
      <text class="lbl-sm" x="646" y="301">ω_max</text>
      <text class="lbl-sm" x="646" y="355">ω_min</text>
      <text class="lbl-sm" x="646" y="328">ω_m</text>
      <text class="lbl-sm" x="78" y="332" text-anchor="end">ω</text>
      <text class="lbl-sm" x="360" y="402" text-anchor="middle">φ</text>
      <text class="lbl" x="360" y="424" text-anchor="middle">δ = (ω_max − ω_min) / ω_m</text>
    </svg>

    <!-- ============================================================ 曲柄滑块 -->

    <!-- ============================================================ 反转法 -->

    <!-- ============================================================ 摩擦自锁 -->

    <!-- ============================================================ 转子平衡 -->
    <svg v-else-if="type === 'rotor-balance'" viewBox="0 0 720 380" role="img" aria-label="刚性转子静平衡与动平衡">
      <line class="aux" x1="30" y1="200" x2="340" y2="200" />
      <circle class="ln" cx="180" cy="200" r="88" />
      <circle class="joint" cx="180" cy="200" r="5" />
      <circle class="hot" cx="228" cy="158" r="10" />
      <circle class="mov" cx="132" cy="242" r="14" fill="none" />
      <line class="dash" x1="180" y1="200" x2="228" y2="158" />
      <line class="dash" x1="180" y1="200" x2="132" y2="242" />
      <text class="lbl-sm" x="238" y="150">m₁</text>
      <text class="lbl-sm" x="104" y="266">m_b</text>
      <text class="lbl" x="180" y="330" text-anchor="middle">静平衡</text>
      <text class="lbl-sm" x="180" y="352" text-anchor="middle">Σ m_i r_i = 0（单面配重）</text>

      <line class="aux" x1="390" y1="200" x2="700" y2="200" />
      <rect class="ln" x="420" y="178" width="240" height="44" rx="8" />
      <line class="ln" x1="470" y1="178" x2="470" y2="222" />
      <line class="ln" x1="610" y1="178" x2="610" y2="222" />
      <circle class="hot" cx="500" cy="144" r="10" />
      <circle class="hot" cx="580" cy="256" r="10" />
      <line class="dash" x1="500" y1="178" x2="500" y2="144" />
      <line class="dash" x1="580" y1="222" x2="580" y2="256" />
      <line class="aux" x1="470" y1="130" x2="470" y2="286" />
      <line class="aux" x1="610" y1="130" x2="610" y2="286" />
      <text class="lbl-sm" x="470" y="122" text-anchor="middle">平衡平面 I</text>
      <text class="lbl-sm" x="610" y="122" text-anchor="middle">平衡平面 II</text>
      <text class="lbl-sm" x="514" y="148">m₁</text>
      <text class="lbl-sm" x="554" y="270">m₂</text>
      <text class="lbl" x="540" y="330" text-anchor="middle">动平衡</text>
      <text class="lbl-sm" x="540" y="352" text-anchor="middle">Σ F = 0 且 Σ M = 0（双面配重）</text>
    </svg>

    <!-- ============================================================ 间歇机构 -->
    <svg v-else-if="type === 'intermittent'" viewBox="0 0 720 380" role="img" aria-label="棘轮机构与槽轮机构">
      <defs>
        <marker :id="'arr-' + type" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
          <path d="M0,0 L8,4.5 L0,9 Z" fill="var(--vp-c-brand-1)" />
        </marker>
      </defs>
      <circle class="ln" cx="170" cy="210" r="72" />
      <g v-for="i in 12" :key="'t' + i">
        <line
          class="ln"
          :x1="170 + 72 * Math.cos((i * Math.PI) / 6)"
          :y1="210 - 72 * Math.sin((i * Math.PI) / 6)"
          :x2="170 + 88 * Math.cos((i * Math.PI) / 6 + 0.12)"
          :y2="210 - 88 * Math.sin((i * Math.PI) / 6 + 0.12)"
        />
      </g>
      <circle class="joint" cx="170" cy="210" r="5" />
      <line class="mov" x1="242" y1="118" x2="206" y2="152" />
      <line class="mov" x1="98" y1="126" x2="132" y2="158" />
      <path class="dash" d="M124 138 a60 60 0 0 1 40 -20" />
      <text class="lbl-sm" x="244" y="110">棘爪</text>
      <text class="lbl-sm" x="66" y="120">止回爪</text>
      <text class="lbl" x="170" y="318" text-anchor="middle">棘轮机构</text>
      <text class="lbl-sm" x="170" y="340" text-anchor="middle">单向间歇 · 冲击较大</text>

      <circle class="ln" cx="530" cy="210" r="66" />
      <circle class="joint" cx="530" cy="210" r="5" />
      <line class="ln" x1="530" y1="210" x2="596" y2="210" />
      <circle class="hot" cx="596" cy="210" r="8" />
      <circle class="ln" cx="590" cy="210" r="76" />
      <g>
        <line class="ln" x1="590" y1="134" x2="590" y2="286" />
        <line class="ln" x1="514" y1="210" x2="666" y2="210" />
        <line class="ln" x1="536" y1="156" x2="644" y2="264" />
        <line class="ln" x1="536" y1="264" x2="644" y2="156" />
      </g>
      <circle class="joint" cx="590" cy="210" r="5" />
      <path class="dash" d="M554 168 a46 46 0 0 1 30 -22" />
      <text class="lbl-sm" x="484" y="150">拨盘</text>
      <text class="lbl-sm" x="620" y="132">槽轮</text>
      <text class="lbl" x="590" y="318" text-anchor="middle">槽轮机构</text>
      <text class="lbl-sm" x="590" y="340" text-anchor="middle">圆销拨动 · 锁止弧停歇</text>
    </svg>

    <!-- ============================================================ 机器人 -->
    <svg v-else-if="type === 'robot-arm'" viewBox="0 0 720 420" role="img" aria-label="开链机器人机构与位姿">
      <defs>
        <marker :id="'arr-' + type" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
          <path d="M0,0 L8,4.5 L0,9 Z" fill="var(--vp-c-brand-1)" />
        </marker>
      </defs>
      <path class="dash" d="M180 330 A330 330 0 0 1 520 120" />
      <line class="aux" x1="180" y1="330" x2="180" y2="250" stroke-dasharray="4 4" />
      <rect class="ln" x="132" y="330" width="96" height="34" rx="6" />
      <path class="ground" d="M146 364 l10 12 M178 364 l10 12 M210 364 l10 12" />
      <line class="mov" x1="180" y1="330" x2="240" y2="256" />
      <line class="mov" x1="240" y1="256" x2="326" y2="208" />
      <line class="mov" x1="326" y1="208" x2="412" y2="154" />
      <line class="amber" x1="412" y1="154" x2="486" y2="190" />
      <line class="amber" x1="486" y1="190" x2="540" y2="238" />
      <circle class="joint" cx="180" cy="330" r="9" />
      <circle class="joint" cx="240" cy="256" r="8" />
      <circle class="joint" cx="326" cy="208" r="8" />
      <circle class="joint" cx="412" cy="154" r="8" />
      <circle class="joint" cx="486" cy="190" r="7" />
      <circle class="hot" cx="540" cy="238" r="7" />
      <text class="lbl-sm" x="192" y="322">q₁</text>
      <text class="lbl-sm" x="252" y="248">q₂</text>
      <text class="lbl-sm" x="338" y="200">q₃</text>
      <text class="lbl-sm" x="424" y="146">q₄</text>
      <text class="lbl-sm" x="498" y="182">q₅</text>
      <text class="lbl-sm" x="550" y="256">q₆</text>
      <text class="lbl-sm" x="556" y="238">末端</text>
      <line class="aux" x1="540" y1="238" x2="634" y2="238" stroke-dasharray="4 4" />
      <line class="aux" x1="540" y1="238" x2="540" y2="150" stroke-dasharray="4 4" />
      <text class="lbl-sm" x="646" y="242">x</text>
      <text class="lbl-sm" x="534" y="146">z</text>
      <text class="lbl" x="360" y="386" text-anchor="middle">开链机构：6 个转动关节，关节变量 q₁ … q₆</text>
      <text class="lbl-sm" x="360" y="408" text-anchor="middle">正运动学求末端位姿，逆运动学由位姿反求关节变量</text>
    </svg>

    <figcaption v-if="props.caption">{{ props.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.mech-figure {
  margin: 24px 0;
  padding: 14px 16px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.mech-figure svg {
  display: block;
  width: 100%;
  height: auto;
}

figcaption {
  margin-top: 8px;
  color: var(--vp-c-text-3);
  font-size: 12.5px;
  line-height: 1.6;
  text-align: center;
}

.ln {
  fill: none;
  stroke: var(--vp-c-text-2);
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mov {
  fill: none;
  stroke: var(--vp-c-brand-1);
  stroke-width: 2.3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.amber {
  fill: none;
  stroke: var(--tmm-amber);
  stroke-width: 2.1;
  stroke-linecap: round;
}

.aux {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 1;
  stroke-dasharray: 4 5;
  stroke-linecap: round;
}

.dim {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 1;
  stroke-linecap: round;
}

.dash {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 1;
  stroke-dasharray: 6 5;
  stroke-linecap: round;
}

.ground {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 1;
  stroke-linecap: round;
}

.joint {
  fill: var(--vp-c-bg);
  stroke: var(--vp-c-text-2);
  stroke-width: 1.6;
}

.hot {
  fill: var(--tmm-amber);
  stroke: var(--vp-c-bg);
  stroke-width: 1.2;
}

.lbl {
  fill: var(--vp-c-text-2);
  font-family: var(--vp-font-family-base);
  font-size: 14px;
  font-weight: 600;
}

.lbl-sm {
  fill: var(--vp-c-text-3);
  font-family: var(--vp-font-family-base);
  font-size: 12px;
}

.lbl-brand {
  fill: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-base);
  font-size: 12.5px;
  font-weight: 600;
}

.lbl-amber {
  fill: var(--tmm-amber);
  font-family: var(--vp-font-family-base);
  font-size: 12.5px;
  font-weight: 600;
}

.curve-s {
  fill: none;
  stroke: var(--vp-c-brand-1);
  stroke-width: 2;
}

.curve-v {
  fill: none;
  stroke: var(--tmm-amber);
  stroke-width: 1.5;
  stroke-dasharray: 5 3;
}

.curve-a {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 1.3;
  stroke-dasharray: 2 3;
}

@media (max-width: 640px) {
  .mech-figure {
    padding: 10px 8px 8px;
    margin: 18px 0;
  }

  .lbl {
    font-size: 13px;
  }

  .lbl-sm {
    font-size: 11px;
  }
}
</style>
