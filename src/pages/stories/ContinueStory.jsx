//Renders the hero "Continue Reading" card for the user's active story (The Valley of Makkah • Lesson 2 of 6 • Character Over Power), showing the desert sunrise thumbnail, chapter progress bar, and one-tap launch into IllustratedStoryViewer.jsx or StoryDetails.jsx.   

import React from 'react';

export default function ContinueStory({
  story,
  currentChapter = 2,
  onResumeStory,
  onOpenIllustratedMode,
}) {
  if (!story) return null;

  const totalChapters = (story.chapters || []).length || 6;
  const safeChapter = Math.min(Math.max(Number(currentChapter || 1), 1), totalChapters);
  const chapterObj =
    (story.chapters || []).find((c) => c.chapter === safeChapter) ||
    (story.chapters || [])[0];

  const pct = Math.round((safeChapter / totalChapters) * 100);

  return (
    <div className="card-progress rounded-[24px] p-4 mb-4 border border-[#C99E4C]/50 shadow-progress-card space-y-3">
      <div className="flex items-center justify-between">
        <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[9.5px] font-bold uppercase tracking-wider">
          Continue Your Journey • Chapter {safeChapter} of {totalChapters}
        </span>
        <span className="text-[11px] font-bold text-[#F0D58C]">{pct}%</span>
      </div>

      <div className="flex items-center space-x-3.5">
        <div className="w-24 h-16 rounded-[14px] overflow-hidden shrink-0 border border-[#C99E4C]/40 bg-black/20">
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-[20px] font-semibold text-white truncate leading-tight">
            {story.title}
          </h3>
          <p className="text-[12px] text-[#F0D58C] truncate mt-0.5">
            Lesson {safeChapter} of {totalChapters} •{' '}
            {chapterObj?.title || 'Character Over Power'}
          </p>

          <div className="w-full h-1.5 rounded-full bg-black/30 overflow-hidden mt-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#DFB75A] to-[#F0D58C] transition-all duration-300"
              style={{ width: `${Math.max(pct, 10)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-1">
        <button
          type="button"
          onClick={() => onResumeStory && onResumeStory(story, safeChapter)}
          className="flex-1 py-2.5 rounded-full bg-[#DFB75A] text-[#07361D] text-[12px] font-bold shadow-sm active:scale-95 transition"
        >
          📖 Read Chapter {safeChapter} ›
        </button>

        {onOpenIllustratedMode && (
          <button
            type="button"
            onClick={() =>
              onOpenIllustratedMode(story, safeChapter)
            }
            className="px-3.5 py-2.5 rounded-full bg-white/15 text-white border border-white/25 text-[11.5px] font-semibold shrink-0"
          >
            🖼️ Slideshow
          </button>
        )}
      </div>
    </div>
  );
}