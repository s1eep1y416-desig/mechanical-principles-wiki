import { camContact, flywheelModel, planetary, TAU } from "./lab-models.mjs";
import { quickReturnGeometry } from "./mechanics.mjs";

export const challenges = [
  {
    id: "mobility",
    chapter: "02",
    title: "自由度与局部自由度",
    prompt:
      "平面机构有3个活动构件、4个低副、0个高副，且没有虚约束与局部自由度，机构自由度是多少？",
    type: "number",
    answer: 1,
    tolerance: 0,
    unit: "",
    hint: "使用 F=3n−2Pₗ−Pₕ。",
    solution: "F=3×3−2×4=1，只有一个独立输入。",
    link: "/chapters/02-structural-analysis",
  },
  {
    id: "fourbar",
    chapter: "08",
    title: "四杆机构类型判断",
    prompt:
      "杆长为64、185、130、220 mm，220 mm为机架、64 mm与机架相邻。满足格拉肖夫条件时属于哪一类？",
    type: "choice",
    options: ["双曲柄", "曲柄摇杆", "双摇杆"],
    answer: 1,
    hint: "先找最短杆，再看它与机架的位置。",
    solution:
      "最短杆64 mm与机架相邻，因此最短杆可整周转动，另一机架邻杆摆动，为曲柄摇杆机构。",
    link: "/chapters/08-linkages",
  },
  {
    id: "quick-return",
    chapter: "08",
    title: "急回特性",
    prompt: "本站曲柄摇杆示例的行程速比系数约为多少？",
    type: "number",
    answer: Number(quickReturnGeometry().ratio.toFixed(3)),
    tolerance: 0.01,
    unit: "",
    hint: "K=(180°+θ)/(180°−θ)。",
    solution: `由极位夹角计算 K=${quickReturnGeometry().ratio.toFixed(3)}；K>1表示工作与返回行程平均速度不同。`,
    link: "/chapters/08-linkages",
  },
  {
    id: "gear",
    chapter: "10",
    title: "外啮合齿轮速比",
    prompt: "主动轮24齿、从动轮36齿。输入转速600 r/min，从动轮转速大小是多少？",
    type: "number",
    answer: 400,
    tolerance: 0.1,
    unit: "r/min",
    hint: "外啮合转向相反，题目只问大小。",
    solution: "n₂=n₁z₁/z₂=600×24/36=400 r/min。",
    link: "/chapters/10-gears",
  },
  {
    id: "planetary",
    chapter: "11",
    title: "行星轮系 Willis 关系",
    prompt:
      "24齿太阳轮输入，72齿内齿圈固定，太阳轮转速800 r/min，行星架转速是多少？",
    type: "number",
    answer: 200,
    tolerance: 0.1,
    unit: "r/min",
    hint: "固定内齿圈时，本例行星架角速度为太阳轮的1/4。",
    solution: "由 zₛ(ωₛ−ωH)+zr(ωr−ωH)=0 且 ωr=0，得 ωH=800/4=200 r/min。",
    link: "/chapters/11-gear-trains",
  },
  {
    id: "cam",
    chapter: "09",
    title: "凸轮压力角",
    prompt:
      "基圆90 mm、滚子半径14 mm、升程55 mm的摆线规律，在输入相位60°时压力角约为多少度？",
    type: "number",
    answer: Number(camContact(Math.PI / 3, 55, "cycloid").alpha.toFixed(2)),
    tolerance: 0.2,
    unit: "°",
    hint: "压力角由位移导数与瞬时理论半径共同决定。",
    solution: `按模型计算 α≈${camContact(Math.PI / 3, 55, "cycloid").alpha.toFixed(2)}°。压力角过大会增大侧向力。`,
    link: "/chapters/09-cams",
  },
  {
    id: "flywheel",
    chapter: "07",
    title: "飞轮惯量选择",
    prompt:
      "在同一周期力矩波动下，把飞轮转动惯量从2 kg·m²增大到4 kg·m²，速度不均匀系数如何变化？",
    type: "choice",
    options: ["增大", "减小", "完全不变"],
    answer: 1,
    hint: "比较两个惯量下的 δ。",
    solution: `模型中 J=2时δ=${flywheelModel(0, 2).delta.toFixed(4)}，J=4时δ=${flywheelModel(0, 4).delta.toFixed(4)}，惯量增大使速度波动减小。`,
    link: "/chapters/07-operation-speed-fluctuation",
  },
  {
    id: "robot",
    chapter: "14",
    title: "2R机械臂可达性",
    prompt: "两杆长180 mm和140 mm，目标点距基座中心350 mm。该点是否可达？",
    type: "choice",
    options: ["可达", "不可达", "只在奇异位形可达"],
    answer: 1,
    hint: "2R工作空间半径满足 |l₁−l₂|≤r≤l₁+l₂。",
    solution: "最大可达半径为320 mm，350 mm超出工作空间，因此不可达。",
    link: "/chapters/14-robots",
  },
];

export function checkChallenge(challenge, value) {
  if (challenge.type === "choice") return Number(value) === challenge.answer;
  const number = Number(value);
  return (
    Number.isFinite(number) &&
    Math.abs(number - challenge.answer) <= challenge.tolerance
  );
}
