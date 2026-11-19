//Renders the full dedicated Dua Reader screen uniting ArabicDisplay, AudioPlayer, TranslationDisplay (English, Roman Urdu, Urdu, Hindi), DuaBenefits, DuaReferences, and an interactive repetition counter (+1 Recited).

import React, { useState, useEffect, useRef } from 'react';
import ArabicDisplay from './ArabicDisplay';
import TranslationDisplay from './TranslationDisplay';
import AudioPlayer from './AudioPlayer';
import DuaBenefits from './DuaBenefits';
import DuaReferences from './DuaReferences';

export default function DuaDetails({
  dua,
  isBookmarked = false,
  preferences = {
    arabicFontSize: 26,
    translationFontSize: 13.5,
    language: 'en',
    showBenefits: true,
    showAudio: true,
  },
  onToggleBookmark,
  onCompleteRecitation,
  onBack,
}) {
  const [recitedCount, setRecitedCount] = useState(0);
  const topRef = useRef(null);

  // Always start at the very top when opening a Dua
  useEffect(() => {
    setRecitedCount(0);
    try {
      window.scrollTo(0, 0);
      if (topRef.current) {
        const scrollParent = topRef.current.closest('.screen-section');
        if (scrollParent) scrollParent.scrollTop = 0;
        topRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    } catch (_) {}
  }, [dua?.id]);

  if (!dua) return null;

  const targetRepeat = Number(dua.repeatCount || 1);
  const badgeText = dua.badge || 'PROPHETIC DUA';

  const handleTapCounter = () => {
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}
    const next = recitedCount + 1;
    setRecitedCount(next);
    if (onCompleteRecitation) {
      onCompleteRecitation(dua, next);
    }
  };

  return (
    <div ref={topRef} className="space-y-3.5 fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary px-3.5 py-1.5 text-[12px] font-semibold"
          >
            ‹ Back to Duas
          </button>
        )}

        <button
          type="button"
          onClick={() => onToggleBookmark && onToggleBookmark(dua.id)}
          className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold border transition ${
            isBookmarked
              ? 'bg-[#0D4A2E] text-[#F0D58C] border-[#C99E4C]'
              : 'bg-[#EAE8D7] text-primary border-[#D5D2BE]'
          }`}
        >
          {isBookmarked ? '🔖 Saved in Bookmarks' : '🔖 Bookmark Dua'}
        </button>
      </div>

      {/* Title Card */}
      <div>
        <span className="badge-pill">{dua.badge || dua.category}</span>
        <h2 className="font-serif text-[22px] font-semibold text-primary mt-1 leading-snug">
          {dua.title}
        </h2>
        {dua.shortDesc && (
          <p className="text-[12px] text-secondary mt-0.5">{dua.shortDesc}</p>
        )}
      </div>

      {/* 1. Pure Arabic Script Card */}
      <ArabicDisplay
        arabicText={dua.arabic}
        badge={badgeText}
        fontSize={preferences.arabicFontSize}
        repeatCount={targetRepeat}
      />

      {/* 2. Audio Recitation Player */}
      {preferences.showAudio && (
        <AudioPlayer
          arabicText={dua.arabic}
          audioUrl={dua.audioUrl}
          title={dua.title}
        />
      )}

      {/* 3. Multi-Language Translation (English / Roman Urdu / Urdu / Hindi) */}
      <TranslationDisplay
        dua={dua}
        fontSize={preferences.translationFontSize}
        preferredLanguage={preferences.language}
        showLanguageSwitcher={true}
      />

      {/* 4. Virtues & Benefits */}
      {preferences.showBenefits && (
        <DuaBenefits
          benefits={dua.benefits}
          recommendedTime={dua.recommendedTime}
          reflection={dua.reflection}
        />
      )}

      {/* 5. Authentic Source Reference & Share */}
      <DuaReferences
        arabicText={dua.arabic}
        authenticity={dua.authenticity}
        category={dua.category}
        duaTitle={dua.title}
        reference={dua.reference}
        translationText={dua.translation}
      />

      {/* 6. Interactive Recitation Counter Button */}
      <div className="pt-1 flex items-center space-x-2.5">
        <button
          type="button"
          onClick={handleTapCounter}
          className="btn-primary flex-1 py-3.5 text-[13.5px] font-semibold shadow-md"
        >
          <span>
            ✓ Mark Recited ({recitedCount}/{targetRepeat})
          </span>
        </button>

        {recitedCount > 0 && (
          <button
            type="button"
            onClick={() => setRecitedCount(0)}
            className="btn-secondary px-4 py-3.5 text-[12px] font-semibold"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}