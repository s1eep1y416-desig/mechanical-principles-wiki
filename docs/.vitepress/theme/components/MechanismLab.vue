<script setup lang="ts">
import { computed, ref, useId, onMounted, onBeforeUnmount, watch } from "vue";
import DiagramFrame from "./DiagramFrame.vue";
import MachineDefs from "./labs/MachineDefs.vue";
import TransmissionScene from "./labs/TransmissionScene.vue";
import CamScene from "./labs/CamScene.vue";
import DynamicsScene from "./labs/DynamicsScene.vue";
import SystemScene from "./labs/SystemScene.vue";
import { LABS, labSnapshot } from "../utils/lab-models.mjs";
import "./labs/mechanism-labs.css";
const props = defineProps<{ kind: keyof typeof LABS }>();
const meta = computed(() => LABS[props.kind]),
  id = "ml-" + useId().replace(/:/g, "");
const angle = ref(45),
  p1 = ref(meta.value.p1),
  p2 = ref(meta.value.p2),
  law = ref("cycloid"),
  overlay = ref(true),
  playing = ref(false);
const scenarioA = ref<Record<string, unknown> | null>(null),
  scenarioB = ref<Record<string, unknown> | null>(null);
const host = ref<HTMLElement>();
const cycle = computed(() =>
  props.kind === "gears" ? (p1.value === 48 ? 720 : 1080) : meta.value.cycle,
);
const params = computed(() => {
  switch (props.kind) {
    case "cam":
      return [{ key: 1, label: "升程 h / mm", min: 30, max: 65, step: 1 }];
    case "friction":
      return [
        { key: 1, label: "斜面倾角 α / °", min: 0, max: 45, step: 1 },
        { key: 2, label: "静摩擦系数 μs", min: 0.1, max: 0.8, step: 0.05 },
      ];
    case "inertia":
      return [
        { key: 1, label: "角速度 ω / rad·s⁻¹", min: 2, max: 12, step: 1 },
        { key: 2, label: "滑块质量 m / kg", min: 1, max: 4, step: 0.5 },
      ];
    case "balance":
      return [
        { key: 1, label: "配重质量 / kg", min: 0, max: 1.2, step: 0.02 },
        { key: 2, label: "配重相位 / °", min: 90, max: 270, step: 1 },
      ];
    case "flywheel":
      return [
        { key: 1, label: "转动惯量 J / kg·m²", min: 0.5, max: 8, step: 0.5 },
      ];
    case "robot":
      return [
        { key: 1, label: "第二关节 q₂ / °", min: -160, max: 160, step: 1 },
      ];
    case "coriolis":
      return [
        { key: 1, label: "相对速度 u / mm·s⁻¹", min: -30, max: 45, step: 5 },
      ];
    default:
      return [];
  }
});
let frame = 0,
  previous = 0,
  observer: IntersectionObserver | undefined;
