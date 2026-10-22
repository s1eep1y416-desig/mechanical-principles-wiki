<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import DiagramFrame from './DiagramFrame.vue'
import { fourbarGeometry, sliderCrank, linePath, rad, arcPath } from '../utils/mechanics.mjs'
const mode = ref('fourbar'), angle = ref(65), playing = ref(false), showTrace = ref(true)
const id = `linkage-${useId().replace(/:/g, '')}`
const pose = computed(() => fourbarGeometry(rad(angle.value)))
const slider = computed(() => sliderCrank(rad(angle.value)))
const alpha = computed(() => Math.abs(Math.asin((slider.value.B.y-slider.value.A.y)/slider.value.l))*180/Math.PI)
let frame = 0, previous = 0
function pause() { playing.value = false; cancelAnimationFrame(frame); previous = 0 }
function tick(now: number) {
  if (!playing.value) return
  if (previous) angle.value = (angle.value + Math.min((now-previous)/1000, .1)*180/Math.PI)%360
  previous = now
  frame = requestAnimationFrame(tick)
}
function toggle() { if (playing.value) pause(); else { playing.value = true; frame = requestAnimationFrame(tick) } }
function step(delta: number) { pause(); angle.value = (angle.value + delta + 360)%360 }
function reset() { pause(); angle.value = 65 }
function visibility() { if (document.hidden) pause() }
onMounted(() => document.addEventListener('visibilitychange', visibility))
onBeforeUnmount(() => { pause(); document.removeEventListener('visibilitychange', visibility) })
</script>

<template>
  <DiagramFrame title="连杆实验台：拖动输入角，观察真实闭环运动" caption="理想平面刚性机构，铰链无间隙；只演示位置与速度关系。载荷、惯性、摩擦和弹性变形未加入此模型。动画由你启动，切换页面或后台时自动暂停。">
    <div class="lab-controls">
      <div class="modes" role="group" aria-label="机构类型">
        <button :aria-pressed="mode === 'fourbar'" @click="mode = 'fourbar'; reset()">曲柄摇杆</button>
        <button :aria-pressed="mode === 'slider'" @click="mode = 'slider'; reset()">曲柄滑块</button>
      </div>
      <div class="angle-control"><label :for="`${id}-angle`">输入角 θ <strong>{{ angle.toFixed(1) }}°</strong></label><input :id="`${id}-angle`" v-model.number="angle" type="range" min="0" max="360" step="0.1" aria-label="输入角 θ" @input="pause" /></div>
      <div class="playback"><button @click="toggle">{{ playing ? '暂停' : '播放' }}</button><button @click="step(-15)">−15°</button><button @click="step(15)">+15°</button><button @click="reset">复位</button><label v-if="mode === 'fourbar'"><input v-model="showTrace" type="checkbox" /> 显示 C 点轨迹</label></div>
    </div>
    <svg class="linkage-lab" viewBox="0 0 840 470" role="img" :aria-label="`${mode === 'fourbar' ? '曲柄摇杆' : '曲柄滑块'}机构，输入角 ${angle.toFixed(1)} 度`" :data-angle="angle" :data-mode="mode">
      <defs>
        <pattern :id="`${id}-grid`" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" class="grid"/></pattern>
        <pattern :id="`${id}-ground`" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8L8 0" class="ground"/></pattern>
        <marker :id="`${id}-arrow`" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1 9 5 1 9Z" class="arrow"/></marker>
      </defs>
      <rect width="840" height="470" :fill="`url(#${id}-grid)`"/>
      <text x="25" y="33" class="heading">{{ mode === 'fourbar' ? '旋转 → 摆动 + 连杆点轨迹' : '旋转 → 往复直线运动' }}</text>
      <text x="25" y="58" class="small">输入 ω = 1 rad/s，逆时针 · 角度从向右的水平线量起</text>
      <template v-if="mode === 'fourbar'">
        <g transform="translate(-40 -85) scale(1.35)">
          <path d="M96 311H363" class="ground"/><rect x="96" y="312" width="267" height="12" :fill="`url(#${id}-ground)`"/>
          <path :d="linePath([pose.O1,pose.O2])" class="axis"/>
          <path v-if="showTrace" :d="pose.trace" class="trace"/>
          <path :d="linePath([pose.A,pose.C,pose.B], true)" class="coupler"/>
          <path :d="linePath([pose.O1,pose.A])" class="bar input-bar"/>
          <path :d="linePath([pose.A,pose.B])" class="bar connecting-bar"/>
          <path :d="linePath([pose.B,pose.O2])" class="bar output-bar"/>
          <circle v-for="(p,n) in [pose.O1,pose.A,pose.B,pose.O2]" :key="n" :cx="p.x" :cy="p.y" r="6" class="joint" :data-joint="['O1','A','B','O2'][n]"/>
          <circle :cx="pose.C.x" :cy="pose.C.y" r="4" class="trace-point"/>
          <text x="96" y="296">O₁</text><text x="350" y="296">O₂</text><text :x="pose.A.x-20" :y="pose.A.y-10">A</text><text :x="pose.B.x+10" :y="pose.B.y-8">B</text><text :x="pose.C.x+6" :y="pose.C.y-7" class="purple">C</text>
          <path :d="arcPath(120,300,42,rad(260),rad(205))" class="rotation" :marker-end="`url(#${id}-arrow)`"/>
        </g>
        <g transform="translate(565 105)">
          <text class="heading">杆长保持不变 / mm</text><text y="38">O₁A = 64　AB = 185</text><text y="68">BO₂ = 130　O₁O₂ = 220</text>
          <text y="120" class="small">64 + 220 &lt; 185 + 130</text><text y="147" class="small">满足格拉肖夫条件，可整周输入。</text>
          <text y="200" class="heading green">传动角 γ = {{ pose.gamma.toFixed(1) }}°</text><text y="229" class="small">连杆与摇杆夹角中的锐角。</text>
          <text y="277" class="small">C 点固定在同一块连杆板上，</text><text y="302" class="small">虚线由同一模型计算一周得到。</text>
        </g>
      </template>
      <template v-else>
        <g transform="translate(5 -60) scale(1.25)">
          <path d="M180 265H402M180 315H402" class="ground"/><rect x="180" y="316" width="222" height="12" :fill="`url(#${id}-ground)`"/>
          <path d="M45 290H414" class="axis"/><path d="M72 306H108" class="ground"/>
          <rect :x="slider.B.x-20" :y="slider.B.y-23" width="40" height="46" rx="4" class="slider"/>
          <path :d="linePath([slider.O,slider.A])" class="bar input-bar"/><path :d="linePath([slider.A,slider.B])" class="bar connecting-bar"/>
          <circle v-for="(p,n) in [slider.O,slider.A,slider.B]" :key="n" :cx="p.x" :cy="p.y" r="6" class="joint" :data-joint="['O','A','B'][n]"/>
          <text x="70" y="286">O</text><text :x="slider.A.x-20" :y="slider.A.y-10">A</text><text :x="slider.B.x-5" y="345">B</text>
          <path :d="arcPath(90,290,46,rad(260),rad(205))" class="rotation" :marker-end="`url(#${id}-arrow)`"/>
          <path :d="`M${slider.B.x} 240h${-slider.vB.x}`" class="velocity" :marker-end="Math.abs(slider.vB.x)>0.5 ? `url(#${id}-arrow)` : undefined"/><text :x="slider.B.x-10" y="225" class="small">vB</text>
        </g>
        <g transform="translate(565 105)">
          <text class="heading">对心曲柄滑块 / mm</text><text y="38">r = 80　l = 205　e = 0</text><text y="68">整周行程 = 2r = 160</text>
          <text y="120" class="heading">xB = {{ (slider.B.x-slider.O.x).toFixed(1) }} mm</text><text y="152">vB = {{ (-slider.vB.x).toFixed(1) }} mm/s</text><text y="179" class="small">沿导轨向右为正。</text>
          <text y="225" class="green">α = {{ alpha.toFixed(1) }}° · γ = {{ (90-alpha).toFixed(1) }}°</text>
          <text y="272" class="small">θ = 0°、180° 时滑块到达端点，</text><text y="297" class="small">瞬时速度为零，随后改变方向。</text>
        </g>
      </template>
      <path d="M540 88V427" class="divider"/>
      <text x="25" y="455" class="small">蓝色：输入曲柄　灰色：连杆　绿色：输出摇杆　空心圆：转动副　斜线：机架 / 导轨</text>
    </svg>
  </DiagramFrame>
