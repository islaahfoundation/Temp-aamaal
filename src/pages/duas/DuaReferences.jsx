//Renders the authentic Quranic Surah/Ayah or Hadith book citation badge, grading (Sahih / Authentic), and one-tap shareable citation.

import React, { useState } from 'react';

export default function DuaReferences({
  reference = 'Authentic Prophetic Sunnah',
  authenticity = 'Sahih / Authentic',
  category = 'Daily Sunnah',
  duaTitle = '',
  arabicText = '',
  translationText = '',
}) {
  const [shared, setShared] = useState(false);

  const handleShareDua = async (e) => {
    e.stopPropagation();
    try {
      if (navigator.vibrate) navigator.vibrate(12);
    } catch (_) {}

    const sharePayload = [
      `🕌 *${duaTitle || 'Prophetic Dua'}*`,
      ``,
      arabicText,
      ``,
      translationText,
      ``,
      `📖 *Source:* ${reference} (${authenticity})`,
      `— Islaah Foundation's Aamaal Circle`,
    ].join('\n');

    try {
      if (navigator.share) {
        await navigator.share({
          title: duaTitle || 'Prophetic Dua',
          text: sharePayload,
        });
      } else {
        await navigator.clipboard.writeText(sharePayload);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (_) {}
  };

  return (
    <div className="rounded-[14px] bg-[#F3EFE2] px-3.5 py-2.5 border border-white/90 flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center space-x-2 min-w-0">
        <span className="px-2 py-0.5 rounded-md bg-[#DCE3C8] text-[#0D4A2E] text-[10px] font-bold uppercase shrink-0">
          {authenticity}
        </span>
        <span className="text-[11.5px] font-semibold text-primary truncate">
          📖 {reference}
        </span>
        {category && (
          <span className="text-[10.5px] text-secondary hidden sm:inline">
            • {category}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleShareDua}
        className="px-2.5 py-1 rounded-full bg-[#EAE8D7] hover:bg-[#DFDEC9] text-primary text-[11px] font-bold border border-[#D5D2BE] shrink-0 transition"
      >
        {shared ? '✓ Copied to Share' : '📲 Share Dua'}
      </button>
    </div>
  );
}