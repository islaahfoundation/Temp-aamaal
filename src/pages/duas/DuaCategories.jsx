//Exports the default authentic DUA_COLLECTION (with pure Arabic script + English, Roman Urdu, Urdu, and Hindi meanings—no Roman Arabic transliteration) and renders the visual Category Grid.

import React from 'react';

export const DUA_CATEGORIES_META = [
  {
    id: 'all',
    title: 'All Duas',
    subtitle: 'Complete library of supplications',
    icon: '🤲',
  },
  {
    id: 'saved',
    title: 'Saved',
    subtitle: 'Your personal bookmarked collection',
    icon: '🔖',
  },
  {
    id: 'Daily',
    title: 'Morning & Evening',
    subtitle: 'Daily protection & Sunnah remembrance',
    icon: '🌅',
  },
  {
    id: 'Peace',
    title: 'Peace & Ease',
    subtitle: 'Comfort during hardship & worry',
    icon: '🌿',
  },
  {
    id: 'Forgiveness',
    title: 'Repentance & Mercy',
    subtitle: 'Seeking pardon and spiritual renewal',
    icon: '✨',
  },
  {
    id: 'Family',
    title: 'Family & Knowledge',
    subtitle: 'Blessings for parents, children & wisdom',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'Gratitude',
    title: 'Durood & Gratitude',
    subtitle: 'Salawat upon the Prophet ﷺ & thanks',
    icon: '💚',
  },
];

