//The main hub uniting DuaSearch, DuaCategories, CategoryDetails, SavedDuas, DuaDetails, and DuaPreferences.

import React, { useState, useEffect, useRef } from 'react';
import DuaSearch from './DuaSearch';
import DuaCategories, { DEFAULT_DUAS_LIBRARY } from './DuaCategories';
import CategoryDetails from './CategoryDetails';
import SavedDuas from './SavedDuas';
import DuaDetails from './DuaDetails';
import DuaPreferences from './DuaPreferences';

const PREFS_STORAGE_KEY = 'aamaal_dua_reader_prefs_v1';

export default function DuasHome({
  state,
  searchQuery: externalSearchQuery = '',
  onSelectFilter,
  onToggleBookmark,
  onOpenModal,
  updateState,
  onShowToast,
}) {
  const [localSearch, setLocalSearch] = useState(externalSearchQuery || '');
  const sectionRef = useRef(null);

  const [showingSavedOnly, setShowingSavedOnly] = useState(() => {
    const flag = localStorage.getItem('aamaal_open_saved_duas') === 'true';
    return flag || state?.activeDuaFilter === 'saved';
  });

  const [activeCategory, setActiveCategory] = useState(() => {
    if (state?.activeDuaFilter && state.activeDuaFilter !== 'saved') {
      return state.activeDuaFilter;
    }
    return 'all';
  });

  const [selectedDua, setSelectedDua] = useState(null);
  const [showPrefs, setShowPrefs] = useState(false);

  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PREFS_STORAGE_KEY) || 'null');
      if (saved) return saved;
    } catch (_) {}
    return {
      arabicFontSize: 26,
      translationFontSize: 13.5,
      language: localStorage.getItem('aamaal_language') || 'en',
      showBenefits: true,
      showAudio: true,
    };
  });

  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setLocalSearch(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  // Scroll to top whenever opening or closing a Dua
  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollTop = 0;
    }
  }, [selectedDua]);

  // Handle routing directly to Saved Duas from Home Quick Actions
  useEffect(() => {
    const flag = localStorage.getItem('aamaal_open_saved_duas') === 'true';
    if (flag || state?.activeDuaFilter === 'saved') {
      setShowingSavedOnly(true);
      setActiveCategory('all');
      try {
        localStorage.removeItem('aamaal_open_saved_duas');
      } catch (_) {}
    } else if (state?.activeDuaFilter) {
      setShowingSavedOnly(false);
      setActiveCategory(state.activeDuaFilter);
    }
  }, [state?.activeDuaFilter]);

  const handleUpdatePrefs = (nextPrefs) => {
    setPreferences(nextPrefs);
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(nextPrefs));
    } catch (_) {}
  };

  const savedDuaIds = state?.savedDuaIds || [];

  const handleCategoryChange = (catId) => {
    setShowingSavedOnly(false);
    setActiveCategory(catId);
    if (onSelectFilter) onSelectFilter(catId);
  };

  const handleToggleSavedFilter = (forceVal) => {
    const nextVal =
      typeof forceVal === 'boolean' ? forceVal : !showingSavedOnly;
    setShowingSavedOnly(nextVal);
    if (!nextVal && onSelectFilter) {
      onSelectFilter('all');
    }
  };

  const handleBookmarkClick = (id) => {
    if (onToggleBookmark) onToggleBookmark(id);
  };

  const handleRecitationDone = (duaItem, count) => {
    if (updateState) {
      updateState((prev) => ({
        ...prev,
        sessionsCount: (prev.sessionsCount || 0) + 1,
        dhikrCount: (prev.dhikrCount || 0) + 1,
      }));
    }
    if (onShowToast && count === Number(duaItem.repeatCount || 1)) {
      onShowToast(`MashaAllah! Completed ${duaItem.title}`);
    }
  };

  // Filter Duas by Search & Category
  const filteredDuas = DEFAULT_DUAS_LIBRARY.filter((dua) => {
    if (
      activeCategory !== 'all' &&
      activeCategory !== 'saved' &&
      dua.category.toLowerCase() !== activeCategory.toLowerCase()
    ) {
      return false;
    }
    if (!localSearch.trim()) return true;
    const q = localSearch.toLowerCase();
    return (
      (dua.title || '').toLowerCase().includes(q) ||
      (dua.category || '').toLowerCase().includes(q) ||
      (dua.translation || '').toLowerCase().includes(q) ||
      (dua.romanUrdu || '').toLowerCase().includes(q) ||
      (dua.shortDesc || '').toLowerCase().includes(q)
    );
  });

  // If a specific Dua is selected, open the full DuaDetails reader view
  if (selectedDua) {
    const isCurrentBookmarked = savedDuaIds.includes(selectedDua.id);
    return (
      <section ref={sectionRef} className="screen-section no-scrollbar px-5 pt-4 pb-6">
        <DuaDetails
          dua={selectedDua}
          isBookmarked={isCurrentBookmarked}
          preferences={preferences}
          onToggleBookmark={handleBookmarkClick}
          onCompleteRecitation={handleRecitationDone}
          onBack={() => setSelectedDua(null)}
        />
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="screen-section no-scrollbar px-5 pt-4 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
            Prophetic &amp; Quranic Supplications
          </span>
          <h2 className="font-serif text-[24px] font-semibold text-primary leading-tight">
            Duas &amp; Adhkar
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowPrefs(true)}
          title="Reading Preferences"
          className="px-3 py-1.5 rounded-full bg-[#EAE8D7] border border-[#D5D2BE] text-primary text-[11.5px] font-semibold flex items-center space-x-1"
        >
          <span>Aa</span>
          <span>Display</span>
        </button>
      </div>

      {/* Reading Preferences Popup Modal */}
      {showPrefs && (
        <DuaPreferences
          preferences={preferences}
          onUpdatePreferences={handleUpdatePrefs}
          onClose={() => setShowPrefs(false)}
        />
      )}

      {/* Search Bar, Saved Filter & Category Chips */}
      <DuaSearch
        activeCategory={activeCategory}
        onSearchChange={setLocalSearch}
        onSelectCategory={handleCategoryChange}
        onToggleSavedOnly={handleToggleSavedFilter}
        savedCount={savedDuaIds.length}
        searchQuery={localSearch}
        showingSavedOnly={showingSavedOnly}
      />

      {/* Saved Duas View vs Category Browse View */}
      {showingSavedOnly ? (
        <SavedDuas
          allDuas={DEFAULT_DUAS_LIBRARY}
          savedDuaIds={savedDuaIds}
          preferredLanguage={preferences.language}
          onSelectDua={setSelectedDua}
          onToggleBookmark={onToggleBookmark}
          onBrowseAll={() => handleToggleSavedFilter(false)}
        />
      ) : (
        <>
          {activeCategory === 'all' && !localSearch.trim() && (
            <DuaCategories
              activeCategory={activeCategory}
              duasList={DEFAULT_DUAS_LIBRARY}
              onSelectCategory={handleCategoryChange}
            />
          )}

          <CategoryDetails
            categoryId={activeCategory}
            duas={filteredDuas}
            savedDuaIds={savedDuaIds}
            preferredLanguage={preferences.language}
            onSelectDua={setSelectedDua}
            onToggleBookmark={onToggleBookmark}
            onClearCategory={() => handleCategoryChange('all')}
          />
        </>
      )}
    </section>
  );
}