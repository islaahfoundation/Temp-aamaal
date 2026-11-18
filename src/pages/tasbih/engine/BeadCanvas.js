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

// Continuous slot waypoints from top of string (index 0) down past bottom exit (index 8)
const TRACK_WAYPOINTS = [
  { t: 0.01, radius: 5.5, opacity: 0.0 },
  { t: 0.09, radius: 8.0, opacity: 0.55 },
  { t: 0.18, radius: 11.0, opacity: 0.75 },
  { t: 0.28, radius: 14.5, opacity: 0.88 },
  { t: 0.39, radius: 19.0, opacity: 0.95 },
  { t: 0.51, radius: 23.5, opacity: 1.0 },
  { t: 0.64, radius: 27.5, opacity: 1.0 },
  { t: 0.80, radius: 41.0, opacity: 1.0 }, // Slot 7: Main Focal Bead
  { t: 0.97, radius: 28.0, opacity: 0.92 },
  { t: 1.12, radius: 18.0, opacity: 0.0 },
];

function lerp(a, b, f) {
  return a + (b - a) * f;
}

// Computes smooth scrolling bead coordinates based on live drag/scroll progress (-1 to +1)
export function getContinuousBeads(scrollShift = 0, count = 0) {
  const clampedShift = Math.max(-1, Math.min(1, scrollShift));
  const results = [];

  for (let i = 1; i <= 8; i++) {
    const virtualPos = i + clampedShift;
    const lowIdx = Math.max(0, Math.min(TRACK_WAYPOINTS.length - 2, Math.floor(virtualPos)));
    const highIdx = lowIdx + 1;
    const frac = virtualPos - lowIdx;

    const wpA = TRACK_WAYPOINTS[lowIdx];
    const wpB = TRACK_WAYPOINTS[highIdx];

    const t = lerp(wpA.t, wpB.t, frac);
    const radius = lerp(wpA.radius, wpB.radius, frac);
    const opacity = lerp(wpA.opacity, wpB.opacity, frac);

    // S-curve path matching Image 3
    const x = 148 + Math.sin(t * Math.PI * 1.12) * 52 - t * 24;
    const y = 26 + t * 295;

    // Identify which physical bead is currently occupying or entering the focal spot (Slot 7)
    const distFromFocal = Math.abs(virtualPos - 7);
    const isFocal = distFromFocal < 0.48;

    results.push({
      id: `bead_slot_${i}`,
      beadNumber: count + (7 - i),
      x,
      y,
      radius,
      opacity,
      isFocal,
    });
  }

  return results;
}