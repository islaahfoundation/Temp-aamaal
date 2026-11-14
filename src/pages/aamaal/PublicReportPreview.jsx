import React, { useState } from 'react';
import { formatAnyDatePretty } from './DateSelector';

export default function PublicReportPreview({
  aamaalName = 'Durood Shareef',
  dateKey,
  memberRows = [],
  totalCount = 0,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyGroupReport = async () => {
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}

    const lines = [
      `🕌 *Islaah Foundation's Aamaal Circle*`,
      `📿 *Aamaal:* ${aamaalName}`,
      `📅 *Date:* ${formatAnyDatePretty(dateKey)}`,
      `--------------------`,
    ];

    memberRows.forEach((m) => {
      lines.push(
        `${m.count > 0 ? '✅' : '⏳'} ${m.flag || '🇮🇳'} ${m.displayName}: *${Number(
          m.count || 0
        ).toLocaleString('en-US')}*`
      );
    });

    lines.push(`--------------------`);
    lines.push(`✨ *Total Recited:* ${Number(totalCount).toLocaleString('en-US')}`);
    lines.push(``);
    lines.push(
      `Please recite your daily ${aamaalName} and update the count in Aamaal Circle.`
    );

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch (_) {}
  };

  return (
    <div className="card-soft rounded-[20px] p-4 mt-4 border border-[#C9CDAC]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="badge-pill">Circle Share</span>
          <h4 className="font-serif text-[15.5px] font-semibold text-primary mt-1">
            Public Circle Report Preview
          </h4>
        </div>
        <button
          type="button"
          onClick={handleCopyGroupReport}
          className="btn-primary px-3.5 py-1.5 text-[11.5px]"
        >
          {copied ? '✓ Copied!' : '📋 Copy WhatsApp Report'}
        </button>
      </div>

      <div className="rounded-xl bg-[#F5F2E8] p-3 border border-[#DCD8C6] text-[11.5px] space-y-1 max-h-40 overflow-y-auto no-scrollbar">
        <p className="font-bold text-primary">
          🕌 Islaah Foundation&apos;s Aamaal Circle • {formatAnyDatePretty(dateKey)}
        </p>
        {memberRows.slice(0, 8).map((m, i) => (
          <div key={i} className="flex items-center justify-between text-secondary">
            <span>
              {m.count > 0 ? '✅' : '⏳'} {m.flag || '🇮🇳'} {m.displayName}
            </span>
            <strong className="text-primary">
              {Number(m.count || 0).toLocaleString('en-US')}
            </strong>
          </div>
        ))}
        <div className="pt-1 border-t border-[#DCD8C6] flex items-center justify-between font-bold text-[#135332]">
          <span>Total Recited</span>
          <span>{Number(totalCount).toLocaleString('en-US')}</span>
        </div>
      </div>
    </div>
  );
}