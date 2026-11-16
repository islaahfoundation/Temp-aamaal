//Displays the daily featured Prophetic Dua on the Home screen with pure Arabic calligraphy and an instant English / Roman Urdu / Urdu / Hindi translation switcher (zero Roman Arabic transliteration), bookmark button, and audio/reader shortcut.

import React, { useState } from 'react';
import { DEFAULT_DUAS_LIBRARY } from '../duas/DuaCategories';

const LANG_PILLS = [
  { id: 'en', label: 'EN' },
  { id: 'ur-roman', label: 'Roman Urdu' },
  { id: 'ur', label: 'اردو' },
  { id: 'hi', label: 'हिन्दी' },
];

export default function FeaturedDua({
  savedDuaIds = [],
  onToggleBookmark,
  onOpenDuasTab,
}) {
  const [duaIndex, setDuaIndex] = useState(0);
  const [lang, setLang] = useState(
    localStorage.getItem('aamaal_language') || 'en'
  );

  const featured =
    DEFAULT_DUAS_LIBRARY[duaIndex % DEFAULT_DUAS_LIBRARY.length] ||
    DEFAULT_DUAS_LIBRARY[0];

  const isBookmarked = savedDuaIds.includes(featured.id);

  const getTranslationText = () => {
    if (lang === 'ur-roman' && featured.romanUrdu) return featured.romanUrdu;
    if (lang === 'ur' && featured.urdu) return featured.urdu;
    if (lang === 'hi' && featured.hindi) return featured.hindi;
    return featured.translation;
  };

  return (
    <div className="card rounded-[22px] p-4 mb-3.5 space-y-3">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="badge-pill">Featured Supplication</span>
          <h3 className="font-serif text-[17.5px] font-semibold text-primary mt-1 leading-snug">
            {featured.title}
          </h3>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              try {
                if (navigator.vibrate) navigator.vibrate(8);
              } catch (_) {}
              setDuaIndex((prev) => prev + 1);
            }}
            title="Next Featured Dua"
            className="px-2.5 py-1 rounded-full bg-[#EAE8D7] text-primary text-[10.5px] font-bold border border-[#D5D2BE]"
          >
            Next ↻
          </button>

          <button
            type="button"
            onClick={() => {
              try {
                if (navigator.vibrate) navigator.vibrate(12);
              } catch (_) {}
              if (onToggleBookmark) onToggleBookmark(featured.id);
            }}
            aria-label="Bookmark Featured Dua"
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition ${
              isBookmarked
                ? 'bg-[#0D4A2E] text-[#F0D58C] border-[#C99E4C]'
                : 'bg-[#EAE8D7] text-primary border-[#D5D2BE]'
            }`}
          >
            🔖
          </button>
        </div>
      </div>

      {/* Pure Arabic Script Box */}
      <div className="rounded-2xl bg-gradient-to-br from-[#165534] to-[#08351D] p-3.5 text-center border border-[#C99E4C]/45 shadow-sm">
        <p
          dir="rtl"
          className="font-arabic text-[22px] leading-[1.7] text-[#F0D58C]"
        >
          {featured.arabic}
        </p>
      </div>

      {/* Multi-Language Meaning Box (Zero Arabic Transliteration) */}
      <div className="rounded-xl bg-white/80 p-3 border border-[#E2DFCE] space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-secondary">
            Translation
          </span>

          <div className="inline-flex rounded-full p-0.5 bg-[#EAE8D7] border border-[#D5D2BE]">
            {LANG_PILLS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setLang(p.id)}
                className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold transition ${
                  lang === p.id
                    ? 'bg-[#0D4A2E] text-white'
                    : 'text-primary'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <p
          dir={lang === 'ur' ? 'rtl' : 'ltr'}
          className="text-[12.5px] text-[#1A3826] font-medium leading-relaxed"
        >
          {getTranslationText()}
        </p>
      </div>

      {/* Footer Reference & Open Reader Link */}
      <div className="flex items-center justify-between text-[11px] pt-0.5">
        <span className="text-secondary font-medium">
          📖 {featured.reference}
        </span>
        {onOpenDuasTab && (
          <button
            type="button"
            onClick={onOpenDuasTab}
            className="font-bold text-[#0D4A2E] underline"
          >
            Listen &amp; Read All Duas ›
          </button>
        )}
      </div>
    </div>
  );
}