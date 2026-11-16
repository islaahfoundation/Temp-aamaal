//The master controller for src/pages/learning/ uniting ReadingProgress, ReadingPreferences, CourseDetails, LessonList, and LessonReader with rich courses on Virtues of 313 Durood Shareef, Secrets of Surah Al-Mulk, The Power of Daily Istighfar, and The Valley of Makkah (Prophetic Seerah).

import React, { useState, useEffect } from 'react';
import ReadingProgress from './ReadingProgress';
import ReadingPreferences from './ReadingPreferences';
import CourseDetails from './CourseDetails';
import LessonReader from './LessonReader';

const LEARNING_PROGRESS_KEY = 'aamaal_learning_progress_v1';
const LEARNING_PREFS_KEY = 'aamaal_learning_prefs_v1';

export const LEARNING_COURSES = [
  {
    id: 'virtues-of-durood',
    title: 'Virtues of Salawat & 313 Durood',
    category: 'Core Aamaal Series',
    icon: '📿',
    description:
      'Discover why sending abundant peace and blessings upon the Prophet ﷺ transforms your heart, answers supplications, and brings tenfold divine mercy.',
    lessons: [
      {
        number: 1,
        title: 'Ten Blessings for Every Single Salawat',
        readTime: '3 min read',
        summary: 'How Allah responds tenfold to every Durood you recite.',
        reference: 'Sahih Muslim 408',
        arabic: 'مَنْ صَلَّى عَلَيَّ وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرًا',
        translation:
          '"Whoever sends blessings upon me once, Allah sends blessings upon him ten times."',
        romanUrdu:
          '"Jo shakhs mujh par ek martaba Durood bhejta hai, Allah Ta’ala us par das rahmatein naazil farmata hai."',
        urdu: 'جو شخص مجھ پر ایک مرتبہ درود بھیجتا ہے، اللہ تعالیٰ اس پر دس رحمتیں نازل فرماتا ہے۔',
        hindi:
          'जो शख़्स मुझ पर एक बार दुरूद भेजता है, अल्लाह तआला उस पर दस रहमतें नाज़िल फ़रमाता है।',
        paragraphs: [
          'Sending Salawat (Durood Shareef) upon the Messenger of Allah ﷺ is one of the most Effortless yet weighty deeds in Islam. Unlike many acts of worship that require specific conditions, Durood can be recited walking, sitting, or working.',
          'Scholars explain that Allah’s blessing (Salah) upon a servant means His praise for you among the angels of the highest assembly, accompanied by mercy, forgiveness of ten sins, and elevation by ten spiritual ranks.',
        ],
        actionStep:
          'Complete your daily 313 Durood Shareef target in the Aamaal Circle today with full mindfulness of this tenfold promise.',
      },
      {
        number: 2,
        title: 'Sufficiency for All Worldly & Spiritual Worries',
        readTime: '4 min read',
        summary: 'The famous Hadith of Ubayy ibn Ka’b (RA) on dedicating time to Durood.',
        reference: 'Jami at-Tirmidhi 2457',
        arabic: 'إِذًا تُكْفَى هَمَّكَ وَيُغْفَرُ لَكَ ذَنْبُكَ',
        translation:
          '"Then your worries will be sufficed for you, and your sins will be forgiven."',
        romanUrdu:
          '"Phir tumhare saare gham aur pareshaniyan door kar di jayengi aur tumhare gunah maaf kar diye jayenge."',
        urdu: 'پھر تمہارے سارے غم اور پریشانیاںکافی ہو جائیں گی اور تمہارے گناہ معاف کر دیے جائیں گے۔',
        hindi:
          'फिर तुम्हारी सारी परेशानियाँ दूर कर दी जाएँगी और तुम्हारे गुनाह माफ़ कर दिए जाएँगे।',
        paragraphs: [
          'When Ubayy ibn Ka’b (RA) asked the Prophet ﷺ how much of his personal supplication time he should dedicate to sending Salawat, the Prophet ﷺ encouraged him until Ubayy said: "I will dedicate all of my supplication time to sending blessings upon you!"',
          'The Prophet ﷺ replied with this extraordinary glad tiding: that abundant Durood suffices a believer against every anxiety of this world and brings forgiveness in the Hereafter.',
        ],
        actionStep:
          'Whenever a worry crosses your mind today, pause and recite Durood Shareef 10 times immediately.',
      },
      {
        number: 3,
        title: 'Closeness to the Prophet ﷺ on the Day of Judgment',
        readTime: '3 min read',
        summary: 'Why the Aamaal Circle anchors its daily practice in 313 Salawat.',
        reference: 'Jami at-Tirmidhi 484',
        arabic: 'أَوْلَى النَّاسِ بِي يَوْمَ الْقِيَامَةِ أَكْثَرُهُمْ عَلَيَّ صَلَاةً',
        translation:
          '"The closest of people to me on the Day of Resurrection will be those who sent the most blessings upon me."',
        romanUrdu:
          '"Qayamat ke din mere sab se zyada qareeb woh log honge jo duniya mein mujh par sab se zyada Durood padhne wale the."',
        urdu: 'قیامت کے دن میرے سب سے زیادہ قریب وہ لوگ ہوں گے جو مجھ پر سب سے زیادہ درود پڑھنے والے تھے۔',
        hindi:
          'क़यामत के दिन मेरे सबसे ज़्यादा क़रीब वह लोग होंगे जो मुझ पर सबसे ज़्यादा दुरूद पढ़ने वाले थे।',
        paragraphs: [
          'The number 313 carries deep historical resonance in Islamic tradition—recalling the steadfast companions of Badr. Setting a structured daily target of 313 Durood Shareef transforms a vague good intention into a lifelong discipline.',
          'By dividing 313 across your five daily prayers (roughly 63 after each prayer), you finish the entire target effortlessly every single day.',
        ],
        actionStep:
          'Recite 63 Durood Shareef right after your next obligatory prayer.',
      },
    ],
  },
  {
    id: 'surah-mulk-shield',
    title: 'Surah Al-Mulk: The Nightly Shield',
    category: 'Quranic Reflections',
    icon: '🌙',
    description:
      'Understand the meanings, themes, and Prophetic promise of reciting the 30 verses of Surah Al-Mulk every night before sleeping.',
    lessons: [
      {
        number: 1,
        title: 'The Protector & Intercessor in the Grave',
        readTime: '3 min read',
        summary: 'Why the Prophet ﷺ never slept without reciting Surah Al-Mulk.',
        reference: 'Jami at-Tirmidhi 2890',
        arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
        translation:
          '"Blessed is He in whose hand is dominion, and He is over all things competent." (Surah Al-Mulk 67:1)',
        romanUrdu:
          '"Badi barakat wala hai Woh zaat jiske haath mein saari badshahi hai aur Woh har cheez par poori qudrat rakhne wala hai."',
        urdu: 'بڑی برکت والا ہے وہ جس کے ہاتھ میں بادشاہی ہے اور وہ ہر چیز پر قادر ہے۔',
        hindi:
          'बड़ी बरकत वाला है वह जिसके हाथ में बादशाही है और वह हर चीज़ पर क़ादिर है।',
        paragraphs: [
          'The Prophet ﷺ called Surah Al-Mulk "Al-Mani’ah" (The Protector/Preventer) because it shields its regular reciter from the punishment of the grave and intercedes for them until they are forgiven.',
          'Ending your night with these 30 verses renews your certainty that all sovereignty belongs to Allah alone before you close your eyes.',
        ],
        actionStep:
          'Keep your phone or Mushaf by your bedside and mark Surah Mulk in the Aamaal tab before sleeping tonight.',
      },
      {
        number: 2,
        title: 'The Purpose of Life & Death Tested by Deeds',
        readTime: '3 min read',
        summary: 'Quality of sincerity over quantity in Surah Al-Mulk Ayah 2.',
        reference: 'Surah Al-Mulk 67:2',
        arabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا',
        translation:
          '"He who created death and life to test you as to which of you is best in deed."',
        romanUrdu:
          '"Woh zaat jisne maut aur zindagi ko paida kiya taaki tumhein aazmaye ke tum mein se kis ke aamaal sab se behtareen hain."',
        urdu: 'جس نے موت اور زندگی کو پیدا کیا تاکہ تمہیں آزمائے کہ تم میں سے کس کے اعمال سب سے اچھے ہیں۔',
        hindi:
          'जिसने मौत और ज़िंदगी को पैदा किया ताकि तुम्हें आज़माए कि तुम में से किसके आमाल सबसे अच्छे हैं।',
        paragraphs: [
          'Notice that Allah says "Ahsanu Amala" (best in deed) rather than "most in deed." Classical scholars like Fudayl ibn Iyad explained that a deed is "best" when it combines pure sincerity (Ikhlas) for Allah with adherence to the Prophetic Sunnah.',
        ],
        actionStep:
          'Pause for 5 seconds before your next good deed to renew your intention purely for Allah’s pleasure.',
      },
    ],
  },
  {
    id: 'valley-of-makkah',
    title: 'The Valley of Makkah (Seerah)',
    category: 'Prophetic Biography',
    icon: '🕋',
    description:
      'Walk through the sacred history of Makkah—from the prayer of Ibrahim (AS) to the character and mission of Prophet Muhammad ﷺ.',
    lessons: [
      {
        number: 1,
        title: 'The Answered Prayer of Ibrahim (AS)',
        readTime: '3 min read',
        summary: 'How a barren valley became the spiritual heart of humanity.',
        reference: 'Surah Ibrahim 14:37',
        arabic: 'رَبَّنَا إِنِّي أَسْكَنْتُ مِنْ ذُرِّيَّتِي بِوَادٍ غَيْرِ ذِي زَرْعٍ عِنْدَ بَيْتِكَ الْمُحَرَّمِ',
        translation:
          '"Our Lord, I have settled some of my descendants in an uncultivated valley near Your Sacred House..."',
        romanUrdu:
          '"Aye hamare Rab! Beshak maine apni aulad ko Tere Hurmat wale Ghar ke paas ek be-aab-o-giyah waadi mein basaaya hai..."',
        urdu: 'اے ہمارے رب! میں نے اپنی اولاد کو تیرے حرمت والے گھر کے پاس ایک بے آب و گیاہ وادی میں بسایا ہے۔',
        hindi:
          'ऐ हमारे रब! मैंने अपनी औलाद को तेरे हुरमत वाले घर के पास एक बिना खेती की वादी में बसाया है।',
        paragraphs: [
          'Thousands of years before the birth of the Prophet ﷺ, Prophet Ibrahim (AS) left Hajar and infant Ismail (AS) in the parched valley of Makkah with full reliance upon Allah.',
          'From the gushing of Zamzam to the raising of the Ka’bah’s foundations, Makkah stands as living proof that sincere family supplications echo across generations.',
        ],
        actionStep:
          'Make a sincere Dua today for the faith and well-being of your family and future generations.',
      },
      {
        number: 2,
        title: 'Character Over Power: Al-Sadiq Al-Amin',
        readTime: '4 min read',
        summary: 'Why forty years of impeccable truthfulness preceded revelation.',
        reference: 'Sahih Al-Bukhari 7',
        arabic: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ',
        translation:
          '"And indeed, you are of a great moral character." (Surah Al-Qalam 68:4)',
        romanUrdu:
          '"Aur beshak Aap ﷺ akhlaq ke azeem martabe par faiz hain."',
        urdu: 'اور بے شک آپ ﷺ اخلاق کے عظیم مرتبے پر فائز ہیں۔',
        hindi: 'और बेशक आप ﷺ अख़लाक़ के अज़ीम मरतबे पर फ़ाइज़ हैं।',
        paragraphs: [
          'Long before the first revelation descended in Cave Hira, the people of Makkah entrusted their valuables to Muhammad ﷺ and called him Al-Sadiq (The Truthful) and Al-Amin (The Trustworthy).',
          'True spiritual leadership begins with reliability, kindness to family, and integrity in everyday transactions.',
        ],
        actionStep:
          'Practice one deliberate act of gentleness and honesty with a family member or colleague today.',
      },
    ],
  },
];

