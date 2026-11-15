//Provides the interactive emotional & spiritual check-in grid (Anxious & Worried, Grateful & Blessed, Overwhelmed & Heavy, Seeking Forgiveness, Lonely or Low, Hopeful & Seeking Ease), an optional personal reflection note, and a toggle to view FeelingHistory or FeelingResult.

import React, { useState, useEffect } from 'react';
import FeelingResult from './FeelingResult';
import FeelingHistory from './FeelingHistory';

const FEELINGS_STORAGE_KEY = 'aamaal_feelings_history_v1';

export const FEELING_STATES = [
  {
    id: 'anxious',
    label: 'Anxious & Worried',
    icon: '🌿',
    tag: 'HEART TRANQUILITY',
    shortPrompt: 'Seeking calm and reliance on Allah',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    translation:
      '"Sufficient for us is Allah, and He is the best Disposer of affairs." (Surah Aal-e-Imran 3:173)',
    romanUrdu:
      '"Hamare liye Allah hi kaafi hai aur Woh behtareen kaarsaaz aur muhafiz hai."',
    urdu: 'ہمارے لیے اللہ ہی کافی ہے اور وہ بہترین کارساز ہے۔',
    hindi: 'हमारे लिए अल्लाह ही काफ़ी है और वह बेहतरीन कारसाज़ है।',
    reflection:
      'When the future feels uncertain, hand the weight of your affairs over to Al-Wakeel (The Trustee). Recite this 7 times with deep certainty.',
    recommendedAamaal: 'Recite 7x Hasbunallahu Wa Ni’mal Wakeel & 33x SubhanAllah',
    targetCount: 7,
  },
  {
    id: 'overwhelmed',
    label: 'Overwhelmed & Heavy',
    icon: '🌧️',
    tag: 'SEEKING EASE',
    shortPrompt: 'When responsibilities or tests feel difficult',
    arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    translation:
      '"O Allah, there is no ease except in that which You have made easy, and You make the difficulty, if You wish, easy." (Sahih Ibn Hibban)',
    romanUrdu:
      '"Aye Allah! Koi kaam aasan nahi magar jise Tu aasan bana de, aur Tu hi har mushkil ko jab chahe aasan farma deta hai."',
    urdu: 'اے اللہ! کوئی کام آسان نہیں مگر جسے تو آسان بنا دے، اور تو ہی مشکل کو جب چاہے آسان فرما دیتا ہے۔',
    hindi:
      'ऐ अल्लाह! कोई काम आसान नहीं मगर जिसे तू आसान बना दे, और तू ही मुश्किल को जब चाहे आसान कर देता है।',
    reflection:
      'You do not have to carry every burden alone. Ask the One who controls all matters to soften what feels rigid in front of you.',
    recommendedAamaal: 'Recite 3x Dua for Ease & 10x Durood Shareef',
    targetCount: 3,
  },
  {
    id: 'grateful',
    label: 'Grateful & Blessed',
    icon: '✨',
    tag: 'GRATITUDE & PRAISE',
    shortPrompt: 'Thanking Allah for blessings & peace',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    translation:
      '"O Allah, help me to remember You, to give thanks to You, and to worship You in the best manner." (Sunan Abi Dawud 1522)',
    romanUrdu:
      '"Aye Allah! Apne zikr, apne shukr aur apni behtareen ibadat par meri madad farma."',
    urdu: 'اے اللہ! اپنے ذکر، اپنے شکر اور اپنی بہترین عبادت پر میری مدد فرما۔',
    hindi:
      'ऐ अल्लाह! अपने ज़िक्र, अपने शुक्र और अपनी बेहतरीन इबादत पर मेरी मदद फ़रमा।',
    reflection:
      'Gratitude (Shukr) preserves existing blessings and attracts unseen ones. The Prophet ﷺ held Mu’adh’s hand and advised him never to leave this dua after prayer.',
    recommendedAamaal: 'Recite 33x Alhamdulillah & 10x Durood Shareef',
    targetCount: 3,
  },
  {
    id: 'repentant',
    label: 'Seeking Forgiveness',
    icon: '🤲',
    tag: 'MERCY & RENEWAL',
    shortPrompt: 'Returning to Allah with a sincere heart',
    arabic: 'رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي',
    translation:
      '"My Lord, indeed I have wronged myself, so forgive me." (Surah Al-Qasas 28:16)',
    romanUrdu:
      '"Aye mere Rab! Beshak maine apni jaan par zulm kiya, pas meri maghfirat farma de."',
    urdu: 'اے میرے رب! بے شک میں نے اپنی جان پر ظلم کیا، پس مجھے بخش دے۔',
    hindi: 'ऐ मेरे रब! बेशक मैंने अपनी जान पर ज़ुल्म किया, पस मुझे बख़्श दे।',
    reflection:
      'Allah’s mercy vastly outweighs every slip. The moment you turn back with remorse, the door of Tawbah is already open.',
    recommendedAamaal: 'Complete 100x Daily Istighfar in Aamaal Circle',
    targetCount: 7,
  },
  {
    id: 'distressed',
    label: 'Sad or Distressed',
    icon: '🌙',
    tag: 'PROPHETIC RELIEF',
    shortPrompt: 'Calling upon Allah’s mercy in moments of grief',
    arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
    translation:
      '"O Ever-Living, O Sustainer of all that exists, in Your mercy I seek relief." (Jami at-Tirmidhi 3524)',
    romanUrdu:
      '"Aye Hamesha Zinda Rehne Wale, Aye Sab Ko Thaamne Wale! Main Teri hi rehmat ke waseele se madad chahta hoon."',
    urdu: 'اے ہمیشہ زندہ رہنے والے، اے سب کو تھامنے والے! میں تیری رحمت کے وسیلے سے مدد چاہتا ہوں۔',
    hindi:
      'ऐ हमेशा ज़िंदा रहने वाले, ऐ सब को थामने वाले! मैं तेरी रहमत के वसीले से मदद चाहता हूँ।',
    reflection:
      'Whenever the Prophet ﷺ faced a matter that caused him deep concern or sadness, he would immediately call upon Ya Hayyu Ya Qayyum.',
    recommendedAamaal: 'Recite 3x Ya Hayyu Ya Qayyum & listen to Surah Mulk tonight',
    targetCount: 3,
  },
  {
    id: 'hopeful',
    label: 'Hopeful & Seeking Guidance',
    icon: '🕌',
    tag: 'DIVINE GUIDANCE',
    shortPrompt: 'Asking for clarity, beneficial knowledge & barakah',
    arabic: 'رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا',
    translation:
      '"Our Lord, grant us mercy from Yourself and prepare for us from our affair right guidance." (Surah Al-Kahf 18:10)',
    romanUrdu:
      '"Aye hamare Rab! Hamein apni khaas rehmat ata farma aur hamare kaam mein hamare liye bhalai aur durustgi ka raasta tayyar farma."',
    urdu: 'اے ہمارے رب! ہمیں اپنی طرف سے رحمت عطا فرما اور ہمارے کام میں ہمارے لیے راہِ راست مہیا فرما۔',
    hindi:
      'ऐ हमारे रब! हमें अपनी तरफ़ से रहमत अता फ़रमा और हमारे काम में हमारे लिए सही रास्ता तैयार कर दे।',
    reflection:
      'The prayer of the Youths of the Cave (Ashab al-Kahf) when stepping into the unknown with full trust in Allah’s guidance.',
    recommendedAamaal: 'Recite 3x Dua of Ashab al-Kahf & 313x Durood Shareef',
    targetCount: 3,
  },
];

