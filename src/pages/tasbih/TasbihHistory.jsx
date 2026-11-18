//Displays the chronological log of saved and completed Tasbih sessions.

// src/pages/tasbih/TasbihHistory.jsx
import React from 'react';

export default function TasbihHistory({
  historyLogs = [],
  onClearHistory,
  onClose,
}) {
  const formatDate = (isoStr) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date(isoStr));
    } catch (_) {
      return '';
    }
  };

  return (
    <div className="absolute right-5 top-20 z-50 rounded-[24px] bg-[#F5F2E8] border border-[#C99E4C] shadow-2xl p-4 w-80 space-y-3 fade-in">
      <div className="flex items-center justify-between pb-1 border-t border-[#DCD8C6]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#135332]">
          Completed Tasbih Sessions ({historyLogs.length})
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-[#EAE8D7] text-primary font-bold text-xs flex items-center justify-center"
          >
            ✕
          </button>
        )}
      </div>

      {historyLogs.length === 0 ? (
        <p className="text-[12px] text-secondary py-3 text-center">
          No completed Tasbih sessions logged yet. Complete a target goal to save it here.
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
          {historyLogs.map((log) => (
            <div
              key={log.id}
              className="rounded-xl bg-[#FFFDF9] p-3 border border-[#DCD8C6] flex items-center justify-between"
            >
              <div>
                <h4 className="font-serif text-[14px] font-semibold text-primary">
                  {log.dhikrTitle || 'Dhikr'}
                </h4>
                <span className="text-[10.5px] text-secondary">
                  {formatDate(log.timestamp)}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#DCE3C8] text-[#0D4A2E] text-[11px] font-bold">
                {log.count} / {log.goal}
              </span>
            </div>
          ))}
        </div>
      )}

      {historyLogs.length > 0 && onClearHistory && (
        <button
          type="button"
          onClick={onClearHistory}
          className="w-full py-2 rounded-xl bg-[#E5DEC9] text-[#6B2D26] text-[11.5px] font-bold"
        >
          Clear History Log
        </button>
      )}
    </div>
  );
}