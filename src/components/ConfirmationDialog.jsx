import React from 'react';

export function ReaderModal({ context, onClose, onCompleteSession, onToggleBookmark }) {
  if (!context || !context.item) return null;
  const { item } = context;

  return (
    <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-end justify-center">
      <div className="w-full bg-[#F5F2E8] rounded-t-[28px] p-5 max-h-[84%] overflow-y-auto shadow-2xl border-t border-white">
        <div className="w-10 h-1.5 rounded-full bg-[#C9C5B1] mx-auto mb-3"></div>
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#DCE3C8] text-[#0D4A2E] text-[10px] font-bold uppercase tracking-wider">
              {item.badge || 'SPIRITUAL LESSON'}
            </span>
            <h3 className="font-serif text-[21px] font-semibold text-[#0D4A2E] mt-1">
              {item.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EAE8D7] flex items-center justify-center text-[#0D4A2E]"
          >
            ✕
          </button>
        </div>

        <div className="mt-3 rounded-[18px] bg-gradient-to-br from-[#165534] to-[#08351D] p-4 text-center text-white shadow-md">
          <p className="font-arabic text-[24px] leading-[1.8] text-[#F0D58C]" dir="rtl">
            {item.arabic}
          </p>
        </div>

        <div className="mt-3 space-y-2.5">
          <div className="rounded-xl bg-[#EAE8D7] p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#526B5C]">
              Transliteration / Lesson
            </span>
            <p className="text-[13px] italic text-[#0D4A2E] mt-0.5 leading-relaxed">
              {item.translit}
            </p>
          </div>
          <div className="rounded-xl bg-white/75 p-3 border border-[#E2DFCE]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#526B5C]">
              Translation & Reflection
            </span>
            <p className="text-[13px] text-[#1A3826] mt-0.5 leading-relaxed">
              {item.translation}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-2.5">
          <button
            onClick={() => onCompleteSession(context)}
            className="flex-1 py-2.5 rounded-full bg-[#0D4A2E] text-white font-medium text-[13px] shadow-md active:scale-95 transition"
          >
            ✓ Mark Recited (+1 Session)
          </button>
          <button
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
      className={`pointer-events-none transition-all duration-300 absolute top-3 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full bg-[#07361D] text-white text-[11.5px] font-medium shadow-xl border border-[#C99E4C]/40 flex items-center space-x-2 whitespace-nowrap ${
        message ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <span className="w-2 h-2 rounded-full bg-[#DFB75A]"></span>
      <span>{message}</span>
    </div>
  );
}
