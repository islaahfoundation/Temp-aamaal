import React from 'react';

export default function StoryCard({ storyTitle, currentLessonObj, totalLessons = 6, onOpenStory }) {
  const progressPercent = Math.min(100, Math.round((currentLessonObj.lesson / totalLessons) * 100));

  return (
    <div onClick={onOpenStory} className="relative cursor-pointer rounded-[16px] bg-[#F5F2E6] border border-white/90 shadow-soft-card p-2 flex items-center space-x-3 overflow-hidden active:scale-[0.99] transition">
      <div className="relative z-10 w-[86px] h-[48px] rounded-[10px] overflow-hidden shrink-0 shadow-sm bg-[#DFDEC9]">
        <img alt={storyTitle} src="./img/reading-photo.png" onError={(e) => { e.currentTarget.style.display = 'none'; }} className="w-full h-full object-cover" />
      </div>
      <div className="relative z-10 flex-1 min-w-0">
        <h4 className="font-serif text-[14.5px] font-semibold text-[#0D4A2E] leading-tight truncate">{storyTitle}</h4>
        <p className="text-[11px] text-[#4A5D50] truncate mt-0.5">{currentLessonObj.subtitle}</p>
        <div className="w-full h-[5px] rounded-full bg-[#DEDCCF] mt-1.5 overflow-hidden">
          <div className="h-full rounded-full bg-[#1C643C] transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
      <div className="relative z-10 pr-1 text-[#0D4A2E]">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </div>
    </div>
  );
}
