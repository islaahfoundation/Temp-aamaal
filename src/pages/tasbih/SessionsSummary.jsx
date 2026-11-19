//Displays total lifetime beads, completed goals, and session breakdown.

// src/pages/tasbih/SessionsSummary.jsx
// src/pages/tasbih/SessionsSummary.jsx
import React from 'react';

export default function SessionsSummary({
  totalDhikrCount = 0,
  completedSessionsCount = 0,
  onBack,
}) {
  const historyLogs = (() => {
    try {
      const parsed = JSON.parse(
        localStorage.getItem('aamaal_tasbih_history_v1') || '[]'
      );
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  })();

  const totalSessions = Math.max(completedSessionsCount, historyLogs.length);
  const loggedBeadsSum = historyLogs.reduce(
    (sum, item) => sum + Number(item.count || 0),
    0
  );
  const effectiveTotalBeads = Math.max(Number(totalDhikrCount || 0), loggedBeadsSum);
  const avgPerSession =
    totalSessions > 0 ? Math.round(effectiveTotalBeads / totalSessions) : 0;

  // Group counts by Dhikr title
  const dhikrMap = {};
  historyLogs.forEach((log) => {
    const key = log.dhikrTitle || 'Dhikr';
    dhikrMap[key] = (dhikrMap[key] || 0) + Number(log.count || 0);
  });

  const dhikrBreakdown = Object.entries(dhikrMap)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count);

  const topDhikr = dhikrBreakdown[0]?.title || 'Allahu Akbar';

  const formatDate = (isoStr) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date(isoStr));
    } catch (_) {
      return '';
    }
  };

  return (
    <div className="screen-section no-scrollbar px-5 pt-4 pb-6 space-y-4 fade-in">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary px-3.5 py-1.5 text-[11.5px] font-semibold"
        >
          ← Back to Tasbih Counter
        </button>
      )}

      <div>
        <span className="badge-pill">Remembrance Analytics</span>
        <h2 className="font-serif text-[23px] font-semibold text-primary mt-1">
          📊 Tasbih Summary &amp; Statistics
        </h2>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card rounded-[20px] p-4 text-center bg-[#F3EFE2]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
            Total Beads Recited
          </span>
          <div className="font-serif text-[26px] font-bold text-[#135332] mt-1">
            {effectiveTotalBeads.toLocaleString('en-US')}
          </div>
        </div>

        <div className="card rounded-[20px] p-4 text-center bg-[#F3EFE2]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
            Completed Goals
          </span>
          <div className="font-serif text-[26px] font-bold text-primary mt-1">
            {totalSessions}
          </div>
        </div>

        <div className="card rounded-[20px] p-4 text-center bg-[#F3EFE2]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
            Avg. Beads / Session
          </span>
          <div className="font-serif text-[24px] font-bold text-[#0D4A2E] mt-1">
            {avgPerSession.toLocaleString('en-US')}
          </div>
        </div>

        <div className="card rounded-[20px] p-4 text-center bg-[#F3EFE2]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
            Most Recited
          </span>
          <div className="font-serif text-[16px] font-bold text-[#135332] mt-2 truncate">
            {topDhikr}
          </div>
        </div>
      </div>

      {/* Breakdown by Dhikr */}
      <div className="card rounded-[22px] p-4 space-y-3 bg-[#F3EFE2]">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-[16px] font-semibold text-primary">
            Breakdown by Dhikr
          </h3>
          <span className="text-[10.5px] font-bold text-secondary">
            {dhikrBreakdown.length} Types
          </span>
        </div>

        {dhikrBreakdown.length === 0 ? (
          <p className="text-[12px] text-secondary py-2">
            Complete a Tasbih goal to see your Dhikr distribution here.
          </p>
        ) : (
          <div className="space-y-2.5">
            {dhikrBreakdown.map((item) => {
              const pct =
                loggedBeadsSum > 0
                  ? Math.round((item.count / loggedBeadsSum) * 100)
                  : 0;
              return (
                <div key={item.title} className="space-y-1">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-primary">
                      {item.title}
                    </span>
                    <span className="font-bold text-[#135332]">
                      {item.count.toLocaleString('en-US')} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#DEDBCE] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#0D4A2E] to-[#C99E4C]"
                      style={{ width: `${Math.max(pct, 6)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Completed Sessions */}
      <div className="card rounded-[22px] p-4 space-y-2.5 bg-[#F3EFE2]">
        <h3 className="font-serif text-[16px] font-semibold text-primary">
          Recent Completed Sessions
        </h3>

        {historyLogs.length === 0 ? (
          <p className="text-[12px] text-secondary py-2">
            No completed sessions yet. Tap or swipe the beads to finish your first goal.
          </p>
        ) : (
          <div className="space-y-2">
            {historyLogs.slice(0, 8).map((log) => (
              <div
                key={log.id}
                className="rounded-xl bg-[#FFFDF9] p-3 border border-[#DCD8C6] flex items-center justify-between"
              >
                <div>
                  <h4 className="font-serif text-[14px] font-semibold text-primary">
                    {log.dhikrTitle || 'Dhikr'}
                  </h4>
                  <span className="text-[10.5px] text-secondary">
                    {formatDate(log.timestamp)}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#DCE3C8] text-[#0D4A2E] text-[11px] font-bold">
                  {log.count} / {log.goal}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}