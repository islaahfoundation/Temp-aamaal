//Allows modifying an existing reminder's title, time, repeat days, or deleting it.

import React, { useState, useEffect } from 'react';
import { DEFAULT_AAMAAL_LIST } from '../aamaal/AamaalCategories';

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

export default function EditReminder({
  reminder,
  onUpdateReminder,
  onDeleteReminder,
  onCancel,
}) {
  const [title, setTitle] = useState(reminder?.title || '');
  const [category, setCategory] = useState(reminder?.category || 'Daily Aamaal');
  const [linkedAamaalId, setLinkedAamaalId] = useState(
    reminder?.linkedAamaalId || ''
  );
  const [times, setTimes] = useState(() => {
    if (Array.isArray(reminder?.times) && reminder.times.length > 0) {
      return reminder.times;
    }
    return [reminder?.time || '07:30'];
  });
  const [selectedDays, setSelectedDays] = useState(
    Array.isArray(reminder?.days) && reminder.days.length > 0
      ? reminder.days
      : WEEK_DAYS
  );

  // Sync form state if user clicks Edit on a different reminder
  useEffect(() => {
    if (!reminder) return;
    setTitle(reminder.title || '');
    setCategory(reminder.category || 'Daily Aamaal');
    setLinkedAamaalId(reminder.linkedAamaalId || '');
    setTimes(
      Array.isArray(reminder.times) && reminder.times.length > 0
        ? reminder.times
        : [reminder.time || '07:30']
    );
    setSelectedDays(
      Array.isArray(reminder.days) && reminder.days.length > 0
        ? reminder.days
        : WEEK_DAYS
    );
  }, [reminder?.id]);

  if (!reminder) return null;

  const handleChangeTimeAt = (index, newValue) => {
    setTimes((prev) => prev.map((t, idx) => (idx === index ? newValue : t)));
  };

  const handleAddTimeSlot = () => {
    setTimes((prev) => [...prev, '13:30']);
  };

  const handleRemoveTimeAt = (index) => {
    if (times.length <= 1) return;
    setTimes((prev) => prev.filter((_, idx) => idx !== index));
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedTimes = Array.from(
      new Set(times.filter((t) => Boolean(t && t.trim())))
    ).sort();

    if (!title.trim() || cleanedTimes.length === 0) return;

    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}

    if (onUpdateReminder) {
      onUpdateReminder(reminder.id, {
        title: title.trim(),
        category,
        linkedAamaalId,
        time: cleanedTimes[0],
        times: cleanedTimes,
        days: selectedDays.length > 0 ? selectedDays : WEEK_DAYS,
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
          <span className="badge-pill">Edit Schedule</span>
          <h3 className="font-serif text-[18px] font-semibold text-primary mt-1">
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
          className="w-full bg-[#F5F2E8] text-primary text-[13px] font-semibold py-2 px-3 rounded-xl border border-[#DCD8C6]"
        />
      </div>

      {/* Category & Auto-Stop Linked Amal */}
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

      {/* Directly Editable Multi-Time Daily Schedule */}
      <div className="space-y-2.5 rounded-2xl bg-[#F5F2E8] p-3 border border-[#DCD8C6]">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Daily Alarm Times ({times.length})
          </label>
          <div className="flex items-center space-x-1">
            {INTERVAL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setTimes([...preset.times])}
                className="px-2 py-0.5 rounded-full bg-[#DCE3C8] text-[#0D4A2E] text-[9.5px] font-bold"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[10.5px] text-secondary">
          Tap any time below to edit it directly. Alarms pause once the linked Amal is completed today.
        </p>

        {/* Editable Time Pickers List */}
        <div className="space-y-1.5">
          {times.map((t, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-secondary w-14 shrink-0">
                Alarm {index + 1}
              </span>
              <input
                type="time"
                required
                value={t}
                onChange={(e) => handleChangeTimeAt(index, e.target.value)}
                className="flex-1 bg-white text-primary text-[13px] font-bold py-1.5 px-2.5 rounded-xl border border-[#D5D2BE]"
              />
              {times.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveTimeAt(index)}
                  aria-label="Remove alarm time"
                  className="w-8 h-8 rounded-xl bg-red-50 text-red-600 border border-red-200 text-[12px] font-bold flex items-center justify-center shrink-0"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddTimeSlot}
          className="w-full py-1.5 rounded-xl bg-[#EAE8D7] border border-[#0D4A2E]/30 text-[#0D4A2E] text-[11.5px] font-bold"
        >
          + Add Another Time
        </button>
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

      {/* Save / Delete Buttons */}
      <div className="flex items-center space-x-2 pt-1">
        <button
          type="submit"
          className="btn-primary flex-1 py-2.5 text-[13px] font-semibold shadow-sm"
        >
          Save Changes ({times.length}x / Day)
        </button>
        {onDeleteReminder && (
          <button
            type="button"
            onClick={() => onDeleteReminder(reminder.id)}
            className="px-3.5 py-2.5 rounded-full bg-red-100 text-red-700 border border-red-200 text-[12px] font-bold"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}