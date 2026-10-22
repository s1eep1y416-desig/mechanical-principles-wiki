<script setup lang="ts">
import { withBase } from 'vitepress'
import { computed } from 'vue'
import { parts, chapters } from '../../data/chapters.mjs'

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
  partName?: string
}
type Group = {
  id: string
  name: string
  en: string
  desc: string
  range: string
  chapters: Chapter[]
}

const intro = chapters.find((c: Chapter) => c.n === 1) as Chapter | undefined

const groups = computed<Group[]>(() =>
  parts.map((part: any) => ({
    id: part.id,
    name: part.name,
    en: part.en,
    desc: part.desc,
    range: part.range,
    chapters: part.chapters.map((ch: Chapter) => ({ ...ch, partName: part.name }))
  }))
)

const totalSections = computed(() =>
  chapters.reduce((sum: number, ch: Chapter) => sum + ch.sections.filter((s) => !s.star).length, 0)
)

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function coreSections(ch: Chapter) {
  return ch.sections.filter((s) => !s.star).length
}
</script>

<template>
  <div class="catalog">
    <div class="catalog-summary">
      <div><b>{{ chapters.length }}</b><span>章</span></div>
      <div><b>{{ groups.length }}</b><span>篇</span></div>
      <div><b>{{ totalSections }}</b><span>个核心小节</span></div>
      <div><b>56</b><span>张公式卡</span></div>
    </div>

    <a v-if="intro" :href="withBase(`/chapters/${intro.slug}`)" class="intro-card">
      <div class="intro-card__num">{{ pad(intro.n) }}</div>
      <div class="intro-card__body">
        <div class="intro-card__top">
          <span class="intro-card__kind">绪论 · 全书的入口</span>
          <span class="intro-card__pages">教材 p.{{ intro.pages }}</span>
        </div>
        <h2>{{ intro.title }}</h2>
        <p>{{ intro.lead }}</p>
        <div class="intro-card__tags">
          <span v-for="tag in intro.tags" :key="tag">{{ tag }}</span>
        </div>
      </div>
      <span class="intro-card__arrow" aria-hidden="true">↗</span>
    </a>

    <section v-for="group in groups" :key="group.id" class="catalog-group">
      <header class="catalog-group__head">
        <span class="catalog-group__roman">{{ group.id }}</span>
        <div class="catalog-group__title">
          <h2>{{ group.name }}</h2>
          <span>{{ group.en }}</span>
        </div>
        <p>{{ group.desc }}</p>
        <span class="catalog-group__range">p.{{ group.range }}</span>
      </header>

      <div class="catalog-grid">
        <a
          v-for="chapter in group.chapters"
          :key="chapter.n"
          :href="withBase(`/chapters/${chapter.slug}`)"
          class="catalog-card"
        >
          <div class="catalog-card__top">
            <span class="catalog-card__num">{{ pad(chapter.n) }}</span>
            <span class="catalog-card__pages">p.{{ chapter.pages }}</span>
            <span class="catalog-card__arrow" aria-hidden="true">↗</span>
          </div>
          <h3>{{ chapter.title }}</h3>
          <span v-if="chapter.en" class="catalog-card__en">{{ chapter.en }}</span>
          <p class="catalog-card__lead">{{ chapter.lead }}</p>
          <div class="catalog-card__tags">
            <span v-for="tag in chapter.tags" :key="tag">{{ tag }}</span>
          </div>
          <div class="catalog-card__foot">
            <span>{{ coreSections(chapter) }} 节 · {{ chapter.sections.length }} 个目录条目</span>
            <span class="catalog-card__open">进入 →</span>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.catalog {
  margin: 10px 0 36px;
}

