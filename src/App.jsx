import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAamaalState } from './hooks/useAamaalState';
import { triggerHaptic } from './utils/haptics';
import AppRouter from './router';
import BottomNavigation from './components/BottomNavigation';
import { ReaderModal, ToastPill } from './components/ConfirmationDialog';
import GlobalAlarmWatcher from './components/GlobalAlarmWatcher';

export default function App() {
  const { state, updateState, resetAll } = useAamaalState();
  const [activeTab, setActiveTab] = useState(() =>
    localStorage.getItem('aamaal_onboarded') === 'true' ? 'home' : 'onboarding'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [modalContext, setModalContext] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef(null);

  // Navigation history stack for Mobile Back Button support
  const tabHistoryRef = useRef([activeTab]);
  const activeTabRef = useRef(activeTab);
  const modalOpenRef = useRef(false);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    modalOpenRef.current = Boolean(modalContext);
  }, [modalContext]);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMessage(''), 2100);
  }, []);

  // Push a history entry whenever navigating to a new tab
  const handleNavigateTab = useCallback(
    (tabName, optionalFilter = null) => {
      triggerHaptic(10);
      if (optionalFilter) updateState({ activeDuaFilter: optionalFilter });

      if (tabName !== activeTabRef.current) {
        tabHistoryRef.current = [...tabHistoryRef.current, tabName];
        try {
          window.history.pushState({ appTab: tabName }, '');
        } catch (_) {}
      }
      setActiveTab(tabName);
    },
    [updateState]
  );

  // Intercept Mobile Hardware / Swipe Back Button
  useEffect(() => {
    // Seed an initial buffer entry so the first back press never closes the app/preview
    try {
      window.history.replaceState({ appTab: activeTabRef.current, guard: true }, '');
      window.history.pushState({ appTab: activeTabRef.current }, '');
    } catch (_) {}

    const handlePopState = () => {
      // 1. If a reader modal is open, close it first
      if (modalOpenRef.current) {
        setModalContext(null);
        try {
          window.history.pushState({ appTab: activeTabRef.current }, '');
        } catch (_) {}
        return;
      }

      // 2. Step back to the previously visited tab/page
      if (tabHistoryRef.current.length > 1) {
        tabHistoryRef.current = tabHistoryRef.current.slice(0, -1);
        const previousTab =
          tabHistoryRef.current[tabHistoryRef.current.length - 1] || 'home';
        setActiveTab(previousTab);
        return;
      }

      // 3. If not on Home, go to Home instead of exiting
      if (
        activeTabRef.current !== 'home' &&
        activeTabRef.current !== 'onboarding'
      ) {
        tabHistoryRef.current = ['home'];
        setActiveTab('home');
        try {
          window.history.pushState({ appTab: 'home' }, '');
        } catch (_) {}
        return;
      }

      // 4. Already at Home: re-push guard state so the preview/PWA does not close
      try {
        window.history.pushState({ appTab: activeTabRef.current }, '');
      } catch (_) {}
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
          onSearchDuas={(q) => {
            setSearchQuery(q);
            updateState({ activeDuaFilter: 'all' });
            handleNavigateTab('duas');
          }}
          onOpenModal={(item, type = 'dua') => {
            triggerHaptic(15);
            setModalContext({ item, type });
            try {
              window.history.pushState({ appModal: true }, '');
            } catch (_) {}
          }}
          onToggleBookmark={(id) => {
            updateState((prev) => ({
              ...prev,
              savedDuaIds: prev.savedDuaIds.includes(id)
                ? prev.savedDuaIds.filter((x) => x !== id)
                : [...prev.savedDuaIds, id],
            }));
            showToast('Bookmarks updated');
          }}
          onToggleReminders={() => {
            triggerHaptic(15);
            const nextVal = state.remindersCount > 0 ? 0 : 1;
            updateState({ remindersCount: nextVal });
            showToast(nextVal ? 'Thursday Reminder Active' : 'Reminder Paused');
          }}
          onResetAll={() => {
            localStorage.removeItem('aamaal_onboarded');
            resetAll();
            tabHistoryRef.current = ['onboarding'];
            setActiveTab('onboarding');
            showToast('All data reset');
          }}
          onShowToast={showToast}
        />
      </div>

      {activeTab !== 'onboarding' && activeTab !== 'admin' && (
        <BottomNavigation activeTab={activeTab} onChangeTab={handleNavigateTab} />
      )}

      <ReaderModal
        context={modalContext}
        onClose={() => setModalContext(null)}
        onCompleteSession={(ctx) => {
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
        }}
        onToggleBookmark={(id) => {
          updateState((prev) => ({
            ...prev,
            savedDuaIds: prev.savedDuaIds.includes(id)
              ? prev.savedDuaIds.filter((x) => x !== id)
              : [...prev.savedDuaIds, id],
          }));
          showToast('Bookmarks updated');
        }}
      />
      <ToastPill message={toastMessage} />
      <GlobalAlarmWatcher onShowToast={showToast} />
    </div>
  );
}