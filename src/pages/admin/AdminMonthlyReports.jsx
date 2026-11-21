/*Renders Section 2 of Admin Panel: Member Monthly Count vs. 
Target (Select any Member, Aamaal, and Month, view their monthly 
calendar & missed days, and export/share via WhatsApp JPG or CSV) */

import React, { useState, useMemo, useRef } from 'react';
import { getLocalDateString } from '../aamaal/DateSelector';
import MissedDays, { getMonthDetails } from '../aamaal/MissedDays';
import { formatMonthYearPretty } from '../aamaal/MonthlyReport';
import ExportReport from '../aamaal/ExportReport';
import { CountryFlag } from '../aamaal/WeeklySummary';
import {
  MONTH_NAMES,
  ScreenHeader,
  MonthSwitcher,
  AamaalIcon,
  resolveAamaalStatus,
  downloadCsv,
} from './adminShared';

export default function AdminMonthlyReports({
  aamaalList = [],
  allMembers = [],
  allLogs = [],
  initialMonth,
  onSelectDateInInspector,
  onOpenExportShare,
  onBack,
  onShowToast,
}) {
  const todayStr = getLocalDateString();
  const [selectedMonthObj, setSelectedMonthObj] = useState(() => {
    if (initialMonth) return initialMonth;
    const [y, m] = todayStr.split('-').map(Number);
    return { year: y, month: (m || 1) - 1 };
  });

  const [showMemberInspector, setShowMemberInspector] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(
    allMembers[0]?.id || 'primary_member'
  );
  const [selectedAamaalId, setSelectedAamaalId] = useState(
    aamaalList[0]?.id || 'durood_313'
  );
  const breakdownRef = useRef(null);
  const inspectorSectionRef = useRef(null);

  const selectedMonthStr = `${selectedMonthObj.year}-${String(
    selectedMonthObj.month + 1
  ).padStart(2, '0')}`;

  const shiftMonth = (delta) => {
    setSelectedMonthObj((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const reportData = useMemo(() => {
    const daysInMonth = new Date(
      selectedMonthObj.year,
      selectedMonthObj.month + 1,
      0
    ).getDate();
    const monthLogs = allLogs.filter(
      (l) =>
        String(l.dateKey || '').startsWith(selectedMonthStr) &&
        Number(l.count || 0) > 0
    );
    const totalCount = monthLogs.reduce(
      (sum, l) => sum + Number(l.count || 0),
      0
    );

    const memberDaysMap = new Map();
    const dailyTotals = Array.from({ length: daysInMonth }, (_, idx) => ({
      day: idx + 1,
      dateKey: `${selectedMonthStr}-${String(idx + 1).padStart(2, '0')}`,
      total: 0,
    }));
    const aamaalTotalsMap = new Map();

    monthLogs.forEach((log) => {
      const count = Number(log.count || 0);
      const dayNum = Number(String(log.dateKey || '').slice(8, 10));
      if (dayNum >= 1 && dayNum <= daysInMonth) {
        dailyTotals[dayNum - 1].total += count;
      }
      if (!memberDaysMap.has(log.memberId)) {
        memberDaysMap.set(log.memberId, new Set());
      }
      memberDaysMap.get(log.memberId).add(log.dateKey);
      aamaalTotalsMap.set(
        log.aamaalId,
        (aamaalTotalsMap.get(log.aamaalId) || 0) + count
      );
    });

    const activeMembers = memberDaysMap.size;
    let avgActiveDays = 0;
    if (activeMembers > 0) {
      let sumDays = 0;
      memberDaysMap.forEach((set) => {
        sumDays += set.size;
      });
      avgActiveDays = Math.round(sumDays / activeMembers);
    }

    const maxDaily = Math.max(...dailyTotals.map((d) => d.total), 10);
    const yAxisMax = Math.ceil(maxDaily / 200) * 200 || 200;

    const visibleAamaals = aamaalList.filter(
      (a) => resolveAamaalStatus(a) !== 'deleted'
    );
    const breakdown = visibleAamaals.map((item) => {
      const count = aamaalTotalsMap.get(item.id) || 0;
      const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
      return { ...item, count, pct };
    });

    return {
      daysInMonth,
      totalCount,
      avgActiveDays,
      activeMembers,
      dailyTotals,
      yAxisMax,
      breakdown,
    };
  }, [allLogs, aamaalList, selectedMonthObj, selectedMonthStr]);

  const handleExportCsv = () => {
    downloadCsv(
      [
        ['Month', `${MONTH_NAMES[selectedMonthObj.month]} ${selectedMonthObj.year}`],
        ['Total Count', reportData.totalCount],
        ['Avg. Active Days', reportData.avgActiveDays],
        ['Active Members', reportData.activeMembers],
        [],
        ['Aamaal', 'Total Count', 'Share (%)'],
        ...reportData.breakdown.map((b) => [b.name, b.count, `${b.pct}%`]),
        [],
        ['Date', 'Total Recitations'],
        ...reportData.dailyTotals.map((d) => [d.dateKey, d.total]),
      ],
      `aamaal-monthly-report-${selectedMonthStr}.csv`
    );
    onShowToast?.('Monthly report CSV downloaded');
  };

  const handleToggleInspector = () => {
    setShowMemberInspector((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          inspectorSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 60);
      }
      return next;
    });
  };

  const chosenMember =
    allMembers.find((m) => m.id === selectedMemberId) ||
    allMembers[0] || { id: 'primary_member', name: 'Member', country: 'India' };
  const chosenAamaal =
    aamaalList.find((a) => a.id === selectedAamaalId) ||
    aamaalList[0] || { id: 'durood_313', name: 'Durood Shareef', target: 313 };
  const mInfo = getMonthDetails(selectedMonthStr);
  const prettyMonth = formatMonthYearPretty(selectedMonthStr);

  const dayCountMap = {};
  allLogs.forEach((log) => {
    if (
      log.memberId === chosenMember.id &&
      log.aamaalId === chosenAamaal.id &&
      (log.dateKey || '').startsWith(selectedMonthStr)
    ) {
      dayCountMap[log.dateKey] = Number(log.count || 0);
    }
  });

  const yTicks = [1, 0.8, 0.6, 0.4, 0.2, 0].map((ratio) =>
    Math.round(reportData.yAxisMax * ratio)
  );
  const xLabelDays = [1, 5, 10, 15, 20, 25, reportData.daysInMonth];

  return (
    <div className="h-full min-h-0 bg-[#F7F5EE] flex flex-col overflow-hidden select-none">
      <ScreenHeader title="Monthly Report" onBack={onBack} />

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 pt-1 pb-28 space-y-4">
        <MonthSwitcher
          year={selectedMonthObj.year}
          month={selectedMonthObj.month}
          onShift={shiftMonth}
          compact
        />

        {/* 3 Summary KPI Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            {
              value: reportData.totalCount.toLocaleString(),
              label: 'Total Count',
              icon: (
                <svg className="w-6 h-6 text-[#0D4A2E]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3H11v16H4.5A2.5 2.5 0 0 1 2 16.5v-11zm11-2.5h6.5A2.5 2.5 0 0 1 22 5.5v11a2.5 2.5 0 0 1-2.5 2.5H13V3z" />
                </svg>
              ),
            },
            {
              value: reportData.avgActiveDays,
              label: 'Avg. Active Days',
              icon: (
                <svg className="w-6 h-6 text-[#0D4A2E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              ),
            },
            {
              value: reportData.activeMembers,
              label: 'Active Members',
              icon: (
                <svg className="w-6 h-6 text-[#0D4A2E]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              ),
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-[18px] bg-[#FCFBF7] border border-[#E6E2D5] shadow-[0_3px_12px_rgba(20,38,28,0.04)] py-3.5 px-2 text-center flex flex-col items-center"
            >
              <div className="mb-1.5">{kpi.icon}</div>
              <p className="text-[22px] font-bold text-[#14261C] leading-none">
                {kpi.value}
              </p>
              <p className="text-[11px] font-medium text-[#55615A] mt-1">
                {kpi.label}
              </p>
            </div>
          ))}
        </div>

        {/* 31-Day Bar Chart */}
        <div className="flex items-end space-x-2 pt-1">
          <div className="h-[148px] flex flex-col justify-between text-right text-[10px] font-medium text-[#6B7670] pr-1 shrink-0">
            {yTicks.map((tick, i) => (
              <span key={i} className="leading-none">
                {tick.toLocaleString()}
              </span>
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <div className="h-[148px] border-l border-b border-[#E6E2D3] px-1 pt-2 flex items-end justify-between gap-[2px]">
              {reportData.dailyTotals.map((d) => {
                const pctHeight = Math.min(
                  100,
                  Math.round((d.total / reportData.yAxisMax) * 100)
                );
                return (
                  <button
                    key={d.dateKey}
                    type="button"
                    title={`${d.dateKey}: ${d.total.toLocaleString()}`}
                    onClick={() =>
                      onSelectDateInInspector?.(d.dateKey, chosenAamaal.id)
                    }
                    className="flex-1 h-full flex items-end group"
                  >
                    <div
                      style={{
                        height: `${Math.max(pctHeight, d.total > 0 ? 5 : 2)}%`,
                      }}
                      className={`w-full rounded-t-[3px] transition-all ${
                        d.total > 0
                          ? 'bg-gradient-to-t from-[#0D4A2E] via-[#1B8A52] to-[#34B570]'
                          : 'bg-[#E6E3D5]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[10.5px] font-medium text-[#55615A] mt-1.5 px-0.5">
              {xLabelDays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Aamaal Breakdown */}
        <div className="pt-1 space-y-3">
          <h3 className="font-serif text-[18px] font-bold text-[#14261C]">
            Aamaal Breakdown
          </h3>
          <div className="space-y-3">
            {reportData.breakdown.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <AamaalIcon aamaal={item} className="w-6 h-6 shrink-0" />
                <span className="text-[13.5px] font-semibold text-[#14261C] w-[112px] truncate shrink-0">
                  {item.name}
                </span>
                <div className="flex-1 h-[7px] rounded-full bg-[#EAE7DA] overflow-hidden">
                  <div
                    style={{
                      width: `${Math.max(item.pct, item.count > 0 ? 6 : 0)}%`,
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-[#0D4A2E] to-[#1F8F55]"
                  />
                </div>
                <div className="flex items-center space-x-2 shrink-0 text-right">
                  <span className="text-[13.5px] font-bold text-[#14261C] min-w-[42px]">
                    {item.count.toLocaleString()}
                  </span>
                  <span className="text-[12px] font-medium text-[#6B7670] min-w-[30px]">
                    {item.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom 2-Button Row: Share Report (Opens Screen 9) & Export CSV */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => onOpenExportShare?.(selectedMonthObj)}
            className="h-[44px] rounded-full bg-[#FCFBF7] border-[1.5px] border-[#0D4A2E] text-[#14261C] text-[13.5px] font-semibold flex items-center justify-center space-x-2 active:scale-[0.98] transition"
          >
            <svg className="w-4 h-4 text-[#0D4A2E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>Share Report</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="h-[44px] rounded-full bg-[#FCFBF7] border-[1.5px] border-[#0D4A2E] text-[#14261C] text-[13.5px] font-semibold flex items-center justify-center space-x-2 active:scale-[0.98] transition"
          >
            <svg className="w-4 h-4 text-[#0D4A2E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>

        {/* Collapsible Individual Member Inspector */}
        <div
          ref={inspectorSectionRef}
          className="pt-2 border-t border-[#E6E2D3]"
        >
          <button
            type="button"
            onClick={handleToggleInspector}
            className="w-full py-2 flex items-center justify-between text-[13px] font-semibold text-[#0D4A2E]"
          >
            <span>Inspect Individual Member vs. Target</span>
            <span>{showMemberInspector ? '▲' : '▼'}</span>
          </button>

          {showMemberInspector && (
            <div className="mt-2 rounded-[20px] bg-[#FCFBF7] border border-[#E6E2D5] p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <select
                  value={chosenMember.id}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full bg-[#F7F5EE] text-[#14261C] text-[12px] font-semibold py-2 px-2.5 rounded-xl border border-[#E6E2D5]"
                >
                  {[...allMembers]
                    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                </select>
                <select
                  value={chosenAamaal.id}
                  onChange={(e) => setSelectedAamaalId(e.target.value)}
                  className="w-full bg-[#F7F5EE] text-[#14261C] text-[12px] font-semibold py-2 px-2.5 rounded-xl border border-[#E6E2D5]"
                >
                  {aamaalList.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <ExportReport
                member={chosenMember}
                aamaal={chosenAamaal}
                monthStr={selectedMonthStr}
                dayCountMap={dayCountMap}
                reportElementRef={breakdownRef}
              />

              <div ref={breakdownRef} className="space-y-2.5 pt-1">
                <div className="rounded-[14px] bg-[#0D4A2E] text-white px-3.5 py-2.5 flex items-center justify-between text-[12px]">
                  <div className="flex items-center space-x-2">
                    <CountryFlag
                      country={chosenMember.country || 'India'}
                      size={16}
                    />
                    <span>
                      <strong className="text-[#F0D58C]">
                        {chosenMember.name}
                      </strong>{' '}
                      • {prettyMonth}
                    </span>
                  </div>
                  <span className="text-[11px] text-white/85">
                    {mInfo.isCurrentMonth
                      ? `Day ${mInfo.elapsedDays}/${mInfo.totalDaysInMonth}`
                      : `${mInfo.totalDaysInMonth} Days`}
                  </span>
                </div>
                <MissedDays
                  monthStr={selectedMonthStr}
                  aamaal={chosenAamaal}
                  dayCountMap={dayCountMap}
                  onSelectDateToLog={(clickedDate) =>
                    onSelectDateInInspector?.(clickedDate, chosenAamaal.id)
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}