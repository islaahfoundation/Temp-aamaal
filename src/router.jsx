// src/router.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';

// Main App Tab & Feature Pages
import HomePage from './pages/home/HomePage';
import AamaalDashboard from './pages/aamaal/AamaalDashboard';
import TasbihPage from './pages/tasbih/TasbihPage';
import DuasHome from './pages/duas/DuasHome';
import FeelingsHome from './pages/feelings/FeelingsHome';
import AccountDashboard from './pages/account/AccountDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ReadingHome from './pages/learning/ReadingHome';
import StoriesHome from './pages/stories/StoriesHome';
import QuizHome from './pages/quiz/QuizHome';
import MasjidList from './pages/masjids/MasjidList';
import ReminderDashboard from './pages/notifications/ReminderDashboard';
import SettingsPage from './pages/settings/SettingsPage';

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

const APP_TABS = new Set([
  'home',
  'aamaal',
  'tasbih',
  'duas',
  'feelings',
  'stories',
  'learning',
  'quiz',
  'masjids',
  'notifications',
  'account',
  'admin',
  'settings',
  'more',
]);

const PATH_TO_STEP_MAP = {
  '/': 'splash',
  '/welcome': 'welcome',
  '/onboarding/purpose': 'purpose',
  '/onboarding/tasbih': 'tasbih-intro',
  '/onboarding/duas': 'duas-intro',
  '/onboarding/stories': 'stories-intro',
  '/onboarding/language': 'language',
  '/onboarding/preferences': 'preferences',
  '/onboarding/notifications': 'notifications-intro',
  '/onboarding/permissions': 'notification-permission',
  '/onboarding/authentication': 'authentication',
  '/onboarding/recovery': 'account-recovery',
};

