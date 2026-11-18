import React from 'react';

export const DEFAULT_AAMAAL_LIST = [
  {
    id: 'durood_313',
    name: 'Durood Shareef',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    translation: '"O Allah, send Your grace, honour and mercy upon Muhammad ﷺ and upon the family of Muhammad ﷺ."',
    romanUrdu: '"Aye Allah! Rehmat aur barakat naazil farma Muhammad ﷺ par aur Aap ﷺ ki Aal par."',
    target: 313,
    order: 1,
    active: true,
  },
  {
    id: 'surah_mulk',
    name: 'Surah Mulk',
    arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    translation: '"Blessed is He in whose hand is dominion, and He is over all things competent." (Quran 67:1)',
    romanUrdu: '"Badi barkat wala hai Woh jiske haath mein baadshahi hai, aur Woh har cheez par qaadir hai."',
    target: 1,
    order: 2,
    active: true,
  },
  {
    id: 'istighfar_100',
    name: 'Istighfar',
    arabic: 'أَسْتَغْفِرُ اللَّهَ رَبِّي مِنْ كُلِّ ذَنْبٍ وَأَتُوبُ إِلَيْهِ',
    translation: '"I seek forgiveness from Allah, my Lord, from every sin, and I turn to Him in repentance."',
    romanUrdu: '"Main Allah se apne tamam gunahon ki maafi mangta hoon aur Usi ki taraf rujoo karta hoon."',
    target: 100,
    order: 3,
    active: true,
  },
];

export default function AamaalCategories({
  aamaalList = DEFAULT_AAMAAL_LIST,
  activeAamaal,
  onSelectAamaal,
}) {
  const currentId = activeAamaal?.id || aamaalList[0]?.id;

  const handleSelect = (item) => {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (_) {}
    if (onSelectAamaal) onSelectAamaal(item);
  };

  return (
    <div className="w-full">
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {aamaalList.map((item) => {
          const isActive = item.id === currentId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className={`px-4 py-2 rounded-full text-[12.5px] font-semibold whitespace-nowrap transition border ${
                isActive
                  ? 'bg-[#0D4A2E] text-white border-[#C99E4C]/50 shadow-sm'
                  : 'bg-[#EAE8D7] text-[#0D4A2E] border-white/80 hover:bg-[#DFDEC9]'
              }`}
            >
              <span>{item.name}</span>
              <span
                className={`ml-1.5 text-[10.5px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-[#DFB75A] text-[#07361D] font-bold'
                    : 'bg-[#F5F2E8] text-[#4A5D50]'
                }`}
              >
                {item.target}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}