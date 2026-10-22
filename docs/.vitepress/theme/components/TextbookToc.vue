<script setup lang="ts">
import { withBase } from 'vitepress'
import { computed } from 'vue'
import { book, parts, chapters } from '../../data/chapters.mjs'

type Section = { no: string; title: string; page: string; star?: boolean }
type Chapter = {
  n: number
  slug: string
  title: string
  en?: string
  pages: string
  lead?: string
  tags?: string[]
  sections: Section[]
}

const intro = chapters.find((c: Chapter) => c.n === 1) as Chapter | undefined
const allChapters = chapters as Chapter[]

const totalSections = computed(() =>
  allChapters.reduce((sum: number, ch: Chapter) => sum + ch.sections.length, 0)
)
const totalCore = computed(() =>
  allChapters.reduce((sum: number, ch: Chapter) => sum + ch.sections.filter((s) => !s.star).length, 0)
)

function pad(n: number) {
  return String(n).padStart(2, '0')
}
</script>

<template>
  <div class="textbook">
    <div class="textbook__stats">
      <div><b>{{ book.pages }}</b><span>页（正文）</span></div>
      <div><b>{{ allChapters.length }}</b><span>章</span></div>
      <div><b>{{ parts.length }}</b><span>篇</span></div>
      <div><b>{{ totalSections }}</b><span>个目录条目</span></div>
      <div><b>{{ book.edition.replace('第', '').replace('版', '') }}</b><span>{{ book.edition }}</span></div>
    </div>

    <p class="textbook__legend">
      <span class="textbook__legend-star">*</span> 为教材中的拓展小节，本站只要求了解结论；
      页码为教材正文页码（{{ book.publisher }}，{{ book.year }} 年）。
    </p>

    <section v-if="intro" class="textbook-part">
      <header class="textbook-part__head">
        <span>0</span>
        <h2>绪论</h2>
        <i>INTRODUCTION</i>
      </header>
      <div class="textbook-list">
        <details class="textbook-chapter" open>
          <summary>
            <span class="textbook-chapter__num">{{ pad(intro.n) }}</span>
            <b>{{ intro.title }}</b>
            <span class="textbook-chapter__pages">p.{{ intro.pages }}</span>
            <span class="textbook-chapter__count">{{ intro.sections.length }} 节</span>
            <span class="textbook-chapter__toggle" aria-hidden="true">⌄</span>
          </summary>
          <div class="textbook-chapter__body">
            <ul>
              <li v-for="section in intro.sections" :key="section.no">
                <span>{{ section.no }}</span>
                <p>
                  {{ section.title }}
                  <sup v-if="section.star" class="textbook-chapter__star" title="教材拓展小节">*</sup>
                </p>
                <em>p.{{ section.page }}</em>
              </li>
            </ul>
            <a :href="withBase(`/chapters/${intro.slug}`)">进入本站本章 →</a>
          </div>
        </details>
      </div>
    </section>

    <section v-for="part in parts" :key="part.id" class="textbook-part">
      <header class="textbook-part__head">
        <span>{{ part.id }}</span>
        <h2>{{ part.name }}</h2>
        <i>{{ part.en }}</i>
        <em>p.{{ part.range }}</em>
      </header>

      <div class="textbook-list">
        <details v-for="chapter in part.chapters" :key="chapter.n" class="textbook-chapter">
          <summary>
            <span class="textbook-chapter__num">{{ pad(chapter.n) }}</span>
            <b>{{ chapter.title }}</b>
            <span class="textbook-chapter__pages">p.{{ chapter.pages }}</span>
            <span class="textbook-chapter__count">{{ chapter.sections.length }} 节</span>
            <span class="textbook-chapter__toggle" aria-hidden="true">⌄</span>
          </summary>
          <div class="textbook-chapter__body">
            <ul>
              <li v-for="section in chapter.sections" :key="section.no">
                <span>{{ section.no }}</span>
                <p>
                  {{ section.title }}
                  <sup v-if="section.star" class="textbook-chapter__star" title="教材拓展小节">*</sup>
                </p>
                <em>p.{{ section.page }}</em>
              </li>
            </ul>
            <div class="textbook-chapter__foot">
              <a :href="withBase(`/chapters/${chapter.slug}`)">进入本站本章 →</a>
              <span>{{ chapter.lead }}</span>
            </div>
          </div>
        </details>
      </div>
    </section>

    <p class="textbook__note">
      全书共 {{ totalCore }} 个核心小节、{{ totalSections - totalCore }} 个 * 号拓展条目。
      本站按“问题 → 模型 → 公式 → 例 → 易错点”重写每章，不复述教材原文。
    </p>
  </div>
