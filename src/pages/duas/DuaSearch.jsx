//Provides the real-time search input bar, quick mood/topic filter chips (Ease, Peace, Forgiveness, Protection, Gratitude, Family), and clear-search controls.

import React from 'react';

const QUICK_FILTER_CHIPS = [
  { id: 'all', label: 'All Duas' },
  { id: 'Daily', label: '☀️ Morning & Evening' },
  { id: 'Peace', label: '🌿 Peace & Relief' },
  { id: 'Forgiveness', label: '🤲 Forgiveness' },
  { id: 'Family', label: '👨‍👩‍👧‍👦 Family & Home' },
  { id: 'Gratitude', label: '✨ Durood & Praise' },
];

export default function DuaSearch({
  searchQuery = '',
  onSearchChange,
  activeCategory = 'all',
  onSelectCategory,
  savedCount = 0,
  showingSavedOnly = false,
  onToggleSavedOnly,
}) {
  return (
    <div className="space-y-2.5 mb-3.5">
      {/* Search Bar + Bookmarks Filter Button */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
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

        {onToggleSavedOnly && (
          <button
            type="button"
            onClick={() => {
              try {
                if (navigator.vibrate) navigator.vibrate(10);
              } catch (_) {}
              onToggleSavedOnly();
            }}
            className={`px-3.5 py-2.5 rounded-full text-[11.5px] font-bold border shrink-0 flex items-center space-x-1 transition ${
              showingSavedOnly
                ? 'bg-[#0D4A2E] text-[#F0D58C] border-[#C99E4C]'
                : 'bg-[#EAE8D7] text-primary border-[#D5D2BE]'
            }`}
          >
            <span>🔖</span>
            <span>Saved ({savedCount})</span>
          </button>
        )}
      </div>

      {/* Horizontal Quick Category Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
        {QUICK_FILTER_CHIPS.map((chip) => {
          const isActive = !showingSavedOnly && activeCategory === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => {
                try {
                  if (navigator.vibrate) navigator.vibrate(8);
                } catch (_) {}
                if (showingSavedOnly && onToggleSavedOnly) {
                  onToggleSavedOnly(false);
                }
                if (onSelectCategory) onSelectCategory(chip.id);
              }}
              className={`px-3 py-1.5 rounded-full text-[11.5px] font-semibold whitespace-nowrap transition border ${
                isActive
                  ? 'bg-[#0D4A2E] text-white border-[#C99E4C]/50 shadow-sm'
                  : 'bg-[#F3EFE2] text-primary border-white/90'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}