import { rad, linePath, point, sprocketGeometry } from './mechanics.mjs'
export const TAU = Math.PI * 2
export const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x))
export const wrap = (x, period = TAU) => ((x % period) + period) % period

// Derivatives are with respect to the normalized rise coordinate u.
export function riseLaw(u, law = 'cycloid') {
  u = clamp(u, 0, 1)
  if (law === 'polynomial') return {
    s: 10*u**3-15*u**4+6*u**5,
    v: 30*u**2-60*u**3+30*u**4,
    a: 60*u-180*u**2+120*u**3
  }
  if (law === 'harmonic') return {
    s: (1-Math.cos(Math.PI*u))/2,
    v: Math.PI*Math.sin(Math.PI*u)/2,
    a: Math.PI**2*Math.cos(Math.PI*u)/2
  }
  return { s:u-Math.sin(TAU*u)/TAU, v:1-Math.cos(TAU*u), a:TAU*Math.sin(TAU*u) }
}
export function camMotion(theta, lift = 55, law = 'cycloid') {
  const t=wrap(theta), beta=TAU/3
  if(t<beta) {const p=riseLaw(t/beta,law);return {s:lift*p.s,v:lift*p.v/beta,a:lift*p.a/beta**2,stage:'推程'}}
  if(t<Math.PI) return {s:lift,v:0,a:0,stage:'远休止'}
  if(t<Math.PI+beta) {const p=riseLaw((t-Math.PI)/beta,law);return {s:lift*(1-p.s),v:-lift*p.v/beta,a:-lift*p.a/beta**2,stage:'回程'}}
  return {s:0,v:0,a:0,stage:'近休止'}
}
// Body-fixed pitch curve; the cam rotates counterclockwise on screen.
export function camContact(theta, lift = 55, law = 'cycloid', base = 90, roller = 14) {
  const m=camMotion(theta,lift,law), rho=base+roller+m.s
  const p={x:rho*Math.sin(theta),y:-rho*Math.cos(theta)}
  const dx=m.v*Math.sin(theta)+rho*Math.cos(theta)
  const dy=-m.v*Math.cos(theta)+rho*Math.sin(theta)
  const norm=Math.hypot(dx,dy), n={x:dy/norm,y:-dx/norm}
  const q={x:p.x-roller*n.x,y:p.y-roller*n.y}
  const curvature=(rho*rho+2*m.v*m.v-rho*m.a)/(rho*rho+m.v*m.v)**1.5
  return {p,q,n,rho,roller,curvature,alpha:Math.atan2(Math.abs(m.v),rho)*180/Math.PI,...m}
}
export function camProfile(lift=55,law='cycloid') {
  const pts=Array.from({length:721},(_,i)=>camContact(i*TAU/720,lift,law))
  return {body:linePath(pts.map(p=>p.q),true),pitch:linePath(pts.map(p=>p.p),true),minRadius:Math.min(...pts.filter(p=>p.curvature>0).map(p=>1/p.curvature))}
}
export function planetary(theta, sunTeeth=24, planetTeeth=24) {
  const ringTeeth=sunTeeth+2*planetTeeth
  const carrier=theta*sunTeeth/(sunTeeth+ringTeeth)
  const planet=carrier-sunTeeth/planetTeeth*(theta-carrier)
  return {sun:theta,ring:0,carrier,planet,sunTeeth,planetTeeth,ringTeeth}
}
// Equal sprockets, same phase, even tooth count, horizontal center distance N*p.
// Every straight link and wrapped chord remains exactly one pitch long.
export function movingChain(theta,z=18,p=24,span=12) {
  const step=TAU/z, index=Math.floor((theta+step/2)/step)
  const delta=theta-index*step, radius=p/(2*Math.sin(Math.PI/z))
  const left={x:130,y:190}, right={x:left.x+span*p,y:190}
  const start=-Math.PI/2+delta, a=point(left.x,left.y,radius,start), b=point(right.x,right.y,radius,start+Math.PI)
  const pins=[]
  for(let i=0;i<span;i++) pins.push({x:a.x+i*p,y:a.y})
  for(let i=0;i<z/2;i++) pins.push(point(right.x,right.y,radius,start+i*step))
  for(let i=0;i<span;i++) pins.push({x:b.x-i*p,y:b.y})
  for(let i=0;i<z/2;i++) pins.push(point(left.x,left.y,radius,start+Math.PI+i*step))
  return {left,right,pins,p,radius,index,delta,z,velocity:radius*Math.cos(delta),
    ripple:1-Math.cos(Math.PI/z),travel:index*p+radius*Math.sin(delta),
    wheels:[left,right].map(c=>sprocketGeometry(c.x,c.y,z,p,start))}
}
export function geneva(theta, slots=4, center=220) {
  const beta=Math.PI/2-Math.PI/slots, r=center*Math.sin(Math.PI/slots)
  const turns=Math.floor(theta/TAU), local=wrap(theta)-Math.PI
  const engaged=Math.abs(local)<=beta
  let rotation=local < -beta ? 0 : local > beta ? -TAU/slots :
    -Math.atan2(r*Math.sin(local),center-r*Math.cos(local))-Math.PI/slots
  rotation-=turns*TAU/slots
  const derivative=engaged ? -(center*r*Math.cos(local)-r*r)/(center*center+r*r-2*center*r*Math.cos(local)):0
  return {r,center,local,beta,rotation,engaged,derivative,pin:{x:r*Math.cos(local),y:r*Math.sin(local)}}
}
export function frictionModel(degrees, muStatic=.4, t=0, mass=10) {
  const angle=rad(degrees), weight=mass*9.81, normal=weight*Math.cos(angle), down=weight*Math.sin(angle)
  const staticState=down<=muStatic*normal+1e-10, muKinetic=.8*muStatic
  const friction=staticState?down:muKinetic*normal
  const acceleration=(down-friction)/mass
  return {angle,weight,normal,down,friction,staticState,muStatic,muKinetic,
    acceleration,velocity:acceleration*t,distance:.5*acceleration*t*t,limit:muStatic*normal}
}
// SI units. Massless rod, rigid slider and frictionless guide, constant input speed.
export function sliderDynamics(theta, omega=8, mass=2) {
  const r=.06,l=.18,s=Math.sin(theta),c=Math.cos(theta),D=Math.sqrt(l*l-r*r*s*s)
  const x=r*c+D, dx=-r*s-r*r*s*c/D
  const ddx=-r*c-r*r*(c*c-s*s)/D-r**4*s*s*c*c/D**3
  const v=dx*omega,a=ddx*omega**2, force=mass*a
  return {r,l,x,v,a,force,inertia:-force,theta,omega,mass,dx,ddx,D}
}
export function balanceModel(theta, mass=.8, rpm=600, correctionAngle=180) {
  const u={x:.6*.08,y:0}, c={x:mass*.06*Math.cos(rad(correctionAngle)),y:mass*.06*Math.sin(rad(correctionAngle))}
  const rotate=p=>({x:p.x*Math.cos(theta)-p.y*Math.sin(theta),y:p.x*Math.sin(theta)+p.y*Math.cos(theta)})
  const residual=rotate({x:u.x+c.x,y:u.y+c.y}),omega=rpm*TAU/60
  return {u:rotate(u),c:rotate(c),residual,force:Math.hypot(residual.x,residual.y)*omega*omega,omega}
}
export function flywheelModel(theta,J=2) {
  const driving=10+4*Math.sin(theta),resisting=10,work=4*(1-Math.cos(theta)),omega=Math.sqrt(100+2*work/J)
  const min=10,max=Math.sqrt(100+16/J),delta=(max-min)/((max+min)/2)
  return {driving,resisting,work,omega,min,max,delta,J,energy:.5*J*100+work}
}
export function robot2R(q1,q2,l1=180,l2=140) {
  const elbow={x:l1*Math.cos(q1),y:l1*Math.sin(q1)}
  const end={x:elbow.x+l2*Math.cos(q1+q2),y:elbow.y+l2*Math.sin(q1+q2)}
  const determinant=l1*l2*Math.sin(q2)
  return {elbow,end,q1,q2,l1,l2,determinant,singular:Math.abs(Math.sin(q2))<.015}
}
export function coriolisModel(t,u=25,omega=1.5,r0=85) {
  const r=r0+u*t,theta=omega*t
  return {r,theta,relative:u,transport:omega*r,normal:omega*omega*r,coriolis:2*omega*u,
    p:{x:r*Math.cos(theta),y:r*Math.sin(theta)}}
}
const smooth=u=>(1-Math.cos(Math.PI*clamp(u,0,1)))/2
export function cycleModel(theta) {
  const deg=wrap(theta)*180/Math.PI
  const feed=deg<120?smooth(deg/120):deg<300?1:1-smooth((deg-300)/60)
  const press=deg<150?0:deg<210?smooth((deg-150)/60):deg<270?1-smooth((deg-210)/60):0
  const clampMotion=deg<120?0:deg<150?smooth((deg-120)/30):deg<270?1:deg<300?1-smooth((deg-270)/30):0
  const stage=deg<120?'送料前进':deg<150?'夹紧定位':deg<210?'冲头下行':deg<270?'冲头回升':deg<300?'松开夹具':'送料器退回'
  return {deg,feed,press,clamp:clampMotion,stage}
}

