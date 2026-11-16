import React from 'react';
import { formatCompactNumber } from './CalendarHistory';

export const COUNTRY_CODES = {
  India: 'in',
  'United States': 'us',
  'United Kingdom': 'gb',
  'United Arab Emirates': 'ae',
  'Saudi Arabia': 'sa',
  Oman: 'om',
  Qatar: 'qa',
  Kuwait: 'kw',
  Canada: 'ca',
  Australia: 'au',
};

export const COUNTRY_FLAGS = {
  India: '🇮🇳',
  'United States': '🇺🇸',
  'United Kingdom': '🇬🇧',
  'United Arab Emirates': '🇦🇪',
  'Saudi Arabia': '🇸🇦',
  Oman: '🇴🇲',
  Qatar: '🇶🇦',
  Kuwait: '🇰🇼',
  Canada: '🇨🇦',
  Australia: '🇦🇺',
};

// Universal Country Flag Component (Exported for Home, Account, Admin & Aamaal)
export function CountryFlag({ country = 'India', size = 18, className = '' }) {
  const code = COUNTRY_CODES[country] || 'in';
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width={size}
      height={Math.round(size * 0.75)}
      alt={country}
      className={`inline-block rounded-[3px] object-cover shadow-sm shrink-0 ${className}`}
      style={{ width: `${size}px`, height: `${Math.round(size * 0.75)}px` }}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}

