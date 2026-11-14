import React from 'react';

export default function UndoCount({
  dateLabel = 'Today',
  aamaalName = 'Aamaal',
  onConfirmUndo,
  onCancel,
}) {
  return (
    <div className="mt-2.5 p-3 rounded-[14px] bg-black/30 border border-[#fca5a5]/40 text-center fade-in">
      <p className="text-[12px] text-white/90">
        Reset your <strong className="text-[#F0D58C]">{aamaalName}</strong> count for{' '}
        <strong>{dateLabel}</strong> to 0?
      </p>
      <div className="flex items-center justify-center gap-2.5 mt-2">
        <button
          type="button"
          onClick={() => {
            try {
              if (navigator.vibrate) navigator.vibrate(15);
            } catch (_) {}
            if (onConfirmUndo) onConfirmUndo();
          }}
          className="px-3.5 py-1 rounded-full bg-[#c45d55] text-white text-[11.5px] font-semibold"
        >
          Yes, Undo
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3.5 py-1 rounded-full bg-white/15 text-white text-[11.5px] font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}