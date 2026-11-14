import React, { useState, useEffect } from 'react';

export default function ManualCountEntry({ initialValue = 0, onSave }) {
  const [value, setValue] = useState(String(initialValue));

  useEffect(() => {
    setValue(String(initialValue));
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(value);
    if (isNaN(num) || num < 0) return;
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}
    if (onSave) onSave(num);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter total (e.g. 500)"
        className="flex-1 rounded-xl bg-[#F5F2E8] text-[#0D4A2E] px-3 py-2 text-[13px] font-semibold border border-[#C99E4C]/50"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-xl bg-[#DFB75A] text-[#07361D] font-bold text-[12.5px] shrink-0 shadow-sm"
      >
        Save
      </button>
    </form>
  );
}