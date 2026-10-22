<script setup lang="ts">
import { useId } from 'vue'
import DiagramFrame from './DiagramFrame.vue'
import { gearPair, chainGeometry, sliderCrank, camGeometry, fourbarGeometry, gearGeometry, arcPath, linePath, point, rad, solveFourbar, quickReturnGeometry } from '../utils/mechanics.mjs'
defineProps<{ type: string; title?: string; caption?: string }>()
const id = `eng-${useId().replace(/:/g, '')}`
const arrow = (color: string) => `url(#${id}-${color})`
const mesh = gearPair(), chain = chainGeometry(), velocity = sliderCrank(), cam = camGeometry(), fourbar = fourbarGeometry()
const vp = { x: 515, y: 200 }, va = { x: vp.x + velocity.vA.x * 2, y: vp.y + velocity.vA.y * 2 }, vb = { x: vp.x + velocity.vB.x * 2, y: vp.y }
const ring = gearGeometry(280, 255, 72, 4, 0, true)
const sun = gearGeometry(280, 255, 24, 4)
const planets = [0, 120, 240].map(deg => { const p = point(280, 255, 96, rad(deg)); return gearGeometry(p.x, p.y, 24, 4, rad(deg) + Math.PI / 24) })
const metadata: Record<string, string> = {
  gear: '渐开线齿轮：啮合几何与力的方向', chain: '滚子链：链轮啮合、节距与多边形效应', force: '滑块受力：作用点、合力与摩擦极限',
  geartrain: '行星轮系：齿数、装配与传动比', velocity: '曲柄滑块：位置图与速度图一一对应', cam: '滚子凸轮：理论轮廓与真实接触', fourbar: '曲柄摇杆：按杆长计算的位置与轨迹', wedge: '斜面受力：法线、摩擦与静止条件', involute: '渐开线：发生线与基圆的几何约束', 'linkage-types': '四种连杆机构：类型取决于杆长与机架', quick: '急回：从同一机构的两次共线位置求极位', 'slider-angle': '曲柄滑块：压力角与导轨方向'
}
const wedgeAngle = rad(20), wedgeQ = {x:245,y:335-165*Math.tan(wedgeAngle)}
const wedgeS = {x:245,y:wedgeQ.y-35/Math.cos(wedgeAngle)}
const wedgeN = {x:wedgeQ.x-100*Math.cos(wedgeAngle)*Math.sin(wedgeAngle)*1.5,y:wedgeQ.y-100*Math.cos(wedgeAngle)**2*1.5}
const wedgeF = {x:wedgeQ.x+100*Math.sin(wedgeAngle)*Math.cos(wedgeAngle)*1.5,y:wedgeQ.y-100*Math.sin(wedgeAngle)**2*1.5}
const invT = .95, invO = {x:215,y:265}, invR = 100
const invAt = (t:number) => ({x:invO.x+invR*(Math.cos(t)+t*Math.sin(t)),y:invO.y-invR*(Math.sin(t)-t*Math.cos(t))})
const invB = {x:invO.x+invR*Math.cos(invT),y:invO.y-invR*Math.sin(invT)}, invK = invAt(invT)
const invCurve = linePath(Array.from({length:121},(_,i)=>invAt(i*1.35/120)))
const quick = quickReturnGeometry()
const classifications = [
  {name:'曲柄摇杆',lengths:{a:64,b:185,c:130,d:220},note:'最短杆邻接机架，蓝杆整转、绿杆摆动'},
  {name:'双曲柄',lengths:{a:185,b:130,c:220,d:64},note:'最短杆作机架，两根连架杆均可整转'},
  {name:'双摇杆',lengths:{a:140,b:120,c:150,d:220},note:'120 + 220 > 140 + 150，两连架杆摆动'}
].map(item => ({...item, pose:solveFourbar(item.lengths,rad(65),{x:55,y:245})}))
</script>

