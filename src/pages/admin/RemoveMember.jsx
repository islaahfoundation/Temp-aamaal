//Handles removing a member from the circle, automatically warning if a Core Member also has dependent family profiles that will be removed along with their recitation logs (matching your index.html cascading removal logic).

import React from 'react';

export default function RemoveMember({
  member,
  dependentFamilyCount = 0,
  logCount = 0,
  onConfirmRemove,
  onCancel,
}) {
  if (!member) return null;

  return (
    <div className="card rounded-[18px] p-4 bg-[#E5DEC9] border border-[#c45d55]/40 space-y-2.5 fade-in">
      <div className="flex items-start justify-between">
        <div>
          <span className="px-2 py-0.5 rounded-full bg-[#6B2D26] text-white text-[9.5px] font-bold uppercase tracking-wider">
            Confirm Removal
          </span>
          <h4 className="font-serif text-[16.5px] font-semibold text-[#6B2D26] mt-1">
            🗑️ Remove {member.name}?
          </h4>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-[#6B2D26] font-bold text-xs"
          >
            ✕
          </button>
        )}
      </div>

      <p className="text-[12px] text-[#4A2520] leading-relaxed">
        {member.isPrimary ? (
          <>
            ⚠️ Removing Core Member <strong>{member.name}</strong>
            {dependentFamilyCount > 0
              ? ` along with their ${dependentFamilyCount} linked family profile(s)`
              : ''}{' '}
            will also delete their <strong>{logCount}</strong> logged recitation entries.
          </>
        ) : (
          <>
            Remove family profile <strong>{member.name}</strong> and their{' '}
            <strong>{logCount}</strong> logged recitation entries?
          </>
        )}
      </p>

      <div className="flex items-center space-x-2 pt-1">
        <button
          type="button"
          onClick={() => {
            try {
              if (navigator.vibrate) navigator.vibrate([25, 40, 25]);
            } catch (_) {}
            if (onConfirmRemove) onConfirmRemove(member.id);
          }}
          className="flex-1 py-2 rounded-xl bg-[#6B2D26] text-white text-[12px] font-bold shadow-sm"
        >
          Yes, Remove Member
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl bg-[#F5F2E8] text-primary text-[12px] font-semibold border border-[#D5D2BE]"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}