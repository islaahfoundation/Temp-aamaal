//Allows customizing the lesson reader experience: Preferred Translation Language (English, Roman Urdu, Urdu, Hindi), Lesson Body Font Size, Arabic Script Font Size, and Show Reflection Prompts.

import React from 'react';

const LANGUAGE_OPTIONS = [
  { id: 'en', label: 'English' },
  { id: 'ur-roman', label: 'Roman Urdu' },
  { id: 'ur', label: 'اردو (Urdu)' },
  { id: 'hi', label: 'हिन्दी (Hindi)' },
];

export default function ReadingPreferences({
  preferences = {
    language: 'en',
    bodyFontSize: 13.5,
    arabicFontSize: 24,
    showTakeaways: true,
  },
  onUpdatePreferences,
  onClose,
}) {
  const handleChange = (key, value) => {
    try {
      if (navigator.vibrate) navigator.vibrate(8);
    } catch (_) {}
    if (key === 'language') {
      localStorage.setItem('aamaal_language', value);
    }
    if (onUpdatePreferences) {
      onUpdatePreferences({
        ...preferences,
        [key]: value,
      });
    }
  };

  return (
    <div className="card rounded-[20px] p-4 mb-4 bg-[#EAE8D7] border border-[#0D4A2E]/25 space-y-3.5 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <span className="badge-pill">Reader Customization</span>
          <h3 className="font-serif text-[17.5px] font-semibold text-primary mt-1">
            ⚙️ Reading Preferences
          </h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F5F2E8] flex items-center justify-center text-primary font-bold text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Translation Language */}
      <div>
        <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1.5">
          Translation Language for Verses &amp; Hadith
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {LANGUAGE_OPTIONS.map((lang) => {
            const isSelected = preferences.language === lang.id;
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => handleChange('language', lang.id)}
                className={`py-2 px-3 rounded-xl text-[12px] font-semibold border transition ${
                  isSelected
                    ? 'bg-[#0D4A2E] text-white border-[#0D4A2E]'
                    : 'bg-[#F5F2E8] text-primary border-[#DCD8C6]'
                }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Arabic Text Size */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-bold text-primary mb-1">
          <span>Arabic Calligraphy Size</span>
          <span>{preferences.arabicFontSize}px</span>
        </div>
        <input
          type="range"
          min="20"
          max="34"
          step="2"
          value={preferences.arabicFontSize}
          onChange={(e) =>
            handleChange('arabicFontSize', Number(e.target.value))
          }
          className="w-full accent-[#0D4A2E]"
        />
      </div>

      {/* Lesson Text Size */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-bold text-primary mb-1">
          <span>Lesson Article Font Size</span>
          <span>{preferences.bodyFontSize}px</span>
        </div>
        <input
          type="range"
          min="12"
          max="17"
          step="0.5"
          value={preferences.bodyFontSize}
          onChange={(e) =>
            handleChange('bodyFontSize', Number(e.target.value))
          }
          className="w-full accent-[#0D4A2E]"
        />
      </div>

      {/* Toggle Actionable Takeaways */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() =>
            handleChange('showTakeaways', !preferences.showTakeaways)
          }
          className={`w-full py-2 px-3 rounded-xl text-[12px] font-semibold border transition ${
            preferences.showTakeaways
              ? 'bg-[#DCE3C8] text-[#0D4A2E] border-[#0D4A2E]/30'
              : 'bg-[#F5F2E8] text-secondary border-[#DCD8C6]'
          }`}
        >
          {preferences.showTakeaways
            ? '✓ Practical Sunnah Action Box Enabled'
            : 'Practical Sunnah Action Box Hidden'}
        </button>
      </div>
    </div>
  );
}