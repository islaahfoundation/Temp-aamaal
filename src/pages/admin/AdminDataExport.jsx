/*Renders the Reports & Database Tools card (Export All to Excel 
(CSV) and Clear All Logs with safe inline confirmation) from 
the top of your index.html Admin Panel*/

import React, { useState, useMemo } from 'react';
import {
  MONTH_NAMES,
  ScreenHeader,
  MonthSwitcher,
  downloadCsv,
} from './adminShared';

export default function AdminDataExport({
  aamaalList = [],
  allMembers = [],
  allLogs = [],
  circleSettings,
  initialMonth,
  onShowToast,
  onBack,
}) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (initialMonth) return initialMonth;
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const shiftMonth = (delta) => {
    setSelectedMonth((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const monthStr = `${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, '0')}`;
  const monthLabel = `${MONTH_NAMES[selectedMonth.month]} ${selectedMonth.year}`;

  const summary = useMemo(() => {
    const daysInMonth = new Date(selectedMonth.year, selectedMonth.month + 1, 0).getDate();
    const monthLogs = allLogs.filter(
      (l) => String(l.dateKey || '').startsWith(monthStr) && Number(l.count || 0) > 0
    );
    const totalRecitations = monthLogs.reduce((s, l) => s + Number(l.count || 0), 0);

    const memberDays = new Map();
    monthLogs.forEach((l) => {
      if (!memberDays.has(l.memberId)) memberDays.set(l.memberId, new Set());
      memberDays.get(l.memberId).add(l.dateKey);
    });

    const activeMembers = memberDays.size;
    let avgDays = 0;
    if (activeMembers > 0) {
      let sum = 0;
      memberDays.forEach((s) => { sum += s.size; });
      avgDays = Math.round(sum / activeMembers);
    }

    const circleName = circleSettings?.circleName || "Islaah Foundation's Aamaal Circle";
    const text = [
      circleName,
      'Monthly Progress Report',
      monthLabel,
      `Total Recitations: ${totalRecitations.toLocaleString('en-US')}`,
      `Active Members: ${activeMembers} / ${allMembers.length}`,
      `Average Consistency: ${avgDays} / ${daysInMonth} Days`,
    ].join('\n');

    return { monthLogs, totalRecitations, activeMembers, avgDays, daysInMonth, circleName, text };
  }, [allLogs, allMembers.length, monthStr, monthLabel, selectedMonth, circleSettings]);

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(summary.text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadCsv = () => {
    const memberMap = Object.fromEntries(allMembers.map((m) => [m.id, m]));
    const aamaalMap = Object.fromEntries(aamaalList.map((a) => [a.id, a.name]));
    const rows = [
      ['Date', 'Aamaal Name', 'Member Name', 'Country', 'Member Type', 'Privacy', 'Recitation Count'],
      ...summary.monthLogs
        .sort((a, b) => (b.dateKey || '').localeCompare(a.dateKey || ''))
        .map((l) => {
          const m = memberMap[l.memberId];
          return [
            l.dateKey,
            aamaalMap[l.aamaalId] || l.aamaalId,
            m?.name || 'Member',
            m?.country || 'India',
            m?.isPrimary ? 'Core Member' : 'Family Member',
            m?.privacy || 'public',
            l.count,
          ];
        }),
    ];
    downloadCsv(rows, `aamaal_report_${monthStr}.csv`);
    onShowToast?.('CSV downloaded');
  };

  const handleDownloadPdf = () => {
    const win = window.open('', '_blank');
    if (!win) {
      onShowToast?.('Allow popups to print PDF report');
      return;
    }
    win.document.write(`
      <html><head><title>${summary.circleName} - ${monthLabel}</title>
      <style>body{font-family:Georgia,serif;padding:32px;color:#14261C;background:#FAF8F2;}
      h1{color:#0D4A2E;margin-bottom:4px;} .card{background:#fff;border:1px solid #DCD8C6;border-radius:16px;padding:20px;margin-top:20px;}
      pre{font-family:Inter,sans-serif;font-size:15px;line-height:1.8;white-space:pre-wrap;}</style></head>
      <body><h1>${summary.circleName}</h1><p>Monthly Progress Report — ${monthLabel}</p>
      <div class="card"><pre>${summary.text}</pre></div></body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary.text);
      onShowToast?.('Summary copied to clipboard');
    } catch (_) {
      onShowToast?.('Unable to copy summary');
    }
  };

  const actions = [
    {
      title: 'WhatsApp',
      subtitle: 'Share formatted report',
      onClick: handleWhatsAppShare,
      icon: (
        <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-1.7-.1-.4-.1-1-.3-1.7-.6-3-1.3-5-4.3-5.1-4.5-.2-.2-1.2-1.6-1.2-3.1 0-1.5.8-2.2 1-2.5.3-.3.6-.4.8-.4h.6c.2 0 .5-.1.7.5.2.6.9 2.1.9 2.2.1.2.1.4 0 .6-.1.2-.2.4-.4.6l-.4.5c-.2.2-.3.4-.1.7.2.4.9 1.5 2 2.4 1.4 1.2 2.5 1.6 2.9 1.8.4.2.6.1.8-.1.2-.2.9-1.1 1.2-1.4.2-.4.5-.3.8-.2.4.1 2.2 1 2.6 1.2.4.2.6.3.7.5.1.2.1.9-.1 1.5z" />
          </svg>
        </div>
      ),
    },
    {
      title: 'Download CSV',
      subtitle: 'Export raw data',
      onClick: handleDownloadCsv,
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#EEF0F7] text-[#3B4B8C] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M12 18v-6" />
            <path d="M9 15l3 3 3-3" />
          </svg>
        </div>
      ),
    },
    {
      title: 'Download PDF',
      subtitle: 'Formatted report',
      onClick: handleDownloadPdf,
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#FCECEB] text-[#C9413B] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>
      ),
    },
    {
      title: 'Copy Summary',
      subtitle: 'Copy text to clipboard',
      onClick: handleCopySummary,
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#EBF3FB] text-[#2B6CB0] flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <section className="screen-section no-scrollbar bg-[#F7F5EE] min-h-[100dvh] flex flex-col pb-24 select-none">
      <ScreenHeader title="Export / Share Report" onBack={onBack} />

      <div className="px-4 space-y-4 flex-1">
        <MonthSwitcher year={selectedMonth.year} month={selectedMonth.month} onShift={shiftMonth} />

        {/* Export Action Rows */}
        <div className="rounded-[20px] bg-[#FCFBF7] border border-[#E6E2D5] shadow-[0_3px_12px_rgba(20,38,28,0.04)] divide-y divide-[#EDE9DC] overflow-hidden">
          {actions.map((act) => (
            <button
              key={act.title}
              type="button"
              onClick={act.onClick}
              className="w-full px-4 py-3.5 flex items-center justify-between active:bg-[#F3F0E5] transition text-left"
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                {act.icon}
                <div className="min-w-0">
                  <p className="text-[14.5px] font-bold text-[#14261C] leading-tight">{act.title}</p>
                  <p className="text-[12px] text-[#55615A] mt-0.5">{act.subtitle}</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-[#7A827D] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>

        {/* Report Preview Card */}
        <div className="rounded-[20px] bg-[#FCFBF7] border border-[#E6E2D5] shadow-[0_3px_12px_rgba(20,38,28,0.04)] p-4 space-y-2.5">
          <h3 className="text-[14px] font-bold text-[#14261C]">Report Preview</h3>
          <div className="flex items-center justify-between gap-2">
            <div className="text-[12.5px] text-[#3C4B42] leading-[1.65] space-y-0.5">
              <p className="font-bold text-[#14261C]">{summary.circleName}</p>
              <p>Monthly Progress Report</p>
              <p>{monthLabel}</p>
              <p>Total Recitations: <strong className="text-[#14261C]">{summary.totalRecitations.toLocaleString('en-US')}</strong></p>
              <p>Active Members: <strong className="text-[#14261C]">{summary.activeMembers} / {allMembers.length}</strong></p>
              <p>Average Consistency: <strong className="text-[#14261C]">{summary.avgDays} / {summary.daysInMonth} Days</strong></p>
            </div>
            <button type="button" onClick={handleCopySummary} aria-label="Copy Preview" className="text-[#7A827D] p-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}