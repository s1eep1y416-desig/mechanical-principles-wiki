<script setup lang="ts">
import { computed, ref } from "vue";
import { withBase } from "vitepress";
const nodes = [
  {
    id: "machine",
    name: "机械系统",
    x: 480,
    y: 70,
    group: "core",
    link: "/chapters/01-introduction",
    note: "从功能需求出发，连接机构分析、常用机构与方案设计。",
  },
  {
    id: "structure",
    name: "结构分析",
    x: 210,
    y: 155,
    group: "analysis",
    link: "/chapters/02-structural-analysis",
    note: "构件、运动副、运动链与自由度。",
  },
  {
    id: "kinematics",
    name: "运动分析",
    x: 390,
    y: 190,
    group: "analysis",
    link: "/chapters/03-kinematic-analysis",
    note: "位置、速度、加速度与瞬心。",
  },
  {
    id: "force",
    name: "力分析",
    x: 570,
    y: 190,
    group: "analysis",
    link: "/chapters/04-static-force-analysis",
    note: "运动副反力、摩擦与动态静力法。",
  },
  {
    id: "dynamics",
    name: "动力分析",
    x: 750,
    y: 155,
    group: "analysis",
    link: "/chapters/05-dynamic-analysis",
    note: "质量、惯性力与机械真实载荷。",
  },
  {
    id: "balance",
    name: "平衡",
    x: 820,
    y: 285,
    group: "control",
    link: "/chapters/06-balancing",
    note: "消除或降低惯性力与惯性力偶矩。",
  },
  {
    id: "flywheel",
    name: "速度调节",
    x: 690,
    y: 330,
    group: "control",
    link: "/chapters/07-operation-speed-fluctuation",
    note: "用飞轮储能降低周期速度波动。",
  },
  {
    id: "linkage",
    name: "连杆机构",
    x: 145,
    y: 335,
    group: "mechanism",
    link: "/chapters/08-linkages",
    note: "刚性低副机构，实现运动变换与轨迹生成。",
  },
  {
    id: "cam",
    name: "凸轮机构",
    x: 290,
    y: 410,
    group: "mechanism",
    link: "/chapters/09-cams",
    note: "用轮廓实现给定的位移、速度与加速度规律。",
  },
  {
    id: "gear",
    name: "齿轮机构",
    x: 480,
    y: 390,
    group: "mechanism",
    link: "/chapters/10-gears",
    note: "共轭齿廓保证定传动比，渐开线便于制造与装配。",
  },
  {
    id: "train",
    name: "齿轮系",
    x: 650,
    y: 435,
    group: "mechanism",
    link: "/chapters/11-gear-trains",
    note: "定轴、周转与复合轮系扩展传动比和运动合成。",
  },
  {
    id: "other",
    name: "间歇与挠性机构",
    x: 815,
    y: 410,
    group: "mechanism",
    link: "/chapters/12-other-mechanisms",
    note: "槽轮、棘轮、链与带等其他常用机构。",
  },
  {
    id: "scheme",
    name: "方案设计",
    x: 390,
    y: 555,
    group: "synthesis",
    link: "/chapters/13-scheme-design",
    note: "把执行动作、工作循环与机构选型组合成整机方案。",
  },
  {
    id: "robot",
    name: "机器人机构",
    x: 610,
    y: 555,
    group: "synthesis",
    link: "/chapters/14-robots",
    note: "开链、闭链、坐标变换、工作空间和奇异位形。",
  },
];
const edges = [
  ["machine", "structure", "组成"],
  ["structure", "kinematics", "约束"],
  ["kinematics", "force", "运动状态"],
  ["force", "dynamics", "载荷"],
  ["dynamics", "balance", "惯性"],
  ["dynamics", "flywheel", "能量"],
  ["structure", "linkage", "低副"],
  ["kinematics", "cam", "运动规律"],
  ["kinematics", "gear", "传动比"],
  ["gear", "train", "组合"],
  ["kinematics", "other", "间歇"],
  ["linkage", "scheme", "候选机构"],
  ["cam", "scheme", "执行规律"],
  ["train", "scheme", "传动方案"],
  ["other", "scheme", "辅助运动"],
  ["scheme", "robot", "空间扩展"],
  ["kinematics", "robot", "位姿"],
  ["force", "robot", "驱动力"],
];
const query = ref(""),
  selected = ref("machine");
