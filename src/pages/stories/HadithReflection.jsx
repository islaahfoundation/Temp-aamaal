//Renders a Prophetic Hadith reflection card with Pure Arabic Script, 4-language meaning selector (English, Roman Urdu, Urdu, Hindi), and practical Sunnah takeaway.

import React, { useState } from 'react';

const HADITH_GEMS = [
  {
    id: 'hadith_consistent_deeds',
    source: 'Sahih Al-Bukhari 6464',
    theme: 'Consistency Over Quantity',
    arabic: 'أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْقَلَّ',
    en: '"The most beloved of deeds to Allah are those that are most consistent, even if they are small."',
    romanUrdu:
      '"Allah Ta’ala ko sab se zyada mehboob woh aamaal hain jo hamesha pabandi ke saath kiye jayein, chahe woh thode hi kyun na hon."',
    ur: 'اللہ تعالیٰ کے نزدیک سب سے محبوب عمل وہ ہے جو ہمیشہ کیا جائے خواہ وہ تھوڑا ہی ہو۔',
    hi: 'अल्लाह तआला के नज़दीक सबसे प्यारा अमल वह है जो हमेशा पाबंदी से किया जाए, चाहे वह थोड़ा ही हो।',
    insight:
      'Small daily anchors—like 313 Durood Shareef, Surah Mulk before sleep, and 100 Istighfar—carry immense weight when practiced every single day.',
  },
  {
    id: 'hadith_friday_salawat',
    source: 'Sunan Abi Dawud 1047',
    theme: 'Abundant Salawat Presented to the Prophet ﷺ',
    arabic: 'فَأَكْثِرُوا عَلَيَّ مِنَ الصَّلَاةِ فِيهِ فَإِنَّ صَلَاتَكُمْ مَعْرُوضَةٌ عَلَيَّ',
    en: '"So send abundant blessings upon me on Friday and Thursday night, for indeed your blessings are presented to me."',
    romanUrdu:
      '"Pas Jumu’ah ke din aur Jumerat ki raat mujh par kasrat se Durood bheja karo, beshak tumhara Durood mujh par pesh kiya jata hai."',
    ur: 'پس جمعہ کے دن مجھ پر کثرت سے درود بھیجا کرو کیونکہ تمہارا درود مجھ پر پیش کیا جاتا ہے۔',
    hi: 'पस जुमुआ के दिन मुझ पर कसरत से दुरूद भेजा करो क्योंकि तुम्हारा दुरूद मुझ पर पेश किया जाता है।',
    insight:
      'Every Salawat you recite is carried by noble angels and presented directly to the Messenger of Allah ﷺ along with your name.',
  },
];

const LANG_OPTIONS = [
  { id: 'en', label: 'EN' },
  { id: 'romanUrdu', label: 'Roman Urdu' },
  { id: 'ur', label: 'اردو' },
  { id: 'hi', label: 'हिन्दी' },
];

export default function HadithReflection({ onOpenFullReflection }) {
  const [idx, setIdx] = useState(0);
  const [lang, setLang] = useState('en');

  const current = HADITH_GEMS[idx % HADITH_GEMS.length];

  return (
    <div className="card rounded-[22px] p-4 space-y-3 border border-[#D5D2BE]">
      <div className="flex items-center justify-between">
        <div>
          <span className="badge-pill">Prophetic Wisdom</span>
          <h3 className="font-serif text-[17px] font-semibold text-primary mt-1">
            🌟 {current.theme}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setIdx((prev) => prev + 1)}
          className="px-2.5 py-1 rounded-full bg-[#EAE8D7] text-primary text-[10.5px] font-bold border border-[#D5D2BE]"
        >
          Next Hadith ↻
        </button>
      </div>

      {/* Pure Arabic Hadith */}
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
            {current.source}
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

      <div className="flex items-center justify-between gap-2 text-[11.5px] text-secondary pt-0.5">
        <p className="line-clamp-2 flex-1">{current.insight}</p>
        {onOpenFullReflection && (
          <button
            type="button"
            onClick={() =>
              onOpenFullReflection({
                type: 'Prophetic Hadith Reflection',
                title: current.theme,
                subtitle: current.source,
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
            Full Note ›
          </button>
        )}
      </div>
    </div>
  );
}