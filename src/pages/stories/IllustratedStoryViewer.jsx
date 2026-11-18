//Renders an interactive, full-card visual slideshow viewer for any story, with top Instagram/Story-style progress bars, chapter photography, pure Arabic header verse, and one-tap chapter advancement.

import React, { useState } from 'react';

export default function IllustratedStoryViewer({
  story,
  initialChapter = 1,
  onCompleteStory,
  onSwitchToReader,
  onBack,
}) {
  const chapters = story?.chapters || [];
  const [currentIdx, setCurrentIdx] = useState(
    Math.max(0, Math.min(Number(initialChapter || 1) - 1, chapters.length - 1))
  );

  if (!story || chapters.length === 0) return null;

  const currentChapter = chapters[currentIdx] || chapters[0];
  const isLast = currentIdx >= chapters.length - 1;

  const handleNextSlide = () => {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (_) {}

    if (!isLast) {
      setCurrentIdx((prev) => prev + 1);
    } else if (onCompleteStory) {
      onCompleteStory(story);
    }
  };

  const handlePrevSlide = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
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
            ‹ Exit Slideshow
          </button>
        )}

        {onSwitchToReader && (
          <button
            type="button"
            onClick={() => onSwitchToReader(currentChapter.chapter)}
            className="px-3 py-1.5 rounded-full bg-[#EAE8D7] border border-[#D5D2BE] text-primary text-[11.5px] font-bold"
          >
            📖 Article Mode
          </button>
        )}
      </div>

      {/* Segmented Story Progress Bars */}
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${chapters.length}, minmax(0, 1fr))` }}>
        {chapters.map((ch, idx) => (
          <button
            key={ch.chapter}
            type="button"
            onClick={() => setCurrentIdx(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx <= currentIdx ? 'bg-[#0D4A2E]' : 'bg-[#D5D2BE]'
            }`}
          />
        ))}
      </div>

      {/* Main Illustrated Story Card */}
      <div className="rounded-[24px] overflow-hidden bg-[#0F4C2B] text-white border border-[#C99E4C]/50 shadow-progress-card">
        {/* Top Artwork */}
        <div className="relative h-56 w-full bg-black/30">
          <img
            src={currentChapter.image || story.coverImage}
            alt={currentChapter.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F4C2B] via-[#0F4C2B]/25 to-transparent" />

          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#DFB75A] text-[#07361D] text-[9.5px] font-bold uppercase tracking-wider">
                Chapter {currentChapter.chapter} of {chapters.length}
              </span>
              <h2 className="font-serif text-[22px] font-bold text-white mt-1 leading-tight">
                {currentChapter.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Story Body & Takeaway */}
        <div className="p-4 space-y-3">
          {currentIdx === 0 && story.arabic && (
            <div className="rounded-2xl bg-black/20 p-3 text-center border border-[#C99E4C]/35">
              <p
                dir="rtl"
                className="font-arabic text-[21px] leading-[1.7] text-[#F0D58C]"
              >
                {story.arabic}
              </p>
              <span className="text-[10px] text-white/75 block mt-1">
                {story.reference}
              </span>
            </div>
          )}

          <p className="text-[13.5px] text-white/90 leading-relaxed">
            {currentChapter.body}
          </p>

          {currentChapter.takeaway && (
            <div className="rounded-xl bg-white/10 p-3 border border-[#DFB75A]/40">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#F0D58C] block mb-0.5">
                ✨ Heart Takeaway
              </span>
              <p className="text-[12px] text-white font-medium leading-relaxed">
                {currentChapter.takeaway}
              </p>
            </div>
          )}

          {/* Slide Navigation Controls */}
          <div className="flex items-center space-x-2 pt-2">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={handlePrevSlide}
              className={`px-4 py-2.5 rounded-full text-[12px] font-bold border ${
                currentIdx > 0
                  ? 'bg-white/15 text-white border-white/25'
                  : 'bg-white/5 text-white/30 border-transparent cursor-not-allowed'
              }`}
            >
              ‹ Prev
            </button>

            <button
              type="button"
              onClick={handleNextSlide}
              className="flex-1 py-2.5 rounded-full bg-[#DFB75A] text-[#07361D] text-[13px] font-bold shadow-sm active:scale-95 transition"
            >
              {isLast
                ? '✓ Complete Story'
                : `Next Chapter (${currentIdx + 2}/${chapters.length}) ›`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}