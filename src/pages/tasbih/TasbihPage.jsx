// src/pages/tasbih/TasbihPage.jsx
import React, { useState } from 'react';
import ActiveTasbih from './ActiveTasbih';
import TasbihStatistics from './TasbihStatistics';

export default function TasbihPage({
  state,
  updateState,
  onShowToast,
  onBack,
}) {
  const [view, setView] = useState('active'); // 'active' | 'stats'

  if (view === 'stats') {
    return (
      <TasbihStatistics
        totalDhikrCount={state?.dhikrCount || 0}
        completedSessionsCount={state?.sessionsCount || 0}
        onBack={() => setView('active')}
      />
    );
  }

  return (
    <ActiveTasbih
      state={state}
      updateState={updateState}
      onShowToast={onShowToast}
      onOpenSummary={() => setView('stats')}
      onBack={onBack}
    />
  );
}