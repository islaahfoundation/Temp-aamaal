//Allows users to customize their Dua reading experience: Arabic Font Size, Translation Font Size, Preferred Translation Language (English, Roman Urdu, Urdu, Hindi), and toggling Virtues/Benefits visibility.

import React from 'react';

const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'ur-roman', label: 'Roman Urdu' },
  { id: 'ur', label: 'اردو (Urdu)' },
  { id: 'hi', label: 'हिन्दी (Hindi)' },
];

export default function DuaPreferences({
  preferences = {
    arabicFontSize: 26,
    translationFontSize: 13.5,
    language: 'en',
    showBenefits: true,
    showAudio: true,
  },
  onUpdatePreferences,
  onClose,
}) {
  const updateField = (key, value) => {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (_) {}
    if (key === 'language') {
      localStorage.setItem('aamaal_language', value);
    }
    if (onUpdatePreferences) {
      onUpdatePreferences({ ...preferences, [key]: value });
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-[24px] p-4 space-y-3.5 bg-[#F5F2E8] border-2 border-[#C99E4C] shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="badge-pill">Reader Display</span>
            <h3 className="font-serif text-[18px] font-semibold text-primary mt-1">
              Aa Dua Reading Preferences
            </h3>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#EAE8D7] flex items-center justify-center text-primary font-bold text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Preferred Translation Language */}
        <div>
          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1.5">
            Default Translation Language
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {LANGUAGES.map((lang) => {
              const active = preferences.language === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => updateField('language', lang.id)}
                  className={`py-2 px-3 rounded-xl text-[12px] font-semibold border transition ${
                    active
                      ? 'bg-[#0D4A2E] text-white border-[#0D4A2E]'
                      : 'bg-[#FFFDF9] text-primary border-[#DCD8C6]'
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Arabic Script Font Size Slider */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-primary mb-1">
            <span>Arabic Calligraphy Size</span>
            <span>{preferences.arabicFontSize}px</span>
          </div>
          <input
            type="range"
            min="20"
            max="36"
            step="2"
            value={preferences.arabicFontSize}
            onChange={(e) => updateField('arabicFontSize', Number(e.target.value))}
            className="w-full accent-[#0D4A2E]"
          />
        </div>

        {/* Translation Font Size Slider */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-primary mb-1">
            <span>Translation Text Size</span>
            <span>{preferences.translationFontSize}px</span>
          </div>
          <input
            type="range"
            min="12"
            max="18"
            step="0.5"
            value={preferences.translationFontSize}
            onChange={(e) =>
              updateField('translationFontSize', Number(e.target.value))
            }
            className="w-full accent-[#0D4A2E]"
          />
        </div>

        {/* Display Toggles */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => updateField('showBenefits', !preferences.showBenefits)}
            className={`py-2 px-3 rounded-xl text-[11.5px] font-semibold border transition ${
              preferences.showBenefits
                ? 'bg-[#DCE3C8] text-[#0D4A2E] border-[#0D4A2E]/30'
                : 'bg-[#FFFDF9] text-secondary border-[#DCD8C6]'
            }`}
          >
            {preferences.showBenefits ? '✓ Virtues Shown' : 'Virtues Hidden'}
          </button>

          <button
            type="button"
            onClick={() => updateField('showAudio', !preferences.showAudio)}
            className={`py-2 px-3 rounded-xl text-[11.5px] font-semibold border transition ${
              preferences.showAudio
                ? 'bg-[#DCE3C8] text-[#0D4A2E] border-[#0D4A2E]/30'
                : 'bg-[#FFFDF9] text-secondary border-[#DCD8C6]'
            }`}
          >
            {preferences.showAudio ? '✓ Audio Player On' : 'Audio Player Off'}
          </button>
        </div>
      </div>
    </div>
  );
}