export const LABS = {
  gears:{title:'齿轮啮合实验台',tag:'齿形 · 速比 · 节点',chapter:'10-gears',p1:36,p2:0,cycle:1080,note:'标准 20° 渐开线外啮合，主动轮 24 齿、模数 2 mm；角位移按齿数比联动。齿根过渡为教学示意。'},
  planetary:{title:'行星轮系实验台',tag:'公转 · 自转 · Willis 关系',chapter:'11-gear-trains',p1:0,p2:0,cycle:1440,note:'24/24/72 齿，内齿圈固定，太阳轮输入，行星架输出。行星轮同时公转和自转；轴距和相位来自同一模型。'},
  chain:{title:'链轮与多边形效应',tag:'等节距 · 齿槽 · 速度波动',chapter:'12-other-mechanisms',p1:18,p2:0,cycle:360,note:'两轮等齿数、同相位，中心距固定为 12p，p = 12.7 mm。理想拉直链段，省略垂度、间隙和弹性；每个链节长度保持 p。'},
  cam:{title:'凸轮与推杆运动实验台',tag:'接触法线 · s-v-a · 停歇',chapter:'09-cams',p1:55,p2:0,cycle:360,note:'基圆 90 mm、滚子半径 14 mm。推程 120°、远休止 60°、回程 120°、近休止 60°；轮廓沿法线偏移求得。假定有足够预紧保持接触。'},
  geneva:{title:'四槽槽轮实验台',tag:'拨销入槽 · 分度 · 停歇',chapter:'12-other-mechanisms',p1:0,p2:0,cycle:1440,note:'四槽外槽轮：中心距 a，拨销半径 a sin45°；主动轮每圈驱动槽轮反向转过 90°。停歇由理想锁止约束保持，锁止圆弧剖开显示。'},
  friction:{title:'斜面受力与起滑实验台',tag:'静摩擦 · 极限 · 加速度',chapter:'04-static-force-analysis',p1:20,p2:.4,cycle:360,note:'质量 10 kg，g = 9.81 m/s²，μk = 0.8μs。未起滑时摩擦力由平衡决定；起滑后演示最初 0.6 s 的运动，再复位重放。'},
  inertia:{title:'滑块惯性力实验台',tag:'运动分析 → 动态静力',chapter:'05-dynamic-analysis',p1:8,p2:2,cycle:360,note:'r = 60 mm、l = 180 mm；质量集中在滑块，连杆质量忽略，导轨无摩擦。仅显示水平合外力 ma 与达朗贝尔惯性力 −ma，不把惯性力当作真实外力。'},
  balance:{title:'转子配重实验台',tag:'不平衡矢量 · 相位 · 转速',chapter:'06-balancing',p1:.8,p2:180,cycle:360,note:'原偏心质量 0.6 kg，半径 80 mm；配重半径 60 mm，转速 600 r/min。图中慢放旋转，离心惯性力按实际给定转速计算。'},
  flywheel:{title:'飞轮储能实验台',tag:'力矩差 · 盈亏功 · 转速',chapter:'07-operation-speed-fluctuation',p1:2,p2:0,cycle:360,note:'Md = 10 + 4sinφ N·m，Mr = 10 N·m，φ = 0 时 ω = 10 rad/s。按动能定理计算瞬时转速；图中以均匀相位慢放方便比较。'},
  robot:{title:'平面 2R 机械臂实验台',tag:'关节角 · 工作空间 · 奇异位形',chapter:'14-robots',p1:55,p2:0,cycle:360,note:'两杆分别长 180 mm、140 mm；θ 为 q₁，第二个滑块为 q₂。理想转动副，不含限位与碰撞；环形区域是几何可达工作空间。'},
  coriolis:{title:'转动导杆中的哥氏加速度',tag:'牵连 · 相对 · 绝对运动',chapter:'03-kinematic-analysis',p1:25,p2:0,cycle:360,note:'ω = 1.5 rad/s，初始半径 85 mm，相对速度 u 为常量。相位对应 0–2 s；绝对加速度包含向心项与 2ωu 哥氏项。循环末尾重新开始。'},
  cycle:{title:'冲压送料工作循环',tag:'送料 · 夹紧 · 冲压协调',chapter:'13-scheme-design',p1:0,p2:0,cycle:360,note:'给定执行件位移的时序模型，采用余弦过渡；不表示具体的驱动结构。冲压期间夹具保持夹紧，送料器停歇；松开后才开始返回。'}
}
