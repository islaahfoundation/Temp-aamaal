import React from 'react';
import { getLocalDateString } from './DateSelector';

export function getMonthDetails(monthStr) {
  const fallback = getLocalDateString().slice(0, 7);
  const [year, month] = (monthStr || fallback).split('-').map(Number);
  const totalDaysInMonth = new Date(year, month, 0).getDate();
  const todayLocal = getLocalDateString();
  const currentMonthLocal = todayLocal.slice(0, 7);
  const todayDayNum = Number(todayLocal.slice(8, 10));

  let elapsedDays = totalDaysInMonth;
  if (monthStr === currentMonthLocal) {
    elapsedDays = todayDayNum;
  } else if (monthStr > currentMonthLocal) {
    elapsedDays = 0;
  }

  return {
    year,
    month,
    totalDaysInMonth,
    elapsedDays,
    isCurrentMonth: monthStr === currentMonthLocal,
  };
}

export default function MissedDays({
  monthStr,
  aamaal,
  dayCountMap = {},
  onSelectDateToLog,
}) {
  const mInfo = getMonthDetails(monthStr);
  const dailyTarget = Number(aamaal?.target || 0);

  let daysCompleted = 0;
  let actualCount = 0;

  Object.entries(dayCountMap).forEach(([dateKey, count]) => {
    if (dateKey.startsWith(monthStr) && Number(count) > 0) {
      daysCompleted += 1;
      actualCount += Number(count);
    }
  });

  const daysMissed = Math.max(mInfo.elapsedDays - daysCompleted, 0);
  const fullMonthTarget = dailyTarget * mInfo.totalDaysInMonth;
  const comparisonTarget = mInfo.isCurrentMonth
    ? dailyTarget * mInfo.elapsedDays
    : fullMonthTarget;

  const pct =
    comparisonTarget > 0
      ? Math.round((actualCount / comparisonTarget) * 100)
      : 0;
  const barWidth = Math.min(Math.max(pct, 4), 100);
  const diff = actualCount - comparisonTarget;

  const daysArray = Array.from(
    { length: mInfo.totalDaysInMonth },
    (_, idx) => idx + 1
  );

  return (
    <div className="card rounded-[18px] p-4 bg-[#F3EFE2] border border-white/90">
      {/* Top Row: Aamaal Name + Ahead/Remaining Badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-serif text-[16px] font-bold text-primary">
            {aamaal?.name || 'Durood Shareef'}
          </h4>
          <p className="text-[11px] text-secondary">
            Daily Target: {dailyTarget.toLocaleString('en-US')}/day
          </p>
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
            diff >= 0
              ? 'bg-[#DCE3C8] text-[#0D4A2E]'
              : 'bg-[#F0D58C]/45 text-[#6B2D26]'
          }`}
        >
          {diff >= 0
            ? `✓ +${diff.toLocaleString('en-US')} Ahead (${pct}%)`
            : `${Math.abs(diff).toLocaleString('en-US')} Remaining (${pct}%)`}
        </span>
      </div>

      {/* 3 Metric Boxes: Actual Recited, Target, Missed Days */}
      <div className="grid grid-cols-3 gap-2 my-3">
        <div className="rounded-xl bg-[#F5F2E8] border border-[#DCD8C6] p-2 text-center">
          <div className="font-serif text-[15px] font-bold text-[#135332]">
            {actualCount.toLocaleString('en-US')}
          </div>
          <div className="text-[10px] font-semibold text-secondary mt-0.5">
            Actual Recited
          </div>
        </div>

        <div className="rounded-xl bg-[#F5F2E8] border border-[#DCD8C6] p-2 text-center">
          <div className="font-serif text-[15px] font-bold text-primary">
            {comparisonTarget.toLocaleString('en-US')}
          </div>
          <div className="text-[10px] font-semibold text-secondary mt-0.5">
            {mInfo.isCurrentMonth
              ? `Target (${mInfo.elapsedDays}d)`
              : `Month Target (${mInfo.totalDaysInMonth}d)`}
          </div>
        </div>

        <div className="rounded-xl bg-[#F5F2E8] border border-[#DCD8C6] p-2 text-center">
          <div
            className={`font-serif text-[15px] font-bold ${
              daysMissed > 0 ? 'text-[#6B2D26]' : 'text-[#135332]'
            }`}
          >
            {daysMissed} Days
          </div>
          <div className="text-[10px] font-semibold text-secondary mt-0.5">
            Missed Days
          </div>
        </div>
      </div>

      {/* Consistency Row & Progress Bar */}
      <div className="flex items-center justify-between text-[11px] text-secondary mb-1.5">
        <span>
          Consistency:{' '}
          <strong className="text-primary">
            {daysCompleted}/{mInfo.elapsedDays} days logged
          </strong>
        </span>
        <span>
          Full {mInfo.totalDaysInMonth}d Target:{' '}
          <strong className="text-primary">
            {fullMonthTarget.toLocaleString('en-US')}
          </strong>
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-[#DEDCCF] overflow-hidden mb-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#135332] to-[#358C44] transition-all duration-500"
          style={{ width: `${barWidth}%` }}
        />
      </div>

      {/* Interactive Day-by-Day Calendar Grid */}
      <p className="text-[10.5px] font-semibold text-secondary mb-2">
        Tap any day below to jump to that date &amp; log/edit:
      </p>

      <div className="flex flex-wrap gap-1.5">
        {daysArray.map((dayNum) => {
          const dayStr = String(dayNum).padStart(2, '0');
          const fullDateKey = `${monthStr}-${dayStr}`;
          const count = Number(dayCountMap[fullDateKey] || 0);

          let pillStyle =
            'bg-[#EAE8D7] text-muted border-transparent cursor-default';
          if (dayNum <= mInfo.elapsedDays) {
            pillStyle =
              count > 0
                ? 'bg-[#DCE3C8] text-[#0D4A2E] border-[#358C44]/40 cursor-pointer'
                : 'bg-[#E5DEC9] text-[#6B2D26] border-[#c45d55]/40 cursor-pointer';
          } else if (count > 0) {
            pillStyle =
              'bg-[#DCE3C8] text-[#0D4A2E] border-[#358C44]/40 cursor-pointer';
          }

          return (
            <button
              key={fullDateKey}
              type="button"
              title={`${fullDateKey}: ${count} recited`}
              onClick={() => {
                if (dayNum <= mInfo.elapsedDays && onSelectDateToLog) {
                  try {
                    if (navigator.vibrate) navigator.vibrate(10);
                  } catch (_) {}
                  onSelectDateToLog(fullDateKey);
                }
              }}
              className={`w-7 h-7 rounded-lg text-[10.5px] font-bold flex items-center justify-center border transition ${pillStyle}`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}