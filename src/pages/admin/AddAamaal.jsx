/*Renders the + Add New Aamaal form (English Name, RTL Arabic Text, 
Translation/Meaning, and Daily Target Count) from your index.html 
Admin Panel */

import React, { useState } from 'react';

export default function AddAamaal({ onAddAamaal, onCancel }) {
  const [name, setName] = useState('');
  const [arabic, setArabic] = useState('');
  const [translation, setTranslation] = useState('');
  const [target, setTarget] = useState('100');

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericTarget = Number(target);
    if (!name.trim() || !arabic.trim() || isNaN(numericTarget) || numericTarget <= 0) {
      return;
    }

    try {
      if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
    } catch (_) {}

    if (onAddAamaal) {
      onAddAamaal({
        id: `aamaal_${Date.now()}`,
        name: name.trim(),
        arabic: arabic.trim(),
        translation: translation.trim(),
        target: numericTarget,
        active: true,
      });
    }

    setName('');
    setArabic('');
    setTranslation('');
    setTarget('100');
  };

  return (
    <form onSubmit={handleSubmit} className="card rounded-[20px] p-4 space-y-3 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <span className="badge-pill">New Circle Aamaal</span>
          <h3 className="font-serif text-[17.5px] font-semibold text-primary mt-1">
            + Add New Aamaal
          </h3>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-7 h-7 rounded-full bg-[#EAE8D7] flex items-center justify-center text-primary font-bold text-xs"
          >
            ✕
          </button>
        )}
      </div>

      <div>
        <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1">
          Aamaal Name (English)
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., 100 Astaghfirullah or Ayatul Kursi"
          className="bg-[#F5F2E8] text-[13px] font-semibold"
        />
      </div>

      <div>
        <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1">
          Arabic Text (RTL)
        </label>
        <input
          type="text"
          required
          dir="rtl"
          value={arabic}
          onChange={(e) => setArabic(e.target.value)}
          placeholder="أَسْتَغْفِرُ اللَّهَ"
          className="bg-[#F5F2E8] font-arabic text-[18px] text-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1">
            Daily Target Count
          </label>
          <input
            type="number"
            min="1"
            required
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="e.g., 100"
            className="bg-[#F5F2E8] text-[13px] font-bold"
          />
        </div>

        <div>
          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1">
            Translation (Optional)
          </label>
          <input
            type="text"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="Short meaning..."
            className="bg-[#F5F2E8] text-[12px]"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-1">
        <button
          type="submit"
          className="btn-primary flex-1 py-2.5 text-[13px] font-semibold shadow-sm"
        >
          Save Aamaal
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary px-4 py-2.5 text-[12.5px] font-semibold"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}