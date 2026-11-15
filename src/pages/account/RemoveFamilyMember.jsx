import React from 'react';

export default function RemoveFamilyMember({
  member,
  logCount = 0,
  onResetMemberLogs,
  onConfirmRemoveMember,
  onCancel,
}) {
  if (!member) return null;

  return (
    <div className="card rounded-[20px] p-4 bg-[#E5DEC9] border border-[#c45d55]/40 space-y-3 fade-in">
      <div className="flex items-start justify-between">
        <div>
          <span className="px-2 py-0.5 rounded-full bg-[#6B2D26] text-white text-[9.5px] font-bold uppercase tracking-wider">
            Data &amp; Profile Action
          </span>
          <h4 className="font-serif text-[17px] font-semibold text-[#6B2D26] mt-1">
            Manage {member.flag || '🇮🇳'} {member.name}
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
        This profile currently has <strong>{logCount}</strong> logged Aamaal days. You can reset their recitation counts to 0 or remove this family member profile completely.
      </p>

      <div className="space-y-2 pt-1">
        {onResetMemberLogs && (
          <button
            type="button"
            onClick={() => {
              try {
                if (navigator.vibrate) navigator.vibrate(20);
              } catch (_) {}
              onResetMemberLogs(member.id);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#F5F2E8] border border-[#6B2D26]/30 text-[#6B2D26] text-[12.5px] font-semibold"
          >
            🔄 Reset All {logCount} Recitation Logs to 0
          </button>
        )}

        {!member.isPrimary && onConfirmRemoveMember && (
          <button
            type="button"
            onClick={() => {
              try {
                if (navigator.vibrate) navigator.vibrate([25, 40, 25]);
              } catch (_) {}
              onConfirmRemoveMember(member.id);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#6B2D26] text-white text-[12.5px] font-semibold shadow-sm"
          >
            🗑️ Remove {member.name} Profile &amp; Logs
          </button>
        )}

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2 text-[12px] font-semibold text-secondary"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}