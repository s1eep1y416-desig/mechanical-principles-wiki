<script setup lang="ts">
import { computed } from 'vue'
import { linePath } from '../../utils/mechanics.mjs'
const props=withDefaults(defineProps<{values:number[];phase:number;min?:number;max?:number;width?:number;height?:number;label:string;color?:string}>(),{width:245,height:64,color:'blue'})
const lo=computed(()=>props.min ?? Math.min(0,...props.values))
const hi=computed(()=>props.max ?? Math.max(1,...props.values))
const py=(v:number)=>props.height-(v-lo.value)/(hi.value-lo.value)*props.height
const path=computed(()=>linePath(props.values.map((v,i)=>({x:i/(props.values.length-1)*props.width,y:py(v)}))))
const current=computed(()=>props.values[Math.min(props.values.length-1,Math.round(props.phase*(props.values.length-1)))])
</script>
<template>
  <g class="lab-chart">
    <text x="0" y="-13" class="small">{{ label }}</text>
    <rect x="0" y="0" :width="width" :height="height" class="chart-bg" rx="4"/>
    <path :d="'M0 '+py(0)+'H'+width" class="axis"/>
    <path :d="path" :class="color+'-line'" fill="none" stroke-width="2"/>
    <path :d="'M'+phase*width+' 0V'+height" class="cursor"/>
    <circle :cx="phase*width" :cy="py(current)" r="3.5" :fill="'var(--'+color+')'"/>
    <text x="0" :y="height+17" class="tiny">{{ lo.toFixed(1) }}</text>
    <text :x="width" y="-13" text-anchor="end" class="tiny">{{ hi.toFixed(1) }}</text>
  </g>
</template>
