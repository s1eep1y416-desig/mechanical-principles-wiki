<script setup lang="ts">
import { nextTick, ref, useId } from 'vue'
defineProps<{ title: string; caption?: string; eyebrow?: string }>()
const expanded = ref(false), dialog = ref<HTMLDialogElement>(), trigger = ref<HTMLButtonElement>()
const titleId = `diagram-${useId()}`
async function enlarge() {
  expanded.value = true
  await nextTick()
  dialog.value?.showModal()
}
function close() { dialog.value?.close() }
function restore() { expanded.value = false; nextTick(() => trigger.value?.focus()) }
</script>

<template>
  <figure class="technical-figure">
    <header><div><span>{{ eyebrow || '原理图解' }}</span><strong>{{ title }}</strong></div><button ref="trigger" type="button" @click="enlarge" :aria-label="`放大查看：${title}`">⤢ 放大</button></header>
    <p class="diagram-mobile-hint">宽图可左右滑动，点击「放大」查看细节。</p>
    <div v-if="!expanded" class="technical-figure__canvas"><slot /></div>
    <div v-else class="technical-figure__placeholder">已在放大窗口中打开</div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
    <dialog ref="dialog" :aria-labelledby="titleId" @close="restore" @click="event => { if (event.target === dialog) close() }">
      <header><strong :id="titleId">{{ title }}</strong><button type="button" autofocus @click="close">关闭 · Esc</button></header>
      <div v-if="expanded" class="technical-figure__canvas"><slot /></div>
      <p v-if="caption" class="technical-figure__caption">{{ caption }}</p>
    </dialog>
  </figure>
</template>

<style scoped>
.technical-figure { margin: 28px 0; border: 1px solid var(--vp-c-divider); border-radius: 14px; overflow: hidden; background: var(--vp-c-bg); }
header { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:16px 18px; background:var(--vp-c-bg-soft); border-bottom:1px solid var(--vp-c-divider); }
header div { display:grid; gap:4px; } header span { font-size:11px; letter-spacing:.12em; color:var(--vp-c-text-2); } header strong { font-size:15px; line-height:1.6; color:var(--vp-c-text-1); }
button { flex-shrink:0; border:1px solid var(--vp-c-divider); border-radius:7px; padding:5px 10px; background:var(--vp-c-bg); font-size:12px; color:var(--vp-c-text-1); cursor:pointer; } button:hover { border-color:var(--vp-c-brand-1); } button:focus-visible { outline:2px solid var(--vp-c-brand-1); outline-offset:3px; }
.technical-figure__canvas { overflow:auto; } .technical-figure__canvas :deep(svg) { display:block; width:100%; min-width:640px; height:auto; }
figcaption,.technical-figure__caption { margin:0; padding:14px 18px; border-top:1px solid var(--vp-c-divider); font-size:12px; line-height:1.9; color:var(--vp-c-text-2); }
.technical-figure__placeholder { padding:70px 20px; text-align:center; color:var(--vp-c-text-2); }
dialog { width:min(1200px,96vw); max-width:none; max-height:94dvh; padding:0; border:1px solid var(--vp-c-divider); border-radius:14px; background:var(--vp-c-bg); color:var(--vp-c-text-1); margin:auto; overflow:auto; }
dialog::backdrop { background:rgba(10,18,30,.72); } dialog header { position:sticky; top:0; z-index:1; }
.diagram-mobile-hint{display:none;}
@media(max-width:640px){.diagram-mobile-hint{display:block;margin:0;padding:8px 14px;font-size:11px;color:var(--vp-c-text-2);background:var(--vp-c-bg-soft);}}
@media print { button,dialog { display:none; } .technical-figure { break-inside:avoid; } .technical-figure__canvas :deep(svg) { min-width:0; } }
</style>
