//Provides the real-time search input bar, quick mood/topic filter chips (Ease, Peace, Forgiveness, Protection, Gratitude, Family), and clear-search controls.

import React from 'react';

export default function DuaSearch({
  searchQuery = '',
  onSearchChange,
}) {
  return (
    <div className="mb-3.5">
      <div className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            if (onSearchChange) onSearchChange(e.target.value);
          }}
          placeholder="Search duas by topic, mood, or meaning..."
          className="w-full pl-9 pr-8 py-2.5 rounded-full bg-[#F3EFE2] border border-[#D5D2BE] text-primary text-[12.5px] font-medium shadow-soft-card"
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

        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange && onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary text-[12px] font-bold"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}