//Displays a comprehensive admin drill-down view for any circle or family member: per-Aamaal recitation totals, recent log history, role toggle, rename/edit, reset logs, and remove member.   

import React, { useState, useMemo } from 'react';
import { CountryFlag } from '../aamaal/WeeklySummary';
import { formatAnyDatePretty, getLocalDateString } from '../aamaal/DateSelector';
import EditMember from './EditMember';
import RemoveMember from './RemoveMember';
import MemberPermissions from './MemberPermissions';

const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function getAamaalIcon(aamaal) {
  const name = (aamaal?.name || '').toLowerCase();
  if (name.includes('durood') || name.includes('salawat') || name.includes('tasbih')) {
    return (
      <svg className="w-5 h-5 text-[#0D4A2E]" viewBox="0 0 28 28" fill="currentColor">
        <circle cx="14" cy="4.5" r="2" />
        <circle cx="19" cy="6.5" r="2" />
        <circle cx="21.5" cy="11.5" r="2" />
        <circle cx="20" cy="16.8" r="2" />
        <circle cx="16" cy="20" r="2" />
        <circle cx="11" cy="20" r="2" />
        <circle cx="7.5" cy="16.8" r="2" />
        <circle cx="6.5" cy="11.5" r="2" />
        <circle cx="9" cy="6.5" r="2" />
      </svg>
    );
  }
  if (name.includes('mulk') || name.includes('surah') || name.includes('quran')) {
    return (
      <svg className="w-5 h-5 text-[#0D4A2E]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3H11v16H4.5A2.5 2.5 0 0 1 2 16.5v-11zm11-2.5h6.5A2.5 2.5 0 0 1 22 5.5v11a2.5 2.5 0 0 1-2.5 2.5H13V3z" />
      </svg>
    );
  }
  return (
    <span className="text-[18px] leading-none" role="img" aria-label="Aamaal">
      {aamaal?.icon || '🤲'}
    </span>
  );
}

