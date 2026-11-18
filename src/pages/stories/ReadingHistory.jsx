//Displays a chronological history of completed story chapters and saved personal reflection notes.

import React from 'react';

export default function ReadingHistory({
  historyLogs = [],
  onClearHistory,
  onBack,
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
    <div className="space-y-3.5 fade-in">
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary px-3.5 py-1.5 text-[11.5px] font-semibold"
          >
            ‹ Back to Stories
          </button>
        )}

        {historyLogs.length > 0 && onClearHistory && (
          <button
            type="button"
            onClick={onClearHistory}
            className="px-3 py-1 rounded-full bg-[#E5DEC9] text-[#6B2D26] text-[11px] font-bold"
          >
            🗑️ Clear History
          </button>
        )}
      </div>

      <div>
        <span className="badge-pill">Reading &amp; Reflection Journal</span>
        <h3 className="font-serif text-[21px] font-semibold text-primary mt-1">
          📜 Reading History ({historyLogs.length})
        </h3>
      </div>

      {historyLogs.length === 0 ? (
        <div className="card rounded-[20px] p-6 text-center space-y-2">
          <p className="font-serif text-[16.5px] font-semibold text-primary">
            No Reading Logs Yet
          </p>
          <p className="text-[12px] text-secondary">
            Chapters you complete and personal notes you write on reflections will be saved here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {historyLogs.map((log) => (
            <div
              key={log.id}
              className="card rounded-[18px] p-3.5 space-y-1.5 border border-[#D5D2BE]"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-[#DCE3C8] text-[#0D4A2E] text-[9.5px] font-bold uppercase">
                  {log.type || 'Chapter Read'}
                </span>
                <span className="text-[10.5px] text-secondary">
                  {formatDate(log.timestamp)}
                </span>
              </div>

              <h4 className="font-serif text-[15px] font-semibold text-primary">
                {log.title}
              </h4>

              {log.note && (
                <p className="text-[12px] text-secondary bg-[#EAE8D7] px-3 py-2 rounded-xl">
                  <strong className="text-[#135332]">Note:</strong> {log.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}