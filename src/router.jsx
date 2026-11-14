import React, { useState, useEffect } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';

// Main App Tab Pages
import HomePage from './pages/home/HomePage';
import TasbihPage from './pages/tasbih/TasbihPage';
import DuasPage from './pages/duas/DuasPage';
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

// Listens for useNavigate() calls inside onboarding pages and forwards them to handleOnboardingNavigate
function RouterLocationBridge({ onRouteChange }) {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname && location.pathname !== '/__init__') {
      onRouteChange(location.pathname);
    }
  }, [location.pathname]);
  return null;
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

  // Sync when App.jsx resets or switches activeTab to 'onboarding'
  useEffect(() => {
    if (activeTab === 'onboarding' && !onboardingStep) {
      setOnboardingStep('splash');
    }
  }, [activeTab, onboardingStep]);

  const handleOnboardingNavigate = (target) => {
    if (
      target === '/home' ||
      target === 'home' ||
      target === 'tasbih' ||
      target === 'duas' ||
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
  };

  const currentStep =
    activeTab === 'onboarding'
      ? onboardingStep || 'splash'
      : PATH_TO_STEP_MAP[activeTab] || onboardingStep;

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

  // 2. Render Main App Tabs
  switch (activeTab) {
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
        <DuasPage
          state={state}
          searchQuery={searchQuery}
          onSelectFilter={(f) => updateState({ activeDuaFilter: f })}
          onToggleBookmark={onToggleBookmark}
          onOpenModal={onOpenModal}
        />
      );
    case 'more':
      return (
        <SettingsPage
          state={state}
          updateState={updateState}
          onResetAll={onResetAll}
          onShowToast={onShowToast}
        />
      );
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