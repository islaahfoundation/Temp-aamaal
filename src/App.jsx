import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAamaalState } from './hooks/useAamaalState';
import { triggerHaptic } from './utils/haptics';
import AppRouter from './router';
import BottomNavigation from './components/BottomNavigation';
import { ReaderModal, ToastPill } from './components/ConfirmationDialog';
import GlobalAlarmWatcher from './components/GlobalAlarmWatcher';
import { initPowerSync } from './lib/powersync';

const MAX_HISTORY_LENGTH = 25;

export default function App() {
  const { state, updateState, resetAll } = useAamaalState();
  const [activeTab, setActiveTab] = useState(() =>
    localStorage.getItem('aamaal_onboarded') === 'true' ? 'home' : 'onboarding'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [modalContext, setModalContext] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const toastTimerRef = useRef(null);
  const tabHistoryRef = useRef([activeTab]);
  const activeTabRef = useRef(activeTab);
  const modalOpenRef = useRef(false);

  // Inside App():
useEffect(() => {
  initPowerSync().catch((err) => console.error('PowerSync init failed:', err));
}, []);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    modalOpenRef.current = Boolean(modalContext);
  }, [modalContext]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(''), 2100);
  }, []);

  const handleNavigateTab = useCallback(
    (tabName, optionalFilter = null) => {
      triggerHaptic(10);
      if (optionalFilter) updateState({ activeDuaFilter: optionalFilter });

      if (tabName !== activeTabRef.current) {
        tabHistoryRef.current = [...tabHistoryRef.current, tabName].slice(-MAX_HISTORY_LENGTH);
        try {
          window.history.pushState({ appTab: tabName }, '');
        } catch (_) {}
      }
      setActiveTab(tabName);
    },
    [updateState]
  );

  // Unified step-back used by both in-app back buttons and hardware back navigation
  const handleGoBack = useCallback(() => {
    triggerHaptic(8);
    if (tabHistoryRef.current.length > 1) {
      tabHistoryRef.current = tabHistoryRef.current.slice(0, -1);
      const prevTab = tabHistoryRef.current[tabHistoryRef.current.length - 1] || 'home';
      setActiveTab(prevTab);
      return true;
    }

    if (activeTabRef.current !== 'home' && activeTabRef.current !== 'onboarding') {
      tabHistoryRef.current = ['home'];
      setActiveTab('home');
      return true;
    }

    return false;
  }, []);

  const handleToggleBookmark = useCallback(
    (id) => {
      updateState((prev) => ({
        ...prev,
        savedDuaIds: prev.savedDuaIds.includes(id)
          ? prev.savedDuaIds.filter((x) => x !== id)
          : [...prev.savedDuaIds, id],
      }));
      showToast('Bookmarks updated');
    },
    [updateState, showToast]
  );

  const handleSearchDuas = useCallback(
    (q) => {
      setSearchQuery(q);
      updateState({ activeDuaFilter: 'all' });
      handleNavigateTab('duas');
    },
    [updateState, handleNavigateTab]
  );

  const handleOpenModal = useCallback((item, type = 'dua') => {
    triggerHaptic(15);
    setModalContext({ item, type });
    try {
      window.history.pushState({ appModal: true }, '');
    } catch (_) {}
  }, []);

  const handleCompleteSession = useCallback(
    (ctx) => {
      triggerHaptic([20, 40, 20]);
      updateState((prev) => ({
        ...prev,
        sessionsCount: prev.sessionsCount + 1,
        storyLesson:
          ctx?.type === 'story'
            ? prev.storyLesson < 6
              ? prev.storyLesson + 1
              : 1
            : prev.storyLesson,
      }));
      setModalContext(null);
      showToast('Session recorded! Progress updated');
    },
    [updateState, showToast]
  );

  const handleResetAll = useCallback(() => {
    localStorage.removeItem('aamaal_onboarded');
    resetAll();
    tabHistoryRef.current = ['onboarding'];
    setActiveTab('onboarding');
    showToast('All data reset');
  }, [resetAll, showToast]);

  // Intercept Mobile Hardware / Swipe Back Button
  useEffect(() => {
    try {
      window.history.replaceState({ appTab: activeTabRef.current, guard: true }, '');
      window.history.pushState({ appTab: activeTabRef.current }, '');
    } catch (_) {}

    const handlePopState = () => {
      if (modalOpenRef.current) {
        setModalContext(null);
        try {
          window.history.pushState({ appTab: activeTabRef.current }, '');
        } catch (_) {}
        return;
      }

      const steppedBack = handleGoBack();
      if (!steppedBack || activeTabRef.current === 'home') {
        try {
          window.history.pushState({ appTab: activeTabRef.current }, '');
        } catch (_) {}
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handleGoBack]);

  return (
    <div
      id="app-shell"
      className="relative w-full max-w-[430px] mx-auto h-[100dvh] max-h-[100dvh] bg-[#F5F2E8] md:rounded-[36px] md:h-[96dvh] md:max-h-[890px] md:shadow-[0_25px_70px_rgba(0,0,0,0.65)] md:border-[5px] md:border-[#24382c] overflow-hidden flex flex-col justify-between"
    >
      <div
        id="main-viewport"
        className="relative flex-1 min-h-0 w-full overflow-hidden flex flex-col"
      >
        <AppRouter
          activeTab={activeTab}
          state={state}
          searchQuery={searchQuery}
          updateState={updateState}
          onNavigateTab={handleNavigateTab}
          onGoBack={handleGoBack}
          onSearchDuas={handleSearchDuas}
          onOpenModal={handleOpenModal}
          onToggleBookmark={handleToggleBookmark}
          onResetAll={handleResetAll}
          onShowToast={showToast}
        />
      </div>

      {activeTab !== 'onboarding' && activeTab !== 'admin' && (
        <BottomNavigation activeTab={activeTab} onChangeTab={handleNavigateTab} />
      )}

      <ReaderModal
        context={modalContext}
        onClose={() => setModalContext(null)}
        onCompleteSession={handleCompleteSession}
        onToggleBookmark={handleToggleBookmark}
      />
      <ToastPill message={toastMessage} />
      <GlobalAlarmWatcher onShowToast={showToast} />
    </div>
  );
}