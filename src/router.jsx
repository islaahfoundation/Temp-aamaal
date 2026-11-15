import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';

// Main App Tab & Feature Pages
import HomePage from './pages/home/HomePage';
import AamaalDashboard from './pages/aamaal/AamaalDashboard';
import TasbihPage from './pages/tasbih/TasbihPage';
import DuasHome from './pages/duas/DuasHome';
import FeelingsHome from './pages/feelings/FeelingsHome';
import SettingsPage from './pages/settings/SettingsPage';
import AccountDashboard from './pages/account/AccountDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// Onboarding Pages
import Splash from './pages/onboarding/Splash';
import Welcome from './pages/onboarding/Welcome';
import Purpose from './pages/onboarding/Purpose';
import TasbihIntro from './pages/onboarding/TasbihIntro';
import DuaIntro from './pages/onboarding/DuaIntro';
import StoriesIntro from './pages/onboarding/StoriesIntro';
import LanguageSelection from './pages/onboarding/LanguageSelection';
import Preferences from './pages/onboarding/Preferences';
import NotificationIntro from './pages/onboarding/NotificationIntro';
import NotificationPermission from './pages/onboarding/NotificationPermission';
import Authentication from './pages/onboarding/Authentication';
import AccountRecovery from './pages/onboarding/AccountRecovery';

// Maps URL-style paths or step names to onboarding keys
const PATH_TO_STEP_MAP = {
  '/': 'splash',
  'splash': 'splash',
  '/welcome': 'welcome',
  'welcome': 'welcome',
  '/onboarding/purpose': 'purpose',
  'purpose': 'purpose',
  '/onboarding/tasbih': 'tasbih-intro',
  'tasbih-intro': 'tasbih-intro',
  '/onboarding/duas': 'duas-intro',
  'duas-intro': 'duas-intro',
  '/onboarding/stories': 'stories-intro',
  'stories-intro': 'stories-intro',
  '/onboarding/language': 'language',
  'language': 'language',
  '/onboarding/preferences': 'preferences',
  'preferences': 'preferences',
  '/onboarding/notifications': 'notifications-intro',
  'notifications-intro': 'notifications-intro',
  '/onboarding/permissions': 'notification-permission',
  'notification-permission': 'notification-permission',
  '/onboarding/authentication': 'authentication',
  'authentication': 'authentication',
  '/onboarding/recovery': 'account-recovery',
  'account-recovery': 'account-recovery',
};

// Listens for useNavigate() calls inside onboarding pages and forwards them only when pathname actually changes
function RouterLocationBridge({ onRouteChange }) {
  const location = useLocation();
  const lastPathRef = useRef('/__init__');

  useEffect(() => {
    if (
      location.pathname &&
      location.pathname !== '/__init__' &&
      location.pathname !== lastPathRef.current
    ) {
      lastPathRef.current = location.pathname;
      onRouteChange(location.pathname);
    }
  }, [location.pathname, onRouteChange]);

  return null;
}

