<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })

const chapters = [
  { id: '01', title: '绪论', group: '绪论', link: '/chapters/01-introduction' },
  { id: '02', title: '机构的结构分析', group: '分析基础', link: '/chapters/02-structural-analysis' },
  { id: '03', title: '平面机构的运动分析', group: '分析基础', link: '/chapters/03-kinematic-analysis' },
  { id: '04', title: '平面机构的静力分析', group: '分析基础', link: '/chapters/04-static-force-analysis' },
  { id: '05', title: '机械的动力分析', group: '分析基础', link: '/chapters/05-dynamic-analysis' },
  { id: '06', title: '机械的平衡', group: '分析基础', link: '/chapters/06-balancing' },
  { id: '07', title: '机械运转与速度波动', group: '分析基础', link: '/chapters/07-speed-fluctuation' },
  { id: '08', title: '连杆机构及其设计', group: '机构设计', link: '/chapters/08-linkage-design' },
  { id: '09', title: '凸轮机构及其设计', group: '机构设计', link: '/chapters/09-cam-design' },
  { id: '10', title: '齿轮机构及其设计', group: '机构设计', link: '/chapters/10-gear-mechanisms' },
  { id: '11', title: '齿轮系及其设计', group: '机构设计', link: '/chapters/11-gear-trains' },
  { id: '12', title: '其他常用机构', group: '机构设计', link: '/chapters/12-other-mechanisms' },
  { id: '13', title: '机械系统的方案设计', group: '方案设计', link: '/chapters/13-system-concept-design' },
  { id: '14', title: '机器人机构及其设计', group: '方案设计', link: '/chapters/14-robot-mechanisms' }
]

const groups = ['绪论', '分析基础', '机构设计', '方案设计']
const done = ref<string[]>([])
const storageKey = 'mpwiki-chapters-v1'
const loaded = ref(false)

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]')
    if (Array.isArray(saved)) done.value = saved.filter((x) => typeof x === 'string')
  } catch {
    done.value = []
  }
  loaded.value = true
})

watch(
  done,
  (value) => {
    if (!loaded.value) return
    localStorage.setItem(storageKey, JSON.stringify(value))
  },
  { deep: true }
)

const count = computed(() => done.value.length)
const percent = computed(() => Math.round((count.value / chapters.length) * 100))

function toggle(id: string) {
  done.value = done.value.includes(id) ? done.value.filter((x) => x !== id) : [...done.value, id]
}

function reset() {
  done.value = []
}

function byGroup(group: string) {
  return chapters.filter((c) => c.group === group)
}
</script>

<template>
  <section class="progress-widget" :class="{ 'is-compact': compact }">
    <header class="progress-widget__head">
      <div>
        <span class="progress-widget__eyebrow">LEARNING TRACKER</span>
        <h2>把十四章，走成一条进度条</h2>
        <p>勾选已经读完的章节，进度只保存在你的浏览器里。</p>
      </div>
      <div class="progress-widget__ring" :style="{ '--p': percent }">
        <span>{{ percent }}<small>%</small></span>
      </div>
    </header>

    <div class="progress-widget__bar">
      <span :style="{ width: percent + '%' }" />
    </div>
    <div class="progress-widget__meta">
      <span>已读 {{ count }} / {{ chapters.length }} 章</span>
      <button v-if="count" @click="reset">清空进度</button>
    </div>

    <div v-if="!compact" class="progress-widget__groups">
      <div v-for="group in groups" :key="group" class="progress-widget__group">
        <span class="progress-widget__group-name">{{ group }}</span>
        <div class="progress-widget__chips">
          <label
            v-for="chapter in byGroup(group)"
            :key="chapter.id"
            class="progress-chip"
            :class="{ done: done.includes(chapter.id) }"
            :title="chapter.title"
          >
            <input
              type="checkbox"
              :checked="done.includes(chapter.id)"
              @change="toggle(chapter.id)"
            />
            <span class="progress-chip__num">{{ chapter.id }}</span>
            <span class="progress-chip__title">{{ chapter.title }}</span>
            <a
              class="progress-chip__link"
              :href="chapter.link"
              title="阅读本章"
              aria-label="阅读本章"
              @click.stop
              >↗</a
            >
          </label>
        </div>
      </div>
    </div>

    <div v-else class="progress-widget__compact">
      <div class="progress-widget__compact-head">
        <span>点击章节即可标记已读</span>
        <a href="/chapters/">十四章总览 →</a>
      </div>
      <div class="progress-widget__compact-grid">
        <button
          v-for="chapter in chapters"
          :key="chapter.id"
          class="compact-chapter"
          :class="{ done: done.includes(chapter.id) }"
          :title="chapter.title"
          @click="toggle(chapter.id)"
        >
          <b>{{ chapter.id }}</b>
          <span>{{ chapter.title }}</span>
          <i>{{ done.includes(chapter.id) ? '✓' : '+' }}</i>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.progress-widget {
  margin: 32px 0;
  padding: 28px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg-soft);
}

