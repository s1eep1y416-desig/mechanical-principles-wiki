<script setup lang="ts">
// Involute transverse section swept along a helix, projected as a teaching view.
import {linePath} from '../../utils/mechanics.mjs'
const props=defineProps<{id:string}>()
const z=24,m=2,r=z*m/2,rb=r*Math.cos(Math.PI/9),ra=r+m,rf=r-1.25*m,width=30,beta=25*Math.PI/180
const involute=(R:number)=>{const a=Math.acos(Math.min(1,rb/R));return Math.tan(a)-a}
const half=(R:number)=>Math.PI/(2*z)-involute(R)+involute(r)
const section:Array<{x:number;y:number}>=[]
const add=(R:number,a:number)=>section.push({x:R*Math.cos(a),y:R*Math.sin(a)})
for(let i=0;i<z;i++){
  const a=i*2*Math.PI/z
  add(rf,a-half(rb))
  for(let j=0;j<=4;j++){const R=rb+(ra-rb)*j/4;add(R,a-half(R))}
  add(ra,a);add(ra,a+half(ra))
  for(let j=3;j>=0;j--){const R=rb+(ra-rb)*j/4;add(R,a+half(R))}
  add(rf,a+half(rb));add(rf,a+Math.PI/z)
}
const vertex=(p:{x:number;y:number},t:number)=>{const a=width*Math.tan(beta)/r*t;return {x:p.x*Math.cos(a)-p.y*Math.sin(a),y:p.x*Math.sin(a)+p.y*Math.cos(a),z:t*width}}
const project=(p:{x:number;y:number;z:number})=>({x:p.x*2.5+p.z*158/width,y:94+p.y*3.615-p.z*60/width})
const depth=(p:{x:number;y:number;z:number})=>-19.04*p.x+5*p.y+9.0375*p.z
const faces=[] as Array<{path:string;depth:number;shade:string}>
for(let j=0;j<6;j++)for(let i=0;i<section.length;i++){
  const a=vertex(section[i],j/6),b=vertex(section[(i+1)%section.length],j/6),c=vertex(section[(i+1)%section.length],(j+1)/6),d=vertex(section[i],(j+1)/6)
  const u={x:b.x-a.x,y:b.y-a.y,z:b.z-a.z},v={x:d.x-a.x,y:d.y-a.y,z:d.z-a.z}
  const n={x:u.y*v.z-u.z*v.y,y:u.z*v.x-u.x*v.z,z:u.x*v.y-u.y*v.x}
  if(depth(n)>0)continue
  const norm=Math.hypot(n.x,n.y,n.z),light=Math.max(0,(n.x*.25-n.y*.8-n.z*.3)/norm)
  faces.push({path:linePath([a,b,c,d].map(project),true),depth:(depth(a)+depth(b)+depth(c)+depth(d))/4,shade:`rgb(${88+light*82} ${124+light*83} ${154+light*80})`})
}
faces.sort((a,b)=>b.depth-a.depth)
const back=linePath(section.map(p=>project(vertex(p,1))),true),front=linePath(section.map(p=>project(vertex(p,0))),true)
</script>
<template>
  <path :d="back" fill="var(--blue-dark)" class="outline"/>
  <path v-for="(f,i) in faces" :key="i" :d="f.path" :fill="f.shade" :stroke="f.shade" stroke-width=".25" stroke-linejoin="round"/>
  <path :d="front" :fill="'url(#'+id+'-metal)'" class="outline"/>
  <ellipse cy="94" rx="45" ry="65" class="fine"/>
  <ellipse cy="94" rx="23" ry="33" :fill="'url(#'+id+'-blue)'" class="outline"/>
  <ellipse cy="94" rx="13" ry="19" class="bore"/>
  <path d="M-4 77V68H4V77" class="key"/>
  <path d="M-45 112L210 16" class="axis"/>
</template>