const selectedNode = computed(
  () => nodes.find((n) => n.id === selected.value)!,
);
const neighbors = computed(
  () =>
    new Set(
      edges.flatMap(([a, b]) =>
        a === selected.value ? [b] : b === selected.value ? [a] : [],
      ),
    ),
);
const matches = computed(
  () =>
    new Set(
      nodes
        .filter(
          (n) => !query.value || `${n.name}${n.note}`.includes(query.value),
        )
        .map((n) => n.id),
    ),
);
</script>
<template>
  <section class="concept-map">
    <div class="map-toolbar">
      <label
        >搜索概念<input
          v-model="query"
          type="search"
          placeholder="例如：速度、齿轮、机器人" /></label
      ><span>点击节点查看关系与章节</span>
    </div>
    <div class="map-scroll">
      <svg viewBox="0 0 960 640" role="img" aria-label="机械原理概念关系图">
        <defs>
          <marker
            id="map-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M1 1 9 5 1 9Z" />
          </marker>
        </defs>
        <g class="edges">
          <g
            v-for="([a, b, label], i) in edges"
            :key="i"
            :class="{ active: a === selected || b === selected }"
          >
            <line
              :x1="nodes.find((n) => n.id === a).x"
              :y1="nodes.find((n) => n.id === a).y"
              :x2="nodes.find((n) => n.id === b).x"
              :y2="nodes.find((n) => n.id === b).y"
            />
            <text
              :x="
                (nodes.find((n) => n.id === a).x +
                  nodes.find((n) => n.id === b).x) /
                2
              "
              :y="
                (nodes.find((n) => n.id === a).y +
                  nodes.find((n) => n.id === b).y) /
                  2 -
                6
              "
            >
              {{ label }}
            </text>
          </g>
        </g>
        <g
          v-for="node in nodes"
          :key="node.id"
          class="node"
          :class="[
            node.group,
            {
              selected: selected === node.id,
              neighbor: neighbors.has(node.id),
              dim: !matches.has(node.id),
            },
          ]"
          role="button"
          tabindex="0"
          @click="selected = node.id"
          @keydown.enter="selected = node.id"
        >
          <rect
            :x="node.x - 70"
            :y="node.y - 26"
            width="140"
            height="52"
            rx="12"
          />
          <text :x="node.x" :y="node.y + 6">{{ node.name }}</text>
        </g>
      </svg>
    </div>
    <article>
      <span>{{ selectedNode.group.toUpperCase() }}</span>
      <h2>{{ selectedNode.name }}</h2>
      <p>{{ selectedNode.note }}</p>
      <div>
        <strong>直接相关：</strong
        >{{
          [...neighbors]
            .map((id) => nodes.find((n) => n.id === id).name)
            .join(" · ")
        }}
      </div>
      <a :href="withBase(selectedNode.link)">阅读对应章节 →</a>
    </article>
  </section>
</template>
<style scoped>
.concept-map {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}
.map-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  padding: 16px 20px;
}
.map-toolbar label {
  display: grid;
  gap: 6px;
  font-size: 12px;
}
.map-toolbar input {
  min-height: 44px;
  padding: 8px 11px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.map-toolbar span {
  color: var(--vp-c-text-3);
  font-size: 12px;
}
.map-scroll {
  overflow-x: auto;
}
svg {
  display: block;
  min-width: 760px;
  background: var(--vp-c-bg);
}
.edges line {
  stroke: var(--vp-c-divider);
  stroke-width: 1.5;
}
.edges text {
  fill: var(--vp-c-text-3);
  font-size: 10px;
  text-anchor: middle;
}
.edges .active line {
  stroke: var(--vp-c-brand-1);
  stroke-width: 3;
}
.node {
  cursor: pointer;
}
.node rect {
  fill: var(--vp-c-bg-soft);
  stroke: var(--vp-c-divider);
  stroke-width: 1.5;
}
.node text {
  fill: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 650;
  text-anchor: middle;
}
.node.analysis rect {
  fill: color-mix(in srgb, #2b7bbb 12%, var(--vp-c-bg));
}
.node.mechanism rect {
  fill: color-mix(in srgb, #15956f 12%, var(--vp-c-bg));
}
.node.control rect {
  fill: color-mix(in srgb, #cb8533 12%, var(--vp-c-bg));
}
.node.synthesis rect {
  fill: color-mix(in srgb, #7d5bc5 12%, var(--vp-c-bg));
}
.node.selected rect {
  stroke: var(--vp-c-brand-1);
  stroke-width: 4;
}
.node.neighbor rect {
  stroke: var(--vp-c-brand-1);
}
.node.dim {
  opacity: 0.2;
}
.node:focus-visible rect {
  outline: 3px solid var(--vp-c-brand-1);
}
article {
  padding: 18px 22px;
  border-top: 1px solid var(--vp-c-divider);
}
article > span {
  color: var(--vp-c-brand-1);
  font: 10px var(--vp-font-family-mono);
}
article h2 {
  margin: 5px 0;
  padding: 0;
  border: 0;
  font-size: 20px;
}
article p {
  margin: 6px 0;
}
article div {
  color: var(--vp-c-text-2);
  font-size: 12px;
}
article a {
  display: inline-block;
  margin-top: 10px;
}
@media (max-width: 600px) {
  .map-toolbar {
    align-items: stretch;
    flex-direction: column;
  }
  .map-toolbar input {
    width: 100%;
  }
}
</style>
