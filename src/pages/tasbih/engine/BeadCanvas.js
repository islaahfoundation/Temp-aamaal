//Defines the 4 photorealistic material shaders (Olivewood & Amber, Black Onyx & Gold, Mother of Pearl, and Sandalwood & Emerald) and curved path coordinates so the beads look like real, physical handcrafted prayer beads instead of flat green circles.

// src/pages/tasbih/engine/BeadCanvas.js

export const BEAD_MATERIAL_THEMES = {
  olivewood: {
    id: 'olivewood',
    name: 'Madinah Olivewood & Amber',
    description: 'Hand-carved warm olivewood beads with a honey-amber focal stone',
    cordColor: '#9C8355',
    cordHighlight: '#DFC99B',
    beadStops: [
      { offset: '0%', color: '#F3DFC1' },
      { offset: '28%', color: '#C89D66' },
      { offset: '68%', color: '#8A5A2B' },
      { offset: '100%', color: '#4A2C0F' },
    ],
    focalStops: [
      { offset: '0%', color: '#FFF6D6' },
      { offset: '24%', color: '#F5C451' },
      { offset: '65%', color: '#C87D12' },
      { offset: '100%', color: '#6E3B03' },
    ],
    rimColor: 'rgba(201, 158, 76, 0.48)',
    glowColor: 'rgba(223, 183, 90, 0.35)',
  },

  pearl: {
    id: 'pearl',
    name: 'Mother of Pearl & Gold',
    description: 'Lustrous cream-ivory pearl beads with a warm champagne gold focal bead',
    cordColor: '#B5A686',
    cordHighlight: '#EFE7D3',
    beadStops: [
      { offset: '0%', color: '#FFFFFF' },
      { offset: '35%', color: '#F4EFE1' },
      { offset: '75%', color: '#D5CCB4' },
      { offset: '100%', color: '#9E9378' },
    ],
    focalStops: [
      { offset: '0%', color: '#FFF8E7' },
      { offset: '30%', color: '#DFB75A' },
      { offset: '72%', color: '#A37622' },
      { offset: '100%', color: '#593D0B' },
    ],
    rimColor: 'rgba(201, 158, 76, 0.55)',
    glowColor: 'rgba(201, 158, 76, 0.3)',
  },

  onyx: {
    id: 'onyx',
    name: 'Meccan Black Onyx & Gold',
    description: 'Polished volcanic black onyx beads with a 24k brushed gold focal stone',
    cordColor: '#8B7344',
    cordHighlight: '#D4B572',
    beadStops: [
      { offset: '0%', color: '#7A827E' },
      { offset: '25%', color: '#39403C' },
      { offset: '68%', color: '#191D1B' },
      { offset: '100%', color: '#080A09' },
    ],
    focalStops: [
      { offset: '0%', color: '#FFF5CC' },
      { offset: '28%', color: '#E6B84C' },
      { offset: '70%', color: '#9E6F14' },
      { offset: '100%', color: '#4D3305' },
    ],
    rimColor: 'rgba(223, 183, 90, 0.5)',
    glowColor: 'rgba(223, 183, 90, 0.32)',
  },

  emerald: {
    id: 'emerald',
    name: 'Imperial Jade & Deep Emerald',
    description: 'Natural dark jade stone beads with a warm golden-amber focal bead',
    cordColor: '#8C7A53',
    cordHighlight: '#DFC78D',
    beadStops: [
      { offset: '0%', color: '#8CD1A8' },
      { offset: '30%', color: '#27754C' },
      { offset: '72%', color: '#0D4A2E' },
      { offset: '100%', color: '#052415' },
    ],
    focalStops: [
      { offset: '0%', color: '#FFF4C8' },
      { offset: '28%', color: '#F0B941' },
      { offset: '70%', color: '#B5700E' },
      { offset: '100%', color: '#5E3404' },
    ],
    rimColor: 'rgba(201, 158, 76, 0.5)',
    glowColor: 'rgba(240, 213, 140, 0.32)',
  },
};

// Shared Cubic Bezier Control Points
// Both curves share P_TOP (148, 28) with horizontal tangents (y = 28) for a smooth rounded arch
const BACK_CURVE = {
  p0: { x: 138, y: 335 }, // bottom left return
  p1: { x: 92, y: 235 },
  p2: { x: 94, y: 28 },   // horizontal tangent into top arch
  p3: { x: 148, y: 28 },  // top rounded apex
};

const FRONT_CURVE = {
  p0: { x: 148, y: 28 },  // top rounded apex
  p1: { x: 208, y: 28 },  // horizontal tangent out of top arch
  p2: { x: 218, y: 170 },
  p3: { x: 146, y: 338 }, // bottom exit
};

