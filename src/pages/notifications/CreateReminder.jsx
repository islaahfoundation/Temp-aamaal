//Allows creating a new daily or weekly Sunnah reminder (e.g., Morning 313 Durood Shareef, Surah Al-Mulk Before Sleep, Thursday Salawat Circle, 100x Daily Istighfar, or a custom reminder) with time, repeat days, and target Aamaal link.

import React, { useState } from 'react';
import { DEFAULT_AAMAAL_LIST } from '../aamaal/AamaalCategories';

const PRESET_TEMPLATES = [
  {
    id: 'preset_durood',
    title: '313 Durood Shareef Circle',
    category: 'Daily Aamaal',
    linkedAamaalId: 'durood_313',
    times: ['08:00', '14:00', '20:00'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    translation:
      'O Allah, send peace and blessings upon Muhammad ﷺ and the family of Muhammad ﷺ.',
    romanUrdu:
      'Aye Allah! Muhammad ﷺ aur Aap ﷺ ki Aal par rehmat aur barakat naazil farma.',
    urdu: 'اے اللہ! محمد ﷺ اور آلِ محمد ﷺ پر رحمت و برکت نازل فرما۔',
    hindi: 'ऐ अल्लाह! मुहम्मद ﷺ और आप ﷺ की आल पर रहमत व बरकत नाज़िल फ़रमा।',
  },
  {
    id: 'preset_mulk',
    title: 'Surah Al-Mulk Before Sleep',
    category: 'Night Protection',
    linkedAamaalId: 'surah_mulk',
    times: ['21:45'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    translation:
      'Blessed is He in whose hand is dominion, and He is over all things competent.',
    romanUrdu:
      'Badi barakat wala hai Woh zaat jiske haath mein saari badshahi hai.',
    urdu: 'بڑی برکت والا ہے وہ ذات جس کے ہاتھ میں ساری بادشاہی ہے۔',
    hindi: 'बड़ी बरकत वाला है वह ज़ात जिसके हाथ में सारी बादशाही है।',
  },
  {
    id: 'preset_thursday',
    title: 'Thursday Night Abundant Salawat',
    category: 'Weekly Sunnah',
    linkedAamaalId: 'durood_313',
    times: ['18:30', '21:00'],
    days: ['Thu', 'Fri'],
    arabic: 'إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ',
    translation:
      'Indeed, Allah and His angels send blessings upon the Prophet ﷺ.',
    romanUrdu:
      'Beshak Allah aur Uske farishte Nabi ﷺ par Durood bhejte hain.',
    urdu: 'بے شک اللہ اور اس کے فرشتے نبی ﷺ پر درود بھیجتے ہیں۔',
    hindi: 'बेशक अल्लाह और उसके फ़रिश्ते नबी ﷺ पर दुरूद भेजते हैं।',
  },
];

const INTERVAL_PRESETS = [
  { id: '3x', label: '3x Daily', times: ['08:00', '14:00', '20:00'] },
  {
    id: '3h',
    label: 'Every 3 Hours',
    times: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
  },
  {
    id: '4h',
    label: 'Every 4 Hours',
    times: ['06:00', '10:00', '14:00', '18:00', '22:00'],
  },
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CreateReminder({
  onSaveReminder,
  onCancel,
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Daily Aamaal');
  const [linkedAamaalId, setLinkedAamaalId] = useState('durood_313');
  const [times, setTimes] = useState(['07:30']);
  const [newTimeInput, setNewTimeInput] = useState('13:30');
  const [selectedDays, setSelectedDays] = useState(WEEK_DAYS);
  const [arabic, setArabic] = useState(
    'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ'
  );
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
    setLinkedAamaalId(tpl.linkedAamaalId || '');
    setTimes(tpl.times || ['07:30']);
    setSelectedDays(tpl.days);
    setArabic(tpl.arabic);
    setTranslation(tpl.translation);
    setRomanUrdu(tpl.romanUrdu);
  };

  const handleAddTime = () => {
    if (!newTimeInput) return;
    if (!times.includes(newTimeInput)) {
      setTimes((prev) => [...prev, newTimeInput].sort());
    }
  };

  const handleRemoveTime = (t) => {
    if (times.length <= 1) return;
    setTimes((prev) => prev.filter((item) => item !== t));
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || times.length === 0) return;
    try {
      if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
    } catch (_) {}

    const sortedTimes = [...times].sort();

    if (onSaveReminder) {
      onSaveReminder({
        id: `rem_${Date.now()}`,
        title: title.trim(),
        category,
        linkedAamaalId: linkedAamaalId || '',
        time: sortedTimes[0],
        times: sortedTimes,
        days: selectedDays.length > 0 ? selectedDays : WEEK_DAYS,
        icon: '🔔',
        arabic,
        translation,
        romanUrdu,
        enabled: true,
        read: false,
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
          className="w-full bg-[#F5F2E8] text-primary text-[13px] font-semibold py-2 px-3 rounded-xl border border-[#DCD8C6]"
        />
      </div>

      {/* Category & Linked Aamaal (Auto-Stop Once Completed) */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#F5F2E8] text-primary text-[12px] font-semibold py-2 px-2.5 rounded-xl border border-[#DCD8C6]"
          >
            <option value="Daily Aamaal">Daily Aamaal</option>
            <option value="Night Protection">Night Protection</option>
            <option value="Weekly Sunnah">Weekly Sunnah</option>
            <option value="Morning & Evening">Morning &amp; Evening</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
            Auto-Stop When Done
          </label>
          <select
            value={linkedAamaalId}
            onChange={(e) => setLinkedAamaalId(e.target.value)}
            className="w-full bg-[#F5F2E8] text-primary text-[12px] font-semibold py-2 px-2.5 rounded-xl border border-[#DCD8C6]"
          >
            <option value="">None (Always Ring)</option>
            {DEFAULT_AAMAAL_LIST.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Multi-Time Daily Schedule Builder */}
      <div className="space-y-2 rounded-2xl bg-[#F5F2E8] p-3 border border-[#DCD8C6]">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Daily Alarm Times ({times.length})
          </label>
          <div className="flex items-center space-x-1">
            {INTERVAL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setTimes(preset.times)}
                className="px-2 py-0.5 rounded-full bg-[#DCE3C8] text-[#0D4A2E] text-[9.5px] font-bold"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[10.5px] text-secondary">
          Alarms will repeat at these times until the linked Amal is marked completed for the day.
        </p>

        {/* Active Time Chips */}
        <div className="flex flex-wrap gap-1.5">
          {times.map((t) => (
            <span
              key={t}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#0D4A2E] text-[#F0D58C] text-[11.5px] font-bold"
            >
              <span>⏰ {t}</span>
              {times.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveTime(t)}
                  className="text-white/80 hover:text-white text-[10px] font-bold"
                >
                  ✕
                </button>
              )}
            </span>
          ))}
        </div>

        {/* Add Another Time Picker */}
        <div className="flex items-center space-x-2 pt-1">
          <input
            type="time"
            value={newTimeInput}
            onChange={(e) => setNewTimeInput(e.target.value)}
            className="flex-1 bg-white text-primary text-[12.5px] font-bold py-1.5 px-2.5 rounded-xl border border-[#D5D2BE]"
          />
          <button
            type="button"
            onClick={handleAddTime}
            className="px-3.5 py-1.5 rounded-xl bg-[#EAE8D7] border border-[#0D4A2E]/30 text-[#0D4A2E] text-[11.5px] font-bold"
          >
            + Add Time
          </button>
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
          Save Reminder ({times.length}x / Day)
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