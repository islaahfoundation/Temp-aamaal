//The master controller for src/pages/quiz/ uniting QuizHome, QuizPlay, and QuizResult with 4 structured Islamic quiz tracks, high-score tracking, and recent attempt history.

import React, { useState, useEffect } from 'react';
import QuizPlay from './QuizPlay';
import QuizResult from './QuizResult';

const QUIZ_HISTORY_KEY = 'aamaal_quiz_history_v1';

export const QUIZ_CATEGORIES = [
  {
    id: 'virtues-of-aamaal',
    title: 'Virtues of Daily Aamaal & Salawat',
    subtitle: '313 Durood Shareef, Istighfar & daily consistency',
    icon: '📿',
    questions: [
      {
        id: 'q_durood_10',
        tag: 'Virtues of Salawat',
        question:
          'According to Sahih Muslim, when a believer sends blessings (Durood) upon the Prophet ﷺ once, how many times does Allah send blessings upon them?',
        arabic: 'مَنْ صَلَّى عَلَيَّ وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرًا',
        options: [
          'Three times',
          'Seven times',
          'Ten times',
          'Seventy times',
        ],
        correctIndex: 2,
        reference: 'Sahih Muslim 408',
        explanation: {
          en: 'The Prophet ﷺ said: "Whoever sends blessings upon me once, Allah sends blessings upon him tenfold, erases ten sins, and raises him ten degrees."',
          romanUrdu:
            'Nabi Kareem ﷺ ne farmaya: "Jo shakhs mujh par ek martaba Durood bhejta hai, Allah Ta’ala us par das rahmatein naazil farmata hai."',
          ur: 'نبی کریم ﷺ نے فرمایا: جو شخص مجھ پر ایک مرتبہ درود بھیجتا ہے، اللہ تعالیٰ اس پر دس رحمتیں نازل فرماتا ہے۔',
          hi: 'नबी करीम ﷺ ने फ़रमाया: जो शख़्स मुझ पर एक बार दुरूद भेजता है, अल्लाह तआला उस पर दस रहमतें नाज़िल फ़रमाता है।',
        },
      },
      {
        id: 'q_consistent_deeds',
        tag: 'Prophetic Consistency',
        question:
          'Which type of deed did the Prophet ﷺ describe as the most beloved to Allah?',
        options: [
          'Deeds that are done consistently, even if they are small',
          'Deeds performed only once a year in large gatherings',
          'Deeds that are exhausting and unsustainable',
          'Deeds done only when one feels free of all responsibilities',
        ],
        correctIndex: 0,
        reference: 'Sahih Al-Bukhari 6464',
        explanation: {
          en: 'The Prophet ﷺ taught that the most beloved deeds to Allah are those performed with steady regularity, even if small—the core principle of the Aamaal Circle.',
          romanUrdu:
            'Allah Ta’ala ko sab se zyada pasand woh aamaal hain jo hamesha pabandi ke saath kiye jayein, chahe woh miqdar mein thode hi kyun na hon.',
          ur: 'اللہ تعالیٰ کو سب سے زیادہ پسند وہ اعمال ہیں جو ہمیشہ پابندی کے ساتھ کیے جائیں، خواہ وہ تھوڑے ہی ہوں۔',
          hi: 'अल्लाह तआला को सबसे ज़्यादा पसंद वह आमाल हैं जो हमेशा पाबंदी के साथ किए जाएँ, चाहे वह थोड़े ही क्यों न हों।',
        },
      },
      {
        id: 'q_istighfar_count',
        tag: 'Daily Repentance',
        question:
          'In Sunan Abi Dawud, how many times did the Companions count the Prophet ﷺ reciting Istighfar in a single sitting?',
        arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
        options: [
          '10 times',
          '33 times',
          '100 times',
          '500 times',
        ],
        correctIndex: 2,
        reference: 'Sunan Abi Dawud 1516',
        explanation: {
          en: 'Ibn Umar (RA) reported that the Companions used to count the Messenger of Allah ﷺ saying this supplication of repentance 100 times in a single gathering.',
          romanUrdu:
            'Hazrat Ibn Umar (RA) riwayat karte hain ke Sahaba الكرام ek hi majlis mein Aap ﷺ ko 100 martaba yeh Istighfar padhte hue ginte the.',
          ur: 'حضرت ابن عمر رضی اللہ عنہما روایت کرتے ہیں کہ صحابہ کرام ایک ہی مجلس میں آپ ﷺ کو سو مرتبہ یہ استغفار پڑھتے ہوئے گنتے تھے۔',
          hi: 'हज़रत इब्न उमर (RA) रिवायत करते हैं कि सहाबा इकराम एक ही मजलिस में आप ﷺ को 100 बार यह इस्तिग़फ़ार पढ़ते हुए गिनते थे।',
        },
      },
    ],
  },
  {
    id: 'surah-mulk-quran',
    title: 'Surah Al-Mulk & Quranic Shield',
    subtitle: 'Nightly protection, verses & meanings',
    icon: '🌙',
    questions: [
      {
        id: 'q_mulk_verses',
        tag: 'Surah Al-Mulk',
        question:
          'How many verses (Ayahs) are in Surah Al-Mulk, the Surah that intercedes for its reciter until they are forgiven?',
        arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
        options: ['15 Verses', '30 Verses', '45 Verses', '67 Verses'],
        correctIndex: 1,
        reference: 'Jami at-Tirmidhi 2890',
        explanation: {
          en: 'The Prophet ﷺ said: "There is a Surah in the Quran of thirty verses which interceded for a man until he was forgiven; it is Tabarakalladhi Biyadihil-Mulk."',
          romanUrdu:
            'Nabi ﷺ ne farmaya: "Quran mein tees (30) aayaton wali ek Surah hai jo apne padhne wale ki shafa’at karti hai yahan tak ke uski maghfirat ho jati hai—woh Surah Al-Mulk hai."',
          ur: 'نبی ﷺ نے فرمایا: قرآن میں تیس آیتوں والی ایک سورت ہے جو اپنے پڑھنے والے کی شفاعت کرتی ہے یہاں تک کہ اس کی بخشش ہو جاتی ہے۔',
          hi: 'नबी ﷺ ने फ़रमाया: क़ुरआन में तीस आयतों वाली एक सूरह है जो अपने पढ़ने वाले की शफ़ाअत करती है यहाँ तक कि उसकी मग़फ़िरत हो जाती है।',
        },
      },
      {
        id: 'q_hearts_rest',
        tag: 'Quranic Tranquility',
        question:
          'Complete the meaning of this Quranic verse from Surah Ar-Ra’d (13:28): "Unquestionably, by the remembrance of Allah..."',
        arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
        options: [
          'do hearts find rest and tranquility',
          'are mountains moved across the earth',
          'is worldly wealth multiplied overnight',
          'do seasons change from winter to spring',
        ],
        correctIndex: 0,
        reference: 'Surah Ar-Ra’d 13:28',
        explanation: {
          en: 'Allah declares in Surah Ar-Ra’d that true inner peace and serenity of the heart are found in the remembrance (Dhikr) of Allah.',
          romanUrdu:
            'Beshak Allah hi ke zikr aur yaad se dilon ko haqeeqi sukoon aur itminan milta hai.',
          ur: 'بے شک اللہ کے ذکر ہی سے دلوں کو اطمینان اور سکون نصیب ہوتا ہے۔',
          hi: 'बेशक अल्लाह के ज़िक्र ही से दिलों को सुकून और इत्मीनान मिलता है।',
        },
      },
    ],
  },
  {
    id: 'prophetic-seerah',
    title: 'The Valley of Makkah & Seerah',
    subtitle: 'Life, character & legacy of the Prophet ﷺ',
    icon: '🕋',
    questions: [
      {
        id: 'q_sadiq_amin',
        tag: 'Prophetic Character',
        question:
          'By what titles was Prophet Muhammad ﷺ known among the people of Makkah even before receiving revelation?',
        options: [
          'Al-Sadiq Al-Amin (The Truthful, The Trustworthy)',
          'Al-Malik Al-Qawi (The Mighty King)',
          'Al-Tajir Al-Kabir (The Wealthiest Merchant)',
          'Al-Sha’ir (The Poet)',
        ],
        correctIndex: 0,
        reference: 'Sahih Al-Bukhari 7',
        explanation: {
          en: 'For forty years prior to prophethood, the people of Makkah universally recognized his honesty and integrity, calling him Al-Sadiq Al-Amin.',
          romanUrdu:
            'Nabuwwat milne se pehle bhi Makkah ke log Aap ﷺ ki sachai aur amanatdari ki wajah se Aap ﷺ ko Al-Sadiq aur Al-Amin keh kar pukarte the.',
          ur: 'نبوت سے پہلے بھی اہلِ مکہ آپ ﷺ کو الصادق اور الامین کے لقب سے پکارتے تھے۔',
          hi: 'नबुव्वत से पहले भी मक्का के लोग आप ﷺ की सच्चाई और अमानतदारी की वजह से आपको अल-सादिक़ और अल-अमीन कहते थे।',
        },
      },
      {
        id: 'q_ibrahim_valley',
        tag: 'Sanctuary of Makkah',
        question:
          'Which Prophet prayed for the barren valley of Makkah and raised the foundations of the Ka’bah with his son Ismail (AS)?',
        arabic: 'وَإِذْ يَرْفَعُ إِبْرَاهِيمُ الْقَوَاعِدَ مِنَ الْبَيْتِ وَإِسْمَاعِيلُ',
        options: [
          'Prophet Nuh (AS)',
          'Prophet Ibrahim (AS)',
          'Prophet Musa (AS)',
          'Prophet Dawud (AS)',
        ],
        correctIndex: 1,
        reference: 'Surah Al-Baqarah 2:127',
        explanation: {
          en: 'Prophet Ibrahim (AS) and his son Ismail (AS) raised the foundations of the Sacred House in Makkah while praying: "Our Lord, accept this from us."',
          romanUrdu:
            'Hazrat Ibrahim (AS) aur Hazrat Ismail (AS) ne Baitullah (Ka’bah) ki buniyadein uthate waqt dua maangi ke Aye hamare Rab! Hamari yeh khidmat qubool farma.',
          ur: 'حضرت ابراہیم علیہ السلام اور حضرت اسماعیل علیہ السلام نے خانہ کعبہ کی بنیادیں اٹھائیں۔',
          hi: 'हज़रत इब्राहीम (AS) और हज़रत इस्माईल (AS) ने काबा की बुनियादें उठाते वक़्त दुआ माँगी।',
        },
      },
    ],
  },
  {
    id: 'prophetic-duas-adab',
    title: 'Prophetic Duas & Daily Adab',
    subtitle: 'Supplications for ease, parents & Masjid etiquette',
    icon: '🤲',
    questions: [
      {
        id: 'q_entering_masjid',
        tag: 'Masjid Etiquette',
        question:
          'What do we ask Allah for in the authentic Sunnah Dua recited while stepping into the Masjid with the right foot?',
        arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
        options: [
          '"O Allah, open for me the doors of Your mercy."',
          '"O Allah, grant me victory in worldly trade."',
          '"O Allah, make my journey short and swift."',
          '"O Allah, send rain upon our valley."',
        ],
        correctIndex: 0,
        reference: 'Sahih Muslim 713',
        explanation: {
          en: 'When entering the Masjid, we ask Allah to open the doors of His mercy (Rahmah); when leaving, we ask from His bounty and grace (Fadl).',
          romanUrdu:
            'Masjid mein daakhil hote waqt hum Allah se Uski rehmat ke darwaze kholne ki dua karte hain.',
          ur: 'مسجد میں داخل ہوتے وقت ہم اللہ سے اس کی رحمت کے دروازے کھولنے کی دعا کرتے ہیں۔',
          hi: 'मस्जिद में दाख़िल होते वक़्त हम अल्लाह से उसकी रहमत के दरवाज़े खोलने की दुआ करते हैं।',
        },
      },
      {
        id: 'q_dua_for_parents',
        tag: 'Honoring Parents',
        question:
          'Which Surah teaches us the famous supplication: "My Lord, have mercy upon them both as they brought me up when I was small"?',
        arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
        options: [
          'Surah Al-Isra (17:24)',
          'Surah Al-Kahf (18:10)',
          'Surah Yasin (36:1)',
          'Surah Al-Falaq (113:1)',
        ],
        correctIndex: 0,
        reference: 'Surah Al-Isra 17:24',
        explanation: {
          en: 'In Surah Al-Isra (17:24), Allah commands believers to lower the wing of humility out of mercy to their parents and pray for them with these words.',
          romanUrdu:
            'Surah Al-Isra mein Allah Ta’ala ne walidain ke saath narmi aur mohabbat ka बर्ताव karne aur unke haq mein yeh dua maangne ka hukm diya hai.',
          ur: 'سورۃ الاسراء میں اللہ تعالیٰ نے والدین کے حق میں یہ دعا مانگنے کی تعلیم دی ہے۔',
          hi: 'सूरह अल-इसरा में अल्लाह तआला ने माता-पिता के हक़ में यह दुआ माँगने की तालीम दी है।',
        },
      },
    ],
  },
];

