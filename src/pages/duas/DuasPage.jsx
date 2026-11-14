import React from 'react';
import DuaCard from '../../components/DuaCard';
import duasData from '../../data/duas.json';
import categoriesData from '../../data/categories.json';

export default function DuasPage({
  state,
  searchQuery,
  onSelectFilter,
  onToggleBookmark,
  onOpenModal
}) {
  const filteredDuas = duasData.filter((item) => {
    if (state.activeDuaFilter === 'Saved') {
      return state.savedDuaIds.includes(item.id);
    }
    if (state.activeDuaFilter !== 'all' && item.category !== state.activeDuaFilter) {
      return false;
    }
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.translation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <section className="h-full overflow-y-auto no-scrollbar px-5 pt-4 pb-6">
      <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#C99E4C]">
        Sacred Supplications
      </span>
      <h2 className="font-serif text-[24px] font-semibold text-[#0D4A2E]">Duas & Reflections</h2>

      <div className="mt-2">
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
          {categoriesData.duaFilters.map((chip) => {
            const active = state.activeDuaFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => onSelectFilter(chip.id)}
                className={`px-3 py-1 rounded-full text-[12px] font-medium transition whitespace-nowrap ${
                  active ? 'bg-[#0D4A2E] text-white' : 'bg-[#EAE8D7] text-[#0D4A2E]'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        {filteredDuas.map((dua) => (
          <DuaCard
            key={dua.id}
            dua={dua}
            isSaved={state.savedDuaIds.includes(dua.id)}
            onToggleBookmark={onToggleBookmark}
            onOpenReader={onOpenModal}
          />
        ))}
      </div>
    </section>
  );
}
