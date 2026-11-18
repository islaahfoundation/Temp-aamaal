//Renders an inspiring daily Sunnah & Thursday Salawat visual story banner with a quick "Recite 6x Salawat Now" interactive counter right inside the Stories hub.

import React, { useState } from 'react';

export default function DailyReminderViewer({ onCompletedSalawat }) {
  const [count, setCount] = useState(0);
  const target = 6;

  const handleTap = () => {
    try {
      if (navigator.vibrate) navigator.vibrate(12);
    } catch (_) {}
    const next = count + 1;
    setCount(next);
    if (next === target && onCompletedSalawat) {
      onCompletedSalawat(target);
    }
  };

  return (
    <div className="rounded-[22px] bg-gradient-to-r from-[#E2E5C8] via-[#DCE2C0] to-[#C8D6B0] border border-white/90 shadow-soft-card p-4 space-y-2.5 relative overflow-hidden">
      <div className="flex items-center justify-between relative z-10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#135332] block">
            🕰️ Daily &amp; Thursday Night Sunnah
          </span>
          <h4 className="font-serif text-[17px] font-bold text-[#0D4A2E]">
            6 Salawat Recited with Presence of Heart
          </h4>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-[#0D4A2E] text-[#F0D58C] text-[11px] font-bold">
          {count}/{target}
        </span>
      </div>

      <p
        dir="rtl"
        className="font-arabic text-[20px] text-[#0D4A2E] text-center bg-white/55 rounded-xl py-2 px-3 border border-[#0D4A2E]/15 relative z-10"
      >
        اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ
      </p>

      <div className="flex items-center justify-between gap-2 relative z-10 pt-0.5">
        <span className="text-[11px] text-[#1A3826] font-medium">
          &ldquo;O Allah, send peace and blessings upon our Prophet Muhammad ﷺ.&rdquo;
        </span>

        <button
          type="button"
          onClick={handleTap}
          className="px-3.5 py-1.5 rounded-full bg-[#0D4A2E] text-[#F0D58C] text-[11.5px] font-bold shrink-0 shadow-sm active:scale-95 transition"
        >
          {count >= target ? '✓ Done (+1)' : 'Recite +1'}
        </button>
      </div>
    </div>
  );
}