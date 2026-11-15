/*Toggles any Aamaal between Active and Paused (matching the 
Active / Paused pill and ▶ Resume / ⏸ Pause buttons in your 
index.html Admin Panel). */

import React from 'react';

export default function AamaalAvailability({
  aamaal,
  onToggleActive,
}) {
  if (!aamaal) return null;

  const isPaused = aamaal.active === false;

  return (
    <div className="flex items-center space-x-2">
      <span
        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          isPaused
            ? 'bg-[#E5DEC9] text-[#6B2D26]'
            : 'bg-[#DCE3C8] text-[#0D4A2E]'
        }`}
      >
        {isPaused ? 'Paused' : 'Active'}
      </span>

      <button
        type="button"
        onClick={() => {
          try {
            if (navigator.vibrate) navigator.vibrate(12);
          } catch (_) {}
          if (onToggleActive) onToggleActive(aamaal.id, isPaused);
        }}
        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
          isPaused
            ? 'bg-[#0D4A2E] text-white border-[#0D4A2E]'
            : 'bg-[#F5F2E8] text-[#6B2D26] border-[#c45d55]/40'
        }`}
      >
        {isPaused ? '▶ Resume' : '⏸ Pause'}
      </button>
    </div>
  );
}