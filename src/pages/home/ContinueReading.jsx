//Renders the Continue Reading: The Valley of Makkah (Seerah Reflections) card with lesson progress (Lesson 1 of 6 through Lesson 6 of 6) and an inline lesson reader modal/drawer.

import React, { useState } from 'react';

const SEERAH_LESSONS = [
  {
    lesson: 1,
    title: 'The Valley of Makkah & Legacy of Ibrahim (AS)',
    summary:
      'How the barren valley of Bakkah became the sanctuary of Tawheed and the answered prayer of Prophet Ibrahim (AS) and Ismail (AS).',
    takeaway: 'Sincere supplications made for future generations echo across centuries.',
  },
  {
    lesson: 2,
    title: 'The Year of the Elephant & Divine Protection',
    summary:
      'Before the birth of the Prophet ﷺ, Allah protected the Sacred House and prepared the hearts of Quraish for the final message.',
    takeaway: 'Trust that Allah guards what is sacred even when worldly forces seem overwhelming.',
  },
  {
    lesson: 3,
    title: 'Al-Sadiq Al-Amin: Character Before Prophethood',
    summary:
      'For forty years among his people, Muhammad ﷺ was known for unwavering honesty, trustworthiness, and care for the vulnerable.',
    takeaway: 'True spirituality always shines first through integrity and kindness in daily dealings.',
  },
  {
    lesson: 4,
    title: 'The Cave of Hira & First Light of Revelation',
    summary:
      'In quiet seclusion and contemplation, Jibril (AS) brought the command "Iqra!"—transforming human history forever.',
    takeaway: 'Carve out quiet daily moments of remembrance away from noise and distraction.',
  },
  {
    lesson: 5,
    title: 'Patience in Makkah & Steadfastness of the Believers',
    summary:
      'Through hardship and boycott, the early companions anchored their hearts in Quranic recitation and night prayer.',
    takeaway: 'Consistent small daily Aamaal build unshakeable inner resilience.',
  },
  {
    lesson: 6,
    title: 'TheHijrah to Madinah & Brotherhood of Faith',
    summary:
      'A new community built upon the Masjid, mutual compassion between the Muhajirun and Ansar, and constant remembrance of Allah.',
    takeaway: 'When a circle gathers for Allah’s remembrance, barakah descends upon everyone in it.',
  },
];

export default function ContinueReading({
  currentLesson = 1,
  onAdvanceLesson,
}) {
  const [expanded, setExpanded] = useState(false);

  const safeLessonNum = ((Number(currentLesson || 1) - 1) % SEERAH_LESSONS.length) + 1;
  const lessonObj =
    SEERAH_LESSONS.find((l) => l.lesson === safeLessonNum) || SEERAH_LESSONS[0];
  const pct = Math.round((safeLessonNum / SEERAH_LESSONS.length) * 100);

  return (
    <div className="card rounded-[22px] p-4 mb-3.5 space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
            Continue Reading • Lesson {safeLessonNum} of {SEERAH_LESSONS.length}
          </span>
          <h3 className="font-serif text-[16.5px] font-semibold text-primary mt-0.5 leading-snug">
            📖 {lessonObj.title}
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[#DCE3C8] text-[#0D4A2E] text-[10px] font-bold shrink-0">
          {pct}%
        </span>
      </div>

      <p className="text-[12px] text-secondary leading-relaxed">
        {lessonObj.summary}
      </p>

      {expanded && (
        <div className="rounded-xl bg-[#EAE8D7] p-3 border border-[#D5D2BE] space-y-2 fade-in">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#135332] block">
            ✨ Heart Takeaway
          </span>
          <p className="text-[12px] text-primary font-medium leading-relaxed">
            {lessonObj.takeaway}
          </p>
          <button
            type="button"
            onClick={() => {
              try {
                if (navigator.vibrate) navigator.vibrate(12);
              } catch (_) {}
              if (onAdvanceLesson) {
                const nextNum =
                  safeLessonNum >= SEERAH_LESSONS.length ? 1 : safeLessonNum + 1;
                onAdvanceLesson(nextNum);
              }
            }}
            className="btn-primary w-full py-2 text-[12px] font-semibold mt-1"
          >
            ✓ Complete Lesson {safeLessonNum} &amp; Unlock Next
          </button>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <div className="w-32 h-1.5 rounded-full bg-[#DEDCCF] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#135332]"
            style={{ width: `${pct}%` }}
          />
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-[11.5px] font-bold text-[#0D4A2E] underline"
        >
          {expanded ? 'Hide Lesson' : 'Read Lesson ›'}
        </button>
      </div>
    </div>
  );
}