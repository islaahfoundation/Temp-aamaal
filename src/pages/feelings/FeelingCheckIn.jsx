//Provides the interactive emotional & spiritual check-in grid (Anxious & Worried, Grateful & Blessed, Overwhelmed & Heavy, Seeking Forgiveness, Lonely or Low, Hopeful & Seeking Ease), an optional personal reflection note, and a toggle to view FeelingHistory or FeelingResult.

import React, { useState, useEffect } from 'react';
import FeelingHistory from './FeelingHistory';

const FEELINGS_STORAGE_KEY = 'aamaal_feelings_history_v1';
const CMS_FEELINGS_KEY = 'aamaal_admin_cms_feelings_v1';

// Hidden behind-the-scenes emotion categories with conversational Quran & Sunnah responses
export const FEELING_STATES = [
  {
    id: 'scared',
    label: 'Scared or Afraid',
    icon: '🛡️',
    keywords: ['scared', 'afraid', 'fear', 'terrified', 'frightened', 'panic', 'nervous', 'dar', 'darr'],
    opening: (name) =>
      `Hey ${name}, don't worry—Allah is right there with you, watching over you and protecting you.`,
    quranStory:
      'You know what Allah said to Prophet Musa (AS) and Harun (AS) when they were scared to face Pharaoh? Allah comforted them in the Quran: "Fear not. Indeed, I am with you both; I hear and I see." (Surah Taha 20:46). And when Prophet Muhammad ﷺ was in the Cave of Thawr with Abu Bakr (RA) while enemies stood right outside, the Prophet ﷺ said: "Do not grieve; indeed Allah is with us." (Surah At-Tawbah 9:40).',
    sunnahStory:
      'A Sahabi once came to Prophet Muhammad ﷺ feeling deeply frightened and anxious. The Prophet ﷺ taught him to place his trust in Allah and seek refuge in His perfect words, reminding him that nothing in the heavens or earth can harm anyone except by Allah’s permission (Sunan Abi Dawud 5088).',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    translation:
      'Allah is sufficient for us, and He is the best Disposer of affairs. (Surah Aal-e-Imran 3:173)',
    romanUrdu:
      'Hamare liye Allah hi kaafi hai aur Woh behtareen kaarsaaz aur hifazat karne wala hai.',
  },
  {
    id: 'angry',
    label: 'Angry or Frustrated',
    icon: '🌊',
    keywords: ['angry', 'mad', 'pissed', 'furious', 'frustrated', 'annoyed', 'irritated', 'gussa', 'hate', 'rage'],
    opening: (name) =>
      `Take a deep breath, ${name}. It is completely human to feel frustrated, and Islam gives us gentle, powerful ways to cool the fire of anger.`,
    quranStory:
      'In the Quran, Allah praises those who hold back their anger and forgive people, calling them Al-Muhsinin (the doers of good): "Those who restrain anger and who pardon the people—and Allah loves the doers of good." (Surah Aal-e-Imran 3:134).',
    sunnahStory:
      'One day, a Sahabi came to Prophet Muhammad ﷺ and asked for a single piece of life-changing advice. The Prophet ﷺ said: "Do not get angry." The man asked again and again, and each time the Prophet ﷺ replied: "Do not get angry." (Sahih al-Bukhari 6116). He ﷺ also taught that if you feel angry while standing, sit down; if it remains, lie down, and seek refuge in Allah from Shaytan.',
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    translation:
      'I seek refuge in Allah from Shaytan, the accursed. (Sahih al-Bukhari 3282)',
    romanUrdu:
      'Main Allah ki panah maangta hoon shaytan mardood ke shar se.',
  },
  {
    id: 'distressed',
    label: 'Sad or Heartbroken',
    icon: '🤍',
    keywords: ['sad', 'cry', 'crying', 'depressed', 'down', 'not good', 'bad', 'hurt', 'broken', 'grief', 'lonely', 'alone', 'udas', 'dukh', 'tired', 'hopeless'],
    opening: (name) =>
      `I hear you, ${name}. Your heart feels heavy right now, and Allah knows every single tear and unspoken pain inside your chest.`,
    quranStory:
      'Remember Prophet Yaqub (AS) when he was overwhelmed with grief? He said in the Quran: "I only complain of my suffering and my grief to Allah." (Surah Yusuf 12:86). And Allah revealed to our Prophet ﷺ during his hardest days: "Your Lord has not taken leave of you, nor has He detested you... And verily, with every hardship comes ease." (Surah Ad-Duha 93:3 & Ash-Sharh 94:6).',
    sunnahStory:
      'Whenever Prophet Muhammad ﷺ was struck by deep sadness or distress, he would turn directly to Allah calling out "Ya Hayyu Ya Qayyum, bi-rahmatika astaghith" (Jami at-Tirmidhi 3524). He ﷺ also promised that no fatigue, illness, sorrow, or even the prick of a thorn touches a believer except that Allah erases their sins through it (Sahih al-Bukhari 5641).',
    arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
    translation:
      'O Ever-Living, O Sustainer of all that exists, in Your mercy I seek relief. (Jami at-Tirmidhi 3524)',
    romanUrdu:
      'Aye Hamesha Zinda Rehne Wale, Aye Sab Ko Thaamne Wale! Main Teri hi rehmat ke waseele se madad chahta hoon.',
  },
  {
    id: 'anxious',
    label: 'Anxious or Overwhelmed',
    icon: '🌿',
    keywords: ['anxious', 'worried', 'worry', 'stress', 'stressed', 'overwhelmed', 'heavy', 'tense', 'pressure', 'confused', 'lost', 'uncertain'],
    opening: (name) =>
      `Pause for a moment, ${name}. You don't have to carry the entire weight of tomorrow on your shoulders today.`,
    quranStory:
      'Allah reminds us in the Quran: "Allah does not burden a soul beyond that it can bear." (Surah Al-Baqarah 2:286), and "Unquestionably, by the remembrance of Allah do hearts find rest." (Surah Ar-Ra’d 13:28).',
    sunnahStory:
      'One day, Prophet Muhammad ﷺ entered the masjid and saw Abu Umamah (RA) sitting there outside of prayer time, burdened with worries and debts. The Prophet ﷺ taught him a short morning and evening dua asking Allah for refuge from anxiety, grief, and helplessness—and Abu Umamah (RA) said Allah removed all his distress (Sunan Abi Dawud 1555).',
    arabic:
      'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    translation:
      'O Allah, nothing is easy except what You make easy, and You make the difficulty, if You wish, easy. (Sahih Ibn Hibban 974)',
    romanUrdu:
      'Aye Allah! Koi kaam aasan nahi magar jise Tu aasan bana de, aur Tu hi har mushkil ko jab chahe aasan farma deta hai.',
  },
  {
    id: 'repentant',
    label: 'Guilty or Seeking Forgiveness',
    icon: '✨',
    keywords: ['guilty', 'sin', 'sinned', 'mistake', 'regret', 'forgive', 'forgiveness', 'ashamed', 'tauba', 'repent', 'wrong'],
    opening: (name) =>
      `The fact that your heart feels this regret, ${name}, is a sign of living faith (Iman). Never despair of Allah’s mercy.`,
    quranStory:
      'Allah calls out with unmatched tenderness in the Quran: "Say, O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful." (Surah Az-Zumar 39:53).',
    sunnahStory:
      'Prophet Muhammad ﷺ told the Companions that Allah is more pleased with the repentance of His servant than a traveler who loses his camel with all his food and water in the desert, gives up hope of surviving, and suddenly finds it standing right beside him (Sahih Muslim 2747).',
    arabic: 'رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي',
    translation:
      'My Lord, indeed I have wronged myself, so forgive me. (Surah Al-Qasas 28:16)',
    romanUrdu:
      'Aye mere Rab! Beshak maine apni jaan par zulm kiya, pas meri maghfirat farma de.',
  },
  {
    id: 'grateful',
    label: 'Happy & Grateful',
    icon: '☀️',
    keywords: ['happy', 'good', 'great', 'blessed', 'grateful', 'thankful', 'peace', 'peaceful', 'excited', 'alhamdulillah', 'joy', 'fine', 'awesome', 'amazing'],
    opening: (name) =>
      `Alhamdulillah, ${name}! Hearing that your heart is in a good place is a beautiful blessing from Allah.`,
    quranStory:
      'Allah promises in the Quran: "If you are grateful, I will surely increase you in favor." (Surah Ibrahim 14:7). Gratitude protects your current blessings and opens doors to even more peace.',
    sunnahStory:
      'One day, Prophet Muhammad ﷺ took the hand of Mu’adh ibn Jabal (RA) and said: "O Mu’adh, by Allah I love you! I advise you never to leave saying after every prayer: O Allah, help me to remember You, thank You, and worship You well." (Sunan Abi Dawud 1522).',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    translation:
      'O Allah, help me to remember You, to give thanks to You, and to worship You in the best manner. (Sunan Abi Dawud 1522)',
    romanUrdu:
      'Aye Allah! Apne zikr, apne shukr aur apni behtareen ibadat par meri madad farma.',
  },
  {
    id: 'hopeful',
    label: 'Seeking Guidance & Clarity',
    icon: '🌙',
    keywords: ['hopeful', 'guidance', 'guide', 'decision', 'future', 'help', 'idk', 'unsure', 'okay', 'ok', 'normal'],
    opening: (name) =>
      `Whenever you are standing at a crossroads or just taking life one step at a time, ${name}, turning to Allah brings clarity.`,
    quranStory:
      'When the Youths of the Cave (Ashab al-Kahf) stepped into the unknown trusting Allah completely, they prayed: "Our Lord, grant us mercy from Yourself and prepare for us from our affair right guidance." (Surah Al-Kahf 18:10).',
    sunnahStory:
      'Prophet Muhammad ﷺ taught the Sahabah to turn to Allah in every matter—big or small—reminding them that whoever sincerely asks Allah for guidance and goodness will never be left without support (Sahih al-Bukhari 1162).',
    arabic: 'رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا',
    translation:
      'Our Lord, grant us mercy from Yourself and prepare for us from our affair right guidance. (Surah Al-Kahf 18:10)',
    romanUrdu:
      'Aye hamare Rab! Hamein apni khaas rehmat ata farma aur hamare kaam mein durustgi ka raasta tayyar farma.',
  },
];

