import React from 'react';
import { formatCompactNumber } from './CalendarHistory';

export default function LifetimeTotals({
  aamaalName = 'Durood Shareef',
  lifetimeTotal = 0,
  weekGroupTotal = 0,
  totalMembers = 1,
  newMembersCount = 1,
  groupTodayTotal = 0,
  myTodayTotal = 0,
}) {
  return (
    <div className="space-y-3.5 mb-4">
      {/* Cumulative Circle Hero Card */}
      <div className="card-progress rounded-[24px] p-5 relative overflow-hidden shadow-progress-card">
        <span className="inline-block px-3 py-0.5 rounded-full bg-[#DFB75A]/20 text-[#F0D58C] text-[10px] font-bold uppercase tracking-wider mb-2">
          🕌 Islaah Foundation Circle
        </span>
        <p className="text-[12.5px] text-white/85">
          Cumulative <strong className="text-[#F0D58C]">{aamaalName}</strong>
        </p>
        <h3 className="font-serif text-[36px] font-bold text-white leading-tight tracking-tight my-1 relative z-10">
          {Number(lifetimeTotal).toLocaleString('en-US')}
        </h3>
        <p className="text-[11.5px] text-white/80 relative z-10">
          Combined recitations by all circle &amp; family members
        </p>

        {/* Mosque Dome Watermark SVG */}
        <svg
          className="absolute -right-3 -bottom-4 w-40 h-40 opacity-20 pointer-events-none"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path
            d="M100 20 L100 45"
            stroke="#F0D58C"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="100" cy="16" r="5" stroke="#F0D58C" strokeWidth="3" />
          <path
            d="M40 135 C40 65, 160 65, 160 135 Z"
            fill="#F0D58C"
          />
          <rect x="30" y="135" width="140" height="65" fill="#F0D58C" />
        </svg>
      </div>

      {/* 3-Column Circle Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card rounded-[16px] p-3 text-center bg-[#F3EFE2]">
          <div className="font-serif text-[18px] font-bold text-primary">
            {formatCompactNumber(weekGroupTotal)}
          </div>
          <div className="text-[10px] font-semibold text-secondary leading-tight mt-0.5">
            This Week&apos;s Circle Total
          </div>
        </div>

        <div className="card rounded-[16px] p-3 text-center bg-[#F3EFE2]">
          <div className="font-serif text-[18px] font-bold text-primary">
            {Number(totalMembers).toLocaleString('en-US')}
          </div>
          <div className="text-[10px] font-semibold text-secondary leading-tight mt-0.5">
            Active Circle Members
          </div>
        </div>

        <div className="card rounded-[16px] p-3 text-center bg-[#F3EFE2]">
          <div className="font-serif text-[18px] font-bold text-[#135332]">
            +{Number(newMembersCount)}
          </div>
          <div className="text-[10px] font-semibold text-secondary leading-tight mt-0.5">
            Joined Last 10 Days
          </div>
        </div>
      </div>

      {/* Today's Activity Grid */}
      <div>
        <h4 className="font-serif text-[15px] font-semibold text-primary mb-2 px-0.5">
          ✨ Today&apos;s Activity
        </h4>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="card rounded-[18px] p-3.5 bg-[#F3EFE2] border-l-4 border-l-[#0D4A2E]">
            <div className="font-serif text-[21px] font-bold text-primary">
              {Number(groupTodayTotal).toLocaleString('en-US')}
            </div>
            <div className="text-[11px] font-semibold text-secondary mt-0.5">
              Circle Total Today
            </div>
          </div>

          <div className="card rounded-[18px] p-3.5 bg-[#F3EFE2] border-l-4 border-l-[#C99E4C]">
            <div className="font-serif text-[21px] font-bold text-primary">
              {Number(myTodayTotal).toLocaleString('en-US')}
            </div>
            <div className="text-[11px] font-semibold text-secondary mt-0.5">
              Your Count Today
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}