export default function MemberDetails({
  member,
  parentMember,
  dependentFamily = [],
  aamaalList = [],
  allLogs = [],
  onUpdateMember,
  onResetMemberLogs,
  onRemoveMember,
  onDeleteSingleLog,
  onBack,
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'aamaal' | 'history' | 'settings'
  const [subAction, setSubAction] = useState(null); // 'edit' | 'reset' | 'remove' | null

  const todayStr = getLocalDateString();
  const currentMonthPrefix = todayStr.slice(0, 7); // YYYY-MM

  const stats = useMemo(() => {
    if (!member) return null;

    const memberLogs = allLogs
      .filter((l) => l.memberId === member.id && Number(l.count || 0) > 0)
      .sort((a, b) => (b.dateKey || '').localeCompare(a.dateKey || ''));

    const totalLifetime = memberLogs.reduce((sum, l) => sum + Number(l.count || 0), 0);

    const [y, m, d] = todayStr.split('-').map(Number);
    const totalDaysInMonth = new Date(y, m, 0).getDate();
    const elapsedDays = Math.min(d || 1, totalDaysInMonth);
    const monthLabel = `${SHORT_MONTHS[(m || 1) - 1]} ${y}`;

    const monthLogs = memberLogs.filter((l) =>
      String(l.dateKey || '').startsWith(currentMonthPrefix)
    );

    const activeMonthDaysSet = new Set(monthLogs.map((l) => l.dateKey));
    const daysActive = activeMonthDaysSet.size;
    const daysMissed = Math.max(0, elapsedDays - daysActive);
    const monthPct = Math.min(
      100,
      Math.round((daysActive / Math.max(1, totalDaysInMonth)) * 100)
    );

    const monthByAamaal = {};
    const lifetimeByAamaal = {};
    memberLogs.forEach((l) => {
      lifetimeByAamaal[l.aamaalId] =
        (lifetimeByAamaal[l.aamaalId] || 0) + Number(l.count || 0);
    });
    monthLogs.forEach((l) => {
      monthByAamaal[l.aamaalId] =
        (monthByAamaal[l.aamaalId] || 0) + Number(l.count || 0);
    });

    const createdDate = member.createdAt ? new Date(Number(member.createdAt)) : new Date();
    const memberSince = `${SHORT_MONTHS[createdDate.getMonth()]} ${createdDate.getFullYear()}`;

    return {
      memberLogs,
      totalLifetime,
      daysActive,
      daysMissed,
      totalDaysInMonth,
      monthPct,
      monthLabel,
      monthByAamaal,
      lifetimeByAamaal,
      memberSince,
      isActive: memberLogs.length > 0,
    };
  }, [member, allLogs, todayStr, currentMonthPrefix]);

  if (!member || !stats) return null;

  const aamaalMap = {};
  aamaalList.forEach((a) => {
    aamaalMap[a.id] = a.name;
  });

  const isAdminRole = member.role === 'admin';
  const isPrivate = member.privacy === 'private';

  // SVG Donut Ring geometry
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (stats.monthPct / 100) * circumference;

  return (
    <div className="space-y-3.5 pb-6 fade-in select-none">
      {/* Top Header */}
      <header className="flex items-center space-x-3 pt-0.5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to Members"
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-[#14261C] active:scale-95 transition shrink-0"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h2 className="font-serif text-[23px] font-bold text-[#14261C] leading-none">
          Member Details
        </h2>
      </header>

      {/* Member Profile Card */}
      <div className="rounded-[22px] bg-[#E8E6D5] border border-[#DCD8C6] shadow-[0_3px_12px_rgba(20,38,28,0.04)] p-4 flex items-center space-x-3.5 relative">
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className="w-[74px] h-[74px] rounded-full object-cover bg-[#DCE5DD] border-2 border-[#C6D5C8] shrink-0"
          />
        ) : (
          <div className="w-[74px] h-[74px] rounded-full bg-[#DCE8DF] border-2 border-[#C6D5C8] flex items-center justify-center font-serif font-bold text-[28px] text-[#0D4A2E] shrink-0">
            {(member.name || 'M').trim()[0]?.toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1 pr-6">
          <div className="flex items-center space-x-1.5">
            <h3 className="font-serif text-[20px] font-bold text-[#14261C] leading-tight truncate">
              {member.name}
            </h3>
            {isAdminRole && <span title="Admin" className="text-[14px]">👑</span>}
          </div>

          <div className="flex items-center space-x-1.5 mt-1">
            <CountryFlag country={member.country || 'India'} size={15} />
            <span className="text-[12.5px] font-medium text-[#4E5953] truncate">
              {member.country || 'India'}
            </span>
          </div>

          <p className="text-[11.5px] text-[#66736B] mt-0.5">
            Member since {stats.memberSince}
          </p>

          <div className="flex items-center space-x-1.5 mt-1.5">
            <span className="text-[12px] font-semibold text-[#0D4A2E]">Status:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                stats.isActive
                  ? 'bg-[#DFF2E3] text-[#15693B]'
                  : 'bg-[#DCDAD0] text-[#5E645F]'
              }`}
            >
              {stats.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Top-Right Pencil Edit Button */}
        <button
          type="button"
          onClick={() => setSubAction(subAction === 'edit' ? null : 'edit')}
          aria-label="Edit Member"
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center text-[#14261C] hover:bg-[#DCD8C6] active:scale-95 transition"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </button>
      </div>

      {/* Inline Edit / Reset / Remove Panels */}
      {subAction === 'edit' && (
        <EditMember
          member={member}
          onSaveMember={(id, updates) => {
            if (onUpdateMember) onUpdateMember(id, updates);
            setSubAction(null);
          }}
          onCancel={() => setSubAction(null)}
        />
      )}

      {subAction === 'reset' && (
        <div className="rounded-[18px] bg-[#F5E6E4] border border-[#D9A7A2] p-3.5 space-y-2.5">
          <p className="text-[12.5px] font-semibold text-[#6B2D26]">
            Reset all {stats.memberLogs.length} recitation logs for {member.name} to 0?
          </p>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                if (onResetMemberLogs) onResetMemberLogs(member.id);
                setSubAction(null);
              }}
              className="flex-1 py-2 rounded-full bg-[#B93A32] text-white text-[12px] font-bold"
            >
              Confirm Reset
            </button>
            <button
              type="button"
              onClick={() => setSubAction(null)}
              className="px-4 py-2 rounded-full bg-[#E8E6D5] text-[#14261C] text-[12px] font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {subAction === 'remove' && (
        <RemoveMember
          member={member}
          dependentFamilyCount={dependentFamily.length}
          logCount={stats.memberLogs.length}
          onConfirmRemove={(id) => {
            if (onRemoveMember) onRemoveMember(id);
          }}
          onCancel={() => setSubAction(null)}
        />
      )}

      {/* 4-Tab Segmented Navigation */}
      <div className="rounded-full bg-[#E8E6D5] border border-[#DCD8C6] p-1 grid grid-cols-4 gap-1">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'aamaal', label: 'Aamaal' },
          { id: 'history', label: 'History' },
          { id: 'settings', label: 'Settings' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-1.5 rounded-full text-[12px] font-semibold transition ${
                isActive
                  ? 'bg-[#0D4A2E] text-white shadow-sm'
                  : 'text-[#4E5953] hover:text-[#14261C]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-3.5">
          {/* 3-Column KPI Summary Card */}
          <div className="rounded-[20px] bg-[#E8E6D5] border border-[#DCD8C6] shadow-[0_3px_12px_rgba(20,38,28,0.04)] py-3.5 px-2 grid grid-cols-3 divide-x divide-[#D5D2BE] text-center">
            <div>
              <p className="text-[22px] font-bold text-[#14261C] leading-none">
                {stats.daysActive}
              </p>
              <p className="text-[11px] font-medium text-[#55615A] mt-1.5">
                Days Active
              </p>
            </div>
            <div>
              <p className="text-[22px] font-bold text-[#14261C] leading-none">
                {stats.daysMissed}
              </p>
              <p className="text-[11px] font-medium text-[#55615A] mt-1.5">
                Days Missed
              </p>
            </div>
            <div>
              <p className="text-[22px] font-bold text-[#14261C] leading-none">
                {stats.totalLifetime.toLocaleString('en-US')}
              </p>
              <p className="text-[11px] font-medium text-[#55615A] mt-1.5">
                Total Count
              </p>
            </div>
          </div>

          {/* This Month Progress & Breakdown Card */}
          <div className="rounded-[22px] bg-[#E8E6D5] border border-[#DCD8C6] shadow-[0_3px_12px_rgba(20,38,28,0.04)] p-4 space-y-4">
            <h4 className="text-[15.5px] font-bold text-[#14261C]">
              This Month ({stats.monthLabel})
            </h4>

            {/* Circular Donut Ring + Days Completed */}
            <div className="flex items-center justify-center space-x-6 py-1">
              <div className="relative w-[96px] h-[96px] flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    fill="none"
                    stroke="#D6E0D7"
                    strokeWidth="9"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    fill="none"
                    stroke="url(#memberRingGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                  />
                  <defs>
                    <linearGradient id="memberRingGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0D4A2E" />
                      <stop offset="100%" stopColor="#28A760" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute text-[20px] font-bold text-[#14261C]">
                  {stats.monthPct}%
                </span>
              </div>

              <div>
                <p className="text-[24px] font-bold text-[#14261C] leading-none">
                  {stats.daysActive} / {stats.totalDaysInMonth}
                </p>
                <p className="text-[13px] font-medium text-[#4E5953] mt-1">
                  Days Completed
                </p>
              </div>
            </div>

            {/* Monthly Breakdown by Aamaal */}
            <div className="divide-y divide-[#DCD8C6] pt-1">
              {aamaalList.map((a) => {
                const count = stats.monthByAamaal[a.id] || 0;
                return (
                  <div
                    key={a.id}
                    className="py-2.5 first:pt-1 last:pb-0 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-6 flex items-center justify-center shrink-0">
                        {getAamaalIcon(a)}
                      </div>
                      <span className="text-[13.5px] font-semibold text-[#14261C] truncate">
                        {a.name}
                      </span>
                    </div>
                    <span className="text-[14px] font-bold text-[#14261C] shrink-0">
                      {count.toLocaleString('en-US')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2-Column Info Cards: Privacy Mode & Admin Access */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-[18px] bg-[#E8E6D5] border border-[#DCD8C6] p-3.5 space-y-2">
              <p className="text-[12px] font-bold text-[#14261C]">Privacy Mode</p>
              <div className="flex items-center space-x-2.5">
                <svg
                  className="w-6 h-6 text-[#0D4A2E] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <line x1="3.6" y1="9" x2="20.4" y2="9" />
                  <line x1="3.6" y1="15" x2="20.4" y2="15" />
                  <path d="M12 3a14.5 14.5 0 0 0 0 18 14.5 14.5 0 0 0 0-18z" />
                </svg>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[#14261C] leading-tight">
                    {isPrivate ? 'Private' : 'Public'}
                  </p>
                  <p className="text-[10.5px] text-[#55615A] truncate mt-0.5">
                    {isPrivate ? 'Hidden in reports' : 'Visible in reports'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[18px] bg-[#E8E6D5] border border-[#DCD8C6] p-3.5 space-y-2">
              <p className="text-[12px] font-bold text-[#14261C]">Admin Access</p>
              <div className="flex items-center space-x-2.5">
                <svg
                  className="w-6 h-6 text-[#0D4A2E] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[#14261C] leading-tight">
                    {isAdminRole ? 'Yes' : 'No'}
                  </p>
                  <p className="text-[10.5px] text-[#55615A] truncate mt-0.5">
                    {isAdminRole ? 'Circle admin' : 'Not an admin'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 2-Button Action Row */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setSubAction(subAction === 'reset' ? null : 'reset')}
              className="h-[46px] rounded-full bg-[#F5F2E8] border-[1.5px] border-[#C9544D] text-[#B93A32] text-[13.5px] font-semibold flex items-center justify-center space-x-2 active:scale-[0.98] transition"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
              <span>Reset Data</span>
            </button>

            <button
              type="button"
              onClick={() => setSubAction(subAction === 'edit' ? null : 'edit')}
              className="h-[46px] rounded-full bg-gradient-to-r from-[#0B462B] via-[#135B39] to-[#083B23] text-white text-[13.5px] font-semibold shadow-md flex items-center justify-center space-x-2 active:scale-[0.98] transition"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span>Edit Member</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: AAMAAL (Lifetime & Monthly Totals) */}
      {activeTab === 'aamaal' && (
        <div className="rounded-[20px] bg-[#E8E6D5] border border-[#DCD8C6] p-4 space-y-2.5">
          <h4 className="font-serif text-[16px] font-bold text-[#14261C]">
            Cumulative Totals by Aamaal
          </h4>
          <div className="divide-y divide-[#DCD8C6]">
            {aamaalList.map((a) => {
              const lifetime = stats.lifetimeByAamaal[a.id] || 0;
              const monthly = stats.monthByAamaal[a.id] || 0;
              return (
                <div
                  key={a.id}
                  className="py-2.5 first:pt-1 last:pb-0 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-6 flex items-center justify-center shrink-0">
                      {getAamaalIcon(a)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold text-[#14261C] truncate">
                        {a.name}
                      </p>
                      <p className="text-[11px] text-[#55615A]">
                        This month: {monthly.toLocaleString('en-US')}
                      </p>
                    </div>
                  </div>
                  <strong className="font-serif text-[15px] text-[#0D4A2E] shrink-0">
                    {lifetime.toLocaleString('en-US')}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: HISTORY (Recitation Logs) */}
      {activeTab === 'history' && (
        <div className="rounded-[20px] bg-[#E8E6D5] border border-[#DCD8C6] p-4 space-y-2.5">
          <h4 className="font-serif text-[16px] font-bold text-[#14261C]">
            Recitation History ({stats.memberLogs.length})
          </h4>
          {stats.memberLogs.length === 0 ? (
            <p className="text-[12.5px] text-[#55615A] py-4 text-center">
              No recitation logs recorded for this member yet.
            </p>
          ) : (
            <div className="divide-y divide-[#DCD8C6] max-h-[360px] overflow-y-auto no-scrollbar">
              {stats.memberLogs.slice(0, 40).map((log) => (
                <div
                  key={log.id}
                  className="py-2.5 first:pt-1 last:pb-0 flex items-center justify-between text-[12.5px]"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-[#14261C] truncate">
                      {aamaalMap[log.aamaalId] || log.aamaalId}
                    </p>
                    <p className="text-[11px] text-[#55615A]">
                      {formatAnyDatePretty(log.dateKey)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2.5 shrink-0">
                    <strong className="text-[#0D4A2E] text-[13.5px]">
                      {Number(log.count).toLocaleString('en-US')}
                    </strong>
                    {onDeleteSingleLog && (
                      <button
                        type="button"
                        onClick={() => onDeleteSingleLog(log.id)}
                        aria-label="Delete log"
                        className="w-6 h-6 rounded-full bg-[#F5E6E4] text-[#B93A32] text-[11px] font-bold flex items-center justify-center"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="rounded-[20px] bg-[#E8E6D5] border border-[#DCD8C6] p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13.5px] font-bold text-[#14261C]">Privacy Mode</p>
              <p className="text-[11px] text-[#55615A]">
                {isPrivate ? 'Hidden from public reports' : 'Visible in circle reports'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onUpdateMember) {
                  onUpdateMember(member.id, {
                    privacy: isPrivate ? 'public' : 'private',
                  });
                }
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#0D4A2E] text-white text-[11.5px] font-semibold"
            >
              Switch to {isPrivate ? 'Public' : 'Private'}
            </button>
          </div>

          {member.isPrimary && (
            <div className="pt-3 border-t border-[#DCD8C6] flex items-center justify-between">
              <div>
                <p className="text-[13.5px] font-bold text-[#14261C]">Admin Role</p>
                <p className="text-[11px] text-[#55615A]">
                  {isAdminRole ? 'Has Admin Panel access' : 'Standard member'}
                </p>
              </div>
              <MemberPermissions
                member={member}
                onToggleRole={(id, nextRole) => {
                  if (onUpdateMember) onUpdateMember(id, { role: nextRole });
                }}
              />
            </div>
          )}

          {!member.isPrimary && (
            <div className="pt-3 border-t border-[#DCD8C6] space-y-1">
              <p className="text-[12px] text-[#55615A]">
                Linked Family Profile (via{' '}
                <strong className="text-[#14261C]">
                  {parentMember?.name || 'Primary Member'}
                </strong>
                )
              </p>
              <button
                type="button"
                onClick={() => setSubAction('remove')}
                className="mt-2 w-full py-2.5 rounded-full bg-[#F5E6E4] border border-[#D9A7A2] text-[#B93A32] text-[12.5px] font-bold"
              >
                🗑️ Remove Family Member
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}