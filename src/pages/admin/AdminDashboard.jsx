//The master controller for src/pages/admin/ that unites all 20 Admin Panel files with clean sub-navigation tabs (All-in-One Inspector, Monthly Reports, Manage Aamaal, Members & Roles, and Analytics) and persists changes across localStorage so your AamaalDashboard and AccountDashboard stay 100% synchronized.

// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { DEFAULT_AAMAAL_LIST } from '../aamaal/AamaalCategories';
import { getLocalDateString } from '../aamaal/DateSelector';
import AdminDataExport from './AdminDataExport';
import AdminActivityLog from './AdminActivityLog';
import AdminMonthlyReports from './AdminMonthlyReports';
import CircleStatistics from './CircleStatistics';
import CountryStatistics from './CountryStatistics';
import Leaderboard from './Leaderboard';
import AamaalManagement from './AamaalManagement';
import MemberDirectory from './MemberDirectory';

const AAMAAL_STORAGE_KEY = 'aamaal_circle_catalog_v1';
const LOGS_STORAGE_KEY = 'aamaal_circle_logs_v1';
const PROFILES_STORAGE_KEY = 'aamaal_circle_profiles_v1';
const BROADCASTS_STORAGE_KEY = 'aamaal_broadcast_alerts_v1';
const JAMAAT_REQUESTS_KEY = 'aamaal_jamaat_change_requests_v1';
const MASJIDS_STORAGE_KEY = 'aamaal_masjids_directory_v1';

const CMS_KEYS = {
  feelings: 'aamaal_admin_cms_feelings_v1',
  duas: 'aamaal_admin_cms_duas_v1',
  stories: 'aamaal_admin_cms_stories_v1',
  learning: 'aamaal_admin_cms_learning_v1',
  quiz: 'aamaal_admin_cms_quiz_v1',
  masjids: MASJIDS_STORAGE_KEY,
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Recently';
  const diffMs = Math.max(0, Date.now() - Number(timestamp));
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function checkIsCurrentUserAdmin(state) {
  try {
    const profiles = JSON.parse(localStorage.getItem(PROFILES_STORAGE_KEY) || '[]');
    if (Array.isArray(profiles) && profiles.length > 0) {
      const primary = profiles.find((p) => p.isPrimary) || profiles[0];
      if (primary?.role === 'admin') return true;
    }
  } catch (_) {}
  const name = (state?.userName || '').toLowerCase();
  return name.includes('ubaid');
}

async function triggerBroadcastPwaNotification(title, body) {
  try {
    if (navigator.vibrate) navigator.vibrate([150, 80, 150]);
  } catch (_) {}
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg?.showNotification) {
        await reg.showNotification(title, {
          body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: `aamaal_broadcast_${Date.now()}`,
        });
        return;
      }
    }
    new Notification(title, { body });
  } catch (_) {}
}

