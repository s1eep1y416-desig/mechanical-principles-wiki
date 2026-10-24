import {test} from 'node:test'
import assert from 'node:assert/strict'
import {rad, gearPair, chainGeometry, fourbarGeometry, solveFourbar, sliderCrank, camGeometry, quickReturnGeometry} from '../docs/.vitepress/theme/utils/mechanics.mjs'
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)
const near=(a,b,tolerance=1e-9)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`)
const vector=(a,b)=>({x:b.x-a.x,y:b.y-a.y})
const dot=(a,b)=>a.x*b.x+a.y*b.y
const cross=(a,b)=>a.x*b.y-a.y*b.x

test('four-bar: fixed lengths and continuous branch through 0–360°',()=>{
  let last
  for(let i=0;i<=3600;i++){
    const p=fourbarGeometry(rad(i/10))
    near(distance(p.O1,p.A),p.a);near(distance(p.A,p.B),p.b);near(distance(p.B,p.O2),p.c);near(distance(p.O1,p.O2),p.d)
    near(distance(p.A,p.C),Math.hypot(p.b/2,p.b/4))
    assert.ok(p.gamma>0 && p.gamma<=90)
    if(last)assert.ok(distance(p.B,last)<1)
    last=p.B
  }
  near(distance(fourbarGeometry(0).B,fourbarGeometry(2*Math.PI).B),0)
})
test('classification: shortest frame permits both cranks; nonclosing poses reject',()=>{
  for(let i=0;i<=360;i++){
    const p=solveFourbar({a:185,b:130,c:220,d:64},rad(i))
    near(distance(p.A,p.B),130);near(distance(p.B,p.O2),220)
  }
  let previousHero
  for(let i=0;i<=3600;i++){
    const p=solveFourbar({a:105,b:300,c:190,d:380},rad(i/10),{x:170,y:250})
    near(distance(p.A,p.B),300);near(distance(p.B,p.O2),190)
    if(previousHero)assert.ok(distance(previousHero,p.B)<2)
    previousHero=p.B
  }
  assert.throws(()=>solveFourbar({a:140,b:120,c:150,d:220},Math.PI),RangeError)
})
test('slider-crank: fixed rod, straight guide, analytic velocity agrees with finite difference',()=>{
  const dt=1e-5
  for(let i=0;i<=360;i++){
    const t=rad(i),p=sliderCrank(t),previous=sliderCrank(t-dt),next=sliderCrank(t+dt)
    near(distance(p.O,p.A),80);near(distance(p.A,p.B),205);near(p.B.y,p.O.y)
    near(dot(vector(p.O,p.A),p.vA),0,1e-8);near(dot(vector(p.A,p.B),p.vBA),0,1e-8)
    near(p.vA.x+p.vBA.x,p.vB.x);near(p.vA.y+p.vBA.y,0)
    // Utility vectors use clockwise input; positive theta in this test is CCW.
    near((next.B.x-previous.B.x)/(2*dt),-p.vB.x,1e-6)
  }
  near(sliderCrank(0).B.x-sliderCrank(Math.PI).B.x,160)
  near(sliderCrank(0).vB.x,0);near(sliderCrank(Math.PI).vB.x,0)
})
test('chain: all 42 rigid links share pitch and engaged pins match tooth seats',()=>{
  const c=chainGeometry();assert.equal(c.pins.length,42)
  for(const l of c.links)near(distance(l.a,l.b),c.pitch)
  for(const sprocket of [c.left,c.right]){
    const engaged=c.pins.filter(p=>Math.abs(distance(p,{x:sprocket.cx,y:sprocket.cy})-sprocket.r)<1e-8)
    assert.equal(engaged.length,10)
    for(const pin of engaged)assert.ok(sprocket.seats.some(seat=>distance(pin,seat)<1e-8))
  }
})
test('involute pair: tangent to both base circles, addendum contact limits and ratio',()=>{
  const p=gearPair()
  for(const [g,T] of [[p.g1,p.T1],[p.g2,p.T2]]){
    near(distance({x:g.cx,y:g.cy},T),g.rb);near(dot(vector({x:g.cx,y:g.cy},T),p.direction),0,1e-9)
  }
  near(distance({x:p.g1.cx,y:p.g1.cy},p.B1),p.g1.ra);near(distance({x:p.g2.cx,y:p.g2.cy},p.B2),p.g2.ra)
  near(p.g2.cx-p.g1.cx,p.g1.r+p.g2.r)
  assert.ok(p.contactRatio>1.6 && p.contactRatio<1.7)
})
test('cam: roller contact is normal offset, not radial offset',()=>{
  const p=camGeometry();near(distance(p.p,p.q),p.roller);near(Math.hypot(p.normal.x,p.normal.y),1)
  near(p.p.x,p.cx);assert.ok(p.alpha>0 && p.alpha<20)
  near(cross(vector(p.q,p.p),p.normal),0)
})
test('quick return: both extreme positions keep all lengths and crank/coupler collinear',()=>{
  const q=quickReturnGeometry()
  for(const p of [q.extended,q.folded]){
    near(distance(q.O1,p.A),q.a);near(distance(p.A,p.B),q.b);near(distance(q.O2,p.B),q.c)
    near(cross(vector(q.O1,p.A),vector(p.A,p.B)),0,1e-8)
    near(distance(fourbarGeometry(p.theta).B,p.B),0)
  }
  assert.ok(q.ratio>1 && q.difference<90)
})

test('tooth flanks do not cross through a full tooth engagement cycle',async()=>{
  const {gearGeometry}=await import('../docs/.vitepress/theme/utils/mechanics.mjs')
  function polygon(g) {
    const points=[]
    for(const match of g.path.matchAll(/([MLA])([^MLAZ]+)/g)){
      const numbers=match[2].trim().split(/\s+/).map(Number)
      if(match[1]!=='A')points.push({x:numbers[0],y:numbers[1]})
      else {
        const radius=numbers[0],end={x:numbers[5],y:numbers[6]},last=points.at(-1)
        const startAngle=Math.atan2(last.y-g.cy,last.x-g.cx)
        let endAngle=Math.atan2(end.y-g.cy,end.x-g.cx)
        while(endAngle<startAngle)endAngle+=2*Math.PI
        for(let i=1;i<=8;i++){
          const t=startAngle+(endAngle-startAngle)*i/8
          points.push({x:g.cx+radius*Math.cos(t),y:g.cy+radius*Math.sin(t)})
        }
      }
    }
    return points.map((p,i)=>[p,points[(i+1)%points.length]]).filter(([a,b])=>Math.max(a.x,b.x)>282 && Math.min(a.x,b.x)<298)
  }
  const orientation=(a,b,c)=>cross(vector(a,b),vector(a,c))
  for(const z of [36,48])for(let step=0;step<24;step++){
    const theta=step/24*2*Math.PI/24
    const left=polygon(gearGeometry(200,230,24,7.5,-Math.PI/48+theta))
    const right=polygon(gearGeometry(290+z*3.75,230,z,7.5,Math.PI-Math.PI/(2*z)-theta*24/z))
    for(const [a,b] of left)for(const [c,d] of right){
      const crossBoth=orientation(a,b,c)*orientation(a,b,d)<-1e-7 && orientation(c,d,a)*orientation(c,d,b)<-1e-7
      assert.ok(!crossBoth,`Tooth outlines intersect at phase ${step}`)
    }
  }
})