export const DEFAULT_DUAS_LIBRARY = [
  {
    id: 'ease-in-affairs',
    category: 'Peace',
    badge: 'SEEKING EASE',
    title: 'Supplication for Ease in Difficult Tasks',
    shortDesc: 'Recite when any matter feels heavy or challenging.',
    arabic:
      'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    translation:
      'O Allah, nothing is easy except what You make easy, and You alone can turn a difficult situation into ease whenever You will.',
    romanUrdu:
      'Aye Allah! Koi kaam aasan nahi magar jise Tu aasan bana de, aur Tu hi har mushkil aur sakhti ko jab chahe aasan farma deta hai.',
    urdu: 'اے اللہ! کوئی کام آسان نہیں مگر جسے تو آسان بنا دے، اور تو ہی ہر مشکل کو جب چاہے آسان فرما دیتا ہے۔',
    hindi:
      'ऐ अल्लाह! कोई काम आसान नहीं मगर जिसे तू आसान बना दे, और तू ही हर मुश्किल को जब चाहे आसान फरमा देता है।',
    benefits:
      'Cultivates complete reliance on Allah when facing life tests, exams, or overwhelming responsibilities.',
    recommendedTime: 'Whenever facing a difficult task or decision',
    reference: 'Sahih Ibn Hibban 974',
    authenticity: 'Authentic',
    repeatCount: 3,
  },
  {
    id: 'anxious-heart',
    category: 'Peace',
    badge: 'PROPHETIC REFUGE',
    title: 'Reliance Upon Allah in Times of Worry',
    shortDesc: 'Brings calm and strength to a restless heart.',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    translation:
      'Allah is completely sufficient for us, and He is the finest Guardian of all affairs.',
    romanUrdu:
      'Hamare liye Allah hi kaafi hai aur Woh behtareen kaarsaaz aur hifazat farmane wala hai.',
    urdu: 'ہمارے لیے اللہ ہی کافی ہے اور وہ بہترین کارساز ہے۔',
    hindi: 'हमारे लिए अल्लाह ही काफ़ी है और वह बेहतरीन कारसाज़ है।',
    benefits:
      'Recited by Prophet Ibrahim (AS) and Prophet Muhammad ﷺ during moments of intense trial, bringing immediate tranquility.',
    recommendedTime: 'Morning, evening & moments of anxiety',
    reference: 'Surah Aal-e-Imran 3:173',
    authenticity: 'Quranic',
    repeatCount: 7,
  },
  {
    id: 'master-forgiveness',
    category: 'Forgiveness',
    badge: 'DAILY ISTIGHFAR',
    title: 'Sincere Repentance & Seeking Pardon',
    shortDesc: 'Daily plea for mercy and cleansing of the heart.',
    arabic:
      'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
    translation:
      'My Lord, grant me forgiveness and accept my repentance; truly You are the Ever-Accepting of repentance, the Most Merciful.',
    romanUrdu:
      'Aye mere Rab! Meri maghfirat farma aur meri tauba qubool kar, beshak Tu hi tauba qubool karne wala aur bada meharban hai.',
    urdu: 'اے میرے رب! مجھے معاف کر اور میری توبہ قبول فرما، بے شک تو ہی توبہ قبول کرنے والا اور مہربان ہے۔',
    hindi:
      'ऐ मेरे रब! मुझे माफ़ कर और मेरी तौबा क़ुबूल फ़रमा, बेशक तू ही तौबा क़ुबूल करने वाला और मेहरबान है।',
    benefits:
      'The Companions counted the Prophet ﷺ reciting this supplication up to a hundred times in a single gathering.',
    recommendedTime: 'After prayers & before sleeping',
    reference: 'Sunan Abi Dawud 1516',
    authenticity: 'Sahih',
    repeatCount: 100,
  },
  {
    id: 'morning-evening-wellbeing',
    category: 'Daily',
    badge: 'MORNING & EVENING',
    title: 'Supplication for Complete Well-Being (Afiyah)',
    shortDesc: 'Ask for safety in faith, worldly life, family, and wealth.',
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
    translation:
      'O Allah, I ask You for pardon and complete well-being in this world and in the Hereafter.',
    romanUrdu:
      'Aye Allah! Main Tujhse duniya aur aakhirat dono mein maafi aur mukammal aafiyat (sukoon aur hifazat) ka sawal karta hoon.',
    urdu: 'اے اللہ! میں تجھ سے دنیا اور آخرت میں معافی اور عافیت کا سوال کرتا ہوں۔',
    hindi: 'ऐ अल्लाह! मैं तुझसे दुनिया और आख़िरत में माफ़ी और आफ़ियत का सवाल करता हूँ।',
    benefits:
      'The Prophet ﷺ taught that no one is given a greater gift after certainty of faith than Afiyah (comprehensive well-being).',
    recommendedTime: 'Every morning after Fajr & evening after Asr/Maghrib',
    reference: 'Sunan Ibn Majah 3871',
    authenticity: 'Sahih',
    repeatCount: 3,
  },
  {
    id: 'parents-mercy',
    category: 'Family',
    badge: 'FOR PARENTS',
    title: 'Supplication for Parents’ Mercy & Care',
    shortDesc: 'Honor and pray for your mother and father daily.',
    arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    translation:
      'My Lord, shower Your mercy upon them both, just as they cared for me and raised me when I was small.',
    romanUrdu:
      'Aye mere Rab! Mere walidain par apni rehmat naazil farma jis tarah unhon ne bachpan mein meri mohabbat se parwarish ki.',
    urdu: 'اے میرے رب! ان دونوں پر رحم فرما جیسا کہ انہوں نے بچپن میں میری پرورش کی۔',
    hindi:
      'ऐ मेरे रब! मेरे माता-पिता पर रहम फ़रमा जैसा कि उन्होंने बचपन में मेरी परवरिश की।',
    benefits:
      'A continuous charity and source of elevated ranks for parents in this life and the Hereafter.',
    recommendedTime: 'After every obligatory prayer',
    reference: 'Surah Al-Isra 17:24',
    authenticity: 'Quranic',
    repeatCount: 1,
  },
  {
    id: 'beneficial-knowledge',
    category: 'Family',
    badge: 'MORNING SUNNAH',
    title: 'Dua for Beneficial Knowledge & Pure Provision',
    shortDesc: 'Begin the day with purposeful knowledge and accepted deeds.',
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    translation:
      'O Allah, I ask You for knowledge that benefits, provision that is pure, and deeds that are accepted by You.',
    romanUrdu:
      'Aye Allah! Main Tujhse faida dene wale ilm, paakiza rizq, aur qubool hone wale nek aamaal ka sawal karta hoon.',
    urdu: 'اے اللہ! میں تجھ سے نفع بخش علم، پاکیزہ رزق اور مقبول عمل کا سوال کرتا ہوں۔',
    hindi:
      'ऐ अल्लाह! मैं तुझसे फ़ायदेमंद इल्म, पाकीज़ा रिज़्क़ और मक़बूल अमल का सवाल करता हूँ।',
    benefits:
      'Combines the three pillars of a believer’s day: sound understanding, lawful sustenance, and sincere action.',
    recommendedTime: 'Every morning after Fajr prayer',
    reference: 'Sunan Ibn Majah 925',
    authenticity: 'Sahih',
    repeatCount: 1,
  },
  {
    id: 'thursday-salawat',
    category: 'Gratitude',
    badge: 'DAILY & THURSDAY SALAWAT',
    title: 'Durood Ibrahimiyyah',
    shortDesc: 'Send abundant peace and blessings upon the Prophet ﷺ.',
    arabic:
      'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    translation:
      'O Allah, send Your grace, honor, and mercy upon Muhammad ﷺ and the family of Muhammad ﷺ, as You sent blessings upon Ibrahim (AS) and the family of Ibrahim (AS); truly You are Praiseworthy, Glorious.',
    romanUrdu:
      'Aye Allah! Rehmat aur barakat naazil farma Muhammad ﷺ par aur Aap ﷺ ki Aal par, jis tarah Tu ne rehmat naazil farmayi Ibrahim (AS) aur unki Aal par, beshak Tu tareef wala aur buzurgi wala hai.',
    urdu: 'اے اللہ! رحمت نازل فرما محمد ﷺ اور آلِ محمد ﷺ پر جیسا کہ تو نے رحمت نازل فرمائی ابراہیم علیہ السلام اور آلِ ابراہیم پر، بے شک تو تعریف والا اور بزرگی والا ہے۔',
    hindi:
      'ऐ अल्लाह! मुहम्मद ﷺ और आप ﷺ की आल पर रहमत नाज़िल फ़रमा, जैसा तूने इब्राहीम (अ.स.) और उनकी आल पर रहमत नाज़िल फ़रमाई, बेशक तू तारीफ़ वाला और बुज़ुर्गी वाला है।',
    benefits:
      'Whoever sends one blessing upon the Prophet ﷺ, Allah sends ten blessings upon him, forgives ten sins, and raises him ten degrees.',
    recommendedTime: 'Throughout the day (313x target) & abundantly on Thursday/Friday',
    reference: 'Sahih Al-Bukhari 3370',
    authenticity: 'Sahih',
    repeatCount: 10,
  },
];

