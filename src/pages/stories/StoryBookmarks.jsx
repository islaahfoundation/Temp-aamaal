//Displays the user's saved stories collection with quick launch into either Article Reader mode or Illustrated Slideshow mode.

import React from 'react';

export default function StoryBookmarks({
  stories = [],
  bookmarkedIds = [],
  onSelectStory,
  onToggleBookmark,
  onBack,
}) {
  const savedList = stories.filter((s) => bookmarkedIds.includes(s.id));

  return (
    <div className="space-y-3.5 fade-in">
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary px-3.5 py-1.5 text-[11.5px] font-semibold"
          >
            ‹ Back to Stories
          </button>
        )}

        <span className="text-[11.5px] font-bold text-primary">
          🔖 {savedList.length} Saved
        </span>
      </div>

      <div>
        <span className="badge-pill">Personal Reading List</span>
        <h3 className="font-serif text-[21px] font-semibold text-primary mt-1">
          Bookmarked Stories
        </h3>
      </div>

      {savedList.length === 0 ? (
        <div className="card rounded-[22px] p-6 text-center space-y-2.5">
          <div className="w-12 h-12 rounded-full bg-[#EAE8D7] text-primary flex items-center justify-center mx-auto text-[20px]">
            🔖
          </div>
          <h4 className="font-serif text-[17.5px] font-semibold text-primary">
            No Bookmarked Stories Yet
          </h4>
          <p className="text-[12px] text-secondary max-w-[240px] mx-auto">
            Tap the bookmark button on any story to save it here for offline evening reading.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {savedList.map((story) => (
            <div
              key={story.id}
              onClick={() => onSelectStory && onSelectStory(story)}
              className="card rounded-[20px] p-3.5 flex items-center justify-between gap-3 cursor-pointer active:scale-[0.99] transition"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-16 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                    {story.category} • {story.readTime}
                  </span>
                  <h4 className="font-serif text-[16px] font-semibold text-primary truncate">
                    {story.title}
                  </h4>
                  <p className="text-[11.5px] text-secondary truncate">
                    {story.subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleBookmark) onToggleBookmark(story.id);
                }}
                className="px-2.5 py-1.5 rounded-full bg-[#0D4A2E] text-[#F0D58C] text-[11px] font-bold shrink-0"
              >
                🔖
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}