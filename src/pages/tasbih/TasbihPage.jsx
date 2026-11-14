import React, { useState } from 'react';
import dhikrPhrases from '../../data/dhikr.json';
import { triggerHaptic } from '../../utils/haptics';

export default function TasbihPage({ state, updateState, onShowToast }) {
  const [beadPop, setBeadPop] = useState(false);

  const activePhrase =
    dhikrPhrases.find((p) => p.id === state.activePhraseId) || dhikrPhrases[0];

  const tasbihRatio = Math.min(1, state.tasbihCurrent / state.tasbihTarget);
  const strokeDashoffset = 339.3 - tasbihRatio * 339.3;

  const handleTap = () => {
    setBeadPop(false);
    setTimeout(() => setBeadPop(true), 10);

    const nextCount = state.tasbihCurrent + 1;
    const completedTarget = nextCount >= state.tasbihTarget;

    if (completedTarget) {
      triggerHaptic([35, 50, 45]);
      onShowToast(`MashaAllah! Completed ${state.tasbihTarget} Dhikr`);
    } else {
      triggerHaptic(14);
    }

    updateState((prev) => ({
      ...prev,
      tasbihCurrent: completedTarget ? 0 : nextCount,
      dhikrCount: prev.dhikrCount + 1
    }));
  };

  const handleReset = () => {
    triggerHaptic(12);
    updateState({ tasbihCurrent: 0 });
    onShowToast('Counter reset');
  };

  const handleSelectTarget = (target) => {
    triggerHaptic(10);
    updateState({ tasbihTarget: target, tasbihCurrent: 0 });
  };

  return (
    <section className="h-full overflow-y-auto no-scrollbar px-5 pt-4 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#C99E4C]">
            Remembrance of Allah
          </span>
          <h2 className="font-serif text-[24px] font-semibold text-[#0D4A2E]">Digital Tasbih</h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1 rounded-full bg-[#EAE8D7] text-[#0D4A2E] text-[12px] font-medium border border-[#D5D2BE] active:scale-95 transition"
        >
          Reset Counter
        </button>
      </div>

      <div className="flex space-x-2 overflow-x-auto no-scrollbar mt-3 pb-1">
        {dhikrPhrases.map((phrase) => {
          const active = phrase.id === state.activePhraseId;
          return (
            <button
              key={phrase.id}
              onClick={() => {
                triggerHaptic(12);
                updateState({ activePhraseId: phrase.id });
              }}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition ${
                active ? 'bg-[#0D4A2E] text-white shadow' : 'bg-[#EAE8D7] text-[#0D4A2E]'
              }`}
            >
              {phrase.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 rounded-[20px] bg-gradient-to-br from-[#165534] to-[#08351D] p-4 text-center text-white shadow-progress-card relative overflow-hidden">
        <p className="font-arabic text-[28px] leading-relaxed text-[#F0D58C]">
          {activePhrase.arabic}
        </p>
        <h3 className="font-serif text-[18px] font-semibold mt-0.5">{activePhrase.label}</h3>
        <p className="text-[12px] text-white/80">{activePhrase.meaning}</p>

        <div className="mt-3 inline-flex items-center bg-black/25 rounded-full p-1 border border-white/15">
          {[33, 99, 100].map((targetVal) => {
            const isTarget = state.tasbihTarget === targetVal;
            return (
              <button
                key={targetVal}
                onClick={() => handleSelectTarget(targetVal)}
                className={`px-3 py-0.5 rounded-full text-[11.5px] font-semibold transition ${
                  isTarget ? 'bg-[#DFB75A] text-[#07361D]' : 'text-white/80'
                }`}
              >
                {targetVal}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center">
        <button
          onClick={handleTap}
          className={`relative w-48 h-48 rounded-full bg-gradient-to-b from-[#EAE8D7] to-[#DCD9C0] border-4 border-white shadow-[0_14px_32px_rgba(13,74,46,0.18),inset_0_4px_12px_rgba(255,255,255,0.9)] flex flex-col items-center justify-center active:scale-95 transition select-none ${
            beadPop ? 'bead-active' : ''
          }`}
        >
          <svg className="absolute inset-2 w-[176px] h-[176px]" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" stroke="#D5D2BE" strokeWidth="4" fill="none" />
            <circle
              className="progress-ring-circle"
              cx="60"
              cy="60"
              r="54"
              stroke="#0D4A2E"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="339.3"
              style={{ strokeDashoffset }}
            />
          </svg>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[#536B5C]">
            Tap to Count
          </span>
          <span className="font-serif text-[48px] font-bold text-[#0D4A2E] leading-none my-1">
            {state.tasbihCurrent}
          </span>
          <span className="text-[12px] font-medium text-[#3B5947]">
            Target: {state.tasbihTarget}
          </span>
        </button>

        <p className="text-[12px] text-[#4E6456] mt-3">
          Total Dhikr Today: <strong className="text-[#0D4A2E]">{state.dhikrCount}</strong> • Haptic pulse enabled
        </p>
      </div>
    </section>
  );
}
