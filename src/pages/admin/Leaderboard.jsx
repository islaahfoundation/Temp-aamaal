//Renders the Admin Leaderboard Inspector with the option to view Public Names or Include Private/Anonymous Members for internal circle administration.

import React, { useState } from 'react';
import { CountryFlag } from '../aamaal/WeeklySummary';
import { getLocalDaysList } from '../aamaal/CalendarHistory';

export default function Leaderboard({
  aamaalList = [],
  allMembers = [],
  allLogs = [],
}) {
  const [selectedAamaalId, setSelectedAamaalId] = useState(
    aamaalList[0]?.id || 'durood_313'
  );
  const [showHiddenNames, setShowHiddenNames] = useState(false);

  const weekKeys = new Set(getLocalDaysList(7).map((d) => d.dateKey));

  const memberMap = {};
  allMembers.forEach((m) => {
    memberMap[m.id] = m;
  });

  const totalsByMember = {};
  allLogs.forEach((l) => {
    if (l.aamaalId === selectedAamaalId && weekKeys.has(l.dateKey)) {
      totalsByMember[l.memberId] =
        (totalsByMember[l.memberId] || 0) + Number(l.count || 0);
    }
  });

  const rows = Object.keys(totalsByMember)
    .map((memberId) => {
      const m = memberMap[memberId] || {
        id: memberId,
        name: 'Member',
        country: 'India',
        privacy: 'public',
      };
      if (!showHiddenNames && m.privacy === 'anonymous') return null;
      const displayName = showHiddenNames
        ? m.name
        : m.privacy === 'private'
        ? 'Hidden Member'
        : m.name;

      return {
        id: m.id,
        name: displayName,
        country: m.country || 'India',
        privacy: m.privacy || 'public',
        score: totalsByMember[memberId],
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  const maxScore = rows.length > 0 ? Math.max(...rows.map((r) => r.score), 1) : 1;

  return (
    <div className="card rounded-[20px] p-4 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
            Rankings
          </span>
          <h3 className="font-serif text-[17px] font-semibold text-primary">
            🏆 Weekly Circle Leaderboard
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setShowHiddenNames(!showHiddenNames)}
          className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border transition ${
            showHiddenNames
              ? 'bg-[#0D4A2E] text-white border-[#0D4A2E]'
              : 'bg-[#EAE8D7] text-primary border-[#D5D2BE]'
          }`}
        >
          {showHiddenNames ? '👁️ Showing Real Names' : '🔒 Public View'}
        </button>
      </div>

      <select
        value={selectedAamaalId}
        onChange={(e) => setSelectedAamaalId(e.target.value)}
        className="bg-[#F5F2E8] text-primary text-[12px] font-semibold py-1.5 px-2.5 rounded-xl"
      >
        {aamaalList.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>

      <div className="divide-y divide-[#E2DEC9]">
        {rows.length === 0 ? (
          <p className="text-center text-[12px] text-muted py-3">
            No recitations logged for this Aamaal this week yet.
          </p>
        ) : (
          rows.map((item, idx) => {
            const pct = Math.max(Math.round((item.score / maxScore) * 100), 6);
            return (
              <div key={item.id} className="py-2.5 first:pt-1 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-[#EAE8D7] text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <CountryFlag country={item.country} size={17} />
                    <span className="text-[13px] font-semibold text-primary truncate">
                      {item.name}
                    </span>
                    {item.privacy !== 'public' && (
                      <span className="px-1.5 py-0.5 rounded bg-[#EAE8D7] text-[9px] font-bold uppercase text-secondary">
                        {item.privacy}
                      </span>
                    )}
                  </div>
                  <strong className="font-serif text-[14px] text-[#135332]">
                    {item.score.toLocaleString('en-US')}
                  </strong>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#DEDCCF] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#135332]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}