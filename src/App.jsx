import React, { useState, useRef } from 'react';
import { useAamaalState } from './hooks/useAamaalState';
import { triggerHaptic } from './utils/haptics';
import AppRouter from './router';
import BottomNavigation from './components/BottomNavigation';
import { ReaderModal, ToastPill } from './components/ConfirmationDialog';

export default function App() {
  const { state, updateState, resetAll } = useAamaalState();
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalContext, setModalContext] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(''), 2100);
  };

  const handleNavigateTab = (tabName, optionalFilter = null) => {
    triggerHaptic(10);
    if (optionalFilter) updateState({ activeDuaFilter: optionalFilter });
    setActiveTab(tabName);
  };

  return (
    <div id="app-shell" className="relative w-full max-w-[430px] mx-auto h-[100dvh] max-h-[100dvh] bg-[#F5F2E8] md:rounded-[36px] md:h-[96dvh] md:max-h-[890px] md:shadow-[0_25px_70px_rgba(0,0,0,0.65)] md:border-[5px] md:border-[#24382c] overflow-hidden flex flex-col justify-between">
      <div id="main-viewport" className="relative flex-1 min-h-0 w-full overflow-hidden flex flex-col">
        <AppRouter
          activeTab={activeTab}
          state={state}
          searchQuery={searchQuery}
          updateState={updateState}
          onNavigateTab={handleNavigateTab}
          onSearchDuas={(q) => { setSearchQuery(q); updateState({ activeDuaFilter: 'all' }); setActiveTab('duas'); }}
          onOpenModal={(item, type = 'dua') => { triggerHaptic(15); setModalContext({ item, type }); }}
          onToggleBookmark={(id) => {
            updateState((prev) => ({
              ...prev,
              savedDuaIds: prev.savedDuaIds.includes(id) ? prev.savedDuaIds.filter((x) => x !== id) : [...prev.savedDuaIds, id]
            }));
            showToast('Bookmarks updated');
          }}
          onToggleReminders={() => {
            triggerHaptic(15);
            const nextVal = state.remindersCount > 0 ? 0 : 1;
            updateState({ remindersCount: nextVal });
            showToast(nextVal ? 'Thursday Reminder Active' : 'Reminder Paused');
          }}
          onResetAll={() => { resetAll(); setActiveTab('home'); showToast('All data reset'); }}
          onShowToast={showToast}
        />
      </div>
      <BottomNavigation activeTab={activeTab} onChangeTab={handleNavigateTab} />
      <ReaderModal
        context={modalContext}
        onClose={() => setModalContext(null)}
        onCompleteSession={(ctx) => {
          triggerHaptic([20, 40, 20]);
          updateState((prev) => ({
            ...prev,
            sessionsCount: prev.sessionsCount + 1,
            storyLesson: ctx?.type === 'story' ? (prev.storyLesson < 6 ? prev.storyLesson + 1 : 1) : prev.storyLesson
          }));
          setModalContext(null);
          showToast('Session recorded! Progress updated');
        }}
        onToggleBookmark={(id) => {
          updateState((prev) => ({
            ...prev,
            savedDuaIds: prev.savedDuaIds.includes(id) ? prev.savedDuaIds.filter((x) => x !== id) : [...prev.savedDuaIds, id]
          }));
          showToast('Bookmarks updated');
        }}
      />
      <ToastPill message={toastMessage} />
    </div>
  );
}
