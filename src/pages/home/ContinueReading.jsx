//Renders the Continue Reading: The Valley of Makkah (Seerah Reflections) card with lesson progress (Lesson 1 of 6 through Lesson 6 of 6) and an inline lesson reader modal/drawer.

import React, { useState } from 'react';

const LESSONS = [
  {
    num: 1,
    subtitle: 'The Sanctuary of Ibrahim (AS)',
    content:
      'How the barren valley of Bakkah became the sanctuary of Tawheed and the answered prayer of Prophet Ibrahim (AS).',
  },
  {
    num: 2,
    subtitle: 'Character Over Power',
    content:
      'Before prophethood, Muhammad ﷺ was known across Makkah as Al-Sadiq Al-Amin (The Truthful, The Trustworthy), proving that noble character is the foundation of lasting change.',
  },
  {
    num: 3,
    subtitle: 'The Cave of Hira & First Light',
    content:
      'In quiet reflection above the mountains of Makkah, the first words of revelation—"Iqra!"—illuminated the world.',
  },
  {
    num: 4,
    subtitle: 'Steadfastness Through Hardship',
    content:
      'Anchored by daily Quranic recitation and remembrance, the early believers stood firm with patience and grace.',
  },
  {
    num: 5,
    subtitle: 'The Night Journey & Comfort',
    content:
      'After the Year of Sorrow, Allah honored His Messenger ﷺ with Al-Isra wal-Mi’raj and the gift of the five daily prayers.',
  },
  {
    num: 6,
    subtitle: 'Hijrah & The Circle of Brotherhood',
    content:
      'A new community united in Madinah through shared faith, mutual care, and constant remembrance of Allah.',
  },
];

export default function ContinueReading({
  currentLesson = 2,
  onAdvanceLesson,
}) {
  const [openLesson, setOpenLesson] = useState(false);

  const safeNum = ((Number(currentLesson || 2) - 1) % LESSONS.length) + 1;
  const currentObj = LESSONS.find((l) => l.num === safeNum) || LESSONS[1];
  const pct = Math.round((safeNum / LESSONS.length) * 100);

  return (
    <div className="my-3">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5 text-[#0D4A2E]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z" />
            <path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" />
          </svg>
          <h3 className="font-serif text-[18px] font-semibold text-[#0D4A2E]">
            Continue Reading
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setOpenLesson(!openLesson)}
          className="text-[12.5px] font-medium text-[#1A3826] flex items-center space-x-1"
        >
          <span>See all</span>
          <span>›</span>
        </button>
      </div>

      {/* Horizontal Card with Sunrise Desert Image */}
      <div
        onClick={() => setOpenLesson(!openLesson)}
        className="rounded-[20px] bg-[#F5F2E8] border border-white shadow-soft-card p-2.5 flex items-center space-x-3 cursor-pointer active:scale-[0.99] transition"
      >
        <div className="w-24 h-14 rounded-[14px] overflow-hidden shrink-0 bg-[#C99E4C]/30">
          <img
            src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80"
            alt="The Valley of Makkah"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-serif text-[16px] font-semibold text-[#0D4A2E] truncate">
            The Valley of Makkah
          </h4>
          <p className="text-[11.5px] text-[#4E5953] truncate mt-0.5">
            Lesson {safeNum} of 6 • {currentObj.subtitle}
          </p>
          <div className="w-full h-1.5 rounded-full bg-[#DEDCCF] overflow-hidden mt-1.5">
            <div
              className="h-full rounded-full bg-[#135332] transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <span className="text-[#1A3826] text-[18px] pr-1">›</span>
      </div>

      {/* Expandable Lesson Drawer */}
      {openLesson && (
        <div className="mt-2 rounded-[18px] bg-[#EAE8D7] p-3.5 border border-[#D5D2BE] space-y-2 fade-in">
          <p className="text-[12px] text-[#1A3826] leading-relaxed">
            {currentObj.content}
          </p>
          <button
            type="button"
            onClick={() => {
              const next = safeNum >= LESSONS.length ? 1 : safeNum + 1;
              if (onAdvanceLesson) onAdvanceLesson(next);
            }}
            className="btn-primary w-full py-2 text-[12px] font-semibold"
          >
            ✓ Complete Lesson {safeNum} &amp; Continue
          </button>
        </div>
      )}
    </div>
  );
}
