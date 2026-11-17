//Controls the Pure Arabic Calligraphy display across Duas, Aamaal, and Lessons: Arabic Font Size (20px to 36px), Line Spacing, Tajweed Harakat Clarity, and a live Quranic/Salawat preview card.

import React from 'react';

export default function ArabicDisplaySettings({
  settings = {
    arabicFontSize: 26,
    arabicLineHeight: 1.8,
    showAyahOrnament: true,
    highContrastGold: true,
  },
  onUpdateSettings,
  onBack,
}) {
  const updateField = (key, val) => {
    try {
      if (navigator.vibrate) navigator.vibrate(8);
    } catch (_) {}
    if (onUpdateSettings) {
      onUpdateSettings({
        ...settings,
        [key]: val,
      });
    }
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
        <span className="badge-pill">Sacred Script</span>
        <h3 className="font-serif text-[21px] font-semibold text-primary mt-1">
          🕋 Arabic Script &amp; Calligraphy
        </h3>
        <p className="text-[12px] text-secondary mt-0.5">
          Customize how Quranic verses, Durood Shareef, and Prophetic Duas appear.
        </p>
      </div>

      {/* Live Arabic Preview Card */}
      <div className="card-progress rounded-[22px] p-5 text-center border border-[#C99E4C]/50 shadow-progress-card">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[9.5px] font-bold uppercase tracking-wider mb-2">
          Live Calligraphy Preview
        </span>
        <p
          dir="rtl"
          style={{
            fontSize: `${settings.arabicFontSize || 26}px`,
            lineHeight: settings.arabicLineHeight || 1.8,
          }}
          className={`font-arabic transition-all ${
            settings.highContrastGold ? 'text-[#F0D58C]' : 'text-white'
          }`}
        >
          اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ
          {settings.showAyahOrnament ? ' ﴿١﴾' : ''}
        </p>
      </div>

      {/* Controls Card */}
      <div className="card rounded-[20px] p-4 space-y-4">
        {/* Font Size Slider */}
        <div>
          <div className="flex items-center justify-between text-[12px] font-bold text-primary mb-1">
            <span>Arabic Font Size</span>
            <span className="text-[#0D4A2E]">{settings.arabicFontSize || 26}px</span>
          </div>
          <input
            type="range"
            min="20"
            max="36"
            step="2"
            value={settings.arabicFontSize || 26}
            onChange={(e) =>
              updateField('arabicFontSize', Number(e.target.value))
            }
            className="w-full accent-[#0D4A2E]"
          />
          <div className="flex justify-between text-[10px] text-secondary mt-0.5">
            <span>Compact (20px)</span>
            <span>Standard (26px)</span>
            <span>Large (36px)</span>
          </div>
        </div>

        {/* Line Spacing Slider */}
        <div>
          <div className="flex items-center justify-between text-[12px] font-bold text-primary mb-1">
            <span>Vertical Line Spacing (Harakat Room)</span>
            <span className="text-[#0D4A2E]">{settings.arabicLineHeight || 1.8}x</span>
          </div>
          <input
            type="range"
            min="1.5"
            max="2.2"
            step="0.1"
            value={settings.arabicLineHeight || 1.8}
            onChange={(e) =>
              updateField('arabicLineHeight', Number(e.target.value))
            }
            className="w-full accent-[#0D4A2E]"
          />
        </div>

        {/* Toggles */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between rounded-xl bg-[#EAE8D7] px-3.5 py-2.5">
            <div>
              <h4 className="text-[12.5px] font-semibold text-primary">
                Gold Illuminated Script
              </h4>
              <p className="text-[10.5px] text-secondary">
                Render Arabic in warm gold (#F0D58C) on emerald cards
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                updateField('highContrastGold', !settings.highContrastGold)
              }
              className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
                settings.highContrastGold
                  ? 'bg-[#0D4A2E] text-white'
                  : 'bg-[#F5F2E8] text-secondary'
              }`}
            >
              {settings.highContrastGold ? 'Gold ✓' : 'White'}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-[#EAE8D7] px-3.5 py-2.5">
            <div>
              <h4 className="text-[12.5px] font-semibold text-primary">
                End-of-Verse Medallion Ornament
              </h4>
              <p className="text-[10.5px] text-secondary">
                Display traditional ﴿١﴾ symbol after verses
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                updateField('showAyahOrnament', !settings.showAyahOrnament)
              }
              className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
                settings.showAyahOrnament
                  ? 'bg-[#0D4A2E] text-white'
                  : 'bg-[#F5F2E8] text-secondary'
              }`}
            >
              {settings.showAyahOrnament ? 'On ✓' : 'Off'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}