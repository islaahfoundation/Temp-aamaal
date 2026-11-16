//Renders the interactive Daily Reminders & Sunnah Alerts card on the Home screen (Morning & Evening Adhkar, Night Surah Mulk, and Thursday/Friday Salawat), allowing the user to toggle individual reminders on or off.

import React, { useState } from 'react';

const DEFAULT_REMINDER_SLOTS = [
  {
    id: 'morning_durood',
    title: 'Morning 313 Durood & Adhkar',
    time: '07:30 AM',
    enabled: true,
  },
  {
    id: 'night_mulk',
    title: 'Surah Mulk Before Sleep',
    time: '09:45 PM',
    enabled: true,
  },
  {
    id: 'thursday_salawat',
    title: 'Thursday Evening Salawat Circle',
    time: 'Thu • 06:30 PM',
    enabled: true,
  },
];

export default function ReminderDetails({
  remindersActive = true,
  onToggleGlobalReminders,
  onShowToast,
}) {
  const [slots, setSlots] = useState(DEFAULT_REMINDER_SLOTS);
  const [expanded, setExpanded] = useState(false);

  const activeCount = remindersActive
    ? slots.filter((s) => s.enabled).length
    : 0;

  const toggleSlot = (id) => {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (_) {}
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    if (onShowToast) onShowToast('Reminder schedule updated');
  };

  return (
    <div className="card rounded-[20px] p-4 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EAE8D7] text-primary flex items-center justify-center text-[17px]">
            🔔
          </div>
          <div>
            <h3 className="font-serif text-[15.5px] font-semibold text-primary">
              Gentle Sunnah Reminders
            </h3>
            <p className="text-[11px] text-secondary">
              {activeCount > 0
                ? `${activeCount} daily reminder schedules active`
                : 'Reminders currently paused'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {onToggleGlobalReminders && (
            <button
              type="button"
              onClick={onToggleGlobalReminders}
              className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border transition ${
                remindersActive
                  ? 'bg-[#DCE3C8] text-[#0D4A2E] border-[#0D4A2E]/30'
                  : 'bg-[#E5DEC9] text-[#6B2D26] border-[#6B2D26]/30'
              }`}
            >
              {remindersActive ? 'Active' : 'Paused'}
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="px-2.5 py-1 rounded-full bg-[#EAE8D7] text-primary text-[10.5px] font-bold border border-[#D5D2BE]"
          >
            {expanded ? 'Hide' : 'Manage'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="pt-2 border-t border-[#E2DEC9] space-y-2 fade-in">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between rounded-xl bg-[#F5F2E8] px-3 py-2 border border-[#DCD8C6]"
            >
              <div>
                <h4 className="text-[12.5px] font-semibold text-primary">
                  {slot.title}
                </h4>
                <span className="text-[10.5px] text-secondary">{slot.time}</span>
              </div>

              <button
                type="button"
                onClick={() => toggleSlot(slot.id)}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold ${
                  slot.enabled
                    ? 'bg-[#0D4A2E] text-white'
                    : 'bg-[#EAE8D7] text-secondary'
                }`}
              >
                {slot.enabled ? 'On ✓' : 'Off'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}