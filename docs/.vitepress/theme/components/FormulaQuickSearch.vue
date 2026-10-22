<script setup lang="ts">
import { withBase } from 'vitepress'
import { computed, ref } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { formulas, categories } from '../../data/formulas.mjs'

type Formula = {
  name: string
  cat: string
  latex: string
  note: string
  chapter: string | number
  link: string
  hot?: boolean
  keys?: string
}

type FormulaCard = Formula & { html: string }

type CategoryEntry = string | { id?: string; name?: string; label?: string; title?: string }

const props = withDefaults(defineProps<{ compact?: boolean; limit?: number }>(), {
  compact: false,
  limit: 6
})

const items = computed<FormulaCard[]>(() =>
  (formulas as Formula[]).map((item) => ({
    ...item,
    html: katex.renderToString(item.latex, {
      throwOnError: false,
      strict: false,
      displayMode: false
    })
  }))
)

const categoryNames = computed<string[]>(() => {
  const list = (categories as CategoryEntry[] | undefined) || []
  const names = list
    .map((cat) =>
      typeof cat === 'string' ? cat : cat?.name || cat?.label || cat?.title || cat?.id || ''
    )
    .filter((cat): cat is string => Boolean(cat) && cat !== '全部')
  return ['全部', ...Array.from(new Set(names))]
})

const query = ref('')
const category = ref('全部')
const copied = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return items.value.filter((f) => {
    const catOk = category.value === '全部' || f.cat === category.value
    const textOk =
      !q || `${f.name} ${f.note} ${f.keys || ''} ${f.cat} ${f.chapter}`.toLowerCase().includes(q)
    return catOk && textOk
  })
})

const shown = computed(() =>
  props.compact
    ? items.value
        .filter((f) => f.hot)
        .slice(0, props.limit)
        .concat(
          items.value.filter((f) => !f.hot).slice(0, Math.max(0, props.limit - items.value.filter((f) => f.hot).length))
        )
        .slice(0, props.limit)
    : filtered.value
)

async function copy(item: Formula) {
  try {
    await navigator.clipboard.writeText(item.latex)
    copied.value = item.name
    window.setTimeout(() => {
      if (copied.value === item.name) copied.value = ''
    }, 1600)
  } catch {
    copied.value = ''
  }
}
</script>

<template>
  <section class="formula-search" :class="{ 'is-compact': compact }">
    <header v-if="compact" class="formula-search__compact-head">
      <div>
        <span class="formula-search__eyebrow">FORMULA INDEX · 核心公式速查</span>
        <h2>先查公式，再回章节</h2>
      </div>
      <a :href="withBase('/appendix/formulas')">全部 {{ items.length }} 个公式 →</a>
    </header>

    <template v-if="!compact">
      <div class="formula-search__controls">
        <div class="formula-search__input">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
          <input
            v-model="query"
            type="search"
            placeholder="搜索公式、符号或关键词，例如：自由度、传动比、飞轮、雅可比…"
            aria-label="搜索公式"
          />
          <button v-if="query" aria-label="清除搜索" @click="query = ''">×</button>
        </div>
        <span class="formula-search__result">{{ filtered.length }} 条</span>
      </div>

      <div class="formula-search__tabs" role="tablist">
        <button
          v-for="cat in categoryNames"
          :key="cat"
          role="tab"
          :aria-selected="category === cat"
          :class="{ active: category === cat }"
          @click="category = cat"
        >
          {{ cat }}
        </button>
      </div>
    </template>

    <div class="formula-grid">
      <article v-for="item in shown" :key="item.name" class="formula-card" :data-formula="item.name">
        <div class="formula-card__top">
          <span class="formula-card__cat">{{ item.cat }}</span>
          <span v-if="item.hot" class="formula-card__hot">高频</span>
          <a class="formula-card__chapter" :href="withBase(item.link)">第 {{ item.chapter }} 章 ↗</a>
        </div>
        <h3>{{ item.name }}</h3>
        <div class="formula-card__math" v-html="item.html" />
        <p>{{ item.note }}</p>
        <button class="formula-card__copy" @click="copy(item)">
          {{ copied === item.name ? '已复制 LaTeX' : '复制 LaTeX' }}
        </button>
      </article>
    </div>

    <p v-if="!shown.length" class="formula-search__empty">
      没有匹配的公式。试试更短的关键词，或切换到“全部”。
    </p>
  </section>
</template>

<style scoped>
.formula-search {
  margin: 28px 0;
}

.formula-search__compact-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 18px;
}

.formula-search__compact-head h2 {
  margin: 3px 0 0;
  padding: 0;
  border: 0;
  font-size: 26px;
  letter-spacing: -0.02em;
}

.formula-search__compact-head a {
  flex: none;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.formula-search__compact-head a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.formula-search__eyebrow {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.formula-search__controls {
  display: flex;
  align-items: center;
  gap: 14px;
}

.formula-search__input {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 9px;
  padding: 0 13px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.formula-search__input:focus-within {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.formula-search__input svg {
  flex: none;
  width: 17px;
  height: 17px;
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 1.7;
}

.formula-search__input input {
  width: 100%;
  height: 42px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 13px;
}

.formula-search__input button {
  border: 0;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 18px;
  cursor: pointer;
}

.formula-search__result {
  flex: none;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
}

.formula-search__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 12px 0 18px;
}

.formula-search__tabs button {
  padding: 5px 11px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 11px;
  cursor: pointer;
  transition:
    border-color 0.16s,
    color 0.16s,
    background 0.16s;
}

.formula-search__tabs button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.formula-search__tabs button.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
}

.formula-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.formula-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 17px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 13px;
  background: var(--vp-c-bg);
  transition:
    border-color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
}

.formula-card:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 50%, transparent);
  transform: translateY(-2px);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--vp-c-brand-3) 9%, transparent);
}

.formula-card__top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.formula-card__cat {
  color: var(--vp-c-text-3);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.formula-card__hot {
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--tmm-amber-soft, rgba(217, 119, 6, 0.12));
  color: var(--tmm-amber, #b45309);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.formula-card__chapter {
  margin-left: auto;
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 9.5px;
  text-decoration: none;
}

.formula-card__chapter:hover {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.formula-card h3 {
  margin: 7px 0 0;
  color: var(--vp-c-text-1);
  font-size: 14.5px;
  font-weight: 700;
}

.formula-card__math {
  margin: 8px 0 4px;
  overflow-x: auto;
  overflow-y: hidden;
  color: var(--vp-c-text-1);
  font-size: 14px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.formula-card__math::-webkit-scrollbar {
  display: none;
}

.formula-card p {
  flex: 1;
  margin: 5px 0 0;
  color: var(--vp-c-text-3);
  font-size: 11.5px;
  line-height: 1.65;
}

.formula-card__copy {
  align-self: flex-start;
  margin-top: 10px;
  padding: 3px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 10px;
  cursor: pointer;
}

.formula-card__copy:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.formula-search__empty {
  padding: 30px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 12px;
  color: var(--vp-c-text-3);
  font-size: 13px;
  text-align: center;
}

@media (max-width: 760px) {
  .formula-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .formula-search__controls {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .formula-search__result {
    text-align: right;
  }

  .formula-search__compact-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .formula-search__compact-head h2 {
    font-size: 22px;
  }
}
</style>
