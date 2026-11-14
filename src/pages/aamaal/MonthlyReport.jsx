import React, { useState, useRef } from 'react';
import { DEFAULT_AAMAAL_LIST } from './AamaalCategories';
import { getLocalDateString } from './DateSelector';
import MissedDays, { getMonthDetails } from './MissedDays';
import ExportReport from './ExportReport';

export function formatMonthYearPretty(monthStr) {
  if (!monthStr) return '';
  const [y, m] = monthStr.split('-').map(Number);
  const dt = new Date(y, m - 1, 15, 12, 0, 0);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(dt);
}

export default function MonthlyReport({
  aamaalList = DEFAULT_AAMAAL_LIST,
  initialAamaalId,
  activeProfile = { id: 'local_user', name: 'Member', flag: '🇮🇳', country: 'India' },
  allLogs = [],
  onSelectDateAndJump,
  onBack,
}) {
  const todayMonth = getLocalDateString().slice(0, 7);
  const [selectedAamaalId, setSelectedAamaalId] = useState(
    initialAamaalId || aamaalList[0]?.id || 'durood_313'
  );
  const [selectedMonth, setSelectedMonth] = useState(todayMonth);
  const reportCardRef = useRef(null);

  const chosenAamaal =
    aamaalList.find((a) => a.id === selectedAamaalId) || aamaalList[0];

  const mInfo = getMonthDetails(selectedMonth);
  const prettyMonth = formatMonthYearPretty(selectedMonth);

  // Build dayCountMap for the selected member, aamaal, and month
  const dayCountMap = {};
  allLogs.forEach((log) => {
    if (
      log.memberId === activeProfile.id &&
      log.aamaalId === chosenAamaal?.id &&
      (log.dateKey || '').startsWith(selectedMonth)
    ) {
      dayCountMap[log.dateKey] = Number(log.count || 0);
    }
  });

  return (
    <section className="screen-section no-scrollbar px-4 pt-4 pb-6">
      {/* Top Header */}
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
            Personal Analytics
          </span>
          <h2 className="font-serif text-[20px] font-semibold text-primary leading-tight">
            My Monthly Report &amp; Missed Days
          </h2>
        </div>
      </div>

      {/* Filter Selectors (Aamaal + Month) */}
      <div className="card-soft p-3.5 mb-3.5">
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1">
              Select Aamaal
            </label>
            <select
              value={selectedAamaalId}
              onChange={(e) => setSelectedAamaalId(e.target.value)}
              className="bg-[#F5F2E8] text-primary text-[12.5px] font-semibold py-2 px-2.5 rounded-xl border border-[#D5D2BE]"
            >
              {aamaalList.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1">
              Select Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              max={todayMonth}
              onChange={(e) => {
                if (e.target.value) setSelectedMonth(e.target.value);
              }}
              className="bg-[#F5F2E8] text-primary text-[12.5px] font-semibold py-1.5 px-2.5 rounded-xl border border-[#D5D2BE]"
            />
          </div>
        </div>
      </div>

      {/* Capturable Monthly Breakdown Card */}
      <div ref={reportCardRef} className="space-y-3">
        {/* Member & Month Banner */}
        <div className="rounded-[14px] bg-[#0F4C2B] text-white px-3.5 py-2.5 flex items-center justify-between text-[12px] shadow-sm border border-[#C99E4C]/40">
          <span>
            {activeProfile.flag || '🇮🇳'}{' '}
            <strong className="text-[#F0D58C]">{activeProfile.name}</strong> •{' '}
            {prettyMonth}
          </span>
          <span className="text-[11px] text-white/85 font-medium">
            {mInfo.isCurrentMonth
              ? `Day ${mInfo.elapsedDays} of ${mInfo.totalDaysInMonth}`
              : `${mInfo.totalDaysInMonth} Days`}
          </span>
        </div>

        {/* Missed Days & Calendar Breakdown */}
        <MissedDays
          monthStr={selectedMonth}
          aamaal={chosenAamaal}
          dayCountMap={dayCountMap}
          onSelectDateToLog={(dateKey) => {
            if (onSelectDateAndJump) {
              onSelectDateAndJump(dateKey, chosenAamaal);
            }
          }}
        />
      </div>

      {/* Export / Share Buttons (WhatsApp & CSV) */}
      <div className="mt-4">
        <ExportReport
          member={activeProfile}
          aamaal={chosenAamaal}
          monthStr={selectedMonth}
          dayCountMap={dayCountMap}
          reportElementRef={reportCardRef}
        />
      </div>
    </section>
  );
}