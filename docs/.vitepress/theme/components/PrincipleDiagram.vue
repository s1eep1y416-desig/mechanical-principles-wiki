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
    <svg v-else-if="type === 'velocity'" viewBox="0 0 640 300" role="img" aria-label="相对速度矢量图">
      <defs><marker id="arr-v" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 9 4.5 0 9z"/></marker></defs>
      <circle cx="120" cy="235" r="9"/><circle cx="285" cy="112" r="9"/><path class="link a" d="M120 235L285 112"/><path class="vec" d="M120 235L120 72" marker-end="url(#arr-v)"/><path class="vec alt" d="M120 235L445 235" marker-end="url(#arr-v)"/><path class="vec sum" d="M120 235L445 72" marker-end="url(#arr-v)"/><path class="guide" d="M120 72H445V235"/><text x="88" y="60">v<tspan baseline-shift="sub">B</tspan></text><text x="450" y="244">v<tspan baseline-shift="sub">A</tspan></text><text x="455" y="67">v<tspan baseline-shift="sub">BA</tspan></text><text class="formula" x="282" y="278">v<tspan baseline-shift="sub">B</tspan> = v<tspan baseline-shift="sub">A</tspan> + v<tspan baseline-shift="sub">BA</tspan></text>
    </svg>
    <svg v-else-if="type === 'force'" viewBox="0 0 640 300" role="img" aria-label="滑块受力和摩擦角示意图">
      <defs><marker id="arr-f" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 9 4.5 0 9z"/></marker></defs>
      <path class="ground" d="M85 225H555"/><rect x="250" y="140" width="140" height="84" rx="4"/><path class="vec" d="M320 140V52" marker-end="url(#arr-f)"/><path class="vec alt" d="M250 182H132" marker-end="url(#arr-f)"/><path class="vec sum" d="M320 224V286" marker-end="url(#arr-f)"/><path class="vec" d="M390 182H505" marker-end="url(#arr-f)"/><text x="329" y="63">N</text><text x="128" y="172">F<tspan baseline-shift="sub">f</tspan></text><text x="330" y="280">G</text><text x="492" y="172">P</text><text class="formula" x="205" y="28">F<tspan baseline-shift="sub">f</tspan> ≤ fN　·　tan φ = f</text>
    </svg>
    <svg v-else-if="type === 'balance'" viewBox="0 0 640 300" role="img" aria-label="刚性转子双面平衡示意图">
      <path class="shaft" d="M75 150H565"/><ellipse cx="220" cy="150" rx="18" ry="100"/><ellipse cx="430" cy="150" rx="18" ry="100"/><circle class="mass" cx="220" cy="75" r="13"/><circle class="mass altfill" cx="430" cy="215" r="13"/><path class="radius" d="M220 150V75M430 150V215"/><text x="178" y="45">m₁r₁</text><text x="440" y="236">m₂r₂</text><text class="formula" x="125" y="282">Σmᵢrᵢ = 0　且　Σmᵢrᵢlᵢ = 0</text>
    </svg>
    <svg v-else-if="type === 'flywheel'" viewBox="0 0 640 300" role="img" aria-label="飞轮调速能量图">
      <path class="axis" d="M55 245H590M70 265V35"/><path class="curve" d="M70 165C125 70 180 70 235 165S345 260 400 165 510 70 565 165"/><path class="mean" d="M70 165H565"/><path class="area" d="M70 165C125 70 180 70 235 165H70Z"/><text x="575" y="184">φ</text><text x="30" y="45">M</text><text x="258" y="92">加速区</text><text x="264" y="226">减速区</text><text class="formula" x="170" y="286">J<tspan baseline-shift="sub">F</tspan> ≈ ΔE<tspan baseline-shift="sub">max</tspan> /(ω²δ)</text>
    </svg>
    <svg v-else-if="type === 'fourbar'" viewBox="0 0 640 300" role="img" aria-label="曲柄摇杆机构示意图">
      <path class="ground" d="M70 240H570"/><path class="link a" d="M105 235L205 125"/><path class="link b" d="M205 125L430 105"/><path class="link c" d="M430 105L535 235"/><g class="joint"><circle cx="105" cy="235" r="12"/><circle cx="205" cy="125" r="12"/><circle cx="430" cy="105" r="12"/><circle cx="535" cy="235" r="12"/></g><path class="arc" d="M62 180a72 72 0 0 1 77-59"/><text x="70" y="100">ω</text><text class="formula" x="175" y="284">Grashof：最短杆 + 最长杆 ≤ 其余两杆之和</text>
    </svg>
    <svg v-else-if="type === 'cam'" viewBox="0 0 640 300" role="img" aria-label="盘形凸轮机构示意图">
      <path class="cam" d="M130 205C90 135 125 55 205 55c64 0 92 56 98 115 8 76-67 104-125 85-22-7-37-25-48-50Z"/><circle cx="185" cy="165" r="8"/><rect x="353" y="48" width="64" height="120" rx="5"/><path class="follower" d="M385 168V248"/><circle cx="385" cy="186" r="18"/><path class="guide" d="M335 48H435M335 168H435"/><path class="contact" d="M292 156L367 182"/><text x="125" y="280">凸轮</text><text x="346" y="30">直动从动件</text><text class="formula" x="440" y="132">压力角 α</text>
    </svg>
    <svg v-else-if="type === 'gear'" viewBox="0 0 640 300" role="img" aria-label="渐开线齿轮啮合示意图">
      <circle class="pitch" cx="235" cy="150" r="94"/><circle class="pitch" cx="453" cy="150" r="124"/><circle class="base" cx="235" cy="150" r="78"/><circle class="base" cx="453" cy="150" r="103"/><path class="loa" d="M115 250L560 55"/><circle class="point" cx="329" cy="150" r="7"/><text x="317" y="140">P</text><text x="163" y="32">基圆</text><text x="473" y="286">分度圆</text><text class="formula" x="190" y="280">r<tspan baseline-shift="sub">b</tspan> = r cos α　·　i₁₂ = −z₂/z₁</text>
    </svg>
    <svg v-else-if="type === 'geartrain'" viewBox="0 0 640 300" role="img" aria-label="行星轮系示意图">
      <circle class="ring" cx="320" cy="150" r="130"/><circle class="gear" cx="320" cy="150" r="48"/><circle class="gear" cx="405" cy="150" r="36"/><path class="carrier" d="M320 150H405"/><circle class="joint" cx="320" cy="150" r="8"/><circle class="joint" cx="405" cy="150" r="7"/><text x="300" y="145">1</text><text x="401" y="145">2</text><text x="522" y="145">3</text><text x="360" y="128">H</text><text class="formula" x="122" y="292">(ω₁−ω<tspan baseline-shift="sub">H</tspan>)/(ω₃−ω<tspan baseline-shift="sub">H</tspan>) = −z₃/z₁</text>
    </svg>
    <svg v-else-if="type === 'scheme'" viewBox="0 0 640 300" role="img" aria-label="机械方案设计流程图">
      <g class="box"><rect x="35" y="105" width="105" height="70"/><rect x="190" y="105" width="105" height="70"/><rect x="345" y="105" width="105" height="70"/><rect x="500" y="105" width="105" height="70"/></g><g class="arrow"><path d="M140 140H185"/><path d="M295 140H340"/><path d="M450 140H495"/></g><text x="61" y="137">功能需求</text><text x="216" y="137">运动规律</text><text x="371" y="137">机构方案</text><text x="526" y="137">评价迭代</text><text class="formula" x="162" y="235">需求 → 原理 → 运动 → 机构 → 尺度</text>
    </svg>
    <svg v-else viewBox="0 0 640 300" role="img" aria-label="两自由度机器人机构示意图">
      <path class="ground" d="M70 248H570"/><path class="link a" d="M175 240L290 125"/><path class="link b" d="M290 125L465 80"/><g class="joint"><circle cx="175" cy="240" r="15"/><circle cx="290" cy="125" r="14"/><circle cx="465" cy="80" r="12"/></g><path class="axis" d="M175 240H540M175 240V25"/><path class="arc" d="M205 210a45 45 0 0 1 6-56M322 117a42 42 0 0 1 17-40"/><text x="207" y="180">θ₁</text><text x="335" y="88">θ₂</text><text x="475" y="70">末端</text><text class="formula" x="255" y="278">ẋ = J(q)q̇</text>
    </svg>
    <figcaption>{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.pd { margin: 24px 0; border: 1px solid var(--vp-c-divider); border-radius: 12px; overflow: hidden; background: linear-gradient(135deg,var(--vp-c-bg-soft),var(--vp-c-bg)); }
.pd__head { display:flex; justify-content:space-between; gap:16px; padding:10px 14px; border-bottom:1px solid var(--vp-c-divider); font:10px var(--vp-font-family-mono); color:var(--vp-c-text-3); letter-spacing:.08em; }
.pd__head strong { color:var(--vp-c-text-1); letter-spacing:0; }
.pd svg { display:block; width:100%; max-height:330px; padding:14px; color:var(--vp-c-brand-1); }
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
</style>
