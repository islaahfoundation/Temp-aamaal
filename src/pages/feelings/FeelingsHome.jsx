//src/pages/feelings/FeelingsHome.jsx serves as the master wrapper for the feelings/ module (FeelingCheckIn.jsx, FeelingResult.jsx, and FeelingHistory.jsx). It manages the shared state, localStorage persistence, and view switching across all three components

import React, { useState } from 'react';
import FeelingCheckIn, { FEELING_STATES } from './FeelingCheckIn';

const FEELINGS_STORAGE_KEY = 'aamaal_feelings_history_v1';

export default function FeelingsHome({
  state,
  updateState,
  onNavigateTab,
  onShowToast,
  onBack,
}) {
  const [selectedPastFeeling, setSelectedPastFeeling] = useState(null);
  const [historyLogs, setHistoryLogs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FEELINGS_STORAGE_KEY) || 'null');
      if (Array.isArray(saved)) return saved;
    } catch (_) {}
    return [];
  });

  const latestEntry = historyLogs[0] || null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <FeelingCheckIn
          state={state}
          updateState={updateState}
          onNavigateTab={onNavigateTab}
          onShowToast={onShowToast}
          onBack={onBack}
          externalSelectedFeeling={selectedPastFeeling}
          onClearExternalFeeling={() => setSelectedPastFeeling(null)}
          onHistoryUpdated={setHistoryLogs}
        />
      </div>

      {/* Last Heart Check-In Moved to Bottom */}
      {latestEntry && !selectedPastFeeling && (
        <div className="px-5 pb-3 pt-1 shrink-0">
          <div className="rounded-[16px] bg-[#0F4C2B] text-white px-3.5 py-2.5 flex items-center justify-between border border-[#C99E4C]/40 shadow-sm">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="text-[18px] shrink-0">
                {latestEntry.icon && latestEntry.icon !== '??'
                  ? latestEntry.icon
                  : '🌿'}
              </span>
              <div className="min-w-0">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#F0D58C] block">
                  Last Check-In
                </span>
                <p className="text-[12px] font-semibold truncate">
                  {latestEntry.note || latestEntry.label}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const found = FEELING_STATES.find(
                  (f) => f.id === latestEntry.feelingId
                );
                if (found) {
                  setSelectedPastFeeling({
                    ...found,
                    userSaid: latestEntry.note || '',
                  });
                }
              }}
              className="px-2.5 py-1 rounded-full bg-white/15 text-[#F0D58C] text-[10.5px] font-bold shrink-0 ml-2"
            >
              Reopen ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}