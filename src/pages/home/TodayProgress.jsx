//Renders the Deep Emerald & Gold Hero Progress Card showing the active member's daily Aamaal completion (313 Durood Shareef, Surah Mulk, 100 Istighfar), overall percentage bar, and one-tap buttons to view ProgressDetails or open AamaalDashboard.

import React from 'react';
import { DEFAULT_AAMAAL_LIST } from '../aamaal/AamaalCategories';

export default function TodayProgress({
  activeProfile,
  todayLogs = [],
  streakDays = 1,
  dhikrCount = 0,
  onOpenProgressDetails,
  onOpenAamaalTracker,
}) {
  const aamaalItems = DEFAULT_AAMAAL_LIST.map((a) => {
    const found = todayLogs.find((l) => l.aamaalId === a.id);
    const count = found ? Number(found.count || 0) : 0;
    const isCompleted = count >= Number(a.target || 1);
    return {
      ...a,
      count,
      isCompleted,
    };
  });

  const completedCount = aamaalItems.filter((i) => i.isCompleted).length;
  const totalItems = aamaalItems.length;
  const progressPct = Math.round((completedCount / Math.max(totalItems, 1)) * 100);

  return (
    <div className="card-progress rounded-[24px] p-4 mb-3.5 border border-[#C99E4C]/50 shadow-progress-card">
      {/* Top Row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[9.5px] font-bold uppercase tracking-wider">
            Today&apos;s Circle Progress • {activeProfile?.name || 'You'}
          </span>
          <h2 className="font-serif text-[21px] font-semibold text-white mt-1">
            {completedCount === totalItems
              ? 'MashaAllah! All Aamaal Done'
              : `${completedCount} of ${totalItems} Daily Aamaal Done`}
          </h2>
        </div>

        <div className="px-2.5 py-1 rounded-xl bg-[#DFB75A]/20 border border-[#DFB75A]/40 text-center shrink-0">
          <div className="font-serif text-[15px] font-bold text-[#F0D58C] leading-none">
            {streakDays}d
          </div>
          <div className="text-[9px] text-white/80 uppercase font-semibold mt-0.5">
            Streak
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-white/85 mb-1">
          <span>Daily Completion</span>
          <strong className="text-[#F0D58C]">{progressPct}%</strong>
        </div>
        <div className="w-full h-2 rounded-full bg-black/25 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#DFB75A] to-[#F0D58C] transition-all duration-300"
            style={{ width: `${Math.max(progressPct, 6)}%` }}
          />
        </div>
      </div>

      {/* 3 Mini Pills for 313 Durood, Surah Mulk, 100 Istighfar */}
      <div className="grid grid-cols-3 gap-1.5 mt-3">
        {aamaalItems.map((item) => (
          <div
            key={item.id}
            className={`rounded-xl p-2 border text-center ${
              item.isCompleted
                ? 'bg-white/15 border-[#F0D58C]/60 text-white'
                : 'bg-black/15 border-white/10 text-white/80'
            }`}
          >
            <div className="text-[10.5px] font-bold truncate">
              {item.isCompleted ? '✅ ' : '⏳ '}
              {item.name.replace('313 ', '').replace('100 ', '')}
            </div>
            <div className="text-[10px] text-[#F0D58C] font-semibold mt-0.5">
              {item.count}/{item.target}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 mt-3.5 pt-2.5 border-t border-white/15">
        <button
          type="button"
          onClick={onOpenAamaalTracker}
          className="flex-1 py-2 rounded-full bg-[#DFB75A] text-[#07361D] text-[12px] font-bold shadow-sm active:scale-[0.99] transition"
        >
          ✓ Log Today&apos;s Aamaal
        </button>

        {onOpenProgressDetails && (
          <button
            type="button"
            onClick={onOpenProgressDetails}
            className="px-3.5 py-2 rounded-full bg-white/15 text-white text-[11.5px] font-semibold border border-white/25"
          >
            Details ({dhikrCount}) ›
          </button>
        )}
      </div>
    </div>
  );
}