// Behind-the-scenes emotion matcher
function detectFeelingFromText(inputText, allStates) {
  const text = (inputText || '').toLowerCase();
  if (!text.trim()) return allStates.find((s) => s.id === 'hopeful') || allStates[0];

  for (const st of allStates) {
    if (Array.isArray(st.keywords) && st.keywords.some((kw) => text.includes(kw))) {
      return st;
    }
  }
  return allStates.find((s) => s.id === 'hopeful') || allStates[0];
}

export default function FeelingCheckIn({
  state,
  updateState,
  onShowToast,
  onBack,
  externalSelectedFeeling = null,
  onClearExternalFeeling,
  onHistoryUpdated,
}) {
  const userName = (state?.userName || 'Ubaid').trim().split(/\s+/)[0];

  const [userInput, setUserInput] = useState('');
  const [activeResponse, setActiveResponse] = useState(externalSelectedFeeling);
  const [viewMode, setViewMode] = useState(
    externalSelectedFeeling ? 'response' : 'checkin'
  ); // 'checkin' | 'response' | 'history'

  const [historyLogs, setHistoryLogs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FEELINGS_STORAGE_KEY) || 'null');
      if (Array.isArray(saved)) return saved;
    } catch (_) {}
    return [];
  });

  // Merge any Admin CMS custom Quran/Hadith feeling entries
  const allFeelingStates = (() => {
    try {
      const cmsList = JSON.parse(localStorage.getItem(CMS_FEELINGS_KEY) || '[]');
      if (Array.isArray(cmsList) && cmsList.length > 0) {
        return [...cmsList, ...FEELING_STATES];
      }
    } catch (_) {}
    return FEELING_STATES;
  })();

  useEffect(() => {
    if (externalSelectedFeeling) {
      setActiveResponse(externalSelectedFeeling);
      setViewMode('response');
    }
  }, [externalSelectedFeeling]);

  useEffect(() => {
    try {
      localStorage.setItem(FEELINGS_STORAGE_KEY, JSON.stringify(historyLogs));
    } catch (_) {}
    if (onHistoryUpdated) onHistoryUpdated(historyLogs);
  }, [historyLogs, onHistoryUpdated]);

  const handleAnalyzeFeeling = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}

    const matched = detectFeelingFromText(userInput, allFeelingStates);

    const newEntry = {
      id: `feel_${Date.now()}`,
      feelingId: matched.id,
      label: matched.label,
      icon: matched.icon || '🌿',
      note: userInput.trim(),
      arabic: matched.arabic,
      translation: matched.translation,
      timestamp: new Date().toISOString(),
      completedRecitation: false,
    };

    setHistoryLogs((prev) => [newEntry, ...prev]);
    setActiveResponse({ ...matched, userSaid: userInput.trim() });
    setUserInput('');
    setViewMode('response');
  };

  const handleMarkRecited = () => {
    if (activeResponse) {
      setHistoryLogs((prev) =>
        prev.map((item, idx) =>
          idx === 0 && item.feelingId === activeResponse.id
            ? { ...item, completedRecitation: true }
            : item
        )
      );
    }
    if (updateState) {
      updateState((prev) => ({
        ...prev,
        sessionsCount: (prev.sessionsCount || 0) + 1,
        dhikrCount: (prev.dhikrCount || 0) + 1,
      }));
    }
    if (onShowToast) {
      onShowToast('Alhamdulillah! May Allah grant your heart peace.');
    }
  };

  if (viewMode === 'history') {
    return (
      <FeelingHistory
        historyLogs={historyLogs}
        onSelectPastFeeling={(feelingId) => {
          const found = allFeelingStates.find((f) => f.id === feelingId);
          if (found) {
            setActiveResponse(found);
            setViewMode('response');
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
    <section className="screen-section no-scrollbar px-5 pt-4 pb-6 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {onBack && (
            <button
              type="button"
              onClick={() => {
                if (viewMode === 'response') {
                  setViewMode('checkin');
                  if (onClearExternalFeeling) onClearExternalFeeling();
                } else {
                  onBack();
                }
              }}
              className="btn-secondary px-3 py-1 text-[11.5px]"
            >
              ‹ Back
            </button>
          )}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
              Quran &amp; Sunnah Comfort
            </span>
            <h2 className="font-serif text-[22px] font-semibold text-primary leading-tight">
              How are you feeling?
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setViewMode('history')}
          className="px-3 py-1.5 rounded-full bg-[#EAE8D7] border border-[#D5D2BE] text-primary text-[11.5px] font-bold"
        >
          ⏱ History ({historyLogs.length})
        </button>
      </div>

      {/* VIEW 1: EYE-LEVEL CONVERSATIONAL CHECK-IN */}
      {viewMode === 'checkin' && (
        <form
          onSubmit={handleAnalyzeFeeling}
          className="card rounded-[24px] p-5 bg-[#F3EFE2] border border-[#D5D2BE] shadow-soft-card space-y-4 fade-in"
        >
          <div className="space-y-1.5">
            <span className="badge-pill">Personal Check-In</span>
            <h3 className="font-serif text-[24px] font-bold text-[#0D4A2E] leading-snug">
              Hi {userName}, how are you feeling?
            </h3>
            <p className="text-[12.5px] text-secondary">
              Share whatever is on your heart—whether you feel scared, sad, frustrated, stressed, or happy—and receive guidance from the Quran and Sunnah.
            </p>
          </div>

          <textarea
            rows={4}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder='Type anything... e.g. "I am scared", "pissed off", "feeling sad", "not good", "I am happy"'
            className="w-full rounded-2xl bg-[#FFFDF9] border border-[#D5D2BE] p-3.5 text-[13.5px] text-primary placeholder:text-secondary/70 focus:outline-none focus:border-[#0D4A2E]"
          />

          <button
            type="submit"
            disabled={!userInput.trim()}
            className={`w-full py-3.5 rounded-full text-[13.5px] font-semibold transition shadow-md ${
              userInput.trim()
                ? 'btn-primary'
                : 'bg-[#D5D2BE] text-secondary cursor-not-allowed'
            }`}
          >
            Share &amp; Receive Quran &amp; Sunnah Comfort ›
          </button>
        </form>
      )}

      {/* VIEW 2: CONVERSATIONAL QURAN & SUNNAH RESPONSE */}
      {viewMode === 'response' && activeResponse && (
        <div className="space-y-3.5 fade-in">
          {activeResponse.userSaid && (
            <div className="rounded-2xl bg-[#EAE8D7] px-4 py-2.5 border border-[#D5D2BE] text-[12px] text-primary">
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block">
                You shared
              </span>
              &ldquo;{activeResponse.userSaid}&rdquo;
            </div>
          )}

          {/* Warm Opening + Quran & Sunnah Stories */}
          <div className="card rounded-[24px] p-4.5 bg-[#F3EFE2] border border-[#C99E4C]/50 shadow-soft-card space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[20px]">{activeResponse.icon || '🌿'}</span>
              <span className="badge-pill">Guidance from Quran &amp; Sunnah</span>
            </div>

            <p className="text-[13.5px] font-semibold text-[#0D4A2E] leading-relaxed">
              {typeof activeResponse.opening === 'function'
                ? activeResponse.opening(userName)
                : activeResponse.opening}
            </p>

            <div className="rounded-2xl bg-[#FFFDF9] p-3.5 border border-[#DCD8C6] space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C99E4C]">
                📖 From the Holy Quran
              </span>
              <p className="text-[12.5px] text-primary leading-relaxed">
                {activeResponse.quranStory}
              </p>
            </div>

            <div className="rounded-2xl bg-[#FFFDF9] p-3.5 border border-[#DCD8C6] space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#135332]">
                🕌 From the Sunnah of Prophet Muhammad ﷺ
              </span>
              <p className="text-[12.5px] text-primary leading-relaxed">
                {activeResponse.sunnahStory}
              </p>
            </div>
          </div>

          {/* Pure Arabic Dua Card */}
          <div className="card-progress rounded-[22px] p-4 text-white space-y-2.5 border border-[#C99E4C]/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F0D58C] block">
              🤲 Recite This Dua for Peace
            </span>
            <p
              dir="rtl"
              className="font-arabic text-[24px] leading-loose text-right text-white"
            >
              {activeResponse.arabic}
            </p>
            <p className="text-[12.5px] text-white/90 leading-relaxed">
              {activeResponse.translation}
            </p>
            {activeResponse.romanUrdu && (
              <p className="text-[11.5px] text-[#F0D58C]/90 italic">
                {activeResponse.romanUrdu}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={handleMarkRecited}
              className="btn-primary flex-1 py-3 text-[13px] font-semibold shadow-md"
            >
              ✓ I Recited This Dua
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('checkin');
                if (onClearExternalFeeling) onClearExternalFeeling();
              }}
              className="btn-secondary px-4 py-3 text-[12.5px] font-semibold"
            >
              Ask Again
            </button>
          </div>
        </div>
      )}
    </section>
  );
}