</template>

<style scoped>
.lab-controls { padding:16px 20px; background:var(--vp-c-bg-soft); border-bottom:1px solid var(--vp-c-divider); display:grid; gap:14px; }
.modes,.playback { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
button { padding:5px 12px; border:1px solid var(--vp-c-divider); border-radius:7px; background:var(--vp-c-bg); font-size:13px; cursor:pointer; }
button[aria-pressed=true] { color:var(--vp-c-brand-1); border-color:var(--vp-c-brand-1); background:var(--vp-c-brand-soft); }
button:focus-visible,input:focus-visible { outline:2px solid var(--vp-c-brand-1); outline-offset:3px; }
.angle-control { display:flex; gap:20px; align-items:center; flex-wrap:wrap; }.angle-control label { min-width:140px; font-size:13px; }.angle-control input { min-width:160px; flex:1; accent-color:var(--vp-c-brand-1); }.playback label { font-size:12px; margin-left:auto; }
.linkage-lab { --blue:#176aba; --green:#147756; --purple:#7650b5; --steel:#778a9f; --paper:var(--vp-c-bg); background:var(--paper); }
:global(.dark .linkage-lab) { --blue:#82baff; --green:#72d4ad; --purple:#c1a6fa; --steel:#92a8c2; }
text { font:14px var(--vp-font-family-base); fill:var(--vp-c-text-1); paint-order:stroke; stroke:var(--paper); stroke-width:3px; }.heading { font-size:17px; font-weight:650; }.small { font-size:12px; fill:var(--vp-c-text-2); }.green { fill:var(--green); }.purple { fill:var(--purple); }
.grid { fill:none; stroke:var(--vp-c-divider); stroke-width:.4; opacity:.35; }.ground { fill:none; stroke:var(--steel); stroke-width:1.5; }.axis { stroke:var(--steel); stroke-width:1; stroke-dasharray:10 4 2 4; fill:none; }
.trace { fill:none; stroke:var(--purple); stroke-width:1.5; stroke-dasharray:4 4; opacity:.7; }.coupler { fill:color-mix(in srgb,var(--purple) 9%,transparent); stroke:var(--purple); stroke-width:1.2; }.trace-point { fill:var(--purple); }
.bar { stroke-width:10; stroke-linecap:round; }.input-bar { stroke:var(--blue); }.connecting-bar { stroke:var(--steel); }.output-bar { stroke:var(--green); }.joint { fill:var(--paper); stroke:var(--blue); stroke-width:2; }.slider { fill:color-mix(in srgb,var(--steel) 12%,var(--paper)); stroke:var(--steel); stroke-width:2; }
.rotation,.velocity { stroke:var(--blue); stroke-width:2; fill:none; }.arrow { fill:var(--blue); }.divider { stroke:var(--vp-c-divider); }
@media(max-width:600px) { .playback label { margin-left:0; } }
</style>
