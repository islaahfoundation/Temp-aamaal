//Renders a global search input bar on the Home dashboard with quick-search tags (313 Durood, Surah Mulk, Anxious, Forgiveness, Parents) that searches across Duas, Aamaal, Feelings, and App Modules.

import React from 'react';

export default function GlobalSearch({
  query = '',
  onChangeQuery,
  onClearQuery,
  onSubmitSearch,
}) {
  return (
    <div className="my-2.5">
      <div className="relative flex items-center">
        {/* Left Magnifying Glass Icon */}
        <svg
          className="w-[18px] h-[18px] text-[#0D4A2E] absolute left-4 pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7.5" />
          <line x1="20" y1="20" x2="16.2" y2="16.2" />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => onChangeQuery && onChangeQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSubmitSearch) {
              onSubmitSearch(query);
            }
          }}
          placeholder="Search duas, reflections..."
          className="w-full pl-11 pr-10 py-2.5 rounded-full bg-[#F5F2E8]/95 border border-white shadow-soft-card text-[#1A3826] placeholder-[#5A655E] text-[13px] font-medium focus:outline-none"
        />

        {/* Right Clear or Chevron Icon */}
        {query ? (
          <button
            type="button"
            onClick={() => onClearQuery && onClearQuery()}
            className="absolute right-3.5 w-5 h-5 rounded-full bg-[#EAE8D7] text-[#0D4A2E] text-[11px] font-bold flex items-center justify-center"
          >
            ✕
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSubmitSearch && onSubmitSearch(query)}
            aria-label="Search"
            className="absolute right-4 text-[#1A3826]"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
