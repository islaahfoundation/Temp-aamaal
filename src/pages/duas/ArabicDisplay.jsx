//Renders the Deep Emerald & Gold Arabic calligraphy card with dynamic font-size scaling, one-tap Arabic copy, and zero Roman transliteration.

import React, { useState } from 'react';

export default function ArabicDisplay({
  arabicText = '',
  fontSize = 26,
  badge = 'PROPHETIC SUPPLICATION',
  repeatCount = 1,
}) {
  const [copied, setCopied] = useState(false);

  if (!arabicText) return null;8

  const handleCopyArabic = async (e) => {
    e.stopPropagation();
    try {
      if (navigator.vibrate) navigator.vibrate(12);
      await navigator.clipboard.writeText(arabicText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (_) {}
  };

  return (
    <div className="card-progress rounded-[20px] p-4 text-center relative overflow-hidden border border-[#C99E4C]/45 shadow-md">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between mb-2">
        <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[9.5px] font-bold uppercase tracking-wider">
          {badge}
        </span>

        <div className="flex items-center space-x-1.5">
          {repeatCount > 1 && (
            <span className="px-2 py-0.5 rounded-full bg-[#DFB75A] text-[#07361D] text-[9.5px] font-bold">
              Recite {repeatCount}x
            </span>
          )}
          <button
            type="button"
            onClick={handleCopyArabic}
            title="Copy Arabic Text"
            className="px-2 py-0.5 rounded-full bg-white/15 text-white/90 hover:text-white text-[10px] font-semibold transition"
          >
            {copied ? '✓ Copied' : 'Copy Arabic'}
          </button>
        </div>
      </div>

      {/* Pure Arabic Script (No Roman Transliteration) */}
      <p
        dir="rtl"
        style={{ fontSize: `${fontSize}px`, lineHeight: 1.75 }}
        className="font-arabic text-[#F0D58C] my-2 px-1 select-text"
      >
        {arabicText}
      </p>
    </div>
  );
}