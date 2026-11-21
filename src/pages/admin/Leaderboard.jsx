//Renders the Admin Leaderboard Inspector with the option to view Public Names or Include Private/Anonymous Members for internal circle administration.

import React, { useState, useMemo } from 'react';
import { CountryFlag } from '../aamaal/WeeklySummary';
import { ScreenHeader, MonthSwitcher, MemberAvatar } from './adminShared';

function RankBadge({ rank }) {
  const styles = {
    1: { bg: 'bg-[#F5C542]', ring: 'border-[#D99B16]', text: 'text-[#6E4800]' },
    2: { bg: 'bg-[#D6DBE0]', ring: 'border-[#9BA4AE]', text: 'text-[#3F4852]' },
    3: { bg: 'bg-[#D99A6C]', ring: 'border-[#A66335]', text: 'text-[#5A2D0C]' },
  };
  if (styles[rank]) {
    const s = styles[rank];
    return (
      <div className="w-7 flex flex-col items-center shrink-0">
        <span className={`w-6 h-6 rounded-full ${s.bg} border-2 ${s.ring} ${s.text} text-[11px] font-extrabold flex items-center justify-center shadow-sm`}>
          {rank}
        </span>
      </div>
    );
  }
  return (
    <span className="w-7 text-center text-[13.5px] font-bold text-[#55615A] shrink-0">
      {rank}
    </span>
  );
}

export default function Leaderboard({
  allMembers = [],
  allLogs = [],
  initialMonth,
  onBack,
}) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (initialMonth) return initialMonth;
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [metricTab, setMetricTab] = useState('total'); // 'total' | 'consistency' | 'active'
  const [showHiddenNames, setShowHiddenNames] = useState(false);

  const shiftMonth = (delta) => {
    setSelectedMonth((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const rows = useMemo(() => {
    const prefix = `${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, '0')}`;
    const daysInMonth = new Date(selectedMonth.year, selectedMonth.month + 1, 0).getDate();
    const memberMap = Object.fromEntries(allMembers.map((m) => [m.id, m]));

    const agg = {};
    allLogs.forEach((l) => {
      if (!String(l.dateKey || '').startsWith(prefix) || Number(l.count || 0) <= 0) return;
      if (!agg[l.memberId]) agg[l.memberId] = { total: 0, days: new Set(), entries: 0 };
      agg[l.memberId].total += Number(l.count || 0);
      agg[l.memberId].days.add(l.dateKey);
      agg[l.memberId].entries += 1;
    });

    return Object.entries(agg)
      .map(([memberId, data]) => {
        const m = memberMap[memberId] || { id: memberId, name: 'Member', country: 'India', privacy: 'public' };
        if (!showHiddenNames && m.privacy === 'anonymous') return null;
        const displayName = showHiddenNames ? m.name : m.privacy === 'private' ? 'Hidden Member' : m.name;
        const activeDays = data.days.size;
        const consistencyPct = Math.min(100, Math.round((activeDays / Math.max(1, daysInMonth)) * 100));

        return {
          member: m,
          id: m.id,
          name: displayName,
          country: m.country || 'India',
          total: data.total,
          consistencyPct,
          activeDays,
          entries: data.entries,
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (metricTab === 'consistency') return b.consistencyPct - a.consistencyPct || b.total - a.total;
        if (metricTab === 'active') return b.activeDays - a.activeDays || b.entries - a.entries;
        return b.total - a.total;
      });
  }, [allMembers, allLogs, selectedMonth, metricTab, showHiddenNames]);

  return (
    <section className="screen-section no-scrollbar bg-[#F7F5EE] min-h-[100dvh] flex flex-col pb-24 select-none">
      <ScreenHeader
        title="Leaderboard"
        onBack={onBack}
        rightSlot={
          <button
            type="button"
            onClick={() => setShowHiddenNames((v) => !v)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition ${
              showHiddenNames
                ? 'bg-[#0D4A2E] text-white border-[#0D4A2E]'
                : 'bg-[#FCFBF7] text-[#4E5953] border-[#E6E2D5]'
            }`}
          >
            {showHiddenNames ? '👁️ Real Names' : '🔒 Public'}
          </button>
        }
      />

      <div className="px-4 space-y-3.5 flex-1">
        <MonthSwitcher year={selectedMonth.year} month={selectedMonth.month} onShift={shiftMonth} />

        {/* 3-Tab Metric Switcher */}
        <div className="rounded-full bg-[#EFECE1] border border-[#E5E1D3] p-1 grid grid-cols-3 gap-1">
          {[
            { id: 'total', label: 'Total Count' },
            { id: 'consistency', label: 'Consistency' },
            { id: 'active', label: 'Most Active' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMetricTab(tab.id)}
              className={`py-2 rounded-full text-[12px] font-semibold transition ${
                metricTab === tab.id ? 'bg-[#0D4A2E] text-white shadow-sm' : 'text-[#4E5953]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Ranked List */}
        <div className="rounded-[20px] bg-[#FCFBF7] border border-[#E6E2D5] shadow-[0_3px_12px_rgba(20,38,28,0.04)] divide-y divide-[#EDE9DC] px-3.5">
          {rows.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-[#55615A]">
              No recitations logged for this month yet.
            </p>
          ) : (
            rows.map((item, idx) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-3 min-w-0">
                  <RankBadge rank={idx + 1} />
                  <MemberAvatar member={item.member} size="md" />
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-[#14261C] truncate">{item.name}</p>
                    <div className="mt-0.5 flex items-center space-x-1">
                      <CountryFlag country={item.country} size={14} />
                    </div>
                  </div>
                </div>

                <strong className="text-[16px] font-bold text-[#14261C] shrink-0">
                  {metricTab === 'total' && item.total.toLocaleString('en-US')}
                  {metricTab === 'consistency' && `${item.consistencyPct}%`}
                  {metricTab === 'active' && `${item.activeDays}d`}
                </strong>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}