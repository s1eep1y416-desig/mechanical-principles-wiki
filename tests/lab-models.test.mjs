import {test} from 'node:test'
import assert from 'node:assert/strict'
import {TAU,camMotion,camContact,camProfile,movingChain,planetary,geneva,sliderDynamics,frictionModel,flywheelModel,balanceModel,robot2R,coriolisModel,cycleModel} from '../docs/.vitepress/theme/utils/lab-models.mjs'
const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b} (tol ${tol})`)
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)
const h=1e-5

test('moving chain: every link keeps pitch, seated rollers match sprockets, travel is continuous',()=>{
  for(const z of [12,18,24]){
    for(let i=0;i<=720;i++){
      const c=movingChain(i*TAU/720,z)
      assert.equal(c.pins.length,24+z)
      c.pins.forEach((p,j)=>near(dist(p,c.pins[(j+1)%c.pins.length]),24))
      for(const w of c.wheels){
        const seated=c.pins.filter(p=>Math.abs(dist(p,{x:w.cx,y:w.cy})-w.r)<1e-7)
        // At a tooth handover an additional straight-span pin also sits on the pitch circle.
        assert.equal(seated.length,z/2+1+(Math.abs(Math.abs(c.delta)-Math.PI/z)<1e-8?1:0))
        seated.forEach(p=>assert.ok(w.seats.some(q=>dist(p,q)<1e-7)))
      }
    }
    for(let i=0;i<z;i++){
      const boundary=(i+.5)*TAU/z
      near(movingChain(boundary+h,z).travel-movingChain(boundary-h,z).travel,2*h*movingChain(boundary,z).velocity,1e-7)
    }
    const a=movingChain(0,z),b=movingChain(TAU,z)
    a.pins.forEach((p,i)=>near(dist(p,b.pins[i]),0));near(b.travel-a.travel,z*24)
    near((movingChain(.123+h,z).travel-movingChain(.123-h,z).travel)/(2*h),movingChain(.123,z).velocity,1e-6)
  }
})
test('cam: analytic derivatives, normal-offset tangency and nonsingular roller envelope',()=>{
  for(const law of ['cycloid','polynomial','harmonic'])for(const lift of [30,55,65]){
    assert.ok(camProfile(lift,law).minRadius>14)
    for(let i=1;i<360;i++){
      if([120,180,300].includes(i))continue
      const t=i*TAU/360,m=camMotion(t,lift,law),p=camContact(t,lift,law),prev=camContact(t-h,lift,law),next=camContact(t+h,lift,law)
      near((next.s-prev.s)/(2*h),m.v,1e-5);near((next.v-prev.v)/(2*h),m.a,1e-5)
      near(dist(p.p,p.q),14);near(Math.hypot(p.n.x,p.n.y),1)
      const dx=(next.q.x-prev.q.x)/(2*h),dy=(next.q.y-prev.q.y)/(2*h)
      near(dx*p.n.x+dy*p.n.y,0,1e-5)
      near(p.p.x*Math.cos(t)+p.p.y*Math.sin(t),0)
      near(-p.p.x*Math.sin(t)+p.p.y*Math.cos(t),-p.rho)
      assert.ok(1-14*p.curvature>0)
    }
    for(const t of [0,TAU/3,Math.PI,5*Math.PI/3,TAU]){
      near(camMotion(t-h,lift,law).s,camMotion(t+h,lift,law).s,1e-5)
      near(camMotion(t-h,lift,law).v,camMotion(t+h,lift,law).v,1e-3)
      if(law!=='harmonic')near(camMotion(t-h,lift,law).a,camMotion(t+h,lift,law).a,.02)
    }
  }
})
test('planetary: Willis relation and both meshes obey relative rolling constraints',()=>{
  for(let i=0;i<=1440;i++){
    const p=planetary(i*Math.PI/180)
    near(p.sunTeeth+2*p.planetTeeth,p.ringTeeth)
    near(p.sunTeeth*(p.sun-p.carrier)+p.planetTeeth*(p.planet-p.carrier),0)
    near(p.ringTeeth*(p.ring-p.carrier)-p.planetTeeth*(p.planet-p.carrier),0)
    near(p.carrier,p.sun/4);near(p.planet,-p.sun/2)
  }
})
test('Geneva: engaged pin lies on the active slot and each input turn indexes -90 degrees',()=>{
  for(let cycle=0;cycle<4;cycle++){
    near(geneva((cycle+1)*TAU).rotation-geneva(cycle*TAU).rotation,-Math.PI/2)
    for(let i=1;i<360;i++){
      const t=cycle*TAU+i*Math.PI/180,g=geneva(t)
      if(g.engaged){
        const slot=5*Math.PI/4+g.rotation+cycle*Math.PI/2
        near((g.pin.x-g.center)*Math.sin(slot)-g.pin.y*Math.cos(slot),0,1e-7)
        const radius=Math.hypot(g.pin.x-g.center,g.pin.y)
        assert.ok(radius>=g.center-g.r-1e-8 && radius<=g.center*Math.cos(Math.PI/4)+1e-8)
      }
      if(i!==135&&i!==225)near((geneva(t+h).rotation-geneva(t-h).rotation)/(2*h),g.derivative,1e-6)
      else near(g.derivative,0)
    }
  }
})
test('slider inertia: analytical derivatives agree with positions, force scales with mass and speed squared',()=>{
  for(let i=0;i<=360;i++){
    const t=i*Math.PI/180,m=sliderDynamics(t),a=sliderDynamics(t-h),b=sliderDynamics(t+h)
    near((b.x-a.x)/(2*h)*m.omega,m.v,1e-8)
    near((b.dx-a.dx)/(2*h)*m.omega**2,m.a,1e-7)
    near(m.force+m.inertia,0)
    near(sliderDynamics(t,16,2).force,4*m.force)
    near(sliderDynamics(t,8,4).force,2*m.force)
    near(Math.hypot(m.x-m.r*Math.cos(t),m.r*Math.sin(t)),m.l)
  }
})
test('inclined-plane friction: static equilibrium and dynamic Newton balance',()=>{
  for(const mu of [.1,.4,.8])for(let deg=0;deg<=45;deg++){
    const m=frictionModel(deg,mu,.6)
    near(m.normal,m.weight*Math.cos(m.angle));near(m.down-m.friction,10*m.acceleration)
    if(m.staticState){near(m.acceleration,0);assert.ok(m.friction<=m.limit+1e-8)}
    else {near(m.friction,.8*mu*m.normal);assert.ok(m.friction*m.velocity>=0)}
    // Contact-resultant offset balances the friction moment about the center.
    const height=44,offset=-height*m.friction/(2*m.normal)
    near(offset*m.normal+height*m.friction/2,0)
    near(m.distance,.5*m.acceleration*.6**2)
  }
})
test('flywheel: torque integrates to work, kinetic energy is conserved, larger inertia reduces fluctuation',()=>{
  for(const J of [.5,2,8])for(let i=0;i<=360;i++){
    const t=i*Math.PI/180,m=flywheelModel(t,J)
    near(.5*J*m.omega**2,m.energy)
    near((flywheelModel(t+h,J).work-flywheelModel(t-h,J).work)/(2*h),m.driving-m.resisting,1e-8)
  }
  assert.ok(flywheelModel(0,8).delta<flywheelModel(0,.5).delta)
})
test('rotor: opposed equal mass-radius products cancel; doubling rpm quadruples unbalance force',()=>{
  for(let i=0;i<360;i++){
    const t=i*Math.PI/180
    near(balanceModel(t,.8,600,180).force,0)
    near(balanceModel(t,.4,1200,135).force,4*balanceModel(t,.4,600,135).force)
  }
})
test('2R robot: fixed link lengths, reachable annulus and Jacobian singularity',()=>{
  for(let q1=0;q1<=TAU;q1+=.1)for(let q2=-2.8;q2<=2.8;q2+=.2){
    const p=robot2R(q1,q2),a=robot2R(q1+h,q2).end,b=robot2R(q1-h,q2).end,c=robot2R(q1,q2+h).end,d=robot2R(q1,q2-h).end
    near(Math.hypot(p.elbow.x,p.elbow.y),180);near(dist(p.elbow,p.end),140)
    assert.ok(Math.hypot(p.end.x,p.end.y)>=40-1e-8 && Math.hypot(p.end.x,p.end.y)<=320+1e-8)
    near(((a.x-b.x)*(c.y-d.y)-(a.y-b.y)*(c.x-d.x))/(4*h*h),p.determinant,1e-4)
  }
  assert.equal(robot2R(.7,0).singular,true)
})
test('Coriolis: absolute acceleration agrees with independently differentiated trajectory',()=>{
  const dt=1e-3
  for(const u of [-30,0,45])for(let t=0;t<=2;t+=.025){
    const m=coriolisModel(t,u),a=coriolisModel(t-dt,u).p,b=coriolisModel(t+dt,u).p
    near((a.x-2*m.p.x+b.x)/dt**2,-m.normal*Math.cos(m.theta)-m.coriolis*Math.sin(m.theta),.0002)
    near((a.y-2*m.p.y+b.y)/dt**2,-m.normal*Math.sin(m.theta)+m.coriolis*Math.cos(m.theta),.0002)
  }
})
test('press sequence: clamp and feed remain stationary during pressing; phase boundaries are continuous',()=>{
  for(let i=0;i<3600;i++){
    const p=cycleModel(i*Math.PI/1800)
    if(p.press>1e-10){near(p.clamp,1);near(p.feed,1)}
    for(const k of ['feed','press','clamp'])assert.ok(p[k]>=0&&p[k]<=1)
  }
  for(const deg of [0,120,150,210,270,300,360])for(const key of ['feed','press','clamp'])
    near(cycleModel(deg*Math.PI/180-h)[key],cycleModel(deg*Math.PI/180+h)[key],1e-8)
})
test('planetary outlines: sun/planet and planet/ring teeth do not cross during engagement',async()=>{
  const {gearGeometry}=await import('../docs/.vitepress/theme/utils/mechanics.mjs')
  function edges(g,contactX){
    const pts=[]
    for(const match of g.path.matchAll(/([MLA])([^MLAZ]+)/g)){
      const n=match[2].trim().split(/\s+/).map(Number)
      if(match[1]!=='A')pts.push({x:n[0],y:n[1]})
      else {
        const a=pts.at(-1),radius=n[0],start=Math.atan2(a.y-g.cy,a.x-g.cx)
        let end=Math.atan2(n[6]-g.cy,n[5]-g.cx);while(end<start)end+=TAU
        for(let i=1;i<=5;i++){const t=start+(end-start)*i/5;pts.push({x:g.cx+radius*Math.cos(t),y:g.cy+radius*Math.sin(t)})}
      }
    }
    return pts.map((p,i)=>[p,pts[(i+1)%pts.length]]).filter(([a,b])=>Math.max(a.x,b.x)>contactX-7&&Math.min(a.x,b.x)<contactX+7&&Math.max(a.y,b.y)>-35&&Math.min(a.y,b.y)<35)
  }
  const orientation=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x)
  for(let i=0;i<36;i++){
    const p=planetary(i*TAU/24/36)
    const sun=gearGeometry(0,0,24,3.8,p.sun-p.carrier)
    const planet=gearGeometry(91.2,0,24,3.8,Math.PI/24+p.planet-p.carrier)
    const ring=gearGeometry(0,0,72,3.8,-p.carrier,true)
    for(const [a,b,x] of [[sun,planet,45.6],[planet,ring,136.8]]){
      const first=edges(a,x),second=edges(b,x)
      for(const [p,q] of first)for(const [r,s] of second){
        const crossing=orientation(p,q,r)*orientation(p,q,s)<0&&orientation(r,s,p)*orientation(r,s,q)<0
        // SVG chords approximate tangent involutes; permit <0.005 display units of tessellation error.
        const penetration=Math.min(Math.abs(orientation(p,q,r))/dist(p,q),Math.abs(orientation(p,q,s))/dist(p,q),Math.abs(orientation(r,s,p))/dist(r,s),Math.abs(orientation(r,s,q))/dist(r,s))
        assert.ok(!crossing||penetration<.005,`gear interference ${penetration} at sample ${i}, contact ${x}`)
      }
    }
  }
})