function TopCountriesBlock({ rows = [] }) {
  if (!rows.length) {
    return (
      <p className="text-[12px] text-muted py-1">
        No recitations logged for this period yet.
      </p>
    );
  }

  const maxVal = Math.max(...rows.map((r) => r.total), 1);

  return (
    <div className="space-y-2.5 mt-2">
      {rows.map((r) => {
        const pct = Math.max(Math.round((r.total / maxVal) * 100), 5);
        return (
          <div
            key={r.country}
            className="grid grid-cols-[120px_1fr_65px] items-center gap-2"
          >
            <div className="text-[12px] font-semibold text-primary flex items-center space-x-2 truncate">
              <CountryFlag country={r.country} size={18} />
              <span className="truncate">{r.country}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#DEDCCF] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#135332]"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="text-right text-[12px] font-bold text-primary">
              {formatCompactNumber(r.total)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function WeeklySummary({
  aamaalName = 'Durood Shareef',
  leaderboardRows = [],
  weekGroupTotal = 0,
  myWeekTotal = 0,
  weeklyCountryRows = [],
  monthGroupTotal = 0,
  myMonthTotal = 0,
  monthlyCountryRows = [],
  last7DaysBars = [],
}) {
  const maxLeaderScore =
    leaderboardRows.length > 0
      ? Math.max(...leaderboardRows.map((r) => r.score), 1)
      : 1;

  const maxBarTotal =
    last7DaysBars.length > 0
      ? Math.max(...last7DaysBars.map((d) => d.total), 1)
      : 1;

  return (
    <div className="space-y-4">
      {/* 1. Top 5 Leaderboard */}
      <div>
        <h4 className="font-serif text-[15px] font-semibold text-primary mb-2 px-0.5">
          🏆 Top {aamaalName} Reciters (This Week)
        </h4>
        <div className="card rounded-[20px] p-3.5 bg-[#F3EFE2] divide-y divide-[#E2DEC9]">
          {leaderboardRows.length === 0 ? (
            <p className="text-center text-[12px] text-muted py-3">
              No public/private recitations logged this week yet.
            </p>
          ) : (
            leaderboardRows.slice(0, 5).map((item, idx) => {
              const pct = Math.max(
                Math.round((item.score / maxLeaderScore) * 100),
                8
              );
              const badgeColor =
                idx === 0
                  ? 'bg-[#F0D58C] text-[#07361D]'
                  : idx === 1
                  ? 'bg-[#DFDEC9] text-primary'
                  : idx === 2
                  ? 'bg-[#E5DEC9] text-[#6B2D26]'
                  : 'bg-[#EAE8D7] text-secondary';

              return (
                <div key={`${item.name}-${idx}`} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${badgeColor}`}
                      >
                        {idx + 1}
                      </span>
                      <CountryFlag country={item.country || 'India'} size={18} />
                      <span className="text-[13px] font-semibold text-primary truncate">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-serif text-[14px] font-bold text-[#135332] shrink-0">
                      {Number(item.score).toLocaleString('en-US')}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#DEDCCF] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#0D4A2E] to-[#358C44]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Weekly Performance + Top by Country */}
      <div>
        <h4 className="font-serif text-[15px] font-semibold text-primary mb-2 px-0.5">
          Weekly Performance
        </h4>
        <div className="card rounded-[20px] p-4 bg-[#F3EFE2]">
          <div className="flex items-center space-x-4 mb-2">
            <span className="font-serif text-[18px] font-bold text-primary min-w-[85px]">
              {formatCompactNumber(weekGroupTotal)}
            </span>
            <span className="text-[12.5px] text-secondary">
              Total Recited This Week
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-serif text-[18px] font-bold text-[#135332] min-w-[85px]">
              {Number(myWeekTotal).toLocaleString('en-US')}
            </span>
            <span className="text-[12.5px] text-secondary">
              Your contribution this week
            </span>
          </div>

          <div className="h-[1px] bg-[#E2DEC9] my-3" />
          <p className="text-[11.5px] font-bold uppercase tracking-wider text-muted">
            Top by Country
          </p>
          <TopCountriesBlock rows={weeklyCountryRows} />
        </div>
      </div>

      {/* 3. Monthly Performance + Top by Country */}
      <div>
        <h4 className="font-serif text-[15px] font-semibold text-primary mb-2 px-0.5">
          Monthly Performance
        </h4>
        <div className="card rounded-[20px] p-4 bg-[#F3EFE2]">
          <div className="flex items-center space-x-4 mb-2">
            <span className="font-serif text-[18px] font-bold text-primary min-w-[85px]">
              {formatCompactNumber(monthGroupTotal)}
            </span>
            <span className="text-[12.5px] text-secondary">
              Total Recited This Month
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-serif text-[18px] font-bold text-[#135332] min-w-[85px]">
              {Number(myMonthTotal).toLocaleString('en-US')}
            </span>
            <span className="text-[12.5px] text-secondary">
              Your contribution this month
            </span>
          </div>

          <div className="h-[1px] bg-[#E2DEC9] my-3" />
          <p className="text-[11.5px] font-bold uppercase tracking-wider text-muted">
            Top by Country
          </p>
          <TopCountriesBlock rows={monthlyCountryRows} />
        </div>
      </div>

      {/* 4. Last 7 Days Trend Bar Chart */}
      <div>
        <h4 className="font-serif text-[15px] font-semibold text-primary mb-2 px-0.5">
          📊 Last 7 Days Trend
        </h4>
        <div className="card rounded-[20px] p-4 bg-[#F3EFE2]">
          <div className="grid grid-cols-7 gap-1.5 h-28 items-end pt-4">
            {last7DaysBars.map((d) => {
              const heightPct = Math.max(
                Math.round((d.total / maxBarTotal) * 85),
                6
              );
              return (
                <div
                  key={d.dateKey}
                  className="flex flex-col items-center justify-end h-full"
                >
                  <span className="text-[9px] font-bold text-secondary mb-1">
                    {d.total > 0 ? formatCompactNumber(d.total) : ''}
                  </span>
                  <div
                    className="w-full max-w-[22px] rounded-t-md bg-gradient-to-b from-[#165534] to-[#0D4A2E]"
                    style={{ height: `${heightPct}%`, minHeight: '6px' }}
                  />
                  <span className="text-[10px] font-semibold text-secondary mt-1.5">
                    {d.isToday ? 'Today' : d.shortDay}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}