.catalog-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin: 20px 0 22px;
  padding: 15px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.catalog-summary div {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.catalog-summary b {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 20px;
  font-weight: 700;
}

.catalog-summary span {
  color: var(--vp-c-text-3);
  font-size: 11px;
}

/* ---------- intro ---------- */
.intro-card {
  position: relative;
  display: grid;
  grid-template-columns: 78px minmax(0, 1fr) 22px;
  gap: 20px;
  align-items: start;
  margin: 0 0 8px;
  padding: 22px 24px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 15px;
  background:
    linear-gradient(135deg, var(--vp-c-brand-soft), transparent 62%),
    var(--vp-c-bg);
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.18s,
    transform 0.18s;
}

.intro-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.intro-card__num {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 46px;
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.05em;
  opacity: 0.9;
}

.intro-card__top {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.intro-card__kind {
  color: var(--vp-c-brand-1);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.intro-card__pages {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 9.5px;
}

.intro-card h2 {
  margin: 6px 0 0;
  padding: 0;
  border: 0;
  font-size: 21px;
  letter-spacing: -0.02em;
}

.intro-card h2::before {
  display: none;
}

.intro-card p {
  margin: 6px 0 0;
  color: var(--vp-c-text-3);
  font-size: 12px;
  line-height: 1.7;
}

.intro-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 11px;
}

.intro-card__tags span {
  padding: 2px 7px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  font-size: 9px;
}

.intro-card__arrow {
  color: var(--vp-c-text-3);
  font-size: 13px;
  opacity: 0;
  transition: opacity 0.18s;
}

.intro-card:hover .intro-card__arrow {
  opacity: 1;
}

/* ---------- parts ---------- */
.catalog-group {
  padding: 28px 0 4px;
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 20px;
}

.catalog-group:first-of-type {
  border-top: 0;
}

.catalog-group__head {
  display: grid;
  grid-template-columns: 34px 190px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: baseline;
  margin-bottom: 14px;
}

.catalog-group__roman {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  font-weight: 700;
}

.catalog-group__title h2 {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 19px;
}

.catalog-group__title h2::before {
  display: none;
}

.catalog-group__title > span {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 8px;
  letter-spacing: 0.12em;
}

.catalog-group__head p {
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 11.5px;
  line-height: 1.6;
}

.catalog-group__range {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
  white-space: nowrap;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.catalog-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 15px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 11px;
  background: var(--vp-c-bg);
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.18s,
    transform 0.18s,
    box-shadow 0.18s;
}

.catalog-card:hover {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 55%, transparent);
  transform: translateY(-2px);
  box-shadow: 0 9px 24px color-mix(in srgb, var(--vp-c-brand-3) 9%, transparent);
}

.catalog-card__top {
  display: flex;
  align-items: center;
  gap: 9px;
}

.catalog-card__num {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  font-weight: 700;
}

.catalog-card__pages {
  flex: 1;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
}

.catalog-card__arrow {
  color: var(--vp-c-text-3);
  font-size: 10px;
  opacity: 0;
  transition: opacity 0.18s;
}

.catalog-card:hover .catalog-card__arrow {
  opacity: 1;
  color: var(--vp-c-brand-1);
}

.catalog-card h3 {
  margin: 7px 0 0;
  color: var(--vp-c-text-1);
  font-size: 15px;
  letter-spacing: -0.01em;
}

.catalog-card__en {
  margin-top: 2px;
  overflow: hidden;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 7.5px;
  letter-spacing: 0.08em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.catalog-card__lead {
  flex: 1;
  display: -webkit-box;
  margin: 7px 0 0;
  overflow: hidden;
  color: var(--vp-c-text-3);
  font-size: 11.5px;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.catalog-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
}

.catalog-card__tags span {
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  font-size: 9px;
}

.catalog-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
  padding-top: 9px;
  border-top: 1px dashed var(--vp-c-divider);
  color: var(--vp-c-text-3);
  font-size: 9px;
}

.catalog-card__open {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.18s;
}

.catalog-card:hover .catalog-card__open {
  opacity: 1;
}

@media (max-width: 860px) {
  .catalog-group__head {
    grid-template-columns: 26px 1fr;
    gap: 4px 12px;
  }

  .catalog-group__head p {
    grid-column: 2;
  }

  .catalog-group__range {
    grid-column: 2;
  }
}

@media (max-width: 720px) {
  .intro-card {
    grid-template-columns: 54px minmax(0, 1fr);
    gap: 14px;
    padding: 18px;
  }

  .intro-card__num {
    font-size: 34px;
  }

  .intro-card__arrow {
    display: none;
  }

  .catalog-grid {
    grid-template-columns: 1fr;
  }

  .catalog-summary {
    gap: 18px;
    padding: 13px 16px;
  }
}
</style>
