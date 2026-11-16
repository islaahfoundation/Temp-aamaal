//Allows modifying an existing reminder's title, time, repeat days, or deleting it.

import React, { useState, useEffect } from 'react';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function EditReminder({
  reminder,
  onUpdateReminder,
  onDeleteReminder,
  onCancel,
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Daily Aamaal');
  const [time, setTime] = useState('07:30');
  const [selectedDays, setSelectedDays] = useState(WEEK_DAYS);

  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title || '');
      setCategory(reminder.category || 'Daily Aamaal');
      setTime(reminder.time || '07:30');
      setSelectedDays(
        Array.isArray(reminder.days) && reminder.days.length > 0
          ? reminder.days
          : WEEK_DAYS
      );
    }
  }, [reminder]);

  if (!reminder) return null;

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      if (navigator.vibrate) navigator.vibrate(12);
    } catch (_) {}

    if (onUpdateReminder) {
      onUpdateReminder(reminder.id, {
        title: title.trim(),
        category,
        time,
        days: selectedDays.length > 0 ? selectedDays : WEEK_DAYS,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card rounded-[20px] p-4 space-y-3 bg-[#EAE8D7] border border-[#0D4A2E]/30 fade-in"
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="badge-pill">Modify Schedule</span>
          <h3 className="font-serif text-[17px] font-semibold text-primary mt-1">
            ✏️ Edit Reminder
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

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
          Reminder Title
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-[#F5F2E8] text-primary text-[13px] font-semibold"
        />
      </div>

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
          className="btn-primary flex-1 py-2.5 text-[12.5px] font-semibold"
        >
          Save Changes
        </button>

        {onDeleteReminder && (
          <button
            type="button"
            onClick={() => onDeleteReminder(reminder.id)}
            className="px-3.5 py-2.5 rounded-full bg-[#E5DEC9] text-[#6B2D26] text-[12px] font-bold"
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </form>
  );
}