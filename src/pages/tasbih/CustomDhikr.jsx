//Modal allowing users to create and save a personalized Dhikr with title, Arabic script, translation, and target bead count.

// src/pages/tasbih/CustomDhikr.jsx
import React, { useState } from 'react';

export default function CustomDhikr({
  onSaveCustomDhikr,
  onClose,
}) {
  const [title, setTitle] = useState('');
  const [arabic, setArabic] = useState('');
  const [translation, setTranslation] = useState('');
  const [target, setTarget] = useState(100);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}

    const customObj = {
      id: `custom_${Date.now()}`,
      title: title.trim(),
      arabic: arabic.trim() || 'سُبْحَانَ اللَّهِ',
      translation: translation.trim() || title.trim(),
      defaultTarget: Number(target) || 100,
      isCustom: true,
    };

    if (onSaveCustomDhikr) {
      onSaveCustomDhikr(customObj);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-[24px] bg-[#F5F2E8] border border-[#C99E4C] shadow-2xl p-5 space-y-3.5"
      >
        <div className="flex items-center justify-between">
          <span className="badge-pill">Personalized Dhikr</span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#EAE8D7] text-primary font-bold text-xs flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>

        <h3 className="font-serif text-[18px] font-semibold text-primary">
          Add Custom Dhikr
        </h3>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
            Dhikr Title / Name
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Hasbunallahu Wa Ni'mal Wakeel"
            className="bg-[#FFFDF9] text-primary text-[12.5px] font-semibold"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
            Arabic Script (Optional)
          </label>
          <input
            type="text"
            dir="rtl"
            value={arabic}
            onChange={(e) => setArabic(e.target.value)}
            placeholder="حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ"
            className="bg-[#FFFDF9] text-primary font-arabic text-[18px]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
            English Meaning
          </label>
          <input
            type="text"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="Allah is sufficient for us..."
            className="bg-[#FFFDF9] text-primary text-[12.5px]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
            Default Target Beads
          </label>
          <input
            type="number"
            min="1"
            max="10000"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="bg-[#FFFDF9] text-primary text-[13px] font-bold"
          />
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <button
            type="submit"
            className="btn-primary flex-1 py-3 text-[13px] font-semibold shadow-md"
          >
            Save &amp; Start Counting
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-4 py-3 text-[12px] font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}