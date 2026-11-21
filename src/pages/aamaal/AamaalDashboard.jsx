import React, { useState, useEffect } from 'react';
import AamaalCategories, { DEFAULT_AAMAAL_LIST } from './AamaalCategories';
import AamaalDetails from './AamaalDetails';
import DailyCompletion from './DailyCompletion';
import DateSelector, { getLocalDateString, formatAnyDatePretty } from './DateSelector';
import CalendarHistory, { getLocalDaysList } from './CalendarHistory';
import DailyHistory from './DailyHistory';
import MonthlyReport from './MonthlyReport';
import AamaalReport from './AamaalReport';
import PrivacySettings from './PrivacySettings';

const LOGS_STORAGE_KEY = 'aamaal_circle_logs_v1';
const PROFILES_STORAGE_KEY = 'aamaal_circle_profiles_v1';
const ACTIVE_PROFILE_KEY = 'aamaal_active_profile_id';

export default function AamaalDashboard({
  state,
  updateState,
  onShowToast,
  onBack,
}) {
  const [currentView, setCurrentView] = useState('daily'); // 'daily' | 'monthly' | 'stats'
  const [aamaalList] = useState(DEFAULT_AAMAAL_LIST);
  const [activeAamaal, setActiveAamaal] = useState(DEFAULT_AAMAAL_LIST[0]);
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Profiles State (Supports Primary User + Family Members)
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
        createdAt: Date.now(),
      },
    ];
  });

  // Read the selected profile from localStorage / global state instead of hardcoding primary_member
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

  // Keep synced if activeProfileId changes in global App state
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

  const handleSwitchProfile = (member) => {
    if (!member) return;
    setActiveProfileId(member.id);
    try {
      localStorage.setItem(ACTIVE_PROFILE_KEY, String(member.id));
    } catch (_) {}
    if (updateState) {
      updateState({
        activeProfileId: member.id,
        activeProfileName: member.name,
      });
    }
  };

  // Recitation Logs State
  const [allLogs, setAllLogs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LOGS_STORAGE_KEY) || 'null');
      if (Array.isArray(saved)) return saved;
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    } catch (_) {}
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(allLogs));
    } catch (_) {}
  }, [allLogs]);

  // Keep Primary Profile Name synced if updated in App.jsx state
  useEffect(() => {
    if (state?.userName && state.userName.trim() !== '') {
      setProfiles((prev) =>
        prev.map((p) =>
          p.isPrimary && p.name === 'Circle Member'
            ? { ...p, name: state.userName.trim() }
            : p
        )
      );
    }
  }, [state?.userName]);

  const todayLocal = getLocalDateString();
  const last30Days = getLocalDaysList(30);
  const last7DaysKeys = new Set(getLocalDaysList(7).map((d) => d.dateKey));

  const friendlyDateLabel =
    selectedDate === todayLocal
      ? 'Today'
      : last30Days.find((d) => d.dateKey === selectedDate)?.prettyLabel ||
        formatAnyDatePretty(selectedDate);

  // Filter logs for current profile & current Aamaal
  const myAamaalLogs = allLogs.filter(
    (l) =>
      String(l.memberId) === String(activeProfile.id) &&
      l.aamaalId === activeAamaal.id
  );

  const logsByDate = {};
  myAamaalLogs.forEach((l) => {
    logsByDate[l.dateKey] = Number(l.count || 0);
  });

  const selectedDateCount = Number(logsByDate[selectedDate] || 0);
  const myTodayTotal = Number(logsByDate[todayLocal] || 0);
  const myWeekTotal = myAamaalLogs
    .filter((l) => last7DaysKeys.has(l.dateKey))
    .reduce((sum, l) => sum + Number(l.count || 0), 0);

  const handleSaveOrUpdateLog = (newCount) => {
    const logId = `${selectedDate}_${activeAamaal.id}_${activeProfile.id}`;
    setAllLogs((prev) => {
      const filtered = prev.filter((l) => l.id !== logId);
      if (newCount <= 0) return filtered;
      return [
        ...filtered,
        {
          id: logId,
          aamaalId: activeAamaal.id,
          memberId: activeProfile.id,
          dateKey: selectedDate,
          count: Number(newCount),
          updatedAt: Date.now(),
        },
      ];
    });

    if (updateState && newCount > 0) {
      updateState((prev) => ({
        ...prev,
        dhikrCount: (prev.dhikrCount || 0) + Number(newCount),
        sessionsCount: (prev.sessionsCount || 0) + 1,
      }));
    }

    if (onShowToast) {
      onShowToast(
        newCount > 0
          ? `MashaAllah! Logged ${newCount.toLocaleString('en-US')} ${activeAamaal.name}`
          : `${activeAamaal.name} log cleared`
      );
    }
  };

  // Sub-View B: Monthly Report & Missed Days
  if (currentView === 'monthly') {
    return (
      <MonthlyReport
        aamaalList={aamaalList}
        initialAamaalId={activeAamaal.id}
        activeProfile={activeProfile}
        allLogs={allLogs}
        onSelectDateAndJump={(dateKey, chosenAamaal) => {
          setSelectedDate(dateKey);
          if (chosenAamaal) setActiveAamaal(chosenAamaal);
          setCurrentView('daily');
        }}
        onBack={() => setCurrentView('daily')}
      />
    );
  }

  // Sub-View C: Worldwide Group Statistics
  if (currentView === 'stats') {
    return (
      <AamaalReport
        activeAamaal={activeAamaal}
        activeProfile={activeProfile}
        allMembers={profiles}
        allLogs={allLogs}
        onBack={() => setCurrentView('daily')}
      />
    );
  }

  // Main View A: Daily Aamaal Screen
  return (
    <section className="screen-section no-scrollbar px-4 pt-4 pb-6">
      {/* Top Bar: Back Button · Centered Family Profile Switcher · Invisible Spacer */}
      <div className="flex items-center justify-between relative mb-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="w-9 h-9 rounded-full bg-[#F3EFE2] border border-[#D5D2BE] shadow-soft-card flex items-center justify-center text-[#0D4A2E] font-bold text-[18px] active:scale-95 transition shrink-0"
          >
            ‹
          </button>
        ) : (
          <div className="w-9 h-9 shrink-0" aria-hidden="true" />
        )}

        {/* Quick Member / Family Switcher Dropdown (Stays Dead-Center) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="px-4 py-1.5 rounded-full bg-[#F3EFE2] border border-[#D5D2BE] shadow-sm flex items-center space-x-2 text-[13px] font-bold text-primary"
          >
            <span>
              {activeProfile.flag && activeProfile.flag !== '????'
                ? activeProfile.flag
                : '🇮🇳'}{' '}
              {activeProfile.name}
            </span>
            <span className="text-[10px]">▾</span>
          </button>

          {showProfileMenu && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-52 rounded-[16px] bg-[#F5F2E8] border border-[#D5D2BE] shadow-xl p-1.5 z-40">
              {profiles.map((prof) => {
                const isCurrent = String(prof.id) === String(activeProfile.id);
                return (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => {
                      handleSwitchProfile(prof);
                      setShowProfileMenu(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-left text-[12.5px] flex items-center justify-between ${
                      isCurrent
                        ? 'bg-[#0D4A2E] text-white font-bold'
                        : 'text-primary hover:bg-[#EAE8D7]'
                    }`}
                  >
                    <span className="truncate">
                      {prof.flag && prof.flag !== '????' ? prof.flag : '🇮🇳'}{' '}
                      {prof.name}
                    </span>
                    {isCurrent && <span className="text-[#F0D58C]">✓</span>}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  setShowPrivacyModal(true);
                }}
                className="w-full mt-1 pt-1.5 border-t border-[#DCD8C6] text-center text-[11.5px] font-bold text-[#135332] py-1"
              >
                + Add Family Member
              </button>
            </div>
          )}
        </div>

        {/* Invisible Right Spacer so Profile Switcher stays perfectly centered */}
        <div className="w-9 h-9 shrink-0" aria-hidden="true" />
      </div>

      {/* 1. Aamaal Category Tabs (Durood Shareef, Surah Mulk, 100 Istighfar) */}
      <AamaalCategories
        aamaalList={aamaalList}
        activeAamaal={activeAamaal}
        onSelectAamaal={(item) => {
          setActiveAamaal(item);
          setSelectedDate(getLocalDateString());
        }}
      />

      {/* 2. Aamaal Title, Arabic Calligraphy & Optional Meaning */}
      <AamaalDetails aamaal={activeAamaal} />

      {/* 3. Daily Target Card (Mark as Recited / +100 +313 +500 / Undo) */}
      <DailyCompletion
        aamaal={activeAamaal}
        friendlyDateLabel={friendlyDateLabel}
        loggedCount={selectedDateCount}
        onMarkRecited={(targetVal) => handleSaveOrUpdateLog(targetVal)}
        onUpdateCount={(newVal) => handleSaveOrUpdateLog(newVal)}
        onUndoCount={() => handleSaveOrUpdateLog(0)}
      />

      {/* 4. 30-Day Sliding Strip + Date Picker */}
      <DateSelector
        selectedDate={selectedDate}
        onSelectDate={(d) => setSelectedDate(d)}
        onResetToToday={(todayStr) => setSelectedDate(todayStr)}
      />

      <CalendarHistory
        selectedDate={selectedDate}
        onSelectDate={(d) => setSelectedDate(d)}
        logsByDate={logsByDate}
        numDays={30}
      />

      {/* 5. Personal Stats Cards (This Week & Today) */}
      <DailyHistory
        aamaalName={activeAamaal.name}
        weekTotal={myWeekTotal}
        todayTotal={myTodayTotal}
      />

      {/* 6. Prominent Button: View My Monthly Report & Missed Days */}
      <button
        type="button"
        onClick={() => setCurrentView('monthly')}
        className="w-full rounded-full bg-gradient-to-r from-[#0F4C2B] to-[#165534] text-white px-4 py-3.5 flex items-center justify-between shadow-md mb-2.5 border border-[#C99E4C]/40"
      >
        <span className="text-[15px]">📅</span>
        <span className="text-[13px] font-bold text-[#F0D58C]">
          View My Monthly Report &amp; Missed Days
        </span>
        <span className="text-[#F0D58C] font-bold">›</span>
      </button>

      {/* 7. Bottom Worldwide Circle Summary Pill Button */}
      <button
        type="button"
        onClick={() => setCurrentView('stats')}
        className="w-full rounded-full bg-[#F3EFE2] border border-[#C9CDAC] px-4 py-3 flex items-center justify-between shadow-soft-card"
      >
        <span className="text-secondary font-bold">«</span>
        <span className="text-[12.5px] font-semibold text-primary">
          View the total number of {activeAamaal.name} recited
        </span>
        <span className="text-secondary font-bold">»</span>
      </button>

      {/* 8. Family & Privacy Modal (Opened via "+ Add Family Member") */}
      <PrivacySettings
        isOpen={showPrivacyModal}
        activeProfile={activeProfile}
        onClose={() => setShowPrivacyModal(false)}
        onSaveProfileSettings={(updates) => {
          setProfiles((prev) =>
            prev.map((p) => (p.id === activeProfile.id ? { ...p, ...updates } : p))
          );
          if (activeProfile.isPrimary && updates.name && updateState) {
            updateState({ userName: updates.name });
          }
          if (onShowToast) onShowToast('Profile & privacy updated');
        }}
        onAddFamilyMember={(rawName) => {
          const primaryName = profiles[0]?.name?.split(/\s+/)[0] || 'Member';
          const formattedName =
            rawName.includes("'s") || rawName.includes('’s')
              ? rawName
              : `${primaryName}'s ${rawName}`;
          const newFam = {
            id: `fam_${Date.now()}`,
            name: formattedName,
            country: activeProfile.country || 'India',
            flag:
              activeProfile.flag && activeProfile.flag !== '????'
                ? activeProfile.flag
                : '🇮🇳',
            privacy: 'public',
            isPrimary: false,
            createdAt: Date.now(),
          };
          setProfiles((prev) => [...prev, newFam]);
          handleSwitchProfile(newFam);
          if (onShowToast) onShowToast(`${formattedName} added to your circle!`);
        }}
      />
    </section>
  );
}