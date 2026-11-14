import React from 'react';

export default function DuaCard({ dua, isSaved, onToggleBookmark, onOpenReader, variant = 'list' }) {
  if (variant === 'featured') {
    return (
      <div className="relative rounded-[18px] bg-[#F3EFE2] border border-white/90 shadow-soft-card overflow-hidden flex h-[112px]">
        <img alt="" src="./img/featured-bg.png" onError={(e) => { e.currentTarget.style.display = 'none'; }} className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" />
        <div className="w-[40%] h-full relative overflow-hidden shrink-0 z-10 bg-[#DCE3C8]/50">
          <img alt="Featured Dua" src="./img/featured-photo.png" onError={(e) => { e.currentTarget.style.display = 'none'; }} className="w-full h-full object-cover" />
        </div>
        <div className="w-[60%] py-2 px-3 flex flex-col justify-center relative z-10">
          <span className="inline-block self-start px-2 py-0.5 rounded-full bg-[#DCE3C8] text-[#0D4A2E] text-[9px] font-bold tracking-[0.06em] uppercase">{dua.badge}</span>
          <h4 className="font-serif text-[16px] leading-[1.12] font-semibold text-[#0D4A2E] mt-1">{dua.title}</h4>
          <p className="text-[11px] text-[#223D2C] mt-0.5 leading-tight truncate">{dua.shortDesc}</p>
          <button onClick={() => onOpenReader(dua, 'dua')} className="mt-1.5 self-start inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#135332] hover:bg-[#0D4A2E] text-white text-[11.5px] font-medium shadow-sm active:scale-95 transition">
            <span>Read dua</span>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[18px] bg-[#F3EFE2] border border-white/90 shadow-soft-card p-3.5">
      <div className="flex items-start justify-between">
        <span className="px-2 py-0.5 rounded-full bg-[#DCE3C8] text-[#0D4A2E] text-[9.5px] font-bold uppercase">{dua.badge}</span>
        <button onClick={() => onToggleBookmark(dua.id)} className="text-[#0D4A2E] p-0.5">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isSaved ? '#0D4A2E' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
      <h4 className="font-serif text-[17px] font-semibold text-[#0D4A2E] mt-1">{dua.title}</h4>
      <p className="font-arabic text-[20px] text-[#135332] text-right my-1.5" dir="rtl">{dua.arabic}</p>
      <p className="text-[12px] text-[#2F4739] line-clamp-2">{dua.translation}</p>
      <div className="mt-2 pt-2 border-t border-[#E2DEC9] flex justify-end">
        <button onClick={() => onOpenReader(dua, 'dua')} className="px-3 py-1 rounded-full bg-[#135332] text-white text-[11.5px] font-medium">
          Read & Recite ›
        </button>
      </div>
    </div>
  );
}
