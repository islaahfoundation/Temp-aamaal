//Explains and enforces the Pure Arabic Script Policy (keeping Romanized Arabic pronunciation off so reciters read directly from the authentic Arabic script with proper Tajweed and audio support, while still offering full Roman Urdu meaning translation).

import React from 'react';

export default function TransliterationPreferences({
  settings = {
    disableRomanTransliteration: true,
    useAudioGuideInstead: true,
  },
  onUpdateSettings,
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
        <span className="badge-pill">Tajweed &amp; Script Purity</span>
        <h3 className="font-serif text-[21px] font-semibold text-primary mt-1">
          ✨ Pure Arabic Script Policy
        </h3>
        <p className="text-[12px] text-secondary mt-0.5">
          Why Aamaal Circle uses pure Arabic calligraphy + meaning translations instead of Roman phonetic transliteration.
        </p>
      </div>

      <div className="card-progress rounded-[22px] p-4 border border-[#C99E4C]/45 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[9.5px] font-bold uppercase tracking-wider">
            Active Standard
          </span>
          <span className="text-[11px] font-bold text-[#F0D58C]">
            ✓ Pure Arabic + Translations
          </span>
        </div>

        <h4 className="font-serif text-[17px] font-semibold text-white">
          Authentic Recitation Without Roman Transliteration
        </h4>

        <p className="text-[12px] text-white/85 leading-relaxed">
          English letters cannot accurately represent Arabic letters like{' '}
          <span className="font-arabic text-[#F0D58C] text-[15px]">ع ، ح ، ص ، ض ، ط ، ظ ، ق</span>.
          To protect the beauty and accuracy of your recitation, all Duas and Aamaal display pure vocalized Arabic script alongside clear translations in English, Roman Urdu, Urdu, and Hindi.
        </p>
      </div>

      <div className="card rounded-[20px] p-4 space-y-2.5">
        <div className="flex items-center justify-between rounded-2xl bg-[#F5F2E8] p-3 border border-[#DCD8C6]">
          <div>
            <h4 className="font-serif text-[14.5px] font-semibold text-primary">
              Pure Arabic Script Only (No Phonetic Latin)
            </h4>
            <p className="text-[11px] text-secondary mt-0.5">
              Keep Roman Arabic transliteration hidden across all Duas &amp; Aamaal
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#0D4A2E] text-[#F0D58C] text-[10.5px] font-bold shrink-0">
            Locked On ✓
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-[#F5F2E8] p-3 border border-[#DCD8C6]">
          <div>
            <h4 className="font-serif text-[14.5px] font-semibold text-primary">
              Built-in Arabic Audio Recitation Helper
            </h4>
            <p className="text-[11px] text-secondary mt-0.5">
              Enable one-tap Arabic audio playback in Duas to assist pronunciation
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdateSettings &&
              onUpdateSettings({
                ...settings,
                useAudioGuideInstead: !settings.useAudioGuideInstead,
              })
            }
            className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 ${
              settings.useAudioGuideInstead
                ? 'bg-[#0D4A2E] text-[#F0D58C]'
                : 'bg-[#EAE8D7] text-secondary'
            }`}
          >
            {settings.useAudioGuideInstead ? 'Enabled ✓' : 'Off'}
          </button>
        </div>
      </div>
    </div>
  );
}