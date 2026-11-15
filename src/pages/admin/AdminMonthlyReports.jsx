/*Renders Section 2 of Admin Panel: Member Monthly Count vs. 
Target (Select any Member, Aamaal, and Month, view their monthly 
calendar & missed days, and export/share via WhatsApp JPG or CSV) */

import React, { useState, useRef } from 'react';
import { getLocalDateString } from '../aamaal/DateSelector';
import MissedDays, { getMonthDetails } from '../aamaal/MissedDays';
import { formatMonthYearPretty } from '../aamaal/MonthlyReport';
import ExportReport from '../aamaal/ExportReport';
import { CountryFlag } from '../aamaal/WeeklySummary';

export default function AdminMonthlyReports({
  aamaalList = [],
  allMembers = [],
  allLogs = [],
  onSelectDateInInspector,
}) {
  const todayMonth = getLocalDateString().slice(0, 7);
  const [selectedMemberId, setSelectedMemberId] = useState(
    allMembers[0]?.id || 'primary_member'
  );
  const [selectedAamaalId, setSelectedAamaalId] = useState(
    aamaalList[0]?.id || 'durood_313'
  );
  const [selectedMonth, setSelectedMonth] = useState(todayMonth);
  const breakdownRef = useRef(null);

  const chosenMember =
    allMembers.find((m) => m.id === selectedMemberId) ||
    allMembers[0] || { id: 'primary_member', name: 'Member', country: 'India' };

  const chosenAamaal =
    aamaalList.find((a) => a.id === selectedAamaalId) ||
    aamaalList[0] || { id: 'durood_313', name: 'Durood Shareef', target: 313 };

  const mInfo = getMonthDetails(selectedMonth);
  const prettyMonth = formatMonthYearPretty(selectedMonth);

  const dayCountMap = {};
  allLogs.forEach((log) => {
    if (
      log.memberId === chosenMember.id &&
      log.aamaalId === chosenAamaal.id &&
      (log.dateKey || '').startsWith(selectedMonth)
    ) {
      dayCountMap[log.dateKey] = Number(log.count || 0);
    }
  });

  const sortedMembers = [...allMembers].sort((a, b) =>
    (a.name || '').localeCompare(b.name || '')
  );

  return (
    <div className="card rounded-[20px] p-4 space-y-3.5">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
          Monthly Inspector
        </span>
        <h3 className="font-serif text-[17px] font-semibold text-primary">
          📊 Member Monthly Count vs. Target
        </h3>
      </div>

      {/* Member Selector */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
          Select Member
        </label>
        <select
          value={chosenMember.id}
          onChange={(e) => setSelectedMemberId(e.target.value)}
          className="bg-[#F5F2E8] text-primary text-[12.5px] font-semibold py-2 px-2.5 rounded-xl"
        >
          {sortedMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.country || 'India'})
            </option>
          ))}
        </select>
      </div>

      {/* Aamaal + Month Selectors */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
            Select Aamaal
          </label>
          <select
            value={chosenAamaal.id}
            onChange={(e) => setSelectedAamaalId(e.target.value)}
            className="bg-[#F5F2E8] text-primary text-[12px] font-semibold py-1.5 px-2.5 rounded-xl"
          >
            {aamaalList.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
            Select Month
          </label>
          <input
            type="month"
            value={selectedMonth}
            max={todayMonth}
            onChange={(e) => {
              if (e.target.value) setSelectedMonth(e.target.value);
            }}
            className="bg-[#F5F2E8] text-primary text-[12px] font-semibold py-1.5 px-2.5 rounded-xl"
          />
        </div>
      </div>

      {/* Export / WhatsApp Share Toolbar */}
      <ExportReport
        member={chosenMember}
        aamaal={chosenAamaal}
        monthStr={selectedMonth}
        dayCountMap={dayCountMap}
        reportElementRef={breakdownRef}
      />

      {/* Capturable Breakdown Card */}
      <div ref={breakdownRef} className="space-y-2.5 pt-1">
        <div className="rounded-[14px] bg-[#0F4C2B] text-white px-3.5 py-2.5 flex items-center justify-between text-[12px] border border-[#C99E4C]/40">
          <div className="flex items-center space-x-2">
            <CountryFlag country={chosenMember.country || 'India'} size={16} />
            <span>
              <strong className="text-[#F0D58C]">{chosenMember.name}</strong> •{' '}
              {prettyMonth}
            </span>
          </div>
          <span className="text-[11px] text-white/85">
            {mInfo.isCurrentMonth
              ? `Day ${mInfo.elapsedDays} of ${mInfo.totalDaysInMonth}`
              : `${mInfo.totalDaysInMonth} Days`}
          </span>
        </div>

        <MissedDays
          monthStr={selectedMonth}
          aamaal={chosenAamaal}
          dayCountMap={dayCountMap}
          onSelectDateToLog={(clickedDate) => {
            if (onSelectDateInInspector) {
              onSelectDateInInspector(clickedDate, chosenAamaal.id);
            }
          }}
        />
      </div>
    </div>
  );
}