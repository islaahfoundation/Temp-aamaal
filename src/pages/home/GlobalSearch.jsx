//Renders a global search input bar on the Home dashboard with quick-search tags (313 Durood, Surah Mulk, Anxious, Forgiveness, Parents) that searches across Duas, Aamaal, Feelings, and App Modules.

import React from 'react';

const QUICK_TAGS = ['313 Durood', 'Surah Mulk', 'Peace', 'Parents', 'Forgiveness'];

export default function GlobalSearch({
  query = '',
  onChangeQuery,
  onClearQuery,
}) {
  return (
    <div className="mb-3.5 space-y-2">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => onChangeQuery && onChangeQuery(e.target.value)}
          placeholder="Search Duas, daily Aamaal, feelings, or features..."
          className="w-full pl-9 pr-8 py-2.5 rounded-full bg-[#F3EFE2] border border-white/90 text-primary text-[12.5px] font-medium shadow-soft-card"
        />
        <svg
          className="w-4 h-4 text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        {query && (
          <button
            type="button"
            onClick={() => onClearQuery && onClearQuery()}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#EAE8D7] text-primary text-[11px] font-bold flex items-center justify-center"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick Filter Pills when typing hasn't started */}
      {!query && (
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary shrink-0 mr-0.5">
            Try:
          </span>
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onChangeQuery && onChangeQuery(tag)}
              className="px-2.5 py-0.5 rounded-full bg-[#EAE8D7] border border-[#D5D2BE] text-primary text-[10.5px] font-semibold whitespace-nowrap"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}