</template>

<style scoped>
.textbook {
  margin: 8px 0 32px;
}

.textbook__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin: 22px 0 12px;
  padding: 17px 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.textbook__stats div {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.textbook__stats b {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 22px;
  line-height: 1;
}

.textbook__stats span {
  color: var(--vp-c-text-3);
  font-size: 11px;
}

.textbook__legend {
  margin: 0 0 22px;
  color: var(--vp-c-text-3);
  font-size: 11.5px;
  line-height: 1.7;
}

.textbook__legend-star {
  color: var(--tmm-amber, #d97706);
  font-weight: 700;
}

.textbook-part {
  margin-top: 30px;
}

.textbook-part__head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding-bottom: 9px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.textbook-part__head > span {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  font-weight: 700;
}

.textbook-part__head h2 {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 20px;
}

.textbook-part__head h2::before {
  display: none;
}

.textbook-part__head i {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 8px;
  font-style: normal;
  letter-spacing: 0.12em;
}

.textbook-part__head em {
  margin-left: auto;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
  font-style: normal;
  white-space: nowrap;
}

.textbook-list {
  border-bottom: 1px solid var(--vp-c-divider);
}

.textbook-chapter {
  border-top: 1px solid var(--vp-c-divider);
  background: transparent;
}

.textbook-chapter:first-child {
  border-top: 0;
}

.textbook-chapter summary {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto 48px 16px;
  gap: 10px;
  align-items: center;
  padding: 12px 8px;
  list-style: none;
  cursor: pointer;
  transition: background 0.15s;
}

.textbook-chapter summary::-webkit-details-marker {
  display: none;
}

.textbook-chapter summary:hover {
  background: var(--vp-c-bg-soft);
}

.textbook-chapter__num {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  font-weight: 700;
}

.textbook-chapter summary b {
  color: var(--vp-c-text-1);
  font-size: 13.5px;
  font-weight: 600;
}

.textbook-chapter__pages {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
}

.textbook-chapter__count {
  color: var(--vp-c-text-3);
  font-size: 10px;
  text-align: right;
}

.textbook-chapter__toggle {
  color: var(--vp-c-text-3);
  font-size: 13px;
  line-height: 1;
  text-align: center;
  transition: transform 0.18s;
}

.textbook-chapter[open] .textbook-chapter__toggle {
  transform: rotate(180deg);
}

.textbook-chapter__body {
  padding: 2px 8px 18px 42px;
}

.textbook-chapter__body ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.textbook-chapter__body li {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: baseline;
  padding: 5px 0;
  border-top: 1px dashed var(--vp-c-divider);
}

.textbook-chapter__body li:first-child {
  border-top: 0;
}

.textbook-chapter__body li > span {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
}

.textbook-chapter__body li > p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 11.5px;
  line-height: 1.55;
}

.textbook-chapter__star {
  margin-left: 2px;
  color: var(--tmm-amber, #d97706);
  font-size: 10px;
  font-weight: 700;
}

.textbook-chapter__body li > em {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
  font-style: normal;
}

.textbook-chapter__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 14px;
  margin-top: 12px;
}

.textbook-chapter__foot a {
  flex: none;
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
}

.textbook-chapter__foot a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.textbook-chapter__foot span {
  color: var(--vp-c-text-3);
  font-size: 10px;
  line-height: 1.6;
}

.textbook__note {
  margin: 26px 0 0;
  padding-top: 14px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  font-size: 11px;
  line-height: 1.7;
}

@media (max-width: 640px) {
  .textbook__stats {
    gap: 18px;
    padding: 14px 16px;
  }

  .textbook-chapter summary {
    grid-template-columns: 26px minmax(0, 1fr) auto 16px;
  }

  .textbook-chapter__count {
    display: none;
  }

  .textbook-chapter__body {
    padding-left: 8px;
  }

  .textbook-chapter__body li {
    grid-template-columns: 38px minmax(0, 1fr) auto;
  }

  .textbook-part__head {
    flex-wrap: wrap;
  }

  .textbook-part__head em {
    margin-left: 0;
  }
}
</style>
