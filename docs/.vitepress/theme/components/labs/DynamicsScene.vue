<script setup lang="ts">
import {computed} from 'vue'
import LabChart from './LabChart.vue'
import {rad,linePath,point} from '../../utils/mechanics.mjs'
import {frictionModel,sliderDynamics,balanceModel,flywheelModel,coriolisModel,TAU,wrap} from '../../utils/lab-models.mjs'
const props=defineProps<{id:string;kind:string;angle:number;p1:number;p2:number;overlay:boolean}>()
const t=computed(()=>rad(props.angle)),phase=computed(()=>wrap(t.value)/TAU)
const elapsed=computed(()=>Math.min(props.angle/360,1))
const friction=computed(()=>frictionModel(props.p1,props.p2,elapsed.value*.6))
const dynamics=computed(()=>sliderDynamics(t.value,props.p1,props.p2))
const balance=computed(()=>balanceModel(t.value,props.p1,600,props.p2))
const flywheel=computed(()=>flywheelModel(t.value,props.p1))
const cor=computed(()=>coriolisModel(elapsed.value*2,props.p1))
const plane=computed(()=>{const a=friction.value.angle;const base={x:80,y:390};const e={x:Math.cos(a),y:-Math.sin(a)},n={x:-Math.sin(a),y:-Math.cos(a)}
const q={x:base.x+(330-friction.value.distance*90)*e.x,y:base.y+(330-friction.value.distance*90)*e.y}
const c={x:q.x+22*n.x,y:q.y+22*n.y};const shift=-22*friction.value.friction/friction.value.normal
return {base,e,n,c,q:{x:q.x+shift*e.x,y:q.y+shift*e.y}}})
const positions=computed(()=>({O:{x:115,y:245},A:{x:115+70*Math.cos(t.value),y:245-70*Math.sin(t.value)},B:{x:115+dynamics.value.x/.06*70,y:245}}))
const inertiaCurve=computed(()=>Array.from({length:181},(_,i)=>sliderDynamics(i*TAU/180,props.p1,props.p2).inertia))
const flyCurve=computed(()=>Array.from({length:181},(_,i)=>flywheelModel(i*TAU/180,props.p1).omega))
const workCurve=Array.from({length:181},(_,i)=>4*(1-Math.cos(i*TAU/180)))
const marker=(color:string)=>'url(#'+props.id+'-'+color+'-arrow)'
</script>
<template>
  <g v-if="kind==='friction'">
    <g :transform="'translate(80 390) rotate('+(-p1)+')'">
      <rect x="0" y="0" width="480" height="24" :fill="'url(#'+id+'-metal)'" class="outline"/>
      <rect x="0" y="8" width="480" height="16" :fill="'url(#'+id+'-hatch)'"/>
      <rect :x="280-friction.distance*90" y="-44" width="100" height="44" rx="5" :fill="'url(#'+id+'-blue)'" class="outline"/>
      <rect :x="290-friction.distance*90" y="-39" width="80" height="4" fill="var(--metal-a)" opacity=".5"/>
    </g>
    <path :d="linePath([plane.c,{x:plane.c.x,y:plane.c.y+friction.weight*1.2}])" class="red-line vector" :marker-end="marker('red')"/>
    <path :d="linePath([plane.q,{x:plane.q.x+plane.n.x*friction.normal*1.2,y:plane.q.y+plane.n.y*friction.normal*1.2}])" class="green-line vector" :marker-end="marker('green')"/>
    <path v-if="friction.friction>.00001" :d="linePath([plane.q,{x:plane.q.x+plane.e.x*friction.friction*1.2,y:plane.q.y+plane.e.y*friction.friction*1.2}])" class="amber-line vector" :marker-end="marker('amber')"/>
    <circle :cx="plane.c.x" :cy="plane.c.y" r="3" fill="var(--red)"/>
    <text :x="plane.c.x+10" :y="plane.c.y+132" class="red-text label">G</text>
    <text :x="plane.q.x+plane.n.x*friction.normal*1.2-24" :y="plane.q.y+plane.n.y*friction.normal*1.2" class="green-text label">N</text>
    <text :x="plane.q.x+plane.e.x*friction.friction*1.2+8" :y="plane.q.y+plane.e.y*friction.friction*1.2" class="amber-text label">Ff</text>
    <path v-if="overlay" d="M80 417H555" class="axis"/><text x="85" y="454">G = 98.1 N · 斜面倾角 {{ p1 }}°</text>
    <text x="85" y="482" class="small">接触合力作用点随摩擦力移动，使滑块不发生转动。</text>
    <g transform="translate(660 65)">
      <text class="small">状态判断：G sinα 与 μsN 比较</text><text y="40" class="metric" :class="friction.staticState?'green-text':'red-text'">{{ friction.staticState?'保持静止':'向下滑动' }}</text>
      <text y="93">N = {{ friction.normal.toFixed(1) }} N</text><text y="125">Ff = {{ friction.friction.toFixed(1) }} N</text><text y="157" class="small">静摩擦上限 μsN = {{ friction.limit.toFixed(1) }} N</text>
      <text y="210" class="metric blue-text">a = {{ friction.acceleration.toFixed(2) }} m/s²</text>
      <text y="252">t = {{ (elapsed*.6).toFixed(2) }} s</text><text y="283">s = {{ friction.distance.toFixed(3) }} m</text>
      <text y="330" class="small">{{ friction.staticState?'静摩擦自动抵消沿坡重力分量。':'动摩擦采用 μk = 0.8μs，方向向上。' }}</text>
      <text y="359" class="small">调整倾角，观察起滑临界点。</text>
      <text y="412" class="tiny">忽略空气阻力，接触面无黏着。</text>
    </g>
  </g>
  <g v-else-if="kind==='inertia'">
    <rect x="220" y="207" width="335" height="12" :fill="'url(#'+id+'-metal)'" class="outline"/>
    <rect x="220" y="273" width="335" height="15" :fill="'url(#'+id+'-metal)'" class="outline"/>
    <rect x="220" y="288" width="335" height="12" :fill="'url(#'+id+'-hatch)'"/>
    <path v-if="overlay" d="M35 245H555" class="axis"/>
    <circle cx="115" cy="245" r="88" class="bearing"/>
    <circle cx="115" cy="245" r="70" :fill="'url(#'+id+'-metal)'" class="outline"/>
    <rect :x="positions.B.x-30" y="220" width="60" height="52" rx="5" :fill="'url(#'+id+'-green)'" class="outline"/>
    <path :d="linePath([positions.O,positions.A])" class="rod-shadow"/><path :d="linePath([positions.O,positions.A])" class="rod"/>
    <path :d="linePath([positions.A,positions.B])" class="rod-shadow"/><path :d="linePath([positions.A,positions.B])" class="rod" style="stroke:var(--metal-a)"/>
    <g v-for="p in [positions.O,positions.A,positions.B]"><circle :cx="p.x" :cy="p.y" r="10" class="joint"/><circle :cx="p.x" :cy="p.y" r="4" class="bolt"/></g>
    <path :d="'M'+positions.B.x+' 165h'+dynamics.force*4.5" class="blue-line vector" :marker-end="Math.abs(dynamics.force)>.005?marker('blue'):undefined"/>
    <path :d="'M'+positions.B.x+' 333h'+dynamics.inertia*4.5" class="red-line vector" stroke-dasharray="6 4" :marker-end="Math.abs(dynamics.inertia)>.005?marker('red'):undefined"/>
    <text :x="positions.B.x-40" y="144" class="blue-text">合外力 ΣFx</text><text :x="positions.B.x-40" y="363" class="red-text">惯性力 FI</text>
    <text x="90" y="439">ΣFx = ma　　FI = −ma</text><text x="90" y="471" class="small">蓝箭头是真实合外力；红色虚箭头是动态静力法引入的惯性力。</text>
    <g transform="translate(660 65)">
      <text class="small">滑块的瞬时运动状态</text><text y="40" class="metric">{{ (dynamics.x*1000).toFixed(1) }} mm</text>
      <text y="89">v = {{ dynamics.v.toFixed(3) }} m/s</text><text y="122">a = {{ dynamics.a.toFixed(3) }} m/s²</text><text y="155" class="red-text">FI = {{ dynamics.inertia.toFixed(2) }} N</text>
      <g transform="translate(0 221)"><LabChart :values="inertiaCurve" :phase="phase" label="一个周期内的 FI / N" :height="90" color="red"/></g>
      <text y="370" class="small">输入转速加倍，加速度与惯性力</text><text y="397" class="small">在相同位形增大至原来的四倍。</text>
    </g>
  </g>
  <g v-else-if="kind==='balance'">
    <path d="M100 407H500" class="ground"/><rect x="100" y="409" width="400" height="15" :fill="'url(#'+id+'-hatch)'"/>
    <path d="M230 404L260 270H320L350 404Z" class="bearing"/>
    <g :transform="'translate(290 235) rotate('+angle+')'">
      <circle r="155" :fill="'url(#'+id+'-metal)'" class="outline"/><circle r="135" class="fine"/>
      <circle v-for="n in 8" :cx="110*Math.cos(n*Math.PI/4)" :cy="110*Math.sin(n*Math.PI/4)" r="14" class="bore"/>
      <circle r="25" class="bore"/>
      <path v-if="overlay" d="M0 0H120" class="axis"/>
      <circle cx="120" r="19" fill="var(--red)" class="outline"/><circle cx="120" r="5" class="bolt"/>
      <g :transform="'rotate('+p2+')'"><rect x="72" :y="-8-p1*10" width="36" :height="16+p1*20" rx="4" fill="var(--green)" class="outline"/><circle cx="90" r="5" class="bolt"/></g>
    </g>
    <path v-if="balance.force>.00001" :d="'M290 235l'+balance.residual.x*2100+' '+balance.residual.y*2100" class="amber-line vector" :marker-end="marker('amber')"/>
    <text x="85" y="459" class="red-text">红：0.6 kg × 80 mm</text><text x="328" y="459" class="green-text">绿：配重 × 60 mm</text><text x="85" y="485" class="small">橙色合矢量归零时，原偏心量被配重抵消。</text>
    <g transform="translate(660 65)">
      <text class="small">残余不平衡惯性力 / 600 r/min</text><text y="40" class="metric" :class="balance.force<.01?'green-text':'amber-text'">{{ balance.force.toFixed(2) }} N</text>
      <text y="93">配重质量 {{ p1.toFixed(2) }} kg</text><text y="125">配重相位 {{ p2 }}°</text><text y="174" class="small">U = Σmr　　F = |U|ω²</text>
      <g transform="translate(124 277)">
        <circle v-if="overlay" r="79" class="axis"/>
        <path :d="'M0 0l'+balance.u.x*1400+' '+balance.u.y*1400" class="red-line vector" :marker-end="marker('red')"/>
        <path v-if="p1>0" :d="'M'+balance.u.x*1400+' '+balance.u.y*1400+'l'+balance.c.x*1400+' '+balance.c.y*1400" class="green-line vector" :marker-end="marker('green')"/>
        <path v-if="balance.force>.00001" :d="'M0 0l'+balance.residual.x*1400+' '+balance.residual.y*1400" class="amber-line vector" :marker-end="marker('amber')"/>
      </g>
      <text y="391" class="small">试试 0.80 kg、180° 的组合。</text><text y="420" class="tiny">薄盘静平衡模型；长转子还需力偶平衡。</text>
    </g>
  </g>
  <g v-else-if="kind==='flywheel'">
    <rect x="87" y="368" width="473" height="28" rx="6" :fill="'url(#'+id+'-metal)'" class="outline"/>
    <path d="M220 366L250 260H330L360 366Z" class="bearing"/>
    <g :transform="'translate(290 220) rotate('+angle+')'">
      <circle r="146" :fill="'url(#'+id+'-metal)'" class="outline"/>
      <circle r="119" class="bore"/>
      <g v-for="k in 6" :transform="'rotate('+k*60+')'"><path d="M20 -12L125 -17V17L20 12Z" :fill="'url(#'+id+'-metal)'" class="outline"/></g>
      <circle r="35" :fill="'url(#'+id+'-blue)'" class="outline"/><circle r="14" class="bore"/><circle cx="134" r="5" fill="var(--amber)"/>
    </g>
    <rect x="128" y="425" width="330" height="19" rx="5" class="panel"/>
    <rect x="128" y="425" :width="flywheel.work/8*330" height="19" rx="5" fill="var(--green)"/>
    <text x="128" y="473">本周期储存的额外动能 {{ flywheel.work.toFixed(2) }} J</text>
    <g transform="translate(660 57)">
      <text class="small">瞬时角速度 / rad·s⁻¹</text><text y="38" class="metric blue-text">{{ flywheel.omega.toFixed(3) }}</text>
      <text y="77">Md − Mr = {{ (flywheel.driving-flywheel.resisting).toFixed(2) }} N·m</text>
      <g transform="translate(0 128)"><LabChart :values="workCurve" :phase="phase" :min="0" :max="8" label="盈亏功 ΔW / J" :height="65" color="green"/></g>
      <g transform="translate(0 251)"><LabChart :values="flyCurve" :phase="phase" :min="10" :max="12.2" label="角速度 ω / (rad/s)" :height="65"/></g>
      <text y="371">不均匀系数 δ = {{ flywheel.delta.toFixed(4) }}</text><text y="405" class="small">增加 J，相同盈亏功引起的速度波动变小。</text>
      <text y="435" class="tiny">相位慢放；精确数值取自能量方程。</text>
    </g>
  </g>
  <g v-else-if="kind==='coriolis'">
    <g transform="translate(235 275)">
      <circle v-if="overlay" r="200" class="axis"/><path v-if="overlay" d="M-210 0H220M0 -210V210" class="axis"/>
      <g :transform="'rotate('+(-cor.theta*180/Math.PI)+')'">
        <rect x="-40" y="-20" width="245" height="40" rx="20" :fill="'url(#'+id+'-blue)'" class="outline"/>
        <rect x="15" y="-8" width="177" height="16" rx="8" class="bore"/>
        <rect :x="cor.r-13" y="-17" width="26" height="34" rx="4" :fill="'url(#'+id+'-green)'" class="outline"/>
        <circle :cx="cor.r" r="5" class="bolt"/><circle r="12" class="joint"/>
      </g>
      <path :d="'M'+cor.p.x+' '+(-cor.p.y)+'l'+(-cor.p.x/cor.r*cor.normal*.5)+' '+(cor.p.y/cor.r*cor.normal*.5)" class="blue-line vector" :marker-end="marker('blue')"/>
      <path v-if="p1!==0" :d="'M'+cor.p.x+' '+(-cor.p.y)+'l'+(-Math.sin(cor.theta)*cor.coriolis*.5)+' '+(-Math.cos(cor.theta)*cor.coriolis*.5)" class="amber-line vector" :marker-end="marker('amber')"/>
      <text :x="cor.p.x+12" :y="-cor.p.y+25" class="label">滑块 P</text><text x="-18" y="32" class="label">O</text>
    </g>
    <text x="70" y="461">蓝：牵连向心加速度　橙：哥氏加速度</text><text x="70" y="490" class="small">u 变为负值时，滑块向内运动，哥氏加速度方向随之反转。</text>
    <g transform="translate(660 65)">
      <text class="small">t = {{ (elapsed*2).toFixed(2) }} s · ω = 1.5 rad/s</text><text y="42" class="metric">r = {{ cor.r.toFixed(1) }} mm</text>
      <text y="95">相对速度 u = {{ p1 }} mm/s</text><text y="131">牵连速度 ωr = {{ cor.transport.toFixed(1) }} mm/s</text>
      <text y="192" class="blue-text">an = ω²r = {{ cor.normal.toFixed(1) }} mm/s²</text>
      <text y="230" class="amber-text">ac = 2ωu = {{ cor.coriolis.toFixed(1) }} mm/s²</text>
      <text y="289" class="small">相对加速度 ar = 0（u 为常量）</text><text y="330">a = an + ac</text>
      <text y="383" class="small">导杆逆时针转，向外滑动时，</text><text y="410" class="small">ac 沿相对速度逆时针转 90°。</text>
    </g>
  </g>
</template>
