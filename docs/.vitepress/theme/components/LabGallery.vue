<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed } from "vue";
import { withBase } from "vitepress";
import MechanismLab from "./MechanismLab.vue";
import LinkageLab from "./LinkageLab.vue";
import DetailPlate from "./DetailPlate.vue";
import { LABS } from "../utils/lab-models.mjs";
import { plateDefaults, plateSnapshot } from "../utils/plate-models.mjs";
const selected = ref("gears"),
  plate = ref("gearstructure");
const items = [
  ...Object.entries(LABS).map(([key, value]) => ({ key, ...value })),
  {
    key: "linkage",
    title: "连杆闭环实验台",
    tag: "曲柄摇杆 · 曲柄滑块",
    chapter: "08-linkages",
  },
];
const current = computed(
  () => items.find((x) => x.key === selected.value) || items[0],
);
const plates = [
  { key: "gearstructure", label: "齿轮结构剖读" },
  { key: "helical", label: "斜齿轮与轴向力" },
  { key: "belt", label: "带传动结构" },
  { key: "motion-pairs", label: "运动副剖面" },
  { key: "mobility", label: "构件与自由度" },
  { key: "instant", label: "滚动瞬心" },
  { key: "cam-types", label: "凸轮推杆结构" },
  { key: "intermittent", label: "棘轮与槽轮" },
  { key: "rotor-balance", label: "双面平衡" },
  { key: "robot-arm", label: "六轴机械臂" },
  { key: "frames", label: "局部坐标系" },
  { key: "system", label: "完整传动链" },
];
type Control = {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
};
const controls: Record<string, Control[]> = {
  system: [
    {
      key: "inputSpeed",
      label: "输入转速",
      unit: "r/min",
      min: 100,
      max: 3000,
      step: 50,
    },
    { key: "ratio", label: "总传动比", unit: "", min: 1, max: 40, step: 1 },
    {
      key: "efficiency",
      label: "总效率",
      unit: "",
      min: 0.6,
      max: 1,
      step: 0.01,
    },
    {
      key: "inputTorque",
      label: "输入转矩",
      unit: "N·m",
      min: 5,
      max: 200,
      step: 1,
    },
  ],
  mobility: [
    { key: "angle", label: "曲柄转角", unit: "°", min: 0, max: 360, step: 1 },
  ],
  instant: [
    {
      key: "radius",
      label: "滚轮半径",
      unit: "mm",
      min: 40,
      max: 240,
      step: 5,
    },
    {
      key: "omega",
      label: "角速度",
      unit: "rad/s",
      min: 0.2,
      max: 20,
      step: 0.2,
    },
  ],
  gearstructure: [
    { key: "teeth", label: "齿数 z", unit: "", min: 12, max: 60, step: 1 },
    { key: "module", label: "模数 m", unit: "mm", min: 0.5, max: 6, step: 0.5 },
  ],
  helical: [
    {
      key: "helixAngle",
      label: "螺旋角 β",
      unit: "°",
      min: 5,
      max: 45,
      step: 1,
    },
    {
      key: "torque",
      label: "传递转矩",
      unit: "N·m",
      min: 20,
      max: 600,
      step: 10,
    },
  ],
  belt: [
    {
      key: "smallDiameter",
      label: "小轮直径",
      unit: "mm",
      min: 80,
      max: 260,
      step: 10,
    },
    {
      key: "largeDiameter",
      label: "大轮直径",
      unit: "mm",
      min: 120,
      max: 460,
      step: 10,
    },
    {
      key: "centerDistance",
      label: "中心距",
      unit: "mm",
      min: 220,
      max: 900,
      step: 10,
    },
    {
      key: "inputSpeed",
      label: "输入转速",
      unit: "r/min",
      min: 100,
      max: 2000,
      step: 20,
    },
    {
      key: "tightForce",
      label: "紧边拉力",
      unit: "N",
      min: 100,
      max: 2000,
      step: 20,
    },
    {
      key: "slackForce",
      label: "松边拉力",
      unit: "N",
      min: 0,
      max: 1500,
      step: 20,
    },
  ],
  frames: [
    {
      key: "link1",
      label: "第一杆长",
      unit: "mm",
      min: 100,
      max: 300,
      step: 5,
    },
    {
      key: "link2",
      label: "第二杆长",
      unit: "mm",
      min: 100,
      max: 300,
      step: 5,
    },
    {
      key: "theta1",
      label: "关节角 θ₁",
      unit: "°",
      min: -160,
      max: 160,
      step: 1,
    },
    {
      key: "theta2",
      label: "关节角 θ₂",
      unit: "°",
      min: -160,
      max: 160,
      step: 1,
    },
  ],
  "rotor-balance": [
    { key: "mass", label: "不平衡质量", unit: "g", min: 5, max: 500, step: 5 },
    {
      key: "radius",
      label: "偏心半径",
      unit: "mm",
      min: 10,
      max: 180,
      step: 5,
    },
    {
      key: "speed",
      label: "转速",
      unit: "r/min",
      min: 100,
      max: 4000,
      step: 50,
    },
    {
      key: "planeDistance",
      label: "校正面距离",
      unit: "mm",
      min: 40,
      max: 500,
      step: 10,
    },
  ],
};
const plateState = reactive(
  Object.fromEntries(
    Object.entries(plateDefaults).map(([key, value]) => [key, { ...value }]),
  ),
) as Record<string, Record<string, number>>;
const currentControls = computed(() => controls[plate.value] || []);
const currentPlateParams = computed(() => plateState[plate.value] || {});
const snapshot = computed(() =>
  plateSnapshot(plate.value, currentPlateParams.value),
);
const plateForLab: Record<string, string> = {
  gears: "gearstructure",
  planetary: "gearstructure",
  chain: "system",
  cam: "cam-types",
  geneva: "intermittent",
  friction: "motion-pairs",
  inertia: "mobility",
  balance: "rotor-balance",
  flywheel: "system",
  robot: "frames",
  coriolis: "instant",
  cycle: "system",
  linkage: "mobility",
};
const metrics = computed(() => {
  const s: any = snapshot.value;
  if (plate.value === "system")
    return [
      `输出转速 ${s.outputSpeed.toFixed(1)} r/min`,
      `输出转矩 ${s.outputTorque.toFixed(1)} N·m`,
    ];
  if (plate.value === "mobility")
    return [`自由度 F=${s.freedom}`, `传动角 γ=${s.bar.gamma.toFixed(1)}°`];
  if (plate.value === "instant")
    return [
      `轮心速度 ${s.centerSpeed.toFixed(3)} m/s`,
      `轮顶速度 ${s.topSpeed.toFixed(3)} m/s`,
    ];
  if (plate.value === "gearstructure")
    return [
      `分度圆 d=${s.pitchDiameter.toFixed(1)} mm`,
      `齿顶圆 da=${s.addendumDiameter.toFixed(1)} mm`,
      `齿根圆 df=${s.rootDiameter.toFixed(1)} mm`,
    ];
  if (plate.value === "helical")
    return [
      `圆周力 Ft=${s.tangentialForce.toFixed(0)} N`,
      `轴向力 Fa=${s.axialForce.toFixed(0)} N`,
      `径向力 Fr=${s.radialForce.toFixed(0)} N`,
    ];
  if (plate.value === "belt")
    return [
      `传动比 i=${s.ratio.toFixed(2)}`,
      `输出 ${s.outputSpeed.toFixed(0)} r/min`,
      `小轮包角 ${s.smallWrap.toFixed(1)}°`,
      `带长 ≈${s.beltLength.toFixed(0)} mm`,
    ];
  if (plate.value === "frames")
    return [
      `末端 x=${s.end.x.toFixed(1)} mm`,
      `末端 y=${s.end.y.toFixed(1)} mm`,
    ];
  if (plate.value === "rotor-balance")
    return [
      `不平衡量 ${s.unbalance.toFixed(0)} g·mm`,
      `离心力 ${s.centrifugalForce.toFixed(1)} N`,
      `力偶矩 ${s.couple.toFixed(2)} N·m`,
    ];
  return [];
});
function select(key: string) {
  selected.value = key;
  plate.value = plateForLab[key] || plate.value;
  window.history.replaceState(null, "", "#" + key);
}
function resetPlate() {
  const defaults = (plateDefaults as Record<string, Record<string, number>>)[
    plate.value
  ];
  if (defaults) Object.assign(plateState[plate.value], defaults);
}
function fromHash() {
  const key = window.location.hash.slice(1);
  if (items.some((x) => x.key === key)) {
    selected.value = key;
    plate.value = plateForLab[key] || plate.value;
  }
}
onMounted(() => {
  fromHash();
  window.addEventListener("hashchange", fromHash);
});
onBeforeUnmount(() => window.removeEventListener("hashchange", fromHash));
</script>
<template>
  <div class="lab-gallery">
    <div class="gallery-intro">
      <span>MECHANISM STUDIO</span
      ><strong>13 个交互实验 · 25 张正文图解</strong>
      <p>
        选择一个机构，转一圈、改一个参数，再观察几何、受力与曲线怎样一起变化。
      </p>
    </div>
    <div class="experiment-grid" role="group" aria-label="选择交互实验">
      <button
        v-for="(item, i) in items"
        :key="item.key"
        type="button"
        :aria-pressed="selected === item.key"
        @click="select(item.key)"
      >
        <span class="experiment-number">{{
          String(i + 1).padStart(2, "0")
        }}</span
        ><strong>{{ item.title }}</strong
        ><small>{{ item.tag }}</small>
      </button>
    </div>
    <div class="experiment-heading">
      <strong>正在观察：{{ current.title }}</strong
      ><a :href="withBase('/chapters/' + current.chapter)">阅读对应章节 →</a>
    </div>
    <LinkageLab v-if="selected === 'linkage'" />
    <MechanismLab v-else :key="selected" :kind="selected" />
    <p class="experiment-tip">
      建议先暂停，用相位滑块逐步检查；再调整齿数、摩擦系数、转动惯量或关节角。每个实验底部都写明了模型条件。
    </p>
    <h2 id="结构图册">联动结构图册</h2>
    <p>
      关键结构图不再是固定示意：调整齿数、模数、螺旋角、带轮尺寸、机构角度或转速后，几何与计算结果同步更新。制造设计仍需完整工程图与强度校核。
    </p>
    <div class="plate-tabs" role="group" aria-label="选择结构图">
      <button
        v-for="p in plates"
        :key="p.key"
        type="button"
        :aria-pressed="plate === p.key"
        @click="plate = p.key"
      >
        {{ p.label }}
      </button>
    </div>
    <section
      v-if="currentControls.length"
      class="plate-controls"
      aria-label="结构图参数"
    >
      <header>
        <div>
          <span>PARAMETRIC PLATE</span
          ><strong>拖动参数，观察结构与物理量联动</strong>
        </div>
        <button type="button" @click="resetPlate">恢复默认</button>
      </header>
      <div class="plate-control-grid">
        <label v-for="control in currentControls" :key="control.key">
          <span>{{ control.label }}</span>
          <input
            v-model.number="currentPlateParams[control.key]"
            type="range"
            :min="control.min"
            :max="control.max"
            :step="control.step"
            :aria-label="control.label"
          />
          <output
            >{{
              Number(currentPlateParams[control.key]).toFixed(
                control.step < 1 ? 2 : 0,
              )
            }}
            {{ control.unit }}</output
          >
        </label>
      </div>
      <div class="plate-metrics" aria-live="polite">
        <strong v-for="item in metrics" :key="item">{{ item }}</strong>
      </div>
    </section>
    <p v-else class="plate-static-note">
      这张图用于结构类型对照；可切换到带参数标记的图册进行实时计算。
    </p>
    <DetailPlate :key="plate" :type="plate" :params="currentPlateParams" />
  </div>
