import React from 'react';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import ProgressCard from '../../components/ProgressCard';
import DuaCard from '../../components/DuaCard';
import StoryCard from '../../components/StoryCard';
import duasData from '../../data/duas.json';
import storiesData from '../../data/stories.json';

export default function HomePage({ state, onNavigateTab, onSearchDuas, onOpenModal, onToggleReminders, onShowToast }) {
  const featuredDua = duasData[0];
  const thursdaySalawatDua = duasData[2];
  const mainStory = storiesData[0];
  const currentLessonObj = mainStory.lessons.find((l) => l.lesson === state.storyLesson) || mainStory.lessons[1];

  const handleOpenStory = () => {
    onOpenModal({
      id: mainStory.id,
      badge: `LESSON ${currentLessonObj.lesson} OF ${mainStory.lessons.length}`,
      title: mainStory.title,
      arabic: currentLessonObj.arabic,
      translit: currentLessonObj.translit,
      translation: currentLessonObj.translation
    }, 'story');
  };

  return (
    <section className="relative w-full h-full overflow-y-auto no-scrollbar flex flex-col pb-6">
      <div className="relative w-full shrink-0 pt-6 pb-4 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img alt="" src="./img/header.png" onError={(e) => { e.currentTarget.style.display = 'none'; }} className="w-full h-full object-cover object-right-top transition-opacity duration-300" />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#F5F2E8] via-[#F5F2E8]/80 to-transparent"></div>
        </div>
        <Header
          userName={state.userName}
          onOpenNotifications={() => onShowToast('Reminder: 6 Salawat every Thursday night')}
          onOpenSettings={() => onNavigateTab('more')}
        />
        <SearchBar onSearch={onSearchDuas} />
      </div>

      <ProgressCard
        state={state}
        onClickDhikr={() => onNavigateTab('tasbih')}
        onClickSessions={() => onNavigateTab('duas')}
        onToggleReminders={onToggleReminders}
        onViewDetails={() => onShowToast(`Today: ${state.dhikrCount} Dhikr • ${state.sessionsCount} Sessions`)}
      />

      <div className="px-4 shrink-0 mt-6">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h3 className="font-serif text-[16px] font-semibold text-[#0D4A2E]">Quick Actions</h3>
          <button onClick={() => onNavigateTab('duas')} className="flex items-center space-x-0.5 text-[11.5px] font-medium text-[#123824]">
            <span>See all</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => onNavigateTab('tasbih')} className="flex flex-col items-center justify-center h-[58px] rounded-[16px] bg-[#EAE8D7] border border-white/80 shadow-quick-btn active:scale-95 transition">
            <svg className="w-5 h-5 text-[#0D4A2E]" viewBox="0 0 28 28" fill="currentColor"><circle cx="14" cy="4.5" r="2"/><circle cx="19" cy="6.5" r="2"/><circle cx="21.5" cy="11" r="2"/><circle cx="20.5" cy="16.5" r="2"/><circle cx="16.5" cy="20" r="2"/><circle cx="11.5" cy="20" r="2"/><circle cx="7.5" cy="16.5" r="2"/><circle cx="6.5" cy="11" r="2"/><circle cx="9" cy="6.5" r="2"/><path d="M14 22v4" stroke="#0D4A2E" strokeWidth="2" strokeLinecap="round"/></svg>
            <span className="text-[11.5px] font-medium text-[#0D4A2E] mt-1">Tasbih</span>
          </button>
          <button onClick={() => onNavigateTab('duas', 'all')} className="flex flex-col items-center justify-center h-[58px] rounded-[16px] bg-[#EAE8D7] border border-white/80 shadow-quick-btn active:scale-95 transition">
            <svg className="w-5 h-5 text-[#0D4A2E]" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 19V9.5a1.5 1.5 0 0 0-3 0V15"/><path d="M10 11.5V8a1.5 1.5 0 0 0-3 0v8.5c0 3 2.5 5.5 5.5 5.5h1"/><path d="M15 19V9.5a1.5 1.5 0 0 1 3 0V15"/><path d="M18 11.5V8a1.5 1.5 0 0 1 3 0v8.5c0 3-2.5 5.5-5.5 5.5h-1"/></svg>
            <span className="text-[11.5px] font-medium text-[#0D4A2E] mt-1">Duas</span>
          </button>
          <button onClick={handleOpenStory} className="flex flex-col items-center justify-center h-[58px] rounded-[16px] bg-[#EAE8D7] border border-white/80 shadow-quick-btn active:scale-95 transition">
            <svg className="w-5 h-5 text-[#0D4A2E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            <span className="text-[11.5px] font-medium text-[#0D4A2E] mt-1">Stories</span>
          </button>
          <button onClick={() => onNavigateTab('duas', 'Saved')} className="relative flex flex-col items-center justify-center h-[58px] rounded-[16px] bg-[#EAE8D7] border border-white/80 shadow-quick-btn active:scale-95 transition">
            <svg className="w-5 h-5 text-[#0D4A2E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            <span className="text-[11.5px] font-medium text-[#0D4A2E] mt-1">Saved</span>
            {state.savedDuaIds.length > 0 && (
              <span className="absolute top-1.5 right-2 w-3.5 h-3.5 rounded-full bg-[#0D4A2E] text-white text-[9px] font-bold flex items-center justify-center">{state.savedDuaIds.length}</span>
            )}
          </button>
        </div>
      </div>

      <div className="px-4 shrink-0 mt-6">
        <DuaCard dua={featuredDua} variant="featured" onOpenReader={onOpenModal} />
      </div>

      <div className="px-4 shrink-0 mt-6">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <div className="flex items-center space-x-1.5">
            <svg className="w-4 h-4 text-[#0D4A2E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            <h3 className="font-serif text-[15.5px] font-semibold text-[#0D4A2E]">Continue Reading</h3>
          </div>
          <button onClick={handleOpenStory} className="flex items-center space-x-0.5 text-[11.5px] font-medium text-[#123824]">
            <span>See all</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
        <StoryCard storyTitle={mainStory.title} currentLessonObj={currentLessonObj} totalLessons={mainStory.lessons.length} onOpenStory={handleOpenStory} />
      </div>

      <div className="px-4 shrink-0 mt-6">
        <div onClick={() => onOpenModal(thursdaySalawatDua, 'dua')} className="cursor-pointer relative rounded-[16px] bg-gradient-to-r from-[#DFDEC9] via-[#E5E4D2] to-[#C9D2BA] border border-white/80 shadow-soft-card px-3 py-2 flex items-center justify-between overflow-hidden active:scale-[0.99] transition">
          <svg className="absolute right-0 bottom-0 h-full w-36 pointer-events-none" viewBox="0 0 200 72" fill="none"><g fill="#195B37" opacity="0.82"><rect x="88" y="34" width="3.5" height="38"/><path d="M88 34 L89.75 26 L91.5 34 Z"/><rect x="128" y="22" width="4" height="50"/><path d="M128 22 L130 13 L132 22 Z"/><path d="M98 54 C98 35 122 35 122 54 Z"/><path d="M72 60 C72 48 86 48 86 60 Z"/><path d="M135 58 C135 46 150 46 150 58 Z"/><rect x="65" y="54" width="125" height="18"/></g></svg>
          <div className="relative z-10 flex items-center space-x-2.5 pr-6">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[#0D4A2E] shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 15 15"></polyline></svg>
            </div>
            <div>
              <p className="text-[10.5px] font-medium text-[#194B2F] leading-none">Your reminder</p>
              <h4 className="font-serif text-[13px] font-bold text-[#0D4A2E] leading-tight mt-0.5">6 Salawat Recited Every Thursday Night</h4>
            </div>
          </div>
          <div className="relative z-10 text-[#0D4A2E]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </div>
      </div>
    </section>
  );
}
