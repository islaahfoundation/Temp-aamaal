//Allows creating a new daily or weekly Sunnah reminder (e.g., Morning 313 Durood Shareef, Surah Al-Mulk Before Sleep, Thursday Salawat Circle, 100x Daily Istighfar, or a custom reminder) with time, repeat days, and target Aamaal link.

import React, { useState } from 'react';

const PRESET_TEMPLATES = [
  {
    id: 'preset_durood',
    title: '313 Durood Shareef Circle',
    category: 'Daily Aamaal',
    time: '07:30',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    translation: 'O Allah, send peace and blessings upon Muhammad ﷺ and the family of Muhammad ﷺ.',
    romanUrdu: 'Aye Allah! Muhammad ﷺ aur Aap ﷺ ki Aal par rehmat aur barakat naazil farma.',
    urdu: 'اے اللہ! محمد ﷺ اور آلِ محمد ﷺ پر رحمت بھیج۔',
    hindi: 'ऐ अल्लाह! मुहम्मद ﷺ और आप ﷺ की आल पर रहमत नाज़िल फ़रमा।',
  },
  {
    id: 'preset_mulk',
    title: 'Surah Al-Mulk Before Sleep',
    category: 'Night Protection',
    time: '21:45',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    translation: 'Blessed is He in whose hand is dominion, and He is over all things competent.',
    romanUrdu: 'Badi barakat wala hai Woh zaat jiske haath mein saari badshahi hai.',
    urdu: 'بڑی برکت والا ہے وہ جس کے ہاتھ میں بادشاہی ہے۔',
    hindi: 'बड़ी बरकत वाला है वह जिसके हाथ में बादशाही है।',
  },
  {
    id: 'preset_thursday',
    title: 'Thursday Night Abundant Salawat',
    category: 'Weekly Sunnah',
    time: '18:30',
    days: ['Thu', 'Fri'],
    arabic: 'إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ',
    translation: 'Indeed, Allah and His angels send blessings upon the Prophet ﷺ.',
    romanUrdu: 'Beshak Allah aur Uske farishte Nabi ﷺ par Durood bhejte hain.',
    urdu: 'بے شک اللہ اور اس کے فرشتے نبی ﷺ پر درود بھیجتے ہیں۔',
    hindi: 'बेशक अल्लाह और उसके फ़रिश्ते नबी ﷺ पर दुरूद भेजते हैं।',
  },
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CreateReminder({
  onSaveReminder,
  onCancel,
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Daily Aamaal');
  const [time, setTime] = useState('07:30');
  const [selectedDays, setSelectedDays] = useState(WEEK_DAYS);
  const [arabic, setArabic] = useState('اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ');
  const [translation, setTranslation] = useState(
    'O Allah, send peace and blessings upon Muhammad ﷺ and the family of Muhammad ﷺ.'
  );
  const [romanUrdu, setRomanUrdu] = useState(
    'Aye Allah! Muhammad ﷺ aur Aap ﷺ ki Aal par rehmat aur barakat naazil farma.'
  );

  const applyTemplate = (tpl) => {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (_) {}
    setTitle(tpl.title);
    setCategory(tpl.category);
    setTime(tpl.time);
    setSelectedDays(tpl.days);
    setArabic(tpl.arabic);
    setTranslation(tpl.translation);
    setRomanUrdu(tpl.romanUrdu);
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
    } catch (_) {}

    if (onSaveReminder) {
      onSaveReminder({
        id: `rem_${Date.now()}`,
        title: title.trim(),
        category,
        time,
        days: selectedDays.length > 0 ? selectedDays : WEEK_DAYS,
        arabic,
        translation,
        romanUrdu,
        enabled: true,
        createdAt: Date.now(),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card rounded-[22px] p-4 space-y-3.5 bg-[#EAE8D7] border border-[#0D4A2E]/30 fade-in"
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="badge-pill">New Alert Schedule</span>
          <h3 className="font-serif text-[18px] font-semibold text-primary mt-1">
            🔔 Create Sunnah Reminder
          </h3>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-7 h-7 rounded-full bg-[#F5F2E8] flex items-center justify-center text-primary font-bold text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick Sunnah Presets */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-1.5">
          Quick Fill Preset
        </span>
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {PRESET_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => applyTemplate(tpl)}
              className="px-3 py-1.5 rounded-full bg-[#F5F2E8] border border-[#DCD8C6] text-primary text-[11px] font-semibold whitespace-nowrap hover:bg-[#DCE3C8] transition"
            >
              + {tpl.title}
            </button>
          ))}
        </div>
      </div>

      {/* Title Input */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
          Reminder Title
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Recite 313 Durood Shareef"
          className="bg-[#F5F2E8] text-primary text-[13px] font-semibold"
        />
      </div>

      {/* Time & Category Row */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
            Alert Time
          </label>
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-[#F5F2E8] text-primary text-[13px] font-bold"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#F5F2E8] text-primary text-[12px] font-semibold"
          >
            <option value="Daily Aamaal">Daily Aamaal</option>
            <option value="Night Protection">Night Protection</option>
            <option value="Weekly Sunnah">Weekly Sunnah</option>
            <option value="Morning & Evening">Morning &amp; Evening</option>
          </select>
        </div>
      </div>

      {/* Days of the Week Selector */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1.5">
          Repeat Days
        </label>
        <div className="grid grid-cols-7 gap-1">
          {WEEK_DAYS.map((day) => {
            const active = selectedDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`py-1.5 rounded-xl text-[11px] font-bold border transition ${
                  active
                    ? 'bg-[#0D4A2E] text-[#F0D58C] border-[#0D4A2E]'
                    : 'bg-[#F5F2E8] text-secondary border-[#DCD8C6]'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-1">
        <button
          type="submit"
          className="btn-primary flex-1 py-2.5 text-[13px] font-semibold shadow-sm"
        >
          Save Reminder
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary px-4 py-2.5 text-[12.5px] font-semibold"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}