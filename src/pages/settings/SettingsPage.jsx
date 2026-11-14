import React, { useState } from 'react';
import categoriesData from '../../data/categories.json';
import { triggerHaptic } from '../../utils/haptics';

export default function SettingsPage({ state, updateState, onResetAll, onShowToast }) {
  const [nameInput, setNameInput] = useState(state.userName || '');

  const handleSaveName = () => {
    updateState({ userName: nameInput.trim() });
    onShowToast('Name saved');
  };

  const handleToggleFocus = (intent) => {
    triggerHaptic(10);
    const exists = state.focusChips.includes(intent);
    const updated = exists
      ? state.focusChips.filter((i) => i !== intent)
      : [...state.focusChips, intent];
    updateState({ focusChips: updated });
  };

  const handleReset = () => {
    setNameInput('');
    onResetAll();
  };

  return (
    <section className="h-full overflow-y-auto no-scrollbar px-5 pt-4 pb-6">
      <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#C99E4C]">
        Aamaal Circle
      </span>
      <h2 className="font-serif text-[24px] font-semibold text-[#0D4A2E]">Profile & Settings</h2>

      <div className="mt-3 rounded-[18px] bg-[#EAE8D7] p-3.5 border border-white/80 shadow-soft-card">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#0D4A2E]/80">
          Your Name / Kunya
        </label>
        <div className="mt-1.5 flex space-x-2">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="e.g., Yusuf, Amina..."
            className="flex-1 rounded-xl bg-[#F5F2E8] px-3 py-1.5 text-[13px] text-[#0D4A2E] border border-[#D3CFB8] focus:outline-none focus:ring-2 focus:ring-[#0D4A2E]"
          />
          <button
            onClick={handleSaveName}
            className="px-3.5 py-1.5 rounded-xl bg-[#0D4A2E] text-white text-[12.5px] font-medium active:scale-95 transition"
          >
            Save
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-[18px] bg-[#EAE8D7] p-3.5 border border-white/80 shadow-soft-card">
        <h3 className="font-serif text-[16px] font-semibold text-[#0D4A2E]">
          Personalization Focus
        </h3>
        <p className="text-[11.5px] text-[#4A5E51]">Select spiritual goals to prioritize:</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {categoriesData.focusIntentions.map((intent) => {
            const active = state.focusChips.includes(intent);
            return (
              <button
                key={intent}
                onClick={() => handleToggleFocus(intent)}
                className={`px-3 py-1 rounded-full text-[11.5px] font-medium transition ${
                  active
                    ? 'bg-[#0D4A2E] text-white'
                    : 'bg-[#F5F2E8] text-[#0D4A2E] border border-[#C9C5B1]'
                }`}
              >
                {active ? `✓ ${intent}` : intent}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex space-x-2">
        <button
          onClick={handleReset}
          className="w-full py-2.5 rounded-xl bg-[#E5DEC9] text-[#6B2D26] text-[12.5px] font-medium active:scale-95 transition"
        >
          Reset All Progress
        </button>
      </div>
    </section>
  );
}
