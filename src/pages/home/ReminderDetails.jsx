//Renders the interactive Daily Reminders & Sunnah Alerts card on the Home screen (Morning & Evening Adhkar, Night Surah Mulk, and Thursday/Friday Salawat), allowing the user to toggle individual reminders on or off.

import React from 'react';

export default function ReminderDetails({
  remindersActive = true,
  onToggleGlobalReminders,
}) {
  return (
    <div
      onClick={onToggleGlobalReminders}
      className="rounded-[20px] bg-gradient-to-r from-[#E2E5C8] via-[#DCE2C0] to-[#C8D6B0] border border-white/90 shadow-soft-card px-3.5 py-3 my-2.5 flex items-center justify-between relative overflow-hidden cursor-pointer active:scale-[0.99] transition"
    >
      {/* Left: Clock Icon + Text */}
      <div className="flex items-center space-x-3 relative z-10 pr-12">
        <div className="w-8 h-8 rounded-full border-2 border-[#0D4A2E] flex items-center justify-center text-[#0D4A2E] shrink-0">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 15 14" />
          </svg>
        </div>

        <div>
          <span className="text-[11px] font-medium text-[#1A3826] block leading-tight">
            Your reminder {!remindersActive && '(Paused)'}
          </span>
          <h4 className="font-serif text-[14.5px] font-bold text-[#0D4A2E] leading-snug">
            6 Salawat Recited Every Thursday Night
          </h4>
        </div>
      </div>

      {/* Right Mosque Silhouette Backdrop */}
      <svg
        className="absolute right-6 bottom-0 h-12 w-28 text-[#135332] opacity-85 pointer-events-none"
        viewBox="0 0 120 50"
        fill="currentColor"
      >
        <path d="M10 50V38L14 32L18 38V50H10Z" />
        <path d="M25 50V35C25 28 35 24 35 24C35 24 45 28 45 35V50H25Z" />
        <rect x="52" y="18" width="4" height="32" />
        <path d="M54 10L51 18H57L54 10Z" />
        <path d="M62 50V30C62 20 76 14 76 14C76 14 90 20 90 30V50H62Z" />
        <rect x="96" y="12" width="4.5" height="38" />
        <path d="M98.2 4L95 12H101.5L98.2 4Z" />
      </svg>

      <span className="relative z-10 text-[#0D4A2E] text-[18px] font-bold">
        ›
      </span>
    </div>
  );
}
