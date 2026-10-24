<script setup lang="ts">
import { computed } from 'vue'
import { gearGeometry } from '../../utils/mechanics.mjs'
const props=withDefaults(defineProps<{id:string;z:number;m:number;x?:number;y?:number;angle?:number;phase?:number;internal?:boolean;overlay?:boolean;tint?:string}>(),{x:0,y:0,angle:0,phase:0,internal:false,overlay:true,tint:'metal'})
const wheel=computed(()=>gearGeometry(0,0,props.z,props.m,props.phase,props.internal))
</script>
<template>
  <g :transform="'translate('+x+' '+y+') rotate('+angle+')'" :data-teeth="z">
    <template v-if="internal">
      <path :d="'M'+(-wheel.rf-16)+' 0a'+(wheel.rf+16)+' '+(wheel.rf+16)+' 0 1 0 '+(2*(wheel.rf+16))+' 0a'+(wheel.rf+16)+' '+(wheel.rf+16)+' 0 1 0 '+(-2*(wheel.rf+16))+' 0Z '+wheel.path" fill-rule="evenodd" :fill="'url(#'+id+'-metal)'" class="outline"/>
      <circle :r="wheel.rf+9" class="fine"/>
    </template>
    <template v-else>
      <path :d="wheel.path" transform="translate(0 4)" class="metal-shadow"/>
      <path :d="wheel.path" :fill="'url(#'+id+'-'+tint+')'" class="outline"/>
      <circle :r="wheel.rf-9" class="fine"/>
      <g v-for="k in 6" :key="k" :transform="'rotate('+k*60+')'">
        <circle :cx="wheel.r*.55" cy="0" :r="wheel.r*.13" class="bore"/>
        <path :d="'M'+(wheel.r*.55-wheel.r*.09)+' -2h'+(wheel.r*.18)" class="bore-glint"/>
      </g>
      <circle :r="wheel.r*.27" :fill="'url(#'+id+'-metal)'" class="outline"/>
      <circle :r="wheel.r*.14" class="bore"/>
      <path :d="'M-4 '+(-wheel.r*.14+2)+'v-7h8v7'" class="key"/>
      <path :d="'M0 '+(-wheel.r*.37)+'V'+(-wheel.r*.87)" class="witness"/>
    </template>
    <circle v-if="overlay" :r="wheel.r" class="pitch"/>
    <circle v-if="overlay" :r="wheel.rb" class="base"/>
  </g>
</template>
