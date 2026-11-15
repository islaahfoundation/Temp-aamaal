//Displays the Admin Country-by-Country breakdown of both Active Circle Members and Total Recitations (with <CountryFlag/> images and progress bars)

import React, { useState } from 'react';
import { CountryFlag } from '../aamaal/WeeklySummary';
import { formatCompactNumber, getLocalDaysList } from '../aamaal/CalendarHistory';

export default function CountryStatistics({
  aamaalList = [],
  allMembers = [],
  allLogs = [],
}) {
  const [selectedAamaalId, setSelectedAamaalId] = useState('all');
  const [period, setPeriod] = useState('all'); // '7d' | '30d' | 'all'

  const keys7 = new Set(getLocalDaysList(7).map((d) => d.dateKey));
  const keys30 = new Set(getLocalDaysList(30).map((d) => d.dateKey));

  const memberMap = {};
  const memberCountByCountry = {};
  allMembers.forEach((m) => {
    memberMap[m.id] = m;
    const c = m.country || 'India';
    memberCountByCountry[c] = (memberCountByCountry[c] || 0) + 1;
  });

  const filteredLogs = allLogs.filter((l) => {
    if (selectedAamaalId !== 'all' && l.aamaalId !== selectedAamaalId) {
      return false;
    }
    if (period === '7d') return keys7.has(l.dateKey);
    if (period === '30d') return keys30.has(l.dateKey);
    return true;
  });

  const recitationsByCountry = {};
  filteredLogs.forEach((l) => {
    const m = memberMap[l.memberId];
    const country = m?.country || 'India';
    recitationsByCountry[country] =
      (recitationsByCountry[country] || 0) + Number(l.count || 0);
  });

  const allCountries = Array.from(
    new Set([
      ...Object.keys(memberCountByCountry),
      ...Object.keys(recitationsByCountry),
    ])
  );

  const countryRows = allCountries
    .map((country) => ({
      country,
      membersCount: memberCountByCountry[country] || 0,
      totalRecited: recitationsByCountry[country] || 0,
    }))
    .sort((a, b) => b.totalRecited - a.totalRecited || b.membersCount - a.membersCount);

  const maxRecited = Math.max(...countryRows.map((r) => r.totalRecited), 1);

  return (
    <div className="card rounded-[20px] p-4 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
            Geographic Reach
          </span>
          <h3 className="font-serif text-[17px] font-semibold text-primary">
            🌍 Top by Country Analytics
          </h3>
        </div>

        {/* Period Pills */}
        <div className="inline-flex rounded-full p-0.5 bg-[#EAE8D7] border border-[#D5D2BE]">
          {[
            { id: '7d', label: '7D' },
            { id: '30d', label: '30D' },
            { id: 'all', label: 'All-Time' },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold transition ${
                period === p.id ? 'bg-[#0D4A2E] text-white' : 'text-primary'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Aamaal Filter */}
      <div>
        <select
          value={selectedAamaalId}
          onChange={(e) => setSelectedAamaalId(e.target.value)}
          className="bg-[#F5F2E8] text-primary text-[12px] font-semibold py-1.5 px-2.5 rounded-xl"
        >
          <option value="all">All Aamaals Combined</option>
          {aamaalList.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      {/* Country Rows */}
      <div className="space-y-2.5 pt-1">
        {countryRows.map((row) => {
          const pct = Math.max(
            Math.round((row.totalRecited / maxRecited) * 100),
            5
          );
          return (
            <div key={row.country} className="space-y-1">
              <div className="flex items-center justify-between text-[12.5px]">
                <div className="flex items-center space-x-2 font-semibold text-primary">
                  <CountryFlag country={row.country} size={18} />
                  <span>{row.country}</span>
                  <span className="text-[10.5px] text-secondary font-normal">
                    ({row.membersCount}{' '}
                    {row.membersCount === 1 ? 'member' : 'members'})
                  </span>
                </div>
                <strong className="font-serif text-[13.5px] text-[#135332]">
                  {formatCompactNumber(row.totalRecited)}
                </strong>
              </div>
              <div className="w-full h-2 rounded-full bg-[#DEDCCF] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0D4A2E] to-[#358C44]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}