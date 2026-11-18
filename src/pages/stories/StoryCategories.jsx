//Exports the default authentic STORIES_LIBRARY (The Valley of Makkah (6 Lessons), The Youths of the Cave (Ashab al-Kahf), The Shield of Surah Al-Mulk, and Miracles of Abundant Salawat) with pure Arabic verses/Hadith and 4-language meanings, and renders the interactive category filter bar and category cards.

import React from 'react';

export const STORY_CATEGORIES_META = [
  {
    id: 'all',
    label: 'All Stories',
    icon: '✨',
  },
  {
    id: 'Seerah',
    label: '🕋 Prophetic Seerah',
    icon: '🕋',
  },
  {
    id: 'Quranic',
    label: '📖 Quranic Parables',
    icon: '📖',
  },
  {
    id: 'Sahaba',
    label: '🌟 Companions & Salawat',
    icon: '🌟',
  },
];

export const DEFAULT_STORIES_LIBRARY = [
  {
    id: 'valley-of-makkah',
    title: 'The Valley of Makkah',
    subtitle: 'Character Over Power • 6 Illustrated Chapters',
    category: 'Seerah',
    readTime: '6 Chapters',
    coverImage:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=700&q=80',
    arabic: 'رَبَّنَا إِنِّي أَسْكَنْتُ مِنْ ذُرِّيَّتِي بِوَادٍ غَيْرِ ذِي زَرْعٍ عِنْدَ بَيْتِكَ الْمُحَرَّمِ',
    reference: 'Surah Ibrahim 14:37',
    translations: {
      en: '"Our Lord, I have settled some of my descendants in an uncultivated valley near Your Sacred House, our Lord, that they may establish prayer..."',
      romanUrdu:
        '"Aye hamare Rab! Beshak maine apni aulad ko Tere Hurmat wale Ghar ke paas ek be-aab-o-giyah waadi mein basaaya hai taaki woh Namaz qaim karein..."',
      ur: 'اے ہمارے رب! بے شک میں نے اپنی اولاد کو تیرے حرمت والے گھر کے پاس ایک بے آب و گیاہ وادی میں بسایا ہے تاکہ وہ نماز قائم کریں۔',
      hi: 'ऐ हमारे रब! बेशक मैंने अपनी औलाद को तेरे हुरमत वाले घर के पास एक बिना खेती की वादी में बसाया है ताकि वे नमाज़ क़ायम करें।',
    },
    chapters: [
      {
        chapter: 1,
        title: 'The Sanctuary of Ibrahim (AS)',
        image:
          'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=700&q=80',
        body: 'Long before any caravan crossed the desert of Hijaz, Prophet Ibrahim (AS) left Hajar and infant Ismail (AS) in the barren valley of Bakkah with unwavering trust in Allah. From their patience gushed the blessed spring of Zamzam.',
        takeaway: 'Sincere reliance upon Allah turns barren valleys into springs of eternal blessing.',
      },
      {
        chapter: 2,
        title: 'Character Over Power (Al-Sadiq Al-Amin)',
        image:
          'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=700&q=80',
        body: 'For forty years prior to revelation, Muhammad ﷺ walked the streets of Makkah known universally as Al-Sadiq (The Truthful) and Al-Amin (The Trustworthy). Even his fiercest opponents entrusted their most precious deposits to him.',
        takeaway: 'True spiritual transformation begins with impeccable honesty and kindness in daily life.',
      },
      {
        chapter: 3,
        title: 'The Cave of Hira & First Light',
        image:
          'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=700&q=80',
        body: 'High above the noise of Makkah in Cave Hira, Jibril (AS) descended with the first command of the Quran: "Iqra bismi Rabbika alladhi khalaq" (Read in the Name of your Lord Who created).',
        takeaway: 'Protect quiet daily moments of solitude for Dhikr and reflection.',
      },
      {
        chapter: 4,
        title: 'Steadfastness of the Early Circle',
        image:
          'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=700&q=80',
        body: 'In the house of Al-Arqam (RA), the early believers gathered quietly to recite the Quran, purify their hearts, and support one another through every trial.',
        takeaway: 'A righteous circle of remembrance strengthens every individual within it.',
      },
      {
        chapter: 5,
        title: 'The Night Journey of Comfort',
        image:
          'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80',
        body: 'After the Year of Sorrow, Allah honored His Messenger ﷺ with Al-Isra wal-Mi’raj—showing that after the deepest earthly hardship comes direct closeness to the Divine.',
        takeaway: 'Never despair during heavy seasons; relief and elevation follow patience.',
      },
      {
        chapter: 6,
        title: 'Dawn of Brotherhood in Madinah',
        image:
          'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=700&q=80',
        body: 'The Hijrah established a community anchored in the Masjid, bound together by brotherhood between the Muhajirun and Ansar, and illuminated by constant Salawat and remembrance.',
        takeaway: 'Carry the spirit of the Prophetic community by praying for your brothers and sisters daily.',
      },
    ],
  },
  {
    id: 'youths-of-the-cave',
    title: 'The Youths of the Cave (Ashab al-Kahf)',
    subtitle: 'Faith Under Pressure • Surah Al-Kahf Reflection',
    category: 'Quranic',
    readTime: '3 Chapters',
    coverImage:
      'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=700&q=80',
    arabic: 'رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا',
    reference: 'Surah Al-Kahf 18:10',
    translations: {
      en: '"Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance."',
      romanUrdu:
        '"Aye hamare Rab! Hamein apni khaas rehmat ata farma aur hamare kaam mein hamare liye durustgi aur hidayat ka raasta muhayya farma."',
      ur: 'اے ہمارے رب! ہمیں اپنی طرف سے رحمت عطا فرما اور ہمارے کام میں ہمارے لیے راہِ راست مہیا فرما۔',
      hi: 'ऐ हमारे रब! हमें अपनी तरफ़ से रहमत अता फ़रमा और हमारे काम में हमारे लिए सही रास्ता तैयार कर दे।',
    },
    chapters: [
      {
        chapter: 1,
        title: 'Standing Firm for Tawheed',
        image:
          'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=700&q=80',
        body: 'A small group of noble young believers chose to leave behind comfort and status rather than compromise their pure faith in Allah alone.',
        takeaway: 'When you protect your faith, Allah increases you in guidance and courage.',
      },
      {
        chapter: 2,
        title: 'The Supplication at the Cave Entrance',
        image:
          'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=700&q=80',
        body: 'Before taking shelter in the mountain cave, their first action was to raise their hands and ask Allah for Rahmah (Mercy) and Rashad (Right Guidance).',
        takeaway: 'Begin every uncertain step in life with the Quranic Dua of Surah Al-Kahf 18:10.',
      },
      {
        chapter: 3,
        title: 'Divine Protection Across Three Centuries',
        image:
          'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80',
        body: 'Allah caused them to sleep peacefully as the sun inclined away from their cave gently, turning them and preserving them for 309 lunar years.',
        takeaway: 'Recite Surah Al-Kahf and abundant Salawat every Thursday night and Friday.',
      },
    ],
  },
  {
    id: 'ubayy-salawat-story',
    title: 'The Gift of Ubayy ibn Ka’b (RA)',
    subtitle: 'How Abundant Salawat Suffices Every Worry',
    category: 'Sahaba',
    readTime: '3 Chapters',
    coverImage:
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=700&q=80',
    arabic: 'إِذًا تُكْفَى هَمَّكَ وَيُغْفَرُ لَكَ ذَنْبُكَ',
    reference: 'Jami at-Tirmidhi 2457',
    translations: {
      en: '"Then your worries will be sufficed for you, and your sins will be forgiven."',
      romanUrdu:
        '"Phir tumhare saare gham aur fikr door kar diye jayenge aur tumhare gunah bakhsh diye jayenge."',
      ur: 'پھر تمہارے سارے غم کافی ہو جائیں گے اور تمہارے گناہ معاف کر دیے جائیں گے۔',
      hi: 'फिर तुम्हारी सारी चिंताएँ दूर कर दी जाएँगी और तुम्हारे गुनाह माफ़ कर दिए जाएँगे।',
    },
    chapters: [
      {
        chapter: 1,
        title: 'A Question from a Devoted Companion',
        image:
          'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=700&q=80',
        body: 'Ubayy ibn Ka’b (RA), the master reciter among the Companions, asked the Messenger of Allah ﷺ how much of his night prayer supplication he should dedicate to sending Salawat upon him.',
        takeaway: 'The Companions eagerly sought the deeds that bring the greatest closeness to Allah.',
      },
      {
        chapter: 2,
        title: 'Increasing Until All Time Was Salawat',
        image:
          'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=700&q=80',
        body: 'From a quarter, to half, to two-thirds—each time the Prophet ﷺ replied: "Whatever you wish, and if you increase it, that is even better for you," until Ubayy dedicated all his supplication time to Salawat.',
        takeaway: 'There is no limit to the barakah of increasing your daily Durood Shareef.',
      },
      {
        chapter: 3,
        title: 'TheTwofold Promise of Relief & Forgiveness',
        image:
          'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=700&q=80',
        body: 'The Prophet ﷺ sealed the conversation with the glad tiding that Allah will suffice all of your worldly worries and forgive your shortcomings through abundant Salawat.',
        takeaway: 'Anchor your day in the Aamaal Circle’s 313 Durood Shareef target.',
      },
    ],
  },
];

export default function StoryCategories({
  activeCategory = 'all',
  onSelectCategory,
}) {
  return (
    <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5 mb-3.5">
      {STORY_CATEGORIES_META.map((cat) => {
        const isSelected = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              try {
                if (navigator.vibrate) navigator.vibrate(8);
              } catch (_) {}
              if (onSelectCategory) onSelectCategory(cat.id);
            }}
            className={`px-3.5 py-1.5 rounded-full text-[11.5px] font-semibold whitespace-nowrap border transition ${
              isSelected
                ? 'bg-[#0D4A2E] text-white border-[#C99E4C]/50 shadow-sm'
                : 'bg-[#F3EFE2] text-primary border-white/90 shadow-soft-card'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}