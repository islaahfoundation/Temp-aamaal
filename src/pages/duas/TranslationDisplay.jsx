//Displays the meaning of the Dua in English, Roman Urdu, Urdu (اردو), or Hindi (हिन्दी) with an instant language switcher pill bar and zero Arabic transliteration.

import React, { useState, useEffect } from 'react';

const TRANSLATION_TABS = [
  { id: 'en', label: 'English' },
  { id: 'ur-roman', label: 'Roman Urdu' },
  { id: 'ur', label: 'اردو' },
  { id: 'hi', label: 'हिन्दी' },
];

export default function TranslationDisplay({
  dua,
  preferredLanguage,
  fontSize = 13.5,
  showLanguageSwitcher = true,
}) {
  const [activeLang, setActiveLang] = useState(
    preferredLanguage || localStorage.getItem('aamaal_language') || 'en'
  );

  useEffect(() => {
    if (preferredLanguage) {
      setActiveLang(preferredLanguage);
    }
  }, [preferredLanguage]);

  if (!dua) return null;

  const getTranslationText = (langCode) => {
    switch (langCode) {
      case 'ur-roman':
        return dua.romanUrdu || dua.translation || '';
      case 'ur':
        return dua.urdu || dua.romanUrdu || dua.translation || '';
      case 'hi':
        return dua.hindi || dua.romanUrdu || dua.translation || '';
      case 'en':
      default:
        return dua.translation || '';
    }
  };

  const currentText = getTranslationText(activeLang);
  const isRtl = activeLang === 'ur';

  return (
    <div className="rounded-[16px] bg-white/80 p-3.5 border border-[#E2DFCE] space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
          Translation &amp; Meaning
        </span>

        {showLanguageSwitcher && (
          <div className="inline-flex rounded-full p-0.5 bg-[#EAE8D7] border border-[#D5D2BE]">
            {TRANSLATION_TABS.map((tab) => {
              const isSelected = activeLang === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    try {
                      if (navigator.vibrate) navigator.vibrate(8);
                    } catch (_) {}
                    setActiveLang(tab.id);
                  }}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
                    isSelected
                      ? 'bg-[#0D4A2E] text-white'
                      : 'text-primary hover:bg-[#DFDEC9]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Selected Translation */}
      <p
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{ fontSize: `${fontSize}px` }}
        className="text-[#1A3826] leading-relaxed font-medium"
      >
        {currentText}
      </p>

      {/* Secondary Roman Urdu line if viewing English and Roman Urdu exists */}
      {activeLang === 'en' && dua.romanUrdu && (
        <p className="text-[12px] text-[#0D4A2E] pt-2 border-t border-[#E2DFCE] leading-relaxed">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-gold block mb-0.5">
            Roman Urdu Translation
          </span>
          {dua.romanUrdu}
        </p>
      )}
    </div>
  );
}