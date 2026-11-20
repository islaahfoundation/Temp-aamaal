//The complete interactive Tasbih screen matching Image 3's layout in our Cream, Deep Emerald & Gold palette.

// src/pages/tasbih/ActiveTasbih.jsx
import React, { useState, useEffect, useRef } from 'react';
import BeadEngine from './engine/BeadEngine';
import ProgressRing from './engine/ProgressRing';
import DhikrSelection, { PREDEFINED_DHIKRS } from './DhikrSelection';
import CustomDhikr from './CustomDhikr';
import GoalSelection from './GoalSelection';
import TasbihAppearance from './TasbihAppearance';
import TasbihFeedback from './TasbihFeedback';
import TasbihHistory from './TasbihHistory';
import SessionCompletion from './SessionCompletion';
import HapticEngine from './engine/HapticEngine';
import SoundEngine from './engine/SoundEngine';

const TASBIH_STATE_KEY = 'aamaal_active_tasbih_v1';
const TASBIH_HISTORY_KEY = 'aamaal_tasbih_history_v1';

export default function ActiveTasbih({
  state,
  updateState,
  onShowToast,
  onOpenSummary,
  onBack,
}) {
  // Load saved preferences & state
  const [savedConfig] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(TASBIH_STATE_KEY) || 'null') || {};
    } catch (_) {
      return {};
    }
  });

  const [count, setCount] = useState(savedConfig.count || 0);
  const [goal, setGoal] = useState(savedConfig.goal || 413);
  const [round, setRound] = useState(savedConfig.round || 1);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const [customDhikrs, setCustomDhikrs] = useState(
    savedConfig.customDhikrs || []
  );
  const [currentDhikr, setCurrentDhikr] = useState(
    savedConfig.currentDhikr || PREDEFINED_DHIKRS[0]
  );

  const [materialId, setMaterialId] = useState(
    savedConfig.materialId || 'olivewood'
  );
  const [bgUrl, setBgUrl] = useState(savedConfig.bgUrl || '');
  const [settings, setSettings] = useState(
    savedConfig.settings || {
      hapticsEnabled: true,
      soundEnabled: true,
      motionEnabled: true,
    }
  );

  const [historyLogs, setHistoryLogs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(TASBIH_HISTORY_KEY) || '[]');
      if (Array.isArray(saved)) return saved;
    } catch (_) {}
    return [];
  });

  // Active modal / popover state
  const [activeModal, setActiveModal] = useState(null);

  // Floating +1 / -1 feedback badge state
  const [deltaFeedback, setDeltaFeedback] = useState(null); // { value: '+1' | '-1', key: number }
  const deltaTimerRef = useRef(null);

  // Auto-hide gesture instruction pill after 3 seconds
  const [showGestureHint, setShowGestureHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGestureHint(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const triggerDeltaBadge = (val) => {
    if (deltaTimerRef.current) clearTimeout(deltaTimerRef.current);
    setDeltaFeedback({ value: val, key: Date.now() });
    deltaTimerRef.current = setTimeout(() => {
      setDeltaFeedback(null);
    }, 650);
  };

  // Persist current session state
  useEffect(() => {
    try {
      localStorage.setItem(
        TASBIH_STATE_KEY,
        JSON.stringify({
          count,
          goal,
          round,
          currentDhikr,
          customDhikrs,
          materialId,
          bgUrl,
          settings,
        })
      );
    } catch (_) {}
  }, [
    count,
    goal,
    round,
    currentDhikr,
    customDhikrs,
    materialId,
    bgUrl,
    settings,
  ]);

  // Background session timer for history logging
  useEffect(() => {
    if (!timerActive) return undefined;
    const interval = setInterval(() => {
      setSessionSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  // +1 Bead Advance Handler
  const handleAdvanceBead = () => {
    if (!timerActive) setTimerActive(true);
    const nextCount = count + 1;
    setCount(nextCount);
    triggerDeltaBadge('+1');

    if (settings.hapticsEnabled !== false) {
      if (nextCount % 33 === 0) {
        HapticEngine.triggerRoundMilestone(true);
      } else {
        HapticEngine.triggerBeadAdvance(true, 12);
      }
    }
    if (settings.soundEnabled !== false) {
      SoundEngine.playBeadClick(true, 0.85);
    }

    if (updateState) {
      updateState((prev) => ({
        ...prev,
        dhikrCount: (prev.dhikrCount || 0) + 1,
      }));
    }

    if (nextCount >= goal) {
      if (settings.hapticsEnabled !== false) {
        HapticEngine.triggerGoalComplete(true);
      }
      if (settings.soundEnabled !== false) {
        SoundEngine.playGoalChime(true, 0.9);
      }

      const newEntry = {
        id: `thist_${Date.now()}`,
        dhikrTitle: currentDhikr.title,
        arabic: currentDhikr.arabic,
        count: nextCount,
        goal,
        round,
        durationSeconds: sessionSeconds,
        timestamp: new Date().toISOString(),
      };

      const nextHistory = [newEntry, ...historyLogs];
      setHistoryLogs(nextHistory);
      try {
        localStorage.setItem(TASBIH_HISTORY_KEY, JSON.stringify(nextHistory));
      } catch (_) {}

      if (updateState) {
        updateState((prev) => ({
          ...prev,
          sessionsCount: (prev.sessionsCount || 0) + 1,
        }));
      }

      setActiveModal('completion');
    }
  };

  // -1 Undo Handler
  const handleUndoBead = () => {
    if (count <= 0) return;
    setCount((prev) => Math.max(prev - 1, 0));
    triggerDeltaBadge('-1');

    if (settings.hapticsEnabled !== false) {
      HapticEngine.triggerBeadUndo(true);
    }
    if (settings.soundEnabled !== false) {
      SoundEngine.playUndoClick(true, 0.8);
    }

    if (updateState) {
      updateState((prev) => ({
        ...prev,
        dhikrCount: Math.max((prev.dhikrCount || 1) - 1, 0),
      }));
    }
  };

  // Reset Counter Handler
  const handleResetCounter = () => {
    if (count === 0) return;
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}
    setCount(0);
    setSessionSeconds(0);
    setTimerActive(false);
    if (onShowToast) onShowToast('Tasbih counter reset to 0');
  };

  const remaining = Math.max(goal - count, 0);
  const hasCustomWallpaper = Boolean(bgUrl);

  return (
    <section
      className="h-full w-full overflow-hidden relative px-4 pt-2.5 pb-3 flex flex-col justify-between select-none touch-none"
      style={
        hasCustomWallpaper
          ? {
              backgroundImage: `linear-gradient(rgba(245, 242, 232, 0.86), rgba(243, 239, 226, 0.92)), url(${bgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : { backgroundColor: '#F5F2E8' }
      }
    >
      {/* 1. TOP HEADER BAR: Back Arrow + Title + 4 Ribbon Buttons (?, 🖼️, ⏱️, ⚙️) */}
      <div className="relative z-30 flex items-start justify-between shrink-0">
        <div className="flex items-start space-x-2.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="w-9 h-9 rounded-full bg-[#F3EFE2] border border-[#D5D2BE] shadow-soft-card flex items-center justify-center text-[#0D4A2E] font-bold text-[18px] active:scale-95 transition mt-0.5"
            >
              ←
            </button>
          )}
          <div>
            <h1 className="font-serif text-[26px] font-bold text-[#0D4A2E] leading-none">
              Tasbih
            </h1>
            <p className="text-[11px] font-medium text-[#4E5953] mt-1">
              Count your dhikr, earn your peace
            </p>
          </div>
        </div>

        {/* Top-Right 4-Icon Ribbon */}
        <div className="flex items-center space-x-1.5">
          {/* A. Info Gesture Guide Button (?) */}
          <button
            type="button"
            onClick={() =>
              setActiveModal(activeModal === 'info' ? null : 'info')
            }
            aria-label="Interactive Gesture Guide"
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition shadow-sm ${
              activeModal === 'info'
                ? 'bg-[#0D4A2E] text-[#F0D58C] border-[#C99E4C]'
                : 'bg-[#F3EFE2] text-[#0D4A2E] border-[#D5D2BE]'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>

          {/* B. Temporary Image Wallpaper Button (🖼️) */}
          <button
            type="button"
            onClick={() =>
              setActiveModal(activeModal === 'appearance' ? null : 'appearance')
            }
            aria-label="Choose Background Image"
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition shadow-sm ${
              activeModal === 'appearance'
                ? 'bg-[#0D4A2E] text-[#F0D58C] border-[#C99E4C]'
                : 'bg-[#F3EFE2] text-[#0D4A2E] border-[#D5D2BE]'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>

          {/* C. History Button (⏱️) */}
          <button
            type="button"
            onClick={() =>
              setActiveModal(activeModal === 'history' ? null : 'history')
            }
            aria-label="Saved Dhikr History"
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition shadow-sm ${
              activeModal === 'history'
                ? 'bg-[#0D4A2E] text-[#F0D58C] border-[#C99E4C]'
                : 'bg-[#F3EFE2] text-[#0D4A2E] border-[#D5D2BE]'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>

          {/* D. Settings & Bead Theme Button (⚙️) */}
          <button
            type="button"
            onClick={() =>
              setActiveModal(activeModal === 'feedback' ? null : 'feedback')
            }
            aria-label="Tasbih Settings & Beads"
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition shadow-sm ${
              activeModal === 'feedback'
                ? 'bg-[#0D4A2E] text-[#F0D58C] border-[#C99E4C]'
                : 'bg-[#F3EFE2] text-[#0D4A2E] border-[#D5D2BE]'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 2. TOP DHIKR SELECTOR & GOAL CARD (Added spacing from header with mt-2.5) */}
      <div className="relative z-20 mt-2.5 rounded-[22px] bg-[#F3EFE2] border border-[#D5D2BE] shadow-soft-card p-2.5 flex items-center justify-between shrink-0">
        {/* Left: Circular Arabic Badge + Allahu Akbar Dropdown */}
        <button
          type="button"
          onClick={() =>
            setActiveModal(activeModal === 'dhikr' ? null : 'dhikr')
          }
          className="flex items-center space-x-3 text-left flex-1 min-w-0 pr-2"
        >
          <div className="w-11 h-11 rounded-full bg-[#0F4C2B] border-2 border-[#C99E4C] flex items-center justify-center shrink-0 shadow-sm px-1">
            <span
              dir="rtl"
              className="font-arabic text-[13px] text-[#F0D58C] leading-none text-center line-clamp-1"
            >
              {currentDhikr.arabic}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5">
              <h2 className="font-serif text-[18px] font-bold text-[#0D4A2E] truncate">
                {currentDhikr.title}
              </h2>
              <span className="text-[#0D4A2E] text-[12px] font-bold">⌄</span>
            </div>
            <p className="text-[11px] text-[#4E5953] truncate">
              {currentDhikr.translation}
            </p>
          </div>
        </button>

        {/* Vertical Divider */}
        <div className="w-[1px] h-9 bg-[#D5D2BE] mx-2 shrink-0" />

        {/* Right: Goal Target Button */}
        <button
          type="button"
          onClick={() =>
            setActiveModal(activeModal === 'goal' ? null : 'goal')
          }
          className="flex items-center space-x-2 pl-1 pr-1.5 py-1 rounded-2xl hover:bg-[#EAE8D7] transition shrink-0"
        >
          <div className="text-right">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#4E5953] block">
              Goal
            </span>
            <span className="font-sans text-[17px] font-bold text-[#0D4A2E] leading-none">
              {goal}
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#EAE8D7] border border-[#C99E4C] flex items-center justify-center text-[#0D4A2E] text-[13px]">
            🎯
          </div>
        </button>
      </div>

      {/* 3. MIDDLE ARENA: Floating Undo/Reset Buttons + 3D Scrolling Bead Loop + Floating +1/-1 */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-center">
        {/* Top-Right Undo (-1) & Reset Buttons */}
        <div className="absolute right-0 top-2 z-20 flex items-center space-x-2">
          <button
            type="button"
            onClick={handleUndoBead}
            title="Undo (-1 Bead)"
            className="w-9 h-9 rounded-full bg-[#F3EFE2] border border-[#D5D2BE] shadow-soft-card flex items-center justify-center text-[#0D4A2E] text-[15px] font-bold active:scale-90 transition"
          >
            ↶
          </button>
          <button
            type="button"
            onClick={handleResetCounter}
            title="Reset Counter"
            className="w-9 h-9 rounded-full bg-[#F3EFE2] border border-[#D5D2BE] shadow-soft-card flex items-center justify-center text-[#0D4A2E] text-[14px] font-bold active:scale-90 transition"
          >
            ↻
          </button>
        </div>

        {/* Floating +1 / -1 Pill Badge */}
        {deltaFeedback && (
          <div
            key={deltaFeedback.key}
            className={`pointer-events-none absolute left-[62%] top-[54%] -translate-y-1/2 z-30 px-3 py-1 rounded-full font-sans text-[14px] font-bold shadow-lg border transition-all duration-300 fade-in ${
              deltaFeedback.value === '+1'
                ? 'bg-[#0D4A2E]/95 text-[#F0D58C] border-[#C99E4C]'
                : 'bg-[#7F1D1D]/95 text-[#FECACA] border-[#F87171]/60'
            }`}
          >
            {deltaFeedback.value}
          </div>
        )}

        {/* Interactive Photorealistic 3D Bead Loop */}
        <BeadEngine
          count={count}
          materialId={materialId}
          motionEnabled={settings.motionEnabled !== false}
          onAdvanceBead={handleAdvanceBead}
          onUndoBead={handleUndoBead}
        />

        {/* Auto-Hiding Gesture Instruction Pill (Shows for 3 seconds, then hides) */}
        <div
          className={`mx-auto w-full max-w-[340px] rounded-full bg-[#EAE8D7]/90 border border-[#D5D2BE] px-4 py-1.5 text-center shadow-sm -mt-1 relative z-20 shrink-0 transition-all duration-500 ${
            showGestureHint
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <p className="text-[11px] font-medium text-[#1A3826]">
            Tap or pull down anywhere to begin • Long swipe up to undo
          </p>
        </div>
      </div>

      {/* 4. BOTTOM PROGRESS CARD: Progress Bar + Goal | Completed | Remaining */}
      <div className="relative z-20 rounded-[22px] bg-[#F3EFE2] border border-[#D5D2BE] shadow-soft-card p-3 space-y-2.5 shrink-0">
        <ProgressRing count={count} goal={goal} />

        <div className="grid grid-cols-3 divide-x divide-[#D5D2BE] pt-0.5">
          {/* Column 1: Goal */}
          <div className="pr-2 flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#EAE8D7] border border-[#C99E4C] flex items-center justify-center text-[12px] shrink-0">
              🎯
            </div>
            <div className="min-w-0">
              <span className="text-[9.5px] font-semibold text-[#4E5953] block">
                Goal
              </span>
              <strong className="font-sans text-[14.5px] font-bold text-[#0D4A2E]">
                {goal}
              </strong>
            </div>
          </div>

          {/* Column 2: Completed */}
          <div className="px-2.5 flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#DCE3C8] border border-[#0D4A2E]/25 flex items-center justify-center text-[#0D4A2E] text-[11px] font-bold shrink-0">
              ✓
            </div>
            <div className="min-w-0">
              <span className="text-[9.5px] font-semibold text-[#4E5953] block">
                Completed
              </span>
              <strong className="font-sans text-[14.5px] font-bold text-[#0D4A2E]">
                {count}
              </strong>
            </div>
          </div>

          {/* Column 3: Remaining */}
          <div className="pl-2.5 flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#EAE8D7] border border-[#D5D2BE] flex items-center justify-center text-[#135332] text-[11px] font-bold shrink-0">
              ⏳
            </div>
            <div className="min-w-0">
              <span className="text-[9.5px] font-semibold text-[#4E5953] block">
                Remaining
              </span>
              <strong className="font-sans text-[14.5px] font-bold text-[#135332]">
                {remaining}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODALS & POPOVERS ================= */}

      {/* A. Interactive Gesture Guide Popup */}
      {activeModal === 'info' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
          <div className="w-full max-w-sm rounded-[26px] bg-[#F5F2E8] border-2 border-[#C99E4C] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#0D4A2E] text-[#F0D58C] text-[10px] font-bold uppercase tracking-wider">
                INTERACTIVE GESTURE GUIDE
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-[#EAE8D7] text-primary font-bold text-xs flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-[12.5px] font-semibold text-[#1A3826] bg-[#EAE8D7] p-3 rounded-xl border border-[#D5D2BE]">
              Tap or pull down anywhere to begin • Long swipe up to undo
            </p>

            <div className="space-y-2.5 text-[12.5px]">
              <div className="rounded-xl bg-[#FFFDF9] p-3 border border-[#DCD8C6] flex items-center justify-between">
                <strong className="text-[#0D4A2E]">Tap / Pull Down</strong>
                <span className="text-secondary font-medium">
                  Advance bead (+1 count)
                </span>
              </div>

              <div className="rounded-xl bg-[#FFFDF9] p-3 border border-[#DCD8C6] flex items-center justify-between">
                <strong className="text-[#0D4A2E]">Long Swipe Up</strong>
                <span className="text-secondary font-medium">
                  Push bead back (Undo -1)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="btn-primary w-full py-3 text-[13.5px] font-bold shadow-md"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Dhikr Dropdown Modal */}
      {activeModal === 'dhikr' && (
        <DhikrSelection
          currentDhikrId={currentDhikr.id}
          customDhikrs={customDhikrs}
          onSelectDhikr={(item) => {
            setCurrentDhikr(item);
            if (item.defaultTarget) setGoal(item.defaultTarget);
            setCount(0);
            setSessionSeconds(0);
          }}
          onOpenCustomModal={() => setActiveModal('custom_dhikr')}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Add Custom Dhikr Modal */}
      {activeModal === 'custom_dhikr' && (
        <CustomDhikr
          onSaveCustomDhikr={(cust) => {
            setCustomDhikrs((prev) => [...prev, cust]);
            setCurrentDhikr(cust);
            setGoal(cust.defaultTarget);
            setCount(0);
            setActiveModal(null);
            if (onShowToast) onShowToast(`Added "${cust.title}"`);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Goal Selection Modal */}
      {activeModal === 'goal' && (
        <GoalSelection
          currentGoal={goal}
          onSelectGoal={(newGoal) => {
            setGoal(newGoal);
            if (onShowToast) onShowToast(`Target goal set to ${newGoal}`);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* B. Temporary Image Wallpaper Picker Only */}
      {activeModal === 'appearance' && (
        <TasbihAppearance
          currentBgUrl={bgUrl}
          onSelectBackground={(url) => setBgUrl(url)}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* C. History Modal */}
      {activeModal === 'history' && (
        <TasbihHistory
          historyLogs={historyLogs}
          onClearHistory={() => {
            setHistoryLogs([]);
            localStorage.removeItem(TASBIH_HISTORY_KEY);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* D. Settings & Bead Material Theme Modal */}
      {activeModal === 'feedback' && (
        <TasbihFeedback
          settings={settings}
          currentMaterial={materialId}
          onUpdateSettings={setSettings}
          onSelectMaterial={(matId) => setMaterialId(matId)}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Goal Completion Celebration Modal */}
      {activeModal === 'completion' && (
        <SessionCompletion
          dhikrTitle={currentDhikr.title}
          count={count}
          goal={goal}
          onStartNewRound={() => {
            setCount(0);
            setRound((r) => r + 1);
            setActiveModal(null);
          }}
          onReturnHome={() => {
            setActiveModal(null);
            if (onOpenSummary) onOpenSummary();
          }}
        />
      )}
    </section>
  );
}