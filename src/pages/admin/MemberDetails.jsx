//Displays a comprehensive admin drill-down view for any circle or family member: per-Aamaal recitation totals, recent log history, role toggle, rename/edit, reset logs, and remove member.   

import React, { useState, useMemo } from 'react';
import { CountryFlag } from '../aamaal/WeeklySummary';
import { formatAnyDatePretty, getLocalDateString } from '../aamaal/DateSelector';
import {
  SHORT_MONTHS,
  ScreenHeader,
  MemberAvatar,
  StatusBadge,
  AamaalIcon,
  resolveAamaalStatus,
} from './adminShared';
import EditMember from './EditMember';
import RemoveMember from './RemoveMember';
import MemberPermissions from './MemberPermissions';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [subAction, setSubAction] = useState(null); // 'edit' | 'reset' | 'remove' | null

  const todayStr = getLocalDateString();
  const currentMonthPrefix = todayStr.slice(0, 7);

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

    const monthLogs = memberLogs.filter((l) => String(l.dateKey || '').startsWith(currentMonthPrefix));
    const daysActive = new Set(monthLogs.map((l) => l.dateKey)).size;
    const daysMissed = Math.max(0, elapsedDays - daysActive);
    const monthPct = Math.min(100, Math.round((daysActive / Math.max(1, totalDaysInMonth)) * 100));

    const monthByAamaal = {};
    const lifetimeByAamaal = {};
    memberLogs.forEach((l) => {
      lifetimeByAamaal[l.aamaalId] = (lifetimeByAamaal[l.aamaalId] || 0) + Number(l.count || 0);
    });
    monthLogs.forEach((l) => {
      monthByAamaal[l.aamaalId] = (monthByAamaal[l.aamaalId] || 0) + Number(l.count || 0);
    });

    const createdDate = member.createdAt ? new Date(Number(member.createdAt)) : new Date();
    const memberSince = `${SHORT_MONTHS[createdDate.getMonth()]} ${createdDate.getFullYear()}`;

    return {
      memberLogs, totalLifetime, daysActive, daysMissed, totalDaysInMonth,
      monthPct, monthLabel, monthByAamaal, lifetimeByAamaal, memberSince,
      isActive: memberLogs.length > 0,
    };
  }, [member, allLogs, todayStr, currentMonthPrefix]);

  if (!member || !stats) return null;

  const visibleAamaals = aamaalList.filter((a) => resolveAamaalStatus(a) !== 'deleted');
  const aamaalMap = Object.fromEntries(aamaalList.map((a) => [a.id, a.name]));
  const isAdminRole = member.role === 'admin';
  const isPrivate = member.privacy === 'private';

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (stats.monthPct / 100) * circumference;

  return (
    <div className="h-full flex flex-col bg-[#F7F5EE] overflow-hidden fade-in select-none">
      <ScreenHeader title="Member Details" onBack={onBack} />

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 pb-4 space-y-3.5">
        {/* Profile Card */}
        <div className="rounded-[22px] bg-[#FCFBF7] border border-[#E6E2D5] shadow-[0_3px_12px_rgba(20,38,28,0.04)] p-4 flex items-center space-x-3.5 relative">
          <MemberAvatar member={member} size="xl" />
          <div className="min-w-0 flex-1 pr-6">
            <h3 className="font-serif text-[20px] font-bold text-[#14261C] leading-tight truncate">{member.name}</h3>
            <div className="flex items-center space-x-1.5 mt-1">
              <CountryFlag country={member.country || 'India'} size={15} />
              <span className="text-[12.5px] font-medium text-[#4E5953] truncate">{member.country || 'India'}</span>
            </div>
            <p className="text-[11.5px] text-[#66736B] mt-0.5">Member since {stats.memberSince}</p>
            <div className="flex items-center space-x-1.5 mt-1.5">
              <span className="text-[12px] font-semibold text-[#0D4A2E]">Status:</span>
              <StatusBadge status={stats.isActive ? 'active' : 'inactive'} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSubAction(subAction === 'edit' ? null : 'edit')}
            aria-label="Edit Member"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center text-[#14261C] hover:bg-[#EAE8D7]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </button>
        </div>

        {/* Inline Action Drawers */}
        {subAction === 'edit' && (
          <EditMember
            member={member}
            onSaveMember={(id, updates) => {
              onUpdateMember?.(id, updates);
              setSubAction(null);
            }}
            onCancel={() => setSubAction(null)}
          />
        )}

        {subAction === 'reset' && (
          <div className="rounded-[18px] bg-[#FBF0EE] border border-[#E5B8B4] p-3.5 space-y-2.5">
            <p className="text-[12.5px] font-semibold text-[#6B2D26]">
              Reset all {stats.memberLogs.length} recitation logs for {member.name} to 0?
            </p>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  onResetMemberLogs?.(member.id);
                  setSubAction(null);
                }}
                className="flex-1 py-2 rounded-full bg-[#B93A32] text-white text-[12px] font-bold"
              >
                Confirm Reset
              </button>
              <button type="button" onClick={() => setSubAction(null)} className="px-4 py-2 rounded-full bg-white text-[#14261C] text-[12px] font-semibold border border-[#E6E2D5]">
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
            onConfirmRemove={(id) => onRemoveMember?.(id)}
            onCancel={() => setSubAction(null)}
          />
        )}

        {/* 4-Tab Segmented Nav */}
        <div className="rounded-full bg-[#EFECE1] border border-[#E5E1D3] p-1 grid grid-cols-4 gap-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'aamaal', label: 'Aamaal' },
            { id: 'history', label: 'History' },
            { id: 'settings', label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-1.5 rounded-full text-[12px] font-semibold transition ${
                activeTab === tab.id ? 'bg-[#0D4A2E] text-white shadow-sm' : 'text-[#4E5953]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-3.5">
            <div className="rounded-[20px] bg-[#FCFBF7] border border-[#E6E2D5] py-3.5 px-2 grid grid-cols-3 divide-x divide-[#EAE6D8] text-center">
              <div>
                <p className="text-[22px] font-bold text-[#14261C] leading-none">{stats.daysActive}</p>
                <p className="text-[11px] font-medium text-[#55615A] mt-1.5">Days Active</p>
              </div>
              <div>
                <p className="text-[22px] font-bold text-[#14261C] leading-none">{stats.daysMissed}</p>
                <p className="text-[11px] font-medium text-[#55615A] mt-1.5">Days Missed</p>
              </div>
              <div>
                <p className="text-[22px] font-bold text-[#14261C] leading-none">{stats.totalLifetime.toLocaleString('en-US')}</p>
                <p className="text-[11px] font-medium text-[#55615A] mt-1.5">Total Count</p>
              </div>
            </div>

            <div className="rounded-[22px] bg-[#FCFBF7] border border-[#E6E2D5] p-4 space-y-4">
              <h4 className="text-[15.5px] font-bold text-[#14261C]">This Month ({stats.monthLabel})</h4>

              <div className="flex items-center justify-center space-x-6 py-1">
                <div className="relative w-[96px] h-[96px] flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r={radius} fill="none" stroke="#E2EBE3" strokeWidth="9" />
                    <circle
                      cx="48" cy="48" r={radius} fill="none" stroke="url(#memberRingGrad)"
                      strokeWidth="9" strokeLinecap="round"
                      strokeDasharray={circumference} strokeDashoffset={dashOffset}
                    />
                    <defs>
                      <linearGradient id="memberRingGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0D4A2E" />
                        <stop offset="100%" stopColor="#28A760" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute text-[20px] font-bold text-[#14261C]">{stats.monthPct}%</span>
                </div>

                <div>
                  <p className="text-[24px] font-bold text-[#14261C] leading-none">
                    {stats.daysActive} / {stats.totalDaysInMonth}
                  </p>
                  <p className="text-[13px] font-medium text-[#4E5953] mt-1">Days Completed</p>
                </div>
              </div>

              <div className="divide-y divide-[#EDE9DC] pt-1">
                {visibleAamaals.map((a) => (
                  <div key={a.id} className="py-2.5 first:pt-1 last:pb-0 flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0">
                      <AamaalIcon aamaal={a} className="w-5 h-5 shrink-0" />
                      <span className="text-[13.5px] font-semibold text-[#14261C] truncate">{a.name}</span>
                    </div>
                    <span className="text-[14px] font-bold text-[#14261C] shrink-0">
                      {(stats.monthByAamaal[a.id] || 0).toLocaleString('en-US')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-[18px] bg-[#FCFBF7] border border-[#E6E2D5] p-3.5 space-y-2">
                <p className="text-[12px] font-bold text-[#14261C]">Privacy Mode</p>
                <div className="flex items-center space-x-2.5">
                  <svg className="w-6 h-6 text-[#0D4A2E] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <line x1="3.6" y1="9" x2="20.4" y2="9" />
                    <line x1="3.6" y1="15" x2="20.4" y2="15" />
                    <path d="M12 3a14.5 14.5 0 0 0 0 18 14.5 14.5 0 0 0 0-18z" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[#14261C] leading-tight">{isPrivate ? 'Private' : 'Public'}</p>
                    <p className="text-[10.5px] text-[#55615A] truncate mt-0.5">{isPrivate ? 'Hidden in reports' : 'Visible in reports'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[18px] bg-[#FCFBF7] border border-[#E6E2D5] p-3.5 space-y-2">
                <p className="text-[12px] font-bold text-[#14261C]">Admin Access</p>
                <div className="flex items-center space-x-2.5">
                  <svg className="w-6 h-6 text-[#0D4A2E] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M12 8v8" />
                    <path d="M8 12h8" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[#14261C] leading-tight">{isAdminRole ? 'Yes' : 'No'}</p>
                    <p className="text-[10.5px] text-[#55615A] truncate mt-0.5">{isAdminRole ? 'Circle admin' : 'Not an admin'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AAMAAL TAB */}
        {activeTab === 'aamaal' && (
          <div className="rounded-[20px] bg-[#FCFBF7] border border-[#E6E2D5] p-4 space-y-2.5">
            <h4 className="font-serif text-[16px] font-bold text-[#14261C]">Cumulative Totals by Aamaal</h4>
            <div className="divide-y divide-[#EDE9DC]">
              {visibleAamaals.map((a) => (
                <div key={a.id} className="py-2.5 first:pt-1 last:pb-0 flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <AamaalIcon aamaal={a} className="w-5 h-5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold text-[#14261C] truncate">{a.name}</p>
                      <p className="text-[11px] text-[#55615A]">This month: {(stats.monthByAamaal[a.id] || 0).toLocaleString('en-US')}</p>
                    </div>
                  </div>
                  <strong className="font-serif text-[15px] text-[#0D4A2E] shrink-0">
                    {(stats.lifetimeByAamaal[a.id] || 0).toLocaleString('en-US')}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="rounded-[20px] bg-[#FCFBF7] border border-[#E6E2D5] p-4 space-y-2.5">
            <h4 className="font-serif text-[16px] font-bold text-[#14261C]">Recitation History ({stats.memberLogs.length})</h4>
            {stats.memberLogs.length === 0 ? (
              <p className="text-[12.5px] text-[#55615A] py-4 text-center">No recitation logs recorded yet.</p>
            ) : (
              <div className="divide-y divide-[#EDE9DC]">
                {stats.memberLogs.slice(0, 40).map((log) => (
                  <div key={log.id} className="py-2.5 first:pt-1 last:pb-0 flex items-center justify-between text-[12.5px]">
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-[#14261C] truncate">{aamaalMap[log.aamaalId] || log.aamaalId}</p>
                      <p className="text-[11px] text-[#55615A]">{formatAnyDatePretty(log.dateKey)}</p>
                    </div>
                    <div className="flex items-center space-x-2.5 shrink-0">
                      <strong className="text-[#0D4A2E] text-[13.5px]">{Number(log.count).toLocaleString('en-US')}</strong>
                      {onDeleteSingleLog && (
                        <button type="button" onClick={() => onDeleteSingleLog(log.id)} aria-label="Delete log" className="w-6 h-6 rounded-full bg-[#FBF0EE] text-[#B93A32] text-[11px] font-bold flex items-center justify-center">
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

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="rounded-[20px] bg-[#FCFBF7] border border-[#E6E2D5] p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13.5px] font-bold text-[#14261C]">Privacy Mode</p>
                <p className="text-[11px] text-[#55615A]">{isPrivate ? 'Hidden from public reports' : 'Visible in circle reports'}</p>
              </div>
              <button
                type="button"
                onClick={() => onUpdateMember?.(member.id, { privacy: isPrivate ? 'public' : 'private' })}
                className="px-3.5 py-1.5 rounded-full bg-[#0D4A2E] text-white text-[11.5px] font-semibold"
              >
                Switch to {isPrivate ? 'Public' : 'Private'}
              </button>
            </div>

            {member.isPrimary && member.id !== 'primary_member' && (
              <div className="pt-3 border-t border-[#EDE9DC] flex items-center justify-between">
                <div>
                  <p className="text-[13.5px] font-bold text-[#14261C]">Admin Role</p>
                  <p className="text-[11px] text-[#55615A]">{isAdminRole ? 'Has Admin Panel access' : 'Standard member'}</p>
                </div>
                <MemberPermissions member={member} onToggleRole={(id, nextRole) => onUpdateMember?.(id, { role: nextRole })} />
              </div>
            )}

            {member.id !== 'primary_member' && (
              <div className="pt-3 border-t border-[#EDE9DC] space-y-2">
                {!member.isPrimary && (
                  <p className="text-[12px] text-[#55615A]">
                    Linked Family Profile (via <strong className="text-[#14261C]">{parentMember?.name || 'Primary Member'}</strong>)
                  </p>
                )}
                <button type="button" onClick={() => setSubAction('remove')} className="w-full py-2.5 rounded-full bg-[#FBF0EE] border border-[#E5B8B4] text-[#B93A32] text-[12.5px] font-bold">
                  Remove Member
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PINNED BOTTOM ACTION BAR */}
      <div className="shrink-0 px-4 py-3 bg-[#F7F5EE]/95 backdrop-blur-md border-t border-[#E6E2D5] grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setSubAction(subAction === 'reset' ? null : 'reset')}
          className="h-[46px] rounded-full bg-[#FCFBF7] border-[1.5px] border-[#C9544D] text-[#B93A32] text-[13.5px] font-semibold flex items-center justify-center space-x-2 active:scale-[0.98] transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
          <span>Reset Data</span>
        </button>

        <button
          type="button"
          onClick={() => setSubAction(subAction === 'edit' ? null : 'edit')}
          className="h-[46px] rounded-full bg-gradient-to-r from-[#0B462B] via-[#135B39] to-[#083B23] text-white text-[13.5px] font-semibold shadow-md flex items-center justify-center space-x-2 active:scale-[0.98] transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span>Edit Member</span>
        </button>
      </div>
    </div>
  );
}