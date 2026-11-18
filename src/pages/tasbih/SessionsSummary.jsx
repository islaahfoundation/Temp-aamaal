//Displays total lifetime beads, completed goals, and session breakdown.

// src/pages/tasbih/SessionsSummary.jsx
import React from 'react';

export default function SessionsSummary({
  totalDhikrCount = 0,
  completedSessionsCount = 0,
  onBack,
}) {
  const historyLogs = (() => {
    try {
      return JSON.parse(localStorage.getItem('aamaal_tasbih_history_v1') || '[]');
    } catch (_) {
      return [];
    }
  })();

  return (
    <div className="screen-section no-scrollbar px-5 pt-4 pb-6 space-y-4 fade-in">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary px-3.5 py-1.5 text-[11.5px] font-semibold"
        >
          ← Back to Tasbih Counter
        </button>
      )}

      <div>
        <span className="badge-pill">Remembrance Analytics</span>
        <h2 className="font-serif text-[23px] font-semibold text-primary mt-1">
          📊 Tasbih Summary &amp; Statistics
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card rounded-[20px] p-4 text-center bg-[#F3EFE2]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
            Total Beads Recited
          </span>
          <div className="font-serif text-[28px] font-bold text-[#135332] mt-1">
            {Number(totalDhikrCount).toLocaleString('en-US')}
          </div>
        </div>

        <div className="card rounded-[20px] p-4 text-center bg-[#F3EFE2]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
            Completed Goals
          </span>
          <div className="font-serif text-[28px] font-bold text-primary mt-1">
            {Math.max(completedSessionsCount, historyLogs.length)}
          </div>
        </div>
      </div>
    </div>
  );
}