//Displays the chronological log of the user's past emotional check-ins, personal notes, and a summary of their most frequent heart states, with one-tap reopening of any remedy.

import React from 'react';

export default function FeelingHistory({
  historyLogs = [],
  onSelectPastFeeling,
  onClearHistory,
  onBack,
}) {
  const formatTimestamp = (isoStr) => {
    try {
      const dt = new Date(isoStr);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
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
    <section className="screen-section no-scrollbar px-5 pt-4 pb-6 space-y-3.5 fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary px-3.5 py-1.5 text-[11.5px] font-semibold"
          >
            ‹ Back to Check-In
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
        <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
          Personal Journal
        </span>
        <h2 className="font-serif text-[22px] font-semibold text-primary">
          My Heart Check-In History
        </h2>
        <p className="text-[12px] text-secondary mt-0.5">
          Tap any past check-in to revisit its Prophetic supplication and reflection.
        </p>
      </div>

      {historyLogs.length === 0 ? (
        <div className="card rounded-[20px] p-6 text-center space-y-2.5">
          <div className="w-11 h-11 rounded-full bg-[#EAE8D7] text-primary flex items-center justify-center mx-auto text-[20px]">
            🌿
          </div>
          <h3 className="font-serif text-[17px] font-semibold text-primary">
            No Check-Ins Logged Yet
          </h3>
          <p className="text-[12px] text-secondary max-w-[250px] mx-auto">
            Select how your heart feels on the check-in screen to start your spiritual reflection log.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {historyLogs.map((entry) => (
            <div
              key={entry.id}
              onClick={() =>
                onSelectPastFeeling && onSelectPastFeeling(entry.feelingId)
              }
              className="card rounded-[18px] p-3.5 cursor-pointer active:scale-[0.99] transition space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <span className="text-[20px]">{entry.icon || '🌿'}</span>
                  <div>
                    <h4 className="font-serif text-[15px] font-semibold text-primary">
                      {entry.label}
                    </h4>
                    <span className="text-[10.5px] text-secondary block">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold ${
                    entry.completedRecitation
                      ? 'bg-[#DCE3C8] text-[#0D4A2E]'
                      : 'bg-[#EAE8D7] text-secondary'
                  }`}
                >
                  {entry.completedRecitation ? '✓ Recited' : 'Revisit ›'}
                </span>
              </div>

              {entry.note && (
                <div className="rounded-xl bg-[#EAE8D7] px-3 py-2 text-[11.5px] text-primary">
                  <strong className="text-[#135332]">Note:</strong> {entry.note}
                </div>
              )}

              {entry.arabic && (
                <p
                  dir="rtl"
                  className="font-arabic text-[18px] text-[#0D4A2E] line-clamp-1 pt-0.5"
                >
                  {entry.arabic}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}