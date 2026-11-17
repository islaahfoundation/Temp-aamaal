//Combines ThemeSelector and visual ornament toggles (Mosque header illustration, Gold mandala watermarks, Country flags on leaderboards).

import React from 'react';
import ThemeSelector from './ThemeSelector';

export default function Appearance({
  settings = {
    theme: 'madinah-cream',
    showMandalaWatermarks: true,
    showCountryFlags: true,
  },
  onUpdateSettings,
  onBack,
}) {
  const toggleVisual = (key) => {
    if (onUpdateSettings) {
      onUpdateSettings({
        ...settings,
        [key]: !settings[key],
      });
    }
  };

  return (
    <div className="space-y-4 fade-in">
      <ThemeSelector
        selectedTheme={settings.theme || 'madinah-cream'}
        onSelectTheme={(themeId) =>
          onUpdateSettings && onUpdateSettings({ ...settings, theme: themeId })
        }
        onBack={onBack}
      />

      <div className="card rounded-[20px] p-4 space-y-2.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
          Ornamental Details
        </span>

        <div className="flex items-center justify-between rounded-xl bg-[#F5F2E8] p-3 border border-[#DCD8C6]">
          <div>
            <h4 className="text-[13px] font-semibold text-primary">
              Gold Floral Mandala Watermarks
            </h4>
            <p className="text-[11px] text-secondary">
              Show subtle Islamic geometric art on Featured &amp; Progress cards
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleVisual('showMandalaWatermarks')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
              settings.showMandalaWatermarks !== false
                ? 'bg-[#0D4A2E] text-[#F0D58C]'
                : 'bg-[#EAE8D7] text-secondary'
            }`}
          >
            {settings.showMandalaWatermarks !== false ? 'On ✓' : 'Off'}
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#F5F2E8] p-3 border border-[#DCD8C6]">
          <div>
            <h4 className="text-[13px] font-semibold text-primary">
              Country Flags on Circle Leaderboard
            </h4>
            <p className="text-[11px] text-secondary">
              Display member country flags next to names in Weekly/Monthly summaries
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleVisual('showCountryFlags')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
              settings.showCountryFlags !== false
                ? 'bg-[#0D4A2E] text-[#F0D58C]'
                : 'bg-[#EAE8D7] text-secondary'
            }`}
          >
            {settings.showCountryFlags !== false ? 'On ✓' : 'Off'}
          </button>
        </div>
      </div>
    </div>
  );
}