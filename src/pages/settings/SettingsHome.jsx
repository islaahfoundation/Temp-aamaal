//First, here is src/pages/settings/SettingsHome.jsx, which unites all 15 settings sub-screens (LanguageSelector, ArabicDisplaySettings, TranslationPreferences, TransliterationPreferences, TypographySettings, ThemeSelector, Appearance, AnimationSettings, HapticSettings, SoundSettings, HomeCustomisation, NotificationSettings, PrivacySecurity, HelpSupport, and About) with profile name editing and localStorage persistence:

import React, { useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import ArabicDisplaySettings from './ArabicDisplaySettings';
import TranslationPreferences from './TranslationPreferences';
import TransliterationPreferences from './TransliterationPreferences';
import TypographySettings from './TypographySettings';
import ThemeSelector from './ThemeSelector';
import Appearance from './Appearance';
import AnimationSettings from './AnimationSettings';
import HapticSettings from './HapticSettings';
import SoundSettings from './SoundSettings';
import HomeCustomisation from './HomeCustomisation';
import NotificationSettings from './NotificationSettings';
import PrivacySecurity from './PrivacySecurity';
import HelpSupport from './HelpSupport';
import About from './About';

const SETTINGS_STORAGE_KEY = 'aamaal_settings_v1';
const DUA_PREFS_KEY = 'aamaal_dua_reader_prefs_v1';

export default function SettingsHome({
  state,
  updateState,
  onNavigateTab,
  onResetAll,
  onShowToast,
  onBack,
}) {
  const [activeSubScreen, setActiveSubScreen] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [settings, setSettings] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(SETTINGS_STORAGE_KEY) || 'null'
      );
      if (saved && typeof saved === 'object') return saved;
    } catch (_) {}
    return {
      language: localStorage.getItem('aamaal_language') || 'en',
      arabicFontSize: 26,
      arabicLineHeight: 1.8,
      showAyahOrnament: true,
      highContrastGold: true,
      translationFontSize: 13.5,
      showTranslation: true,
      showDualRomanUrdu: true,
      showDuaBenefits: true,
      showReferenceSource: true,
      disableRomanTransliteration: true,
      useAudioGuideInstead: true,
      theme: 'madinah-cream',
      showMandalaWatermarks: true,
      showCountryFlags: true,
      smoothTransitions: true,
      tasbihBeadAnimation: true,
      progressRingSweep: true,
      reducedMotion: false,
      hapticsEnabled: true,
      tasbihTapIntensity: 14,
      milestoneVibration: true,
      duaAudioEnabled: true,
      tasbihClickSound: false,
      audioVolume: 85,
      showHomeProgress: true,
      showQuickActions: true,
      showFeaturedDua: true,
      showContinueReading: true,
      showThursdayReminder: true,
      leaderboardPrivacy: 'public',
    };
  });

  // Sync settings to localStorage & Dua Reader preferences
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      localStorage.setItem(
        DUA_PREFS_KEY,
        JSON.stringify({
          arabicFontSize: settings.arabicFontSize || 26,
          translationFontSize: settings.translationFontSize || 13.5,
          language: settings.language || 'en',
          showBenefits: settings.showDuaBenefits !== false,
          showAudio: settings.duaAudioEnabled !== false,
        })
      );
    } catch (_) {}
  }, [settings]);

  const handleUpdateSettings = (nextSettings) => {
    setSettings(nextSettings);
    if (onShowToast) onShowToast('Preferences saved');
  };

  // Render active sub-page when clicked
  const renderSubScreen = () => {
    const commonProps = {
      settings,
      onUpdateSettings: handleUpdateSettings,
      onShowToast,
      onBack: () => setActiveSubScreen(null),
    };

    switch (activeSubScreen) {
      case 'language':
        return (
          <LanguageSelector
            selectedLanguage={settings.language}
            onSelectLanguage={(langId) =>
              handleUpdateSettings({ ...settings, language: langId })
            }
            onBack={() => setActiveSubScreen(null)}
          />
        );
      case 'arabic':
        return <ArabicDisplaySettings {...commonProps} />;
      case 'translation':
        return <TranslationPreferences {...commonProps} />;
      case 'transliteration':
        return <TransliterationPreferences {...commonProps} />;
      case 'typography':
        return <TypographySettings {...commonProps} />;
      case 'theme':
        return (
          <ThemeSelector
            selectedTheme={settings.theme}
            onSelectTheme={(themeId) =>
              handleUpdateSettings({ ...settings, theme: themeId })
            }
            onBack={() => setActiveSubScreen(null)}
          />
        );
      case 'appearance':
        return <Appearance {...commonProps} />;
      case 'animation':
        return <AnimationSettings {...commonProps} />;
      case 'haptics':
        return <HapticSettings {...commonProps} />;
      case 'sound':
        return <SoundSettings {...commonProps} />;
      case 'home-customisation':
        return <HomeCustomisation {...commonProps} />;
      case 'notifications':
        return (
          <NotificationSettings
            {...commonProps}
            onOpenFullReminders={() =>
              onNavigateTab && onNavigateTab('notifications')
            }
          />
        );
      case 'privacy':
        return (
          <PrivacySecurity
            {...commonProps}
            onResetAllData={onResetAll}
          />
        );
      case 'help':
        return <HelpSupport onBack={() => setActiveSubScreen(null)} />;
      case 'about':
        return <About onBack={() => setActiveSubScreen(null)} />;
      default:
        return null;
    }
  };

  if (activeSubScreen) {
    return (
      <section className="screen-section no-scrollbar px-5 pt-4 pb-6">
        {renderSubScreen()}
      </section>
    );
  }

  const MENU_GROUPS = [
    {
      groupTitle: 'Quran, Arabic & Meaning Display',
      items: [
        {
          id: 'language',
          icon: '🌐',
          title: 'Language Selector',
          subtitle: 'English, Roman Urdu, Urdu (اردو) & Hindi (हिन्दी)',
          badge: (settings.language || 'en').toUpperCase(),
        },
        {
          id: 'arabic',
          icon: '🕋',
          title: 'Arabic Script & Calligraphy',
          subtitle: 'Font size, line spacing & gold illumination',
          badge: `${settings.arabicFontSize || 26}px`,
        },
        {
          id: 'translation',
          icon: '📖',
          title: 'Translation Preferences',
          subtitle: 'Dual Roman Urdu view, Hadith sources & virtues',
        },
        {
          id: 'transliteration',
          icon: '✨',
          title: 'Pure Arabic Script Policy',
          subtitle: 'Why Roman phonetic transliteration is kept off',
          badge: 'Pure Arabic',
        },
        {
          id: 'typography',
          icon: '🔤',
          title: 'Typography & Layout Density',
          subtitle: 'Article font size and compact mobile card spacing',
        },
      ],
    },
    {
      groupTitle: 'Appearance, Haptics & Audio',
      items: [
        {
          id: 'appearance',
          icon: '🎨',
          title: 'Appearance & Theme Selector',
          subtitle: 'Madinah Cream, Emerald Sanctuary & mandala ornaments',
        },
        {
          id: 'home-customisation',
          icon: '🏠',
          title: 'Home Screen Customisation',
          subtitle: 'Choose which cards appear on your Home dashboard',
        },
        {
          id: 'haptics',
          icon: '📳',
          title: 'Haptic & Vibration Feedback',
          subtitle: 'Tactile pulse intensity on Tasbih beads & goals',
          badge: settings.hapticsEnabled !== false ? 'On' : 'Off',
        },
        {
          id: 'sound',
          icon: '🔊',
          title: 'Sound & Recitation Audio',
          subtitle: 'Dua audio player, volume & bead click sound',
        },
        {
          id: 'animation',
          icon: '✨',
          title: 'Animation & Motion',
          subtitle: 'Tasbih bead movement & progress ring transitions',
        },
      ],
    },
    {
      groupTitle: 'Notifications, Privacy & Support',
      items: [
        {
          id: 'notifications',
          icon: '🔔',
          title: 'Notification Settings',
          subtitle: '313 Durood, Surah Mulk & Thursday Salawat alerts',
        },
        {
          id: 'privacy',
          icon: '🔒',
          title: 'Privacy, Backup & Reset',
          subtitle: 'Leaderboard anonymity (Ikhlas), JSON export & reset',
          badge:
            settings.leaderboardPrivacy === 'private' ? 'Anonymous' : 'Public',
        },
        {
          id: 'help',
          icon: '💬',
          title: 'Help & Support FAQ',
          subtitle: 'Answers on family profiles, tracking & WhatsApp reports',
        },
        {
          id: 'about',
          icon: '🕌',
          title: 'About Aamaal Circle',
          subtitle: 'Islaah Foundation mission & our three daily pillars',
        },
      ],
    },
  ];

  // Live Search Filter
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredGroups = MENU_GROUPS.map((group) => {
    if (!normalizedQuery) return group;
    const groupMatches = group.groupTitle.toLowerCase().includes(normalizedQuery);
    const matchingItems = groupMatches
      ? group.items
      : group.items.filter(
          (item) =>
            item.title.toLowerCase().includes(normalizedQuery) ||
            item.subtitle.toLowerCase().includes(normalizedQuery) ||
            (item.badge || '').toLowerCase().includes(normalizedQuery) ||
            item.id.toLowerCase().includes(normalizedQuery)
        );
    return { ...group, items: matchingItems };
  }).filter((group) => group.items.length > 0);

  const showNameCard =
    !normalizedQuery ||
    'primary circle member name profile'.includes(normalizedQuery);

  return (
    <section className="screen-section no-scrollbar px-5 pt-4 pb-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary px-3 py-1 text-[11.5px]"
            >
              ‹ Back
            </button>
          )}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
              Personalize Your Experience
            </span>
            <h2 className="font-serif text-[23px] font-semibold text-primary leading-tight">
              Settings &amp; Preferences
            </h2>
          </div>
        </div>
      </div>

      {/* 9a: Live Search Settings Bar */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-[13px] pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search settings (e.g., Arabic, Theme, Haptics, Reset)..."
          className="w-full py-2.5 pl-9 pr-9 rounded-full bg-[#F3EFE2] border border-[#D5D2BE] text-primary text-[12.5px] font-medium shadow-soft-card focus:outline-none focus:border-[#0D4A2E]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#EAE8D7] text-primary text-[11px] font-bold flex items-center justify-center"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick Display Name Card */}
      {showNameCard && (
        <div className="card rounded-[20px] p-3.5 bg-[#F3EFE2] border border-[#D5D2BE] flex items-center justify-between gap-2">
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
              Primary Circle Member Name
            </label>
            <input
              type="text"
              value={state?.userName || ''}
              onChange={(e) =>
                updateState && updateState({ userName: e.target.value })
              }
              placeholder="Your Name (e.g. Ubaid)"
              className="w-full bg-[#F5F2E8] text-primary text-[13px] font-semibold py-1.5 px-3 rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Empty Search State */}
      {filteredGroups.length === 0 && !showNameCard && (
        <div className="card rounded-[20px] p-6 text-center space-y-2 fade-in">
          <span className="text-[22px]">🔍</span>
          <p className="font-serif text-[16px] font-semibold text-primary">
            No settings matched &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-[11.5px] text-secondary">
            Try searching for Language, Arabic, Theme, Audio, Haptics, or Privacy.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="btn-secondary px-4 py-1.5 text-[11.5px] font-semibold mt-1"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Categorized Settings Directory */}
      {filteredGroups.map((group) => (
        <div key={group.groupTitle} className="space-y-2">
          <h3 className="font-serif text-[15.5px] font-semibold text-[#0D4A2E] px-0.5">
            {group.groupTitle}
          </h3>

          <div className="space-y-2">
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  try {
                    if (navigator.vibrate) navigator.vibrate(8);
                  } catch (_) {}
                  setActiveSubScreen(item.id);
                }}
                className="w-full text-left rounded-[18px] bg-[#F3EFE2] border border-white/90 shadow-soft-card p-3 flex items-center justify-between gap-2.5 active:scale-[0.99] transition"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#165534] to-[#08351D] text-[#F0D58C] flex items-center justify-center text-[16px] shrink-0 shadow-sm">
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-serif text-[14.5px] font-semibold text-primary truncate">
                        {item.title}
                      </h4>
                      {item.badge && (
                        <span className="px-2 py-0.2 rounded-full bg-[#DCE3C8] text-[#0D4A2E] text-[9px] font-bold uppercase shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-secondary truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <span className="text-primary font-bold text-[15px] pr-1 shrink-0">
                  ›
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}