const ONBOARDING_COMPONENTS = {
  welcome: Welcome,
  purpose: Purpose,
  'tasbih-intro': TasbihIntro,
  'duas-intro': DuaIntro,
  'stories-intro': StoriesIntro,
  language: LanguageSelection,
  preferences: Preferences,
  'notifications-intro': NotificationIntro,
  'notification-permission': NotificationPermission,
  authentication: Authentication,
  'account-recovery': AccountRecovery,
};

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
function MoreMenuDirectory({ state, onNavigateTab, onGoBack, onStartTour }) {
  const MORE_PAGES = [
    {
      id: 'tasbih',
      title: 'Digital Tasbih',
      subtitle: 'Interactive 3D bead counter with 33, 99 & 413 targets',
      badge: `${state?.dhikrCount || 0} Today`,
      icon: '📿',
    },
    {
      id: 'feelings',
      title: 'Heart & Soul Check-In',
      subtitle: 'Select how you feel for Prophetic Duas & gentle remedies',
      badge: 'Comfort',
      icon: '🌿',
    },
    {
      id: 'aamaal',
      title: 'Aamaal Circle & Reports',
      subtitle: '313 Durood, Surah Mulk, 100 Istighfar & monthly reports',
      badge: 'Daily Tracker',
      icon: '✓',
    },
    {
      id: 'duas',
      title: 'Duas & Adhkar Library',
      subtitle: 'Authentic Quranic & Prophetic supplications with audio',
      badge: `${(state?.savedDuaIds || []).length} Saved`,
      icon: '🤲',
    },
    {
      id: 'stories',
      title: 'Stories & Seerah Reflections',
      subtitle: 'The Valley of Makkah, Quranic parables & Hadith gems',
      badge: `Lesson ${state?.storyLesson || 2}/6`,
      icon: '📖',
    },
    {
      id: 'learning',
      title: 'Islamic Learning Hub',
      subtitle: 'Guided courses on Salawat, Surah Mulk & Sunnah',
      badge: 'Courses',
      icon: '🎓',
    },
    {
      id: 'quiz',
      title: 'Islamic Knowledge Quiz',
      subtitle: 'Test your knowledge with Arabic proofs & 4 languages',
      badge: 'Quiz',
      icon: '🏆',
    },
    {
      id: 'masjids',
      title: 'Nearby Masjids & Navigation',
      subtitle: 'Live Google Maps directions & Jamaat timetables',
      badge: 'Google Maps',
      icon: '🕌',
    },
    {
      id: 'notifications',
      title: 'Reminders & Alerts',
      subtitle: 'Manage 313 Durood, Surah Mulk & Thursday Salawat alerts',
      badge: state?.remindersCount ? 'Active' : 'Paused',
      icon: '🔔',
    },
    {
      id: 'account',
      title: 'Account & Family Profiles',
      subtitle: 'Manage family members, cloud backup & leaderboard privacy',
      badge: state?.userName || 'Profile',
      icon: '👨‍👩‍👧‍👦',
    },
    {
      id: 'admin',
      title: 'Circle Admin Panel',
      subtitle: 'Members, Aamaal catalog, reports, leaderboard & settings',
      badge: 'Admin',
      icon: '👑',
    },
    {
      id: 'settings',
      title: 'App Settings & Preferences',
      subtitle: 'Language, Arabic font, haptics, themes & privacy',
      badge: 'Configure',
      icon: '⚙️',
    },
  ];

  return (
    <section className="screen-section no-scrollbar bg-[#F7F5EE] min-h-full px-4 pt-3 pb-24 select-none">
      {/* Header */}
      <header className="flex items-center space-x-2.5 mb-3">
        <button
          type="button"
          onClick={onGoBack}
          aria-label="Go Back"
          className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-[#14261C] active:scale-95 transition shrink-0"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C99E4C] block leading-none">
            Aamaal Circle Directory
          </span>
          <h2 className="font-serif text-[22px] font-bold text-[#14261C] leading-tight mt-0.5">
            More Features
          </h2>
        </div>
      </header>

      {/* Feature List */}
      <div className="space-y-2.5">
  {MORE_PAGES.map((page) => (
    <button
      key={page.id}
      type="button"
      onClick={() => onNavigateTab?.(page.id)}
      className="w-full text-left rounded-[18px] p-3.5 bg-[#FCFBF7] border border-[#E6E2D5] text-[#14261C] shadow-[0_2px_10px_rgba(20,38,28,0.04)] flex items-center space-x-3 active:scale-[0.99] transition"
    >
      <div className="w-10 h-10 rounded-xl bg-[#E6F1E8] text-[#0D4A2E] flex items-center justify-center shrink-0 text-[18px]">
        {page.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h3 className="font-serif text-[15px] font-bold text-[#14261C] truncate">
            {page.title}
          </h3>
          {page.badge && (
            <span className="px-2 py-0.5 rounded-full bg-[#E0F3E5] text-[#15693B] text-[9.5px] font-bold uppercase shrink-0">
              {page.badge}
            </span>
          )}
        </div>
        <p className="text-[11.5px] text-[#55615A] truncate mt-0.5">
          {page.subtitle}
        </p>
      </div>

      <svg
        className="w-4 h-4 text-[#7A827D] shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  ))}
</div>

      {/* Onboarding Replay Link */}
      <div className="mt-5 pt-3 border-t border-[#E6E2D5] text-center">
        <button
          type="button"
          onClick={onStartTour}
          className="text-[12.5px] font-semibold text-[#0D4A2E] underline"
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
  onGoBack,
  onSearchDuas,
  onOpenModal,
  onToggleBookmark,
  onResetAll,
  onShowToast,
}) {
  const [onboardingStep, setOnboardingStep] = useState(() =>
    localStorage.getItem('aamaal_onboarded') === 'true' ? null : 'splash'
  );

  useEffect(() => {
    if (APP_TABS.has(activeTab)) {
      setOnboardingStep(null);
    } else if (activeTab === 'onboarding') {
      setOnboardingStep((prev) => prev || 'splash');
    } else if (PATH_TO_STEP_MAP[activeTab] || ONBOARDING_COMPONENTS[activeTab] || activeTab === 'splash') {
      setOnboardingStep(PATH_TO_STEP_MAP[activeTab] || activeTab);
    }
  }, [activeTab]);

  const handleOnboardingNavigate = useCallback(
    (target) => {
      const normalized = target === '/home' ? 'home' : target;
      if (APP_TABS.has(normalized)) {
        localStorage.setItem('aamaal_onboarded', 'true');
        setOnboardingStep(null);
        onNavigateTab?.(normalized);
        return;
      }

      setOnboardingStep(PATH_TO_STEP_MAP[target] || target);
    },
    [onNavigateTab]
  );

  const handleBack = useCallback(() => {
    if (onGoBack) {
      onGoBack();
    } else {
      onNavigateTab?.('home');
    }
  }, [onGoBack, onNavigateTab]);

  // ONBOARDING FLOW
  if (onboardingStep) {
    const sharedProps = {
      state,
      updateState,
      onShowToast,
      onNavigate: handleOnboardingNavigate,
      onCompleteOnboarding: () => handleOnboardingNavigate('home'),
    };

    const StepComponent = ONBOARDING_COMPONENTS[onboardingStep] || Welcome;

    return (
      <MemoryRouter initialEntries={['/__init__']}>
        <RouterLocationBridge onRouteChange={handleOnboardingNavigate} />
        {onboardingStep === 'splash' ? (
          <Splash
            {...sharedProps}
            onComplete={() => {
              const isReturnee = localStorage.getItem('aamaal_onboarded') === 'true';
              handleOnboardingNavigate(isReturnee ? 'authentication' : 'welcome');
            }}
          />
        ) : (
          <StepComponent {...sharedProps} />
        )}
      </MemoryRouter>
    );
  }

  // MAIN APP ROUTES
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
          onBack={handleBack}
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
          onBack={handleBack}
        />
      );

    case 'stories':
      return (
        <StoriesHome
          state={state}
          updateState={updateState}
          onShowToast={onShowToast}
          onBack={handleBack}
        />
      );

    case 'learning':
      return (
        <ReadingHome
          state={state}
          updateState={updateState}
          onShowToast={onShowToast}
          onBack={handleBack}
        />
      );

    case 'quiz':
      return (
        <QuizHome
          state={state}
          updateState={updateState}
          onShowToast={onShowToast}
          onBack={handleBack}
        />
      );

    case 'masjids':
      return <MasjidList onShowToast={onShowToast} onBack={handleBack} />;

    case 'notifications':
      return (
        <ReminderDashboard
          state={state}
          updateState={updateState}
          onShowToast={onShowToast}
          onBack={handleBack}
        />
      );

    case 'account':
      return (
        <AccountDashboard
          state={state}
          updateState={updateState}
          onNavigateTab={onNavigateTab}
          onShowToast={onShowToast}
          onBack={handleBack}
        />
      );

    case 'admin':
      return (
        <AdminDashboard
          state={state}
          updateState={updateState}
          onShowToast={onShowToast}
          onBack={handleBack}
        />
      );

    case 'settings':
      return (
        <SettingsPage
          state={state}
          updateState={updateState}
          onNavigateTab={onNavigateTab}
          onResetAll={onResetAll}
          onShowToast={onShowToast}
          onBack={handleBack}
        />
      );

    case 'more':
      return (
        <MoreMenuDirectory
          state={state}
          onNavigateTab={onNavigateTab}
          onGoBack={handleBack}
          onStartTour={() => {
            onShowToast?.('Opening Onboarding Tour...');
            setOnboardingStep('welcome');
            onNavigateTab?.('onboarding');
          }}
        />
      );

    case 'home':
    default:
      return (
        <HomePage
          state={state}
          updateState={updateState}
          onNavigateTab={onNavigateTab}
          onSearchDuas={onSearchDuas}
          onOpenModal={onOpenModal}
          onToggleReminders={() => onNavigateTab?.('notifications')}
          onToggleBookmark={onToggleBookmark}
          onShowToast={onShowToast}
        />
      );
  }
}