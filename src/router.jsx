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

// Reusable Universal Top Back Bar for pages that don't render their own internal Back button
function PageWithBackHeader({ title, onBack, children }) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pt-2.5 pb-1 flex items-center space-x-2.5 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-[#F3EFE2] border border-[#D5D2BE] shadow-soft-card flex items-center justify-center text-[#0D4A2E] font-bold text-[16px] active:scale-95 transition"
          aria-label="Go Back"
        >
          ←
        </button>
        {title && (
          <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#0D4A2E]">
            {title}
          </span>
        )}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

// Hub Directory for the "More" Tab
function MoreMenuDirectory({ state, onNavigateTab, onOpenSubPage, onStartTour }) {
  const MORE_PAGES = [
    {
      id: 'tasbih',
      title: 'Digital Tasbih',
      subtitle: 'Interactive 3D bead counter with 33, 99 & 413 targets',
      badge: `${state?.dhikrCount || 0} Today`,
      icon: '📿',
      action: () => onNavigateTab('tasbih'),
    },
    {
      id: 'feelings',
      title: 'Heart & Soul Check-In',
      subtitle: 'Select how you feel for Prophetic Duas & gentle remedies',
      badge: 'Comfort',
      icon: '🌿',
      action: () => onOpenSubPage('feelings'),
    },
    {
      id: 'aamaal',
      title: 'Aamaal Circle & Reports',
      subtitle: '313 Durood, Surah Mulk, 100 Istighfar & monthly reports',
      badge: 'Daily Tracker',
      icon: '✓',
      action: () => onNavigateTab('aamaal'),
    },
    {
      id: 'duas',
      title: 'Duas & Adhkar Library',
      subtitle: 'Authentic Quranic & Prophetic supplications with audio',
      badge: `${(state?.savedDuaIds || []).length} Saved`,
      icon: '🤲',
      action: () => onNavigateTab('duas'),
    },
    {
      id: 'stories',
      title: 'Stories & Seerah Reflections',
      subtitle: 'The Valley of Makkah, Quranic parables & Hadith gems',
      badge: `Lesson ${state?.storyLesson || 2}/6`,
      icon: '📖',
      action: () => onOpenSubPage('stories'),
    },
    {
      id: 'learning',
      title: 'Islamic Learning Hub',
      subtitle: 'Guided courses on Salawat, Surah Mulk & Sunnah',
      badge: 'Courses',
      icon: '🎓',
      action: () => onOpenSubPage('learning'),
    },
    {
      id: 'quiz',
      title: 'Islamic Knowledge Quiz',
      subtitle: 'Test your knowledge with Arabic proofs & 4 languages',
      badge: 'Quiz',
      icon: '🏆',
      action: () => onOpenSubPage('quiz'),
    },
    {
      id: 'masjids',
      title: 'Nearby Masjids & Navigation',
      subtitle: 'Free live Google Maps directions & Jamaat timetables',
      badge: 'Google Maps',
      icon: '🕌',
      action: () => onOpenSubPage('masjids'),
    },
    {
      id: 'notifications',
      title: 'Reminders & Alerts',
      subtitle: 'Manage 313 Durood, Surah Mulk & Thursday Salawat alerts',
      badge: state?.remindersCount ? 'Active' : 'Paused',
      icon: '🔔',
      action: () => onOpenSubPage('notifications'),
    },
    {
      id: 'account',
      title: 'Account & Family Profiles',
      subtitle: 'Manage family members, cloud backup & leaderboard privacy',
      badge: state?.userName ? state.userName : 'Profile',
      icon: '👨‍👩‍👧‍👦',
      action: () => onOpenSubPage('account'),
    },
    {
      id: 'admin',
      title: 'Circle Admin Panel',
      subtitle: 'Person-wise daily count inspector, WhatsApp & CSV tools',
      badge: 'Admin',
      icon: '👑',
      action: () => onOpenSubPage('admin'),
    },
    {
      id: 'settings',
      title: 'App Settings & Preferences',
      subtitle: 'Language, Arabic font, haptics, themes & privacy',
      badge: 'Configure',
      icon: '⚙️',
      action: () => onOpenSubPage('settings'),
    },
  ];

  return (
    <section className="screen-section no-scrollbar px-5 pt-3 pb-6">
      {/* Top Back to Home Button */}
      <div className="flex items-center space-x-2.5 mb-2">
        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab('home')}
          className="w-8 h-8 rounded-full bg-[#F3EFE2] border border-[#D5D2BE] shadow-soft-card flex items-center justify-center text-[#0D4A2E] font-bold text-[16px]"
          aria-label="Back to Home"
        >
          ←
        </button>
        <span className="text-[10.5px] font-bold uppercase tracking-widest text-gold">
          Aamaal Circle Directory
        </span>
      </div>

      <h2 className="font-serif text-[24px] font-semibold text-primary">
        More Features &amp; Pages
      </h2>
      <p className="text-[12px] text-secondary mt-0.5 mb-3.5">
        Access Digital Tasbih, Heart Check-In, Stories, Learning Hub, Quiz, Masjids with Google Maps, Reminders, Family Profiles, and Admin Tools.
      </p>

      <div className="space-y-2.5">
        {MORE_PAGES.map((page) => (
          <button
            key={page.id}
            type="button"
            onClick={page.action}
            className="w-full text-left rounded-[18px] bg-[#F3EFE2] border border-white/90 shadow-soft-card p-3 flex items-center space-x-3 active:scale-[0.99] transition"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#165534] to-[#08351D] border border-[#C99E4C]/40 flex items-center justify-center shrink-0 shadow-sm text-[#F0D58C] text-[17px]">
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
      activeTab === 'admin' ||
      activeTab === 'learning' ||
      activeTab === 'stories' ||
      activeTab === 'quiz' ||
      activeTab === 'masjids' ||
      activeTab === 'notifications' ||
      activeTab === 'settings'
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
        target === 'learning' ||
        target === 'stories' ||
        target === 'quiz' ||
        target === 'masjids' ||
        target === 'notifications' ||
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

  const goHome = () => onNavigateTab && onNavigateTab('home');

  if (onboardingStep) {
    const sharedProps = {
      state,
      updateState,
      onShowToast,
      onNavigate: handleOnboardingNavigate,
      onCompleteOnboarding: () => handleOnboardingNavigate('home'),
    };

    const renderStepScreen = () => {
      switch (onboardingStep) {
        case 'splash':
          return (
            <Splash
              {...sharedProps}
              onComplete={() => {
                const isReturnee =
                  localStorage.getItem('aamaal_onboarded') === 'true';
                handleOnboardingNavigate(
                  isReturnee ? 'authentication' : 'welcome'
                );
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
          onBack={goHome}
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
          onBack={goHome}
        />
      );

    case 'stories':
      return (
        <StoriesHome
          state={state}
          updateState={updateState}
          onShowToast={onShowToast}
          onBack={goHome}
        />
      );

    case 'learning':
      return (
        <ReadingHome
          state={state}
          updateState={updateState}
          onShowToast={onShowToast}
          onBack={goHome}
        />
      );

    case 'quiz':
      return (
        <QuizHome
          state={state}
          updateState={updateState}
          onShowToast={onShowToast}
          onBack={goHome}
        />
      );

    case 'masjids':
      return (
        <MasjidList
          onShowToast={onShowToast}
          onBack={goHome}
        />
      );

    case 'notifications':
      return (
        <ReminderDashboard
          state={state}
          updateState={updateState}
          onShowToast={onShowToast}
          onBack={goHome}
        />
      );

    case 'account':
      return (
        <AccountDashboard
          state={state}
          updateState={updateState}
          onNavigateTab={onNavigateTab}
          onShowToast={onShowToast}
          onBack={goHome}
        />
      );

    case 'admin':
      return (
        <AdminDashboard
          state={state}
          updateState={updateState}
          onShowToast={onShowToast}
          onBack={goHome}
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
          onBack={goHome}
        />
      );

    case 'more': {
      const backToMore = () => setMoreSubPage(null);

      if (moreSubPage === 'feelings') {
        return (
          <FeelingsHome
            state={state}
            updateState={updateState}
            onNavigateTab={onNavigateTab}
            onShowToast={onShowToast}
            onBack={backToMore}
          />
        );
      }

      if (moreSubPage === 'stories') {
        return (
          <StoriesHome
            state={state}
            updateState={updateState}
            onShowToast={onShowToast}
            onBack={backToMore}
          />
        );
      }

      if (moreSubPage === 'learning') {
        return (
          <ReadingHome
            state={state}
            updateState={updateState}
            onShowToast={onShowToast}
            onBack={backToMore}
          />
        );
      }

      if (moreSubPage === 'quiz') {
        return (
          <QuizHome
            state={state}
            updateState={updateState}
            onShowToast={onShowToast}
            onBack={backToMore}
          />
        );
      }

      if (moreSubPage === 'masjids') {
        return (
          <MasjidList
            onShowToast={onShowToast}
            onBack={backToMore}
          />
        );
      }

      if (moreSubPage === 'notifications') {
        return (
          <ReminderDashboard
            state={state}
            updateState={updateState}
            onShowToast={onShowToast}
            onBack={backToMore}
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
            onBack={backToMore}
          />
        );
      }

      if (moreSubPage === 'admin') {
        return (
          <AdminDashboard
            state={state}
            updateState={updateState}
            onShowToast={onShowToast}
            onBack={backToMore}
          />
        );
      }

      if (moreSubPage === 'settings') {
        return (
          <SettingsPage
            state={state}
            updateState={updateState}
            onNavigateTab={onNavigateTab}
            onResetAll={onResetAll}
            onShowToast={onShowToast}
            onBack={backToMore}
          />
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
          updateState={updateState}
          onNavigateTab={onNavigateTab}
          onSearchDuas={onSearchDuas}
          onOpenModal={onOpenModal}
          onToggleReminders={() =>
            onNavigateTab && onNavigateTab('notifications')
          }
          onToggleBookmark={onToggleBookmark}
          onShowToast={onShowToast}
        />
      );
  }
}