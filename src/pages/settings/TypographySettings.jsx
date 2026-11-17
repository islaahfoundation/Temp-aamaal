//Controls the app's Heading Font (Cormorant Garamond), Body & Translation Font Size (12px to 16.5px), and Compact vs Comfortable Card Spacing.

import React from 'react';

export default function TypographySettings({
  settings = {
    translationFontSize: 13.5,
    cardDensity: 'compact',
    serifHeadings: true,
  },
  onUpdateSettings,
  onBack,
}) {
  const updateKey = (key, val) => {
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
        <span className="badge-pill">Readability</span>
        <h3 className="font-serif text-[21px] font-semibold text-primary mt-1">
          🔤 Typography &amp; Text Size
        </h3>
        <p className="text-[12px] text-secondary mt-0.5">
          Adjust body text scaling and layout density across screens.
        </p>
      </div>

      {/* Live Preview */}
      <div className="card rounded-[20px] p-4 bg-[#F3EFE2] border border-[#D5D2BE] space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
          Typography Sample
        </span>
        <h4 className="font-serif text-[18px] font-semibold text-primary">
          Consistency in Daily Remembrance
        </h4>
        <p
          style={{ fontSize: `${settings.translationFontSize || 13.5}px` }}
          className="text-secondary leading-relaxed"
        >
          &ldquo;The most beloved of deeds to Allah are those that are most consistent, even if they are small.&rdquo; (Sahih Al-Bukhari)
        </p>
      </div>

      <div className="card rounded-[20px] p-4 space-y-4">
        <div>
          <div className="flex items-center justify-between text-[12px] font-bold text-primary mb-1">
            <span>Translation &amp; Article Font Size</span>
            <span className="text-[#0D4A2E]">
              {settings.translationFontSize || 13.5}px
            </span>
          </div>
          <input
            type="range"
            min="12"
            max="16.5"
            step="0.5"
            value={settings.translationFontSize || 13.5}
            onChange={(e) =>
              updateKey('translationFontSize', Number(e.target.value))
            }
            className="w-full accent-[#0D4A2E]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-secondary mb-1.5">
            Layout Density
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'compact', label: 'Compact (Mobile Fit)' },
              { id: 'comfortable', label: 'Spacious Reading' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateKey('cardDensity', opt.id)}
                className={`py-2 px-3 rounded-xl text-[12px] font-semibold border transition ${
                  (settings.cardDensity || 'compact') === opt.id
                    ? 'bg-[#0D4A2E] text-white border-[#0D4A2E]'
                    : 'bg-[#F5F2E8] text-primary border-[#DCD8C6]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}