export default function QuizHome({
  state,
  updateState,
  onShowToast,
  onBack,
}) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [latestResult, setLatestResult] = useState(null);

  const [history, setHistory] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(QUIZ_HISTORY_KEY) || 'null');
      if (Array.isArray(saved)) return saved;
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(history));
    } catch (_) {}
  }, [history]);

  const handleFinishQuiz = (resObj) => {
    setHistory((prev) => [resObj, ...prev.slice(0, 29)]);
    setLatestResult(resObj);

    if (updateState) {
      updateState((prev) => ({
        ...prev,
        sessionsCount: (prev.sessionsCount || 0) + 1,
      }));
    }

    if (onShowToast) {
      onShowToast(`MashaAllah! Scored ${resObj.score}/${resObj.total} in Quiz`);
    }
  };

  // 1. Render Result Screen if a quiz just finished
  if (latestResult) {
    return (
      <section className="screen-section no-scrollbar px-5 pt-4 pb-6">
        <QuizResult
          result={latestResult}
          onRetryQuiz={() => {
            const cat = QUIZ_CATEGORIES.find(
              (c) => c.id === latestResult.categoryId
            );
            setLatestResult(null);
            setActiveCategory(cat || QUIZ_CATEGORIES[0]);
          }}
          onBackToHome={() => {
            setLatestResult(null);
            setActiveCategory(null);
          }}
        />
      </section>
    );
  }

  // 2. Render Active Quiz Play Screen
  if (activeCategory) {
    return (
      <section className="screen-section no-scrollbar px-5 pt-4 pb-6">
        <QuizPlay
          category={activeCategory}
          onFinishQuiz={handleFinishQuiz}
          onExitQuiz={() => setActiveCategory(null)}
        />
      </section>
    );
  }

  // Calculate overall best stats
  const totalCompletedQuizzes = history.length;
  const totalCorrectAnswers = history.reduce((s, h) => s + Number(h.score || 0), 0);

  // 3. Render Quiz Home Directory
  return (
    <section className="screen-section no-scrollbar px-5 pt-4 pb-6 space-y-3.5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
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
              Test Your Sunnah Knowledge
            </span>
            <h2 className="font-serif text-[23px] font-semibold text-primary leading-tight">
              Islamic Knowledge Quiz
            </h2>
          </div>
        </div>
      </div>

      {/* Hero Stats Banner */}
      <div className="card-progress rounded-[22px] p-4 border border-[#C99E4C]/45 flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[9.5px] font-bold uppercase tracking-wider">
            Interactive Study
          </span>
          <h3 className="font-serif text-[19px] font-semibold text-white mt-1">
            Learn Through Reflection
          </h3>
          <p className="text-[11.5px] text-white/80 mt-0.5">
            Pure Arabic proofs &amp; explanations in 4 languages.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-2xl bg-[#DFB75A]/20 border border-[#DFB75A]/45 text-center shrink-0">
          <span className="font-serif text-[18px] font-bold text-[#F0D58C] block leading-none">
            {totalCorrectAnswers}
          </span>
          <span className="text-[9.5px] text-white/85 font-semibold">
            Correct ({totalCompletedQuizzes} Quizzes)
          </span>
        </div>
      </div>

      {/* Quiz Categories List */}
      <div className="space-y-2.5">
        <h3 className="font-serif text-[16.5px] font-semibold text-primary px-0.5">
          Select a Quiz Topic
        </h3>

        {QUIZ_CATEGORIES.map((cat) => {
          const pastForCat = history.filter((h) => h.categoryId === cat.id);
          const bestScore =
            pastForCat.length > 0
              ? Math.max(...pastForCat.map((h) => h.score))
              : null;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                try {
                  if (navigator.vibrate) navigator.vibrate(10);
                } catch (_) {}
                setActiveCategory(cat);
              }}
              className="w-full text-left card rounded-[20px] p-4 flex items-center justify-between gap-3 active:scale-[0.99] transition"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#165534] to-[#08351D] text-[#F0D58C] border border-[#C99E4C]/40 flex items-center justify-center text-[21px] shrink-0 shadow-sm">
                  {cat.icon}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                      {cat.questions.length} Questions
                    </span>
                    {bestScore !== null && (
                      <span className="px-2 py-0.2 rounded-full bg-[#DCE3C8] text-[#0D4A2E] text-[9.5px] font-bold">
                        Best: {bestScore}/{cat.questions.length}
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif text-[16px] font-semibold text-primary truncate mt-0.5">
                    {cat.title}
                  </h4>
                  <p className="text-[11.5px] text-secondary truncate">
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              <span className="px-3 py-1.5 rounded-full bg-[#0D4A2E] text-[#F0D58C] text-[11px] font-bold shrink-0">
                Start ›
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}