//Renders the 🔄 Reset Data (N) confirmation tool from your index.html Admin Panel so an admin can reset a single member's recitation logs to 0 without affecting anyone else in the circle.

import React, { useState } from 'react';

export default function ResetMemberRecords({
  member,
  logCount = 0,
  onConfirmReset,
}) {
  const [confirming, setConfirming] = useState(false);

  if (!member) return null;

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="px-2.5 py-1 rounded-lg bg-[#F0D58C]/40 border border-[#C99E4C] text-[#6B2D26] text-[11px] font-bold"
      >
        🔄 Reset Data ({logCount})
      </button>
    );
  }

  return (
    <div className="inline-flex items-center space-x-1.5 bg-[#E5DEC9] px-2.5 py-1 rounded-lg border border-[#c45d55]/40">
      <span className="text-[10.5px] font-bold text-[#6B2D26]">
        Reset {logCount} logs?
      </span>
      <button
        type="button"
        onClick={() => {
          try {
            if (navigator.vibrate) navigator.vibrate(20);
          } catch (_) {}
          if (onConfirmReset) onConfirmReset(member.id);
          setConfirming(false);
        }}
        className="px-2 py-0.5 rounded bg-[#6B2D26] text-white text-[10px] font-bold"
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="px-1.5 py-0.5 rounded bg-white/70 text-primary text-[10px] font-semibold"
      >
        No
      </button>
    </div>
  );
}