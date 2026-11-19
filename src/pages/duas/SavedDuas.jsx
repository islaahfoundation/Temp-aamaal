//Displays the user's bookmarked Duas collection with quick access to read, listen, or manage saved supplications.

import React from 'react';
import CategoryDetails from './CategoryDetails';

export default function SavedDuas({
  allDuas = [],
  savedDuaIds = [],
  preferredLanguage = 'en',
  onSelectDua,
  onToggleBookmark,
  onBrowseAll,
}) {
  const bookmarkedDuas = allDuas.filter((d) => savedDuaIds.includes(d.id));

  if (bookmarkedDuas.length === 0) {
    return (
      <div className="card rounded-[22px] p-6 text-center space-y-3 my-2">
        <div className="w-12 h-12 rounded-full bg-[#EAE8D7] text-primary flex items-center justify-center mx-auto text-[20px]">
          🔖
        </div>
        <div>
          <h3 className="font-serif text-[18px] font-semibold text-primary">
            No Saved Duas Yet
          </h3>
          <p className="text-[12px] text-secondary mt-1 max-w-[260px] mx-auto">
            Tap the bookmark icon on any Dua to save it here for quick daily access.
          </p>
        </div>
        {onBrowseAll && (
          <button
            type="button"
            onClick={onBrowseAll}
            className="btn-primary px-5 py-2.5 text-[12.5px] font-semibold"
          >
            Browse All Duas
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-[16px] bg-[#0F4C2B] text-white px-4 py-3 border border-[#C99E4C]/40">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F0D58C] block">
          Personal Collection
        </span>
        <h3 className="font-serif text-[16px] font-semibold">
          Your Bookmarked Duas ({bookmarkedDuas.length})
        </h3>
      </div>

      <CategoryDetails
        categoryId="all"
        duas={bookmarkedDuas}
        savedDuaIds={savedDuaIds}
        preferredLanguage={preferredLanguage}
        onSelectDua={onSelectDua}
        onToggleBookmark={onToggleBookmark}
      />
    </div>
  );
}