export const BACK_CORD_PATH = `M ${BACK_CURVE.p0.x} ${BACK_CURVE.p0.y} C ${BACK_CURVE.p1.x} ${BACK_CURVE.p1.y}, ${BACK_CURVE.p2.x} ${BACK_CURVE.p2.y}, ${BACK_CURVE.p3.x} ${BACK_CURVE.p3.y}`;
export const FRONT_CORD_PATH = `M ${FRONT_CURVE.p0.x} ${FRONT_CURVE.p0.y} C ${FRONT_CURVE.p1.x} ${FRONT_CURVE.p1.y}, ${FRONT_CURVE.p2.x} ${FRONT_CURVE.p2.y}, ${FRONT_CURVE.p3.x} ${FRONT_CURVE.p3.y}`;

function cubicBezier(curve, t) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x:
      uuu * curve.p0.x +
      3 * uu * t * curve.p1.x +
      3 * u * tt * curve.p2.x +
      ttt * curve.p3.x,
    y:
      uuu * curve.p0.y +
      3 * uu * t * curve.p1.y +
      3 * u * tt * curve.p2.y +
      ttt * curve.p3.y,
  };
}

// Continuous slot waypoints from top arch (index 0) down past bottom exit (index 9)
const TRACK_WAYPOINTS = [
  { t: 0.01, radius: 5.5, opacity: 0.0 },
  { t: 0.10, radius: 8.5, opacity: 0.65 },
  { t: 0.19, radius: 11.5, opacity: 0.80 },
  { t: 0.29, radius: 15.0, opacity: 0.90 },
  { t: 0.40, radius: 19.0, opacity: 0.96 },
  { t: 0.52, radius: 23.5, opacity: 1.0 },
  { t: 0.65, radius: 27.5, opacity: 1.0 },
  { t: 0.80, radius: 39.5, opacity: 1.0 }, // Slot 7: Main Focal Bead
  { t: 0.96, radius: 27.0, opacity: 0.92 },
  { t: 1.08, radius: 18.0, opacity: 0.0 },
];

export const FOCAL_SPOT = cubicBezier(FRONT_CURVE, TRACK_WAYPOINTS[7].t);

function lerp(a, b, f) {
  return a + (b - a) * f;
}

// Computes smooth scrolling front bead coordinates locked onto FRONT_CORD_PATH
export function getContinuousBeads(scrollShift = 0, count = 0) {
  const clampedShift = Math.max(-1, Math.min(1, scrollShift));
  const results = [];

  for (let i = 1; i <= 8; i++) {
    const virtualPos = i + clampedShift;
    const lowIdx = Math.max(
      0,
      Math.min(TRACK_WAYPOINTS.length - 2, Math.floor(virtualPos))
    );
    const highIdx = lowIdx + 1;
    const frac = virtualPos - lowIdx;

    const wpA = TRACK_WAYPOINTS[lowIdx];
    const wpB = TRACK_WAYPOINTS[highIdx];

    const t = lerp(wpA.t, wpB.t, frac);
    const radius = lerp(wpA.radius, wpB.radius, frac);
    const opacity = lerp(wpA.opacity, wpB.opacity, frac);

    const pt = cubicBezier(FRONT_CURVE, Math.max(0, Math.min(1, t)));
    const distFromFocal = Math.abs(virtualPos - 7);
    const isFocal = distFromFocal < 0.48;

    results.push({
      id: `bead_slot_${i}`,
      beadNumber: count + (7 - i),
      x: pt.x,
      y: pt.y,
      radius,
      opacity,
      isFocal,
    });
  }

  return results;
}

// Computes smooth scrolling back bead coordinates locked onto BACK_CORD_PATH
export function getBackBeads(scrollShift = 0) {
  const clampedShift = Math.max(-1, Math.min(1, scrollShift));
  const countSlots = 7;
  const results = [];

  for (let i = 0; i < countSlots; i++) {
    // Moves upward along the back string (t: 0 -> 1) as front beads move downward
    const t = (i + 0.5 + clampedShift) / countSlots;
    if (t <= 0.02 || t >= 0.98) continue;

    const pt = cubicBezier(BACK_CURVE, t);

    // Smoothly taper size and opacity near bottom and top arch
    const edgeFade = Math.min(t / 0.15, (1 - t) / 0.15, 1);
    const radius = lerp(4.8, 6.2, Math.sin(t * Math.PI));

    results.push({
      id: `back_bead_${i}`,
      x: pt.x,
      y: pt.y,
      radius,
      opacity: 0.62 * edgeFade,
    });
  }

  return results;
}