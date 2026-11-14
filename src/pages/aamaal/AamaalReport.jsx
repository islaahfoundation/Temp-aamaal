import React from 'react';
import { getLocalDateString } from './DateSelector';
import { getLocalDaysList } from './CalendarHistory';
import LifetimeTotals from './LifetimeTotals';
import WeeklySummary, { COUNTRY_FLAGS } from './WeeklySummary';
import PublicReportPreview from './PublicReportPreview';

export default function AamaalReport({
  activeAamaal,
  activeProfile,
  allMembers = [],
  allLogs = [],
  onBack,
}) {
  const todayLocal = getLocalDateString();
  const currentMonthPrefix = todayLocal.slice(0, 7);
  const last7Days = getLocalDaysList(7);
  const weekDateKeys = new Set(last7Days.map((d) => d.dateKey));

  const aamaalId = activeAamaal?.id || 'durood_313';
  const aamaalName = activeAamaal?.name || 'Durood Shareef';

  const aamaalLogs = allLogs.filter((l) => l.aamaalId === aamaalId);
  const lifetimeTotal = aamaalLogs.reduce(
    (sum, l) => sum + Number(l.count || 0),
    0
  );

  const weekLogs = aamaalLogs.filter((l) => weekDateKeys.has(l.dateKey));
  const weekGroupTotal = weekLogs.reduce(
    (sum, l) => sum + Number(l.count || 0),
    0
  );

  const monthLogs = aamaalLogs.filter((l) =>
    (l.dateKey || '').startsWith(currentMonthPrefix)
  );
  const monthGroupTotal = monthLogs.reduce(
    (sum, l) => sum + Number(l.count || 0),
    0
  );

  const groupTodayTotal = aamaalLogs
    .filter((l) => l.dateKey === todayLocal)
    .reduce((sum, l) => sum + Number(l.count || 0), 0);

  const myTodayTotal = aamaalLogs
    .filter(
      (l) => l.dateKey === todayLocal && l.memberId === activeProfile?.id
    )
    .reduce((sum, l) => sum + Number(l.count || 0), 0);

  const myWeekTotal = weekLogs
    .filter((l) => l.memberId === activeProfile?.id)
    .reduce((sum, l) => sum + Number(l.count || 0), 0);

  const myMonthTotal = monthLogs
    .filter((l) => l.memberId === activeProfile?.id)
    .reduce((sum, l) => sum + Number(l.count || 0), 0);

  // Build Member Lookup Map
  const memberMap = {};
  allMembers.forEach((m) => {
    memberMap[m.id] = m;
  });

  // Leaderboard Calculation
  const weeklyByMember = {};
  weekLogs.forEach((l) => {
    weeklyByMember[l.memberId] =
      (weeklyByMember[l.memberId] || 0) + Number(l.count || 0);
  });

  const leaderboardRows = Object.keys(weeklyByMember)
    .map((memberId) => {
      const m = memberMap[memberId] || {
        name: 'Circle Member',
        flag: '🇮🇳',
        privacy: 'public',
      };
      if (m.privacy === 'anonymous') return null;
      const displayName =
        m.privacy === 'private' ? 'Hidden Member' : m.name || 'Member';
      return {
        name: displayName,
        flag: m.flag || COUNTRY_FLAGS[m.country] || '🇮🇳',
        score: weeklyByMember[memberId],
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  // Country Aggregation Helper
  const computeCountryRows = (logsSubset) => {
    const totals = {};
    logsSubset.forEach((l) => {
      const m = memberMap[l.memberId];
      const c = m?.country || 'India';
      totals[c] = (totals[c] || 0) + Number(l.count || 0);
    });
    return Object.keys(totals)
      .map((country) => ({
        country,
        flag: COUNTRY_FLAGS[country] || '🌍',
        total: totals[country],
      }))
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  const weeklyCountryRows = computeCountryRows(weekLogs);
  const monthlyCountryRows = computeCountryRows(monthLogs);

  // 7-Day Bar Chart Data
  const last7DaysBars = last7Days.map((d) => {
    const total = aamaalLogs
      .filter((l) => l.dateKey === d.dateKey)
      .reduce((acc, l) => acc + Number(l.count || 0), 0);
    return { ...d, total };
  });

  // Public Daily Report Rows
  const todayMemberRows = allMembers.map((m) => {
    const entry = aamaalLogs.find(
      (l) => l.dateKey === todayLocal && l.memberId === m.id
    );
    return {
      displayName: m.privacy === 'private' ? 'Hidden Member' : m.name,
      flag: m.flag || '🇮🇳',
      count: entry ? Number(entry.count) : 0,
    };
  });

  const tenDaysAgo = Date.now() - 10 * 86400000;
  const newMembersCount = Math.max(
    1,
    allMembers.filter((m) => (m.createdAt || Date.now()) >= tenDaysAgo).length
  );

  return (
    <section className="screen-section no-scrollbar px-4 pt-4 pb-6">
      {/* Top Bar */}
      <div className="flex items-center space-x-3 mb-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-[#EAE8D7] border border-white flex items-center justify-center text-primary font-bold"
          >
            ‹
          </button>
        )}
        <div className="flex-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
            Worldwide Circle Analytics
          </span>
          <h2 className="font-serif text-[18px] font-semibold text-primary leading-tight">
            Total {aamaalName} Recited
          </h2>
        </div>
      </div>

      {/* Hero Cumulative Card & 3-Col Summary */}
      <LifetimeTotals
        aamaalName={aamaalName}
        lifetimeTotal={lifetimeTotal}
        weekGroupTotal={weekGroupTotal}
        totalMembers={Math.max(1, allMembers.length)}
        newMembersCount={newMembersCount}
        groupTodayTotal={groupTodayTotal}
        myTodayTotal={myTodayTotal}
      />

      {/* Leaderboard, Country Breakdown & 7-Day Chart */}
      <WeeklySummary
        aamaalName={aamaalName}
        leaderboardRows={leaderboardRows}
        weekGroupTotal={weekGroupTotal}
        myWeekTotal={myWeekTotal}
        weeklyCountryRows={weeklyCountryRows}
        monthGroupTotal={monthGroupTotal}
        myMonthTotal={myMonthTotal}
        monthlyCountryRows={monthlyCountryRows}
        last7DaysBars={last7DaysBars}
      />

      {/* Public Shareable Report Preview */}
      <PublicReportPreview
        aamaalName={aamaalName}
        dateKey={todayLocal}
        memberRows={todayMemberRows}
        totalCount={groupTodayTotal}
      />
    </section>
  );
}