<template>
  <DiagramFrame :title="title || metadata[type]" :caption="caption">
    <svg class="eng" :viewBox="`0 0 840 ${['chain','gear','linkage-types'].includes(type) ? 690 : 500}`" role="img" :aria-labelledby="`${id}-title ${id}-desc`" :data-engineering-diagram="type">
      <title :id="`${id}-title`">{{ metadata[type] }}</title>
      <desc :id="`${id}-desc`">{{ caption }} 可使用图上方放大按钮查看结构和标注。</desc>
      <defs>
        <marker v-for="color in ['blue','amber','green','purple','ink']" :id="`${id}-${color}`" :key="color" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M1 1 9 5 1 9Z" :class="`fill-${color}`" /></marker>
        <pattern :id="`${id}-grid`" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" class="grid" /></pattern>
        <pattern :id="`${id}-hatch`" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8L8 0" class="hatching" /></pattern>
        <linearGradient :id="`${id}-metal`" x1="0" y1="0" x2="1" y2="1"><stop offset="0" class="metal-light"/><stop offset="1" class="metal-dark"/></linearGradient>
      </defs>
      <rect width="840" height="700" :fill="`url(#${id}-grid)`" />

      <template v-if="type === 'gear'">
        <text class="panel-title" x="28" y="36">01 / 同模数、20° 标准外啮合</text>
        <text class="muted" x="28" y="62">m = 2 mm · z₁ = 24 · z₂ = 36 · a = 60 mm</text>
        <g v-for="(g, i) in [mesh.g1, mesh.g2]" :key="i">
          <path :d="g.path" :fill="`url(#${id}-metal)`" class="gear-outline" />
          <circle :cx="g.cx" :cy="g.cy" :r="g.rf - 16" class="rim" />
          <circle v-for="n in 6" :key="n" :cx="g.cx + (g.r*.54)*Math.cos(n*Math.PI/3)" :cy="g.cy + (g.r*.54)*Math.sin(n*Math.PI/3)" :r="g.r*.115" class="cutout" />
          <circle :cx="g.cx" :cy="g.cy" :r="g.r*.27" class="hub" />
          <circle :cx="g.cx" :cy="g.cy" :r="g.r*.14" class="cutout" />
          <rect :x="g.cx-4" :y="g.cy-g.r*.14-4" width="8" height="9" class="cutout" />
          <circle :cx="g.cx" :cy="g.cy" :r="g.r" class="pitch" />
          <circle :cx="g.cx" :cy="g.cy" :r="g.rb" class="base-circle" />
          <path :d="`M${g.cx-10} ${g.cy}h20M${g.cx} ${g.cy-10}v20`" class="center" />
        </g>
        <path d="M74 230H585" class="center" />
        <path d="M290 74V410" class="construction" />
        <path :d="mesh.loa" class="amber dashed" />
        <path :d="mesh.contact" class="contact-segment" />
        <path :d="linePath([{x:200,y:230},mesh.T1])" class="construction" />
        <path :d="linePath([{x:425,y:230},mesh.T2])" class="construction" />
        <circle :cx="mesh.T1.x" :cy="mesh.T1.y" r="3" class="fill-amber" />
        <circle :cx="mesh.T2.x" :cy="mesh.T2.y" r="3" class="fill-amber" />
        <circle cx="290" cy="230" r="4.5" class="fill-green" />
        <text :x="mesh.T1.x-28" :y="mesh.T1.y-10" class="small halo">N₁</text><text :x="mesh.T2.x+8" :y="mesh.T2.y+14" class="small halo">N₂</text>
        <circle v-for="p in [mesh.B1,mesh.B2]" :cx="p.x" :cy="p.y" r="3" class="fill-green"/><text :x="mesh.B1.x+8" :y="mesh.B1.y+17" class="small halo">B₁</text><text :x="mesh.B2.x-24" :y="mesh.B2.y-8" class="small halo">B₂</text>
        <text x="301" y="223" class="bold halo">P</text><text x="175" y="266" class="bold halo">O₁</text><text x="432" y="267" class="bold halo">O₂</text>
        <path :d="arcPath(290,230,70,-Math.PI/2-rad(20),-Math.PI/2)" class="purple" />
        <text x="265" y="145" class="purple-text halo">α = 20°</text>
        <path :d="arcPath(200,230,110,rad(210),rad(260))" class="blue" :marker-end="arrow('blue')" />
        <path :d="arcPath(425,230,156,rad(24),rad(-22))" class="green" :marker-end="arrow('green')" />
        <text x="78" y="122" class="blue-text">ω₁ ↻</text><text x="562" y="168" class="green-text">ω₂ ↺</text>
        <path d="M200 336V407M425 383V407M200 398H425" class="dimension" />
        <text x="270" y="424" class="muted">中心距 a</text>
        <g transform="translate(617 99)">
          <text class="bold" x="0" y="0">读图顺序</text>
          <path d="M0 30H38" class="pitch"/><text x="48" y="35">分度圆</text>
          <path d="M0 67H38" class="base-circle"/><text x="48" y="72">基圆</text>
          <path d="M0 104H38" class="amber dashed"/><text x="48" y="109">啮合线</text>
          <path d="M0 141H38" class="contact-segment"/><text x="48" y="146">实际啮合段</text>
          <text x="0" y="201" class="small">α 从公切线量起</text>
          <text x="0" y="226" class="small">啮合线与两基圆相切</text>
          <text x="0" y="269" class="bold">i₁₂ = −36 / 24</text>
          <text x="0" y="295" class="green-text">重合度 εα ≈ {{ mesh.contactRatio.toFixed(2) }}</text>
        </g>
        <path d="M28 448H812" class="divider" />
        <text class="panel-title" x="28" y="480">02 / 节点处，主动轮受到的啮合力</text>
        <path d="M200 626V522" class="blue" :marker-end="arrow('blue')" />
        <path d="M200 626H162.15" class="amber" :marker-end="arrow('amber')" />
        <path d="M200 626 162.15 522" class="purple" :marker-end="arrow('purple')" />
        <path d="M162.15 626V522H200" class="construction" />
        <text x="210" y="562" class="blue-text">Fₜ₁</text><text x="150" y="649" class="amber-text">Fᵣ₁</text><text x="128" y="526" class="purple-text">Fₙ₁</text>
        <text x="305" y="529" class="bold">Fₜ₁ = 2T₁ / d₁　　Fᵣ₁ = Fₜ₁ tan α</text>
        <text x="305" y="564">Fₜ₁ 向上，阻碍主动轮顺时针转动。</text>
        <text x="305" y="596">Fᵣ₁ 指向轮心，Fₙ₁ 沿啮合线。</text>
        <text x="305" y="628">从动轮受大小相等、方向相反的力。</text>
        <text x="28" y="675" class="small">齿侧按渐开线计算；齿根过渡为示意。忽略摩擦，力矢量使用统一比例尺。</text>
      </template>

      <template v-else-if="type === 'chain'">
        <text class="panel-title" x="28" y="36">01 / 滚子嵌入齿槽，链板连接相邻销轴</text>
        <text class="muted" x="28" y="64">等齿数示例 z₁ = z₂ = 18 · p = 12.7 mm · 链节数 42 · i = 1</text>
        <g v-for="(g, i) in [chain.left, chain.right]" :key="i">
          <path :d="g.path" :fill="`url(#${id}-metal)`" class="gear-outline" />
          <circle :cx="g.cx" :cy="g.cy" r="48" class="rim" />
          <circle v-for="n in 5" :key="n" :cx="g.cx+42*Math.cos(n*Math.PI*2/5)" :cy="g.cy+42*Math.sin(n*Math.PI*2/5)" r="10" class="cutout" />
          <circle :cx="g.cx" :cy="g.cy" r="21" class="hub" /><circle :cx="g.cx" :cy="g.cy" r="11" class="cutout" />
          <circle :cx="g.cx" :cy="g.cy" :r="g.r" class="pitch" />
          <path :d="`M${g.cx-110} ${g.cy}h220M${g.cx} ${g.cy-105}v210`" class="center" />
          <path :d="arcPath(g.cx,g.cy,59,rad(210),rad(145))" class="green" :marker-end="arrow('green')" />
        </g>
        <path v-for="(link,i) in chain.links" :key="`plate-${i}`" :d="linePath([link.a,link.b])" :class="link.outer ? 'outer-plate' : 'inner-plate'" />
        <g v-for="(p,i) in chain.pins" :key="`pin-${i}`"><circle :cx="p.x" :cy="p.y" r="8.4" class="roller"/><circle :cx="p.x" :cy="p.y" r="3" class="pin" /></g>
        <text x="133" y="246" class="bold halo">主动轮 ↺</text><text x="469" y="246" class="bold halo">从动轮 ↺</text>
        <path d="M380 110H310" class="blue" :marker-end="arrow('blue')" /><text x="386" y="115" class="blue-text">v · 上边为紧边</text>
        <text x="310" y="332" class="muted">下边为松边（此图省略垂度）</text>
        <path d="M640 145H748" class="leader"/><text x="658" y="174" class="small">蓝色：外链板</text><text x="658" y="204" class="small">灰色：内链板</text><text x="658" y="234" class="small">外圈：滚子</text><text x="658" y="264" class="small">中心：销轴</text>
        <path d="M185 352V375M521 352V375M185 367H521" class="dimension" /><text x="280" y="394" class="muted">a = 12p = 152.4 mm</text>
        <path d="M28 419H812" class="divider" />
        <text class="panel-title" x="28" y="452">02 / 节距看销轴中心，不能沿圆弧量</text>
        <g transform="translate(24 8)">
          <path d="M62 540H146" class="large-outer"/><path d="M146 540H230" class="large-inner"/><path d="M230 540H314" class="large-outer"/>
          <g v-for="x in [62,146,230,314]" :key="x"><circle :cx="x" cy="540" r="21" class="roller"/><circle :cx="x" cy="540" r="7" class="pin"/></g>
          <path d="M62 500V473M146 500V473M62 481H146" class="dimension"/><text x="96" y="474" class="blue-text">p</text>
          <text x="62" y="591" class="small">内、外链节交替</text><text x="62" y="617" class="small">滚子可在套筒上转动，销轴连接外链板</text>
        </g>
        <path d="M410 453V651" class="divider" />
        <text x="451" y="488" class="bold">d = p / sin(π / z)</text>
        <text x="451" y="522">销轴中心位于分度圆上，链节形成弦。</text>
        <text x="451" y="556">链轮匀速旋转，链速仍会周期变化。</text>
        <text x="451" y="590" class="blue-text">v̄ = zpn / 60000（p：mm）</text>
        <text x="451" y="622" class="small">一般传动比：n₁ / n₂ = z₂ / z₁</text>
        <text x="28" y="674" class="small">齿槽按滚子位置构造；齿顶过渡为结构示意。实际布置应留出松边垂度和张紧调整量。</text>
      </template>

      <template v-else-if="type === 'force'">
        <text x="28" y="36" class="panel-title">01 / 滑块隔离体：未达到静摩擦极限</text>
        <text x="28" y="65" class="muted">G = 100 N · P = 30 N · μₛ = 0.40</text>
        <rect x="80" y="183" width="250" height="117" rx="5" class="machine" />
        <path d="M48 300H391" class="structure" /><rect x="48" y="301" width="343" height="18" :fill="`url(#${id}-hatch)`" />
        <circle cx="205" cy="230" r="4" class="fill-ink"/><text x="182" y="221">S</text>
        <path d="M205 230V370" class="ink" :marker-end="arrow('ink')" /><text x="119" y="366">G = 100 N</text>
        <path d="M330 230H372" class="blue" :marker-end="arrow('blue')" /><text x="322" y="212" class="blue-text">P = 30 N</text>
        <path d="M226 300V160" class="green" :marker-end="arrow('green')" /><text x="238" y="165" class="green-text">N = 100 N</text>
        <path d="M226 300H184" class="amber" :marker-end="arrow('amber')" /><text x="59" y="287" class="amber-text">Ff = 30 N</text>
        <circle cx="226" cy="300" r="4" class="fill-purple" /><text x="235" y="326">C</text>
        <path d="M205 384H226M205 376V391M226 376V391" class="dimension" /><text x="240" y="391" class="small">接触合力作用点向右偏移</text>
        <text x="38" y="433" class="small">N · e = P · h　（h 为推力到接触面的高度）</text>
        <text x="38" y="461" class="small">C 仍在底面内，才可能维持无倾覆平衡。</text>
        <path d="M431 28V470" class="divider" />
        <text x="464" y="36" class="panel-title">02 / 合力必须满足矢量闭合</text>
        <path d="M600 170L680 370L760 170" class="cone" />
        <path d="M680 370V170" class="green" :marker-end="arrow('green')" />
        <path d="M680 370H620" class="amber" :marker-end="arrow('amber')" />
        <path d="M680 370 620 170" class="purple" :marker-end="arrow('purple')" />
        <path d="M620 370V170H680" class="construction" />
        <text x="692" y="201" class="green-text">N</text><text x="612" y="393" class="amber-text">Ff</text><text x="596" y="162" class="purple-text">R</text>
        <path :d="arcPath(680,370,84,-Math.PI/2-Math.atan(.3),-Math.PI/2)" class="purple" /><text x="645" y="271" class="purple-text">θ</text>
        <text x="491" y="88" class="bold">R⃗ = N⃗ + F⃗f　　|R| = 104.4 N</text>
        <text x="491" y="119" class="small">实线合力位于虚线摩擦锥边界以内。</text>
        <text x="491" y="434" class="small">θ = arctan(30/100) = 16.7°</text>
        <text x="491" y="463" class="small">φₛ = arctan μₛ = 21.8°　　θ &lt; φₛ</text>
      </template>

      <template v-else-if="type === 'geartrain'">
        <text x="28" y="36" class="panel-title">01 / 24–24–72，同模数 2K-H 轮系</text>
        <path :d="`${arcPath(280,255,167,0,Math.PI)} ${arcPath(280,255,167,Math.PI,2*Math.PI)} Z ${ring.path}`" fill-rule="evenodd" :fill="`url(#${id}-metal)`" class="gear-outline" />
        <circle cx="280" cy="255" r="144" class="pitch" />
        <path :d="sun.path" :fill="`url(#${id}-metal)`" class="gear-outline" /><circle cx="280" cy="255" r="48" class="pitch" />
        <g v-for="(p,i) in planets" :key="i"><path :d="p.path" :fill="`url(#${id}-metal)`" class="gear-outline"/><circle :cx="p.cx" :cy="p.cy" r="48" class="pitch"/><circle :cx="p.cx" :cy="p.cy" r="26" class="rim"/></g>
        <path v-for="(p,i) in planets" :key="`arm-${i}`" :d="`M280 255L${p.cx} ${p.cy}`" class="carrier" />
        <circle v-for="(p,i) in planets" :key="`axle-${i}`" :cx="p.cx" :cy="p.cy" r="8" class="hub" /><circle cx="280" cy="255" r="15" class="hub" />
        <path d="M112 255H448M280 83V427" class="center" />
        <path d="M421 153H494M369 255H494M284 303L455 368H494" class="leader" />
        <text x="507" y="158" class="bold">内齿圈 3：z₃ = 72，固定</text>
        <text x="507" y="260" class="bold">行星轮 2：z₂ = 24，共 3 个</text>
        <text x="507" y="373" class="bold">行星架 H：输出</text>
        <text x="39" y="455" class="blue-text">太阳轮 1：z₁ = 24，输入</text>
        <text x="507" y="192" class="small">同心：72 = 24 + 2 × 24</text>
        <text x="507" y="294" class="small">等分装配：(24 + 72) / 3 = 32</text>
        <text x="507" y="408" class="green-text">ω₁ / ωH = 1 + 72 / 24 = 4</text>
        <text x="507" y="441" class="small">太阳轮、行星架同向，行星架更慢。</text>
        <text x="28" y="484" class="small">橙色透明支臂位于齿轮端面外侧；此图为沿轴线观察的投影，根部过渡为示意。</text>
      </template>

      <template v-else-if="type === 'velocity'">
        <text x="28" y="36" class="panel-title">01 / 同一瞬时的曲柄滑块机构</text>
        <path d="M50 314H391M283 265H389" class="structure" />
        <rect :x="velocity.B.x-22" :y="velocity.B.y-20" width="44" height="40" rx="4" class="machine" />
        <path :d="linePath([velocity.O,velocity.A])" class="link-blue"/><path :d="linePath([velocity.A,velocity.B])" class="link-steel" />
        <path :d="linePath([velocity.O,{x:390,y:290}])" class="center" />
        <circle v-for="(p,i) in [velocity.O,velocity.A,velocity.B]" :key="i" :cx="p.x" :cy="p.y" r="7" class="joint" />
        <text x="69" y="284">O</text><text :x="velocity.A.x-18" :y="velocity.A.y-12">A</text><text :x="velocity.B.x-4" :y="velocity.B.y+51">B</text>
        <path :d="linePath([velocity.A,{x:velocity.A.x+velocity.vA.x,y:velocity.A.y+velocity.vA.y}])" class="blue" :marker-end="arrow('blue')" />
        <path :d="linePath([velocity.B,{x:velocity.B.x+velocity.vB.x*.65,y:velocity.B.y}])" class="green" :marker-end="arrow('green')" />
        <text x="207" y="247" class="blue-text halo">vA</text><text x="378" y="273" class="green-text halo">vB</text>
        <path :d="arcPath(90,290,49,rad(205),rad(272))" class="amber" :marker-end="arrow('amber')" /><text x="49" y="213" class="amber-text">ω₁ ↻</text>
        <text x="46" y="380" class="small">vA ⟂ OA；vB 沿水平导轨。</text><text x="46" y="411" class="small">同一构件 AB：vBA ⟂ AB。</text>
        <path d="M441 60V448" class="divider" />
        <text x="475" y="36" class="panel-title">02 / 将矢量平移，方向保持一致</text>
        <path :d="linePath([vp,va])" class="blue" :marker-end="arrow('blue')"/><path :d="linePath([va,vb])" class="amber" :marker-end="arrow('amber')"/><path :d="linePath([vp,vb])" class="green" :marker-end="arrow('green')"/>
        <text :x="vp.x-22" :y="vp.y-12">p</text><text :x="va.x-7" :y="va.y+25">a</text><text :x="vb.x+8" :y="vb.y-12">b</text>
        <text x="550" y="274" class="blue-text halo">vA</text><text x="685" y="266" class="amber-text halo">vBA</text><text x="588" y="184" class="green-text halo">vB</text>
        <text x="475" y="380" class="bold">p→a + a→b = p→b</text><text x="475" y="411">v⃗B = v⃗A + v⃗BA</text>
        <text x="28" y="477" class="small">位置由杆长闭环求解；速度由同一位形解析求导，两个面板的向量方向严格对应。</text>
      </template>

      <template v-else-if="type === 'cam'">
        <text x="28" y="36" class="panel-title">01 / 对心直动滚子从动件</text>
        <path :d="cam.body" :fill="`url(#${id}-metal)`" class="gear-outline" />
        <path :d="cam.pitch" class="purple dashed" />
        <circle :cx="cam.cx" :cy="cam.cy" :r="cam.base" class="base-circle" />
        <path d="M265 70V448M86 285H433" class="center" />
        <circle cx="265" cy="285" r="17" class="hub"/><circle cx="265" cy="285" r="7" class="cutout"/>
        <rect x="239" y="78" width="52" height="40" rx="3" class="machine" /><path :d="`M265 53V${cam.p.y}`" class="follower" />
        <circle :cx="cam.p.x" :cy="cam.p.y" :r="cam.roller" class="roller"/><circle :cx="cam.p.x" :cy="cam.p.y" r="4" class="pin" />
        <circle :cx="cam.q.x" :cy="cam.q.y" r="4" class="fill-green" />
        <path :d="linePath([{x:cam.q.x-cam.normal.x*53,y:cam.q.y-cam.normal.y*53},{x:cam.q.x+cam.normal.x*120,y:cam.q.y+cam.normal.y*120}])" class="amber dashed" />
        <path d="M334 168V78" class="green" :marker-end="arrow('green')"/><text x="347" y="99" class="green-text">vB</text>
        <path :d="`M${cam.q.x} ${cam.q.y}H397V197`" class="leader"/><text x="355" y="221" class="small">接触点 Q</text>
        <text x="289" :y="cam.p.y-9" class="purple-text halo">B</text><text x="281" y="309">O</text>
        <path :d="linePath([{x:265,y:285},point(265,285,88,rad(140))])" class="dimension"/><text x="195" y="353" class="amber-text">r₀</text>
        <path :d="arcPath(265,285,165,rad(200),rad(160))" class="blue" :marker-end="arrow('blue')"/><text x="60" y="310" class="blue-text">ω ↺</text>
        <path d="M462 64V451" class="divider" />
        <text x="495" y="86" class="bold">理论轮廓：滚子中心 B 的轨迹</text>
        <text x="495" y="122" class="small">实际轮廓沿法线向内偏移滚子半径。</text>
        <text x="495" y="159" class="small">Q、B 在同一公法线上，滚子与凸轮相切。</text>
        <text x="495" y="211" class="bold">压力角 α ≈ {{ cam.alpha.toFixed(1) }}°</text>
        <text x="495" y="245">从动件速度方向与公法线的夹角。</text>
        <text x="495" y="296" class="purple-text">图示轮廓：rB = 110 + 22(1 − cos φ)</text>
        <text x="495" y="331" class="small">滚子半径 22；长度均为绘图单位。</text>
        <text x="495" y="376" class="small">这是整周期余弦示例，不含休止段。</text>
        <text x="495" y="410" class="small">工程设计另需检查曲率、载荷和接触。</text>
        <text x="28" y="478" class="small">基圆与轮廓按同一组参数计算；此图 e = 0。偏置从动件需要按其实际导轨重新求包络。</text>
      </template>

      <template v-else-if="type === 'fourbar'">
        <text x="28" y="36" class="panel-title">01 / 真实杆长闭环与连杆点轨迹</text>
        <g transform="translate(-15 20) scale(1.22)">
          <path d="M83 311H379" class="structure"/><rect x="83" y="312" width="296" height="13" :fill="`url(#${id}-hatch)`"/>
          <path :d="fourbar.trace" class="purple dashed"/>
          <path :d="linePath([fourbar.A,fourbar.C,fourbar.B],true)" class="coupler"/>
          <path :d="linePath([fourbar.O1,fourbar.A])" class="link-blue"/><path :d="linePath([fourbar.A,fourbar.B])" class="link-steel"/><path :d="linePath([fourbar.B,fourbar.O2])" class="link-green"/>
          <path :d="linePath([fourbar.O1,fourbar.O2])" class="center"/>
          <circle v-for="(p,i) in [fourbar.O1,fourbar.A,fourbar.B,fourbar.O2]" :key="i" :cx="p.x" :cy="p.y" r="7" class="joint"/>
          <circle :cx="fourbar.C.x" :cy="fourbar.C.y" r="4" class="fill-purple"/>
          <text x="94" y="294">O₁</text><text x="349" y="295">O₂</text><text :x="fourbar.A.x-21" :y="fourbar.A.y-6">A</text><text :x="fourbar.B.x+10" :y="fourbar.B.y">B</text><text :x="fourbar.C.x+7" :y="fourbar.C.y-10">C</text>
          <path :d="arcPath(120,300,44,rad(205),rad(275))" class="blue" :marker-end="arrow('blue')"/>
        </g>
        <text x="525" y="118" class="bold">a = 64　b = 185</text><text x="525" y="151" class="bold">c = 130　d = 220</text>
        <text x="525" y="204">64 + 220 &lt; 185 + 130</text>
        <text x="525" y="241" class="small">最短杆 a 的邻杆 d 固定，可整周输入。</text>
        <text x="525" y="285" class="purple-text">C 点虚线由 360 个位形计算。</text>
        <text x="525" y="327" class="green-text">当前传动角 γ ≈ {{ fourbar.gamma.toFixed(1) }}°</text>
        <text x="525" y="366" class="small">γ 取连杆与输出杆夹角中的锐角。</text>
        <text x="28" y="476" class="small">杆长、轨迹和传动角来自同一闭环模型；轨迹穿过当前 C 点，不使用任意装饰曲线。</text>
      </template>

      <template v-else-if="type === 'wedge'">
        <text x="28" y="36" class="panel-title">01 / 只有重力与接触力，静止在粗糙斜面上</text>
        <path d="M80 335L450 200.33V355H80Z" class="machine"/>
        <path d="M90 365H450" class="structure"/><rect x="90" y="366" width="360" height="12" :fill="`url(#${id}-hatch)`"/>
        <g :transform="`translate(${wedgeS.x} ${wedgeS.y}) rotate(-20)`"><rect x="-50" y="-35" width="100" height="70" rx="4" :fill="`url(#${id}-metal)`" class="gear-outline"/></g>
        <path :d="linePath([wedgeS,{x:wedgeS.x,y:wedgeS.y+150}])" class="purple" :marker-end="arrow('purple')"/>
        <path :d="linePath([wedgeQ,wedgeN])" class="blue" :marker-end="arrow('blue')"/><path :d="linePath([wedgeQ,wedgeF])" class="amber" :marker-end="arrow('amber')"/>
        <circle :cx="wedgeS.x" :cy="wedgeS.y" r="4" class="fill-ink"/><circle :cx="wedgeQ.x" :cy="wedgeQ.y" r="4" class="fill-green"/>
        <text x="258" y="398" class="purple-text halo">G = 100 N</text><text x="170" y="124" class="blue-text halo">N = 94.0 N</text><text x="308" y="246" class="amber-text halo">Ff = 34.2 N</text>
        <text x="260" :y="wedgeS.y-8" class="small halo">质心 S</text><text x="263" :y="wedgeQ.y+20" class="small halo">接触合力作用点</text>
        <path :d="arcPath(80,335,72,rad(-20),0)" class="green"/><text x="155" y="324" class="green-text halo">α = 20°</text>
        <path d="M475 75V432" class="divider"/>
        <text x="508" y="100" class="bold">N 垂直斜面，Ff 沿斜面向上。</text>
        <text x="508" y="142">N = G cos α</text><text x="508" y="177">Ff = G sin α ≤ μsN</text>
        <text x="508" y="227" class="bold">μs = 0.50，φs = 26.6°</text><text x="508" y="264" class="green-text">α &lt; φs，能保持静止。</text>
        <text x="508" y="310" class="small">三个力的矢量和为零；接触合力</text><text x="508" y="335" class="small">竖直通过质心，力矩也平衡。</text>
        <text x="508" y="382" class="small">达到 α = φs 时处于临界滑动。</text><text x="508" y="407" class="small">外加推力时须重新列平衡方程。</text>
        <text x="28" y="477" class="small">假设接触充分、摩擦因数恒定且不倾覆。图中静摩擦未达到 μsN，不能直接令 Ff = μsN。</text>
      </template>
      <template v-else-if="type === 'involute'">
        <text x="28" y="36" class="panel-title">01 / 拉紧的直线沿基圆无滑动展开</text>
        <circle :cx="invO.x" :cy="invO.y" :r="invR" class="base-circle"/>
        <path :d="invCurve" class="blue"/><path :d="linePath([invO,invB,invK,invO])" class="construction"/>
        <path :d="linePath([invB,invK])" class="amber"/>
        <path :d="arcPath(invO.x,invO.y,invR,0,-invT)" class="green"/>
        <path :d="arcPath(invO.x,invO.y,48,-invT,-invT+Math.atan(invT))" class="purple"/>
        <circle v-for="p in [invO,invB,invK]" :cx="p.x" :cy="p.y" r="4" class="fill-blue"/>
        <text x="195" y="286">O</text><text :x="invB.x-17" :y="invB.y-10">B</text><text :x="invK.x+10" :y="invK.y+5">K</text>
        <text x="235" y="212" class="small halo">rb</text><text x="300" y="275" class="small halo">rK</text><text x="285" y="208" class="amber-text halo">发生线 BK</text><text x="261" y="239" class="purple-text halo">αK</text>
        <text x="311" y="319" class="blue-text">渐开线</text>
        <text x="70" y="414" class="small">OB ⟂ BK；展开弧长 = BK = rb · t。</text>
        <path d="M466 75V430" class="divider"/>
        <text x="501" y="112" class="bold">由同一个展开参数 t 计算：</text><text x="501" y="155">rK = rb √(1 + t²)</text><text x="501" y="195">tan αK = t</text><text x="501" y="235" class="green-text">rb = rK cos αK</text>
        <text x="501" y="290" class="small">发生线同时是渐开线在 K 点的法线。</text><text x="501" y="320" class="small">法线始终与基圆相切。</text>
        <text x="501" y="366" class="small">图示 t = 0.95 rad，αK ≈ 43.5°。</text><text x="501" y="399" class="small">基圆内不存在渐开线。</text>
        <text x="28" y="478" class="small">K 随展开参数形成齿廓；B 是当下的基圆切点。三角形 OBK 的 O 点角等于压力角 αK。</text>
      </template>
      <template v-else-if="type === 'linkage-types'">
        <g v-for="(item,i) in classifications" :key="item.name" :transform="`translate(${i%2*420} ${Math.floor(i/2)*330})`">
          <text x="25" y="35" class="panel-title">{{ item.name }}</text>
          <g transform="translate(15 25) scale(.88)">
            <path :d="linePath([item.pose.O1,item.pose.O2])" class="center"/>
            <path :d="`M${item.pose.O1.x-15} 256h30M${item.pose.O2.x-15} 256h30`" class="structure"/>
            <path :d="linePath([item.pose.O1,item.pose.A])" class="link-blue"/><path :d="linePath([item.pose.A,item.pose.B])" class="link-steel"/><path :d="linePath([item.pose.B,item.pose.O2])" class="link-green"/>
            <circle v-for="p in [item.pose.O1,item.pose.A,item.pose.B,item.pose.O2]" :cx="p.x" :cy="p.y" r="6" class="joint"/>
            <text :x="item.pose.A.x-15" :y="item.pose.A.y-13">A</text><text :x="item.pose.B.x+8" :y="item.pose.B.y-7">B</text>
            <text :x="item.pose.O1.x-12" y="280">O₁</text><text :x="item.pose.O2.x-12" y="280">O₂</text>
          </g>
          <text x="25" y="291" class="small">a={{item.lengths.a}} · b={{item.lengths.b}} · c={{item.lengths.c}} · d={{item.lengths.d}}</text><text x="25" y="315" class="small">{{item.note}}</text>
        </g>
        <g transform="translate(420 330)">
          <text x="25" y="35" class="panel-title">曲柄滑块</text>
          <g transform="translate(15 -15) scale(.9)"><path d="M180 265H405M180 315H405" class="structure"/><rect :x="velocity.B.x-20" y="267" width="40" height="46" rx="3" class="machine"/><path :d="linePath([velocity.O,velocity.A])" class="link-blue"/><path :d="linePath([velocity.A,velocity.B])" class="link-steel"/><circle v-for="p in [velocity.O,velocity.A,velocity.B]" :cx="p.x" :cy="p.y" r="6" class="joint"/></g>
          <text x="25" y="291" class="small">r = 80 · l = 205 · e = 0</text><text x="25" y="315" class="small">转动副 + 移动副，行程为 2r = 160。</text>
        </g>
        <path d="M420 20V651M20 335H820" class="divider"/>
        <text x="25" y="679" class="small">所有位置由标注杆长求解；a = O₁A，b = AB，c = BO₂，d = O₁O₂。长度单位 mm。</text>
      </template>

      <template v-else-if="type === 'quick'">
        <text x="28" y="36" class="panel-title">01 / 相同杆长，两组真实极位</text>
        <g transform="translate(-25 -35) scale(1.35)">
          <path :d="linePath([quick.O1,quick.O2])" class="center"/><circle :cx="quick.O1.x" :cy="quick.O1.y" :r="quick.a" class="pitch"/>
          <path d="M98 311H142M318 311H362" class="structure"/>
          <g v-for="(pose,i) in [quick.extended,quick.folded]" :key="i">
            <path :d="linePath([quick.O1,pose.A])" :class="i ? 'link-green' : 'link-blue'"/><path :d="linePath([pose.A,pose.B,quick.O2])" :class="i ? 'green dashed' : 'blue'"/>
            <circle v-for="p in [pose.A,pose.B]" :cx="p.x" :cy="p.y" r="5" class="joint"/>
            <text :x="pose.A.x-25" :y="pose.A.y-8" class="small halo">A{{i+1}}</text><text :x="pose.B.x+8" :y="pose.B.y-8" class="small halo">B{{i+1}}</text>
          </g>
          <circle v-for="p in [quick.O1,quick.O2]" :cx="p.x" :cy="p.y" r="6" class="joint"/>
          <path :d="arcPath(quick.O1.x,quick.O1.y,96,-quick.extended.phi,-quick.folded.phi)" class="purple"/><text x="210" y="238" class="purple-text halo">θ</text>
          <text x="93" y="302">O₁</text><text x="347" y="302">O₂</text>
        </g>
        <path d="M494 72V440" class="divider"/>
        <text x="523" y="106" class="bold">a = 64 · b = 185 · c = 130 · d = 220</text>
        <text x="523" y="148">展开极位：O₁B₁ = a + b</text><text x="523" y="184">折叠极位：O₁B₂ = b − a</text>
        <text x="523" y="230" class="purple-text">极位夹角 θ = {{quick.difference.toFixed(1)}}°</text><text x="523" y="264">摇杆摆角 ψ = {{quick.swing.toFixed(1)}}°</text>
        <text x="523" y="308" class="bold">K = (180° + θ) / (180° − θ)</text><text x="523" y="344" class="green-text">K ≈ {{quick.ratio.toFixed(3)}}</text>
        <text x="523" y="390" class="small">曲柄匀速时，长转角对应慢行程。</text><text x="523" y="415" class="small">极位处摇杆瞬时角速度为零。</text>
        <text x="28" y="478" class="small">两组位置的 a、b、c、d 完全相同。θ 是两条共线方向的偏差，不是工作行程的整个输入转角。</text>
      </template>
      <template v-else-if="type === 'slider-angle'">
        <text x="28" y="36" class="panel-title">01 / 对心滑块，导轨水平，连杆传力沿 AB</text>
        <g transform="translate(20 -20) scale(1.2)">
          <path d="M180 265H405M180 315H405" class="structure"/><path d="M90 290H430" class="center"/>
          <rect :x="velocity.B.x-20" y="267" width="40" height="46" rx="4" class="machine"/>
          <path :d="linePath([velocity.O,velocity.A])" class="link-blue"/><path :d="linePath([velocity.A,velocity.B])" class="link-steel"/>
          <path :d="`M${velocity.B.x} 290v-110`" class="construction"/>
          <path :d="arcPath(velocity.B.x,290,75,Math.PI,Math.atan2(velocity.A.y-290,velocity.A.x-velocity.B.x)+2*Math.PI)" class="purple"/>
          <path :d="arcPath(velocity.B.x,290,45,Math.atan2(velocity.A.y-290,velocity.A.x-velocity.B.x),-Math.PI/2)" class="green"/>
          <circle v-for="p in [velocity.O,velocity.A,velocity.B]" :cx="p.x" :cy="p.y" r="6" class="joint"/>
          <text x="70" y="280">O</text><text :x="velocity.A.x-15" :y="velocity.A.y-15">A</text><text :x="velocity.B.x+6" y="340">B</text>
          <text :x="velocity.B.x-90" y="279" class="purple-text halo">α</text><text :x="velocity.B.x-33" y="242" class="green-text halo">γ</text>
        </g>
        <path d="M520 72V440" class="divider"/>
        <text x="550" y="115" class="bold">r = 80 · l = 205 · e = 0</text><text x="550" y="160">压力角 α ≈ 18.6°</text><text x="550" y="199" class="green-text">传动角 γ = 90° − α ≈ 71.4°</text>
        <text x="550" y="256" class="small">α：连杆方向与水平导轨的锐角。</text><text x="550" y="292" class="small">γ：连杆方向与导轨法线的锐角。</text><text x="550" y="350" class="small">理想二力连杆假设下，α 越大，</text><text x="550" y="377" class="small">相同推力对应的导轨侧向力越大。</text>
        <text x="28" y="478" class="small">本图与上方实验台的曲柄滑块采用同一组杆长；偏置机构需加入实际偏心距 e 求解。</text>
      </template>
    </svg>
  </DiagramFrame>
