//Allows selecting the primary app & translation language across all 4 supported languages (English, Roman Urdu, Urdu اردو, and Hindi हिन्दी), syncing directly with localStorage.getItem('aamaal_language').

import React from 'react';

export const APP_LANGUAGES = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    sample: 'Indeed, in the remembrance of Allah do hearts find rest.',
    badge: 'Default',
  },
  {
    id: 'ur-roman',
    name: 'Roman Urdu',
    nativeName: 'Roman Urdu',
    sample: 'Beshak Allah hi ke zikr se dilon ko sukoon milta hai.',
    badge: 'Popular',
  },
  {
    id: 'ur',
    name: 'Urdu Script',
    nativeName: 'اردو',
    sample: 'بے شک اللہ کے ذکر ہی سے دلوں کو اطمینان نصیب ہوتا ہے۔',
    badge: 'RTL Script',
  },
  {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    sample: 'बेशक अल्लाह के ज़िक्र ही से दिलों को सुकून मिलता है।',
    badge: 'Devanagari',
  },
];

export default function LanguageSelector({
  selectedLanguage = 'en',
  onSelectLanguage,
  onBack,
}) {
  const handlePick = (langId) => {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (_) {}
    localStorage.setItem('aamaal_language', langId);
    if (onSelectLanguage) onSelectLanguage(langId);
  };

  return (
    <div className="space-y-3.5 fade-in">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary px-3.5 py-1.5 text-[11.5px] font-semibold"
        >
          ‹ Back to Settings
        </button>
      )}

      <div>
        <span className="badge-pill">Multilingual Support</span>
        <h3 className="font-serif text-[21px] font-semibold text-primary mt-1">
          🌐 Language &amp; Meaning Script
        </h3>
        <p className="text-[12px] text-secondary mt-0.5">
          Choose the default language for Dua meanings, Seerah lessons, and Heart Check-In reflections.
        </p>
      </div>

      <div className="space-y-2.5">
        {APP_LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.id;
          return (
            <button
              key={lang.id}
              type="button"
              onClick={() => handlePick(lang.id)}
              className={`w-full text-left rounded-[20px] p-4 border transition space-y-2 ${
                isSelected
                  ? 'bg-[#0F4C2B] text-white border-[#C99E4C] shadow-progress-card'
                  : 'bg-[#F3EFE2] text-primary border-white/90 shadow-soft-card'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h4
                    className={`font-serif text-[16.5px] font-semibold ${
                      isSelected ? 'text-white' : 'text-primary'
                    }`}
                  >
                    {lang.name} ({lang.nativeName})
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase ${
                      isSelected
                        ? 'bg-[#DFB75A] text-[#07361D]'
                        : 'bg-[#EAE8D7] text-secondary'
                    }`}
                  >
                    {lang.badge}
                  </span>
                </div>

                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold ${
                    isSelected
                      ? 'bg-[#DFB75A] text-[#07361D]'
                      : 'bg-[#EAE8D7] text-secondary'
                  }`}
                >
                  {isSelected ? '✓' : ''}
                </span>
              </div>

              <p
                dir={lang.id === 'ur' ? 'rtl' : 'ltr'}
                className={`text-[12px] leading-relaxed ${
                  isSelected ? 'text-[#F0D58C]' : 'text-secondary'
                }`}
              >
                &ldquo;{lang.sample}&rdquo;
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}