</template>
<style scoped>
.gallery-intro {
  padding: 26px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: linear-gradient(
    115deg,
    var(--vp-c-brand-soft),
    var(--vp-c-bg-soft)
  );
  margin: 24px 0;
}
.gallery-intro > span {
  font-size: 11px;
  letter-spacing: 0.15em;
  color: var(--vp-c-brand-1);
  display: block;
  margin-bottom: 10px;
}
.gallery-intro > strong {
  font-size: 24px;
  line-height: 1.5;
  display: block;
}
.gallery-intro p {
  color: var(--vp-c-text-2);
  font-size: 14px;
  margin-bottom: 0;
}
.experiment-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 22px 0;
}
.experiment-grid button {
  position: relative;
  display: grid;
  gap: 5px;
  text-align: left;
  padding: 16px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
}
.experiment-number {
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
}
.experiment-grid strong {
  font-size: 13px;
}
.experiment-grid small {
  font-size: 11px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
button[aria-pressed="true"] {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
button:hover {
  border-color: var(--vp-c-brand-1);
}
button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}
.experiment-heading {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-top: 30px;
  flex-wrap: wrap;
  font-size: 14px;
}
.experiment-heading a {
  font-size: 12px;
}
.experiment-tip {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.plate-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.plate-tabs button {
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  font-size: 12px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
}
.plate-controls {
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}
.plate-controls > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.plate-controls > header div {
  display: grid;
  gap: 3px;
}
.plate-controls > header span {
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--vp-c-brand-1);
}
.plate-controls > header strong {
  font-size: 14px;
}
.plate-controls > header button {
  padding: 5px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
}
.plate-control-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 22px;
  padding: 16px;
}
.plate-control-grid label {
  display: grid;
  grid-template-columns: minmax(92px, auto) 1fr minmax(82px, auto);
  align-items: center;
  gap: 10px;
  font-size: 12px;
}
.plate-control-grid input {
  width: 100%;
  accent-color: var(--vp-c-brand-1);
}
.plate-control-grid output {
  font-variant-numeric: tabular-nums;
  text-align: right;
  color: var(--vp-c-brand-1);
}
.plate-metrics {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 0 16px 16px;
}
.plate-metrics strong {
  padding: 6px 9px;
  border-radius: 7px;
  background: var(--vp-c-brand-soft);
  font-size: 11px;
  font-weight: 600;
}
.plate-static-note {
  padding: 10px 12px;
  border-left: 3px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 12px;
}
@media (max-width: 650px) {
  .experiment-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .gallery-intro {
    padding: 20px;
  }
  .gallery-intro > strong {
    font-size: 20px;
  }
  .plate-control-grid {
    grid-template-columns: 1fr;
  }
  .plate-control-grid label {
    grid-template-columns: 82px 1fr 76px;
  }
  .plate-controls > header {
    align-items: flex-start;
  }
  .plate-controls > header strong {
    font-size: 12px;
  }
}
</style>
