import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STORY_CARDS = [
  {
    id: 'makkah',
    tag: 'FAITH IN A TIME OF DARKNESS',
    title: 'The Valley of Makkah',
    lesson: 'Lesson 2 of 6 • Character Over Power',
    quote: '"And indeed, you are of a great moral character." (Surah Al-Qalam 68:4)',
    image: './img/reading-photo.jpg',
  },
  {
    id: 'ibrahim',
    tag: 'UNWAVERING TRUST IN ALLAH',
    title: 'The Sanctuary of Ibrahim',
    lesson: 'Lesson 1 of 6 • Tawakkul in the Desert',
    quote: '"Indeed, the first House established for mankind was that at Makkah." (Quran 3:96)',
    image: './img/featured-photo.png',
  },
  {
    id: 'hira',
    tag: 'LIGHT OF REVELATION',
    title: 'Night of Serenity',
    lesson: 'Lesson 4 of 6 • Stillness of Mount Hira',
    quote: '"Peace it is until the emergence of dawn." (Surah Al-Qadr 97:5)',
    image: './img/header.png',
  },
];

export default function StoriesIntro() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const cycleStory = () => {
    try {
      if (navigator.vibrate) navigator.vibrate(12);
    } catch (_) {}
    setActiveIndex((prev) => (prev + 1) % STORY_CARDS.length);
  };

  const currentStory = STORY_CARDS[activeIndex];

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
          <span className="badge-pill">Step 3 of 5</span>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mt-4">
          <h2 className="font-serif text-[26px] font-semibold text-primary">
            Reflections & Stories
          </h2>
          <p className="text-[12.5px] text-secondary mt-1 max-w-[300px] mx-auto">
            Explore inspiring stories, character lessons, and reflections from the Noble Quran and Prophetic Seerah.
          </p>
        </div>

        {/* Fanned Story Deck Preview */}
        <div className="relative mt-5 flex flex-col items-center">
          <div className="relative w-full max-w-[290px] h-[235px] flex items-center justify-center">
            {/* Left Tilted Background Card */}
            <div
              onClick={cycleStory}
              className="cursor-pointer absolute w-[210px] h-[205px] rounded-[20px] bg-[#DFDEC9] border border-white/80 shadow-sm -rotate-6 -translate-x-7 translate-y-2 transition-transform"
            />
            {/* Right Tilted Background Card */}
            <div
              onClick={cycleStory}
              className="cursor-pointer absolute w-[210px] h-[205px] rounded-[20px] bg-[#EAE8D7] border border-white/80 shadow-sm rotate-6 translate-x-7 translate-y-2 transition-transform"
            />

            {/* Center Featured Story Card */}
            <div
              onClick={cycleStory}
              className="cursor-pointer relative z-10 w-[245px] rounded-[20px] bg-gradient-to-br from-[#165534] to-[#08351D] border-2 border-[#C99E4C]/60 shadow-progress-card overflow-hidden text-white p-3.5 flex flex-col justify-between h-[215px]"
            >
              <div className="relative w-full h-24 rounded-[12px] overflow-hidden bg-[#0D4A2E] mb-2">
                <img
                  src={currentStory.image}
                  alt={currentStory.title}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08351D] via-transparent to-transparent" />
                <span className="absolute bottom-1.5 left-2 text-[8.5px] font-bold tracking-[0.12em] uppercase text-[#F0D58C]">
                  {currentStory.tag}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-[18px] font-semibold text-white leading-tight">
                  {currentStory.title}
                </h3>
                <p className="text-[10.5px] text-[#F0D58C] mt-0.5">
                  {currentStory.lesson}
                </p>
                <p className="text-[10.5px] text-white/80 italic mt-1 line-clamp-2">
                  {currentStory.quote}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={cycleStory}
            className="mt-2 text-[11.5px] font-semibold text-primary flex items-center gap-1"
          >
            <span>Tap card to preview next story ({activeIndex + 1}/3)</span>
            <span>↻</span>
          </button>
        </div>

        {/* 3 Feature Highlight Pillars */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="card-soft p-2.5 text-center">
            <div className="w-8 h-8 rounded-full bg-[#0D4A2E] text-[#F0D58C] flex items-center justify-center mx-auto mb-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <h4 className="font-serif text-[12px] font-semibold text-primary">
              Rich Stories
            </h4>
            <p className="text-[10px] text-secondary mt-0.5 leading-tight">
              Illustrated chapters from Seerah.
            </p>
          </div>

          <div className="card-soft p-2.5 text-center">
            <div className="w-8 h-8 rounded-full bg-[#0D4A2E] text-[#F0D58C] flex items-center justify-center mx-auto mb-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <h4 className="font-serif text-[12px] font-semibold text-primary">
              Key Lessons
            </h4>
            <p className="text-[10px] text-secondary mt-0.5 leading-tight">
              6 structured lessons per series.
            </p>
          </div>

          <div className="card-soft p-2.5 text-center">
            <div className="w-8 h-8 rounded-full bg-[#0D4A2E] text-[#F0D58C] flex items-center justify-center mx-auto mb-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h4 className="font-serif text-[12px] font-semibold text-primary">
              Reflections
            </h4>
            <p className="text-[10px] text-secondary mt-0.5 leading-tight">
              Apply Prophetic wisdom daily.
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
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
          <span className="w-5 h-2 rounded-full bg-[#0D4A2E]" />
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
        </div>

        <button
          onClick={() => navigate('/onboarding/language')}
          className="btn-primary px-6 py-2.5 text-[13.5px]"
        >
          <span>Next</span>
          <span>›</span>
        </button>
      </footer>
    </section>
  );
}