import React, { useState } from 'react';
import CompletionConfirmation from './CompletionConfirmation';
import EditCount from './EditCount';
import UndoCount from './UndoCount';

export default function DailyCompletion({
  aamaal,
  friendlyDateLabel = 'Today',
  loggedCount = 0,
  onMarkRecited,
  onUpdateCount,
  onUndoCount,
}) {
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showUndoConfirm, setShowUndoConfirm] = useState(false);

  if (!aamaal) return null;

  const isCompleted = loggedCount > 0;

  const handleMarkDone = () => {
    try {
      if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
    } catch (_) {}
    if (onMarkRecited) onMarkRecited(Number(aamaal.target || 1));
  };

  return (
    <div className="card-progress rounded-[24px] p-5 text-center shadow-progress-card border border-white/15 mb-4">
      {/* Selected Date Pill */}
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 text-[#F0D58C] text-[11px] font-bold tracking-wide mb-2">
        <span>📅</span>
        <span>Logging for: {friendlyDateLabel}</span>
      </div>

      {/* Arabic Salam */}
      <p className="font-arabic text-[21px] text-white mb-2" dir="rtl">
        السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ
      </p>

      {/* Target Question */}
      <p className="text-[13.5px] text-white/90 leading-relaxed max-w-[320px] mx-auto mb-4">
        Have you recited your daily target of{' '}
        <strong className="text-[#F0D58C] font-bold">
          {Number(aamaal.target || 0).toLocaleString('en-US')}
        </strong>{' '}
        times <strong className="text-white font-semibold">{aamaal.name}</strong> on{' '}
        <span className="underline decoration-[#C99E4C]">{friendlyDateLabel}</span>?
      </p>

      {/* Not Recited State */}
      {!isCompleted ? (
        <div>
          <button
            type="button"
            onClick={handleMarkDone}
            className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#F0D58C] to-[#DFB75A] text-[#07361D] font-bold text-[14.5px] shadow-lg active:scale-95 transition min-w-[205px]"
          >
            ✓ Mark as Recited
          </button>
        </div>
      ) : (
        /* Completed State */
        <div className="space-y-3">
          <CompletionConfirmation
            dateLabel={friendlyDateLabel}
            count={loggedCount}
          />

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setShowEditPanel(!showEditPanel);
                setShowUndoConfirm(false);
              }}
              className="px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-[12px] font-semibold"
            >
              {showEditPanel ? 'Close Editor' : '+ Add / Edit Count'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowUndoConfirm(!showUndoConfirm);
                setShowEditPanel(false);
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#6B2D26]/60 border border-[#fca5a5]/40 text-[#fecaca] text-[12px] font-semibold"
            >
              Undo
            </button>
          </div>

          {showEditPanel && (
            <EditCount
              currentCount={loggedCount}
              onAddQuick={(addVal) => {
                onUpdateCount(loggedCount + addVal);
              }}
              onSaveExact={(exactVal) => {
                onUpdateCount(exactVal);
                setShowEditPanel(false);
              }}
            />
          )}

          {showUndoConfirm && (
            <UndoCount
              dateLabel={friendlyDateLabel}
              aamaalName={aamaal.name}
              onConfirmUndo={() => {
                setShowUndoConfirm(false);
                if (onUndoCount) onUndoCount();
              }}
              onCancel={() => setShowUndoConfirm(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}