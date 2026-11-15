/*Edits an existing Aamaal's name, Arabic text, translation, 
and daily target count */

import React, { useState, useEffect } from 'react';

export default function EditAamaal({ aamaal, onSaveAamaal, onCancel }) {
  const [name, setName] = useState('');
  const [arabic, setArabic] = useState('');
  const [translation, setTranslation] = useState('');
  const [target, setTarget] = useState('100');

  useEffect(() => {
    if (aamaal) {
      setName(aamaal.name || '');
      setArabic(aamaal.arabic || '');
      setTranslation(aamaal.translation || '');
      setTarget(String(aamaal.target || 100));
    }
  }, [aamaal]);

  if (!aamaal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericTarget = Number(target);
    if (!name.trim() || !arabic.trim() || isNaN(numericTarget) || numericTarget <= 0) {
      return;
    }

    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}

    if (onSaveAamaal) {
      onSaveAamaal(aamaal.id, {
        name: name.trim(),
        arabic: arabic.trim(),
        translation: translation.trim(),
        target: numericTarget,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card rounded-[20px] p-4 space-y-3 bg-[#EAE8D7] border border-[#0D4A2E]/30 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <span className="badge-pill">Editing Aamaal</span>
          <h3 className="font-serif text-[17px] font-semibold text-primary mt-1">
            ✏️ Edit: {aamaal.name}
          </h3>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-7 h-7 rounded-full bg-[#F5F2E8] flex items-center justify-center text-primary font-bold text-xs"
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
          className="bg-[#F5F2E8] text-[13px] font-semibold"
        />
      </div>

      <div>
        <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1">
          Arabic Text
        </label>
        <input
          type="text"
          required
          dir="rtl"
          value={arabic}
          onChange={(e) => setArabic(e.target.value)}
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
            className="bg-[#F5F2E8] text-[13px] font-bold"
          />
        </div>

        <div>
          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1">
            Translation
          </label>
          <input
            type="text"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="bg-[#F5F2E8] text-[12px]"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-1">
        <button
          type="submit"
          className="btn-primary flex-1 py-2.5 text-[13px] font-semibold"
        >
          Update Aamaal
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