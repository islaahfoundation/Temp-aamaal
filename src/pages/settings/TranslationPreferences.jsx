//Configures how meaning translations are displayed underneath Arabic Duas (e.g., Show Primary Translation, Show Dual English + Roman Urdu simultaneously, Show Hadith Source Reference, and Show Virtues/Benefits).

import React from 'react';

export default function TranslationPreferences({
  settings = {
    showTranslation: true,
    showDualRomanUrdu: true,
    showReferenceSource: true,
    showDuaBenefits: true,
  },
  onUpdateSettings,
  onBack,
}) {
  const toggleKey = (key) => {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (_) {}
    if (onUpdateSettings) {
      onUpdateSettings({
        ...settings,
        [key]: !settings[key],
      });
    }
  };

  const ITEMS = [
    {
      key: 'showTranslation',
      title: 'Display Meaning & Translation',
      desc: 'Show the translated meaning underneath every Arabic Dua and Ayah',
    },
    {
      key: 'showDualRomanUrdu',
      title: 'Dual English + Roman Urdu View',
      desc: 'When reading in English, also display the Roman Urdu meaning below it',
    },
    {
      key: 'showDuaBenefits',
      title: 'Show Prophetic Virtues & Benefits',
      desc: 'Include the Hadith context and spiritual benefits card for each Dua',
    },
    {
      key: 'showReferenceSource',
      title: 'Show Authentic Source Citations',
      desc: 'Display Sahih Bukhari, Muslim, Tirmidhi, or Surah references',
    },
  ];

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
        <span className="badge-pill">Meaning &amp; Context</span>
        <h3 className="font-serif text-[21px] font-semibold text-primary mt-1">
          📖 Translation Preferences
        </h3>
        <p className="text-[12px] text-secondary mt-0.5">
          Control how meanings, secondary languages, and Hadith citations appear.
        </p>
      </div>

      <div className="card rounded-[20px] p-4 space-y-2.5">
        {ITEMS.map((item) => {
          const isOn = Boolean(settings[item.key]);
          return (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-2xl bg-[#F5F2E8] p-3 border border-[#DCD8C6] gap-3"
            >
              <div>
                <h4 className="font-serif text-[14.5px] font-semibold text-primary">
                  {item.title}
                </h4>
                <p className="text-[11px] text-secondary mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleKey(item.key)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold shrink-0 transition ${
                  isOn
                    ? 'bg-[#0D4A2E] text-[#F0D58C]'
                    : 'bg-[#EAE8D7] text-secondary'
                }`}
              >
                {isOn ? 'On ✓' : 'Off'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}