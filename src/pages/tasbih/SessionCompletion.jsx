//Celebration modal when the target bead count is reached.

// src/pages/tasbih/SessionCompletion.jsx
import React from 'react';

export default function SessionCompletion({
  dhikrTitle = 'Allahu Akbar',
  count = 413,
  goal = 413,
  onStartNewRound,
  onReturnHome,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 fade-in">
      <div className="w-full max-w-sm rounded-[28px] bg-[#F5F2E8] border-2 border-[#C99E4C] shadow-2xl p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#0D4A2E] text-[#F0D58C] flex items-center justify-center mx-auto text-[30px] shadow-md">
          ✨
        </div>

        <span className="badge-pill">MashaAllah • Goal Reached</span>

        <h2 className="font-serif text-[24px] font-bold text-primary">
          {dhikrTitle} Completed
        </h2>

        <div className="card-progress rounded-[20px] p-4 text-white space-y-1">
          <div className="font-serif text-[32px] font-bold text-[#F0D58C]">
            {count} / {goal}
          </div>
          <p className="text-[12px] text-white/85">
            May every bead you counted weigh heavily on your scale of good deeds.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          {onStartNewRound && (
            <button
              type="button"
              onClick={onStartNewRound}
              className="btn-primary w-full py-3 text-[13px] font-semibold shadow-md"
            >
              Start Next Round ›
            </button>
          )}

          {onReturnHome && (
            <button
              type="button"
              onClick={onReturnHome}
              className="btn-secondary w-full py-2.5 text-[12.5px] font-semibold"
            >
              View Session Summary
            </button>
          )}
        </div>
      </div>
    </div>
  );
}