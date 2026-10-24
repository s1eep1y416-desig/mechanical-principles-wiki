<script setup lang="ts">
defineProps<{ id: string }>()
</script>
<template>
  <defs>
    <linearGradient :id="id+'-metal'" x1="0" y1="0" x2=".85" y2="1"><stop offset="0" stop-color="var(--metal-a)"/><stop offset=".35" stop-color="var(--metal-b)"/><stop offset=".55" stop-color="var(--metal-a)"/><stop offset="1" stop-color="var(--metal-c)"/></linearGradient>
    <linearGradient :id="id+'-blue'" x1="0" y1="0" x2=".85" y2="1"><stop offset="0" stop-color="var(--blue-light)"/><stop offset="1" stop-color="var(--blue-dark)"/></linearGradient>
    <linearGradient :id="id+'-green'" x1="0" y1="0" x2=".85" y2="1"><stop offset="0" stop-color="var(--green-light)"/><stop offset="1" stop-color="var(--green-dark)"/></linearGradient>
    <pattern :id="id+'-grid'" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" class="grid"/></pattern>
    <pattern :id="id+'-hatch'" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8L8 0" class="hatch"/></pattern>
    <marker v-for="color in ['blue','green','amber','red','purple','ink']" :key="color" :id="id+'-'+color+'-arrow'" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1 9 5 1 9Z" :fill="'var(--'+color+')'"/></marker>
  </defs>
</template>
