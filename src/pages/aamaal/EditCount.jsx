import React from 'react';
import ManualCountEntry from './ManualCountEntry';

const QUICK_ADD_AMOUNTS = [100, 313, 500];

export default function EditCount({
  currentCount = 0,
  onAddQuick,
  onSaveExact,
}) {
  const handleQuickChip = (val) => {
    try {
      if (navigator.vibrate) navigator.vibrate(12);
    } catch (_) {}
    if (onAddQuick) onAddQuick(val);
  };

  return (
    <div className="mt-3 p-3.5 rounded-[16px] bg-black/25 border border-white/15 text-left fade-in">
      <p className="text-[11.5px] text-white/85 text-center mb-2.5">
        Tap a chip to add more, or enter your exact total for this day:
      </p>

      {/* Quick Add Chips (+100, +313, +500) */}
      <div className="flex items-center justify-center gap-2 mb-3">
        {QUICK_ADD_AMOUNTS.map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => handleQuickChip(amt)}
            className="px-3.5 py-1 rounded-full bg-[#DFB75A]/25 border border-[#F0D58C]/50 text-[#F0D58C] text-[12px] font-bold hover:bg-[#DFB75A]/40 transition"
          >
            +{amt}
          </button>
        ))}
      </div>

      {/* Exact Manual Count Input */}
      <ManualCountEntry
        initialValue={currentCount}
        onSave={onSaveExact}
      />
    </div>
  );
}