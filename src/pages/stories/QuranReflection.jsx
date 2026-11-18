//Renders a daily Quranic Ayah reflection card with Pure Arabic Calligraphy and a 4-language meaning switcher (English, Roman Urdu, Urdu, Hindi—zero Roman Arabic transliteration).

import React, { useState } from 'react';

const QURAN_REFLECTIONS = [
  {
    id: 'qr_ibrahim_prayer',
    surah: 'Surah Ibrahim 14:40',
    theme: 'Family & Prayer Steadfastness',
    arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
    en: '"My Lord, make me an establisher of prayer, and many from my descendants. Our Lord, and accept my supplication."',
    romanUrdu:
      '"Aye mere Rab! Mujhe aur meri aulad ko Namaz qaim karne wala bana de. Aye hamare Rab! Aur meri dua qubool farma."',
    ur: 'اے میرے رب! مجھے نماز قائم کرنے والا بنا اور میری اولاد میں سے بھی، اے ہمارے رب اور میری دعا قبول فرما۔',
    hi: 'ऐ मेरे रब! मुझे और मेरी औलाद को नमाज़ क़ायम करने वाला बना दे, ऐ हमारे रब और मेरी दुआ क़ुबूल फ़रमा।',
    insight:
      'Prophet Ibrahim (AS) never prayed only for his own spirituality—he included his children and future generations in every supplication.',
  },
  {
    id: 'qr_hearts_peace',
    surah: 'Surah Ar-Ra’d 13:28',
    theme: 'Tranquility in Remembrance',
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    en: '"Unquestionably, by the remembrance of Allah do hearts find rest."',
    romanUrdu:
      '"Khabardar! Beshak Allah hi ke zikr aur yaad se dilon ko sukoon aur itminan milta hai."',
    ur: 'خبردار! اللہ کی یاد ہی سے دل تسلی پاتے ہیں۔',
    hi: 'ख़बरदार! अल्लाह की याद ही से दिलों को सुकून और इत्मीनान मिलता है।',
    insight:
      'When your heart feels scattered by worldly noise, returning to your daily Dhikr and Salawat anchors the soul immediately.',
  },
];

const LANG_OPTIONS = [
  { id: 'en', label: 'EN' },
  { id: 'romanUrdu', label: 'Roman Urdu' },
  { id: 'ur', label: 'اردو' },
  { id: 'hi', label: 'हिन्दी' },
];

export default function QuranReflection({ onOpenFullReflection }) {
  const [idx, setIdx] = useState(0);
  const [lang, setLang] = useState('en');

  const current = QURAN_REFLECTIONS[idx % QURAN_REFLECTIONS.length];

  return (
    <div className="card rounded-[22px] p-4 space-y-3 border border-[#D5D2BE]">
      <div className="flex items-center justify-between">
        <div>
          <span className="badge-pill">Quranic Tadabbur</span>
          <h3 className="font-serif text-[17px] font-semibold text-primary mt-1">
            📖 {current.surah} • {current.theme}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setIdx((prev) => prev + 1)}
          className="px-2.5 py-1 rounded-full bg-[#EAE8D7] text-primary text-[10.5px] font-bold border border-[#D5D2BE]"
        >
          Next Ayah ↻
        </button>
      </div>

      {/* Pure Arabic Calligraphy */}
      <div className="rounded-2xl bg-[#0F4C2B] p-3.5 text-center border border-[#C99E4C]/45">
        <p
          dir="rtl"
          className="font-arabic text-[22px] leading-[1.75] text-[#F0D58C]"
        >
          {current.arabic}
        </p>
      </div>

      {/* Meaning Switcher */}
      <div className="rounded-xl bg-white/85 p-3 border border-[#E2DFCE] space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-secondary">
            Translation
          </span>
          <div className="inline-flex rounded-full p-0.5 bg-[#EAE8D7] border border-[#D5D2BE]">
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLang(opt.id)}
                className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold transition ${
                  lang === opt.id
                    ? 'bg-[#0D4A2E] text-white'
                    : 'text-primary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <p
          dir={lang === 'ur' ? 'rtl' : 'ltr'}
          className="text-[12.5px] text-[#1A3826] font-medium leading-relaxed"
        >
          {current[lang] || current.en}
        </p>
      </div>

      {/* Heart Reflection */}
      <div className="flex items-center justify-between gap-2 text-[11.5px] text-secondary pt-0.5">
        <p className="line-clamp-2 flex-1">{current.insight}</p>
        {onOpenFullReflection && (
          <button
            type="button"
            onClick={() =>
              onOpenFullReflection({
                type: 'Quranic Reflection',
                title: current.surah,
                subtitle: current.theme,
                arabic: current.arabic,
                en: current.en,
                romanUrdu: current.romanUrdu,
                ur: current.ur,
                hi: current.hi,
                insight: current.insight,
              })
            }
            className="font-bold text-[#0D4A2E] underline shrink-0"
          >
            Reflect ›
          </button>
        )}
      </div>
    </div>
  );
}