function pause() {
  playing.value = false;
  cancelAnimationFrame(frame);
  previous = 0;
}
function tick(now: number) {
  if (!playing.value) return;
  if (previous)
    angle.value =
      (angle.value + Math.min((now - previous) / 1000, 0.08) * 50) %
      cycle.value;
  previous = now;
  frame = requestAnimationFrame(tick);
}
function toggle() {
  if (playing.value) pause();
  else {
    playing.value = true;
    frame = requestAnimationFrame(tick);
  }
}
function reset() {
  pause();
  angle.value = 45;
  p1.value = meta.value.p1;
  p2.value = meta.value.p2;
  law.value = "cycloid";
  overlay.value = true;
}
function step() {
  pause();
  angle.value = (angle.value + 15) % cycle.value;
}
function visible() {
  if (document.hidden) pause();
}
function setParam(key: number, event: Event) {
  pause();
  const v = Number((event.target as HTMLInputElement).value);
  if (key === 1) p1.value = v;
  else p2.value = v;
}
const snapshot = computed(() =>
  labSnapshot(props.kind, angle.value, p1.value, p2.value, law.value),
);
const comparison = computed(() => {
  if (!scenarioA.value || !scenarioB.value) return [];
  return Object.keys(scenarioA.value)
    .filter(
      (key) =>
        typeof scenarioA.value?.[key] === "number" &&
        typeof scenarioB.value?.[key] === "number",
    )
    .map((key) => ({
      key,
      a: Number(scenarioA.value?.[key]),
      b: Number(scenarioB.value?.[key]),
      delta: Number(scenarioB.value?.[key]) - Number(scenarioA.value?.[key]),
    }))
    .slice(0, 8);
});
function saveScenario(slot: "A" | "B") {
  const data = {
    kind: props.kind,
    angle: angle.value,
    p1: p1.value,
    p2: p2.value,
    law: law.value,
    ...snapshot.value,
  };
  if (slot === "A") scenarioA.value = data;
  else scenarioB.value = data;
}
function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type })),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
function exportJson() {
  download(
    `${props.kind}-snapshot.json`,
    JSON.stringify(snapshot.value, null, 2),
    "application/json",
  );
}
function exportCsv() {
  const rows = Array.from({ length: 73 }, (_, i) =>
      labSnapshot(
        props.kind,
        (cycle.value * i) / 72,
        p1.value,
        p2.value,
        law.value,
      ),
    ),
    keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const csv = [
    keys.join(","),
    ...rows.map((row) =>
      keys.map((key) => JSON.stringify(row[key] ?? "")).join(","),
    ),
  ].join("\n");
  download(`${props.kind}-cycle.csv`, csv, "text/csv;charset=utf-8");
}
watch(
  () => props.kind,
  () => {
    reset();
    scenarioA.value = null;
    scenarioB.value = null;
  },
);
onMounted(() => {
  document.addEventListener("visibilitychange", visible);
  observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting && !host.value?.closest("dialog[open]"))
        pause();
    },
    { threshold: 0 },
  );
  if (host.value) observer.observe(host.value);
});
watch(
  host,
  (element) => {
    observer?.disconnect();
    if (element) observer?.observe(element);
  },
  { flush: "post" },
);
onBeforeUnmount(() => {
  pause();
  observer?.disconnect();
  document.removeEventListener("visibilitychange", visible);
});
</script>
<template>
  <DiagramFrame eyebrow="交互实验" :title="meta.title" :caption="meta.note">
    <div
      ref="host"
      :data-lab="kind"
      :data-angle="angle"
      :data-playing="playing"
    >
      <div class="mechanism-lab-controls">
        <div class="lab-row">
          <button class="primary" type="button" @click="toggle">
            {{ playing ? "暂停演示" : "播放演示" }}
          </button>
          <button type="button" @click="step">单步 +15°</button
          ><button type="button" @click="reset">复位参数</button>
          <label v-if="!['flywheel', 'cycle'].includes(kind)"
            ><input v-model="overlay" type="checkbox" /> 辅助线</label
          ><span class="lab-hint">相位慢放 · 数值按模型计算</span>
        </div>
        <div class="lab-row">
          <label :for="id + '-angle'">{{
            kind === "robot" ? "第一关节 q₁" : "输入相位"
          }}</label>
          <input
            :id="id + '-angle'"
            v-model.number="angle"
            type="range"
            min="0"
            :max="cycle"
            step=".5"
            @input="pause"
          />
          <output>{{ angle.toFixed(1) }}°</output>
        </div>
        <div v-if="params.length" class="parameters">
          <div v-for="param in params" :key="param.key" class="lab-row">
            <label :for="id + '-p' + param.key">{{ param.label }}</label
            ><input
              :id="id + '-p' + param.key"
              type="range"
              :min="param.min"
              :max="param.max"
              :step="param.step"
              :value="param.key === 1 ? p1 : p2"
              @input="setParam(param.key, $event)"
            /><output>{{
              (param.key === 1 ? p1 : p2).toFixed(param.step < 1 ? 2 : 0)
            }}</output>
          </div>
        </div>
        <div
          v-if="kind === 'gears' || kind === 'chain' || kind === 'cam'"
          class="lab-row"
        >
          <label :for="id + '-choice'">{{
            kind === "gears"
              ? "从动轮齿数"
              : kind === "chain"
                ? "两轮齿数"
                : "运动规律"
          }}</label>
          <select
            v-if="kind === 'gears'"
            :id="id + '-choice'"
            v-model.number="p1"
            @change="
              pause();
              angle = 45;
            "
          >
            <option :value="36">36 齿 · 速比 1.5</option>
            <option :value="48">48 齿 · 速比 2</option>
          </select>
          <select
            v-else-if="kind === 'chain'"
            :id="id + '-choice'"
            v-model.number="p1"
            @change="
              pause();
              angle = 45;
            "
          >
            <option :value="12">12 齿</option>
            <option :value="18">18 齿</option>
            <option :value="24">24 齿</option>
          </select>
          <select v-else :id="id + '-choice'" v-model="law" @change="pause">
            <option value="cycloid">摆线 / 正弦加速度</option>
            <option value="polynomial">3-4-5 多项式</option>
            <option value="harmonic">简谐 / 余弦加速度</option>
          </select>
        </div>
        <div class="lab-row lab-data-actions">
          <button type="button" @click="saveScenario('A')">存为方案 A</button
          ><button type="button" @click="saveScenario('B')">存为方案 B</button>
          <button type="button" @click="exportJson">导出当前 JSON</button
          ><button type="button" @click="exportCsv">导出整周期 CSV</button>
        </div>
        <div
          v-if="comparison.length"
          class="scenario-comparison"
          aria-live="polite"
        >
          <strong>方案 B − A</strong
          ><span v-for="item in comparison" :key="item.key"
            >{{ item.key }}：{{ item.a.toFixed(3) }} →
            {{ item.b.toFixed(3) }}（Δ {{ item.delta.toFixed(3) }}）</span
          >
        </div>
      </div>
      <svg
        class="lab-svg"
        viewBox="0 0 960 535"
        role="img"
        :aria-label="meta.title + '，输入相位 ' + angle.toFixed(1) + ' 度'"
      >
        <MachineDefs :id="id" />
        <rect width="960" height="535" :fill="'url(#' + id + '-grid)'" />
        <text x="30" y="28" class="tiny">{{ meta.tag }}</text>
        <path d="M630 45V504" class="divider" />
        <TransmissionScene
          v-if="['gears', 'planetary', 'chain', 'geneva'].includes(kind)"
          :kind="kind"
          :id="id"
          :angle="angle"
          :p1="p1"
          :overlay="overlay"
        />
        <CamScene
          v-else-if="kind === 'cam'"
          :id="id"
          :angle="angle"
          :p1="p1"
          :law="law"
          :overlay="overlay"
        />
        <SystemScene
          v-else-if="kind === 'robot' || kind === 'cycle'"
          :kind="kind"
          :id="id"
          :angle="angle"
          :p1="p1"
          :overlay="overlay"
        />
        <DynamicsScene
          v-else
          :kind="kind"
          :id="id"
          :angle="angle"
          :p1="p1"
          :p2="p2"
          :overlay="overlay"
        />
      </svg>
    </div>
  </DiagramFrame>
</template>
<style scoped>
.lab-data-actions {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 10px;
}
.scenario-comparison {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5px 14px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  font: 11px/1.6 var(--vp-font-family-mono);
}
.scenario-comparison strong {
  grid-column: 1/-1;
  color: var(--vp-c-brand-1);
}
@media (max-width: 640px) {
  .scenario-comparison {
    grid-template-columns: 1fr;
  }
}
</style>
