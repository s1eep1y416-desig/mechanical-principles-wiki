<script setup lang="ts">
import {ref,onMounted,onBeforeUnmount,computed} from 'vue'
import {withBase} from 'vitepress'
import MechanismLab from './MechanismLab.vue'
import LinkageLab from './LinkageLab.vue'
import DetailPlate from './DetailPlate.vue'
import {LABS} from '../utils/lab-models.mjs'
const selected=ref('gears'),plate=ref('gearstructure')
const items=[...Object.entries(LABS).map(([key,value])=>({key,...value})),{key:'linkage',title:'连杆闭环实验台',tag:'曲柄摇杆 · 曲柄滑块',chapter:'08-linkages'}]
const current=computed(()=>items.find(x=>x.key===selected.value)||items[0])
const plates=[
{key:'gearstructure',label:'齿轮结构剖读'},{key:'helical',label:'斜齿轮与轴向力'},{key:'belt',label:'带传动结构'},
{key:'motion-pairs',label:'运动副剖面'},{key:'mobility',label:'构件与自由度'},{key:'instant',label:'滚动瞬心'},
{key:'cam-types',label:'凸轮推杆结构'},{key:'intermittent',label:'棘轮与槽轮'},{key:'rotor-balance',label:'双面平衡'},
{key:'robot-arm',label:'六轴机械臂'},{key:'frames',label:'局部坐标系'},{key:'system',label:'完整传动链'}]
function select(key:string){selected.value=key;window.history.replaceState(null,'','#'+key)}
function fromHash(){const key=window.location.hash.slice(1);if(items.some(x=>x.key===key))selected.value=key}
onMounted(()=>{fromHash();window.addEventListener('hashchange',fromHash)})
onBeforeUnmount(()=>window.removeEventListener('hashchange',fromHash))
</script>
<template>
  <div class="lab-gallery">
    <div class="gallery-intro"><span>MECHANISM STUDIO</span><strong>13 个交互实验 · 25 张正文图解</strong><p>选择一个机构，转一圈、改一个参数，再观察几何、受力与曲线怎样一起变化。</p></div>
    <div class="experiment-grid" role="group" aria-label="选择交互实验">
      <button v-for="(item,i) in items" :key="item.key" type="button" :aria-pressed="selected===item.key" @click="select(item.key)">
        <span class="experiment-number">{{ String(i+1).padStart(2,'0') }}</span><strong>{{ item.title }}</strong><small>{{ item.tag }}</small>
      </button>
    </div>
    <div class="experiment-heading"><strong>正在观察：{{ current.title }}</strong><a :href="withBase('/chapters/'+current.chapter)">阅读对应章节 →</a></div>
    <LinkageLab v-if="selected==='linkage'"/>
    <MechanismLab v-else :key="selected" :kind="selected"/>
    <p class="experiment-tip">建议先暂停，用相位滑块逐步检查；再调整齿数、摩擦系数、转动惯量或关节角。每个实验底部都写明了模型条件。</p>
    <h2 id="结构图册">结构图册</h2>
    <p>这些剖面、局部坐标与结构图也已放入对应正文。图中尺寸用于教学表达，制造设计仍需完整工程图与校核。</p>
    <div class="plate-tabs" role="group" aria-label="选择结构图"><button v-for="p in plates" :key="p.key" type="button" :aria-pressed="plate===p.key" @click="plate=p.key">{{ p.label }}</button></div>
    <DetailPlate :key="plate" :type="plate"/>
  </div>
</template>
<style scoped>
.gallery-intro{padding:26px;border:1px solid var(--vp-c-divider);border-radius:14px;background:linear-gradient(115deg,var(--vp-c-brand-soft),var(--vp-c-bg-soft));margin:24px 0}
.gallery-intro>span{font-size:11px;letter-spacing:.15em;color:var(--vp-c-brand-1);display:block;margin-bottom:10px}
.gallery-intro>strong{font-size:24px;line-height:1.5;display:block}
.gallery-intro p{color:var(--vp-c-text-2);font-size:14px;margin-bottom:0}
.experiment-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:22px 0}
.experiment-grid button{position:relative;display:grid;gap:5px;text-align:left;padding:16px 12px;border:1px solid var(--vp-c-divider);border-radius:10px;background:var(--vp-c-bg-soft);cursor:pointer}
.experiment-number{font-size:11px;font-variant-numeric:tabular-nums;color:var(--vp-c-text-3)}
.experiment-grid strong{font-size:13px}.experiment-grid small{font-size:11px;color:var(--vp-c-text-2);line-height:1.5}
button[aria-pressed=true]{border-color:var(--vp-c-brand-1);background:var(--vp-c-brand-soft)}button:hover{border-color:var(--vp-c-brand-1)}button:focus-visible{outline:2px solid var(--vp-c-brand-1);outline-offset:3px}
.experiment-heading{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:30px;flex-wrap:wrap;font-size:14px}
.experiment-heading a{font-size:12px}.experiment-tip{font-size:13px;color:var(--vp-c-text-2)}
.plate-tabs{display:flex;gap:8px;flex-wrap:wrap}.plate-tabs button{padding:6px 10px;border:1px solid var(--vp-c-divider);border-radius:7px;font-size:12px;background:var(--vp-c-bg-soft);cursor:pointer}
@media(max-width:650px){.experiment-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.gallery-intro{padding:20px}.gallery-intro>strong{font-size:20px}}
</style>
