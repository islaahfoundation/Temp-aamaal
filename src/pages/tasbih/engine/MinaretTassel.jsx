//Renders the subtle Cream & Gold Mosque Minaret horizon silhouette and ornamental separator mark behind the Tasbih loop (replacing the dark green background from Image 3 with our warm Cream, Gold & Emerald sanctuary artwork).

// src/pages/tasbih/engine/MinaretTassel.jsx
import React from 'react';

export default function MinaretTassel({ count = 0 }) {
  const isMilestone = count > 0 && count % 33 === 0;

  return (
    <div className="pointer-events-none select-none">
      {/* Subtle Sanctuary Minaret & Dome Silhouette in Warm Sand/Emerald Tint */}
      <svg
        className="w-full h-36 opacity-20"
        viewBox="0 0 400 140"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 115 Q95 85 190 108 T400 102 L400 140 L0 140 Z"
          fill="#C99E4C"
          opacity="0.35"
        />
        {/* Left Minaret */}
        <rect x="266" y="34" width="6" height="76" fill="#0D4A2E" />
        <path d="M269 18 L264 34 H274 Z" fill="#0D4A2E" />
        {/* Center Dome */}
        <path
          d="M282 110 V88 C282 70 305 60 305 60 C305 60 328 70 328 88 V110 Z"
          fill="#0D4A2E"
        />
        {/* Tall Right Minaret */}
        <rect x="346" y="22" width="7" height="88" fill="#0D4A2E" />
        <path d="M349.5 6 L344 22 H355 Z" fill="#0D4A2E" />
      </svg>

      {/* 33-Bead Imame / Tassel Milestone Indicator */}
      {isMilestone && (
        <div className="absolute right-5 top-28 px-2.5 py-1 rounded-full bg-[#DFB75A]/30 border border-[#C99E4C] text-[#0D4A2E] text-[10px] font-bold uppercase tracking-wider shadow-sm animate-bounce">
          ✨ {count} Bead Tassel Marker
        </div>
      )}
    </div>
  );
}