<script setup lang="ts">
import { computed } from 'vue'
import GearWheel from './GearWheel.vue'
import LabChart from './LabChart.vue'
import { rad, point, linePath } from '../../utils/mechanics.mjs'
import { movingChain, planetary, geneva, TAU, wrap } from '../../utils/lab-models.mjs'
const props=defineProps<{kind:string;id:string;angle:number;p1:number;overlay:boolean}>()
const t=computed(()=>rad(props.angle)), chain=computed(()=>movingChain(t.value,props.p1))
const planet=computed(()=>planetary(t.value))
const genevaPose=computed(()=>geneva(t.value))
const phase=computed(()=>wrap(t.value)/TAU)
const toothPitch=computed(()=>TAU/props.p1)
const chainCurve=computed(()=>Array.from({length:101},(_,i)=>Math.cos(-Math.PI/props.p1+i*TAU/props.p1/100)))
const genCurve=Array.from({length:181},(_,i)=>geneva(i*TAU/180).rotation*180/Math.PI)
const pCenters=computed(()=>[0,120,240].map(a=>point(278,230,91.2,rad(a)+planet.value.carrier)))
const slotShape='M43 -10H180V10H43A10 10 0 0 1 33 0A10 10 0 0 1 43 -10Z'
</script>
<template>
  <g v-if="kind==='gears'">
    <rect x="70" y="61" width="502" height="302" rx="38" class="panel"/>
    <path d="M90 81H550M90 343H550" class="fine"/>
    <g v-for="p in [[90,80],[550,80],[90,344],[550,344]]"><circle :cx="p[0]" :cy="p[1]" r="6" class="bolt"/><path :d="'M'+(p[0]-3)+' '+p[1]+'h6'" class="bore-glint"/></g>
    <GearWheel :id="id" :z="24" :m="6" :x="183" :y="210" :angle="angle" :phase="-Math.PI/48" :overlay="overlay" tint="blue"/>
    <GearWheel :id="id" :z="p1" :m="6" :x="255+p1*3" :y="210" :angle="-angle*24/p1" :phase="Math.PI-Math.PI/(2*p1)" :overlay="overlay" tint="green"/>
    <path v-if="overlay" d="M95 210H565M255 95V330M215 100L295 320" class="axis"/>
    <path v-if="overlay" d="M215 100L295 320" class="amber-line vector" stroke-dasharray="7 4"/>
    <circle cx="255" cy="210" r="4" fill="var(--red)"/><text x="262" y="204" class="label">P</text>
    <text x="145" y="390" class="blue-text">主动轮 z₁ = 24</text><text x="345" y="390" class="green-text">从动轮 z₂ = {{ p1 }}</text>
    <g transform="translate(92 422)">
      <path d="M0 0H464" class="dimension"/><path d="M0 -6V6M464 -6V6" class="dimension"/>
      <text x="0" y="31" class="small">轮齿：按渐开线生成</text><text x="0" y="53" class="small">键槽、轴孔、轮毂与减重孔随轮体一起转动</text>
    </g>
    <g transform="translate(660 65)">
      <text class="small">有符号传动比 i₁₂ = ω₁ / ω₂</text><text y="39" class="metric blue-text">−{{ (p1/24).toFixed(2) }}</text>
      <text y="84">ω₁ = +1.000 rad/s</text><text y="112" class="green-text">ω₂ = {{ (-24/p1).toFixed(3) }} rad/s</text>
      <text y="163" class="small">标准中心距</text><text y="194" class="metric">{{ 24+p1 }} mm</text>
      <text y="240">分度圆切向速度相等</text><text y="269" class="small">r₁ω₁ + r₂ω₂ = 0</text>
      <text y="322" class="small">尝试更换从动轮齿数：</text><text y="348" class="small">中心距和转速会同时改变。</text>
      <text y="390" class="tiny">蓝点划线：分度圆 · 橙虚线：基圆/啮合线</text>
    </g>
  </g>
  <g v-else-if="kind==='planetary'">
    <circle cx="278" cy="230" r="174" :fill="'url(#'+id+'-metal)'" class="outline"/>
    <circle cx="278" cy="230" r="154" class="bore"/>
    <g v-for="n in 12" :transform="'translate(278 230) rotate('+n*30+')'"><circle cx="164" r="5" class="bolt"/></g>
    <path :d="linePath(pCenters,true)" fill="var(--amber)" opacity=".2" stroke="var(--amber)" stroke-width="15" stroke-linejoin="round"/>
    <GearWheel :id="id" :z="72" :m="3.8" :x="278" :y="230" internal :overlay="overlay"/>
    <GearWheel :id="id" :z="24" :m="3.8" :x="278" :y="230" :angle="angle" :overlay="overlay" tint="blue"/>
    <g v-for="(p,i) in pCenters" :key="i">
      <GearWheel :id="id" :z="24" :m="3.8" :x="p.x" :y="p.y" :angle="planet.planet*180/Math.PI" :phase="rad(i*120)+Math.PI/24" :overlay="overlay" tint="green"/>
      <circle :cx="p.x" :cy="p.y" r="7" fill="var(--amber)" stroke="var(--ink)"/>
    </g>
    <path v-if="overlay" d="M75 230H480M278 38V425" class="axis"/>
    <path d="M455 94H580M340 230H550M365 297H550" class="dimension"/>
    <text x="470" y="81" class="small">固定内齿圈</text><text x="478" y="222" class="small">太阳轮</text><text x="477" y="319" class="small">行星轮</text>
    <text x="95" y="448">橙色三角架 H：连接三个行星轮轴</text><text x="95" y="477" class="small">绿色轮体的自转方向与行星架公转方向相反。</text>
    <g transform="translate(660 65)">
      <text class="small">太阳轮输入 / 行星架输出</text><text y="39" class="metric">iₛH = 4</text>
      <text y="91" class="blue-text">ωₛ = 1.00 rad/s</text><text y="122" class="amber-text">ωH = 0.25 rad/s</text><text y="153" class="green-text">ωp = −0.50 rad/s</text>
      <text y="210">zᵣ = zₛ + 2zₚ = 72</text><text y="245" class="small">(ωₛ − ωH) / (ωᵣ − ωH)</text><text y="275">= −zᵣ / zₛ = −3</text>
      <text y="330" class="small">白色刻线便于辨认自转。</text><text y="357" class="small">行星架转一周，太阳轮转四周。</text>
    </g>
  </g>
  <g v-else-if="kind==='chain'">
    <g transform="translate(32 40)">
      <g v-for="(w,i) in chain.wheels" :key="i">
        <path :d="w.path" :fill="'url(#'+id+'-'+(i?'green':'blue')+')'" class="outline"/>
        <circle :cx="w.cx" :cy="w.cy" :r="w.r*.7" class="fine"/>
        <circle v-for="n in 5" :cx="w.cx+w.r*.46*Math.cos(n*TAU/5+t)" :cy="w.cy+w.r*.46*Math.sin(n*TAU/5+t)" :r="w.r*.13" class="bore"/>
        <circle :cx="w.cx" :cy="w.cy" r="19" :fill="'url(#'+id+'-metal)'" class="outline"/><circle :cx="w.cx" :cy="w.cy" r="9" class="bore"/>
        <circle v-if="overlay" :cx="w.cx" :cy="w.cy" :r="w.r" class="pitch"/>
      </g>
      <g v-for="(pin,i) in chain.pins" :key="i">
        <path :d="linePath([pin,chain.pins[(i+1)%chain.pins.length]])" :stroke="(i+chain.index)%2===0?'var(--metal-a)':'var(--metal-c)'" stroke-width="13" stroke-linecap="round"/>
        <path :d="linePath([pin,chain.pins[(i+1)%chain.pins.length]])" stroke="var(--ink)" stroke-width="1" opacity=".4"/>
      </g>
      <g v-for="(pin,i) in chain.pins" :key="'pin'+i"><circle :cx="pin.x" :cy="pin.y" r="7.2" class="joint"/><circle :cx="pin.x" :cy="pin.y" r="3.4" class="bolt"/></g>
      <path d="M130 320V340M418 320V340M130 333H418" class="dimension"/>
      <text x="204" y="357" class="small">a = 12p = 152.4 mm</text>
    </g>
    <g transform="translate(110 450)">
      <path d="M0 0H115" stroke="var(--metal-a)" stroke-width="24" stroke-linecap="round"/>
      <circle cx="0" r="14" class="joint"/><circle cx="115" r="14" class="joint"/><circle cx="0" r="5" class="bolt"/><circle cx="115" r="5" class="bolt"/>
      <text x="145" y="-2">滚子 / 销轴 / 内外链板</text><text x="145" y="24" class="small">放大后可看到交替链节和齿槽座</text>
    </g>
    <g transform="translate(660 65)">
      <text class="small">等齿数传动，平均速比为 1</text><text y="39" class="metric">{{ p1 }} 齿 · {{ 24+p1 }} 节</text>
      <text y="86">v = ωR cosδ</text><text y="119" class="metric blue-text">{{ (chain.velocity*12.7/24).toFixed(2) }} mm/s</text>
      <text y="153" class="small">此例 ω = 1 rad/s，δ = {{ (chain.delta*180/Math.PI).toFixed(1) }}°</text>
      <g transform="translate(0 216)"><LabChart :values="chainCurve" :phase="chain.delta/toothPitch+.5" :min=".94" :max="1" label="一个齿距内的 v / (ωR)" :height="77"/></g>
      <text y="346">波动比例 {{ (100*chain.ripple).toFixed(2) }}%</text><text y="375" class="small">齿数增大，多边形效应减弱。</text>
      <text y="418" class="tiny">每节链长固定，不把链条当成光滑皮带。</text>
    </g>
  </g>
  <g v-else-if="kind==='geneva'">
    <g transform="translate(178 242)">
      <circle r="175" class="axis"/>
      <g :transform="'translate(220 0) rotate('+genevaPose.rotation*180/Math.PI+')'">
        <circle r="165" :fill="'url(#'+id+'-green)'" class="outline"/>
        <circle r="145" class="fine"/>
        <g v-for="k in 4" :transform="'rotate('+(225+(k-1)*90)+')'">
          <path :d="slotShape" class="bore"/>
          <path d="M164 -12H185V12H164" fill="var(--paper)" stroke="none"/>
          <circle cx="83" cy="58" r="12" class="bore"/>
        </g>
        <circle r="26" :fill="'url(#'+id+'-metal)'" class="outline"/><circle r="12" class="bore"/>
      </g>
      <circle r="40" :fill="'url(#'+id+'-metal)'" class="outline"/>
      <path :d="linePath([{x:0,y:0},genevaPose.pin])" class="rod-shadow"/>
      <path :d="linePath([{x:0,y:0},genevaPose.pin])" class="rod"/>
      <circle r="10" class="bolt"/><circle :cx="genevaPose.pin.x" :cy="genevaPose.pin.y" r="8" fill="var(--amber)" stroke="var(--ink)" stroke-width="2"/>
      <path v-if="overlay" d="M-50 0H385" class="axis"/>
    </g>
    <text x="82" y="446" class="small">蓝色：拨杆　橙色：拨销　绿色：四槽从动轮</text><text x="82" y="476" class="small">拨销只在入槽区间推动槽轮，其余时间槽轮保持不动。</text>
    <g transform="translate(660 65)">
      <text class="small">当前阶段</text><text y="39" class="metric" :class="genevaPose.engaged?'green-text':'amber-text'">{{ genevaPose.engaged?'拨销驱动':'锁止停歇' }}</text>
      <text y="91">输出角 {{ (genevaPose.rotation*180/Math.PI).toFixed(1) }}°</text><text y="123">ω₂ / ω₁ = {{ genevaPose.derivative.toFixed(3) }}</text>
      <g transform="translate(0 194)"><LabChart :values="genCurve" :phase="phase" :min="-90" :max="0" label="单圈输出角 / °" :height="84" color="green"/></g>
      <text y="330" class="small">入槽与出槽时，瞬时输出速度为零。</text><text y="358" class="small">每个输入周期：驱动 90°，停歇 270°。</text>
      <text y="412" class="tiny">锁止圆弧剖开；停歇约束由模型显式施加。</text>
    </g>
  </g>
</template>
