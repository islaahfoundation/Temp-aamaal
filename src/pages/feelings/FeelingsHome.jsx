//src/pages/feelings/FeelingsHome.jsx serves as the master wrapper for the feelings/ module (FeelingCheckIn.jsx, FeelingResult.jsx, and FeelingHistory.jsx). It manages the shared state, localStorage persistence, and view switching across all three components

import React, { useState, useEffect } from 'react';
import FeelingCheckIn, { FEELING_STATES } from './FeelingCheckIn';
import FeelingResult from './FeelingResult';
import FeelingHistory from './FeelingHistory';

const FEELINGS_STORAGE_KEY = 'aamaal_feelings_history_v1';

export default function FeelingsHome({
  state,
  updateState,
  onNavigateTab,
  onShowToast,
  onBack,
}) {
  const [activeView, setActiveView] = useState('checkin'); // 'checkin' | 'result' | 'history'
  const [selectedFeeling, setSelectedFeeling] = useState(null);

  const [historyLogs, setHistoryLogs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FEELINGS_STORAGE_KEY) || 'null');
      if (Array.isArray(saved)) return saved;
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(FEELINGS_STORAGE_KEY, JSON.stringify(historyLogs));
    } catch (_) {}
  }, [historyLogs]);

  // Latest check-in summary for quick access banner
  const latestEntry = historyLogs[0] || null;

  const handleOpenFeelingRemedy = (feelingObj, noteText = '') => {
    const target = feelingObj || FEELING_STATES[0];
    const newEntry = {
      id: `feel_${Date.now()}`,
      feelingId: target.id,
      label: target.label,
      icon: target.icon,
      note: (noteText || '').trim(),
      arabic: target.arabic,
      translation: target.translation,
      timestamp: new Date().toISOString(),
      completedRecitation: false,
    };

    setHistoryLogs((prev) => [newEntry, ...prev]);
    setSelectedFeeling(target);
    setActiveView('result');
  };

  const handleCompleteRecitation = () => {
    if (selectedFeeling) {
      setHistoryLogs((prev) =>
        prev.map((item, idx) =>
          idx === 0 && item.feelingId === selectedFeeling.id
            ? { ...item, completedRecitation: true }
            : item
        )
      );
    }

    if (updateState) {
      updateState((prev) => ({
        ...prev,
        sessionsCount: (prev.sessionsCount || 0) + 1,
        dhikrCount: (prev.dhikrCount || 0) + 3,
      }));
    }

    if (onShowToast) {
      onShowToast('Alhamdulillah! Spiritual check-in & Dua recorded');
    }
  };

  if (activeView === 'result' && selectedFeeling) {
    return (
      <FeelingResult
        feeling={selectedFeeling}
        onCompleteRecitation={handleCompleteRecitation}
        onOpenHistory={() => setActiveView('history')}
        onNavigateTab={onNavigateTab}
        onBack={() => setActiveView('checkin')}
      />
    );
  }

  if (activeView === 'history') {
    return (
      <FeelingHistory
        historyLogs={historyLogs}
        onSelectPastFeeling={(feelingId) => {
          const found = FEELING_STATES.find((f) => f.id === feelingId);
          if (found) {
            setSelectedFeeling(found);
            setActiveView('result');
          }
        }}
        onClearHistory={() => {
          setHistoryLogs([]);
          if (onShowToast) onShowToast('Check-in history cleared');
        }}
        onBack={() => setActiveView('checkin')}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Optional Quick Revisit Banner if user has a previous check-in */}
      {latestEntry && (
        <div className="px-5 pt-3 shrink-0">
          <div className="rounded-[16px] bg-[#0F4C2B] text-white px-3.5 py-2.5 flex items-center justify-between border border-[#C99E4C]/40 shadow-sm">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="text-[18px] shrink-0">{latestEntry.icon || '🌿'}</span>
              <div className="min-w-0">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#F0D58C] block">
                  Last Heart Check-In
                </span>
                <p className="text-[12px] font-semibold truncate">
                  {latestEntry.label}
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
                  setSelectedFeeling(found);
                  setActiveView('result');
                }
              }}
              className="px-2.5 py-1 rounded-full bg-white/15 text-[#F0D58C] text-[10.5px] font-bold shrink-0 ml-2"
            >
              Reopen Remedy ›
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0">
        <FeelingCheckIn
          state={state}
          updateState={updateState}
          onNavigateTab={onNavigateTab}
          onShowToast={onShowToast}
          onBack={onBack}
          onSelectFeelingAndContinue={handleOpenFeelingRemedy}
        />
      </div>
    </div>
  );
}