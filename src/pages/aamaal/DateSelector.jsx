import React from 'react';

export function getLocalDateString(dateObj = new Date()) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatAnyDatePretty(dateKey) {
  if (!dateKey) return '';
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, m - 1, d, 12, 0, 0);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(dt);
}

export default function DateSelector({
  selectedDate,
  onSelectDate,
  onResetToToday,
}) {
  const todayLocal = getLocalDateString();

  return (
    <div className="flex items-center justify-between gap-2 flex-wrap mb-2 px-0.5">
      <span className="text-[11.5px] font-semibold text-secondary">
        ↔ Slide 30d or pick any date:
      </span>

      <div className="flex items-center space-x-2">
        <input
          type="date"
          value={selectedDate || todayLocal}
          max={todayLocal}
          onChange={(e) => {
            if (e.target.value && onSelectDate) {
              try {
                if (navigator.vibrate) navigator.vibrate(10);
              } catch (_) {}
              onSelectDate(e.target.value);
            }
          }}
          className="w-auto px-2.5 py-1 rounded-lg bg-[#F3EFE2] border border-[#D5D2BE] text-primary text-[11.5px] font-semibold cursor-pointer"
        />

        <button
          type="button"
          onClick={() => {
            try {
              if (navigator.vibrate) navigator.vibrate(12);
            } catch (_) {}
            if (onResetToToday) onResetToToday(todayLocal);
            else if (onSelectDate) onSelectDate(todayLocal);
          }}
          className="px-2.5 py-1 rounded-lg bg-[#EAE8D7] text-primary text-[11px] font-bold border border-[#D5D2BE]"
        >
          Today ↻
        </button>
      </div>
    </div>
  );
}