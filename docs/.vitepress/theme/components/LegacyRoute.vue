<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, withBase } from 'vitepress'
const props = defineProps<{ to: string }>()
const router = useRouter()
onMounted(() => { router.go(withBase(props.to) + window.location.hash) })
</script>
<template><p>本章已更新，正在进入新版。<a :href="withBase(to)">点击打开新版章节 →</a></p></template>
