---
title: 十四章总览
description: 按三篇结构浏览《机械原理》知识库的全部十四章
---

<script setup>
import { withBase } from 'vitepress'
</script>

# 十四章总览

<p class="page-lead">
从这里进入全书的三篇十四章。每章都按“问题 → 模型 → 公式 → 例 → 易错点”组织，并尽量回答三个问题：它解决什么工程问题、方法从哪来、什么时候会失效。
</p>

<p class="textbook-link">需要按教材页码查找？打开 <a :href="withBase('/guide/textbook')">教材目录与页码</a>。</p>

<div class="catalog-stats">
  <div><b>14</b><span>章</span></div>
  <div><b>3</b><span>篇</span></div>
  <div><b>56</b><span>张公式卡</span></div>
  <div><b>18</b><span>张机构图</span></div>
</div>

<ChapterCatalog />

## 你的阅读进度

<StudyProgress />

<style scoped>
.page-lead {
  max-width: 680px;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.85;
}

.catalog-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 36px;
  margin: 26px 0 10px;
  padding: 18px 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.catalog-stats div {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.catalog-stats b {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 22px;
}

.catalog-stats span {
  color: var(--vp-c-text-3);
  font-size: 11px;
}
</style>
