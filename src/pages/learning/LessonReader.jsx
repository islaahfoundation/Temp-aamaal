//Renders the full interactive Lesson Reader with Pure Arabic Calligraphy, Language Switcher (English, Roman Urdu, Urdu, Hindi), Structured Lesson Sections, Practical Sunnah Action Box, and "Complete Lesson & Next" navigation.

import React, { useState, useEffect } from 'react';

const LANG_TABS = [
  { id: 'en', label: 'English' },
  { id: 'ur-roman', label: 'Roman Urdu' },
  { id: 'ur', label: 'اردو' },
  { id: 'hi', label: 'हिन्दी' },
];

export default function LessonReader({
  course,
  lesson,
  totalLessons = 1,
  isCompleted = false,
  preferences = {
    language: 'en',
    bodyFontSize: 13.5,
    arabicFontSize: 24,
    showTakeaways: true,
  },
  onMarkCompleteAndNext,
  onSelectLessonByNumber,
  onBackToCourse,
}) {
  const [activeLang, setActiveLang] = useState(preferences.language || 'en');

  useEffect(() => {
    if (preferences.language) {
      setActiveLang(preferences.language);
    }
  }, [preferences.language]);

  if (!lesson) return null;

  const getTranslatedVerse = () => {
    if (activeLang === 'ur-roman' && lesson.romanUrdu) return lesson.romanUrdu;
    if (activeLang === 'ur' && lesson.urdu) return lesson.urdu;
    if (activeLang === 'hi' && lesson.hindi) return lesson.hindi;
    return lesson.translation || '';
  };

  const hasPrev = lesson.number > 1;
  const hasNext = lesson.number < totalLessons;

  return (
    <div className="space-y-3.5 fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        {onBackToCourse && (
          <button
            type="button"
            onClick={onBackToCourse}
            className="btn-secondary px-3.5 py-1.5 text-[11.5px] font-semibold"
          >
            ‹ {course?.title || 'Back to Course'}
          </button>
        )}

        <span className="px-2.5 py-1 rounded-full bg-[#EAE8D7] text-primary text-[11px] font-bold">
          Lesson {lesson.number} of {totalLessons}
        </span>
      </div>

      {/* Lesson Header */}
      <div>
        <span className="badge-pill">
          {lesson.readTime || '3 min read'} • {course?.category || 'Sunnah Study'}
        </span>
        <h2 className="font-serif text-[22px] font-semibold text-primary mt-1 leading-snug">
          {lesson.title}
        </h2>
      </div>

      {/* Pure Arabic Quranic Ayah / Prophetic Hadith Box */}
      {lesson.arabic && (
        <div className="card-progress rounded-[20px] p-4 text-center border border-[#C99E4C]/50 space-y-2">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[9.5px] font-bold uppercase tracking-wider">
            {lesson.reference || 'Prophetic Wisdom'}
          </span>
          <p
            dir="rtl"
            style={{ fontSize: `${preferences.arabicFontSize || 24}px`, lineHeight: 1.75 }}
            className="font-arabic text-[#F0D58C] py-1"
          >
            {lesson.arabic}
          </p>
        </div>
      )}

      {/* Multi-Language Translation of the Arabic Evidence (Zero Roman Transliteration) */}
      {lesson.translation && (
        <div className="rounded-[16px] bg-white/85 p-3.5 border border-[#E2DFCE] space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
              Meaning &amp; Translation
            </span>

            <div className="inline-flex rounded-full p-0.5 bg-[#EAE8D7] border border-[#D5D2BE]">
              {LANG_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveLang(tab.id)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
                    activeLang === tab.id
                      ? 'bg-[#0D4A2E] text-white'
                      : 'text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <p
            dir={activeLang === 'ur' ? 'rtl' : 'ltr'}
            style={{ fontSize: `${preferences.bodyFontSize || 13.5}px` }}
            className="text-[#1A3826] font-medium leading-relaxed"
          >
            {getTranslatedVerse()}
          </p>
        </div>
      )}

      {/* Main Lesson Content Paragraphs */}
      <div className="card rounded-[20px] p-4 space-y-3">
        {(lesson.paragraphs || [lesson.summary]).map((para, idx) => (
          <p
            key={idx}
            style={{ fontSize: `${preferences.bodyFontSize || 13.5}px` }}
            className="text-primary leading-relaxed"
          >
            {para}
          </p>
        ))}
      </div>

      {/* Practical Sunnah Action / Takeaway Box */}
      {preferences.showTakeaways && lesson.actionStep && (
        <div className="rounded-[18px] bg-[#EAE8D7] p-3.5 border border-[#D5D2BE] space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#135332] block">
            ✨ Practical Aamaal Takeaway
          </span>
          <p className="text-[12.5px] font-semibold text-primary leading-relaxed">
            {lesson.actionStep}
          </p>
        </div>
      )}

      {/* Complete Lesson & Prev/Next Controls */}
      <div className="pt-1 space-y-2">
        <button
          type="button"
          onClick={() => {
            try {
              if (navigator.vibrate) navigator.vibrate(15);
            } catch (_) {}
            if (onMarkCompleteAndNext) {
              onMarkCompleteAndNext(lesson.number);
            }
          }}
          className="btn-primary w-full py-3.5 text-[13.5px] font-semibold shadow-md"
        >
          {hasNext
            ? `✓ Complete Lesson ${lesson.number} & Continue to Lesson ${lesson.number + 1} ›`
            : isCompleted
            ? '✓ Course Completed! Return to Course Overview'
            : '✓ Mark Final Lesson Complete'}
        </button>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={!hasPrev}
            onClick={() =>
              hasPrev &&
              onSelectLessonByNumber &&
              onSelectLessonByNumber(lesson.number - 1)
            }
            className={`flex-1 py-2 rounded-full text-[12px] font-semibold border ${
              hasPrev
                ? 'bg-[#F3EFE2] text-primary border-[#D5D2BE]'
                : 'bg-[#EAE8D7]/50 text-secondary/50 border-transparent cursor-not-allowed'
            }`}
          >
            ‹ Previous Lesson
          </button>

          <button
            type="button"
            disabled={!hasNext}
            onClick={() =>
              hasNext &&
              onSelectLessonByNumber &&
              onSelectLessonByNumber(lesson.number + 1)
            }
            className={`flex-1 py-2 rounded-full text-[12px] font-semibold border ${
              hasNext
                ? 'bg-[#F3EFE2] text-primary border-[#D5D2BE]'
                : 'bg-[#EAE8D7]/50 text-secondary/50 border-transparent cursor-not-allowed'
            }`}
          >
            Next Lesson ›
          </button>
        </div>
      </div>
    </div>
  );
}