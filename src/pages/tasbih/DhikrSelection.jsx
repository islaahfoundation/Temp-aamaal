//Implements the Allahu Akbar dropdown menu containing 4 predefined authentic Dhikrs (with pure Arabic script, English/Roman Urdu/Urdu/Hindi translations, and default targets) plus the "+ Add Custom Dhikr" button.

// src/pages/tasbih/DhikrSelection.jsx
// src/pages/tasbih/DhikrSelection.jsx
import React from 'react';

export const PREDEFINED_DHIKRS = [
  {
    id: 'allahu_akbar',
    title: 'Allahu Akbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    translation: 'Allah is the Greatest',
    romanUrdu: 'Allah Sabse Bada Hai',
    defaultTarget: 34,
  },
  {
    id: 'subhanallah',
    title: 'SubhanAllah',
    arabic: 'سُبْحَانَ اللَّهِ',
    translation: 'Glory be to Allah',
    romanUrdu: 'Allah Paak hai',
    defaultTarget: 33,
  },
  {
    id: 'alhamdulillah',
    title: 'Alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    translation: 'All praise is due to Allah',
    romanUrdu: 'Sab tareefein Allah ke liye hain',
    defaultTarget: 33,
  },
  {
    id: 'astaghfirullah',
    title: 'Astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    translation: 'I seek forgiveness from Allah',
    romanUrdu: 'Main Allah se maafi chahta hoon',
    defaultTarget: 100,
  },
  {
    id: 'durood_shareef',
    title: 'Durood Shareef',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    translation: 'O Allah, send blessings upon Muhammad ﷺ',
    romanUrdu: 'Aye Allah! Muhammad ﷺ par rehmat naazil farma',
    defaultTarget: 313,
  },
];

export default function DhikrSelection({
  currentDhikrId = 'allahu_akbar',
  customDhikrs = [],
  onSelectDhikr,
  onOpenCustomModal,
  onClose,
}) {
  const allDhikrs = [...PREDEFINED_DHIKRS, ...(customDhikrs || [])];

  return (
    <div className="absolute left-5 right-5 top-20 z-50 rounded-[22px] bg-[#F5F2E8] border border-[#C99E4C] shadow-2xl p-4 space-y-2.5 fade-in">
      <div className="flex items-center justify-between pb-1 border-b border-[#DCD8C6]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#135332]">
          Select Dhikr &amp; Tasbih
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-[#EAE8D7] text-primary font-bold text-xs flex items-center justify-center"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-1.5 max-h-64 overflow-y-auto no-scrollbar">
        {allDhikrs.map((item) => {
          const isSelected = item.id === currentDhikrId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                try {
                  if (navigator.vibrate) navigator.vibrate(10);
                } catch (_) {}
                if (onSelectDhikr) onSelectDhikr(item);
                if (onClose) onClose();
              }}
              className={`w-full text-left rounded-xl p-3 border transition flex items-center justify-between gap-2 ${
                isSelected
                  ? 'bg-[#0D4A2E] border-[#C99E4C] shadow-sm'
                  : 'bg-[#FFFDF9] border-[#DCD8C6] hover:bg-[#EAE8D7]'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h4
                    className="font-serif text-[15px] font-semibold truncate"
                    style={{ color: isSelected ? '#FFFFFF' : '#0D4A2E' }}
                  >
                    {item.title}
                  </h4>
                  {isSelected && (
                    <span className="text-[9.5px] font-bold text-[#F0D58C] shrink-0">
                      ✓ Active
                    </span>
                  )}
                </div>
                <p
                  className="text-[11px] truncate"
                  style={{
                    color: isSelected
                      ? 'rgba(255, 255, 255, 0.85)'
                      : '#4E5953',
                  }}
                >
                  {item.translation}
                </p>
              </div>

              <span
                dir="rtl"
                className="font-arabic text-[18px] shrink-0"
                style={{ color: isSelected ? '#F0D58C' : '#0D4A2E' }}
              >
                {item.arabic}
              </span>
            </button>
          );
        })}
      </div>

      {onOpenCustomModal && (
        <button
          type="button"
          onClick={() => {
            if (onClose) onClose();
            onOpenCustomModal();
          }}
          className="btn-primary w-full py-2.5 text-[12px] font-semibold mt-1"
        >
          + Add Custom Dhikr
        </button>
      )}
    </div>
  );
}