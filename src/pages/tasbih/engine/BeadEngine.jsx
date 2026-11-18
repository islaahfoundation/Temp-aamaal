//The interactive 3D-shaded SVG bead loop and gesture controller:Tap anywhere or Swipe Down (short or long) $\rightarrow$ Advances strictly +1 bead with smooth spring motion.Swipe Up (short or long) $\rightarrow$ Pushes strictly -1 bead back (Undo).Renders realistic wood/stone/pearl shading, drilled string holes, specular light reflections, and golden aura rings around the focal bead.

// src/pages/tasbih/engine/BeadEngine.jsx
import React, { useState, useRef, useEffect } from 'react';
import { BEAD_MATERIAL_THEMES, getContinuousBeads } from './BeadCanvas';
import MinaretTassel from './MinaretTassel';

export default function BeadEngine({
  count = 0,
  materialId = 'olivewood',
  motionEnabled = true,
  onAdvanceBead,
  onUndoBead,
}) {
  // scrollShift ranges from -1 (scrolling 1 bead up) to +1 (scrolling 1 bead down)
  const [scrollShift, setScrollShift] = useState(0);
  const [isAnimatingSnap, setIsAnimatingSnap] = useState(false);

  const animFrameRef = useRef(null);
  const gestureRef = useRef({
    active: false,
    startY: 0,
    currentDeltaY: 0,
    triggered: false,
  });

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const theme =
    BEAD_MATERIAL_THEMES[materialId] || BEAD_MATERIAL_THEMES.olivewood;

  // Smoothly animates scrollShift from startVal to targetVal (+1 or -1), fires the count callback, and resets seamlessly to 0
  const animateFullBeadScroll = (startVal, targetDirection, callback) => {
    if (!motionEnabled) {
      setScrollShift(0);
      if (callback) callback();
      return;
    }

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsAnimatingSnap(true);

    const duration = 190; // ms for full bead travel to next slot
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out so the bead glides and settles into the focal ring
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = startVal + (targetDirection - startVal) * eased;

      setScrollShift(currentVal);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        // Bead has arrived at the next slot; update count and reset slot index seamlessly
        setScrollShift(0);
        setIsAnimatingSnap(false);
        if (callback) callback();
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || isAnimatingSnap) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    gestureRef.current = {
      active: true,
      startY: clientY,
      currentDeltaY: 0,
      triggered: false,
    };
  };

  const handlePointerMove = (e) => {
    if (!gestureRef.current.active || gestureRef.current.triggered) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - gestureRef.current.startY;
    gestureRef.current.currentDeltaY = deltaY;

    // Live finger tracking along the cord (65px drag = 1 full bead spacing)
    const dragFraction = Math.max(-0.85, Math.min(0.85, deltaY / 65));
    if (motionEnabled) {
      setScrollShift(dragFraction);
    }

    // Once user swipes down >= 24px, complete the full bead scroll (+1)
    if (deltaY >= 24) {
      gestureRef.current.triggered = true;
      gestureRef.current.active = false;
      animateFullBeadScroll(dragFraction, 1, onAdvanceBead);
    }
    // Once user swipes up <= -24px, complete the full bead scroll backwards (-1 Undo)
    else if (deltaY <= -24) {
      gestureRef.current.triggered = true;
      gestureRef.current.active = false;
      if (count > 0) {
        animateFullBeadScroll(dragFraction, -1, onUndoBead);
      } else {
        animateFullBeadScroll(dragFraction, 0, null);
      }
    }
  };

  const handlePointerUp = () => {
    if (!gestureRef.current.active) return;
    gestureRef.current.active = false;

    if (!gestureRef.current.triggered) {
      const deltaY = gestureRef.current.currentDeltaY;
      // Short downward flick or tap anywhere -> scroll 1 full bead forward (+1)
      if (deltaY >= -8) {
        animateFullBeadScroll(scrollShift, 1, onAdvanceBead);
      } else if (count > 0) {
        // Short upward flick -> scroll 1 full bead backward (-1)
        animateFullBeadScroll(scrollShift, -1, onUndoBead);
      } else {
        setScrollShift(0);
      }
    }
  };

  const beads = getContinuousBeads(scrollShift, count);

  return (
    <div
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      className="relative w-full h-full min-h-[240px] max-h-[300px] select-none cursor-pointer overflow-hidden touch-none flex items-center justify-center"
    >
      {/* Background Minaret & Horizon Silhouette */}
      <div className="absolute inset-x-0 bottom-3">
        <MinaretTassel count={count} />
      </div>

      {/* Main Photorealistic SVG Bead Loop */}
      <svg
        className="w-full h-full max-w-[330px] relative z-10"
        viewBox="0 0 320 335"
        fill="none"
      >
        <defs>
          <radialGradient id="regularBeadGrad" cx="34%" cy="28%" r="70%">
            {theme.beadStops.map((s, i) => (
              <stop key={i} offset={s.offset} stopColor={s.color} />
            ))}
          </radialGradient>

          <radialGradient id="focalBeadGrad" cx="35%" cy="28%" r="68%">
            {theme.focalStops.map((s, i) => (
              <stop key={i} offset={s.offset} stopColor={s.color} />
            ))}
          </radialGradient>

          <filter id="beadDropShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="5"
              floodColor="#1A241E"
              floodOpacity="0.28"
            />
          </filter>
        </defs>

        {/* Left Returning Silk Cord Loop */}
        <path
          d="M 150 30 C 92 70, 95 225, 145 330"
          stroke={theme.cordColor}
          strokeWidth="2.2"
          strokeOpacity="0.55"
          fill="none"
        />

        {/* Small Distance Beads on Left Return String (Also shift with scrollShift) */}
        {[85, 135, 185, 235].map((baseCy, idx) => {
          const cy = baseCy - scrollShift * 18;
          return (
            <circle
              key={idx}
              cx={108 + idx * 4}
              cy={cy}
              r={3.5}
              fill="url(#regularBeadGrad)"
              opacity="0.55"
            />
          );
        })}

        {/* Main Right Active Silk Cord */}
        <path
          d="M 150 30 Q 210 135 162 275 L 154 332"
          stroke={theme.cordColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 150 30 Q 210 135 162 275 L 154 332"
          stroke={theme.cordHighlight}
          strokeWidth="1.2"
          strokeDasharray="3 3"
          fill="none"
        />

        {/* Stationary Golden Target Aura Ring at the Focal Spot */}
        <circle
          cx={161}
          cy={262}
          r={60}
          stroke={theme.rimColor}
          strokeWidth="1"
          fill={theme.glowColor}
          opacity="0.32"
        />
        <circle
          cx={161}
          cy={262}
          r={50}
          stroke="#C99E4C"
          strokeWidth="1.2"
          strokeOpacity="0.55"
          fill="none"
        />

        {/* Render Scrolling 3D Shaded Beads Along the Curve */}
        {beads.map((b) => {
          const isFocal = Boolean(b.isFocal);
          const r = b.radius;

          return (
            <g key={b.id}>
              {/* Main 3D Sphere Body */}
              <circle
                cx={b.x}
                cy={b.y}
                r={r}
                fill={isFocal ? 'url(#focalBeadGrad)' : 'url(#regularBeadGrad)'}
                opacity={b.opacity}
                filter="url(#beadDropShadow)"
              />

              {/* Subtle Wood/Gem Rim Highlight */}
              <circle
                cx={b.x}
                cy={b.y}
                r={Math.max(r - 0.6, 1)}
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="0.9"
                opacity={b.opacity}
                fill="none"
              />

              {/* Drilled Top Cord Hole */}
              <ellipse
                cx={b.x + 1}
                cy={b.y - r * 0.66}
                rx={Math.max(r * 0.13, 1.5)}
                ry={Math.max(r * 0.075, 0.9)}
                fill="#1D1206"
                opacity={b.opacity * 0.85}
              />

              {/* Specular Light Reflection */}
              <ellipse
                cx={b.x - r * 0.28}
                cy={b.y - r * 0.32}
                rx={r * 0.22}
                ry={r * 0.12}
                transform={`rotate(-28 ${b.x - r * 0.28} ${b.y - r * 0.32})`}
                fill="rgba(255, 255, 255, 0.42)"
                opacity={b.opacity}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}