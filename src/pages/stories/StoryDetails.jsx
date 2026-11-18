//Renders the full article-style reader for a selected story, including Pure Arabic Calligraphy, 4-Language Meaning Switcher (English, Roman Urdu, Urdu, Hindi), bookmark toggle, chapter selector pills, and chapter-by-chapter completion tracking.

import React, { useState } from 'react';

const LANG_PILLS = [
  { id: 'en', label: 'English' },
  { id: 'romanUrdu', label: 'Roman Urdu' },
  { id: 'ur', label: 'اردو' },
  { id: 'hi', label: 'हिन्दी' },
];

export default function StoryDetails({
  story,
  initialChapter = 1,
  isBookmarked = false,
  onToggleBookmark,
  onChapterComplete,
  onFinishStory,
  onOpenSlideshow,
  onBack,
}) {
  const chapters = story?.chapters || [];
  const [activeChapterNum, setActiveChapterNum] = useState(
    Number(initialChapter || 1)
  );
  const [lang, setLang] = useState('en');

  if (!story) return null;

  const currentChapter =
    chapters.find((c) => c.chapter === activeChapterNum) || chapters[0];
  const isFinalChapter = activeChapterNum >= chapters.length;

  const handleAdvanceChapter = () => {
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}

    if (onChapterComplete) {
      onChapterComplete(story.id, activeChapterNum);
    }

    if (!isFinalChapter) {
      setActiveChapterNum((prev) => prev + 1);
    } else if (onFinishStory) {
      onFinishStory(story);
    }
  };

  return (
    <div className="space-y-3.5 fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary px-3.5 py-1.5 text-[11.5px] font-semibold"
          >
            ‹ All Stories
          </button>
        )}

        <div className="flex items-center space-x-1.5">
          {onOpenSlideshow && (
            <button
              type="button"
              onClick={() => onOpenSlideshow(activeChapterNum)}
              className="px-3 py-1.5 rounded-full bg-[#EAE8D7] border border-[#D5D2BE] text-primary text-[11.5px] font-bold"
            >
              🖼️ Slideshow
            </button>
          )}

          <button
            type="button"
            onClick={() => onToggleBookmark && onToggleBookmark(story.id)}
            className={`px-3 py-1.5 rounded-full text-[11.5px] font-bold border transition ${
              isBookmarked
                ? 'bg-[#0D4A2E] text-[#F0D58C] border-[#C99E4C]'
                : 'bg-[#EAE8D7] text-primary border-[#D5D2BE]'
            }`}
          >
            {isBookmarked ? '🔖 Saved' : '🔖 Save'}
          </button>
        </div>
      </div>

      {/* Story Title & Subtitle */}
      <div>
        <span className="badge-pill">{story.category} • {story.readTime}</span>
        <h2 className="font-serif text-[23px] font-semibold text-primary mt-1 leading-snug">
          {story.title}
        </h2>
        <p className="text-[12px] text-secondary">{story.subtitle}</p>
      </div>

      {/* Pure Arabic Theme Ayah / Hadith + 4-Language Translation */}
      {story.arabic && (
        <div className="card-progress rounded-[22px] p-4 border border-[#C99E4C]/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[9.5px] font-bold uppercase tracking-wider">
              {story.reference}
            </span>

            <div className="inline-flex rounded-full p-0.5 bg-black/25 border border-white/15">
              {LANG_PILLS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setLang(p.id)}
                  className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold transition ${
                    lang === p.id
                      ? 'bg-[#DFB75A] text-[#07361D]'
                      : 'text-white/80'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <p
            dir="rtl"
            className="font-arabic text-[23px] leading-[1.75] text-[#F0D58C] text-center py-1"
          >
            {story.arabic}
          </p>

          {story.translations && (
            <p
              dir={lang === 'ur' ? 'rtl' : 'ltr'}
              className="text-[12px] text-white/90 leading-relaxed pt-1 border-t border-white/15"
            >
              {story.translations[lang] || story.translations.en}
            </p>
          )}
        </div>
      )}

      {/* Horizontal Chapter Selector Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
        {chapters.map((ch) => {
          const active = ch.chapter === activeChapterNum;
          return (
            <button
              key={ch.chapter}
              type="button"
              onClick={() => setActiveChapterNum(ch.chapter)}
              className={`px-3 py-1.5 rounded-full text-[11.5px] font-bold whitespace-nowrap border transition ${
                active
                  ? 'bg-[#0D4A2E] text-white border-[#C99E4C]'
                  : 'bg-[#F3EFE2] text-primary border-[#D5D2BE]'
              }`}
            >
              Chapter {ch.chapter}
            </button>
          );
        })}
      </div>

      {/* Active Chapter Card */}
      {currentChapter && (
        <div className="card rounded-[22px] p-4 space-y-3 border border-white/90">
          <div className="h-40 w-full rounded-[16px] overflow-hidden bg-[#EAE8D7]">
            <img
              src={currentChapter.image || story.coverImage}
              alt={currentChapter.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
              Chapter {currentChapter.chapter} of {chapters.length}
            </span>
            <h3 className="font-serif text-[19px] font-semibold text-primary mt-0.5">
              {currentChapter.title}
            </h3>
          </div>

          <p className="text-[13.5px] text-primary leading-relaxed">
            {currentChapter.body}
          </p>

          {currentChapter.takeaway && (
            <div className="rounded-2xl bg-[#EAE8D7] p-3.5 border border-[#D5D2BE] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#135332] block">
                🌿 Lesson Takeaway
              </span>
              <p className="text-[12.5px] font-semibold text-primary leading-relaxed">
                {currentChapter.takeaway}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleAdvanceChapter}
            className="btn-primary w-full py-3.5 text-[13.5px] font-semibold shadow-md mt-2"
          >
            {isFinalChapter
              ? `✓ Complete "${story.title}" ›`
              : `✓ Complete Chapter ${currentChapter.chapter} & Read Chapter ${
                  currentChapter.chapter + 1
                } ›`}
          </button>
        </div>
      )}
    </div>
  );
}