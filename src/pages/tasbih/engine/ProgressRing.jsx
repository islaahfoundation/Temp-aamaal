//Renders the bottom horizontal progress bar (0% to 100%) and optional circular goal indicator used in the bottom card of Image 3.

// src/pages/tasbih/engine/ProgressRing.jsx
import React from 'react';

export default function ProgressRing({
  count = 0,
  goal = 413,
}) {
  const safeGoal = Math.max(Number(goal || 1), 1);
  const rawPct = Math.min(100, Math.round((count / safeGoal) * 100));

  return (
    <div className="flex items-center space-x-3">
      <div className="flex-1 h-2.5 rounded-full bg-[#DEDBCE] overflow-hidden p-0.5 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#0D4A2E] via-[#1E6F47] to-[#C99E4C] transition-all duration-300"
          style={{ width: `${count > 0 ? Math.max(rawPct, 4) : 0}%` }}
        />
      </div>
      <span className="font-sans text-[13px] font-bold text-[#0D4A2E] min-w-[36px] text-right">
        {rawPct}%
      </span>
    </div>
  );
}