export default function AdminDashboard({
  state,
  updateState,
  onShowToast,
  onBack,
}) {
  const isAdmin = checkIsCurrentUserAdmin(state);

  // Active module: null | 'more_tools' | 'inspector' | 'monthly' | 'aamaal' | 'members' | 'stats' | 'jamaat_requests' | 'cms' | 'broadcast'
  const [activePopup, setActivePopup] = useState(null);

  const [inspectorDate, setInspectorDate] = useState(getLocalDateString());
  const [inspectorAamaalId, setInspectorAamaalId] = useState('durood_313');

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const [aamaalList, setAamaalList] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(AAMAAL_STORAGE_KEY) || 'null');
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch (_) {}
    return DEFAULT_AAMAAL_LIST;
  });

  const [allMembers, setAllMembers] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PROFILES_STORAGE_KEY) || 'null');
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch (_) {}
    return [
      {
        id: 'primary_member',
        parentUid: 'primary_member',
        name: state?.userName?.trim() || 'Ubaid',
        country: 'India',
        flag: '🇮🇳',
        privacy: 'public',
        role: 'admin',
        isPrimary: true,
        createdAt: Date.now(),
      },
    ];
  });

  const [allLogs, setAllLogs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LOGS_STORAGE_KEY) || 'null');
      if (Array.isArray(saved)) return saved;
    } catch (_) {}
    return [];
  });

  const [jamaatRequests, setJamaatRequests] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(JAMAAT_REQUESTS_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (_) {
      return [];
    }
  });

  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');

  const [cmsModule, setCmsModule] = useState('feelings');
  const [cmsForm, setCmsForm] = useState({
    title: '',
    category: '',
    keywords: '',
    arabic: '',
    translation: '',
    quranStory: '',
    sunnahStory: '',
    extraField: '',
  });

  useEffect(() => {
    try {
      localStorage.setItem(AAMAAL_STORAGE_KEY, JSON.stringify(aamaalList));
    } catch (_) {}
  }, [aamaalList]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(allMembers));
    } catch (_) {}
  }, [allMembers]);

  useEffect(() => {
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(allLogs));
    } catch (_) {}
  }, [allLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(JAMAAT_REQUESTS_KEY, JSON.stringify(jamaatRequests));
    } catch (_) {}
  }, [jamaatRequests]);

  const shiftMonth = (delta) => {
    try {
      if (navigator.vibrate) navigator.vibrate(8);
    } catch (_) {}
    setSelectedMonth((prev) => {
      const nextDate = new Date(prev.year, prev.month + delta, 1);
      return { year: nextDate.getFullYear(), month: nextDate.getMonth() };
    });
  };

  const monthlyStats = useMemo(() => {
    const currPrefix = `${selectedMonth.year}-${String(
      selectedMonth.month + 1
    ).padStart(2, '0')}`;
    const prevDate = new Date(selectedMonth.year, selectedMonth.month - 1, 1);
    const prevPrefix = `${prevDate.getFullYear()}-${String(
      prevDate.getMonth() + 1
    ).padStart(2, '0')}`;

    const currLogs = allLogs.filter((l) =>
      String(l.dateKey || '').startsWith(currPrefix)
    );
    const prevLogs = allLogs.filter((l) =>
      String(l.dateKey || '').startsWith(prevPrefix)
    );

    const totalRecitations = currLogs.reduce(
      (sum, l) => sum + Number(l.count || 0),
      0
    );
    const prevRecitations = prevLogs.reduce(
      (sum, l) => sum + Number(l.count || 0),
      0
    );

    const activeMemberIds = new Set(
      currLogs.filter((l) => Number(l.count || 0) > 0).map((l) => l.memberId)
    );

    const adminsCount = allMembers.filter((m) => m.role === 'admin').length;

    let pctChange = 0;
    if (prevRecitations > 0) {
      pctChange = Math.round(
        ((totalRecitations - prevRecitations) / prevRecitations) * 100
      );
    } else if (totalRecitations > 0) {
      pctChange = 100;
    }

    return {
      totalMembers: allMembers.length,
      activeMembers: activeMemberIds.size,
      adminsCount: adminsCount || 1,
      totalRecitations,
      pctChange,
    };
  }, [allLogs, allMembers, selectedMonth]);

  const recentActivities = useMemo(() => {
    const memberMap = new Map(allMembers.map((m) => [m.id, m]));
    const aamaalMap = new Map(aamaalList.map((a) => [a.id, a]));

    const logEvents = allLogs
      .filter((l) => Number(l.count || 0) > 0)
      .map((l) => {
        const member = memberMap.get(l.memberId);
        const aamaal = aamaalMap.get(l.aamaalId);
        const aamaalLabel = aamaal?.name || l.aamaalId || 'Aamaal';
        return {
          id: `log_${l.id}`,
          type: 'log',
          name: member?.name || 'Circle Member',
          avatar: member?.avatar || null,
          actionText: `completed ${
            Number(l.count) > 1 ? `${l.count} ` : ''
          }${aamaalLabel}`,
          timestamp: l.updatedAt || Date.parse(l.dateKey) || 0,
        };
      });

    const joinEvents = allMembers
      .filter((m) => m.createdAt)
      .map((m) => ({
        id: `join_${m.id}`,
        type: 'join',
        name: m.name || 'New member',
        avatar: m.avatar || null,
        actionText: 'joined the circle',
        timestamp: Number(m.createdAt) || 0,
      }));

    return [...logEvents, ...joinEvents]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 4);
  }, [allLogs, allMembers, aamaalList]);

  if (!isAdmin) {
    return (
      <section className="screen-section no-scrollbar px-5 pt-10 pb-6 text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-[#EAE8D7] flex items-center justify-center text-[24px] mx-auto">
          🔒
        </div>
        <h2 className="font-serif text-[21px] font-semibold text-primary">
          Admin Access Restricted
        </h2>
        <p className="text-[12.5px] text-secondary max-w-xs mx-auto">
          This area is only visible to Circle Administrators.
        </p>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn-primary px-5 py-2.5 text-[12.5px] font-semibold"
          >
            Return Home
          </button>
        )}
      </section>
    );
  }

  const handleUpsertMemberLog = (memberId, aamaalId, dateKey, newCount) => {
    const logId = `${dateKey}_${aamaalId}_${memberId}`;
    setAllLogs((prev) => {
      const filtered = prev.filter((l) => l.id !== logId);
      if (newCount <= 0) return filtered;
      return [
        ...filtered,
        {
          id: logId,
          aamaalId,
          memberId,
          dateKey,
          count: Number(newCount),
          updatedAt: Date.now(),
        },
      ];
    });
    if (onShowToast) {
      onShowToast(newCount > 0 ? `Updated log (${newCount})` : 'Member log deleted');
    }
  };

  const handleAddAamaal = (newItem) => {
    setAamaalList((prev) => [...prev, { ...newItem, order: prev.length + 1 }]);
    if (onShowToast) onShowToast(`Added "${newItem.name}"`);
  };

  const handleUpdateAamaal = (id, updates) => {
    setAamaalList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    if (onShowToast) onShowToast('Aamaal updated');
  };

  const handleDeleteAamaal = (id) => {
    setAamaalList((prev) => prev.filter((a) => a.id !== id));
    if (onShowToast) onShowToast('Aamaal deleted');
  };

  const handleAddMember = (newMem) => {
    setAllMembers((prev) => [...prev, newMem]);
    if (onShowToast) onShowToast(`Added ${newMem.name}`);
  };

  const handleUpdateMember = (id, updates) => {
    setAllMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    if (id === 'primary_member' && updates.name && updateState) {
      updateState({ userName: updates.name });
    }
    if (onShowToast) onShowToast('Member updated');
  };

  const handleResetMemberLogs = (memberId) => {
    setAllLogs((prev) => prev.filter((l) => l.memberId !== memberId));
    if (onShowToast) onShowToast('Member logs reset to 0');
  };

  const handleRemoveMember = (memberId) => {
    const target = allMembers.find((m) => m.id === memberId);
    const dependentIds = target?.isPrimary
      ? allMembers
          .filter((f) => !f.isPrimary && f.parentUid === memberId)
          .map((f) => f.id)
      : [];
    const idsToRemove = new Set([memberId, ...dependentIds]);
    setAllMembers((prev) => prev.filter((m) => !idsToRemove.has(m.id)));
    setAllLogs((prev) => prev.filter((l) => !idsToRemove.has(l.memberId)));
    if (onShowToast) onShowToast('Member and logs removed');
  };

  const handleApproveJamaatRequest = (req) => {
    try {
      const masjids = JSON.parse(localStorage.getItem(MASJIDS_STORAGE_KEY) || '[]');
      if (Array.isArray(masjids) && masjids.length > 0) {
        const updatedMasjids = masjids.map((m) => {
          if (m.id !== req.masjidId) return m;
          const prevSlot = m.timings?.[req.prayerKey] || { azan: '', jamat: '' };
          return {
            ...m,
            timings: {
              ...m.timings,
              [req.prayerKey]: { ...prevSlot, jamat: req.proposedJamat },
            },
          };
        });
        localStorage.setItem(MASJIDS_STORAGE_KEY, JSON.stringify(updatedMasjids));
      }
    } catch (_) {}

    setJamaatRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'approved' } : r))
    );
    if (onShowToast) {
      onShowToast(
        `✓ Approved! Updated ${req.masjidName} (${req.prayerKey}) to ${req.proposedJamat}`
      );
    }
  };

  const handleRejectJamaatRequest = (reqId) => {
    setJamaatRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'rejected' } : r))
    );
    if (onShowToast) onShowToast('Request rejected');
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastBody.trim()) return;
    try {
      if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
    } catch (_) {}

    const newBroadcast = {
      id: `bcast_${Date.now()}`,
      title: broadcastTitle.trim() || '📢 Circle Admin Announcement',
      category: 'Admin Broadcast',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      days: ['Announcement'],
      icon: '📢',
      translation: broadcastBody.trim(),
      enabled: true,
      read: false,
      isBroadcast: true,
      createdAt: Date.now(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem(BROADCASTS_STORAGE_KEY) || '[]');
      const next = [newBroadcast, ...(Array.isArray(existing) ? existing : [])];
      localStorage.setItem(BROADCASTS_STORAGE_KEY, JSON.stringify(next));
    } catch (_) {}

    triggerBroadcastPwaNotification(newBroadcast.title, newBroadcast.translation);

    setBroadcastTitle('');
    setBroadcastBody('');
    if (onShowToast) {
      onShowToast('📢 Broadcast sent to every member’s Alert Inbox!');
    }
  };

  const handleSaveCmsEntry = (e) => {
    e.preventDefault();
    if (!cmsForm.title.trim()) return;

    const storageKey = CMS_KEYS[cmsModule];
    let payload = null;

    if (cmsModule === 'feelings') {
      payload = {
        id: `cms_feel_${Date.now()}`,
        label: cmsForm.title.trim(),
        icon: '🌿',
        keywords: cmsForm.keywords
          .split(',')
          .map((k) => k.trim().toLowerCase())
          .filter(Boolean),
        opening: `Take comfort—Allah is always near to those who call upon Him.`,
        quranStory: cmsForm.quranStory.trim(),
        sunnahStory: cmsForm.sunnahStory.trim(),
        arabic: cmsForm.arabic.trim(),
        translation: cmsForm.translation.trim(),
      };
    } else if (cmsModule === 'duas') {
      payload = {
        id: `cms_dua_${Date.now()}`,
        category: cmsForm.category.trim() || 'Daily',
        badge: 'ADMIN ADDED',
        title: cmsForm.title.trim(),
        arabic: cmsForm.arabic.trim(),
        translation: cmsForm.translation.trim(),
        benefits: cmsForm.quranStory.trim(),
        reference: cmsForm.extraField.trim() || 'Authentic Source',
        repeatCount: 1,
      };
    } else if (cmsModule === 'masjids') {
      payload = {
        id: `masjid_${Date.now()}`,
        name: cmsForm.title.trim(),
        area: cmsForm.category.trim() || 'Local Area',
        address: cmsForm.extraField.trim(),
        facilities: ['Wudu Khana', 'Daily Jamaat'],
        timings: {
          fajr: { azan: '05:20 AM', jamat: '05:45 AM' },
          dhuhr: { azan: '12:35 PM', jamat: '01:15 PM' },
          asr: { azan: '04:10 PM', jamat: '04:35 PM' },
          maghrib: { azan: '06:04 PM', jamat: '06:09 PM' },
          isha: { azan: '07:45 PM', jamat: '08:15 PM' },
          jumuah: { azan: '12:45 PM', jamat: '01:30 PM' },
        },
      };
    } else {
      payload = {
        id: `cms_${cmsModule}_${Date.now()}`,
        title: cmsForm.title.trim(),
        category: cmsForm.category.trim() || cmsModule,
        content: cmsForm.quranStory.trim(),
        arabic: cmsForm.arabic.trim(),
        translation: cmsForm.translation.trim(),
        extra: cmsForm.extraField.trim(),
        createdAt: Date.now(),
      };
    }

    try {
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const next = [payload, ...(Array.isArray(existing) ? existing : [])];
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch (_) {}

    setCmsForm({
      title: '',
      category: '',
      keywords: '',
      arabic: '',
      translation: '',
      quranStory: '',
      sunnahStory: '',
      extraField: '',
    });

    if (onShowToast) {
      onShowToast(`✓ Published new ${cmsModule.toUpperCase()} entry!`);
    }
  };

  const pendingJamaatCount = jamaatRequests.filter(
    (r) => r.status === 'pending'
  ).length;

  // Remaining tools shown inside "More"
  const MORE_TOOLS = [
    {
      id: 'inspector',
      icon: '📋',
      title: 'Daily Inspector',
      subtitle: 'Person-wise daily count editor & circle summary',
      badge: 'Excel Export',
    },
    {
      id: 'jamaat_requests',
      icon: '🕌',
      title: 'Jamaat Time Requests',
      subtitle: 'Review member clock photos & approve timetable updates',
      badge: pendingJamaatCount > 0 ? `${pendingJamaatCount} Pending` : '0 Pending',
      highlight: pendingJamaatCount > 0,
    },
    {
      id: 'stats',
      icon: '🌍',
      title: 'Circle & Country Stats',
      subtitle: 'Worldwide leaderboard & country-wise totals',
      badge: 'Excel Export',
    },
    {
      id: 'cms',
      icon: '✍️',
      title: 'Content Manager (CMS)',
      subtitle: 'Add Heart & Soul, Duas, Stories, Learning, Quiz & Masjids',
      badge: '6 Modules',
    },
    {
      id: 'broadcast',
      icon: '📢',
      title: 'Broadcast Alert',
      subtitle: 'Send instant announcements to every member’s inbox',
      badge: 'Notify All',
    },
  ];

  const openModule = (moduleId) => {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (_) {}
    setActivePopup(moduleId);
  };

  const activeModalInfo =
    activePopup === 'more_tools'
      ? { icon: '🛡️', title: 'More Admin Tools' }
      : MORE_TOOLS.find((t) => t.id === activePopup);

  // FULL-SCREEN PAGE 1: MONTHLY REPORT
  if (activePopup === 'monthly') {
    return (
      <AdminMonthlyReports
        aamaalList={aamaalList}
        allMembers={allMembers}
        allLogs={allLogs}
        onBack={() => setActivePopup(null)}
        onShowToast={onShowToast}
        onSelectDateInInspector={(clickedDate, aamaalId) => {
          setInspectorDate(clickedDate);
          setInspectorAamaalId(aamaalId);
          setActivePopup('inspector');
        }}
      />
    );
  }

  // FULL-SCREEN PAGE 2: MEMBER DIRECTORY
  if (activePopup === 'members') {
    return (
      <MemberDirectory
        allMembers={allMembers}
        aamaalList={aamaalList}
        allLogs={allLogs}
        onAddMember={handleAddMember}
        onUpdateMember={handleUpdateMember}
        onResetMemberLogs={handleResetMemberLogs}
        onRemoveMember={handleRemoveMember}
        onDeleteSingleLog={(logId) => {
          setAllLogs((prev) => prev.filter((l) => l.id !== logId));
          if (onShowToast) onShowToast('Log entry deleted');
        }}
        onBack={() => setActivePopup(null)}
      />
    );
  }

  // FULL-SCREEN PAGE 3: MANAGE AAMAAL
  if (activePopup === 'aamaal') {
    return (
      <section className="screen-section no-scrollbar bg-[#F5F2E8] flex flex-col min-h-[100dvh] pb-24 select-none">
        <header className="sticky top-0 z-30 bg-[#F5F2E8]/95 backdrop-blur-md border-b border-[#DCD8C6] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              type="button"
              onClick={() => setActivePopup(null)}
              aria-label="Back to Admin Overview"
              className="w-9 h-9 rounded-full bg-[#E8E6D5] border border-[#DCD8C6] flex items-center justify-center text-[#0D4A2E] active:scale-95 transition shrink-0"
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
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#C99E4C] leading-none">
                Admin Management
              </p>
              <h2 className="font-serif text-[20px] font-bold text-[#0D4A2E] leading-tight truncate mt-0.5">
                Manage Aamaal
              </h2>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#E6F1E8] text-[#0D4A2E] text-[11px] font-bold shrink-0">
            {aamaalList.length} Items
          </span>
        </header>

        <div className="flex-1 px-4 pt-4">
          <AamaalManagement
            aamaalList={aamaalList}
            onAddAamaal={handleAddAamaal}
            onUpdateAamaal={handleUpdateAamaal}
            onDeleteAamaal={handleDeleteAamaal}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="screen-section no-scrollbar bg-[#F5F2E8] min-h-[100dvh] pb-24 select-none">
      {/* HERO HEADER WITH SCENIC MOSQUE BACKDROP */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#F5F2E8] via-[#F7E8C8] to-[#568274] pt-3 pb-10 px-4">
        <img
          src="/img/admin-banner.jpg"
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
          className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-90"
        />

        {/* Built-in Sunrise Mosque & Lake Vector Landscape Fallback */}
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-44"
          viewBox="0 0 400 180"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <radialGradient id="adminSunrise" cx="42%" cy="38%" r="48%">
              <stop offset="0%" stopColor="#FFF7DC" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#F5D998" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#E6D5A7" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="adminWater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6D9B8B" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#3B6B5C" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <rect width="400" height="180" fill="url(#adminSunrise)" />
          <path
            d="M190 125V92h14V55l3-14 3 14v37h14c4-22 18-36 34-36s30 14 34 36h16V35l4-18 4 18v57h18V56l3-13 3 13v36h16c3-14 12-22 22-22s18 8 22 22h10v33H190z"
            fill="#8DB39B"
            opacity="0.85"
          />
          <path
            d="M224 92c4-20 17-33 34-33s30 13 34 33h-68z"
            fill="#1D7A56"
            opacity="0.75"
          />
          <path
            d="M0 125V82c12-12 28-14 40-4 10-14 30-14 42 0 12-8 26-4 34 8 14-6 30 2 38 14 10-6 22-2 28 8v17H0z"
            fill="#1E5238"
            opacity="0.85"
          />
          <rect y="124" width="400" height="56" fill="url(#adminWater)" />
        </svg>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0D3824]/85 via-[#0D3824]/45 to-transparent" />

        {/* Top Bar: Back / Brand / Static Admin Badge */}
        <div className="relative z-10 flex items-start justify-between">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go Back"
              className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-[#14261C] active:scale-95 transition"
            >
              <svg
                className="w-6 h-6"
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
          ) : (
            <div className="w-9 h-9" />
          )}

          <div className="text-center leading-tight">
            <h1 className="font-serif text-[25px] font-bold text-[#0D4A2E] tracking-tight">
              Aamaal
            </h1>
            <p className="text-[11px] font-medium text-[#1F3528] -mt-0.5">
              Live with Purpose
            </p>
          </div>

          <span className="px-3.5 py-1 rounded-full bg-[#1C8549] text-white text-[12px] font-semibold shadow-sm pointer-events-none">
            Admin
          </span>
        </div>

        {/* Hero Greeting */}
        <div className="relative z-10 mt-9">
          <h2 className="font-serif text-[27px] font-bold text-white leading-[1.15] drop-shadow-sm">
            Assalamu Alaikum,
            <br />
            Admin
          </h2>
          <p className="text-[13.5px] text-white/95 font-medium mt-1 drop-shadow-sm">
            Manage your Aamaal Circle
          </p>
        </div>
      </div>

      {/* MAIN CONTENT BODY */}
      <div className="px-4 -mt-5 relative z-10 space-y-3.5">
        {/* Month Selector Pill */}
        <div className="rounded-[18px] bg-[#E8E6D5] border border-[#DCD8C6] shadow-[0_6px_18px_rgba(13,74,46,0.08)] px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Previous Month"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#14261C] hover:bg-[#DCD8C6] active:scale-90 transition"
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
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <span className="text-[15.5px] font-bold text-[#14261C] tracking-tight">
            {MONTH_NAMES[selectedMonth.month]} {selectedMonth.year}
          </span>

          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Next Month"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#14261C] hover:bg-[#DCD8C6] active:scale-90 transition"
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
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* 3-Column KPI Stat Cards (Static) */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-[18px] bg-[#E8E6D5] border border-[#DCD8C6] shadow-[0_3px_12px_rgba(20,38,28,0.04)] py-3.5 px-2 text-center">
            <p className="text-[26px] font-bold text-[#14261C] leading-none">
              {monthlyStats.totalMembers}
            </p>
            <p className="text-[11px] font-medium text-[#4E5953] mt-1.5">
              Total Members
            </p>
          </div>

          <div className="rounded-[18px] bg-[#E8E6D5] border border-[#DCD8C6] shadow-[0_3px_12px_rgba(20,38,28,0.04)] py-3.5 px-2 text-center">
            <p className="text-[26px] font-bold text-[#14261C] leading-none">
              {monthlyStats.activeMembers}
            </p>
            <p className="text-[11px] font-medium text-[#4E5953] mt-1.5">
              Active Members
            </p>
          </div>

          <div className="rounded-[18px] bg-[#E8E6D5] border border-[#DCD8C6] shadow-[0_3px_12px_rgba(20,38,28,0.04)] py-3.5 px-2 text-center">
            <p className="text-[26px] font-bold text-[#14261C] leading-none">
              {monthlyStats.adminsCount}
            </p>
            <p className="text-[11px] font-medium text-[#4E5953] mt-1.5">
              Admins
            </p>
          </div>
        </div>

        {/* Total Recitations Highlight Card (Static) */}
        <div className="w-full rounded-[18px] bg-[#E8E6D5] border border-[#DCD8C6] shadow-[0_3px_12px_rgba(20,38,28,0.04)] px-4 py-3.5 flex items-center justify-between text-left">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#DCE8DF] text-[#0D4A2E] flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.5c-.6 0-1 .5-1 1v1.2C8.3 5.5 6.5 7.9 6.5 10.5V12h11v-1.5c0-2.6-1.8-5-4.5-5.8V3.5c0-.5-.4-1-1-1zM5 13.5V20h4.5v-3.5a2.5 2.5 0 0 1 5 0V20H19v-6.5H5z" />
              </svg>
            </div>
            <div className="flex items-baseline space-x-2 min-w-0">
              <span className="text-[26px] font-bold text-[#14261C] leading-none">
                {monthlyStats.totalRecitations.toLocaleString()}
              </span>
              <span className="text-[12.5px] font-semibold text-[#3C4B42] truncate">
                Total Recitations
              </span>
            </div>
          </div>

          <div className="text-right shrink-0 ml-2">
            <p
              className={`text-[13px] font-bold leading-tight ${
                monthlyStats.pctChange >= 0 ? 'text-[#1C8549]' : 'text-[#B93A32]'
              }`}
            >
              {monthlyStats.pctChange >= 0 ? '↑' : '↓'}{' '}
              {Math.abs(monthlyStats.pctChange)}%
            </p>
            <p className="text-[10.5px] text-[#66736B] mt-0.5">
              vs. previous month
            </p>
          </div>
        </div>

        {/* 1-Line 4-Column Quick Actions (Members, Aamaal, Reports, More) */}
        <div className="grid grid-cols-4 gap-2 pt-1.5 pb-1">
          {[
            {
              id: 'members',
              label: 'Members',
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              ),
            },
            {
              id: 'aamaal',
              label: 'Aamaal',
              icon: (
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="8" y1="13" x2="15" y2="13" />
                  <line x1="8" y1="17" x2="12.5" y2="17" />
                </svg>
              ),
            },
            {
              id: 'monthly',
              label: 'Reports',
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-5 15H7v-4h2v4zm4 0h-2v-7h2v7zm4 0h-2v-2h2v2zm-3-9V3.5L18.5 8H14z" />
                </svg>
              ),
            },
            {
              id: 'more_tools',
              label: 'More',
              badgeCount: pendingJamaatCount,
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="6" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="18" cy="12" r="2" />
                </svg>
              ),
            },
          ].map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => openModule(tool.id)}
              className="flex flex-col items-center space-y-1.5 active:scale-95 transition"
            >
              <div className="relative w-14 h-14 rounded-full bg-[#E6F1E8] text-[#0D4A2E] flex items-center justify-center shadow-[0_2px_8px_rgba(13,74,46,0.06)] border border-[#D4E6D8]">
                {tool.icon}
                {tool.badgeCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#DFB75A] text-[#07361D] text-[10px] font-bold flex items-center justify-center shadow">
                    {tool.badgeCount}
                  </span>
                )}
              </div>
              <span className="text-[12px] font-semibold text-[#1F3528] leading-tight">
                {tool.label}
              </span>
            </button>
          ))}
        </div>

        {/* Recent Activity Section (Shifted Up, Static Rows) */}
        <div className="pt-0.5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[16px] font-bold text-[#14261C]">
              Recent Activity
            </h3>
            <button
              type="button"
              onClick={() => openModule('inspector')}
              className="text-[12.5px] font-semibold text-[#0D4A2E] flex items-center space-x-1 hover:opacity-80"
            >
              <span>View All</span>
              <span>→</span>
            </button>
          </div>

          <div className="rounded-[20px] bg-[#E8E6D5] border border-[#DCD8C6] shadow-[0_3px_12px_rgba(20,38,28,0.04)] divide-y divide-[#DCD8C6] overflow-hidden">
            {recentActivities.length === 0 ? (
              <div className="p-5 text-center text-[12.5px] text-[#55615A]">
                No recent circle activity yet. Logs and new member joins will appear here.
              </div>
            ) : (
              recentActivities.map((item) => (
                <div
                  key={item.id}
                  className="w-full px-3.5 py-3 flex items-center space-x-3 text-left"
                >
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover bg-[#DCE5DD] shrink-0"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-[15px] shrink-0 ${
                        item.type === 'join'
                          ? 'bg-[#DCE8F2] text-[#1D5B8C]'
                          : 'bg-[#DCE8DF] text-[#0D4A2E]'
                      }`}
                    >
                      {item.name.trim()[0]?.toUpperCase() || 'A'}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-[#14261C] leading-snug truncate">
                      <span className="font-bold">{item.name}</span>{' '}
                      <span className="text-[#3C4B42]">{item.actionText}</span>
                    </p>
                    <p className="text-[11px] text-[#6E7A72] mt-0.5">
                      {formatRelativeTime(item.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* CENTERED POPUP MODAL FOR "MORE" & REMAINING ADMIN MODULES */}
      {activePopup && (
        <div
          onClick={() => setActivePopup(null)}
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[82dvh] rounded-[24px] bg-[#F5F2E8] border-2 border-[#C99E4C] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Popup Top Bar */}
            <div className="px-4 py-3 bg-[#0F4C2B] text-white flex items-center justify-between shrink-0 border-b border-[#C99E4C]/30">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-[18px]">{activeModalInfo?.icon}</span>
                <h3 className="font-serif text-[17px] font-semibold truncate text-white">
                  {activeModalInfo?.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePopup(null)}
                aria-label="Close popup"
                className="w-8 h-8 rounded-full bg-white/20 text-[#F0D58C] font-bold text-sm flex items-center justify-center shrink-0 active:scale-95 transition"
              >
                ✕
              </button>
            </div>

            {/* Popup Scrollable Body */}
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-4 space-y-3.5">
              {/* MORE TOOLS LIST (Inspector -> Broadcast) */}
              {activePopup === 'more_tools' && (
                <div className="space-y-2.5">
                  {MORE_TOOLS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openModule(item.id)}
                      className={`w-full text-left rounded-[18px] p-3.5 border flex items-center space-x-3 active:scale-[0.99] transition shadow-soft-card ${
                        item.highlight
                          ? 'bg-[#0F4C2B] text-white border-[#C99E4C]'
                          : 'bg-[#E8E6D5] text-primary border-[#DCD8C6]'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-[18px] shrink-0 ${
                          item.highlight
                            ? 'bg-white/15 text-[#F0D58C]'
                            : 'bg-[#0D4A2E] text-[#F0D58C]'
                        }`}
                      >
                        {item.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4
                            className="font-serif text-[15px] font-semibold truncate"
                            style={{ color: item.highlight ? '#FFFFFF' : '#0D4A2E' }}
                          >
                            {item.title}
                          </h4>
                          {item.badge && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase shrink-0 ${
                                item.highlight
                                  ? 'bg-[#DFB75A] text-[#07361D]'
                                  : 'bg-[#DCE3C8] text-[#0D4A2E]'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p
                          className="text-[11.5px] truncate mt-0.5"
                          style={{
                            color: item.highlight
                              ? 'rgba(255,255,255,0.85)'
                              : '#4E5953',
                          }}
                        >
                          {item.subtitle}
                        </p>
                      </div>

                      <span
                        className={`font-bold text-[16px] pr-1 ${
                          item.highlight ? 'text-[#F0D58C]' : 'text-primary'
                        }`}
                      >
                        ›
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Tab-Specific Excel Export (Inspector & Stats) */}
              {['inspector', 'stats'].includes(activePopup) && (
                <AdminDataExport
                  aamaalList={aamaalList}
                  allMembers={allMembers}
                  allLogs={allLogs}
                  onWipeAllLogs={() => {
                    setAllLogs([]);
                    if (onShowToast) onShowToast('All circle logs cleared');
                  }}
                />
              )}

              {/* JAMAAT TIME REQUESTS */}
              {activePopup === 'jamaat_requests' && (
                <div className="space-y-3">
                  {jamaatRequests.length === 0 ? (
                    <div className="card rounded-[20px] p-6 text-center space-y-2">
                      <span className="text-[24px]">🕌</span>
                      <p className="font-serif text-[16px] font-semibold text-primary">
                        No Jamaat Time Requests Yet
                      </p>
                      <p className="text-[12px] text-secondary">
                        When members submit a digital clock photo from Nearby Masjids, it will appear here for your approval.
                      </p>
                    </div>
                  ) : (
                    jamaatRequests.map((req) => (
                      <div
                        key={req.id}
                        className="card rounded-[20px] p-4 bg-[#E8E6D5] border border-[#D5D2BE] space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase ${
                                req.status === 'approved'
                                  ? 'bg-[#DCE3C8] text-[#0D4A2E]'
                                  : req.status === 'rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-[#DFB75A] text-[#07361D]'
                              }`}
                            >
                              {req.status}
                            </span>
                            <h4 className="font-serif text-[16px] font-semibold text-primary mt-1">
                              {req.masjidName}
                            </h4>
                            <p className="text-[12px] text-[#0D4A2E] font-bold">
                              {req.prayerKey?.toUpperCase()} → {req.proposedJamat}
                            </p>
                          </div>
                          <span className="text-[10px] text-secondary text-right">
                            🕒 {req.capturedAt}
                          </span>
                        </div>

                        {req.clockPhoto && (
                          <img
                            src={req.clockPhoto}
                            alt="Masjid Digital Clock"
                            className="w-full h-44 object-cover rounded-xl border border-[#C99E4C]/50"
                          />
                        )}

                        {req.note && (
                          <p className="text-[11.5px] text-secondary italic">
                            Note: &ldquo;{req.note}&rdquo;
                          </p>
                        )}

                        {req.status === 'pending' && (
                          <div className="flex items-center space-x-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleApproveJamaatRequest(req)}
                              className="btn-primary flex-1 py-2 text-[12px] font-bold"
                            >
                              ✓ Approve &amp; Update Timetable
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectJamaatRequest(req.id)}
                              className="px-3.5 py-2 rounded-full bg-red-100 text-red-700 text-[12px] font-bold"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* DAILY INSPECTOR */}
              {activePopup === 'inspector' && (
                <div className="space-y-3.5">
                  <AdminActivityLog
                    aamaalList={aamaalList}
                    allMembers={allMembers}
                    allLogs={allLogs}
                    selectedDate={inspectorDate}
                    selectedAamaalId={inspectorAamaalId}
                    onChangeDate={setInspectorDate}
                    onChangeAamaalId={setInspectorAamaalId}
                    onUpsertMemberLog={handleUpsertMemberLog}
                  />
                  <CircleStatistics
                    aamaalList={aamaalList}
                    allMembers={allMembers}
                    allLogs={allLogs}
                  />
                </div>
              )}

              {/* CIRCLE & COUNTRY STATS */}
              {activePopup === 'stats' && (
                <div className="space-y-3.5">
                  <CircleStatistics
                    aamaalList={aamaalList}
                    allMembers={allMembers}
                    allLogs={allLogs}
                  />
                  <Leaderboard
                    aamaalList={aamaalList}
                    allMembers={allMembers}
                    allLogs={allLogs}
                  />
                  <CountryStatistics
                    aamaalList={aamaalList}
                    allMembers={allMembers}
                    allLogs={allLogs}
                  />
                </div>
              )}

              {/* FULL MULTI-MODULE CMS */}
              {activePopup === 'cms' && (
                <form
                  onSubmit={handleSaveCmsEntry}
                  className="space-y-3 bg-[#E8E6D5] p-4 rounded-[20px] border border-[#0D4A2E]/25"
                >
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
                      Select App Module to Add Content
                    </label>
                    <select
                      value={cmsModule}
                      onChange={(e) => setCmsModule(e.target.value)}
                      className="w-full bg-[#F5F2E8] text-primary text-[12.5px] font-bold py-2 px-3 rounded-xl border border-[#D5D2BE]"
                    >
                      <option value="feelings">💚 Heart &amp; Soul (Quran &amp; Hadith)</option>
                      <option value="duas">🤲 Duas &amp; Adhkar</option>
                      <option value="stories">📖 Stories &amp; Seerah</option>
                      <option value="learning">🎓 Islamic Learning Hub</option>
                      <option value="quiz">❓ Islamic Knowledge Quiz</option>
                      <option value="masjids">🕌 Masjid Details</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                      {cmsModule === 'masjids'
                        ? 'Masjid Name'
                        : cmsModule === 'quiz'
                        ? 'Quiz Question'
                        : 'Title / Emotion Label'}
                    </label>
                    <input
                      type="text"
                      required
                      value={cmsForm.title}
                      onChange={(e) =>
                        setCmsForm({ ...cmsForm, title: e.target.value })
                      }
                      placeholder="Enter title..."
                      className="w-full bg-[#F5F2E8] text-primary text-[12.5px] font-semibold py-2 px-3 rounded-xl border border-[#D5D2BE]"
                    />
                  </div>

                  {cmsModule === 'feelings' && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                        Trigger Keywords (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={cmsForm.keywords}
                        onChange={(e) =>
                          setCmsForm({ ...cmsForm, keywords: e.target.value })
                        }
                        placeholder="e.g. lonely, hopeless, stressed"
                        className="w-full bg-[#F5F2E8] text-primary text-[12px] py-2 px-3 rounded-xl border border-[#D5D2BE]"
                      />
                    </div>
                  )}

                  {cmsModule !== 'feelings' && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                        {cmsModule === 'masjids' ? 'Area / Neighborhood' : 'Category'}
                      </label>
                      <input
                        type="text"
                        value={cmsForm.category}
                        onChange={(e) =>
                          setCmsForm({ ...cmsForm, category: e.target.value })
                        }
                        placeholder={
                          cmsModule === 'masjids'
                            ? 'e.g. Bandra West, Mumbai'
                            : 'e.g. Peace, Seerah, Fiqh'
                        }
                        className="w-full bg-[#F5F2E8] text-primary text-[12px] py-2 px-3 rounded-xl border border-[#D5D2BE]"
                      />
                    </div>
                  )}

                  {cmsModule !== 'masjids' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                          Arabic Text / Ayah / Dua (Optional)
                        </label>
                        <input
                          type="text"
                          dir="rtl"
                          value={cmsForm.arabic}
                          onChange={(e) =>
                            setCmsForm({ ...cmsForm, arabic: e.target.value })
                          }
                          placeholder="أدخل النص العربي..."
                          className="w-full bg-[#F5F2E8] text-primary font-arabic text-[18px] py-2 px-3 rounded-xl border border-[#D5D2BE]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                          Translation / Answer
                        </label>
                        <textarea
                          rows={2}
                          value={cmsForm.translation}
                          onChange={(e) =>
                            setCmsForm({ ...cmsForm, translation: e.target.value })
                          }
                          placeholder="Enter English translation or quiz answer..."
                          className="w-full bg-[#F5F2E8] text-primary text-[12px] p-2.5 rounded-xl border border-[#D5D2BE]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                          {cmsModule === 'feelings'
                            ? 'Quranic Verse & Story'
                            : 'Main Content / Benefits / Lesson'}
                        </label>
                        <textarea
                          rows={3}
                          value={cmsForm.quranStory}
                          onChange={(e) =>
                            setCmsForm({ ...cmsForm, quranStory: e.target.value })
                          }
                          placeholder="Write detailed content..."
                          className="w-full bg-[#F5F2E8] text-primary text-[12px] p-2.5 rounded-xl border border-[#D5D2BE]"
                        />
                      </div>
                    </>
                  )}

                  {cmsModule === 'feelings' && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                        Prophetic Hadith / Sahabi Narration
                      </label>
                      <textarea
                        rows={2}
                        value={cmsForm.sunnahStory}
                        onChange={(e) =>
                          setCmsForm({ ...cmsForm, sunnahStory: e.target.value })
                        }
                        placeholder="Add authentic Hadith narration..."
                        className="w-full bg-[#F5F2E8] text-primary text-[12px] p-2.5 rounded-xl border border-[#D5D2BE]"
                      />
                    </div>
                  )}

                  {(cmsModule === 'masjids' ||
                    cmsModule === 'duas' ||
                    cmsModule === 'quiz') && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                        {cmsModule === 'masjids'
                          ? 'Full Street Address'
                          : 'Reference / Proof'}
                      </label>
                      <input
                        type="text"
                        value={cmsForm.extraField}
                        onChange={(e) =>
                          setCmsForm({ ...cmsForm, extraField: e.target.value })
                        }
                        placeholder={
                          cmsModule === 'masjids'
                            ? 'Street, Landmark, City, Pin'
                            : 'e.g. Sahih al-Bukhari 3370'
                        }
                        className="w-full bg-[#F5F2E8] text-primary text-[12px] py-2 px-3 rounded-xl border border-[#D5D2BE]"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary w-full py-3 text-[13px] font-bold shadow-md"
                  >
                    Publish to {cmsModule.toUpperCase()} ›
                  </button>
                </form>
              )}

              {/* BROADCAST ALERT */}
              {activePopup === 'broadcast' && (
                <form
                  onSubmit={handleSendBroadcast}
                  className="card rounded-[20px] p-4 space-y-3 bg-[#E8E6D5] border border-[#D5D2BE]"
                >
                  <span className="badge-pill">Global Member Alert</span>
                  <h4 className="font-serif text-[17.5px] font-semibold text-primary">
                    Broadcast Announcement to All Members
                  </h4>
                  <p className="text-[12px] text-secondary">
                    Delivers immediately to every member&apos;s Alert Inbox and triggers a PWA notification.
                  </p>

                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="Announcement Title (e.g., Special Thursday Durood)"
                    className="w-full bg-[#F5F2E8] text-primary text-[12.5px] font-semibold py-2 px-3 rounded-xl border border-[#DCD8C6]"
                  />

                  <textarea
                    rows={4}
                    required
                    value={broadcastBody}
                    onChange={(e) => setBroadcastBody(e.target.value)}
                    placeholder="Write your announcement message..."
                    className="w-full bg-[#F5F2E8] text-primary text-[12.5px] p-3 rounded-xl border border-[#DCD8C6]"
                  />

                  <button
                    type="submit"
                    className="btn-primary w-full py-3 text-[13px] font-bold shadow-md"
                  >
                    📢 Broadcast Announcement Now ›
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}