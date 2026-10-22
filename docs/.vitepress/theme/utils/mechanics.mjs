// Geometry for teaching drawings. Lengths are in SVG units unless stated.
export const rad = degrees => degrees * Math.PI / 180
export const point = (cx, cy, r, angle) => ({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) })
export const xy = p => `${p.x.toFixed(4)} ${p.y.toFixed(4)}`
export const linePath = (points, close = false) => points.map((p, i) => `${i ? 'L' : 'M'}${xy(p)}`).join(' ') + (close ? 'Z' : '')
export const arcPath = (cx, cy, r, start, end) => `M${xy(point(cx, cy, r, start))} A${r} ${r} 0 ${Math.abs(end - start) > Math.PI ? 1 : 0} ${end > start ? 1 : 0} ${xy(point(cx, cy, r, end))}`

// Exact involute flanks and circular tips. Root transitions are schematic,
// not cutter-generated trochoids; do not use this path for manufacturing.
export function gearGeometry(cx, cy, z, m, phase = 0, internal = false) {
  const alpha = rad(20), r = m * z / 2, rb = r * Math.cos(alpha)
  const ra = r + (internal ? -m : m), rf = r + (internal ? 1.25 * m : -1.25 * m)
  const inv = radius => { const a = Math.acos(Math.min(1, rb / radius)); return Math.tan(a) - a }
  const half = radius => Math.PI / (2 * z) + (internal ? 1 : -1) * (inv(radius) - inv(r))
  const rootStart = internal ? rf : Math.max(rb, rf)
  const pieces = []
  for (let i = 0; i < z; i++) {
    const a = phase + i * 2 * Math.PI / z
    pieces.push(`${i ? 'L' : 'M'}${xy(point(cx, cy, rf, a - half(rootStart)))}`)
    for (let j = 0; j <= 18; j++) {
      const radius = rootStart + (ra - rootStart) * j / 18
      pieces.push(`L${xy(point(cx, cy, radius, a - half(radius)))}`)
    }
    pieces.push(`A${ra} ${ra} 0 0 1 ${xy(point(cx, cy, ra, a + half(ra)))}`)
    for (let j = 18; j >= 0; j--) {
      const radius = rootStart + (ra - rootStart) * j / 18
      pieces.push(`L${xy(point(cx, cy, radius, a + half(radius)))}`)
    }
    pieces.push(`L${xy(point(cx, cy, rf, a + half(rootStart)))}`)
    pieces.push(`A${rf} ${rf} 0 0 1 ${xy(point(cx, cy, rf, a + 2 * Math.PI / z - half(rootStart)))}`)
  }
  return { cx, cy, z, m, r, rb, ra, rf, phase, path: pieces.join(' ') + 'Z' }
}

export function gearPair() {
  const alpha = rad(20)
  const g1 = gearGeometry(200, 230, 24, 7.5, -Math.PI / 48)
  const g2 = gearGeometry(425, 230, 36, 7.5, Math.PI - Math.PI / 72)
  const P = { x: g1.cx + g1.r, y: g1.cy }, direction = { x: -Math.sin(alpha), y: -Math.cos(alpha) }
  const onLine = t => ({ x: P.x + t * direction.x, y: P.y + t * direction.y })
  const t1 = g1.r * Math.sin(alpha), t2 = -g2.r * Math.sin(alpha)
  const start = t1 - Math.sqrt(g1.ra ** 2 - g1.rb ** 2)
  const end = t2 + Math.sqrt(g2.ra ** 2 - g2.rb ** 2)
  return { g1, g2, alpha, P, direction, T1: onLine(t1), T2: onLine(t2),
    B1: onLine(start), B2: onLine(end),
    loa: linePath([onLine(-178), onLine(172)]), contact: linePath([onLine(start), onLine(end)]),
    contactRatio: (end - start) / (Math.PI * g1.m * Math.cos(alpha)) }
}

// Roller seats are circular; tooth-tip blending is illustrative, not an ISO tool profile.
export function sprocketGeometry(cx, cy, z, pitch, phase = -Math.PI / 2) {
  const r = pitch / (2 * Math.sin(Math.PI / z)), roller = pitch * .30, seat = roller * 1.04
  const pts = [], seats = []
  for (let i = 0; i < z; i++) {
    const a = phase + i * 2 * Math.PI / z
    const center = point(cx, cy, r, a)
    seats.push(center)
    for (let j = 0; j <= 16; j++) {
      const b = a + Math.PI + rad(72) - rad(144) * j / 16
      pts.push(point(center.x, center.y, seat, b))
    }
    pts.push(point(cx, cy, r + pitch * .12, a + Math.PI / z - .014))
    pts.push(point(cx, cy, r + pitch * .12, a + Math.PI / z + .014))
  }
  return { cx, cy, z, pitch, r, roller, seats, path: linePath(pts, true) }
}

