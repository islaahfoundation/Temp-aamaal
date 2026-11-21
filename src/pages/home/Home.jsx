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
import ReminderDetails from './ReminderDetails';
import NotificationCenter from '../notifications/NotificationCenter';
import headerBg from '../../assets/backgrounds/header.png';

const LOGS_STORAGE_KEY = 'aamaal_circle_logs_v1';
const PROFILES_STORAGE_KEY = 'aamaal_circle_profiles_v1';
const ACTIVE_PROFILE_KEY = 'aamaal_active_profile_id';
const REMINDERS_STORAGE_KEY = 'aamaal_reminders_list_v1';
const BROADCASTS_STORAGE_KEY = 'aamaal_broadcast_alerts_v1';

export default function Home({
  state,
  updateState,
  onNavigateTab,
  onSearchDuas,
  onToggleReminders,
  onToggleBookmark,
  onShowToast,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProgressDetails, setShowProgressDetails] = useState(false);
  const [showAllShortcuts, setShowAllShortcuts] = useState(false);
  const [showAlertInbox, setShowAlertInbox] = useState(false);

  const [profiles] = useState(() => {
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

  const [activeProfileId, setActiveProfileId] = useState(() => {
    try {
      return (
        localStorage.getItem(ACTIVE_PROFILE_KEY) ||
        state?.activeProfileId ||
        'primary_member'
      );
    } catch (_) {
      return state?.activeProfileId || 'primary_member';
    }
  });

  useEffect(() => {
    if (
      state?.activeProfileId &&
      String(state.activeProfileId) !== String(activeProfileId)
    ) {
      setActiveProfileId(state.activeProfileId);
    }
  }, [state?.activeProfileId]);

  const activeProfile =
    profiles.find((p) => String(p.id) === String(activeProfileId)) || profiles[0];

  const [allLogs, setAllLogs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LOGS_STORAGE_KEY) || 'null');
      if (Array.isArray(saved)) return saved;
    } catch (_) {}
    return [];
  });

  const [inboxAlerts, setInboxAlerts] = useState(() => {
    try {
      const broadcasts = JSON.parse(
        localStorage.getItem(BROADCASTS_STORAGE_KEY) || '[]'
      );
      const reminders = JSON.parse(
        localStorage.getItem(REMINDERS_STORAGE_KEY) || '[]'
      );
      return [
        ...(Array.isArray(broadcasts) ? broadcasts : []),
        ...(Array.isArray(reminders) ? reminders : []),
      ];
    } catch (_) {
      return [];
    }
  });

  // Refresh alert inbox whenever popup opens
  const refreshAlertInbox = () => {
    try {
      const broadcasts = JSON.parse(
        localStorage.getItem(BROADCASTS_STORAGE_KEY) || '[]'
      );
      const reminders = JSON.parse(
        localStorage.getItem(REMINDERS_STORAGE_KEY) || '[]'
      );
      setInboxAlerts([
        ...(Array.isArray(broadcasts) ? broadcasts : []),
        ...(Array.isArray(reminders) ? reminders : []),
      ]);
    } catch (_) {}
  };

  useEffect(() => {
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(allLogs));
    } catch (_) {}
  }, [allLogs]);

  const todayKey = getLocalDateString();
  const weekKeys = new Set(getLocalDaysList(7).map((d) => d.dateKey));

  const todayMemberLogs = allLogs.filter(
    (l) =>
      String(l.memberId) === String(activeProfile.id) && l.dateKey === todayKey
  );

  const weekTotalCount = allLogs
    .filter(
      (l) =>
        String(l.memberId) === String(activeProfile.id) &&
        weekKeys.has(l.dateKey)
    )
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

  const handleMarkAllAlertsRead = () => {
    const updated = inboxAlerts.map((item) => ({ ...item, read: true }));
    setInboxAlerts(updated);
    try {
      const broadcasts = JSON.parse(
        localStorage.getItem(BROADCASTS_STORAGE_KEY) || '[]'
      );
      if (Array.isArray(broadcasts)) {
        localStorage.setItem(
          BROADCASTS_STORAGE_KEY,
          JSON.stringify(broadcasts.map((b) => ({ ...b, read: true })))
        );
      }
      const reminders = JSON.parse(
        localStorage.getItem(REMINDERS_STORAGE_KEY) || '[]'
      );
      if (Array.isArray(reminders)) {
        localStorage.setItem(
          REMINDERS_STORAGE_KEY,
          JSON.stringify(reminders.map((r) => ({ ...r, read: true })))
        );
      }
    } catch (_) {}
    if (onShowToast) onShowToast('All alerts marked as read');
  };

  const unreadAlertsCount = inboxAlerts.filter((a) => !a.read).length;

  return (
    <section className="screen-section no-scrollbar relative px-4 pt-2 pb-6 overflow-x-hidden">
      {/* Top-Right Sunlit Mosque Hero Illustration Backdrop */}
      <div
        className="absolute top-0 right-0 w-[68%] h-60 pointer-events-none select-none overflow-hidden opacity-90"
        style={{
          maskImage:
            'radial-gradient(circle at 80% 32%, black 35%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(circle at 80% 32%, black 35%, transparent 78%)',
        }}
      >
        <img
  src={headerBg}
  alt=""
  className="w-full h-full object-cover object-center scale-105"
/>
      </div>

      {/* 1. Header Logo + Assalamu Alaikum / Your Spiritual Journey */}
      <div className="relative z-10">
        <ProfileSwitcher
          profiles={profiles}
          activeProfile={activeProfile}
          unreadAlertsCount={unreadAlertsCount}
          onSelectProfile={(id) => {
            setActiveProfileId(id);
            const found = profiles.find((p) => String(p.id) === String(id));
            try {
              localStorage.setItem(ACTIVE_PROFILE_KEY, String(id));
            } catch (_) {}
            if (updateState) {
              updateState({
                activeProfileId: id,
                activeProfileName: found?.name || '',
              });
            }
            if (found && onShowToast) {
              onShowToast(`Active profile: ${found.name}`);
            }
          }}
          onOpenAccountPage={() => onNavigateTab && onNavigateTab('account')}
          onOpenAlertInbox={() => {
            refreshAlertInbox();
            setShowAlertInbox(true);
          }}
          onOpenSettings={() => onNavigateTab && onNavigateTab('settings')}
        />

        {/* 2. Search Pill ("Search duas, reflections...") */}
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

        {/* 3. Today's Progress Card with 0% Circle Ring & Dhikr | Sessions | Reminders */}
        <TodayProgress
          todayLogs={todayMemberLogs}
          dhikrCount={state?.dhikrCount || 0}
          sessionsCount={state?.sessionsCount || 0}
          remindersCount={state?.remindersCount ?? 1}
          onOpenProgressDetails={() => setShowProgressDetails(true)}
          onOpenAamaalTracker={() => onNavigateTab && onNavigateTab('aamaal')}
        />

        {/* 4. Quick Actions (Tasbih | Duas | Stories | Saved) */}
        <QuickActions
          onNavigateTab={onNavigateTab}
          onOpenAllShortcuts={() => setShowAllShortcuts(true)}
          onOpenStories={() => onNavigateTab && onNavigateTab('stories')}
          onOpenSavedDuas={() => {
            try {
              localStorage.setItem('aamaal_open_saved_duas', 'true');
            } catch (_) {}
            if (updateState) updateState({ activeDuaFilter: 'saved' });
            if (onNavigateTab) onNavigateTab('duas');
          }}
        />

        {/* 5. Daily Featured Dua Split Card */}
        <FeaturedDua
          savedDuaIds={state?.savedDuaIds || []}
          onToggleBookmark={onToggleBookmark}
          onOpenDuasTab={() => onNavigateTab && onNavigateTab('duas')}
        />

        {/* 6. Continue Reading ("The Valley of Makkah") */}
        <ContinueReading
          currentLesson={state?.storyLesson || 2}
          onAdvanceLesson={(nextNum) => {
            if (updateState) updateState({ storyLesson: nextNum });
            if (onShowToast) onShowToast(`Unlocked Lesson ${nextNum}!`);
          }}
        />

        {/* 7. Bottom Thursday Salawat Reminder Card */}
        <ReminderDetails
          remindersActive={Boolean(state?.remindersCount !== 0)}
          onToggleGlobalReminders={onToggleReminders}
        />
      </div>

      {/* ================= POPUP MODALS ================= */}

      {/* Today's Progress Details Popup */}
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

      {/* Quick Actions "See All" Popup */}
      {showAllShortcuts && (
        <AllShortcuts
          onNavigateTab={onNavigateTab}
          onClose={() => setShowAllShortcuts(false)}
        />
      )}

      {/* Notification Bell -> Alert Inbox Only Popup */}
      {showAlertInbox && (
        <div
          onClick={() => setShowAlertInbox(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-[24px] p-4 bg-[#F5F2E8] border-2 border-[#C99E4C] shadow-2xl space-y-3 max-h-[82vh] overflow-y-auto no-scrollbar"
          >
            <div className="flex items-center justify-between pb-1 border-b border-[#DCD8C6]">
              <span className="badge-pill">Alert Inbox</span>
              <button
                type="button"
                onClick={() => setShowAlertInbox(false)}
                className="w-7 h-7 rounded-full bg-[#EAE8D7] flex items-center justify-center text-primary font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <NotificationCenter
              notifications={inboxAlerts}
              onSelectNotification={(item) => {
                setInboxAlerts((prev) =>
                  prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
                );
                if (onShowToast) onShowToast(item.title);
              }}
              onMarkAllRead={handleMarkAllAlertsRead}
            />
          </div>
        </div>
      )}
    </section>
  );
}