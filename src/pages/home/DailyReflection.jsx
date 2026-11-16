//Renders a daily Prophetic Hadith or Quranic wisdom card encouraging consistency in small daily deeds ("The most beloved deeds to Allah are those done consistently, even if they are small").

import React, { useState } from 'react';

const DAILY_REFLECTIONS = [
  {
    source: 'Sahih Al-Bukhari 6464',
    quote:
      'The most beloved of deeds to Allah are those that are most consistent, even if they are small.',
    subtext:
      'Your daily 313 Durood Shareef, Surah Mulk, and 100 Istighfar build a steady light that never fades.',
  },
  {
    source: 'Surah Ar-Ra’d 13:28',
    quote:
      'Unquestionably, by the remembrance of Allah do hearts find rest and tranquility.',
    subtext:
      'Pause for a moment between tasks today and let your tongue moisten with the remembrance of Allah.',
  },
  {
    source: 'Sahih Muslim 408',
    quote:
      'Whoever sends blessings upon me once, Allah sends blessings upon him tenfold.',
    subtext:
      'Every single Durood you recite in the Aamaal Circle returns to you multiplied in mercy and peace.',
  },
];

export default function DailyReflection() {
  const [idx, setIdx] = useState(0);
  const item = DAILY_REFLECTIONS[idx % DAILY_REFLECTIONS.length];

  return (
    <div className="card-soft rounded-[20px] p-4 mb-3.5 border border-[#D5D2BE] space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#135332]">
          🌟 Daily Prophetic Reflection
        </span>
        <button
          type="button"
          onClick={() => setIdx((prev) => prev + 1)}
          className="text-[10.5px] font-bold text-secondary hover:text-primary"
        >
          Next Quote ↻
        </button>
      </div>

      <blockquote className="font-serif text-[15px] font-semibold text-primary leading-snug">
        &ldquo;{item.quote}&rdquo;
      </blockquote>

      <p className="text-[11.5px] text-secondary leading-relaxed">
        {item.subtext}
      </p>

      <div className="text-[10.5px] font-bold text-gold pt-0.5">
        — {item.source}
      </div>
    </div>
  );
}