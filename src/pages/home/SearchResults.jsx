//Displays categorized global search matches across Daily Aamaal, Prophetic Duas, Heart Check-In States, and App Shortcuts whenever the user types in GlobalSearch.jsx.   

import React from 'react';
import { DEFAULT_AAMAAL_LIST } from '../aamaal/AamaalCategories';
import { DEFAULT_DUAS_LIBRARY } from '../duas/DuaCategories';
import { FEELING_STATES } from '../feelings/FeelingCheckIn';

export default function SearchResults({
  query = '',
  onNavigateTab,
  onSearchDuas,
  onCloseSearch,
}) {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return null;

  const matchedAamaal = DEFAULT_AAMAAL_LIST.filter(
    (a) =>
      a.name.toLowerCase().includes(cleanQuery) ||
      (a.translation || '').toLowerCase().includes(cleanQuery)
  );

  const matchedDuas = DEFAULT_DUAS_LIBRARY.filter(
    (d) =>
      d.title.toLowerCase().includes(cleanQuery) ||
      d.category.toLowerCase().includes(cleanQuery) ||
      (d.translation || '').toLowerCase().includes(cleanQuery) ||
      (d.romanUrdu || '').toLowerCase().includes(cleanQuery)
  );

  const matchedFeelings = FEELING_STATES.filter(
    (f) =>
      f.label.toLowerCase().includes(cleanQuery) ||
      f.shortPrompt.toLowerCase().includes(cleanQuery)
  );

  const totalMatches =
    matchedAamaal.length + matchedDuas.length + matchedFeelings.length;

  return (
    <div className="card rounded-[20px] p-4 mb-4 space-y-3 bg-[#F3EFE2] border border-[#C99E4C]/50 fade-in">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#135332]">
          🔍 Search Results ({totalMatches})
        </span>
        {onCloseSearch && (
          <button
            type="button"
            onClick={onCloseSearch}
            className="text-[11px] font-bold text-secondary underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {totalMatches === 0 ? (
        <p className="text-[12px] text-secondary py-2 text-center">
          No matches found for &ldquo;{query}&rdquo;. Try searching for Durood, Mulk, Peace, or Forgiveness.
        </p>
      ) : (
        <div className="space-y-2.5 max-h-72 overflow-y-auto no-scrollbar">
          {/* Matched Aamaal */}
          {matchedAamaal.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('aamaal')}
              className="w-full text-left p-2.5 rounded-xl bg-[#F5F2E8] border border-[#DCD8C6] flex items-center justify-between"
            >
              <div>
                <span className="px-2 py-0.5 rounded bg-[#DCE3C8] text-[#0D4A2E] text-[9px] font-bold uppercase">
                  Daily Aamaal
                </span>
                <h4 className="font-serif text-[14px] font-semibold text-primary mt-0.5">
                  {item.name} (Target: {item.target})
                </h4>
              </div>
              <span className="text-primary font-bold">›</span>
            </button>
          ))}

          {/* Matched Duas */}
          {matchedDuas.map((dua) => (
            <button
              key={dua.id}
              type="button"
              onClick={() => {
                if (onSearchDuas) {
                  onSearchDuas(dua.title);
                } else if (onNavigateTab) {
                  onNavigateTab('duas');
                }
              }}
              className="w-full text-left p-2.5 rounded-xl bg-[#F5F2E8] border border-[#DCD8C6] flex items-center justify-between"
            >
              <div className="min-w-0 pr-2">
                <span className="px-2 py-0.5 rounded bg-[#EAE8D7] text-primary text-[9px] font-bold uppercase">
                  Dua • {dua.category}
                </span>
                <h4 className="font-serif text-[14px] font-semibold text-primary mt-0.5 truncate">
                  {dua.title}
                </h4>
                <p className="text-[11px] text-secondary truncate">
                  {dua.translation}
                </p>
              </div>
              <span className="text-primary font-bold shrink-0">›</span>
            </button>
          ))}

          {/* Matched Feelings */}
          {matchedFeelings.map((feel) => (
            <button
              key={feel.id}
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('feelings')}
              className="w-full text-left p-2.5 rounded-xl bg-[#F5F2E8] border border-[#DCD8C6] flex items-center justify-between"
            >
              <div>
                <span className="px-2 py-0.5 rounded bg-[#EAE8D7] text-[#135332] text-[9px] font-bold uppercase">
                  Heart Check-In
                </span>
                <h4 className="font-serif text-[14px] font-semibold text-primary mt-0.5">
                  {feel.icon} {feel.label}
                </h4>
              </div>
              <span className="text-primary font-bold">›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}