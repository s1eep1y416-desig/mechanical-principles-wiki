<script setup lang="ts">
import { withBase } from 'vitepress'
withDefaults(
  defineProps<{
    note?: string
  }>(),
  { note: '' }
)
</script>

<template>
  <aside class="unit-convention">
    <header>
      <span>UNIT CONVENTION</span>
      <b>机械原理符号与单位约定</b>
    </header>

    <div class="unit-chips">
      <span><em>l</em> mm</span>
      <span><em>θ</em> °</span>
      <span><em>ω</em> rad/s</span>
      <span><em>ε</em> rad/s²</span>
      <span><em>v</em> m/s</span>
      <span><em>a</em> m/s²</span>
      <span><em>M</em> N·m</span>
      <span><em>η</em> —</span>
      <span><em>i</em> —</span>
      <span><em>m</em> mm</span>
      <span><em>z</em> —</span>
    </div>

    <p>
      以上为本站公式的默认单位。角度除特别说明外按 ° 处理，凡采用弧度制的公式会显式写 rad；
      角速度与角加速度一律用 rad/s、rad/s²，与线速度 v、加速度 a 的 m/s、m/s² 配套。
      构件长度 l、模数 m 用 mm，力矩统一用 N·m。η、i、z 及各类系数为无量纲量。
      同一符号在不同章含义不同时会单独说明，例如 m 在齿轮章为模数，在动力分析中可表示质量。
      <template v-if="note"> {{ note }}</template>
    </p>

    <a :href="withBase('/guide/conventions')">完整符号表与单位换算 →</a>
  </aside>
</template>

<style scoped>
.unit-convention {
  margin: 0 0 22px;
  padding: 13px 15px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.unit-convention header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.unit-convention header span {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.unit-convention header b {
  color: var(--vp-c-text-1);
  font-size: 11.5px;
}

.unit-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.unit-chips span {
  padding: 3px 7px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
}

.unit-chips em {
  margin-right: 3px;
  color: var(--vp-c-brand-1);
  font-style: normal;
  font-weight: 600;
}

.unit-convention p {
  margin: 8px 0 0;
  color: var(--vp-c-text-3);
  font-size: 10.5px;
  line-height: 1.7;
}

.unit-convention a {
  display: inline-block;
  margin-top: 6px;
  color: var(--vp-c-brand-1);
  font-size: 10px;
  font-weight: 600;
  text-decoration: none;
}

.unit-convention a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 640px) {
  .unit-convention {
    padding: 11px 12px;
  }

  .unit-chips span {
    font-size: 8.5px;
  }
}
</style>