.progress-widget__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.progress-widget__eyebrow {
  color: var(--vp-c-brand-1);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
}

.progress-widget h2 {
  margin: 4px 0 6px;
  padding: 0;
  border: 0;
  font-size: 24px;
  letter-spacing: -0.02em;
}

.progress-widget__head p {
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.progress-widget__ring {
  --p: 0;
  display: grid;
  flex: none;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: conic-gradient(var(--vp-c-brand-1) calc(var(--p) * 1%), var(--vp-c-divider) 0);
  place-items: center;
}

.progress-widget__ring::before {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  content: '';
  grid-area: 1 / 1;
}

.progress-widget__ring span {
  z-index: 1;
  color: var(--vp-c-text-1);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 18px;
  font-weight: 800;
  grid-area: 1 / 1;
}

.progress-widget__ring small {
  font-size: 10px;
  font-weight: 500;
}

.progress-widget__bar {
  height: 6px;
  margin-top: 22px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--vp-c-divider);
}

.progress-widget__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--vp-c-brand-1), #35b6ff);
  transition: width 0.35s ease;
}

.progress-widget__meta {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: var(--vp-c-text-3);
  font-size: 11px;
}

.progress-widget__meta button {
  border: 0;
  background: none;
  color: var(--vp-c-text-3);
  font-size: 11px;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.progress-widget__groups {
  display: grid;
  gap: 14px;
  margin-top: 22px;
}

.progress-widget__group {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
}

.progress-widget__group-name {
  padding-top: 7px;
  color: var(--vp-c-text-3);
  font-size: 11px;
  font-weight: 700;
}

.progress-widget__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.progress-chip {
  position: relative;
  display: flex;
  align-items: center;
  gap: 7px;
  max-width: 100%;
  padding: 6px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  cursor: pointer;
  transition:
    border-color 0.18s,
    color 0.18s,
    background 0.18s;
}

.progress-chip:hover {
  border-color: var(--vp-c-brand-1);
}

.progress-chip.done {
  border-color: rgba(34, 160, 107, 0.4);
  background: rgba(34, 160, 107, 0.07);
  color: var(--vp-c-text-1);
}

.progress-chip input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.progress-chip__num {
  color: var(--vp-c-text-3);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 10px;
}

.progress-chip.done .progress-chip__num {
  color: #22a06b;
}

.progress-chip__title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.progress-chip__link {
  margin-left: 2px;
  color: var(--vp-c-text-3);
  font-size: 10px;
  text-decoration: none;
  opacity: 0;
}

.progress-chip:hover .progress-chip__link {
  opacity: 1;
}

.progress-widget__compact {
  margin-top: 18px;
}

.progress-widget__compact-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 9px;
  color: var(--vp-c-text-3);
  font-size: 10.5px;
}

.progress-widget__compact-head a {
  color: var(--vp-c-brand-1);
  font-size: 10.5px;
  font-weight: 600;
  text-decoration: none;
}

.progress-widget__compact-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
}

.compact-chapter {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  padding: 7px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 10.5px;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;
}

.compact-chapter:hover {
  border-color: var(--vp-c-brand-1);
}

.compact-chapter.done {
  border-color: rgba(34, 160, 107, 0.4);
  background: rgba(34, 160, 107, 0.07);
}

.compact-chapter b {
  flex: none;
  color: var(--vp-c-brand-1);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 9px;
  font-weight: 700;
}

.compact-chapter span {
  overflow: hidden;
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.compact-chapter i {
  flex: none;
  color: var(--vp-c-text-3);
  font-style: normal;
  font-size: 10px;
}

.compact-chapter.done i {
  color: #22a06b;
}

.is-compact {
  padding: 22px;
}

.is-compact h2 {
  font-size: 20px;
}

@media (max-width: 760px) {
  .progress-widget__compact-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .progress-widget {
    padding: 20px;
  }

  .progress-widget__ring {
    width: 58px;
    height: 58px;
  }

  .progress-widget__ring::before {
    width: 46px;
    height: 46px;
  }

  .progress-widget__ring span {
    font-size: 15px;
  }

  .progress-widget__group {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .progress-widget__group-name {
    padding-top: 0;
  }

  .is-compact h2 {
    font-size: 18px;
  }
}
</style>