export default function DuaCategories({
  duasList = DEFAULT_DUAS_LIBRARY,
  savedCount = 0,
  activeCategory = 'all',
  showingSavedOnly = false,
  onSelectCategory,
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 mb-4">
      {DUA_CATEGORIES_META.map((cat) => {
        const count =
          cat.id === 'all'
            ? duasList.length
            : cat.id === 'saved'
            ? savedCount
            : duasList.filter((d) => d.category === cat.id).length;

        const isSelected =
          cat.id === 'saved'
            ? showingSavedOnly
            : !showingSavedOnly && activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              try {
                if (navigator.vibrate) navigator.vibrate(10);
              } catch (_) {}
              if (onSelectCategory) onSelectCategory(cat.id);
            }}
            className={`text-left rounded-[18px] p-3 border transition active:scale-[0.98] ${
              isSelected
                ? 'bg-[#0F4C2B] text-white border-[#C99E4C] shadow-md'
                : 'bg-[#F3EFE2] text-primary border-white/90 shadow-soft-card'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[18px]">{cat.icon}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold ${
                  isSelected
                    ? 'bg-[#DFB75A] text-[#07361D]'
                    : 'bg-[#EAE8D7] text-primary'
                }`}
              >
                {count} {count === 1 ? 'Dua' : 'Duas'}
              </span>
            </div>
            <h4
              className={`font-serif text-[14px] font-semibold leading-tight ${
                isSelected ? 'text-white' : 'text-primary'
              }`}
            >
              {cat.title}
            </h4>
            <p
              className={`text-[10.5px] mt-0.5 line-clamp-1 ${
                isSelected ? 'text-white/80' : 'text-secondary'
              }`}
            >
              {cat.subtitle}
            </p>
          </button>
        );
      })}
    </div>
  );
}