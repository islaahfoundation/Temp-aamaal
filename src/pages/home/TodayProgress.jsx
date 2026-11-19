//Renders the Deep Emerald & Gold Hero Progress Card showing the active member's daily Aamaal completion (313 Durood Shareef, Surah Mulk, 100 Istighfar), overall percentage bar, and one-tap buttons to view ProgressDetails or open AamaalDashboard.

import React from 'react';
import { DEFAULT_AAMAAL_LIST } from '../aamaal/AamaalCategories';

export default function TodayProgress({
  todayLogs = [],
  dhikrCount = 0,
  sessionsCount = 0,
  remindersCount = 1,
  onOpenProgressDetails,
}) {
  // Calculate how many of the 3 daily goals are completed
  const totalGoals = DEFAULT_AAMAAL_LIST.length || 3;
  const completedGoals = DEFAULT_AAMAAL_LIST.filter((a) => {
    const found = todayLogs.find((l) => l.aamaalId === a.id);
    return found && Number(found.count || 0) >= Number(a.target || 1);
  }).length;

  // Or if user used Tasbih/Sessions, reflect progress smoothly
  const effectiveCompleted =
    completedGoals > 0
      ? completedGoals
      : dhikrCount >= 100
      ? 2
      : dhikrCount > 0
      ? 1
      : 0;

  const pct = Math.min(
    100,
    Math.round((effectiveCompleted / totalGoals) * 100)
  );

  // Compact SVG Circle Math
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="card-progress rounded-[22px] p-3.5 my-2.5 relative overflow-hidden select-none shadow-progress-card border border-[#C99E4C]/30">
      {/* Decorative Gold Arabesque Curve (Top Right) */}
      <svg
        className="absolute right-0 top-0 w-32 h-32 opacity-25 pointer-events-none"
        viewBox="0 0 160 160"
        fill="none"
      >
        <path
          d="M65 0C70 40 100 55 160 60M95 0C100 30 120 45 160 45"
          stroke="#DFB75A"
          strokeWidth="1.5"
        />
        <circle
          cx="145"
          cy="25"
          r="28"
          stroke="#DFB75A"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
      </svg>

      {/* Decorative Botanical Leaves (Bottom Left) */}
      <svg
        className="absolute left-0 bottom-0 w-14 h-14 opacity-80 pointer-events-none"
        viewBox="0 0 64 64"
        fill="none"
      >
        <path
          d="M12 64C12 44 2 34 2 34C2 34 16 32 22 48"
          fill="#88A94B"
          opacity="0.75"
        />
        <path
          d="M16 64C18 46 32 38 32 38C32 38 32 52 20 62"
          fill="#628B35"
          opacity="0.85"
        />
        <path
          d="M6 64C4 50 14 40 14 40C14 40 18 50 10 62"
          fill="#C99E4C"
          opacity="0.65"
        />
      </svg>

      <div className="relative z-10 flex items-center space-x-3">
        {/* Left: Compact Circular Progress Ring */}
        <div className="relative w-[78px] h-[78px] flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 78 78">
            <circle
              cx="39"
              cy="39"
              r={radius}
              stroke="rgba(255, 255, 255, 0.16)"
              strokeWidth="6.5"
              fill="rgba(7, 45, 24, 0.45)"
            />
            <circle
              cx="39"
              cy="39"
              r={radius}
              stroke="url(#progressGrad)"
              strokeWidth="6.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
            />
            <defs>
              <linearGradient
                id="progressGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#DCE384" />
                <stop offset="50%" stopColor="#62B64B" />
                <stop offset="100%" stopColor="#2E8540" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-sans text-[19px] font-bold text-white tracking-tight">
              {pct}%
            </span>
          </div>
        </div>

        {/* Vertical Subtle Divider */}
        <div className="w-[1px] h-16 bg-white/15 shrink-0" />

        {/* Right: Single-Line Title, Single-Line Subtitle & 3 Columns */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1.5">
            <h2 className="font-serif text-[16.5px] font-semibold text-white leading-tight whitespace-nowrap truncate">
              Today&apos;s Progress
            </h2>

            <button
              type="button"
              onClick={() => {
                if (onOpenProgressDetails) onOpenProgressDetails();
              }}
              className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-[#C99E4C]/40 text-[10px] font-medium text-white flex items-center space-x-0.5 shrink-0 transition cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <span>View details</span>
              <span>›</span>
            </button>
          </div>

          <p className="text-[11px] text-white/85 mt-0.5 whitespace-nowrap truncate">
            {effectiveCompleted} of {totalGoals} goals completed
          </p>

          {/* 3 Columns: Dhikr | Sessions | Reminders */}
          <div className="grid grid-cols-3 divide-x divide-white/15 mt-2 pt-0.5 text-center">
            {/* Column 1: Dhikr */}
            <div className="px-1 flex flex-col items-center">
              <svg
                className="w-3.5 h-3.5 text-[#DFB75A] mb-0.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="4" r="1.8" />
                <circle cx="16.5" cy="5.8" r="1.8" />
                <circle cx="18.5" cy="10" r="1.8" />
                <circle cx="17" cy="14.5" r="1.8" />
                <circle cx="12" cy="16.5" r="1.8" />
                <circle cx="7" cy="14.5" r="1.8" />
                <circle cx="5.5" cy="10" r="1.8" />
                <circle cx="7.5" cy="5.8" r="1.8" />
                <path
                  d="M12 18.5v3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[10px] text-white/80">Dhikr</span>
              <strong className="text-[13.5px] font-bold text-white leading-tight mt-0.5">
                {dhikrCount}
              </strong>
            </div>

            {/* Column 2: Sessions */}
            <div className="px-1 flex flex-col items-center">
              <svg
                className="w-3.5 h-3.5 text-[#DFB75A] mb-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z" />
                <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z" />
              </svg>
              <span className="text-[10px] text-white/80">Sessions</span>
              <strong className="text-[13.5px] font-bold text-white leading-tight mt-0.5">
                {sessionsCount}
              </strong>
            </div>

            {/* Column 3: Reminders */}
            <div className="px-1 flex flex-col items-center">
              <svg
                className="w-3.5 h-3.5 text-[#DFB75A] mb-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="text-[10px] text-white/80">Reminders</span>
              <strong className="text-[13.5px] font-bold text-white leading-tight mt-0.5">
                {remindersCount}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}