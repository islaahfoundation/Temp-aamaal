//Renders an expandable or modal-style breakdown of the active profile's today & 7-day recitation counts, with one-tap quick-mark buttons right from the Home screen.

import React from 'react';
import { DEFAULT_AAMAAL_LIST } from '../aamaal/AamaalCategories';

export default function ProgressDetails({
  activeProfile,
  todayLogs = [],
  weekTotalCount = 0,
  onQuickLogAamaal,
  onOpenFullReport,
  onClose,
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-[24px] p-4 bg-[#F5F2E8] border-2 border-[#C99E4C] shadow-2xl space-y-3 max-h-[85vh] overflow-y-auto no-scrollbar"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="badge-pill">Quick Log &amp; Breakdown</span>
            <h3 className="font-serif text-[18px] font-semibold text-primary mt-1">
              {activeProfile?.name || 'Your'} Daily Aamaal Breakdown
            </h3>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#EAE8D7] flex items-center justify-center text-primary font-bold text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="space-y-2">
          {DEFAULT_AAMAAL_LIST.map((aamaal) => {
            const entry = todayLogs.find((l) => l.aamaalId === aamaal.id);
            const count = entry ? Number(entry.count || 0) : 0;
            const isDone = count >= Number(aamaal.target || 1);

            return (
              <div
                key={aamaal.id}
                className="rounded-xl bg-[#FFFDF9] p-3 border border-[#DCD8C6] flex items-center justify-between gap-2"
              >
                <div>
                  <h4 className="font-serif text-[14.5px] font-semibold text-primary">
                    {aamaal.name}
                  </h4>
                  <p className="text-[11px] text-secondary">
                    Today: <strong className="text-[#135332]">{count}</strong> /{' '}
                    {aamaal.target}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    try {
                      if (navigator.vibrate) navigator.vibrate(15);
                    } catch (_) {}
                    if (onQuickLogAamaal) {
                      onQuickLogAamaal(aamaal, isDone ? 0 : aamaal.target);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition ${
                    isDone
                      ? 'bg-[#DCE3C8] text-[#0D4A2E] border border-[#0D4A2E]/30'
                      : 'bg-[#0D4A2E] text-white shadow-sm'
                  }`}
                >
                  {isDone ? '✓ Done (Undo)' : `+ Mark ${aamaal.target}`}
                </button>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-[#DCD8C6] flex items-center justify-between text-[11.5px]">
          <span className="text-secondary">
            7-Day Total:{' '}
            <strong className="text-primary">
              {weekTotalCount.toLocaleString('en-US')}
            </strong>
          </span>
          {onOpenFullReport && (
            <button
              type="button"
              onClick={() => {
                if (onClose) onClose();
                onOpenFullReport();
              }}
              className="font-bold text-[#0D4A2E] underline"
            >
              Open Full Aamaal ›
            </button>
          )}
        </div>
      </div>
    </div>
  );
}