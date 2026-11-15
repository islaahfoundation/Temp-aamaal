/* Renders Section 1 of Admin Panel: Person-Wise Daily Count 
Inspector & Edit + "Copy Selected Date Report for WhatsApp"*/

import React, { useState } from 'react';
import { getLocalDateString, formatAnyDatePretty } from '../aamaal/DateSelector';
import { CountryFlag } from '../aamaal/WeeklySummary';

export default function AdminActivityLog({
  aamaalList = [],
  allMembers = [],
  allLogs = [],
  selectedDate: externalDate,
  selectedAamaalId: externalAamaalId,
  onChangeDate,
  onChangeAamaalId,
  onUpsertMemberLog,
}) {
  const todayLocal = getLocalDateString();
  const [internalDate, setInternalDate] = useState(todayLocal);
  const [internalAamaalId, setInternalAamaalId] = useState(
    aamaalList[0]?.id || 'durood_313'
  );
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [countInput, setCountInput] = useState('');
  const [copiedMsg, setCopiedMsg] = useState('');

  const filterDate = externalDate || internalDate;
  const filterAamaalId = externalAamaalId || internalAamaalId;

  const handleDateChange = (val) => {
    setInternalDate(val);
    if (onChangeDate) onChangeDate(val);
  };

  const handleAamaalChange = (val) => {
    setInternalAamaalId(val);
    if (onChangeAamaalId) onChangeAamaalId(val);
  };

  const targetAamaal =
    aamaalList.find((a) => a.id === filterAamaalId) || aamaalList[0];

  const logsForSelectedDate = allLogs.filter(
    (l) => l.aamaalId === targetAamaal?.id && l.dateKey === filterDate
  );

  const logByMember = {};
  logsForSelectedDate.forEach((l) => {
    logByMember[l.memberId] = l;
  });

  const totalDateCount = logsForSelectedDate.reduce(
    (sum, l) => sum + Number(l.count || 0),
    0
  );

  const sortedMembers = [...allMembers].sort((a, b) => {
    const cA = logByMember[a.id] ? Number(logByMember[a.id].count) : 0;
    const cB = logByMember[b.id] ? Number(logByMember[b.id].count) : 0;
    if (cB !== cA) return cB - cA;
    return (a.name || '').localeCompare(b.name || '');
  });

  const handleCopyWhatsAppReport = async () => {
    if (!targetAamaal) return;
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}

    const lines = [
      `🕌 *Islaah Foundation's Aamaal Circle*`,
      `📿 *Aamaal:* ${targetAamaal.name}`,
      `📅 *Date:* ${formatAnyDatePretty(filterDate)}`,
      `--------------------`,
    ];

    sortedMembers.forEach((m) => {
      const c = logByMember[m.id] ? Number(logByMember[m.id].count) : 0;
      lines.push(
        `${c > 0 ? '✅' : '⏳'} ${m.flag || '🇮🇳'} ${m.name}: *${c.toLocaleString('en-US')}*`
      );
    });

    lines.push(`--------------------`);
    lines.push(`✨ *Total Recited:* ${totalDateCount.toLocaleString('en-US')}`);
    lines.push(``);
    lines.push(
      `Please recite your daily ${targetAamaal.name} and update the count in below link`
    );
    lines.push(`https://islaahfoundation.github.io/aamaal-circle/`);

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopiedMsg('✓ WhatsApp Daily Report copied to clipboard!');
      setTimeout(() => setCopiedMsg(''), 2600);
    } catch (_) {}
  };

  return (
    <div className="card rounded-[20px] p-4 space-y-3">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
          Daily Inspector
        </span>
        <h3 className="font-serif text-[17px] font-semibold text-primary">
          📋 Person-Wise Daily Count &amp; Edit
        </h3>
      </div>

      {/* Filters: Date + Aamaal */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
            Pick Any Date
          </label>
          <input
            type="date"
            value={filterDate}
            max={todayLocal}
            onChange={(e) => {
              if (e.target.value) handleDateChange(e.target.value);
            }}
            className="bg-[#F5F2E8] text-primary text-[12px] font-semibold py-1.5 px-2.5 rounded-xl"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
            Select Aamaal
          </label>
          <select
            value={targetAamaal?.id || ''}
            onChange={(e) => handleAamaalChange(e.target.value)}
            className="bg-[#F5F2E8] text-primary text-[12px] font-semibold py-1.5 px-2.5 rounded-xl"
          >
            {aamaalList.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Copy Selected Date Report for WhatsApp Button */}
      <button
        type="button"
        onClick={handleCopyWhatsAppReport}
        className="btn-primary w-full py-2.5 text-[12.5px] font-semibold shadow-sm"
      >
        📲 Copy Selected Date Report for WhatsApp
      </button>

      {copiedMsg && (
        <p className="text-center text-[11.5px] font-semibold text-[#135332]">
          {copiedMsg}
        </p>
      )}

      {/* Summary Banner */}
      <div className="rounded-xl bg-[#EAE8D7] px-3 py-2 flex items-center justify-between text-[11.5px] font-bold text-primary">
        <span>📅 {formatAnyDatePretty(filterDate)}</span>
        <span>
          Done: {logsForSelectedDate.length}/{allMembers.length} • Total:{' '}
          {totalDateCount.toLocaleString('en-US')}
        </span>
      </div>

      {/* Person-Wise Member Rows */}
      <div className="divide-y divide-[#E2DEC9]">
        {sortedMembers.map((m) => {
          const entry = logByMember[m.id];
          const count = entry ? Number(entry.count) : 0;
          const isEditing = editingMemberId === m.id;

          return (
            <div key={m.id} className="py-2.5 first:pt-1 last:pb-0">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5 text-[13.5px] font-bold text-primary">
                    <span>{count > 0 ? '✅' : '⏳'}</span>
                    <CountryFlag country={m.country || 'India'} size={16} />
                    <span className="truncate">{m.name}</span>
                  </div>
                  <div className="text-[11px] text-secondary mt-0.5">
                    Count:{' '}
                    <strong
                      className={
                        count > 0 ? 'text-[#135332]' : 'text-[#6B2D26]'
                      }
                    >
                      {count.toLocaleString('en-US')}
                    </strong>{' '}
                    • {m.country || 'India'} • Privacy: {m.privacy || 'public'}
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditing) {
                        setEditingMemberId(null);
                      } else {
                        setEditingMemberId(m.id);
                        setCountInput(
                          String(count > 0 ? count : targetAamaal?.target || 313)
                        );
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#EAE8D7] text-primary text-[11px] font-bold border border-[#D5D2BE]"
                  >
                    ✏️ {count > 0 ? 'Edit' : 'Log'}
                  </button>

                  {count > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onUpsertMemberLog && targetAamaal) {
                          onUpsertMemberLog(m.id, targetAamaal.id, filterDate, 0);
                        }
                      }}
                      className="px-2 py-1 rounded-lg bg-[#E5DEC9] text-[#6B2D26] text-[11px] font-bold"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-2 pt-2 border-t border-[#E2DEC9] flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    value={countInput}
                    onChange={(e) => setCountInput(e.target.value)}
                    className="flex-1 bg-[#F5F2E8] text-primary text-[12.5px] font-bold py-1 px-2.5 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = Number(countInput);
                      if (!isNaN(val) && val >= 0 && onUpsertMemberLog && targetAamaal) {
                        onUpsertMemberLog(m.id, targetAamaal.id, filterDate, val);
                      }
                      setEditingMemberId(null);
                    }}
                    className="px-3 py-1 rounded-lg bg-[#0D4A2E] text-white text-[11.5px] font-bold"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}