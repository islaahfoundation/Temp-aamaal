//The master controller for src/pages/admin/ that unites all 20 Admin Panel files with clean sub-navigation tabs (All-in-One Inspector, Monthly Reports, Manage Aamaal, Members & Roles, and Analytics) and persists changes across localStorage so your AamaalDashboard and AccountDashboard stay 100% synchronized.

// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
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
import AdminManagement from './AdminManagement';

const AAMAAL_STORAGE_KEY = 'aamaal_circle_catalog_v1';
const LOGS_STORAGE_KEY = 'aamaal_circle_logs_v1';
const PROFILES_STORAGE_KEY = 'aamaal_circle_profiles_v1';
const BROADCASTS_STORAGE_KEY = 'aamaal_broadcast_alerts_v1';
const JAMAAT_REQUESTS_KEY = 'aamaal_jamaat_change_requests_v1';
const MASJIDS_STORAGE_KEY = 'aamaal_masjids_directory_v1';

// CMS Storage Keys
const CMS_KEYS = {
  feelings: 'aamaal_admin_cms_feelings_v1',
  duas: 'aamaal_admin_cms_duas_v1',
  stories: 'aamaal_admin_cms_stories_v1',
  learning: 'aamaal_admin_cms_learning_v1',
  quiz: 'aamaal_admin_cms_quiz_v1',
  masjids: MASJIDS_STORAGE_KEY,
};

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

  // Popup modal state: null | 'inspector' | 'monthly' | 'aamaal' | 'members' | 'stats' | 'jamaat_requests' | 'cms' | 'broadcast'
  const [activePopup, setActivePopup] = useState(null);

  const [inspectorDate, setInspectorDate] = useState(getLocalDateString());
  const [inspectorAamaalId, setInspectorAamaalId] = useState('durood_313');

  // 1. Aamaal Catalog State
  const [aamaalList, setAamaalList] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(AAMAAL_STORAGE_KEY) || 'null');
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch (_) {}
    return DEFAULT_AAMAAL_LIST;
  });

  // 2. Circle & Family Members State
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

  // 3. All Recitation Logs State
  const [allLogs, setAllLogs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LOGS_STORAGE_KEY) || 'null');
      if (Array.isArray(saved)) return saved;
    } catch (_) {}
    return [];
  });

  // 4. Jamaat Time Change Requests State
  const [jamaatRequests, setJamaatRequests] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(JAMAAT_REQUESTS_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (_) {
      return [];
    }
  });

  // 5. Broadcast State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');

  // 6. Full Multi-Module CMS State
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

  // Restrict access to Admins only
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

  // Handlers
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

  // Approve or Reject Jamaat Time Change Request
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
      onShowToast(`✓ Approved! Updated ${req.masjidName} (${req.prayerKey}) to ${req.proposedJamat}`);
    }
  };

  const handleRejectJamaatRequest = (reqId) => {
    setJamaatRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'rejected' } : r))
    );
    if (onShowToast) onShowToast('Request rejected');
  };

  // Send Broadcast to All Members' Alert Inbox + PWA Notification
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

  // Save New CMS Entry to Selected Module
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

  const ADMIN_MENU_ITEMS = [
    {
      id: 'jamaat_requests',
      icon: '🕌',
      title: 'Jamaat Time Requests',
      subtitle: 'Review member clock photos & approve timetable updates',
      badge: pendingJamaatCount > 0 ? `${pendingJamaatCount} Pending` : '0 Pending',
      highlight: pendingJamaatCount > 0,
    },
    {
      id: 'inspector',
      icon: '📋',
      title: 'Daily Inspector',
      subtitle: 'Person-wise daily count editor & circle summary',
      badge: 'Excel Export',
    },
    {
      id: 'monthly',
      icon: '📅',
      title: 'Monthly vs Target',
      subtitle: 'Track member monthly progress against circle goals',
      badge: 'Excel Export',
    },
    {
      id: 'aamaal',
      icon: '📿',
      title: 'Manage Aamaal',
      subtitle: 'Add, edit, or reorder daily Aamaal items & targets',
      badge: `${aamaalList.length} Items`,
    },
    {
      id: 'members',
      icon: '👥',
      title: 'Members & Admin Roles',
      subtitle: 'Directory, family profiles & promote/revoke admins',
      badge: `${allMembers.length} Members`,
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

  const activeMenuItem = ADMIN_MENU_ITEMS.find((i) => i.id === activePopup);

  return (
    <section className="screen-section no-scrollbar px-4 pt-4 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
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
              Islaah Foundation Governance
            </span>
            <h2 className="font-serif text-[22px] font-semibold text-primary leading-tight">
              🛡️ Circle Admin Panel
            </h2>
          </div>
        </div>
        <span className="badge-pill">{allMembers.length} Members</span>
      </div>

      {/* Vertical Admin Menu List */}
      <div className="space-y-2.5">
        {ADMIN_MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              try {
                if (navigator.vibrate) navigator.vibrate(10);
              } catch (_) {}
              setActivePopup(item.id);
            }}
            className={`w-full text-left rounded-[18px] p-3.5 border flex items-center space-x-3 active:scale-[0.99] transition shadow-soft-card ${
              item.highlight
                ? 'bg-[#0F4C2B] text-white border-[#C99E4C]'
                : 'bg-[#F3EFE2] text-primary border-white/90'
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
                <h3
                  className="font-serif text-[15.5px] font-semibold truncate"
                  style={{ color: item.highlight ? '#FFFFFF' : '#0D4A2E' }}
                >
                  {item.title}
                </h3>
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
                  color: item.highlight ? 'rgba(255,255,255,0.85)' : '#4E5953',
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

      {/* CENTERED POPUP MODAL PAGE FOR SELECTED ADMIN MODULE */}
      {activePopup && (
        <div
          onClick={() => setActivePopup(null)}
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[80dvh] rounded-[24px] bg-[#F5F2E8] border-2 border-[#C99E4C] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Popup Top Bar (Always Visible) */}
            <div className="px-4 py-3 bg-[#0F4C2B] text-white flex items-center justify-between shrink-0 border-b border-[#C99E4C]/30">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-[18px]">{activeMenuItem?.icon}</span>
                <h3 className="font-serif text-[17px] font-semibold truncate text-white">
                  {activeMenuItem?.title}
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
              {/* Tab-Specific Excel Export (ONLY on Inspector, Monthly, Members, Stats) */}
              {['inspector', 'monthly', 'members', 'stats'].includes(
                activePopup
              ) && (
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

              {/* POPUP 1: JAMAAT TIME REQUESTS */}
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
                        className="card rounded-[20px] p-4 bg-[#FFFDF9] border border-[#D5D2BE] space-y-2.5"
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

              {/* POPUP 2: DAILY INSPECTOR */}
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

              {/* POPUP 3: MONTHLY VS TARGET */}
              {activePopup === 'monthly' && (
                <AdminMonthlyReports
                  aamaalList={aamaalList}
                  allMembers={allMembers}
                  allLogs={allLogs}
                  onSelectDateInInspector={(clickedDate, aamaalId) => {
                    setInspectorDate(clickedDate);
                    setInspectorAamaalId(aamaalId);
                    setActivePopup('inspector');
                  }}
                />
              )}

              {/* POPUP 4: MANAGE AAMAAL */}
              {activePopup === 'aamaal' && (
                <AamaalManagement
                  aamaalList={aamaalList}
                  onAddAamaal={handleAddAamaal}
                  onUpdateAamaal={handleUpdateAamaal}
                  onDeleteAamaal={handleDeleteAamaal}
                />
              )}

              {/* POPUP 5: MEMBERS & ROLES */}
              {activePopup === 'members' && (
                <div className="space-y-3.5">
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
                  />
                  <AdminManagement
                    allMembers={allMembers}
                    onToggleAdminRole={(memberId) => {
                      const found = allMembers.find((m) => m.id === memberId);
                      if (found) {
                        handleUpdateMember(memberId, {
                          role: found.role === 'admin' ? 'member' : 'admin',
                        });
                      }
                    }}
                  />
                </div>
              )}

              {/* POPUP 6: CIRCLE & COUNTRY STATS */}
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

              {/* POPUP 7: FULL MULTI-MODULE CMS (NO EXCEL EXPORT) */}
              {activePopup === 'cms' && (
                <form
                  onSubmit={handleSaveCmsEntry}
                  className="space-y-3 bg-[#EAE8D7] p-4 rounded-[20px] border border-[#0D4A2E]/25"
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

              {/* POPUP 8: BROADCAST ALERT (NO EXCEL EXPORT) */}
              {activePopup === 'broadcast' && (
                <form
                  onSubmit={handleSendBroadcast}
                  className="card rounded-[20px] p-4 space-y-3 bg-[#FFFDF9] border border-[#D5D2BE]"
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