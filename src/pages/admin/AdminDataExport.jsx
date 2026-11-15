/*Renders the Reports & Database Tools card (Export All to Excel 
(CSV) and Clear All Logs with safe inline confirmation) from 
the top of your index.html Admin Panel*/

import React, { useState } from 'react';
import { getLocalDateString } from '../aamaal/DateSelector';

export default function AdminDataExport({
  aamaalList = [],
  allMembers = [],
  allLogs = [],
  onWipeAllLogs,
}) {
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleExportAllCsv = () => {
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}

    if (allLogs.length === 0) {
      setStatusMsg('No recitation logs found to export yet.');
      setTimeout(() => setStatusMsg(''), 2500);
      return;
    }

    const memberMap = {};
    allMembers.forEach((m) => {
      memberMap[m.id] = m;
    });

    const aamaalMap = {};
    aamaalList.forEach((a) => {
      aamaalMap[a.id] = a.name;
    });

    const csvRows = [
      [
        'Date',
        'Aamaal Name',
        'Member Name',
        'Country',
        'Member Type',
        'Privacy Setting',
        'Recitation Count',
      ].join(','),
    ];

    const sortedLogs = [...allLogs].sort((a, b) =>
      (b.dateKey || '').localeCompare(a.dateKey || '')
    );

    sortedLogs.forEach((l) => {
      const m = memberMap[l.memberId];
      const clearName = (m?.name || 'Member').replace(/"/g, '""');
      const country = (m?.country || 'India').replace(/"/g, '""');
      const memType = m?.isPrimary ? 'Core Member' : 'Family Member';
      const priv = m?.privacy || 'public';
      const aamaalName = (aamaalMap[l.aamaalId] || l.aamaalId).replace(/"/g, '""');

      csvRows.push(
        `"${l.dateKey}","${aamaalName}","${clearName}","${country}","${memType}","${priv}",${l.count}`
      );
    });

    const blob = new Blob([csvRows.join('\r\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `islaah_aamaal_report_${getLocalDateString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatusMsg('✓ Full Circle Excel (CSV) downloaded!');
    setTimeout(() => setStatusMsg(''), 2600);
  };

  return (
    <div className="card-soft rounded-[20px] p-4 border border-[#C9CDAC] space-y-2.5">
      <div className="text-center">
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#135332]">
          📊 Reports &amp; Database Tools
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={handleExportAllCsv}
          className="btn-primary flex-1 py-2.5 text-[12px] font-semibold"
        >
          📥 Export All to Excel (CSV)
        </button>

        <button
          type="button"
          onClick={() => setConfirmWipe(!confirmWipe)}
          className="btn-danger py-2.5 px-3.5 text-[12px] font-semibold shrink-0"
        >
          🗑️ Clear All Logs
        </button>
      </div>

      {confirmWipe && (
        <div className="p-3 rounded-xl bg-[#E5DEC9] border border-[#c45d55]/40 text-center space-y-2 fade-in">
          <p className="text-[11.5px] text-[#6B2D26] font-medium">
            ⚠️ This will delete ALL {allLogs.length} recitation logs for everyone in the circle so you can start fresh. Are you sure?
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onWipeAllLogs) onWipeAllLogs();
                setConfirmWipe(false);
                setStatusMsg('Database wiped clean!');
                setTimeout(() => setStatusMsg(''), 2500);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[#6B2D26] text-white text-[11.5px] font-bold"
            >
              Yes, Wipe All Logs
            </button>
            <button
              type="button"
              onClick={() => setConfirmWipe(false)}
              className="px-3.5 py-1.5 rounded-lg bg-[#F5F2E8] text-primary text-[11.5px] font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {statusMsg && (
        <p className="text-center text-[11.5px] font-semibold text-[#135332]">
          {statusMsg}
        </p>
      )}
    </div>
  );
}