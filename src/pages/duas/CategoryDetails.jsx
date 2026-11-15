//Renders the filtered list of Duas inside any chosen category (or all categories), displaying each Dua's title, Arabic preview, translation snippet, bookmark toggle, and click-to-open full reader.

import React from 'react';
import { DUA_CATEGORIES_META } from './DuaCategories';

export default function CategoryDetails({
  categoryId = 'all',
  duas = [],
  savedDuaIds = [],
  preferredLanguage = 'en',
  onSelectDua,
  onToggleBookmark,
  onClearCategory,
}) {
  const categoryMeta = DUA_CATEGORIES_META.find((c) => c.id === categoryId);

  const getPreviewTranslation = (dua) => {
    if (preferredLanguage === 'ur-roman' && dua.romanUrdu) return dua.romanUrdu;
    if (preferredLanguage === 'ur' && dua.urdu) return dua.urdu;
    if (preferredLanguage === 'hi' && dua.hindi) return dua.hindi;
    return dua.translation;
  };

  return (
    <div className="space-y-3">
      {/* Category Header Banner when a specific category is selected */}
      {categoryId !== 'all' && categoryMeta && (
        <div className="rounded-[18px] bg-[#EAE8D7] p-3.5 border border-[#D5D2BE] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="text-[22px]">{categoryMeta.icon}</span>
            <div>
              <h3 className="font-serif text-[16px] font-semibold text-primary">
                {categoryMeta.title}
              </h3>
              <p className="text-[11px] text-secondary">
                {categoryMeta.subtitle}
              </p>
            </div>
          </div>
          {onClearCategory && (
            <button
              type="button"
              onClick={onClearCategory}
              className="px-2.5 py-1 rounded-full bg-[#F5F2E8] text-primary text-[11px] font-bold border border-[#D5D2BE]"
            >
              Show All
            </button>
          )}
        </div>
      )}

      {/* Duas List */}
      {duas.length === 0 ? (
        <div className="card rounded-[20px] p-6 text-center">
          <p className="font-serif text-[16px] font-semibold text-primary">
            No matching Duas found
          </p>
          <p className="text-[12px] text-secondary mt-1">
            Try clearing your search query or switching categories.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {duas.map((dua) => {
            const isBookmarked = savedDuaIds.includes(dua.id);
            return (
              <div
                key={dua.id}
                onClick={() => onSelectDua && onSelectDua(dua)}
                className="card rounded-[20px] p-4 cursor-pointer active:scale-[0.99] transition space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="badge-pill">{dua.badge || dua.category}</span>
                    <h4 className="font-serif text-[16.5px] font-semibold text-primary mt-1">
                      {dua.title}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      try {
                        if (navigator.vibrate) navigator.vibrate(12);
                      } catch (_) {}
                      if (onToggleBookmark) onToggleBookmark(dua.id);
                    }}
                    aria-label="Toggle Bookmark"
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition ${
                      isBookmarked
                        ? 'bg-[#0D4A2E] text-[#F0D58C] border-[#C99E4C]'
                        : 'bg-[#EAE8D7] text-primary border-[#D5D2BE]'
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill={isBookmarked ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                </div>

                {/* Arabic Script Preview */}
                <div className="rounded-2xl bg-[#0F4C2B] px-3.5 py-2.5 text-right border border-[#C99E4C]/40">
                  <p
                    dir="rtl"
                    className="font-arabic text-[21px] leading-[1.65] text-[#F0D58C] line-clamp-2"
                  >
                    {dua.arabic}
                  </p>
                </div>

                {/* Translation Snippet (No Transliteration) */}
                <p className="text-[12px] text-[#1A3826] line-clamp-2 leading-relaxed">
                  {getPreviewTranslation(dua)}
                </p>

                <div className="pt-1 flex items-center justify-between text-[11px] text-secondary">
                  <span>📖 {dua.reference || 'Prophetic Sunnah'}</span>
                  <span className="font-bold text-[#0D4A2E]">
                    Read &amp; Listen ›
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}