export default function FeelingCheckIn({
  state,
  updateState,
  onNavigateTab,
  onShowToast,
  onBack,
}) {
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const [note, setNote] = useState('');
  const [viewMode, setViewMode] = useState('checkin'); // 'checkin' | 'result' | 'history'

  const [historyLogs, setHistoryLogs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FEELINGS_STORAGE_KEY) || 'null');
      if (Array.isArray(saved)) return saved;
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(FEELINGS_STORAGE_KEY, JSON.stringify(historyLogs));
    } catch (_) {}
  }, [historyLogs]);

  const handleConfirmCheckIn = (feelingObj) => {
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}

    const targetFeeling = feelingObj || selectedFeeling || FEELING_STATES[0];
    const newEntry = {
      id: `feel_${Date.now()}`,
      feelingId: targetFeeling.id,
      label: targetFeeling.label,
      icon: targetFeeling.icon,
      note: note.trim(),
      arabic: targetFeeling.arabic,
      translation: targetFeeling.translation,
      timestamp: new Date().toISOString(),
      completedRecitation: false,
    };

    setHistoryLogs((prev) => [newEntry, ...prev]);
    setSelectedFeeling(targetFeeling);
    setNote('');
    setViewMode('result');
  };

  const handleMarkRecitationComplete = (feelingId) => {
    setHistoryLogs((prev) =>
      prev.map((item, idx) =>
        idx === 0 && item.feelingId === feelingId
          ? { ...item, completedRecitation: true }
          : item
      )
    );

    if (updateState) {
      updateState((prev) => ({
        ...prev,
        sessionsCount: (prev.sessionsCount || 0) + 1,
        dhikrCount: (prev.dhikrCount || 0) + 3,
      }));
    }

    if (onShowToast) {
      onShowToast('Alhamdulillah! Spiritual check-in & Dua recorded');
    }
  };

  if (viewMode === 'result' && selectedFeeling) {
    return (
      <FeelingResult
        feeling={selectedFeeling}
        onCompleteRecitation={() =>
          handleMarkRecitationComplete(selectedFeeling.id)
        }
        onOpenHistory={() => setViewMode('history')}
        onNavigateTab={onNavigateTab}
        onBack={() => setViewMode('checkin')}
      />
    );
  }

  if (viewMode === 'history') {
    return (
      <FeelingHistory
        historyLogs={historyLogs}
        onSelectPastFeeling={(feelingId) => {
          const found = FEELING_STATES.find((f) => f.id === feelingId);
          if (found) {
            setSelectedFeeling(found);
            setViewMode('result');
          }
        }}
        onClearHistory={() => {
          setHistoryLogs([]);
          if (onShowToast) onShowToast('Check-in history cleared');
        }}
        onBack={() => setViewMode('checkin')}
      />
    );
  }

  return (
    <section className="screen-section no-scrollbar px-5 pt-4 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary px-3 py-1 text-[11.5px]"
            >
              ‹ Back
            </button>
          )}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
              Heart &amp; Soul Check-In
            </span>
            <h2 className="font-serif text-[23px] font-semibold text-primary leading-tight">
              How Is Your Heart Today?
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setViewMode('history')}
          className="px-3 py-1.5 rounded-full bg-[#EAE8D7] border border-[#D5D2BE] text-primary text-[11.5px] font-bold"
        >
          📜 History ({historyLogs.length})
        </button>
      </div>

      <p className="text-[12px] text-secondary mb-3.5">
        Select how you are feeling right now to receive a Prophetic supplication, translation, and gentle daily Aamaal prescription.
      </p>

      {/* 6 Emotion Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {FEELING_STATES.map((item) => {
          const isSelected = selectedFeeling?.id === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                try {
                  if (navigator.vibrate) navigator.vibrate(10);
                } catch (_) {}
                setSelectedFeeling(item);
              }}
              className={`text-left rounded-[18px] p-3.5 border transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#0F4C2B] text-white border-[#C99E4C] shadow-progress-card'
                  : 'bg-[#F3EFE2] text-primary border-white/90 shadow-soft-card'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[22px]">{item.icon}</span>
                <span
                  className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                    isSelected
                      ? 'bg-[#DFB75A] text-[#07361D]'
                      : 'bg-[#EAE8D7] text-secondary'
                  }`}
                >
                  {isSelected ? '✓' : '›'}
                </span>
              </div>

              <div>
                <h3
                  className={`font-serif text-[14.5px] font-semibold leading-snug ${
                    isSelected ? 'text-white' : 'text-primary'
                  }`}
                >
                  {item.label}
                </h3>
                <p
                  className={`text-[10.5px] mt-0.5 line-clamp-2 ${
                    isSelected ? 'text-white/80' : 'text-secondary'
                  }`}
                >
                  {item.shortPrompt}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Optional Reflection Note & Continue Button */}
      <div className="card-soft rounded-[20px] p-3.5 space-y-2.5">
        <label className="block text-[10.5px] font-bold uppercase tracking-wider text-primary">
          Optional Personal Reflection Note
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write a brief thought or dua intention (kept private)..."
          className="bg-[#F5F2E8] text-primary text-[12.5px] py-2 px-3 rounded-xl"
        />

        <button
          type="button"
          disabled={!selectedFeeling}
          onClick={() => handleConfirmCheckIn(selectedFeeling)}
          className={`w-full py-3 rounded-full text-[13.5px] font-semibold transition shadow-md ${
            selectedFeeling
              ? 'btn-primary'
              : 'bg-[#D5D2BE] text-secondary cursor-not-allowed'
          }`}
        >
          {selectedFeeling
            ? `View Prophetic Remedy for "${selectedFeeling.label}" ›`
            : 'Select a Feeling Above to Continue'}
        </button>
      </div>
    </section>
  );
}