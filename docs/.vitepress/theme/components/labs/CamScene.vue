<script setup lang="ts">
import {computed} from 'vue'
import LabChart from './LabChart.vue'
import {rad,linePath} from '../../utils/mechanics.mjs'
import {camContact,camProfile,camMotion,TAU,wrap} from '../../utils/lab-models.mjs'
const props=defineProps<{id:string;angle:number;p1:number;law:string;overlay:boolean}>()
const theta=computed(()=>rad(props.angle)),contact=computed(()=>camContact(theta.value,props.p1,props.law))
const profile=computed(()=>camProfile(props.p1,props.law))
const curves=computed(()=>{const a=Array.from({length:181},(_,i)=>camMotion(i*TAU/180,props.p1,props.law));return {s:a.map(x=>x.s),v:a.map(x=>x.v),a:a.map(x=>x.a)}})
const phase=computed(()=>wrap(theta.value)/TAU)
const spring=computed(()=>linePath(Array.from({length:17},(_,i)=>({x:290+(i===0||i===16?0:i%2?12:-12),y:85+i*(178-contact.value.s-85)/16}))))
const normal=computed(()=>({x:contact.value.n.x*Math.cos(theta.value)+contact.value.n.y*Math.sin(theta.value),y:-contact.value.n.x*Math.sin(theta.value)+contact.value.n.y*Math.cos(theta.value)}))
</script>
<template>
  <path d="M150 75H435M290 35V465" class="axis"/>
  <rect x="220" y="53" width="140" height="28" rx="5" :fill="'url(#'+id+'-metal)'" class="outline"/>
  <rect x="220" y="53" width="140" height="28" :fill="'url(#'+id+'-hatch)'" opacity=".5"/>
  <circle v-for="x in [235,345]" :cx="x" cy="67" r="5" class="bolt"/>
  <path :d="spring" class="purple-line vector"/>
  <rect x="284" y="35" width="12" :height="285-contact.rho" rx="4" :fill="'url(#'+id+'-metal)'" class="outline"/>
  <rect x="268" :y="176-contact.s" width="44" height="8" rx="3" :fill="'url(#'+id+'-metal)'" class="outline"/>
  <g :transform="'translate(290 320) rotate('+(-angle)+')'">
    <path :d="profile.body" transform="translate(0 4)" class="metal-shadow"/>
    <path :d="profile.body" :fill="'url(#'+id+'-blue)'" class="outline"/>
    <circle r="69" class="fine"/>
    <circle v-for="i in 5" :cx="48*Math.cos(i*TAU/5)" :cy="48*Math.sin(i*TAU/5)" r="10" class="bore"/>
    <circle r="26" :fill="'url(#'+id+'-metal)'" class="outline"/><circle r="12" class="bore"/><path d="M-4 -10V-17H4V-10" class="key"/>
    <path v-if="overlay" :d="profile.pitch" class="green-line" fill="none" stroke-width="1.4" stroke-dasharray="5 4"/>
    <circle v-if="overlay" r="90" class="pitch"/>
    <path d="M0 -33V-64" class="witness"/>
  </g>
  <circle cx="290" :cy="320-contact.rho" r="14" :fill="'url(#'+id+'-metal)'" class="outline"/>
  <circle cx="290" :cy="320-contact.rho" r="5" class="bolt"/>
  <path v-if="overlay" :d="'M'+(290-normal.x*50)+' '+(320-contact.rho-normal.y*50)+'l'+normal.x*100+' '+normal.y*100" class="amber-line vector" :marker-end="'url(#'+id+'-amber-arrow)'"/>
  <path :d="'M155 '+(120-contact.s/3)+'H275M365 66H445'" class="dimension"/><text x="90" :y="111-contact.s/3" class="small">预紧弹簧</text><text x="455" y="72" class="small">直线导套</text>
  <text x="80" y="450">基圆 / 轮廓 / 滚子中心轨迹</text><text x="80" y="479" class="small">橙色线沿接触法线；滚子与凸轮始终相切。</text>
  <g transform="translate(660 52)">
    <text class="heading green-text">{{ contact.stage }} · α = {{ contact.alpha.toFixed(1) }}°</text>
    <text y="31" class="small">ω = 1 rad/s · 当前 s = {{ contact.s.toFixed(1) }} mm</text>
    <g transform="translate(0 75)"><LabChart :values="curves.s" :phase="phase" label="位移 s / mm" :height="60" color="green"/></g>
    <g transform="translate(0 188)"><LabChart :values="curves.v" :phase="phase" label="速度 v / (mm/s)" :height="60"/></g>
    <g transform="translate(0 301)"><LabChart :values="curves.a" :phase="phase" label="加速度 a / (mm/s²)" :height="60" color="purple"/></g>
    <text y="410" class="tiny">0° → 120° → 180° → 300° → 360°</text>
    <text y="436" class="tiny">{{ law==='harmonic'?'简谐规律在连接停歇处有加速度跃变。':'所选规律在推程两端的速度、加速度均为零。' }}</text>
  </g>
</template>
