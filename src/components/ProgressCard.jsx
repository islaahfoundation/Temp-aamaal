import React from 'react';
import { calculateGoalsProgress } from '../services/aamaalService';

export default function ProgressCard({
  state,
  onClickDhikr,
  onClickSessions,
  onToggleReminders,
  onViewDetails
}) {
  const { goalsCompleted, percentage, visualOffset } = calculateGoalsProgress(state);

  return (
    <div className="px-4 shrink-0 !-mt-2 relative z-10">
      <div className="relative rounded-[18px] bg-[#0F4C2B] px-3.5 py-2.5 text-white shadow-progress-card overflow-hidden border border-white/15">
        <img
          alt="Today's Progress Background"
          src="/images/progress-bg.png"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        />
        <div className="relative z-10 flex items-center">
          <div className="relative w-[76px] h-[76px] flex items-center justify-center shrink-0 mr-2.5">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D9E672" />
                  <stop offset="50%" stopColor="#6FC259" />
                  <stop offset="100%" stopColor="#358C44" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.18)" strokeWidth="9" fill="rgba(5, 38, 20, 0.45)" />
              <circle
                className="progress-ring-circle"
                cx="50"
                cy="50"
                r="40"
                stroke="url(#ringGrad)"
                strokeWidth="9"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray="251.2"
                style={{ strokeDashoffset: visualOffset }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[19px] font-bold tracking-tight text-white">{percentage}%</span>
            </div>
          </div>

          <div className="w-[1px] h-16 bg-white/20 mr-3 shrink-0"></div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-[15.5px] font-semibold leading-tight text-white">Today’s Progress</h3>
                <p className="text-[11px] text-white/85">{goalsCompleted} of 3 goals completed</p>
              </div>
              <button
                onClick={onViewDetails}
                className="flex items-center space-x-0.5 px-2 py-0.5 rounded-full bg-[#09351C]/75 border border-[#C99E4C]/40 text-[10px] font-medium text-white/95 active:scale-95 transition"
              >
                <span>View details</span>
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1 mt-1.5 pt-1 text-center">
              <button onClick={onClickDhikr} className="flex flex-col items-center active:scale-95 transition">
                <svg className="w-4 h-4 text-[#DFB75A]" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="4" r="1.7" /><circle cx="16.5" cy="5.5" r="1.7" /><circle cx="19" cy="9.5" r="1.7" /><circle cx="18.5" cy="14.5" r="1.7" /><circle cx="14.5" cy="18" r="1.7" /><circle cx="9.5" cy="18" r="1.7" /><circle cx="5.5" cy="14.5" r="1.7" /><circle cx="5" cy="9.5" r="1.7" /><circle cx="7.5" cy="5.5" r="1.7" />
                </svg>
                <span className="text-[10px] text-white/85 mt-0.5">Dhikr</span>
                <span className="font-serif text-[14px] font-bold leading-none text-white mt-0.5">{state.dhikrCount}</span>
              </button>

              <button onClick={onClickSessions} className="flex flex-col items-center border-x border-white/20 px-1 active:scale-95 transition">
                <svg className="w-4 h-4 text-[#DFB75A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <span className="text-[10px] text-white/85 mt-0.5">Sessions</span>
                <span className="font-serif text-[14px] font-bold leading-none text-white mt-0.5">{state.sessionsCount}</span>
              </button>

              <button onClick={onToggleReminders} className="flex flex-col items-center active:scale-95 transition">
                <svg className="w-4 h-4 text-[#DFB75A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span className="text-[10px] text-white/85 mt-0.5">Reminders</span>
                <span className="font-serif text-[14px] font-bold leading-none text-white mt-0.5">{state.remindersCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
