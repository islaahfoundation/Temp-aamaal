import React, { useEffect, useRef } from 'react';
import { getLocalDateString } from './DateSelector';

export function getLocalDaysList(numDays = 30) {
  const days = [];
  const now = new Date();
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateKey = getLocalDateString(d);
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d);
    const monthShort = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d);
    const dayNum = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(d);
    const prettyLabel = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(d);
    days.push({
      dateKey,
      shortDay: weekday.slice(0, 3),
      monthShort,
      dayNum,
      prettyLabel,
      isToday: i === 0,
    });
  }
  return days;
}

export function formatCompactNumber(num) {
  const n = Number(num || 0);
  if (n >= 1000000) {
    return (
      (n / 1000000)
        .toFixed(2)
        .replace(/\.00$/, '')
        .replace(/(\.\d)0$/, '$1') + 'M'
    );
  }
  return n.toLocaleString('en-US');
}

export default function CalendarHistory({
  selectedDate,
  onSelectDate,
  logsByDate = {},
  numDays = 30,
}) {
  const stripRef = useRef(null);
  const selectedCellRef = useRef(null);
  const daysList = getLocalDaysList(numDays);

  useEffect(() => {
    if (selectedCellRef.current) {
      selectedCellRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'end',
        block: 'nearest',
      });
    }
  }, [selectedDate]);

  return (
    <div
      ref={stripRef}
      className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1.5 mb-3.5"
    >
      {daysList.map((day) => {
        const count = Number(logsByDate[day.dateKey] || 0);
        const isDone = count > 0;
        const isSelected = day.dateKey === selectedDate;

        return (
          <button
            key={day.dateKey}
            ref={isSelected ? selectedCellRef : null}
            type="button"
            onClick={() => {
              try {
                if (navigator.vibrate) navigator.vibrate(10);
              } catch (_) {}
              if (onSelectDate) onSelectDate(day.dateKey);
            }}
            className={`shrink-0 w-[56px] py-2 px-1 rounded-[16px] border flex flex-col items-center justify-between transition ${
              isSelected
                ? 'bg-[#0F4C2B] text-white border-[#C99E4C] shadow-md -translate-y-0.5'
                : day.isToday
                ? 'bg-[#EAE8D7] text-primary border-[#0D4A2E]/40'
                : 'bg-[#F3EFE2] text-primary border-white/90 shadow-soft-card'
            }`}
          >
            <span
              className={`text-[8.5px] font-bold uppercase tracking-wider ${
                isSelected ? 'text-[#F0D58C]' : 'text-muted'
              }`}
            >
              {day.monthShort}
            </span>

            <span
              className={`text-[10.5px] font-bold ${
                isSelected ? 'text-white' : 'text-secondary'
              }`}
            >
              {day.isToday ? 'Today' : day.shortDay}
            </span>

            <span
              className={`font-serif text-[15px] font-bold leading-tight my-0.5 ${
                isSelected ? 'text-white' : 'text-primary'
              }`}
            >
              {day.dayNum}
            </span>

            {/* Done / Missed Status Dot */}
            <span
              className={`w-2 h-2 rounded-full my-0.5 ${
                isDone
                  ? 'bg-[#358C44] ring-2 ring-[#358C44]/30'
                  : 'bg-[#c45d55]/85'
              }`}
            />

            <span
              className={`text-[9.5px] font-bold truncate max-w-full ${
                isSelected
                  ? 'text-[#F0D58C]'
                  : isDone
                  ? 'text-[#135332]'
                  : 'text-muted'
              }`}
            >
              {isDone ? formatCompactNumber(count) : '–'}
            </span>
          </button>
        );
      })}
    </div>
  );
}