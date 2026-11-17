//Allows choosing between the signature Madinah Cream & Deep Emerald palette, Warm Parchment & Gold, or Masjid Nabawi Deep Emerald Accent mode.

import React from 'react';

const THEMES = [
  {
    id: 'madinah-cream',
    name: 'Madinah Cream & Emerald (Original)',
    desc: 'Warm cream (#F5F2E8) background with deep emerald (#0D4A2E) & gold accents',
    bgPreview: '#F5F2E8',
    cardPreview: '#0F4C2B',
    accentPreview: '#C99E4C',
  },
  {
    id: 'desert-parchment',
    name: 'Makkah Desert Parchment',
    desc: 'Soft sand-gold tones inspired by classic illuminated manuscripts',
    bgPreview: '#F3EFE2',
    cardPreview: '#165534',
    accentPreview: '#DFB75A',
  },
  {
    id: 'emerald-sanctuary',
    name: 'Emerald Sanctuary Contrast',
    desc: 'Crisp ivory cards with rich forest emerald borders and gold badges',
    bgPreview: '#EAE8D7',
    cardPreview: '#07361D',
    accentPreview: '#F0D58C',
  },
];

export default function ThemeSelector({
  selectedTheme = 'madinah-cream',
  onSelectTheme,
  onBack,
}) {
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
        <span className="badge-pill">Color Palette</span>
        <h3 className="font-serif text-[21px] font-semibold text-primary mt-1">
          🎨 Theme Selector
        </h3>
        <p className="text-[12px] text-secondary mt-0.5">
          Select your preferred spiritual color harmony.
        </p>
      </div>

      <div className="space-y-2.5">
        {THEMES.map((t) => {
          const active = selectedTheme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                try {
                  if (navigator.vibrate) navigator.vibrate(10);
                } catch (_) {}
                if (onSelectTheme) onSelectTheme(t.id);
              }}
              className={`w-full text-left rounded-[20px] p-4 border transition flex items-center justify-between gap-3 ${
                active
                  ? 'bg-[#0F4C2B] text-white border-[#C99E4C] shadow-progress-card'
                  : 'bg-[#F3EFE2] text-primary border-white/90 shadow-soft-card'
              }`}
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4
                    className={`font-serif text-[16px] font-semibold ${
                      active ? 'text-white' : 'text-primary'
                    }`}
                  >
                    {t.name}
                  </h4>
                </div>
                <p
                  className={`text-[11.5px] leading-snug ${
                    active ? 'text-white/80' : 'text-secondary'
                  }`}
                >
                  {t.desc}
                </p>
              </div>

              {/* Color Swatch Trio */}
              <div className="flex items-center -space-x-1.5 shrink-0">
                <span
                  className="w-6 h-6 rounded-full border border-black/15"
                  style={{ backgroundColor: t.bgPreview }}
                />
                <span
                  className="w-6 h-6 rounded-full border border-white/40"
                  style={{ backgroundColor: t.cardPreview }}
                />
                <span
                  className="w-6 h-6 rounded-full border border-black/15"
                  style={{ backgroundColor: t.accentPreview }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}