export default function ReadingHome({
  state,
  updateState,
  onShowToast,
  onBack,
}) {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeLessonNumber, setActiveLessonNumber] = useState(null);
  const [showPrefs, setShowPrefs] = useState(false);

  const [completedMap, setCompletedMap] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(LEARNING_PROGRESS_KEY) || 'null'
      );
      if (saved && typeof saved === 'object') return saved;
    } catch (_) {}
    return {
      'valley-of-makkah': [1],
    };
  });

  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(LEARNING_PREFS_KEY) || 'null'
      );
      if (saved) return saved;
    } catch (_) {}
    return {
      language: localStorage.getItem('aamaal_language') || 'en',
      bodyFontSize: 13.5,
      arabicFontSize: 24,
      showTakeaways: true,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify(completedMap));
    } catch (_) {}
  }, [completedMap]);

  const handleSavePrefs = (nextPrefs) => {
    setPreferences(nextPrefs);
    try {
      localStorage.setItem(LEARNING_PREFS_KEY, JSON.stringify(nextPrefs));
    } catch (_) {}
  };

  const selectedCourse =
    LEARNING_COURSES.find((c) => c.id === selectedCourseId) || null;

  const activeLesson =
    selectedCourse && activeLessonNumber
      ? selectedCourse.lessons.find((l) => l.number === activeLessonNumber)
      : null;

  const handleMarkLessonComplete = (courseId, lessonNum) => {
    setCompletedMap((prev) => {
      const currentList = prev[courseId] || [];
      if (currentList.includes(lessonNum)) return prev;
      return {
        ...prev,
        [courseId]: [...currentList, lessonNum],
      };
    });

    if (updateState) {
      updateState((prev) => ({
        ...prev,
        sessionsCount: (prev.sessionsCount || 0) + 1,
        storyLesson:
          courseId === 'valley-of-makkah'
            ? Math.min(lessonNum + 1, 6)
            : prev.storyLesson,
      }));
    }

    const courseObj = LEARNING_COURSES.find((c) => c.id === courseId);
    const totalInCourse = courseObj ? courseObj.lessons.length : 1;

    if (lessonNum < totalInCourse) {
      setActiveLessonNumber(lessonNum + 1);
      if (onShowToast) {
        onShowToast(`Completed Lesson ${lessonNum}! Opening Lesson ${lessonNum + 1}`);
      }
    } else {
      setActiveLessonNumber(null);
      if (onShowToast) {
        onShowToast(`MashaAllah! Completed "${courseObj?.title}"!`);
      }
    }
  };

  return (
    <section className="screen-section no-scrollbar px-5 pt-4 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          {onBack && !selectedCourse && (
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
              Guided Knowledge &amp; Seerah
            </span>
            <h2 className="font-serif text-[23px] font-semibold text-primary leading-tight">
              Islamic Learning Hub
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowPrefs(!showPrefs)}
          className="px-3 py-1.5 rounded-full bg-[#EAE8D7] border border-[#D5D2BE] text-primary text-[11.5px] font-semibold"
        >
          ⚙️ Display
        </button>
      </div>

      {/* Collapsible Reader Preferences */}
      {showPrefs && (
        <ReadingPreferences
          preferences={preferences}
          onUpdatePreferences={handleSavePrefs}
          onClose={() => setShowPrefs(false)}
        />
      )}

      {/* VIEW 1: LESSON READER */}
      {selectedCourse && activeLesson ? (
        <LessonReader
          course={selectedCourse}
          lesson={activeLesson}
          totalLessons={selectedCourse.lessons.length}
          isCompleted={(completedMap[selectedCourse.id] || []).includes(
            activeLesson.number
          )}
          preferences={preferences}
          onMarkCompleteAndNext={(num) =>
            handleMarkLessonComplete(selectedCourse.id, num)
          }
          onSelectLessonByNumber={(num) => setActiveLessonNumber(num)}
          onBackToCourse={() => setActiveLessonNumber(null)}
        />
      ) : selectedCourse ? (
        /* VIEW 2: COURSE DETAILS & SYLLABUS */
        <CourseDetails
          course={selectedCourse}
          completedLessonNumbers={completedMap[selectedCourse.id] || []}
          onSelectLesson={(lessonObj) => setActiveLessonNumber(lessonObj.number)}
          onResetCourseProgress={(courseId) => {
            setCompletedMap((prev) => ({ ...prev, [courseId]: [] }));
            if (onShowToast) onShowToast('Course progress reset');
          }}
          onBack={() => {
            setSelectedCourseId(null);
            setActiveLessonNumber(null);
          }}
        />
      ) : (
        /* VIEW 3: MAIN LEARNING HUB HOME */
        <div className="space-y-3">
          <ReadingProgress
            courses={LEARNING_COURSES}
            completedLessonsMap={completedMap}
            lastActiveCourseId="valley-of-makkah"
            onResumeCourse={(courseObj, lessonNum) => {
              setSelectedCourseId(courseObj.id);
              setActiveLessonNumber(lessonNum);
            }}
          />

          <div className="flex items-center justify-between px-0.5 pt-1">
            <h3 className="font-serif text-[17px] font-semibold text-primary">
              Featured Study Tracks
            </h3>
            <span className="text-[11px] font-semibold text-secondary">
              {LEARNING_COURSES.length} Courses
            </span>
          </div>

          <div className="space-y-2.5">
            {LEARNING_COURSES.map((course) => {
              const doneList = completedMap[course.id] || [];
              const total = course.lessons.length;
              const pct = Math.round((doneList.length / total) * 100);

              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => {
                    try {
                      if (navigator.vibrate) navigator.vibrate(10);
                    } catch (_) {}
                    setSelectedCourseId(course.id);
                    setActiveLessonNumber(null);
                  }}
                  className="w-full text-left card rounded-[20px] p-4 space-y-2.5 active:scale-[0.99] transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#165534] to-[#08351D] text-[#F0D58C] border border-[#C99E4C]/40 flex items-center justify-center text-[21px] shrink-0 shadow-sm">
                        {course.icon}
                      </div>
                      <div>
                        <span className="badge-pill">{course.category}</span>
                        <h4 className="font-serif text-[16.5px] font-semibold text-primary mt-0.5">
                          {course.title}
                        </h4>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-[#DCE3C8] text-[#0D4A2E] text-[10px] font-bold shrink-0">
                      {doneList.length}/{total} Lessons
                    </span>
                  </div>

                  <p className="text-[12px] text-secondary leading-relaxed line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="w-36 h-1.5 rounded-full bg-[#DEDCCF] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#135332]"
                        style={{ width: `${Math.max(pct, 6)}%` }}
                      />
                    </div>
                    <span className="text-[11.5px] font-bold text-[#0D4A2E]">
                      Open Course ›
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}