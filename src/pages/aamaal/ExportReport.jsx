import React, { useState } from 'react';
import { getMonthDetails } from './MissedDays';
import { formatMonthYearPretty } from './MonthlyReport';

export default function ExportReport({
  member = { name: 'Member', country: 'India', flag: '🇮🇳', phone: '' },
  aamaal = { name: 'Durood Shareef', target: 313 },
  monthStr,
  dayCountMap = {},
  reportElementRef,
}) {
  const [statusMsg, setStatusMsg] = useState('');
  const [isExportingImage, setIsExportingImage] = useState(false);

  const mInfo = getMonthDetails(monthStr);
  const prettyMonth = formatMonthYearPretty(monthStr);
  const dailyTarget = Number(aamaal?.target || 0);

  const totalActual = Object.values(dayCountMap).reduce(
    (sum, c) => sum + Number(c || 0),
    0
  );
  const daysLogged = Object.values(dayCountMap).filter((c) => Number(c) > 0).length;
  const daysMissed = Math.max(mInfo.elapsedDays - daysLogged, 0);

  const handleCopyWhatsAppText = async () => {
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}

    const lines = [
      `🕌 *Islaah Foundation's Aamaal Circle*`,
      `👤 *Member:* ${member.flag || '🇮🇳'} ${member.name}`,
      `📿 *Aamaal:* ${aamaal.name} (Target: ${dailyTarget}/day)`,
      `📅 *Month:* ${prettyMonth}`,
      `--------------------`,
      `✅ *Total Recited:* ${totalActual.toLocaleString('en-US')}`,
      `📊 *Consistency:* ${daysLogged}/${mInfo.elapsedDays} days logged`,
      `⚠️ *Missed Days:* ${daysMissed} days`,
      `--------------------`,
      `Live with Purpose • Aamaal Circle`,
    ];

    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setStatusMsg('✓ WhatsApp summary copied to clipboard!');
    } catch (_) {
      setStatusMsg('Summary ready to share.');
    }
    setTimeout(() => setStatusMsg(''), 2500);
  };

  const handleDownloadCsv = () => {
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}

    const csvRows = [
      ['Date', 'Member Name', 'Country', 'Aamaal Name', 'Daily Target', 'Actual Recited', 'Status'].join(','),
    ];

    for (let d = 1; d <= mInfo.totalDaysInMonth; d++) {
      const dayStr = String(d).padStart(2, '0');
      const dateKey = `${monthStr}-${dayStr}`;
      const actual = Number(dayCountMap[dateKey] || 0);
      const status =
        actual >= dailyTarget
          ? 'Target Met'
          : actual > 0
          ? 'Partial'
          : d <= mInfo.elapsedDays
          ? 'Missed'
          : 'Upcoming';

      csvRows.push(
        `"${dateKey}","${(member.name || 'Member').replace(/"/g, '""')}","${
          member.country || 'India'
        }","${(aamaal.name || 'Aamaal').replace(/"/g, '""')}",${dailyTarget},${actual},"${status}"`
      );
    }

    const blob = new Blob([csvRows.join('\r\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(member.name || 'Member').replace(/\s+/g, '_')}_${(
      aamaal.name || 'Aamaal'
    ).replace(/\s+/g, '_')}_${monthStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMsg('✓ Monthly CSV downloaded!');
    setTimeout(() => setStatusMsg(''), 2500);
  };

  const handleWhatsAppImageExport = async () => {
    if (!reportElementRef?.current || typeof window.html2canvas !== 'function') {
      handleCopyWhatsAppText();
      return;
    }

    setIsExportingImage(true);
    try {
      const canvas = await window.html2canvas(reportElementRef.current, {
        scale: 2.2,
        backgroundColor: '#F5F2E8',
        useCORS: true,
        logging: false,
      });

      const fileName = `${(member.name || 'Member').replace(/\s+/g, '_')}_${(
        aamaal.name || 'Aamaal'
      ).replace(/\s+/g, '_')}_${monthStr}.jpg`;

      const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.94);
      const downloadLink = document.createElement('a');
      downloadLink.href = jpgDataUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      const caption = `Assalamu Alaikum *${member.name}*,\nHere is your *${aamaal.name}* Monthly Progress Report for *${prettyMonth}* 🕌`;
      const cleanPhone = (member.phone || '').replace(/\D/g, '');
      const waUrl = cleanPhone
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(caption)}`
        : `https://wa.me/?text=${encodeURIComponent(caption)}`;

      window.open(waUrl, '_blank');
      setStatusMsg('✓ Report image saved & WhatsApp opened!');
    } catch (_) {
      handleCopyWhatsAppText();
    } finally {
      setIsExportingImage(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isExportingImage}
          onClick={handleWhatsAppImageExport}
          className="btn-primary flex-1 py-2.5 text-[12.5px] font-semibold shadow-sm"
        >
          <span>
            {isExportingImage ? 'Generating Report...' : '📲 Share Report (WhatsApp)'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleDownloadCsv}
          className="btn-secondary py-2.5 px-3.5 text-[12px] font-semibold shrink-0"
        >
          📥 Export CSV
        </button>
      </div>

      {statusMsg && (
        <p className="text-center text-[11.5px] font-semibold text-[#135332]">
          {statusMsg}
        </p>
      )}
    </div>
  );
}