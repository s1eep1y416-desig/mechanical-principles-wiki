<script setup lang="ts">
import {useId} from 'vue'
import DiagramFrame from './DiagramFrame.vue'
import MachineDefs from './labs/MachineDefs.vue'
import GearWheel from './labs/GearWheel.vue'
import HelicalGear from './labs/HelicalGear.vue'
import {gearGeometry,point,linePath,rad,solveFourbar} from '../utils/mechanics.mjs'
import './labs/mechanism-labs.css'
const props=defineProps<{type:string;caption?:string}>()
const id='plate-'+useId().replace(/:/g,'')
const titles:Record<string,string>={
  system:'从电机到执行件：看见完整传动链',mobility:'拆开四杆机构：构件、转动副与自由度',instant:'纯滚动轮的瞬心与速度场',
  gearstructure:'齿轮结构剖读：齿廓、轮毂、键与轴',helical:'斜齿轮：螺旋线、法面与轴向力',belt:'带传动：包角、张紧与转矩传递',frames:'2R 机械臂的局部坐标系',
  'motion-pairs':'运动副结构与接触部位', 'cam-types':'推杆端部结构与接触形式','rotor-balance':'单面与双面平衡：力平衡还不够','intermittent':'棘轮与槽轮：驱动件、止回件和锁止件','robot-arm':'六轴机械臂：手臂定位与手腕定向'
}
const bar=solveFourbar({a:64,b:185,c:130,d:220},rad(62),{x:160,y:310})
const ratchet=linePath(Array.from({length:24},(_,i)=>[point(0,0,95,i*Math.PI/12),point(0,0,78,i*Math.PI/12+.02),point(0,0,78,i*Math.PI/12+.12)]).flat(),true)
const gear=gearGeometry(0,0,28,7,0)
const beltAngle=Math.asin(35/275)
const beltPts=[{x:150-55*Math.sin(beltAngle),y:220-55*Math.cos(beltAngle)},{x:425-90*Math.sin(beltAngle),y:220-90*Math.cos(beltAngle)},{x:425-90*Math.sin(beltAngle),y:220+90*Math.cos(beltAngle)},{x:150-55*Math.sin(beltAngle),y:220+55*Math.cos(beltAngle)}]
const beltPath='M'+beltPts[0].x+' '+beltPts[0].y+'L'+beltPts[1].x+' '+beltPts[1].y+'A90 90 0 1 1 '+beltPts[2].x+' '+beltPts[2].y+'L'+beltPts[3].x+' '+beltPts[3].y+'A55 55 0 0 1 '+beltPts[0].x+' '+beltPts[0].y+'Z'
const robotPts=[{x:220,y:410},{x:220,y:320},{x:310,y:155},{x:485,y:199},{x:524,y:220},{x:557,y:239},{x:583,y:255}]
const marker=(c:string)=>'url(#'+id+'-'+c+'-arrow)'
</script>
<template>
  <DiagramFrame :title="titles[type]" :caption="caption">
    <svg class="lab-svg detail-plate" viewBox="0 0 960 530" role="img" :aria-label="titles[type]" :data-detail-plate="type">
      <MachineDefs :id="id"/><rect width="960" height="530" :fill="'url(#'+id+'-grid)'"/>
      <template v-if="type==='system'">
        <text x="40" y="48" class="heading">动力源 → 传动机构 → 执行机构</text>
        <g transform="translate(55 140)">
          <rect x="0" y="45" width="140" height="116" rx="20" :fill="'url(#'+id+'-blue)'" class="outline"/>
          <ellipse cx="140" cy="103" rx="22" ry="58" :fill="'url(#'+id+'-metal)'" class="outline"/>
          <path v-for="i in 7" :d="'M'+(10+i*14)+' 62V145'" class="fine"/>
          <rect x="133" y="93" width="65" height="20" :fill="'url(#'+id+'-metal)'" class="outline"/><rect x="13" y="160" width="120" height="13" class="bearing"/>
          <text x="24" y="210">电动机</text><text x="0" y="238" class="small">电能 → 轴上的转矩与转速</text>
        </g>
        <rect x="295" y="110" width="287" height="240" rx="20" class="panel"/>
        <GearWheel :id="id" :z="24" :m="4.5" :x="371" :y="216" :phase="-Math.PI/48" tint="blue"/>
        <GearWheel :id="id" :z="36" :m="4.5" :x="506" :y="216" :phase="Math.PI-Math.PI/72" tint="green"/>
        <text x="348" y="388">齿轮减速器</text><text x="325" y="416" class="small">转速下降，理想输出转矩增大</text>
        <g transform="translate(665 90)">
          <path d="M0 210H230M140 80V235M206 80V235" class="ground"/>
          <circle cx="30" cy="150" r="40" :fill="'url(#'+id+'-metal)'" class="outline"/><circle cx="30" cy="150" r="8" class="bolt"/>
          <path d="M30 150L49 115L175 169" class="rod-shadow"/><path d="M30 150L49 115L175 169" class="rod"/>
          <rect x="143" y="152" width="60" height="40" rx="4" :fill="'url(#'+id+'-green)'" class="outline"/>
          <circle cx="49" cy="115" r="8" class="joint"/><circle cx="175" cy="169" r="8" class="joint"/>
          <text x="24" y="298">曲柄滑块执行件</text><text x="0" y="326" class="small">转动 → 往复运动与工作力</text>
        </g>
        <path :d="d" v-for="d in ['M240 80H285','M585 80H645']" class="green-line vector" :marker-end="marker('green')"/>
        <text x="42" y="482" class="small">结构层：零件装成构件　运动层：运动副形成约束　能量层：输入功克服负载与损耗</text>
      </template>
      <template v-else-if="type==='mobility'">
        <text x="40" y="47" class="heading">四个构件 · 四个转动副 · 一个自由度</text>
        <path d="M125 325H415" class="ground"/><rect x="125" y="326" width="290" height="15" :fill="'url(#'+id+'-hatch)'"/>
        <path :d="linePath([bar.O1,bar.A])" class="rod-shadow"/><path :d="linePath([bar.O1,bar.A])" class="rod"/>
        <path :d="linePath([bar.A,bar.B])" class="rod-shadow"/><path :d="linePath([bar.A,bar.B])" class="rod" style="stroke:var(--metal-a)"/>
        <path :d="linePath([bar.B,bar.O2])" class="rod-shadow"/><path :d="linePath([bar.B,bar.O2])" class="rod" style="stroke:var(--green)"/>
        <g v-for="p in [bar.O1,bar.A,bar.B,bar.O2]"><circle :cx="p.x" :cy="p.y" r="12" class="joint"/><circle :cx="p.x" :cy="p.y" r="5" class="bolt"/></g>
        <text x="113" y="365">机架 0</text><text x="157" y="246" class="blue-text label">1</text><text x="294" y="192" class="label">2</text><text x="393" y="263" class="green-text label">3</text>
        <g transform="translate(560 100)">
          <text class="heading">把运动构件分别拿出来看</text>
          <g v-for="(name,i) in ['输入曲柄','中间连杆','输出摇杆']" :transform="'translate(0 '+(48+i*82)+')'">
            <path :d="'M20 0H'+(i===1?195:135)" class="rod-shadow"/><path :d="'M20 0H'+(i===1?195:135)" class="rod" :style="'stroke:var(--'+(['blue','metal-a','green'][i])+')'"/>
            <circle cx="20" r="8" class="joint"/><circle :cx="i===1?195:135" r="8" class="joint"/>
            <text x="232" y="5" class="small">{{ name }}</text>
          </g>
          <text y="306" class="metric">F = 3×3 − 2×4 = 1</text>
        </g>
        <text x="70" y="472" class="small">一个销轴可以由多件零件组成；自由度计算按“相对不动的构件”计数，不按零件数计数。</text>
      </template>
      <template v-else-if="type==='instant'">
        <text x="40" y="47" class="heading">纯滚动轮：接触点 P 是瞬时速度中心</text>
        <circle cx="270" cy="265" r="125" :fill="'url(#'+id+'-metal)'" class="outline"/>
        <circle cx="270" cy="265" r="105" class="bore"/><circle cx="270" cy="265" r="22" class="joint"/>
        <g v-for="a in [0,60,120]" :transform="'translate(270 265) rotate('+a+')'"><path d="M-105 0H105" class="rod" style="stroke:var(--metal-a);stroke-width:10"/></g>
        <path d="M88 390H550" class="ground"/><rect x="88" y="391" width="462" height="18" :fill="'url(#'+id+'-hatch)'"/>
        <path d="M270 265H395" class="blue-line vector" :marker-end="marker('blue')"/><path d="M270 140H520" class="green-line vector" :marker-end="marker('green')"/>
        <circle cx="270" cy="390" r="6" fill="var(--red)"/><text x="280" y="420" class="red-text label">P：vP = 0</text>
        <text x="303" y="250" class="blue-text label">vO = ωR</text><text x="339" y="123" class="green-text label">vA = 2ωR</text>
        <g transform="translate(640 121)"><text class="metric">vQ = ω × PQ</text><text y="52">速度方向垂直于 PQ</text><text y="88">速度大小正比于 |PQ|</text><text y="145" class="small">O 在 P 上方 R，顶点 A 在 P 上方 2R。</text><text y="178" class="small">同一角速度对应不同的线速度。</text><text y="244" class="small">瞬心只是这一瞬间速度为零的位置，</text><text y="274" class="small">并不意味着接触点加速度也为零。</text></g>
        <text x="70" y="480" class="small">假设轮在固定水平面上无滑动向右滚动，轮体顺时针转动。</text>
      </template>
      <template v-else-if="type==='gearstructure'">
        <text x="40" y="45" class="heading">渐开线齿廓：分度圆、基圆与齿厚共同决定轮齿</text>
        <GearWheel :id="id" :z="28" :m="7" :x="214" :y="245" tint="blue"/>
        <path d="M214 120V90H415M225 245H430M245 280H415" class="dimension"/>
        <text x="431" y="95">齿顶 / 渐开线齿侧</text><text x="442" y="249">轴孔与键槽</text><text x="432" y="287">轮毂与轮辐</text>
        <g transform="translate(635 110)">
          <path d="M0 111H54V120H265V169H54V178H0Z" :fill="'url(#'+id+'-metal)'" class="outline"/>
          <path d="M54 120V92H89V57H172V92H208V120M54 169V197H89V233H172V197H208V169Z" :fill="'url(#'+id+'-blue)'" class="outline"/>
          <path d="M89 57H172V120H89ZM89 169H172V233H89Z" :fill="'url(#'+id+'-hatch)'" opacity=".6"/>
          <rect x="99" y="113" width="62" height="15" rx="3" :fill="'url(#'+id+'-metal)'" class="outline"/>
          <path d="M-15 145H280" class="axis"/>
          <text x="87" y="28" class="small">沿轴线剖开</text><text x="80" y="279" class="small">平键传递转矩，轴肩定位</text>
          <path d="M129 111V73" class="dimension"/><text x="178" y="111" class="small">键</text>
        </g>
        <text x="90" y="430" class="small">z = 28　m = 2 mm（图中同比例放大）</text>
        <text x="90" y="461">d = mz　　da = m(z + 2)　　df = m(z − 2.5)</text>
        <text x="90" y="490" class="tiny">标准全齿高、无变位示例；轴、键与轮毂尺寸仅用于结构辨认。</text>
      </template>
      <template v-else-if="type==='helical'">
        <text x="40" y="45" class="heading">斜齿轮的齿线沿圆柱面绕行，啮合力具有轴向分量</text>
        <g transform="translate(150 160)">
          <HelicalGear :id="id"/>
          <text x="-47" y="245" class="small">结构透视：齿线斜向跨过齿宽</text>
        </g>
        <g transform="translate(500 95)">
          <defs><clipPath :id="id+'-helix-clip'"><rect width="166" height="215"/></clipPath></defs>
          <rect width="166" height="215" :fill="'url(#'+id+'-metal)'" class="outline"/>
          <path v-for="i in 4" :clip-path="'url(#'+id+'-helix-clip)'" :d="'M'+(-60+i*45)+' 215L'+(i*45)+' 0'" class="blue-line" stroke-width="5"/>
          <path d="M90 215V130M90 215L114 129" class="dimension"/><text x="98" y="153" class="amber-text">β</text>
          <text y="252" class="small">分度圆柱面展开</text><text y="284">mn = mt cosβ</text>
        </g>
        <g transform="translate(755 150)">
          <path :d="d" v-for="d in ['M25 110H139','M25 110V0','M25 110L-24 162']" class="vector blue-line" :marker-end="marker('blue')"/>
          <text x="130" y="135">Fa</text><text x="34" y="5">Ft</text><text x="-40" y="185">Fr</text>
          <text x="-25" y="240" class="small">Fa = Ft tanβ</text><text x="-25" y="273" class="small">Fr = Ft tanαt</text>
        </g>
        <text x="75" y="465" class="small">β 增大时，轴向力随之增大，需要轴承承担。箭头为分量示意，实际方向由旋向与转向共同确定。</text>
      </template>
      <template v-else-if="type==='belt'">
        <text x="40" y="45" class="heading">带绕在带轮上：摩擦力传递圆周力，张紧决定承载能力</text>
        <g v-for="p in [{x:150,r:55},{x:425,r:90}]">
          <circle :cx="p.x" cy="220" :r="p.r" :fill="'url(#'+id+'-metal)'" class="outline"/><circle :cx="p.x" cy="220" :r="p.r-9" class="fine"/>
          <circle v-for="i in 5" :cx="p.x+p.r*.55*Math.cos(i*Math.PI*2/5)" :cy="220+p.r*.55*Math.sin(i*Math.PI*2/5)" :r="p.r*.13" class="bore"/>
          <circle :cx="p.x" cy="220" r="16" class="joint"/><circle :cx="p.x" cy="220" r="7" class="bolt"/>
        </g>
        <path :d="beltPath" stroke="var(--ink)" stroke-width="11" fill="none"/><path :d="beltPath" stroke="var(--blue)" stroke-width="6" fill="none"/>
        <text x="247" y="124" class="label">紧边 T₁</text><text x="255" y="335" class="label">松边 T₂</text>
        <path d="M150 355V375M425 355V375M150 368H425" class="dimension"/><text x="255" y="400" class="small">中心距 a</text>
        <g transform="translate(630 107)">
          <text class="metric">Fe = T₁ − T₂</text><text y="48">输出转矩 M = Fe·r</text>
          <text y="105" class="small">忽略滑动时：v = ω₁r₁ = ω₂r₂</text><text y="144" class="small">小轮包角较小，通常先成为限制。</text>
          <path d="M40 210L105 274L170 210" :fill="'url(#'+id+'-metal)'" class="outline"/>
          <path d="M66 211L105 248L144 211Z" fill="var(--blue)" class="outline"/>
          <text x="3" y="315" class="small">V 带截面：两侧面与轮槽接触</text>
        </g>
        <text x="70" y="476" class="small">带会产生弹性滑动；链条和同步带靠啮合传动，不能套用普通摩擦带的全部结论。</text>
      </template>
      <template v-else-if="type==='frames'">
        <text x="40" y="45" class="heading">每根杆都有自己的局部坐标系：变换按运动链依次相乘</text>
        <path d="M150 365L265 165L488 235" class="rod-shadow"/><path d="M150 365L265 165L488 235" class="rod"/>
        <g v-for="(p,i) in [[150,365,-60],[265,165,-60],[488,235,17.4]]" :transform="'translate('+p[0]+' '+p[1]+')'">
          <circle r="13" class="joint"/><circle r="4" class="bolt"/>
          <g :transform="'rotate('+(i===0?0:p[2])+')'"><path d="M0 0H90" class="red-line vector" :marker-end="marker('red')"/><path d="M0 0V-85" class="green-line vector" :marker-end="marker('green')"/></g>
          <text x="-27" y="33" class="small">O{{ i }}</text>
        </g>
        <g transform="translate(635 127)"><text class="metric">⁰T₂ = ⁰T₁ · ¹T₂</text><text y="56" class="small">列向量约定：从右向左作用。</text><text y="107">局部坐标 → 基坐标</text><text y="144" class="small">⁰p = ⁰T₁ · ¹T₂ · ²p</text><text y="204">平移与旋转通常不能交换顺序。</text><text y="260" class="small">红轴 x，绿轴 y；z 轴垂直图面。</text></g>
        <text x="78" y="470" class="small">这里选用贴附在杆上的平面局部坐标系，用于理解齐次变换；具体 D-H 坐标系需按约定另行建立。</text>
      </template>
      <template v-else-if="type==='motion-pairs'">
        <text x="40" y="45" class="heading">结构画出来，约束才看得清</text>
        <g v-for="(name,i) in ['转动副 R','移动副 P','凸轮 / 滚子高副']" :transform="'translate('+(40+i*310)+' 90)'"><rect width="285" height="360" rx="14" class="panel"/><text x="20" y="32" class="heading">{{ name }}</text></g>
        <g transform="translate(180 260)">
          <rect x="-105" y="-39" width="210" height="78" :fill="'url(#'+id+'-metal)'" class="outline"/>
          <path d="M-75 -39V39M75 -39V39" class="fine"/><rect x="-42" y="-89" width="84" height="178" :fill="'url(#'+id+'-blue)'" class="outline"/>
          <rect x="-29" y="-89" width="58" height="178" :fill="'url(#'+id+'-hatch)'" opacity=".5"/>
          <rect x="-20" y="-40" width="40" height="80" :fill="'url(#'+id+'-metal)'" class="outline"/>
          <path d="M-123 0H125" class="axis"/>
        </g>
        <g transform="translate(490 260)">
          <path d="M-112 72V-5H-55L-28 23H27L55 -5H112V72Z" :fill="'url(#'+id+'-metal)'" class="outline"/>
          <path d="M-66 -35H66V-5L28 23H-28L-66 -5Z" :fill="'url(#'+id+'-green)'" class="outline"/>
          <path d="M-70 -69H70" class="blue-line vector" :marker-start="marker('blue')" :marker-end="marker('blue')"/>
          <path d="M-107 83H107" class="ground"/>
        </g>
        <g transform="translate(800 266)">
          <ellipse cy="35" rx="85" ry="70" :fill="'url(#'+id+'-blue)'" class="outline"/><circle cy="35" r="15" class="bore"/>
          <rect x="-7" y="-119" width="14" height="65" :fill="'url(#'+id+'-metal)'" class="outline"/>
          <circle cy="-54" r="19" :fill="'url(#'+id+'-metal)'" class="outline"/><circle cy="-54" r="6" class="bolt"/>
          <circle cy="-35" r="4" fill="var(--red)"/><path d="M7 -35H106" class="dimension"/>
        </g>
        <text x="60" y="416" class="small">圆柱面接触 · 相对转动</text><text x="368" y="416" class="small">导向面接触 · 相对平移</text><text x="680" y="416" class="small">轮廓局部线接触 · 法向约束</text>
        <text x="66" y="489" class="small">剖面斜线表示实体材料；接触类型按实际三维表面判断，不能把二维图上的点一概称为点接触。</text>
      </template>
      <template v-else-if="type==='cam-types'">
        <text x="40" y="45" class="heading">同一凸轮外形，推杆端部的接触几何各不相同</text>
        <g v-for="(name,i) in ['尖顶推杆','滚子推杆','平底推杆']" :transform="'translate('+(170+i*310)+' 290)'">
          <ellipse rx="87" ry="70" :fill="'url(#'+id+'-blue)'" class="outline"/>
          <circle r="20" :fill="'url(#'+id+'-metal)'" class="outline"/><circle r="8" class="bore"/>
          <rect x="-31" y="-196" width="62" height="35" rx="3" class="bearing"/><path d="M-31 -196H31V-161H-31Z" :fill="'url(#'+id+'-hatch)'" opacity=".4"/>
          <rect x="-7" y="-225" width="14" :height="i===1?139:141" :fill="'url(#'+id+'-metal)'" class="outline"/>
          <path v-if="i===0" d="M-7 -84L0 -70L7 -84Z" :fill="'url(#'+id+'-metal)'" class="outline"/>
          <g v-else-if="i===1"><circle cy="-85" r="15" :fill="'url(#'+id+'-metal)'" class="outline"/><circle cy="-85" r="5" class="bolt"/></g>
          <rect v-else x="-48" y="-84" width="96" height="14" :fill="'url(#'+id+'-metal)'" class="outline"/>
          <circle cy="-70" r="4" fill="var(--red)"/><path d="M0 -240V97" class="axis"/>
          <text x="0" y="115" text-anchor="middle" class="heading">{{ name }}</text>
          <text x="0" y="148" text-anchor="middle" class="small">{{ ['接触应力高、磨损较快','滚子中心沿理论廓线运动','接触点沿平底横向移动'][i] }}</text>
        </g>
        <text x="70" y="494" class="small">此图比较端部结构；实际设计须依据指定的推杆运动规律，分别求包络轮廓并校核压力角与曲率。</text>
      </template>
      <template v-else-if="type==='rotor-balance'">
        <text x="40" y="45" class="heading">静平衡检查合力，动平衡还要检查力偶矩</text>
        <g transform="translate(225 232)">
          <circle r="125" :fill="'url(#'+id+'-metal)'" class="outline"/><circle r="105" class="fine"/><circle r="25" class="bore"/>
          <circle cx="77" cy="-45" r="18" fill="var(--red)" class="outline"/><circle cx="-77" cy="45" r="18" fill="var(--green)" class="outline"/>
          <path d="M0 0L107 -63M0 0L-107 63" class="axis"/>
          <text x="-112" y="173">单平面：Σmr = 0</text>
        </g>
        <g transform="translate(520 105)">
          <rect x="0" y="110" width="350" height="30" :fill="'url(#'+id+'-metal)'" class="outline"/>
          <g v-for="(x,i) in [65,280]"><ellipse :cx="x" cy="125" rx="29" ry="94" :fill="'url(#'+id+'-blue)'" class="outline"/><circle :cx="x" :cy="i?185:65" r="12" fill="var(--red)" class="outline"/></g>
          <path :d="d" v-for="d in ['M65 65V-5','M280 185V255']" class="red-line vector" :marker-end="marker('red')"/>
          <path d="M65 263V283M280 263V283M65 276H280" class="dimension"/><text x="155" y="303">距离 l</text>
          <text x="8" y="342" class="small">等大反向的力分处不同平面：合力为零，力偶不为零。</text>
        </g>
        <text x="68" y="487">双面配重须同时满足 Σmr = 0 与 Σmrl = 0（均为矢量关系）。</text>
      </template>
      <template v-else-if="type==='intermittent'">
        <text x="40" y="45" class="heading">间歇运动的关键：驱动时前进，返回或脱离时可靠保持</text>
        <g transform="translate(240 260)">
          <path :d="ratchet" :fill="'url(#'+id+'-blue)'" class="outline"/><circle r="56" class="fine"/><circle r="18" class="bore"/>
          <path d="M0 0L-105 -81" class="rod-shadow"/><circle cx="-105" cy="-81" r="9" class="joint"/>
          <path d="M-105 -81Q-45 -123 -4 -94L-20 -76" fill="none" stroke="var(--green)" stroke-width="12" stroke-linejoin="round"/>
          <path d="M144 48L88 30L70 42" fill="none" stroke="var(--amber)" stroke-width="11" stroke-linejoin="round"/>
          <circle cx="144" cy="48" r="8" class="joint"/><path d="M127 66H160" class="ground"/>
          <text x="-155" y="-131" class="green-text">驱动棘爪</text><text x="98" y="95" class="amber-text">止回棘爪</text><text x="-50" y="157" class="heading">棘轮机构</text>
        </g>
        <g transform="translate(696 250)">
          <path d="M-115 -115Q-45 -62 0 -95Q45 -62 115 -115Q62 -45 95 0Q62 45 115 115Q45 62 0 95Q-45 62 -115 115Q-62 45 -95 0Q-62 -45 -115 -115Z" :fill="'url(#'+id+'-green)'" class="outline"/>
          <path v-for="a in [45,135,225,315]" :transform="'rotate('+a+')'" d="M40 0H185" stroke="var(--paper)" stroke-width="14"/>
          <circle r="24" :fill="'url(#'+id+'-metal)'" class="outline"/><circle r="11" class="bore"/>
          <circle cx="-169" cy="0" r="35" :fill="'url(#'+id+'-blue)'" class="outline"/><path d="M-169 0L-82 -82" class="rod"/>
          <circle cx="-82" cy="-82" r="7" fill="var(--amber)" class="outline"/><text x="-192" y="90" class="small">拨盘 / 拨销</text><text x="-53" y="167" class="heading">四槽槽轮</text>
        </g>
        <text x="66" y="488" class="small">结构示意：棘爪接触角与支点位置须校核；槽轮的拨销轨迹和驱动区间可在下面的实验台中验证。</text>
      </template>
      <template v-else-if="type==='robot-arm'">
        <text x="40" y="45" class="heading">典型串联六轴机械臂：前三轴定位，后三轴改变工具姿态</text>
        <path d="M145 428L218 391L309 428L236 466Z" :fill="'url(#'+id+'-metal)'" class="outline"/>
        <path d="M145 428V452L236 490V466M236 490L309 452V428" :fill="'url(#'+id+'-metal)'" class="outline"/>
        <path :d="linePath(robotPts)" stroke="var(--metal-c)" stroke-width="54" stroke-linejoin="round" stroke-linecap="round" fill="none"/>
        <path :d="linePath(robotPts)" stroke="var(--blue)" stroke-width="42" stroke-linejoin="round" stroke-linecap="round" fill="none"/>
        <path :d="linePath(robotPts.slice(2,4))" stroke="var(--metal-a)" stroke-width="12" stroke-linecap="round"/>
        <g v-for="(p,i) in robotPts.slice(0,6)"><ellipse :cx="p.x" :cy="p.y" :rx="i<3?31:19" :ry="i<3?24:15" :fill="'url(#'+id+'-metal)'" class="outline"/><circle :cx="p.x" :cy="p.y" :r="i<3?10:6" class="bolt"/><text :x="p.x-47" :y="p.y-24" class="label">q{{ i+1 }}</text></g>
        <g transform="translate(585 255) rotate(29)"><rect x="-4" y="-24" width="24" height="48" class="bearing"/><path d="M20 -17H60V-7M20 17H60V7" class="ground"/></g>
        <g transform="translate(724 117)"><text class="heading">手臂 1–3 轴</text><text y="36" class="small">基座回转 · 肩部 · 肘部</text><text y="102" class="heading">手腕 4–6 轴</text><text y="138" class="small">改变末端工具的方向</text><text y="205">末端位姿 T ∈ SE(3)</text><text y="248" class="small">位置：x、y、z</text><text y="280" class="small">姿态：旋转矩阵 R</text><text y="350" class="tiny">轴布置示意，具体机器人结构各异。</text></g>
      </template>
    </svg>
  </DiagramFrame>
</template>