</template>

<style scoped>
.eng { --blue:#176aba; --amber:#a85b0d; --green:#147756; --purple:#7650b5; --ink:var(--vp-c-text-1); --steel:#778a9f; --paper:var(--vp-c-bg); background:var(--paper); }
:global(.dark .eng) { --blue:#82baff; --amber:#f0b56d; --green:#72d4ad; --purple:#c1a6fa; --steel:#92a8c2; }
text { font:16px var(--vp-font-family-base); fill:var(--ink); } .small,.muted { font-size:13px; fill:var(--vp-c-text-2); } .panel-title { font-size:17px; font-weight:650; } .bold { font-weight:650; } .halo { paint-order:stroke; stroke:var(--paper); stroke-width:4px; stroke-linejoin:round; }
.grid { fill:none; stroke:var(--vp-c-divider); stroke-width:.4; opacity:.35; } .divider { stroke:var(--vp-c-divider); stroke-width:1; }
.metal-light { stop-color:var(--steel); stop-opacity:.28; } .metal-dark { stop-color:var(--steel); stop-opacity:.07; }
.gear-outline { stroke:var(--steel); stroke-width:1.7; stroke-linejoin:round; } .rim { fill:none; stroke:var(--steel); stroke-width:1; opacity:.6; }
.cutout,.hub,.joint { fill:var(--paper); stroke:var(--steel); stroke-width:1.5; } .hub { stroke-width:2.5; } .joint { stroke:var(--blue); stroke-width:2.6; }
.pitch { fill:none; stroke:var(--blue); stroke-width:1.35; stroke-dasharray:8 4 2 4; }
.base-circle { fill:none; stroke:var(--amber); stroke-width:1.2; stroke-dasharray:3 5; }
.center { fill:none; stroke:var(--steel); stroke-width:.8; stroke-dasharray:13 4 2 4; opacity:.65; }
.construction,.dimension,.leader { fill:none; stroke:var(--steel); stroke-width:1; } .construction { stroke-dasharray:4 5; } .dimension { stroke-width:1.2; }
.blue,.amber,.green,.purple,.ink { fill:none; stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; }
.blue { stroke:var(--blue); }.amber { stroke:var(--amber); }.green { stroke:var(--green); }.purple { stroke:var(--purple); }.ink { stroke:var(--ink); }
.fill-blue,.blue-text { fill:var(--blue); }.fill-amber,.amber-text { fill:var(--amber); }.fill-green,.green-text { fill:var(--green); }.fill-purple,.purple-text { fill:var(--purple); }.fill-ink { fill:var(--ink); }
.dashed { stroke-dasharray:6 5; }.contact-segment { stroke:var(--green); stroke-width:6; stroke-linecap:round; }
.outer-plate,.inner-plate { stroke:var(--blue); stroke-width:15; stroke-linecap:round; } .inner-plate { stroke:var(--steel); stroke-width:12; }
.large-outer,.large-inner { stroke:var(--blue); stroke-width:47; stroke-linecap:round; } .large-inner { stroke:var(--steel); stroke-width:36; }
.roller { fill:var(--paper); stroke:var(--steel); stroke-width:2.5; } .pin { fill:var(--steel); stroke:var(--paper); stroke-width:1; }
.machine { fill:color-mix(in srgb,var(--steel) 12%,var(--paper)); stroke:var(--steel); stroke-width:2; } .structure { fill:none; stroke:var(--steel); stroke-width:2.5; } .hatching { stroke:var(--steel); stroke-width:1; opacity:.5; }
.cone { fill:color-mix(in srgb,var(--amber) 7%,transparent); stroke:var(--amber); stroke-width:1.5; stroke-dasharray:5 5; }
.carrier { stroke:var(--amber); stroke-width:15; stroke-linecap:round; opacity:.6; }
.link-blue,.link-green,.link-steel { fill:none; stroke-width:12; stroke-linecap:round; }.link-blue { stroke:var(--blue); }.link-green { stroke:var(--green); }.link-steel { stroke:var(--steel); }
.follower { stroke:var(--steel); stroke-width:10; }.coupler { fill:color-mix(in srgb,var(--purple) 8%,transparent); stroke:var(--purple); stroke-width:1.5; }
</style>
