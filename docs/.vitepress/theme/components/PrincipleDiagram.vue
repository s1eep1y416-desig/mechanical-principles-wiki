<script setup lang="ts">
defineProps<{ type: 'mobility'|'velocity'|'force'|'balance'|'flywheel'|'fourbar'|'cam'|'gear'|'geartrain'|'scheme'|'robot'; title?: string; caption?: string }>()
</script>

<template>
  <figure class="pd">
    <div class="pd__head"><span>MECHANISM DIAGRAM</span><strong>{{ title }}</strong></div>
    <svg v-if="type === 'mobility'" viewBox="0 0 640 300" role="img" aria-label="平面四杆机构自由度示意图">
      <path class="ground" d="M72 245H570M100 245v24m440-24v24"/><path class="link a" d="M110 240L225 118"/><path class="link b" d="M225 118L435 88"/><path class="link c" d="M435 88L530 240"/>
      <g class="joint"><circle cx="110" cy="240" r="13"/><circle cx="225" cy="118" r="13"/><circle cx="435" cy="88" r="13"/><circle cx="530" cy="240" r="13"/></g>
      <text x="130" y="210">构件 1</text><text x="298" y="87">构件 2</text><text x="465" y="155">构件 3</text><text x="255" y="272">机架 0</text><text class="formula" x="190" y="35">F = 3 × 3 − 2 × 4 = 1</text>
    </svg>
    <svg v-else-if="type === 'velocity'" viewBox="0 0 640 330" role="img" aria-label="构件运动状态与相对速度矢量多边形对照图">
      <defs><marker id="arr-v" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 9 4.5 0 9z"/></marker></defs>
      <path class="panel" d="M310 36V278"/><text class="label-strong" x="34" y="35">① 机构位置图</text><text class="label-strong" x="338" y="35">② 速度多边形</text>
      <path class="ground heavy" d="M40 264H282"/><circle class="joint" cx="82" cy="255" r="11"/><circle class="joint" cx="192" cy="132" r="11"/><circle class="joint" cx="260" cy="205" r="11"/>
      <path class="link a" d="M82 255L192 132"/><path class="link b" d="M192 132L260 205"/><path class="construction" d="M192 132L260 132M260 132V205"/>
      <text class="joint-label" x="58" y="249">O</text><text class="joint-label" x="176" y="116">A</text><text class="joint-label" x="267" y="204">B</text>
      <path class="vec" d="M192 132L258 73" marker-end="url(#arr-v)"/><text class="vector-label" x="261" y="68">v<tspan baseline-shift="sub">A</tspan> ⟂ OA</text>
      <path class="vec sum" d="M260 205L290 176" marker-end="url(#arr-v)"/><text class="vector-label" x="245" y="166">v<tspan baseline-shift="sub">B</tspan></text>
      <path class="motion" d="M45 205A55 55 0 0 1 96 181" marker-end="url(#arr-v)"/><text class="vector-label" x="38" y="176">ω₁</text>
      <circle class="velocity-origin" cx="352" cy="250" r="4"/><text class="joint-label" x="338" y="272">p</text>
      <path class="vec alt" d="M352 250L505 250" marker-end="url(#arr-v)"/><path class="vec" d="M505 250L447 93" marker-end="url(#arr-v)"/><path class="vec sum" d="M352 250L447 93" marker-end="url(#arr-v)"/>
      <path class="guide" d="M447 93L505 250"/><text class="joint-label" x="510" y="270">a</text><text class="joint-label" x="435" y="83">b</text>
      <text class="vector-label" x="411" y="269">v<tspan baseline-shift="sub">A</tspan></text><text class="vector-label" x="493" y="158">v<tspan baseline-shift="sub">BA</tspan> ⟂ AB</text><text class="vector-label" x="374" y="154">v<tspan baseline-shift="sub">B</tspan></text>
      <text class="formula" x="163" y="316">v<tspan baseline-shift="sub">B</tspan> = v<tspan baseline-shift="sub">A</tspan> + v<tspan baseline-shift="sub">BA</tspan>　　μ<tspan baseline-shift="sub">v</tspan> = 实际速度 / 图上长度</text>
    </svg>
    <svg v-else-if="type === 'force'" viewBox="0 0 640 330" role="img" aria-label="滑块完整隔离体图、摩擦力与摩擦角示意图">
      <defs>
        <marker id="arr-f" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 9 4.5 0 9z"/></marker>
        <pattern id="hatch-f" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8L8 0" class="hatch"/></pattern>
      </defs>
      <path class="panel" d="M318 35V278"/><text class="label-strong" x="32" y="35">① 滑块隔离体</text><text class="label-strong" x="344" y="35">② 接触反力与摩擦角</text>
      <path class="ground heavy" d="M42 242H286"/><rect class="surface-hatch" x="42" y="242" width="244" height="24" fill="url(#hatch-f)"/>
      <rect class="fbd-block" x="94" y="128" width="136" height="112" rx="5"/><circle class="centroid" cx="162" cy="184" r="4"/><text x="172" y="180">S</text>
      <path class="vec" d="M162 128V62" marker-end="url(#arr-f)"/><text class="vector-label" x="171" y="72">N</text>
      <path class="vec sum" d="M162 240V304" marker-end="url(#arr-f)"/><text class="vector-label" x="172" y="300">G</text>
      <path class="vec" d="M230 184H292" marker-end="url(#arr-f)"/><text class="vector-label" x="276" y="173">P</text>
      <path class="vec alt" d="M94 220H34" marker-end="url(#arr-f)"/><text class="vector-label" x="40" y="210">F<tspan baseline-shift="sub">f</tspan></text>
      <path class="motion" d="M100 98H220" marker-end="url(#arr-f)"/><text x="127" y="88">相对运动趋势 v</text>
      <path class="ground heavy" d="M350 242H594"/><rect class="surface-hatch" x="350" y="242" width="244" height="24" fill="url(#hatch-f)"/>
      <circle class="contact-dot" cx="472" cy="242" r="5"/><path class="guide" d="M472 242V62"/>
      <path class="vec" d="M472 242V84" marker-end="url(#arr-f)"/><text class="vector-label" x="482" y="92">N</text>
      <path class="vec alt" d="M472 242H378" marker-end="url(#arr-f)"/><text class="vector-label" x="382" y="231">F<tspan baseline-shift="sub">f</tspan></text>
      <path class="resultant" d="M472 242L389 103" marker-end="url(#arr-f)"/><text class="vector-label" x="382" y="94">R</text>
      <path class="friction-cone" d="M389 103L472 242L555 103"/><path class="angle" d="M472 156A86 86 0 0 0 428 168"/>
      <text class="angle-label" x="440" y="145">φ</text><text x="510" y="188">摩擦锥</text>
      <text class="formula" x="177" y="322">F<tspan baseline-shift="sub">f</tspan> ≤ fN　　tan φ = f　　R = N + F<tspan baseline-shift="sub">f</tspan></text>
    </svg>
    <svg v-else-if="type === 'balance'" viewBox="0 0 640 330" role="img" aria-label="带轴承、轴向距离、两个校正面和不平衡矢量的刚性转子动平衡图">
      <defs><marker id="arr-bal" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8z"/></marker></defs>
      <path class="shaft heavy" d="M56 165H586"/><path class="bearing" d="M80 165L62 215H98ZM544 165L526 215H562Z"/><path class="ground" d="M46 216H114M510 216H578"/>
      <ellipse class="correction-plane" cx="205" cy="165" rx="24" ry="112"/><ellipse class="correction-plane" cx="430" cy="165" rx="24" ry="112"/>
      <circle class="disk-core" cx="205" cy="165" r="10"/><circle class="disk-core" cx="430" cy="165" r="10"/>
      <path class="radius" d="M205 165L168 86M430 165L463 238"/><circle class="mass" cx="168" cy="86" r="14"/><circle class="mass altfill" cx="463" cy="238" r="14"/>
      <path class="imbalance-vector" d="M205 165L158 65" marker-end="url(#arr-bal)"/><path class="imbalance-vector alt-vector" d="M430 165L473 260" marker-end="url(#arr-bal)"/>
      <path class="dim" d="M205 294H430M205 282V305M430 282V305"/><text class="dim-label" x="310" y="316">轴向距离 l</text>
      <text class="label-strong" x="159" y="34">校正面 I</text><text class="label-strong" x="393" y="34">校正面 II</text><text class="vector-label" x="108" y="66">m₁r₁ω²</text><text class="vector-label" x="478" y="270">m₂r₂ω²</text>
      <path class="motion" d="M265 101A70 70 0 0 1 284 141" marker-end="url(#arr-bal)"/><text class="vector-label" x="272" y="90">ω</text>
      <text class="formula" x="115" y="286">Σmᵢrᵢ = 0　　Σmᵢrᵢlᵢ = 0</text>
    </svg>
    <svg v-else-if="type === 'flywheel'" viewBox="0 0 640 300" role="img" aria-label="飞轮调速能量图">
      <path class="axis" d="M55 245H590M70 265V35"/><path class="curve" d="M70 165C125 70 180 70 235 165S345 260 400 165 510 70 565 165"/><path class="mean" d="M70 165H565"/><path class="area" d="M70 165C125 70 180 70 235 165H70Z"/><text x="575" y="184">φ</text><text x="30" y="45">M</text><text x="258" y="92">加速区</text><text x="264" y="226">减速区</text><text class="formula" x="170" y="286">J<tspan baseline-shift="sub">F</tspan> ≈ ΔE<tspan baseline-shift="sub">max</tspan> /(ω²δ)</text>
    </svg>
    <svg v-else-if="type === 'fourbar'" viewBox="0 0 640 330" role="img" aria-label="带杆长、转角、传动角和连杆点轨迹的曲柄摇杆机构图">
      <defs><marker id="arr-4b" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 9 4.5 0 9z"/></marker><pattern id="hatch-4b" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8L8 0" class="hatch"/></pattern></defs>
      <path class="ground heavy" d="M52 259H588"/><rect class="surface-hatch" x="52" y="259" width="536" height="22" fill="url(#hatch-4b)"/>
      <path class="construction" d="M108 252L108 100M530 252L530 92M108 252L530 252"/>
      <path class="coupler-trace" d="M214 151C265 95 350 75 443 121C472 136 491 162 493 191"/>
      <path class="link a" d="M108 252L205 145"/><path class="link b" d="M205 145L425 116"/><path class="link c" d="M425 116L530 252"/>
      <g class="joint"><circle cx="108" cy="252" r="13"/><circle cx="205" cy="145" r="12"/><circle cx="425" cy="116" r="12"/><circle cx="530" cy="252" r="13"/></g>
      <circle class="coupler-point" cx="318" cy="92" r="7"/><path class="thin-link" d="M205 145L318 92L425 116"/>
      <text class="joint-label" x="82" y="244">O₁</text><text class="joint-label" x="185" y="128">A</text><text class="joint-label" x="431" y="105">B</text><text class="joint-label" x="539" y="247">O₂</text><text class="joint-label" x="320" y="78">C</text>
      <path class="motion" d="M64 202A66 66 0 0 1 128 187" marker-end="url(#arr-4b)"/><text class="vector-label" x="53" y="171">ω₁</text>
      <path class="motion output-motion" d="M493 105A86 86 0 0 1 548 151" marker-end="url(#arr-4b)"/><text class="vector-label" x="543" y="118">ψ</text>
      <path class="angle" d="M389 121A38 38 0 0 1 448 148"/><text class="angle-label" x="446" y="137">γ</text>
      <path class="dim" d="M117 220L196 133M222 173L418 147M455 139L520 226M108 298H530"/>
      <text class="dim-label" x="142" y="177">a</text><text class="dim-label" x="315" y="169">b</text><text class="dim-label" x="483" y="187">c</text><text class="dim-label" x="314" y="316">d</text>
      <text class="formula" x="135" y="36">s + l ≤ p + q　　γ = 90° − α</text><text x="226" y="63">C 点轨迹（虚线）</text>
    </svg>
    <svg v-else-if="type === 'cam'" viewBox="0 0 640 330" role="img" aria-label="标出基圆、理论轮廓、滚子、偏置和压力角的盘形凸轮机构图">
      <defs><marker id="arr-cam" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 9 4.5 0 9z"/></marker></defs>
      <path class="axis" d="M50 274H590M187 306V34"/><circle class="base" cx="187" cy="190" r="70"/><circle class="pitch-curve" cx="187" cy="190" r="112"/>
      <path class="cam detailed" d="M117 204C102 142 129 91 187 79C260 64 338 102 379 174C368 217 318 240 266 251C229 280 168 280 133 248C121 237 116 221 117 204Z"/>
      <circle class="center-mark" cx="187" cy="190" r="7"/><path class="center-cross" d="M173 190H201M187 176V204"/><text class="joint-label" x="166" y="218">O</text>
      <path class="guide heavy" d="M376 39V280M426 39V280"/><rect class="guide-block" x="365" y="70" width="72" height="34" rx="3"/><rect class="guide-block" x="365" y="214" width="72" height="34" rx="3"/>
      <path class="follower" d="M401 42V177"/><circle class="roller" cx="401" cy="196" r="22"/><circle class="roller-center" cx="401" cy="196" r="4"/>
      <path class="contact-normal" d="M282 228L455 138" marker-end="url(#arr-cam)"/><path class="velocity-arrow" d="M454 206V92" marker-end="url(#arr-cam)"/>
      <path class="angle" d="M425 161A45 45 0 0 1 446 184"/><text class="angle-label" x="446" y="161">α</text>
      <path class="dim" d="M187 297H401M187 289V305M401 289V305"/><text class="dim-label" x="289" y="318">偏置 e</text>
      <path class="radius" d="M187 190L139 139"/><text class="dim-label" x="137" y="124">r₀</text>
      <path class="motion" d="M92 156A104 104 0 0 1 161 89" marker-end="url(#arr-cam)"/><text class="vector-label" x="77" y="125">ω</text>
      <text x="244" y="68">理论轮廓（虚线）</text><text x="459" y="102">v<tspan baseline-shift="sub">B</tspan></text><text x="458" y="135">公法线 n-n</text>
      <text class="formula" x="281" y="28">v = ω ds/dφ　　a = ω² d²s/dφ²</text>
    </svg>
    <svg v-else-if="type === 'gear'" viewBox="0 0 640 330" role="img" aria-label="带轮齿、齿顶圆、分度圆、基圆、啮合线和压力角的渐开线齿轮啮合图">
      <defs><marker id="arr-gear" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8z"/></marker></defs>
      <g class="gear-body">
        <circle class="dedendum" cx="220" cy="164" r="60"/><circle class="addendum" cx="220" cy="164" r="78"/>
        <rect v-for="i in 18" :key="`g1-${i}`" class="tooth" x="216" y="82" width="8" height="14" rx="1" :transform="`rotate(${i * 20} 220 164)`"/>
        <circle class="pitch" cx="220" cy="164" r="70"/><circle class="base" cx="220" cy="164" r="58"/><circle class="hub" cx="220" cy="164" r="20"/>
      </g>
      <g class="gear-body">
        <circle class="dedendum" cx="400" cy="164" r="98"/><circle class="addendum" cx="400" cy="164" r="118"/>
        <rect v-for="i in 27" :key="`g2-${i}`" class="tooth" x="396" y="42" width="8" height="15" rx="1" :transform="`rotate(${i * (360 / 27)} 400 164)`"/>
        <circle class="pitch" cx="400" cy="164" r="110"/><circle class="base" cx="400" cy="164" r="91"/><circle class="hub" cx="400" cy="164" r="26"/>
      </g>
      <path class="centerline" d="M84 164H566"/><path class="loa" d="M96 246L536 62" marker-end="url(#arr-gear)"/><circle class="point" cx="290" cy="164" r="7"/>
      <path class="angle" d="M335 164A45 45 0 0 0 332 147"/><text class="angle-label" x="338" y="150">α</text>
      <path class="motion" d="M146 118A84 84 0 0 1 172 91" marker-end="url(#arr-gear)"/><path class="motion output-motion" d="M472 90A120 120 0 0 1 500 119" marker-end="url(#arr-gear)"/>
      <text class="vector-label" x="128" y="91">ω₁</text><text class="vector-label" x="503" y="94">ω₂</text>
      <text class="joint-label" x="202" y="170">O₁</text><text class="joint-label" x="382" y="170">O₂</text><text class="joint-label" x="278" y="153">P</text>
      <text x="88" y="268">啮合线 / 公法线</text><text x="76" y="305">—— 齿顶圆　- - 分度圆　··· 基圆</text>
      <text class="formula" x="322" y="315">r<tspan baseline-shift="sub">b</tspan> = r cos α　　i₁₂ = −z₂/z₁</text>
    </svg>
    <svg v-else-if="type === 'geartrain'" viewBox="0 0 640 330" role="img" aria-label="带太阳轮、三个行星轮、内齿圈和行星架的2K-H行星轮系图">
      <defs><marker id="arr-gt" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8z"/></marker></defs>
      <circle class="ring-outer" cx="320" cy="158" r="142"/><circle class="ring-inner" cx="320" cy="158" r="126"/>
      <line v-for="i in 42" :key="`ring-${i}`" class="internal-tooth" x1="320" y1="32" x2="320" y2="45" :transform="`rotate(${i * (360 / 42)} 320 158)`"/>
      <path class="carrier-frame" d="M320 158L405 158M320 158L278 232M320 158L278 84"/>
      <g class="sun-gear"><circle class="gear-fill" cx="320" cy="158" r="45"/><rect v-for="i in 15" :key="`sun-${i}`" class="tooth" x="316" y="105" width="8" height="12" :transform="`rotate(${i * 24} 320 158)`"/><circle class="hub" cx="320" cy="158" r="16"/></g>
      <g v-for="(p, pi) in [{x:405,y:158},{x:278,y:232},{x:278,y:84}]" :key="`planet-${pi}`">
        <circle class="planet-fill" :cx="p.x" :cy="p.y" r="31"/><rect v-for="i in 12" :key="`planet-${pi}-${i}`" class="tooth planet-tooth" :x="p.x-3.5" :y="p.y-38" width="7" height="10" :transform="`rotate(${i * 30} ${p.x} ${p.y})`"/><circle class="planet-pin" :cx="p.x" :cy="p.y" r="7"/>
      </g>
      <circle class="carrier-hub" cx="320" cy="158" r="8"/><path class="motion" d="M262 146A62 62 0 0 1 285 113" marker-end="url(#arr-gt)"/><path class="motion output-motion" d="M355 226A80 80 0 0 1 326 238" marker-end="url(#arr-gt)"/>
      <text class="vector-label" x="248" y="119">ω₁</text><text class="vector-label" x="356" y="245">ω<tspan baseline-shift="sub">H</tspan></text>
      <text class="gear-label" x="300" y="163">1 · 太阳轮</text><text class="gear-label" x="416" y="151">2</text><text class="gear-label" x="490" y="72">3 · 内齿圈</text><text class="gear-label" x="346" y="184">H · 行星架</text>
      <text class="formula" x="113" y="317">(ω₁−ω<tspan baseline-shift="sub">H</tspan>)/(ω₃−ω<tspan baseline-shift="sub">H</tspan>) = −z₃/z₁</text>
    </svg>
    <svg v-else-if="type === 'scheme'" viewBox="0 0 640 300" role="img" aria-label="机械方案设计流程图">
      <g class="box"><rect x="35" y="105" width="105" height="70"/><rect x="190" y="105" width="105" height="70"/><rect x="345" y="105" width="105" height="70"/><rect x="500" y="105" width="105" height="70"/></g><g class="arrow"><path d="M140 140H185"/><path d="M295 140H340"/><path d="M450 140H495"/></g><text x="61" y="137">功能需求</text><text x="216" y="137">运动规律</text><text x="371" y="137">机构方案</text><text x="526" y="137">评价迭代</text><text class="formula" x="162" y="235">需求 → 原理 → 运动 → 机构 → 尺度</text>
    </svg>
    <svg v-else viewBox="0 0 640 330" role="img" aria-label="带坐标系、工作空间、杆长、关节角和末端执行器的二维两自由度机器人图">
      <defs><marker id="arr-rob" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8z"/></marker><pattern id="hatch-rob" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8L8 0" class="hatch"/></pattern></defs>
      <path class="workspace" d="M145 258A170 170 0 0 1 470 95L436 123A126 126 0 0 0 190 258Z"/>
      <path class="ground heavy" d="M72 268H574"/><rect class="surface-hatch" x="72" y="268" width="502" height="22" fill="url(#hatch-rob)"/>
      <path class="axis" d="M145 258H560M145 258V38"/><path class="axis-arrow" d="M560 258L545 251M560 258L545 265M145 38L138 53M145 38L152 53"/>
      <path class="link a" d="M145 258L291 133"/><path class="link b" d="M291 133L477 88"/>
      <g class="joint"><circle cx="145" cy="258" r="16"/><circle cx="291" cy="133" r="15"/><circle cx="477" cy="88" r="11"/></g>
      <path class="end-effector" d="M477 88L512 70M501 57L512 70L504 87"/>
      <path class="arc" d="M184 224A54 54 0 0 1 190 187M330 125A50 50 0 0 1 349 91"/>
      <text class="angle-label" x="194" y="205">θ₁</text><text class="angle-label" x="347" y="105">θ₂</text>
      <path class="dim" d="M160 276L301 154M308 154L486 110"/><text class="dim-label" x="220" y="230">l₁</text><text class="dim-label" x="395" y="143">l₂</text>
      <path class="ee-frame" d="M477 88H548M477 88V27"/><text class="joint-label" x="548" y="105">xₑ</text><text class="joint-label" x="455" y="27">yₑ</text><text class="joint-label" x="520" y="65">末端执行器</text>
      <text class="joint-label" x="552" y="278">x</text><text class="joint-label" x="127" y="37">y</text><text x="322" y="286">可达工作空间</text>
      <text class="formula" x="207" y="318">ẋ = J(q)q̇　　τ = JᵀF</text>
    </svg>
    <figcaption>{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.pd { margin: 24px 0; border: 1px solid var(--vp-c-divider); border-radius: 12px; overflow: hidden; background: linear-gradient(135deg,var(--vp-c-bg-soft),var(--vp-c-bg)); }
.pd__head { display:flex; justify-content:space-between; gap:16px; padding:10px 14px; border-bottom:1px solid var(--vp-c-divider); font:10px var(--vp-font-family-mono); color:var(--vp-c-text-3); letter-spacing:.08em; }
.pd__head strong { color:var(--vp-c-text-1); letter-spacing:0; }
.pd svg { display:block; width:100%; max-height:390px; padding:14px; color:var(--vp-c-brand-1); }
.pd figcaption { padding:10px 14px; border-top:1px solid var(--vp-c-divider); color:var(--vp-c-text-2); font-size:12px; line-height:1.6; }
svg :is(.ground,.shaft,.axis,.guide,.radius,.contact,.carrier) { fill:none; stroke:currentColor; stroke-width:2; }
svg .link { fill:none; stroke:currentColor; stroke-width:10; stroke-linecap:round; }
svg .link.a { stroke:#e8792e; } svg .link.b { stroke:#2d7dd2; } svg .link.c { stroke:#39a078; }
svg .joint circle, svg circle.joint { fill:var(--vp-c-bg); stroke:currentColor; stroke-width:4; }
svg text { fill:var(--vp-c-text-2); font:13px var(--vp-font-family-mono); }
svg .formula { fill:var(--vp-c-text-1); font-weight:700; }
svg .vec { stroke:#2d7dd2; stroke-width:4; } svg .vec.alt { stroke:#e8792e; } svg .vec.sum { stroke:#39a078; }
svg marker path { fill:context-stroke; } svg .guide { stroke-dasharray:5 5; opacity:.5; }
svg rect { fill:var(--vp-c-bg); stroke:currentColor; stroke-width:3; }
svg .mass { fill:#e8792e; } svg .altfill { fill:#39a078; } svg ellipse { fill:none; stroke:currentColor; stroke-width:3; }
svg .curve { fill:none; stroke:#2d7dd2; stroke-width:4; } svg .mean { stroke:#e8792e; stroke-width:2; stroke-dasharray:7 6; } svg .area { fill:rgba(57,160,120,.16); }
svg .arc { fill:none; stroke:#e8792e; stroke-width:3; stroke-dasharray:6 5; }
svg .cam { fill:rgba(45,125,210,.12); stroke:#2d7dd2; stroke-width:4; } svg .follower { stroke:#39a078; stroke-width:9; }
svg .pitch,svg .base,svg .ring,svg .gear { fill:none; stroke:currentColor; } svg .pitch { stroke-width:3; } svg .base { stroke-width:2; stroke-dasharray:7 6; opacity:.65; } svg .loa { stroke:#e8792e; stroke-width:3; } svg .point { fill:#e8792e; }
svg .ring { stroke-width:12; } svg .gear { stroke-width:5; } svg .box rect { fill:var(--vp-c-bg); stroke:#2d7dd2; } svg .arrow path { stroke:#e8792e; stroke-width:3; }
svg .panel { fill:none; stroke:var(--vp-c-divider); stroke-width:1.5; stroke-dasharray:5 6; }
svg .heavy { stroke-width:3.5; }
svg .hatch { fill:none; stroke:var(--vp-c-text-3); stroke-width:1; opacity:.42; }
svg .surface-hatch { stroke:none; }
svg .fbd-block,svg .guide-block { fill:color-mix(in srgb,var(--vp-c-bg) 86%,var(--vp-c-brand-soft)); stroke:var(--vp-c-text-2); stroke-width:2.5; }
svg .centroid,svg .contact-dot,svg .coupler-point { fill:#e8792e; stroke:var(--vp-c-bg); stroke-width:2; }
svg .vector-label,svg .label-strong,svg .joint-label,svg .gear-label { fill:var(--vp-c-text-1); font-weight:700; }
svg .resultant { fill:none; stroke:#7c5ce7; stroke-width:4.5; }
svg .friction-cone { fill:rgba(232,121,46,.07); stroke:#e8792e; stroke-width:1.8; stroke-dasharray:7 5; }
svg .angle { fill:none; stroke:#e8792e; stroke-width:2.2; }
svg .angle-label { fill:#e8792e; font-weight:800; }
svg .motion { fill:none; stroke:#e8792e; stroke-width:2.8; stroke-dasharray:7 5; }
svg .output-motion { stroke:#39a078; }
svg .construction,svg .centerline { fill:none; stroke:var(--vp-c-text-3); stroke-width:1.3; stroke-dasharray:5 6; opacity:.65; }
svg .coupler-trace { fill:none; stroke:#7c5ce7; stroke-width:2; stroke-dasharray:4 6; opacity:.8; }
svg .thin-link { fill:rgba(124,92,231,.06); stroke:#7c5ce7; stroke-width:2; }
svg .dim { fill:none; stroke:var(--vp-c-text-3); stroke-width:1.2; stroke-dasharray:2 3; }
svg .dim-label { fill:var(--vp-c-text-1); font-weight:700; font-style:italic; }
svg .pitch-curve { fill:none; stroke:#7c5ce7; stroke-width:2; stroke-dasharray:7 5; }
svg .center-mark,svg .roller-center { fill:var(--vp-c-text-1); }
svg .center-cross { fill:none; stroke:var(--vp-c-text-1); stroke-width:1.5; }
svg .roller { fill:var(--vp-c-bg); stroke:#39a078; stroke-width:6; }
svg .contact-normal { fill:none; stroke:#7c5ce7; stroke-width:2.2; stroke-dasharray:6 4; }
svg .velocity-arrow { fill:none; stroke:#39a078; stroke-width:3; }
svg .radius { stroke:#e8792e; stroke-width:2.2; }
svg .gear-body .addendum,svg .gear-body .dedendum { fill:color-mix(in srgb,var(--vp-c-brand-soft) 52%,transparent); stroke:var(--vp-c-brand-1); }
svg .gear-body .addendum { stroke-width:1.2; opacity:.65; } svg .gear-body .dedendum { stroke-width:2.2; }
svg .tooth { fill:var(--vp-c-brand-1); stroke:var(--vp-c-bg); stroke-width:1; }
svg .hub { fill:var(--vp-c-bg); stroke:var(--vp-c-text-2); stroke-width:3; }
svg .centerline { stroke-dasharray:9 5 2 5; }
svg .ring-outer,svg .ring-inner { fill:none; stroke:var(--vp-c-text-2); } svg .ring-outer { stroke-width:7; } svg .ring-inner { stroke-width:2; }
svg .internal-tooth { stroke:var(--vp-c-brand-1); stroke-width:5; stroke-linecap:round; }
svg .carrier-frame { fill:none; stroke:#e8792e; stroke-width:8; stroke-linecap:round; opacity:.78; }
svg .gear-fill,svg .planet-fill { fill:color-mix(in srgb,var(--vp-c-brand-soft) 68%,var(--vp-c-bg)); stroke:var(--vp-c-brand-1); stroke-width:3; }
svg .planet-tooth { fill:#39a078; }
svg .planet-pin,svg .carrier-hub { fill:var(--vp-c-bg); stroke:#e8792e; stroke-width:3; }
svg .velocity-origin { fill:var(--vp-c-text-1); }
svg .bearing { fill:color-mix(in srgb,var(--vp-c-brand-soft) 75%,var(--vp-c-bg)); stroke:var(--vp-c-text-2); stroke-width:2; }
svg .correction-plane { fill:rgba(45,125,210,.07); stroke:var(--vp-c-brand-1); stroke-width:2.5; }
svg .disk-core { fill:var(--vp-c-bg); stroke:var(--vp-c-text-2); stroke-width:2; }
svg .imbalance-vector { fill:none; stroke:#e8792e; stroke-width:3.5; } svg .alt-vector { stroke:#39a078; }
svg .workspace { fill:rgba(45,125,210,.08); stroke:#7c5ce7; stroke-width:2; stroke-dasharray:8 6; }
svg .axis-arrow,svg .ee-frame { fill:none; stroke:var(--vp-c-text-3); stroke-width:1.5; }
svg .end-effector { fill:none; stroke:#39a078; stroke-width:5; stroke-linecap:round; stroke-linejoin:round; }
</style>
