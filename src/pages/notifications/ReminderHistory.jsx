//Displays a chronological log of completed and snoozed reminders so the user can track their consistency in responding to daily Sunnah prompts.

import React from 'react';

export default function ReminderHistory({
  historyLogs = [],
  onClearHistory,
}) {
  const formatTimePretty = (isoStr) => {
    try {
      const dt = new Date(isoStr);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(dt);
    } catch (_) {
      return '';
    }
  };

  return (
    <div className="card rounded-[20px] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
            Consistency Log
          </span>
          <h3 className="font-serif text-[17px] font-semibold text-primary">
            📜 Completed Reminder History ({historyLogs.length})
          </h3>
        </div>

        {historyLogs.length > 0 && onClearHistory && (
          <button
            type="button"
            onClick={onClearHistory}
            className="px-2.5 py-1 rounded-full bg-[#E5DEC9] text-[#6B2D26] text-[10.5px] font-bold"
          >
            Clear Log
          </button>
        )}
      </div>

      {historyLogs.length === 0 ? (
        <p className="text-[12px] text-secondary py-2">
          No reminder actions logged yet. Tap &ldquo;Mark Completed&rdquo; on any reminder to record it here.
        </p>
      ) : (
        <div className="divide-y divide-[#E2DEC9] max-h-64 overflow-y-auto no-scrollbar">
          {historyLogs.map((log) => (
            <div
              key={log.id}
              className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2 text-[12px]"
            >
              <div className="min-w-0">
                <h4 className="font-semibold text-primary truncate">
                  {log.title}
                </h4>
                <span className="text-[10.5px] text-secondary">
                  {formatTimePretty(log.timestamp)}
                </span>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                  log.status === 'completed'
                    ? 'bg-[#DCE3C8] text-[#0D4A2E]'
                    : 'bg-[#EAE8D7] text-secondary'
                }`}
              >
                {log.status === 'completed' ? '✓ Completed' : '💤 Snoozed'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}