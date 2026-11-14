import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PREVIEW_DUAS = [
  {
    id: 'knowledge',
    title: 'Dua for Guidance & Knowledge',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    translation: '"My Lord, increase me in knowledge." (Quran 20:114)',
    romanUrdu: '"Aye mere Rab! Mere ilm mein izafa farma."',
    tag: 'QURANIC DUA',
  },
  {
    id: 'forgiveness',
    title: 'Dua for Forgiveness',
    arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ',
    translation: '"My Lord, forgive me and accept my repentance."',
    romanUrdu: '"Aye mere Rab! Mujhe bakhsh de aur meri tauba qubool farma."',
    tag: 'DAILY SUNNAH',
  },
  {
    id: 'ease',
    title: 'Dua for Ease in Affairs',
    arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا',
    translation: '"O Allah, there is no ease except in that which You have made easy."',
    romanUrdu: '"Aye Allah! Koi cheez aasan nahi magar jise Tu aasan bana de."',
    tag: 'SEEKING EASE',
  },
];

export default function DuaIntro() {
  const navigate = useNavigate();
  const [activeDua, setActiveDua] = useState(PREVIEW_DUAS[0]);
  const [bookmarked, setBookmarked] = useState(true);

  const selectPreviewDua = (dua) => {
    try {
      if (navigator.vibrate) navigator.vibrate(12);
    } catch (_) {}
    setActiveDua(dua);
  };

  return (
    <section className="screen-section no-scrollbar px-5 pt-6 pb-6 flex flex-col justify-between">
      <div>
        {/* Top Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="./img/logo.png"
              alt="Aamaal"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="w-9 h-8 object-contain"
            />
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-gold leading-none">
                Islaah Foundation’s
              </p>
              <p className="font-serif text-[14px] font-semibold text-primary leading-tight">
                Aamaal Circle
              </p>
            </div>
          </div>
          <span className="badge-pill">Step 2 of 5</span>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mt-4">
          <h2 className="font-serif text-[26px] font-semibold text-primary">
            Explore Duas
          </h2>
          <p className="text-[12.5px] text-secondary mt-1 max-w-[300px] mx-auto">
            Browse a curated collection of authentic Prophetic & Quranic duas for every moment and emotion in your life.
          </p>
        </div>

        {/* Interactive Floating Ayah Card + Category Selector */}
        <div className="mt-4">
          <div className="card-progress p-4 text-center relative">
            <div className="flex items-center justify-between mb-1">
              <span className="px-2 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[9.5px] font-bold uppercase tracking-wider">
                {activeDua.tag}
              </span>
              <button
                type="button"
                onClick={() => setBookmarked(!bookmarked)}
                aria-label="Bookmark preview"
                className="text-[#F0D58C]"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill={bookmarked ? '#F0D58C' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>

            <p className="font-arabic text-[26px] text-[#F0D58C] my-1.5">
              {activeDua.arabic}
            </p>
            <p className="text-[12px] text-white/95 font-medium mt-1">
              {activeDua.translation}
            </p>
            <p className="text-[11px] text-white/75 mt-0.5">
              {activeDua.romanUrdu}
            </p>
          </div>

          {/* Interactive Selector List */}
          <div className="space-y-1.5 mt-2.5">
            {PREVIEW_DUAS.map((dua) => {
              const isSelected = activeDua.id === dua.id;
              return (
                <button
                  key={dua.id}
                  type="button"
                  onClick={() => selectPreviewDua(dua)}
                  className={`w-full px-3.5 py-2 rounded-[14px] flex items-center justify-between text-left transition border ${
                    isSelected
                      ? 'bg-[#EAE8D7] border-[#0D4A2E] text-primary font-semibold shadow-sm'
                      : 'bg-[#F3EFE2] border-white/80 text-secondary'
                  }`}
                >
                  <span className="text-[12.5px]">{dua.title}</span>
                  <span className="text-[11px] text-primary font-medium">
                    {isSelected ? 'Viewing' : 'Preview ›'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Feature Highlight Pillars */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          <div className="card-soft p-2.5 text-center">
            <div className="w-8 h-8 rounded-full bg-[#0D4A2E] text-[#F0D58C] flex items-center justify-center mx-auto mb-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <h4 className="font-serif text-[12px] font-semibold text-primary">
              By Category
            </h4>
            <p className="text-[10px] text-secondary mt-0.5 leading-tight">
              Find duas for daily life & moods.
            </p>
          </div>

          <div className="card-soft p-2.5 text-center">
            <div className="w-8 h-8 rounded-full bg-[#0D4A2E] text-[#F0D58C] flex items-center justify-center mx-auto mb-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h4 className="font-serif text-[12px] font-semibold text-primary">
              Save for Later
            </h4>
            <p className="text-[10px] text-secondary mt-0.5 leading-tight">
              Bookmark your favourite duas.
            </p>
          </div>

          <div className="card-soft p-2.5 text-center">
            <div className="w-8 h-8 rounded-full bg-[#0D4A2E] text-[#F0D58C] flex items-center justify-center mx-auto mb-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h4 className="font-serif text-[12px] font-semibold text-primary">
              Build Habits
            </h4>
            <p className="text-[10px] text-secondary mt-0.5 leading-tight">
              Make supplication a routine.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="pt-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/onboarding/authentication')}
          className="text-[13px] font-medium text-muted px-2 py-2"
        >
          Skip
        </button>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
          <span className="w-5 h-2 rounded-full bg-[#0D4A2E]" />
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
        </div>

        <button
          onClick={() => navigate('/onboarding/stories')}
          className="btn-primary px-6 py-2.5 text-[13.5px]"
        >
          <span>Next</span>
          <span>›</span>
        </button>
      </footer>
    </section>
  );
}