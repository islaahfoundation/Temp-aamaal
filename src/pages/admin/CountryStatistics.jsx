//Displays the Admin Country-by-Country breakdown of both Active Circle Members and Total Recitations (with <CountryFlag/> images and progress bars)

import React, { useMemo } from 'react';
import { CountryFlag } from '../aamaal/WeeklySummary';
import { ScreenHeader } from './adminShared';

const REGION_HIGHLIGHTS = {
  India: 'india',
  'United States': 'na',
  USA: 'na',
  Canada: 'na',
  'Saudi Arabia': 'me',
  UAE: 'me',
  'United Arab Emirates': 'me',
  Qatar: 'me',
  Kuwait: 'me',
  UK: 'eu',
  'United Kingdom': 'eu',
  Pakistan: 'india',
  Bangladesh: 'india',
  Australia: 'au',
};

function StylizedWorldMap({ activeRegions }) {
  const fill = (region) => (activeRegions.has(region) ? '#177245' : '#D5E5D9');

  return (
    <div className="rounded-[20px] bg-[#FCFBF7] border border-[#E6E2D5] p-3 overflow-hidden">
      <svg viewBox="0 0 360 170" className="w-full h-auto" fill="none">
        {/* North America */}
        <path d="M22 36l28-14 34 6 16 18-12 20-16 6-14 14-14-4-14-18-8-14z" fill={fill('na')} />
        {/* South America */}
        <path d="M88 92l18 6 14 22-8 32-14 10-10-18-4-28z" fill="#D5E5D9" />
        {/* Europe */}
        <path d="M162 28l30-6 18 12-6 18-24 4-16-8z" fill={fill('eu')} />
        {/* Africa */}
        <path d="M162 66l26-4 22 14 4 24-14 34-14 6-14-24-12-26z" fill="#D5E5D9" />
        {/* Middle East */}
        <path d="M204 56l20 2 10 16-12 12-16-6z" fill={fill('me')} />
        {/* Asia */}
        <path d="M210 26l62-6 46 18-12 32-28 12-28-6-20-14-18-14z" fill="#CDE0D1" />
        {/* South Asia / India Highlight */}
        <path d="M242 64l16 4 6 20-10 14-10-14-4-16z" fill={fill('india')} />
        {/* Australia */}
        <path d="M288 112l28 4 12 18-12 16-24-4-8-18z" fill={fill('au')} />
      </svg>
    </div>
  );
}

export default function CountryStatistics({ allMembers = [], allLogs = [], onBack }) {
  const { topThree, tableRows, activeRegions } = useMemo(() => {
    const memberMap = {};
    const membersByCountry = {};
    allMembers.forEach((m) => {
      memberMap[m.id] = m;
      const c = m.country || 'India';
      membersByCountry[c] = (membersByCountry[c] || 0) + 1;
    });

    const totalsByCountry = {};
    allLogs.forEach((l) => {
      const c = memberMap[l.memberId]?.country || 'India';
      totalsByCountry[c] = (totalsByCountry[c] || 0) + Number(l.count || 0);
    });

    const countries = Array.from(new Set([...Object.keys(membersByCountry), ...Object.keys(totalsByCountry)]));
    const sorted = countries
      .map((country) => ({
        country,
        members: membersByCountry[country] || 0,
        total: totalsByCountry[country] || 0,
      }))
      .sort((a, b) => b.total - a.total || b.members - a.members);

    const regions = new Set();
    sorted.forEach((r) => {
      if (REGION_HIGHLIGHTS[r.country]) regions.add(REGION_HIGHLIGHTS[r.country]);
    });

    const top3 = sorted.slice(0, 3);
    const rest = sorted.slice(3);
    const rows = [...top3];
    if (rest.length > 0) {
      rows.push({
        country: 'Others',
        isOthers: true,
        members: rest.reduce((s, r) => s + r.members, 0),
        total: rest.reduce((s, r) => s + r.total, 0),
      });
    }

    return { topThree: top3, tableRows: rows, activeRegions: regions };
  }, [allMembers, allLogs]);

  return (
    <section className="screen-section no-scrollbar bg-[#F7F5EE] min-h-[100dvh] flex flex-col pb-24 select-none">
      <ScreenHeader title="Country-wise Statistics" onBack={onBack} />

      <div className="px-4 space-y-4 flex-1">
        {/* Top 3 Country Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {topThree.map((c) => (
            <div key={c.country} className="rounded-[18px] bg-[#FCFBF7] border border-[#E6E2D5] shadow-[0_3px_10px_rgba(20,38,28,0.04)] p-3 space-y-2.5">
              <CountryFlag country={c.country} size={24} />
              <div className="flex items-end justify-between gap-1">
                <div>
                  <p className="text-[17px] font-bold text-[#14261C] leading-none">{c.members}</p>
                  <p className="text-[9.5px] font-medium text-[#66736B] mt-1">Members</p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-bold text-[#14261C] leading-none">{c.total.toLocaleString('en-US')}</p>
                  <p className="text-[9.5px] font-medium text-[#66736B] mt-1">Total Count</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* World Map */}
        <StylizedWorldMap activeRegions={activeRegions} />

        {/* Country Breakdown Table */}
        <div className="rounded-[20px] bg-[#FCFBF7] border border-[#E6E2D5] shadow-[0_3px_12px_rgba(20,38,28,0.04)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EDE9DC] text-[12px] font-semibold text-[#66736B]">
                <th className="py-3 pl-4 pr-2">Country</th>
                <th className="py-3 px-2 text-center">Members</th>
                <th className="py-3 pl-2 pr-4 text-right">Total Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE9DC] text-[13.5px]">
              {tableRows.map((row) => (
                <tr key={row.country} className="text-[#14261C]">
                  <td className="py-3 pl-4 pr-2 font-semibold">
                    <div className="flex items-center space-x-2">
                      {row.isOthers ? (
                        <span className="w-4 h-4 rounded-full bg-[#0D4A2E] text-white text-[10px] flex items-center justify-center">+</span>
                      ) : (
                        <CountryFlag country={row.country} size={17} />
                      )}
                      <span>{row.country}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center font-semibold text-[#4E5953]">{row.members}</td>
                  <td className="py-3 pl-2 pr-4 text-right font-bold">{row.total.toLocaleString('en-US')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}