// Hub Directory for the "More" Tab
function MoreMenuDirectory({ state, onNavigateTab, onOpenSubPage, onStartTour }) {
  const MORE_PAGES = [
    {
      id: 'tasbih',
      title: 'Digital Tasbih',
      subtitle: 'Interactive bead counter with 33, 99 & 313 targets',
      badge: `${state?.dhikrCount || 0} Today`,
      icon: (
        <svg className="w-5 h-5 text-[#F0D58C]" viewBox="0 0 28 28" fill="currentColor">
          <circle cx="14" cy="4.5" r="2" />
          <circle cx="19" cy="6.5" r="2" />
          <circle cx="21.5" cy="11" r="2" />
          <circle cx="20.5" cy="16.5" r="2" />
          <circle cx="16.5" cy="20" r="2" />
          <circle cx="11.5" cy="20" r="2" />
          <circle cx="7.5" cy="16.5" r="2" />
          <circle cx="6.5" cy="11" r="2" />
          <circle cx="9" cy="6.5" r="2" />
          <path d="M14 22v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      action: () => onNavigateTab('tasbih'),
    },
    {
      id: 'feelings',
      title: 'Heart & Soul Check-In',
      subtitle: 'Select how you feel for Prophetic Duas & gentle remedies',
      badge: 'Comfort',
      icon: (
        <svg className="w-5 h-5 text-[#F0D58C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      action: () => onOpenSubPage('feelings'),
    },
    {
      id: 'aamaal',
      title: 'Aamaal Circle & Reports',
      subtitle: '313 Durood, Surah Mulk, 100 Istighfar & monthly reports',
      badge: 'Daily Tracker',
      icon: (
        <svg className="w-5 h-5 text-[#F0D58C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
      action: () => onNavigateTab('aamaal'),
    },
    {
      id: 'duas',
      title: 'Duas & Adhkar Library',
      subtitle: 'Authentic Quranic & Prophetic supplications with audio',
      badge: `${(state?.savedDuaIds || []).length} Saved`,
      icon: (
        <svg className="w-5 h-5 text-[#F0D58C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      action: () => onNavigateTab('duas'),
    },
    {
      id: 'account',
      title: 'Account & Family Profiles',
      subtitle: 'Manage family members, cloud backup & leaderboard privacy',
      badge: state?.userName ? state.userName : 'Profile',
      icon: (
        <svg className="w-5 h-5 text-[#F0D58C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      action: () => onOpenSubPage('account'),
    },
    {
      id: 'admin',
      title: 'Circle Admin Panel',
      subtitle: 'Person-wise daily count inspector, WhatsApp & CSV tools',
      badge: 'Admin',
      icon: (
        <svg className="w-5 h-5 text-[#F0D58C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      action: () => onOpenSubPage('admin'),
    },
    {
      id: 'stories',
      title: 'Stories & Reflections',
      subtitle: 'The Valley of Makkah & Prophetic Seerah lessons',
      badge: `Lesson ${state?.storyLesson || 1}/6`,
      icon: (
        <svg className="w-5 h-5 text-[#F0D58C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      action: () => onOpenSubPage('stories'),
    },
    {
      id: 'learning',
      title: 'Islamic Learning Hub',
      subtitle: 'Guided courses, Tajweed & daily Sunnah practices',
      badge: 'Explore',
      icon: (
        <svg className="w-5 h-5 text-[#F0D58C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      action: () => onOpenSubPage('learning'),
    },
    {
      id: 'masjids',
      title: 'Nearby Masjids & Prayer Times',
      subtitle: 'Find local congregations and Jamaat schedules',
      badge: 'Local',
      icon: (
        <svg className="w-5 h-5 text-[#F0D58C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      action: () => onOpenSubPage('masjids'),
    },
    {
      id: 'notifications',
      title: 'Reminders & Notifications',
      subtitle: 'Manage Durood, Surah Mulk & Thursday Salawat alerts',
      badge: state?.remindersCount ? 'Active' : 'Paused',
      icon: (
        <svg className="w-5 h-5 text-[#F0D58C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      action: () => onOpenSubPage('notifications'),
    },
    {
      id: 'settings',
      title: 'App Settings & Preferences',
      subtitle: 'Name, spiritual focus goals, language & reset options',
      badge: 'Configure',
      icon: (
        <svg className="w-5 h-5 text-[#F0D58C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      action: () => onOpenSubPage('settings'),
    },
  ];

  return (
    <section className="screen-section no-scrollbar px-5 pt-4 pb-6">
      <span className="text-[10.5px] font-bold uppercase tracking-widest text-gold">
        Aamaal Circle Directory
      </span>
      <h2 className="font-serif text-[24px] font-semibold text-primary">
        More Features &amp; Pages
      </h2>
      <p className="text-[12px] text-secondary mt-0.5 mb-3.5">
        Access Digital Tasbih, Heart Check-In, Account &amp; Family Profiles, Admin Tools, Stories, and Settings.
      </p>

      <div className="space-y-2.5">
        {MORE_PAGES.map((page) => (
          <button
            key={page.id}
            type="button"
            onClick={page.action}
            className="w-full text-left rounded-[18px] bg-[#F3EFE2] border border-white/90 shadow-soft-card p-3 flex items-center space-x-3 active:scale-[0.99] transition"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#165534] to-[#08351D] border border-[#C99E4C]/40 flex items-center justify-center shrink-0 shadow-sm">
              {page.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-serif text-[15px] font-semibold text-primary truncate">
                  {page.title}
                </h3>
                {page.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-[#DCE3C8] text-[#0D4A2E] text-[9px] font-bold uppercase shrink-0">
                    {page.badge}
                  </span>
                )}
              </div>
              <p className="text-[11.5px] text-secondary truncate mt-0.5">
                {page.subtitle}
              </p>
            </div>

            <span className="text-primary font-bold text-[16px] pr-1">›</span>
          </button>
        ))}
      </div>

      {/* Shortcut to Replay Onboarding Tour */}
      <div className="mt-4 pt-3 border-t border-[#DCD8C6] text-center">
        <button
          type="button"
          onClick={onStartTour}
          className="text-[12px] font-semibold text-primary underline"
        >
          Replay Welcome &amp; Onboarding Tour
        </button>
      </div>
    </section>
  );
}

export default function AppRouter({
  activeTab,
  state,
  searchQuery,
  updateState,
  onNavigateTab,
  onSearchDuas,
  onOpenModal,
  onToggleBookmark,
  onToggleReminders,
  onResetAll,
  onShowToast,
}) {
  const [onboardingStep, setOnboardingStep] = useState(() => {
    const isOnboarded = localStorage.getItem('aamaal_onboarded') === 'true';
    return isOnboarded ? null : 'splash';
  });

  const [moreSubPage, setMoreSubPage] = useState(null);

  // When user clicks a main bottom nav tab, exit onboarding & reset sub-pages
  useEffect(() => {
    setMoreSubPage(null);
    if (
      activeTab === 'home' ||
      activeTab === 'aamaal' ||
      activeTab === 'duas' ||
      activeTab === 'more' ||
      activeTab === 'tasbih' ||
      activeTab === 'feelings' ||
      activeTab === 'account' ||
      activeTab === 'admin'
    ) {
      setOnboardingStep(null);
    } else if (activeTab === 'onboarding') {
      setOnboardingStep((prev) => prev || 'splash');
    } else if (PATH_TO_STEP_MAP[activeTab]) {
      setOnboardingStep(PATH_TO_STEP_MAP[activeTab]);
    }
  }, [activeTab]);

  const handleOnboardingNavigate = useCallback(
    (target) => {
      if (
        target === '/home' ||
        target === 'home' ||
        target === 'aamaal' ||
        target === 'tasbih' ||
        target === 'duas' ||
        target === 'feelings' ||
        target === 'more'
      ) {
        localStorage.setItem('aamaal_onboarded', 'true');
        setOnboardingStep(null);
        if (onNavigateTab) {
          onNavigateTab(target === '/home' ? 'home' : target);
        }
        return;
      }

      const mappedStep = PATH_TO_STEP_MAP[target] || target;
      setOnboardingStep(mappedStep);
    },
    [onNavigateTab]
  );

  const currentStep = onboardingStep;

  // 1. Render Onboarding Screens if active
  if (currentStep) {
    const sharedProps = {
      state,
      updateState,
      onShowToast,
      onNavigate: handleOnboardingNavigate,
      onCompleteOnboarding: () => handleOnboardingNavigate('home'),
    };

    const renderStepScreen = () => {
      switch (currentStep) {
        case 'splash':
          return (
            <Splash
              {...sharedProps}
              onComplete={() => {
                const isReturnee = localStorage.getItem('aamaal_onboarded') === 'true';
                handleOnboardingNavigate(isReturnee ? 'authentication' : 'welcome');
              }}
            />
          );
        case 'welcome':
          return <Welcome {...sharedProps} />;
        case 'purpose':
          return <Purpose {...sharedProps} />;
        case 'tasbih-intro':
          return <TasbihIntro {...sharedProps} />;
        case 'duas-intro':
          return <DuaIntro {...sharedProps} />;
        case 'stories-intro':
          return <StoriesIntro {...sharedProps} />;
        case 'language':
          return <LanguageSelection {...sharedProps} />;
        case 'preferences':
          return <Preferences {...sharedProps} />;
        case 'notifications-intro':
          return <NotificationIntro {...sharedProps} />;
        case 'notification-permission':
          return <NotificationPermission {...sharedProps} />;
        case 'authentication':
          return <Authentication {...sharedProps} />;
        case 'account-recovery':
          return <AccountRecovery {...sharedProps} />;
        default:
          return <Welcome {...sharedProps} />;
      }
    };

    return (
      <MemoryRouter initialEntries={['/__init__']}>
        <RouterLocationBridge onRouteChange={handleOnboardingNavigate} />
        {renderStepScreen()}
      </MemoryRouter>
    );
  }

  // 2. Render Main App Tabs & Modules
  switch (activeTab) {
    case 'aamaal':
      return (
        <AamaalDashboard
          state={state}
          updateState={updateState}
          onShowToast={onShowToast}
        />
      );

    case 'tasbih':
      return (
        <TasbihPage
          state={state}
          updateState={updateState}
          onShowToast={onShowToast}
        />
      );

    case 'duas':
      return (
        <DuasHome
          state={state}
          searchQuery={searchQuery}
          onSelectFilter={(f) => updateState({ activeDuaFilter: f })}
          onToggleBookmark={onToggleBookmark}
          onOpenModal={onOpenModal}
          updateState={updateState}
          onShowToast={onShowToast}
        />
      );

    case 'feelings':
      return (
        <FeelingsHome
          state={state}
          updateState={updateState}
          onNavigateTab={onNavigateTab}
          onShowToast={onShowToast}
          onBack={() => onNavigateTab && onNavigateTab('home')}
        />
      );

    case 'account':
      return (
        <AccountDashboard
          state={state}
          updateState={updateState}
          onNavigateTab={onNavigateTab}
          onShowToast={onShowToast}
          onBack={() => onNavigateTab && onNavigateTab('more')}
        />
      );

    case 'admin':
      return (
        <AdminDashboard
          state={state}
          updateState={updateState}
          onShowToast={onShowToast}
          onBack={() => onNavigateTab && onNavigateTab('more')}
        />
      );

    case 'settings':
      return (
        <SettingsPage
          state={state}
          updateState={updateState}
          onResetAll={onResetAll}
          onShowToast={onShowToast}
        />
      );

    case 'more': {
      if (moreSubPage === 'feelings') {
        return (
          <FeelingsHome
            state={state}
            updateState={updateState}
            onNavigateTab={onNavigateTab}
            onShowToast={onShowToast}
            onBack={() => setMoreSubPage(null)}
          />
        );
      }

      if (moreSubPage === 'account') {
        return (
          <AccountDashboard
            state={state}
            updateState={updateState}
            onNavigateTab={onNavigateTab}
            onShowToast={onShowToast}
            onBack={() => setMoreSubPage(null)}
          />
        );
      }

      if (moreSubPage === 'admin') {
        return (
          <AdminDashboard
            state={state}
            updateState={updateState}
            onShowToast={onShowToast}
            onBack={() => setMoreSubPage(null)}
          />
        );
      }

      if (moreSubPage === 'settings') {
        return (
          <div className="h-full flex flex-col">
            <div className="px-5 pt-3 shrink-0">
              <button
                type="button"
                onClick={() => setMoreSubPage(null)}
                className="btn-secondary px-3 py-1 text-[11.5px]"
              >
                ‹ Back to More Pages
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <SettingsPage
                state={state}
                updateState={updateState}
                onResetAll={onResetAll}
                onShowToast={onShowToast}
              />
            </div>
          </div>
        );
      }

      if (moreSubPage) {
        return (
          <section className="screen-section no-scrollbar px-5 pt-4 pb-6">
            <button
              type="button"
              onClick={() => setMoreSubPage(null)}
              className="btn-secondary px-3 py-1 text-[11.5px] mb-4"
            >
              ‹ Back to More Pages
            </button>
            <div className="card p-5 text-center mt-4">
              <span className="badge-pill">Aamaal Circle Module</span>
              <h2 className="font-serif text-[22px] font-semibold text-primary mt-2 capitalize">
                {moreSubPage}
              </h2>
              <p className="text-[12.5px] text-secondary mt-1">
                Ready for us to connect the dedicated {moreSubPage} pages next.
              </p>
            </div>
          </section>
        );
      }

      return (
        <MoreMenuDirectory
          state={state}
          onNavigateTab={onNavigateTab}
          onOpenSubPage={(pageId) => setMoreSubPage(pageId)}
          onStartTour={() => {
            if (onShowToast) onShowToast('Opening Onboarding Tour...');
            setOnboardingStep('welcome');
            if (onNavigateTab) onNavigateTab('onboarding');
          }}
        />
      );
    }

    case 'home':
    default:
      return (
        <HomePage
          state={state}
          onNavigateTab={onNavigateTab}
          onSearchDuas={onSearchDuas}
          onOpenModal={onOpenModal}
          onToggleReminders={onToggleReminders}
          onShowToast={onShowToast}
        />
      );
  }
}