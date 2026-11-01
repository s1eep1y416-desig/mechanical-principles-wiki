<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { withBase } from "vitepress";
import { challenges, checkChallenge } from "../utils/challenge-models.mjs";
const index = ref(0),
  input = ref(""),
  choice = ref<number | null>(null),
  checked = ref(false),
  passed = ref<string[]>([]),
  loaded = ref(false);
const current = computed(() => challenges[index.value]);
const answer = computed(() =>
  current.value.type === "choice" ? choice.value : input.value,
);
const correct = computed(
  () => checked.value && checkChallenge(current.value, answer.value),
);
onMounted(() => {
  try {
    passed.value = JSON.parse(
      localStorage.getItem("tmmwiki-challenges") || "[]",
    );
  } catch {}
  loaded.value = true;
});
watch(
  passed,
  (value) => {
    if (loaded.value)
      localStorage.setItem("tmmwiki-challenges", JSON.stringify(value));
  },
  { deep: true },
);
function submit() {
  checked.value = true;
  if (
    checkChallenge(current.value, answer.value) &&
    !passed.value.includes(current.value.id)
  )
    passed.value.push(current.value.id);
}
function move(delta: number) {
  index.value = (index.value + delta + challenges.length) % challenges.length;
  input.value = "";
  choice.value = null;
  checked.value = false;
}
</script>
<template>
  <section class="challenge-lab">
    <header>
      <div>
        <span>INTEGRATED PRACTICE</span>
        <h2>机构综合练习</h2>
      </div>
      <strong>{{ passed.length }} / {{ challenges.length }} 已通过</strong>
    </header>
    <article>
      <small>第 {{ current.chapter }} 章 · {{ current.title }}</small>
      <h3>{{ current.prompt }}</h3>
      <div v-if="current.type === 'choice'" class="choices">
        <button
          v-for="(option, i) in current.options"
          :key="option"
          :aria-pressed="choice === i"
          @click="choice = i"
        >
          {{ String.fromCharCode(65 + i) }}. {{ option }}
        </button>
      </div>
      <label v-else class="number-answer"
        >计算结果<input
          v-model="input"
          type="number"
          :aria-label="current.title + '答案'"
        /><span>{{ current.unit }}</span></label
      >
      <p class="hint">提示：{{ current.hint }}</p>
      <button
        class="submit"
        :disabled="current.type === 'choice' ? choice === null : !input"
        @click="submit"
      >
        检查答案
      </button>
      <div
        v-if="checked"
        class="solution"
        :class="{ ok: correct }"
        aria-live="polite"
      >
        <strong>{{ correct ? "正确" : "继续检查计算链" }}</strong>
        <p>{{ current.solution }}</p>
        <a :href="withBase(current.link)">回到对应章节 →</a>
      </div>
      <footer>
        <button @click="move(-1)">上一题</button
        ><button @click="move(1)">下一题</button>
      </footer>
    </article>
  </section>
</template>
<style scoped>
.challenge-lab {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px;
}
header span {
  color: var(--vp-c-brand-1);
  font: 700 10px var(--vp-font-family-mono);
  letter-spacing: 0.14em;
}
header h2 {
  margin: 4px 0;
  padding: 0;
  border: 0;
  font-size: 22px;
}
header > strong {
  font: 15px var(--vp-font-family-mono);
}
article {
  padding: 22px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}
article small {
  color: var(--vp-c-text-3);
}
article h3 {
  font-size: 18px;
  line-height: 1.7;
}
.choices {
  display: grid;
  gap: 9px;
}
.choices button,
.submit,
footer button {
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  text-align: left;
}
.choices button[aria-pressed="true"] {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.number-answer {
  display: flex;
  align-items: center;
  gap: 12px;
}
.number-answer input {
  width: 180px;
  min-height: 44px;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
.hint {
  color: var(--vp-c-text-3);
  font-size: 12px;
}
.submit {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.solution {
  margin-top: 15px;
  padding: 14px;
  border-left: 3px solid #c65a3a;
  background: var(--vp-c-bg-soft);
}
.solution.ok {
  border-left-color: #16845a;
}
.solution p {
  margin: 5px 0;
}
footer {
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
}
</style>
