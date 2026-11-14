import React from 'react';

export function ReaderModal({
  context,
  onClose,
  onCompleteSession,
  onToggleBookmark,
}) {
  if (!context || !context.item) return null;

  const { item } = context;
  const reflectionText = item.reflection || item.shortDesc || '';

  return (
    <div
      id="reader-modal"
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="modal-sheet no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 rounded-full bg-[#C9C5B1] mx-auto mb-3" />

        <div className="flex items-start justify-between">
          <div>
            <span className="badge-pill">
              {item.badge || 'SPIRITUAL LESSON'}
            </span>
            <h3 className="font-serif text-[21px] font-semibold text-[#0D4A2E] mt-1">
              {item.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EAE8D7] flex items-center justify-center text-[#0D4A2E]"
          >
            ✕
          </button>
        </div>

        {/* Arabic Script Card */}
        <div className="mt-3 rounded-[18px] bg-gradient-to-br from-[#165534] to-[#08351D] p-4 text-center text-white shadow-md">
          <p
            className="font-arabic text-[24px] leading-[1.8] text-[#F0D58C]"
            dir="rtl"
          >
            {item.arabic}
          </p>
        </div>

        {/* Translation & Reflection (No Arabic Transliteration) */}
        <div className="mt-3 space-y-2.5">
          <div className="rounded-xl bg-white/75 p-3 border border-[#E2DFCE]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#526B5C]">
              Translation
            </span>
            <p className="text-[13px] text-[#1A3826] mt-0.5 leading-relaxed">
              {item.translation}
            </p>
            {item.romanUrdu && (
              <p className="text-[12.5px] text-[#0D4A2E] mt-1.5 pt-1.5 border-t border-[#E2DFCE] leading-relaxed">
                {item.romanUrdu}
              </p>
            )}
          </div>

          {reflectionText && (
            <div className="rounded-xl bg-[#EAE8D7] p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#526B5C]">
                Reflection &amp; Lesson
              </span>
              <p className="text-[13px] text-[#0D4A2E] mt-0.5 leading-relaxed">
                {reflectionText}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => onCompleteSession(context)}
            className="flex-1 py-2.5 rounded-full bg-[#0D4A2E] text-white font-medium text-[13px] shadow-md active:scale-95 transition"
          >
            ✓ Mark Recited (+1 Session)
          </button>
          <button
            type="button"
            onClick={() => onToggleBookmark(item.id)}
            className="px-4 py-2.5 rounded-full bg-[#EAE8D7] text-[#0D4A2E] font-medium text-[13px] border border-[#D0CCB6] active:scale-95 transition"
          >
            Bookmark
          </button>
        </div>
      </div>
    </div>
  );
}

export function ToastPill({ message }) {
  return (
    <div
      id="toast-pill"
      className={`toast-pill ${message ? 'opacity-100' : 'opacity-0'}`}
    >
      <span className="w-2 h-2 rounded-full bg-[#DFB75A]" />
      <span id="toast-text">{message || 'Progress updated'}</span>
    </div>
  );
}