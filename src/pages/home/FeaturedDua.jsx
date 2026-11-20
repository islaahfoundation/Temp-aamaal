//Displays the daily featured Prophetic Dua on the Home screen with pure Arabic calligraphy and an instant English / Roman Urdu / Urdu / Hindi translation switcher (zero Roman Arabic transliteration), bookmark button, and audio/reader shortcut.

import React, { useState, useMemo } from 'react';
import { DEFAULT_DUAS_LIBRARY } from '../duas/DuaCategories';

function getDailyFeaturedDua(duasList = []) {
  if (!Array.isArray(duasList) || duasList.length === 0) return null;
  const now = new Date();
  const localDayNumber = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() /
      86400000
  );
  return duasList[localDayNumber % duasList.length];
}

export default function FeaturedDua({
  savedDuaIds = [],
  onToggleBookmark,
  onOpenDuasTab,
}) {
  const [showReader, setShowReader] = useState(false);

  const featured = useMemo(
    () => getDailyFeaturedDua(DEFAULT_DUAS_LIBRARY) || DEFAULT_DUAS_LIBRARY[0],
    []
  );

  if (!featured) return null;

  const isBookmarked = savedDuaIds.includes(featured.id);
  const subtitle =
    featured.shortDesc ||
    featured.benefits ||
    (featured.category
      ? `Daily supplication for ${featured.category.toLowerCase()}.`
      : 'Recite with sincerity and presence of heart.');

  return (
    <div className="my-3.5">
      {/* Main Split Featured Card */}
      <div
        onClick={() => setShowReader(!showReader)}
        className="rounded-[22px] bg-[#F5F2E8] border border-white shadow-soft-card overflow-hidden flex items-stretch cursor-pointer relative active:scale-[0.99] transition"
      >
        {/* Left: Quran on Wooden Rehal Illustration / Photo */}
        <div className="w-[38%] relative overflow-hidden shrink-0 bg-[#8C6239]">
          <img
            src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=500&q=80"
            alt="Noble Quran on Wooden Stand"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-[#F5F2E8]" />
        </div>

        {/* Right: Dynamic Daily Content + Mandala Ornament */}
        <div className="flex-1 p-3.5 pl-2 relative flex flex-col justify-center min-w-0">
          {/* Decorative Gold Mandala in Top-Right Corner */}
          <svg
            className="absolute right-0 top-0 w-24 h-24 text-[#C99E4C] opacity-25 pointer-events-none"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle
              cx="90"
              cy="10"
              r="42"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
            <circle cx="90" cy="10" r="28" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M90 10 L48 10 M90 10 L60 40 M90 10 L90 52 M90 10 L65 25 M90 10 L75 45"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>

          <span className="inline-block self-start px-2.5 py-0.5 rounded-full bg-[#DCE3C8] text-[#0D4A2E] text-[9.5px] font-bold uppercase tracking-wider">
            DAILY FEATURED DUA
          </span>

          <h3 className="font-serif text-[19px] font-bold text-[#0D4A2E] leading-[1.18] mt-1.5 line-clamp-2">
            {featured.title}
          </h3>

          <p className="text-[11.5px] text-[#2A3B32] mt-1 line-clamp-2">
            {subtitle}
          </p>

          <div className="mt-2.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowReader(!showReader);
              }}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#0D4A2E] to-[#1A6B44] text-white text-[12px] font-semibold inline-flex items-center space-x-1.5 shadow-sm"
            >
              <span>{showReader ? 'Hide dua' : 'Read dua'}</span>
              <span>›</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Pure Arabic + Translation Drawer when "Read dua" is tapped */}
      {showReader && (
        <div className="mt-2 rounded-[20px] bg-[#0F4C2B] text-white p-4 border border-[#C99E4C]/50 space-y-2.5 fade-in">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F0D58C] truncate">
              Prophetic Supplication ({featured.reference || 'Authentic Sunnah'})
            </span>
            <button
              type="button"
              onClick={() => onToggleBookmark && onToggleBookmark(featured.id)}
              className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[10.5px] font-bold shrink-0"
            >
              {isBookmarked ? '🔖 Saved' : '🔖 Bookmark'}
            </button>
          </div>

          <p
            dir="rtl"
            className="font-arabic text-[22px] leading-[1.75] text-[#F0D58C] text-center py-1"
          >
            {featured.arabic}
          </p>

          <p className="text-[12px] text-white/90 leading-relaxed">
            {featured.translation}
          </p>

          {featured.romanUrdu && (
            <p className="text-[11.5px] text-[#F0D58C]/90 pt-1.5 border-t border-white/15">
              {featured.romanUrdu}
            </p>
          )}

          {onOpenDuasTab && (
            <button
              type="button"
              onClick={onOpenDuasTab}
              className="w-full py-2 rounded-full bg-[#DFB75A] text-[#07361D] text-[12px] font-bold mt-1"
            >
              Open Full Duas Library &amp; Audio ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}