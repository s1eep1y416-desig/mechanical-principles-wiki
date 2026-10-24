<script setup lang="ts">
import {computed} from 'vue'
import LabChart from './LabChart.vue'
import {rad,linePath} from '../../utils/mechanics.mjs'
import {robot2R,cycleModel,TAU,wrap} from '../../utils/lab-models.mjs'
const props=defineProps<{id:string;kind:string;angle:number;p1:number;overlay:boolean}>()
const robot=computed(()=>robot2R(rad(props.angle),rad(props.p1)))
const cycle=computed(()=>cycleModel(rad(props.angle))),phase=computed(()=>wrap(rad(props.angle))/TAU)
const toScreen=(p:{x:number;y:number})=>({x:310+p.x*.65,y:265-p.y*.65})
const elbow=computed(()=>toScreen(robot.value.elbow)),end=computed(()=>toScreen(robot.value.end))
const traces=computed(()=>Array.from({length:181},(_,i)=>toScreen(robot2R(i*TAU/180,rad(props.p1)).end)))
const curves={feed:[],clamp:[],press:[]} as Record<string,number[]>
for(let i=0;i<=180;i++){const c=cycleModel(i*TAU/180);for(const k of ['feed','clamp','press'])curves[k].push(c[k])}
</script>
<template>
  <g v-if="kind==='robot'">
    <g v-if="overlay">
      <circle cx="310" cy="265" r="208" fill="var(--green)" opacity=".055" stroke="var(--green)" stroke-dasharray="5 4"/>
      <circle cx="310" cy="265" r="26" fill="var(--paper)" stroke="var(--green)" stroke-dasharray="5 4"/>
      <path :d="linePath(traces,true)" class="purple-line" opacity=".45" fill="none" stroke-dasharray="4 4"/>
    </g>
    <path d="M42 265H592M310 29V507" class="axis"/>
    <rect x="260" y="284" width="100" height="47" rx="9" :fill="'url(#'+id+'-metal)'" class="outline"/>
    <circle cx="278" cy="310" r="6" class="bolt"/><circle cx="342" cy="310" r="6" class="bolt"/>
    <path :d="linePath([{x:310,y:265},elbow])" class="rod-shadow"/><path :d="linePath([{x:310,y:265},elbow])" class="rod"/>
    <path :d="linePath([elbow,end])" class="rod-shadow"/><path :d="linePath([elbow,end])" class="rod" style="stroke:var(--green)"/>
    <path :d="linePath([{x:310,y:265},elbow])" class="rod-core"/><path :d="linePath([elbow,end])" class="rod-core"/>
    <g v-for="(p,i) in [{x:310,y:265},elbow,end]"><circle :cx="p.x" :cy="p.y" :r="i===2?12:22" :fill="'url(#'+id+'-metal)'" class="outline"/><circle :cx="p.x" :cy="p.y" :r="i===2?4:9" class="bolt"/></g>
    <g :transform="'translate('+end.x+' '+end.y+') rotate('+(-angle-p1)+')'"><rect x="7" y="-12" width="20" height="24" rx="3" class="bearing"/><path d="M26 -9H41V-4M26 9H41V4" class="ground"/></g>
    <path :d="d" v-for="d in ['M310 265H365','M310 265V210']" class="blue-line vector" :marker-end="'url(#'+id+'-blue-arrow)'"/>
    <text x="370" y="271" class="small">x₀</text><text x="296" y="205" class="small">y₀</text>
    <text :x="end.x-14" :y="end.y-28" class="label">P</text>
    <g transform="translate(660 65)">
      <text class="small">末端位置（基坐标系）</text><text y="39" class="metric">x = {{ robot.end.x.toFixed(1) }} mm</text><text y="78" class="metric">y = {{ robot.end.y.toFixed(1) }} mm</text>
      <text y="129">q₁ = {{ angle.toFixed(1) }}°</text><text y="160">q₂ = {{ p1.toFixed(1) }}°</text><text y="205" class="small">x = l₁ cosq₁ + l₂ cos(q₁+q₂)</text><text y="233" class="small">y = l₁ sinq₁ + l₂ sin(q₁+q₂)</text>
      <text y="285" :class="robot.singular?'red-text':'green-text'" class="heading">{{ robot.singular?'接近伸直奇异位形':'雅可比满秩' }}</text>
      <text y="322" class="small">det J = l₁l₂ sinq₂</text><text y="352">{{ robot.determinant.toFixed(0) }} mm²</text>
      <text y="399" class="small">几何可达半径：40–320 mm。</text><text y="428" class="tiny">紫线：固定 q₂ 时，改变 q₁ 的末端轨迹。</text>
    </g>
  </g>
  <g v-else-if="kind==='cycle'">
    <rect x="85" y="62" width="42" height="335" rx="5" :fill="'url(#'+id+'-metal)'" class="outline"/>
    <rect x="465" y="62" width="42" height="335" rx="5" :fill="'url(#'+id+'-metal)'" class="outline"/>
    <rect x="85" y="62" width="422" height="50" rx="5" :fill="'url(#'+id+'-metal)'" class="outline"/>
    <circle v-for="x in [106,486]" :cx="x" cy="85" r="7" class="bolt"/>
    <rect x="275" y="112" width="44" :height="45+cycle.press*95" :fill="'url(#'+id+'-blue)'" class="outline"/>
    <rect x="243" :y="157+cycle.press*95" width="108" height="34" rx="4" :fill="'url(#'+id+'-blue)'" class="outline"/>
    <rect x="274" :y="191+cycle.press*95" width="46" height="34" :fill="'url(#'+id+'-metal)'" class="outline"/>
    <rect x="130" y="320" width="330" height="14" :fill="'url(#'+id+'-green)'" class="outline"/>
    <rect x="75" y="334" width="451" height="43" rx="4" :fill="'url(#'+id+'-metal)'" class="outline"/>
    <rect x="281" y="334" width="33" height="45" class="bore"/>
    <g v-for="x in [222,360]"><rect :x="x-12" :y="280+cycle.clamp*26" width="24" height="14" rx="3" fill="var(--amber)" class="outline"/><path :d="'M'+x+' 264v'+(16+cycle.clamp*26)" class="ground"/></g>
    <rect :x="86+cycle.feed*78" y="303" width="42" height="17" rx="3" fill="var(--green)" class="outline"/>
    <path :d="'M78 312H'+(86+cycle.feed*78)" class="ground"/>
    <text x="133" y="425" class="green-text">送料器</text><text x="263" y="425" class="blue-text">冲头 / 凹模</text><text x="435" y="425" class="amber-text">夹具</text>
    <text x="85" y="467" class="small">冲头接触板料前已夹紧；冲头退离后再松开、返回。</text>
    <g transform="translate(660 52)">
      <text class="heading">{{ cycle.stage }}</text><text y="32" class="small">主循环相位 {{ cycle.deg.toFixed(1) }}°</text>
      <g transform="translate(0 81)"><LabChart :values="curves.feed" :phase="phase" :max="1" :min="0" label="送料器行程 / 归一化" :height="60" color="green"/></g>
      <g transform="translate(0 199)"><LabChart :values="curves.clamp" :phase="phase" :max="1" :min="0" label="夹具位移 / 归一化" :height="60" color="amber"/></g>
      <g transform="translate(0 317)"><LabChart :values="curves.press" :phase="phase" :max="1" :min="0" label="冲头行程 / 归一化" :height="60"/></g>
      <text y="438" class="tiny">慢速时序示意 · 行程曲线与执行件同步</text>
    </g>
  </g>
</template>
