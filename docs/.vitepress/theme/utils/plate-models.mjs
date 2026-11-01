import { rad, solveFourbar } from "./mechanics.mjs";

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value)));

export const plateDefaults = {
  system: { inputSpeed: 1450, ratio: 16, efficiency: 0.94, inputTorque: 36 },
  mobility: { angle: 62, a: 64, b: 185, c: 130, d: 220 },
  instant: { radius: 125, omega: 4 },
  gearstructure: { teeth: 28, module: 2 },
  helical: { teeth: 24, normalModule: 2, helixAngle: 25, torque: 120 },
  belt: {
    smallDiameter: 140,
    largeDiameter: 240,
    centerDistance: 500,
    inputSpeed: 960,
    tightForce: 900,
    slackForce: 300,
  },
  frames: { link1: 230, link2: 235, theta1: 60, theta2: -77 },
  "rotor-balance": { mass: 80, radius: 75, speed: 1200, planeDistance: 240 },
};

function values(type, raw = {}) {
  return { ...(plateDefaults[type] || {}), ...raw };
}

export function plateSnapshot(type, raw = {}) {
  const p = values(type, raw);

  if (type === "system") {
    const inputSpeed = clamp(p.inputSpeed, 100, 3000);
    const ratio = clamp(p.ratio, 1, 60);
    const efficiency = clamp(p.efficiency, 0.5, 1);
    const inputTorque = clamp(p.inputTorque, 1, 500);
    return {
      type,
      inputSpeed,
      ratio,
      efficiency,
      inputTorque,
      outputSpeed: inputSpeed / ratio,
      outputTorque: inputTorque * ratio * efficiency,
    };
  }

  if (type === "mobility") {
    const angle = clamp(p.angle, 0, 360);
    const lengths = {
      a: clamp(p.a, 30, 100),
      b: clamp(p.b, 120, 240),
      c: clamp(p.c, 80, 180),
      d: clamp(p.d, 150, 280),
    };
    return {
      type,
      angle,
      lengths,
      bar: solveFourbar(lengths, rad(angle), { x: 160, y: 325 }),
      freedom: 1,
    };
  }

  if (type === "instant") {
    const radius = clamp(p.radius, 40, 240);
    const omega = clamp(p.omega, 0.2, 20);
    return {
      type,
      radius,
      omega,
      centerSpeed: (omega * radius) / 1000,
      topSpeed: (2 * omega * radius) / 1000,
    };
  }

  if (type === "gearstructure") {
    const teeth = Math.round(clamp(p.teeth, 12, 60));
    const module = clamp(p.module, 0.5, 8);
    return {
      type,
      teeth,
      module,
      pitchDiameter: module * teeth,
      addendumDiameter: module * (teeth + 2),
      rootDiameter: module * (teeth - 2.5),
    };
  }

  if (type === "helical") {
    const teeth = Math.round(clamp(p.teeth, 12, 60));
    const normalModule = clamp(p.normalModule, 0.5, 8);
    const helixAngle = clamp(p.helixAngle, 5, 45);
    const torque = clamp(p.torque, 1, 2000);
    const beta = rad(helixAngle);
    const pitchDiameter = (normalModule * teeth) / Math.cos(beta);
    const transversePressure = Math.atan(Math.tan(rad(20)) / Math.cos(beta));
    const tangentialForce = (2 * torque * 1000) / pitchDiameter;
    return {
      type,
      teeth,
      normalModule,
      helixAngle,
      torque,
      pitchDiameter,
      tangentialForce,
      axialForce: tangentialForce * Math.tan(beta),
      radialForce: tangentialForce * Math.tan(transversePressure),
    };
  }

  if (type === "belt") {
    const smallDiameter = clamp(p.smallDiameter, 80, 260);
    const largeDiameter = Math.max(
      smallDiameter + 20,
      clamp(p.largeDiameter, 120, 460),
    );
    const minimumCenter = (largeDiameter - smallDiameter) / 2 + 20;
    const centerDistance = Math.max(
      minimumCenter,
      clamp(p.centerDistance, 220, 900),
    );
    const inputSpeed = clamp(p.inputSpeed, 100, 3000);
    const tightForce = clamp(p.tightForce, 50, 5000);
    const slackForce = Math.min(tightForce - 1, clamp(p.slackForce, 0, 4500));
    const ratio = largeDiameter / smallDiameter;
    const delta = (largeDiameter - smallDiameter) / (2 * centerDistance);
    const smallWrap = Math.PI - 2 * Math.asin(clamp(delta, -0.999, 0.999));
    const beltLength =
      2 * centerDistance +
      (Math.PI / 2) * (smallDiameter + largeDiameter) +
      (largeDiameter - smallDiameter) ** 2 / (4 * centerDistance);
    const effectiveForce = tightForce - slackForce;
    return {
      type,
      smallDiameter,
      largeDiameter,
      centerDistance,
      inputSpeed,
      tightForce,
      slackForce,
      ratio,
      outputSpeed: inputSpeed / ratio,
      smallWrap: (smallWrap * 180) / Math.PI,
      beltLength,
      effectiveForce,
      inputTorque: (effectiveForce * smallDiameter) / 2000,
    };
  }

  if (type === "frames") {
    const link1 = clamp(p.link1, 100, 300);
    const link2 = clamp(p.link2, 100, 300);
    const theta1 = clamp(p.theta1, -160, 160);
    const theta2 = clamp(p.theta2, -160, 160);
    const a1 = rad(theta1);
    const a2 = rad(theta1 + theta2);
    return {
      type,
      link1,
      link2,
      theta1,
      theta2,
      elbow: { x: link1 * Math.cos(a1), y: link1 * Math.sin(a1) },
      end: {
        x: link1 * Math.cos(a1) + link2 * Math.cos(a2),
        y: link1 * Math.sin(a1) + link2 * Math.sin(a2),
      },
    };
  }

  if (type === "rotor-balance") {
    const mass = clamp(p.mass, 1, 1000);
    const radius = clamp(p.radius, 5, 250);
    const speed = clamp(p.speed, 100, 6000);
    const planeDistance = clamp(p.planeDistance, 20, 600);
    const omega = (2 * Math.PI * speed) / 60;
    return {
      type,
      mass,
      radius,
      speed,
      planeDistance,
      unbalance: mass * radius,
      centrifugalForce: (mass / 1000) * (radius / 1000) * omega ** 2,
      couple:
        (mass / 1000) * (radius / 1000) * omega ** 2 * (planeDistance / 1000),
    };
  }

  return { type, ...p };
}