export function chainGeometry() {
  const pitch = 28, z = 18, spans = 12, r = pitch / (2 * Math.sin(Math.PI / z))
  const left = sprocketGeometry(185, 220, z, pitch), right = sprocketGeometry(185 + spans * pitch, 220, z, pitch)
  const pins = []
  for (let i = 0; i < spans; i++) pins.push({ x: left.cx + i * pitch, y: 220 - r })
  for (let i = 0; i < z / 2; i++) pins.push(point(right.cx, right.cy, r, -Math.PI / 2 + i * 2 * Math.PI / z))
  for (let i = 0; i < spans; i++) pins.push({ x: right.cx - i * pitch, y: 220 + r })
  for (let i = 0; i < z / 2; i++) pins.push(point(left.cx, left.cy, r, Math.PI / 2 + i * 2 * Math.PI / z))
  const links = pins.map((p, i) => ({ a: p, b: pins[(i + 1) % pins.length], outer: i % 2 === 0 }))
  return { left, right, pins, links, pitch, z, r, spans }
}

export function sliderCrank(theta = rad(55)) {
  const r = 80, l = 205, omega = 1
  const O = { x: 90, y: 290 }, A = { x: O.x + r * Math.cos(theta), y: O.y - r * Math.sin(theta) }
  const dx = Math.sqrt(l * l - (A.y - O.y) ** 2), B = { x: A.x + dx, y: O.y }
  // Clockwise input, screen coordinates: v = omega * (-dy, dx).
  const vA = { x: -(A.y - O.y) * omega, y: (A.x - O.x) * omega }
  const omegaAB = -vA.y / dx
  const vBA = { x: -omegaAB * (B.y - A.y), y: omegaAB * dx }
  return { O, A, B, vA, vBA, vB: { x: vA.x + vBA.x, y: 0 }, r, l }
}

export function solveFourbar({a, b, c, d}, t, O1 = {x:120,y:300}) {
    const O2 = { x: O1.x + d, y: O1.y }
    const A = { x: O1.x + a * Math.cos(t), y: O1.y - a * Math.sin(t) }
    const dx = O2.x - A.x, dy = O2.y - A.y, distance = Math.hypot(dx, dy)
    const along = (b * b - c * c + distance * distance) / (2 * distance)
    if (distance > b + c || distance < Math.abs(b - c)) throw new RangeError('This input angle cannot close the linkage')
    const h = Math.sqrt(Math.max(0, b * b - along * along))
    const B = { x: A.x + along * dx / distance + h * dy / distance, y: A.y + along * dy / distance - h * dx / distance }
    const C = { x: (A.x + B.x) / 2 + (B.y - A.y) * .25, y: (A.y + B.y) / 2 - (B.x - A.x) * .25 }
    const cosine = ((A.x - B.x) * (O2.x - B.x) + (A.y - B.y) * (O2.y - B.y)) / (b * c)
    const inner = Math.acos(Math.max(-1, Math.min(1, cosine)))
    return { O1, O2, A, B, C, a, b, c, d, gamma: Math.min(inner, Math.PI - inner) * 180 / Math.PI }
}
const fourbarLengths = {a:64,b:185,c:130,d:220}
const fourbarTrace = linePath(Array.from({length:361}, (_, i) => solveFourbar(fourbarLengths, rad(i)).C), true)
export function fourbarGeometry(theta = rad(65)) {
  const { O1, O2, A, B, C, a, b, c, d, gamma } = solveFourbar(fourbarLengths, theta)
  const trace = fourbarTrace
  return { O1, O2, A, B, C, a, b, c, d, trace, gamma }
}

// Analytic radial pitch curve, rotated so the shown roller lies on the vertical guide.
// The actual cam is its inward normal offset, giving exact roller tangency.
export function camGeometry() {
  const cx = 265, cy = 285, roller = 22, t0 = rad(55), rotation = -Math.PI / 2 - t0
  const at = t => {
    const rho = 110 + 22 * (1 - Math.cos(t)), dr = 22 * Math.sin(t), a = t + rotation
    const p = point(cx, cy, rho, a)
    const tangent = { x: dr * Math.cos(a) - rho * Math.sin(a), y: dr * Math.sin(a) + rho * Math.cos(a) }
    const len = Math.hypot(tangent.x, tangent.y), normal = { x: tangent.y / len, y: -tangent.x / len }
    return { p, q: { x: p.x - roller * normal.x, y: p.y - roller * normal.y }, normal }
  }
  const samples = Array.from({ length: 721 }, (_, i) => at(i * Math.PI / 360))
  const contact = at(t0)
  return { cx, cy, roller, pitch: linePath(samples.map(s => s.p), true), body: linePath(samples.map(s => s.q), true),
    ...contact, base: 110 - roller, alpha: Math.acos(-contact.normal.y) * 180 / Math.PI }
}

export function quickReturnGeometry() {
  const {a,b,c,d,O1,O2} = fourbarGeometry()
  const limit = (distance,folded) => {
    const phi = Math.acos((distance*distance+d*d-c*c)/(2*distance*d))
    const B = {x:O1.x+distance*Math.cos(phi), y:O1.y-distance*Math.sin(phi)}
    const theta = phi + (folded ? Math.PI : 0)
    const A = {x:O1.x+a*Math.cos(theta),y:O1.y-a*Math.sin(theta)}
    return {A,B,theta,phi}
  }
  const extended=limit(a+b,false),folded=limit(b-a,true)
  const difference=Math.abs((folded.theta-extended.theta)*180/Math.PI-180)
  const swing=Math.abs(Math.atan2(extended.B.y-O2.y,extended.B.x-O2.x)-Math.atan2(folded.B.y-O2.y,folded.B.x-O2.x))*180/Math.PI
  return {O1,O2,a,b,c,d,extended,folded,difference,swing,ratio:(180+difference)/(180-difference)}
}
