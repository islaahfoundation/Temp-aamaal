//Allows selecting from predefined targets (33, 99, 100, 313, 413, 1000) or typing any custom target.

// src/pages/tasbih/GoalSelection.jsx
import React, { useState } from 'react';

const PRESET_GOALS = [33, 100, 313, 1000];

export default function GoalSelection({
  currentGoal = 313,
  onSelectGoal,
  onClose,
}) {
  const [customGoal, setCustomGoal] = useState(currentGoal);

  const handleApplyCustom = (e) => {
    e.preventDefault();
    const val = Number(customGoal);
    if (val > 0) {
      try {
        if (navigator.vibrate) navigator.vibrate(10);
      } catch (_) {}
      if (onSelectGoal) onSelectGoal(val);
      if (onClose) onClose();
    }
  };

  return (
    <div className="absolute right-5 top-20 z-50 rounded-[22px] bg-[#F5F2E8] border border-[#C99E4C] shadow-2xl p-4 w-64 space-y-3 fade-in">
      <div className="flex items-center justify-between pb-1 border-t border-[#DCD8C6]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#135332]">
          Target Bead Goal
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-[#EAE8D7] text-primary font-bold text-xs flex items-center justify-center"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {PRESET_GOALS.map((g) => {
          const isSelected = Number(currentGoal) === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => {
                try {
                  if (navigator.vibrate) navigator.vibrate(10);
                } catch (_) {}
                if (onSelectGoal) onSelectGoal(g);
                if (onClose) onClose();
              }}
              className={`py-2 rounded-xl text-[13px] font-bold border transition ${
                isSelected
                  ? 'bg-[#0D4A2E] text-white border-[#C99E4C]'
                  : 'bg-[#FFFDF9] text-primary border-[#DCD8C6] hover:bg-[#EAE8D7]'
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleApplyCustom} className="space-y-2 pt-1 border-t border-[#DCD8C6]">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary">
          Custom Goal Target
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="1"
            max="100000"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            className="bg-[#FFFDF9] text-primary text-[12.5px] font-bold py-2 px-3 rounded-xl flex-1"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-[#0D4A2E] text-[#F0D58C] text-[12px] font-bold"
          >
            Set
          </button>
        </div>
      </form>
    </div>
  );
}