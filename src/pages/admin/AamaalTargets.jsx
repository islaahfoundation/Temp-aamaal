/*Allows admins to quickly inspect and adjust the daily target 
counts (e.g., 313 for Durood Shareef, 1 for Surah Mulk, 100 for 
Istighfar) across all Circle Aamaal. */

import React, { useState } from 'react';

export default function AamaalTargets({
  aamaalList = [],
  onUpdateTarget,
}) {
  const [editingId, setEditingId] = useState(null);
  const [targetInput, setTargetInput] = useState('');

  const handleSave = (id) => {
    const val = Number(targetInput);
    if (isNaN(val) || val <= 0) return;
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}
    if (onUpdateTarget) onUpdateTarget(id, val);
    setEditingId(null);
  };

  return (
    <div className="card rounded-[20px] p-4 space-y-2.5">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
          Target Configuration
        </span>
        <h3 className="font-serif text-[16.5px] font-semibold text-primary">
          Daily Aamaal Target Counts
        </h3>
      </div>

      <div className="divide-y divide-[#E2DEC9]">
        {aamaalList.map((item) => {
          const isEditing = editingId === item.id;
          return (
            <div key={item.id} className="py-2.5 first:pt-1 last:pb-0 flex items-center justify-between gap-2">
              <div>
                <h4 className="font-serif text-[14px] font-semibold text-primary">
                  {item.name}
                </h4>
                <p className="text-[11px] text-secondary">
                  Current Daily Target:{' '}
                  <strong className="text-[#135332]">
                    {Number(item.target || 0).toLocaleString('en-US')}/day
                  </strong>
                </p>
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(item.id);
                    setTargetInput(String(item.target || 100));
                  }}
                  className="px-3 py-1 rounded-lg bg-[#EAE8D7] text-primary text-[11px] font-semibold border border-[#D5D2BE]"
                >
                  Change Target
                </button>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    min="1"
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                    className="w-20 bg-[#F5F2E8] text-primary text-[12px] font-bold py-1 px-2 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleSave(item.id)}
                    className="px-2.5 py-1 rounded-lg bg-[#0D4A2E] text-white text-[11px] font-bold"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-2 py-1 rounded-lg bg-[#EAE8D7] text-secondary text-[11px]"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}