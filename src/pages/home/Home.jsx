//The master Home Dashboard uniting all 11 components (ProfileSwitcher, GlobalSearch, SearchResults, TodayProgress, ProgressDetails, QuickActions, AllShortcuts, FeaturedDua, ContinueReading, DailyReflection, and ReminderDetails) and staying 100% synced with aamaal_circle_profiles_v1 and aamaal_circle_logs_v1.

import React, { useState, useEffect } from 'react';
import { getLocalDateString } from '../aamaal/DateSelector';
import { getLocalDaysList } from '../aamaal/CalendarHistory';
import ProfileSwitcher from './ProfileSwitcher';
import GlobalSearch from './GlobalSearch';
import SearchResults from './SearchResults';
import TodayProgress from './TodayProgress';
import ProgressDetails from './ProgressDetails';
import QuickActions from './QuickActions';
import AllShortcuts from './AllShortcuts';
import FeaturedDua from './FeaturedDua';
import ContinueReading from './ContinueReading';
import DailyReflection from './DailyReflection';
import ReminderDetails from './ReminderDetails';

const LOGS_STORAGE_KEY = 'aamaal_circle_logs_v1';
const PROFILES_STORAGE_KEY = 'aamaal_circle_profiles_v1';

export default function Home({
  state,
  updateState,
  onNavigateTab,
  onSearchDuas,
  onOpenModal,
  onToggleReminders,
  onToggleBookmark,
  onShowToast,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProgressDetails, setShowProgressDetails] = useState(false);
  const [showAllShortcuts, setShowAllShortcuts] = useState(false);

  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PROFILES_STORAGE_KEY) || 'null');
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch (_) {}
    return [
      {
        id: 'primary_member',
        name: state?.userName?.trim() || 'Circle Member',
        country: 'India',
        flag: '🇮🇳',
        privacy: 'public',
        isPrimary: true,
      },
    ];
  });

  const [activeProfileId, setActiveProfileId] = useState('primary_member');
  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const [allLogs, setAllLogs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LOGS_STORAGE_KEY) || 'null');
      if (Array.isArray(saved)) return saved;
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(allLogs));
    } catch (_) {}
  }, [allLogs]);

  const todayKey = getLocalDateString();
  const weekKeys = new Set(getLocalDaysList(7).map((d) => d.dateKey));

  const todayMemberLogs = allLogs.filter(
    (l) => l.memberId === activeProfile.id && l.dateKey === todayKey
  );

  const weekTotalCount = allLogs
    .filter((l) => l.memberId === activeProfile.id && weekKeys.has(l.dateKey))
    .reduce((sum, l) => sum + Number(l.count || 0), 0);

  const handleQuickLogAamaal = (aamaalObj, newCount) => {
    const logId = `${todayKey}_${aamaalObj.id}_${activeProfile.id}`;
    setAllLogs((prev) => {
      const filtered = prev.filter((l) => l.id !== logId);
      if (newCount <= 0) return filtered;
      return [
        ...filtered,
        {
          id: logId,
          aamaalId: aamaalObj.id,
          memberId: activeProfile.id,
          dateKey: todayKey,
          count: Number(newCount),
          updatedAt: Date.now(),
        },
      ];
    });

    if (onShowToast) {
      onShowToast(
        newCount > 0
          ? `MashaAllah! Logged ${newCount} ${aamaalObj.name}`
          : `Cleared ${aamaalObj.name} for today`
      );
    }
  };

  const handleBookmarkFeatured = (duaId) => {
    if (onToggleBookmark) {
      onToggleBookmark(duaId);
    } else if (updateState) {
      updateState((prev) => {
        const list = prev.savedDuaIds || [];
        const exists = list.includes(duaId);
        return {
          ...prev,
          savedDuaIds: exists
            ? list.filter((id) => id !== duaId)
            : [...list, duaId],
        };
      });
    }
  };

  return (
    <section className="screen-section no-scrollbar px-5 pt-4 pb-6">
      {/* 1. Greeting & Active Family Profile Switcher */}
      <ProfileSwitcher
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={(id) => {
          setActiveProfileId(id);
          const found = profiles.find((p) => p.id === id);
          if (found && onShowToast) {
            onShowToast(`Switched to ${found.name}`);
          }
        }}
        onOpenAccountPage={() => onNavigateTab && onNavigateTab('account')}
      />

      {/* 2. Global Search Bar & Live Search Results */}
      <GlobalSearch
        query={searchQuery}
        onChangeQuery={setSearchQuery}
        onClearQuery={() => setSearchQuery('')}
      />

      <SearchResults
        query={searchQuery}
        onNavigateTab={onNavigateTab}
        onSearchDuas={onSearchDuas}
        onCloseSearch={() => setSearchQuery('')}
      />

      {/* 3. Today's Hero Aamaal Progress Card */}
      <TodayProgress
        activeProfile={activeProfile}
        todayLogs={todayMemberLogs}
        streakDays={state?.streakDays || 1}
        dhikrCount={state?.dhikrCount || weekTotalCount}
        onOpenProgressDetails={() =>
          setShowProgressDetails(!showProgressDetails)
        }
        onOpenAamaalTracker={() => onNavigateTab && onNavigateTab('aamaal')}
      />

      {/* 4. Expandable Quick Log & Progress Breakdown */}
      {showProgressDetails && (
        <ProgressDetails
          activeProfile={activeProfile}
          todayLogs={todayMemberLogs}
          weekTotalCount={weekTotalCount}
          onQuickLogAamaal={handleQuickLogAamaal}
          onOpenFullReport={() => onNavigateTab && onNavigateTab('aamaal')}
          onClose={() => setShowProgressDetails(false)}
        />
      )}

      {/* 5. Quick Actions Grid + All Shortcuts Drawer */}
      <QuickActions
        onNavigateTab={onNavigateTab}
        onOpenAllShortcuts={() => setShowAllShortcuts(!showAllShortcuts)}
      />

      {showAllShortcuts && (
        <AllShortcuts
          onNavigateTab={onNavigateTab}
          onClose={() => setShowAllShortcuts(false)}
        />
      )}

      {/* 6. Featured Daily Dua (Pure Arabic + Multi-Language Translation) */}
      <FeaturedDua
        savedDuaIds={state?.savedDuaIds || []}
        onToggleBookmark={handleBookmarkFeatured}
        onOpenDuasTab={() => onNavigateTab && onNavigateTab('duas')}
      />

      {/* 7. Continue Reading Seerah Lesson */}
      <ContinueReading
        currentLesson={state?.storyLesson || 1}
        onAdvanceLesson={(nextNum) => {
          if (updateState) updateState({ storyLesson: nextNum });
          if (onShowToast) onShowToast(`Unlocked Lesson ${nextNum}!`);
        }}
      />

      {/* 8. Daily Prophetic Reflection */}
      <DailyReflection />

      {/* 9. Gentle Sunnah Reminders Manager */}
      <ReminderDetails
        remindersActive={Boolean(state?.remindersCount !== 0)}
        onToggleGlobalReminders={onToggleReminders}
        onShowToast={onShowToast}
      />
    </section>
  );
}