//The master controller for src/pages/admin/ that unites all 20 Admin Panel files with clean sub-navigation tabs (All-in-One Inspector, Monthly Reports, Manage Aamaal, Members & Roles, and Analytics) and persists changes across localStorage so your AamaalDashboard and AccountDashboard stay 100% synchronized.

// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DEFAULT_AAMAAL_LIST } from '../aamaal/AamaalCategories';
import { getLocalDateString } from '../aamaal/DateSelector';
import {
  DEFAULT_CIRCLE_SETTINGS,
  MonthSwitcher,
  MemberAvatar,
  formatRelativeTime,
} from './adminShared';
import { appDb, powerSyncDb, isCloudConfigured } from '../../lib/powersync';
import MemberDirectory from './MemberDirectory';
import AamaalManagement from './AamaalManagement';
import Leaderboard from './Leaderboard';
import CountryStatistics from './CountryStatistics';
import AdminMonthlyReports from './AdminMonthlyReports';
import AdminDataExport from './AdminDataExport';
import AdminSettings from './AdminSettings';
import AdminCmsManager from './AdminCmsManager';
import AdminActivityLog from './AdminActivityLog';
import CircleStatistics from './CircleStatistics';

async function triggerBroadcastPwaNotification(title, body) {
  try { if (navigator.vibrate) navigator.vibrate([150, 80, 150]); } catch (_) {}
  if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') return;
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

export default function AdminDashboard({ state, updateState, onShowToast, onBack }) {
  const [activeView, setActiveView] = useState(null);
  const [inspectorDate, setInspectorDate] = useState(getLocalDateString());
  const [inspectorAamaalId, setInspectorAamaalId] = useState('durood_313');

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const [loadingDb, setLoadingDb] = useState(true);
  const [syncState, setSyncState] = useState(isCloudConfigured ? 'syncing' : 'local');
  const [aamaalList, setAamaalList] = useState(DEFAULT_AAMAAL_LIST);
  const [allMembers, setAllMembers] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [jamaatRequests, setJamaatRequests] = useState([]);
  const [circleSettings, setCircleSettings] = useState(DEFAULT_CIRCLE_SETTINGS);

  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');

  const refreshFromDb = useCallback(async () => {
    try {
      const snap = await appDb.loadDashboardSnapshot(
        DEFAULT_AAMAAL_LIST,
        state?.userName?.trim() || 'Ubaid'
      );
      setAllMembers(snap.members);
      setAamaalList(snap.aamaalList.length > 0 ? snap.aamaalList : DEFAULT_AAMAAL_LIST);
      setAllLogs(snap.logs);
      setJamaatRequests(snap.jamaatRequests);
      setCircleSettings(snap.settings);
    } catch (err) {
      console.error('PowerSync load error:', err);
      onShowToast?.('Database sync error — check connection');
    } finally {
      setLoadingDb(false);
    }
  }, [state?.userName, onShowToast]);

  useEffect(() => {
    refreshFromDb();
  }, [refreshFromDb]);

  // Live PowerSync status + auto-refresh whenever remote Supabase changes arrive
  useEffect(() => {
    if (!isCloudConfigured) {
      setSyncState('local');
      return;
    }
    const dispose = powerSyncDb.registerListener({
      statusChanged: (status) => {
        if (status.dataFlowStatus?.uploading || status.dataFlowStatus?.downloading) {
          setSyncState('syncing');
        } else if (status.connected) {
          setSyncState('synced');
          refreshFromDb();
        } else {
          setSyncState('offline');
        }
      },
    });
    return () => dispose?.();
  }, [refreshFromDb]);

  const isAdmin = useMemo(() => {
    const primary = allMembers.find((m) => m.isPrimary) || allMembers[0];
    if (primary?.role === 'admin') return true;
    return (state?.userName || '').toLowerCase().includes('ubaid');
  }, [allMembers, state?.userName]);

  const shiftMonth = (delta) => {
    try { if (navigator.vibrate) navigator.vibrate(8); } catch (_) {}
    setSelectedMonth((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const monthlyStats = useMemo(() => {
    const currPrefix = `${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, '0')}`;
    const prevDate = new Date(selectedMonth.year, selectedMonth.month - 1, 1);
    const prevPrefix = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    const currLogs = allLogs.filter((l) => String(l.dateKey || '').startsWith(currPrefix));
    const prevLogs = allLogs.filter((l) => String(l.dateKey || '').startsWith(prevPrefix));

    const totalRecitations = currLogs.reduce((s, l) => s + Number(l.count || 0), 0);
    const prevRecitations = prevLogs.reduce((s, l) => s + Number(l.count || 0), 0);
    const activeMembers = new Set(currLogs.filter((l) => Number(l.count || 0) > 0).map((l) => l.memberId)).size;
    const adminsCount = allMembers.filter((m) => m.role === 'admin').length || 1;

    const pctChange =
      prevRecitations > 0
        ? Math.round(((totalRecitations - prevRecitations) / prevRecitations) * 100)
        : totalRecitations > 0
        ? 100
        : 0;

    return { totalMembers: allMembers.length, activeMembers, adminsCount, totalRecitations, pctChange };
  }, [allLogs, allMembers, selectedMonth]);

  const recentActivities = useMemo(() => {
    const memberMap = new Map(allMembers.map((m) => [m.id, m]));
    const aamaalMap = new Map(aamaalList.map((a) => [a.id, a]));

    const logEvents = allLogs
      .filter((l) => Number(l.count || 0) > 0)
      .map((l) => {
        const member = memberMap.get(l.memberId);
        const aamaal = aamaalMap.get(l.aamaalId);
        return {
          id: `log_${l.id}`,
          member,
          name: member?.name || 'Circle Member',
          actionText: `completed ${Number(l.count) > 1 ? `${l.count} ` : ''}${aamaal?.name || l.aamaalId || 'Aamaal'}`,
          timestamp: l.updatedAt || Date.parse(l.dateKey) || 0,
        };
      });

    const joinEvents = allMembers
      .filter((m) => m.createdAt)
      .map((m) => ({
        id: `join_${m.id}`,
        member: m,
        name: m.name || 'New member',
        actionText: 'joined the circle',
        timestamp: Number(m.createdAt) || 0,
      }));

    return [...logEvents, ...joinEvents]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 4);
  }, [allLogs, allMembers, aamaalList]);

  if (loadingDb) {
    return (
      <section className="screen-section bg-[#F7F5EE] min-h-[100dvh] flex items-center justify-center">
        <p className="text-[13px] font-semibold text-[#55615A]">Loading circle database...</p>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="screen-section no-scrollbar px-5 pt-10 pb-6 text-center space-y-3 bg-[#F7F5EE] min-h-[100dvh]">
        <div className="w-14 h-14 rounded-full bg-[#EAE8D7] flex items-center justify-center text-[24px] mx-auto">🔒</div>
        <h2 className="font-serif text-[21px] font-semibold text-[#14261C]">Admin Access Restricted</h2>
        <p className="text-[12.5px] text-[#55615A] max-w-xs mx-auto">This area is only visible to Circle Administrators.</p>
        {onBack && (
          <button type="button" onClick={onBack} className="btn-primary px-5 py-2.5 text-[12.5px] font-semibold">
            Return Home
          </button>
        )}
      </section>
    );
  }

  // Supabase + PowerSync Mutation Handlers
  const handleUpsertMemberLog = async (memberId, aamaalId, dateKey, newCount) => {
    await appDb.upsertLog(memberId, aamaalId, dateKey, newCount);
    await refreshFromDb();
    onShowToast?.(newCount > 0 ? `Saved (${newCount}) — syncing` : 'Member log deleted');
  };

  const handleAddAamaal = async (newItem) => {
    await appDb.addAamaal(newItem, aamaalList.length + 1);
    await refreshFromDb();
    onShowToast?.(`Added "${newItem.name}"`);
  };

  const handleUpdateAamaal = async (id, updates) => {
    await appDb.updateAamaal(id, updates);
    await refreshFromDb();
    onShowToast?.('Aamaal updated');
  };

  const handleDeleteAamaal = async (id, permanent = false) => {
    await appDb.deleteAamaal(id, permanent);
    await refreshFromDb();
    onShowToast?.(permanent ? 'Aamaal permanently deleted' : 'Aamaal moved to Deleted');
  };

  const handleAddMember = async (newMem) => {
    await appDb.addMember(newMem);
    await refreshFromDb();
    onShowToast?.(`Added ${newMem.name}`);
  };

  const handleUpdateMember = async (id, updates) => {
    await appDb.updateMember(id, updates);
    if (id === 'primary_member' && updates.name && updateState) updateState({ userName: updates.name });
    await refreshFromDb();
    onShowToast?.('Member updated');
  };

  const handleResetMemberLogs = async (memberIds) => {
    await appDb.resetMemberLogs(memberIds);
    await refreshFromDb();
    const count = Array.isArray(memberIds) ? memberIds.length : 1;
    onShowToast?.(count > 1 ? `Reset logs for ${count} members` : 'Member logs reset to 0');
  };

  const handleRemoveMember = async (memberId) => {
    await appDb.removeMemberCascade(memberId);
    await refreshFromDb();
    onShowToast?.('Member and logs removed');
  };

  const handleApproveJamaatRequest = async (req) => {
    await appDb.approveJamaatRequest(req);
    await refreshFromDb();
    onShowToast?.(`Approved ${req.masjidName} (${req.prayerKey}) — timetable updated`);
  };

  const handleRejectJamaatRequest = async (reqId) => {
    await appDb.rejectJamaatRequest(reqId);
    await refreshFromDb();
    onShowToast?.('Request rejected');
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastBody.trim()) return;
    const item = {
      title: broadcastTitle.trim() || '📢 Circle Admin Announcement',
      category: 'Admin Broadcast',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      days: ['Announcement'],
      icon: '📢',
      translation: broadcastBody.trim(),
    };
    await appDb.addBroadcast(item);
    triggerBroadcastPwaNotification(item.title, item.translation);
    setBroadcastTitle('');
    setBroadcastBody('');
    onShowToast?.('Broadcast saved & queued to Supabase');
  };

  // FULL-SCREEN ROUTES
  if (activeView === 'members') {
    return (
      <MemberDirectory
        allMembers={allMembers}
        aamaalList={aamaalList}
        allLogs={allLogs}
        onAddMember={handleAddMember}
        onUpdateMember={handleUpdateMember}
        onResetMemberLogs={handleResetMemberLogs}
        onRemoveMember={handleRemoveMember}
        onDeleteSingleLog={async (logId) => {
          await appDb.deleteSingleLog(logId);
          await refreshFromDb();
          onShowToast?.('Log entry deleted');
        }}
        onBack={() => setActiveView(null)}
      />
    );
  }

  if (activeView === 'aamaal') {
    return (
      <AamaalManagement
        aamaalList={aamaalList}
        onAddAamaal={handleAddAamaal}
        onUpdateAamaal={handleUpdateAamaal}
        onDeleteAamaal={handleDeleteAamaal}
        onBack={() => setActiveView(null)}
      />
    );
  }

  if (activeView === 'cms') {
    return <AdminCmsManager onShowToast={onShowToast} onBack={() => setActiveView(null)} />;
  }

  if (activeView === 'leaderboard') {
    return (
      <Leaderboard
        aamaalList={aamaalList}
        allMembers={allMembers}
        allLogs={allLogs}
        initialMonth={selectedMonth}
        onBack={() => setActiveView(null)}
      />
    );
  }

  if (activeView === 'country_stats') {
    return (
      <CountryStatistics
        aamaalList={aamaalList}
        allMembers={allMembers}
        allLogs={allLogs}
        onBack={() => setActiveView(null)}
      />
    );
  }

  if (activeView === 'monthly') {
    return (
      <AdminMonthlyReports
        aamaalList={aamaalList}
        allMembers={allMembers}
        allLogs={allLogs}
        initialMonth={selectedMonth}
        onBack={() => setActiveView(null)}
        onOpenExportShare={(monthObj) => {
          if (monthObj) setSelectedMonth(monthObj);
          setActiveView('export');
        }}
        onShowToast={onShowToast}
        onSelectDateInInspector={(clickedDate, aamaalId) => {
          setInspectorDate(clickedDate);
          setInspectorAamaalId(aamaalId);
          setActiveView('inspector');
        }}
      />
    );
  }

  if (activeView === 'export') {
    return (
      <AdminDataExport
        aamaalList={aamaalList}
        allMembers={allMembers}
        allLogs={allLogs}
        circleSettings={circleSettings}
        initialMonth={selectedMonth}
        onShowToast={onShowToast}
        onBack={() => setActiveView(null)}
      />
    );
  }

  if (activeView === 'settings') {
    return (
      <AdminSettings
        allMembers={allMembers}
        allLogs={allLogs}
        aamaalList={aamaalList}
        circleSettings={circleSettings}
        onUpdateSettings={async (updates) => {
          const next = { ...circleSettings, ...updates };
          await appDb.saveSettings(next);
          await refreshFromDb();
          onShowToast?.('Settings saved to Supabase');
        }}
        onUpdateMember={handleUpdateMember}
        onOpenExport={() => setActiveView('export')}
        onWipeAllLogs={async () => {
          await appDb.wipeAllLogs();
          await refreshFromDb();
          onShowToast?.('All recitation logs cleared');
        }}
        onResetCircle={async () => {
          await appDb.resetCircleToDefaults(DEFAULT_AAMAAL_LIST);
          await refreshFromDb();
          onShowToast?.('Circle reset to defaults');
        }}
        onBack={() => setActiveView(null)}
      />
    );
  }

  const pendingJamaatCount = jamaatRequests.filter((r) => r.status === 'pending').length;

  const MORE_TOOLS = [
    { id: 'cms', icon: '✍️', title: 'Content CMS', subtitle: 'Add, edit & delete Duas, Feelings, Learning, Masjids, Quiz & Stories' },
    { id: 'leaderboard', icon: '🏆', title: 'Leaderboard', subtitle: 'Monthly Total Count, Consistency & Most Active rankings' },
    { id: 'country_stats', icon: '🌍', title: 'Country-wise Statistics', subtitle: 'Global map, top countries & member totals' },
    { id: 'export', icon: '📤', title: 'Export / Share Report', subtitle: 'WhatsApp, CSV, PDF & formatted monthly summary' },
    { id: 'settings', icon: '⚙️', title: 'Admin Settings', subtitle: 'Circle info, admins, permissions & danger zone' },
    { id: 'inspector', icon: '📋', title: 'Daily Inspector', subtitle: 'Person-wise daily count editor & WhatsApp daily report' },
    {
      id: 'jamaat_requests', icon: '🕌', title: 'Jamaat Time Requests',
      subtitle: 'Review member clock photos & approve updates',
      badge: pendingJamaatCount > 0 ? `${pendingJamaatCount} Pending` : null,
      highlight: pendingJamaatCount > 0,
    },
    { id: 'broadcast', icon: '📢', title: 'Broadcast Alert', subtitle: 'Send instant announcements to every member’s inbox' },
  ];

  const isModalOpen = ['more_tools', 'inspector', 'jamaat_requests', 'broadcast'].includes(activeView);
  const modalMeta =
    activeView === 'more_tools'
      ? { icon: '🛡️', title: 'More Admin Tools' }
      : MORE_TOOLS.find((t) => t.id === activeView);

  const syncDot = {
    synced: 'bg-[#25D366]',
    syncing: 'bg-[#F0D58C] animate-pulse',
    offline: 'bg-[#E57373]',
    local: 'bg-white/70',
  }[syncState];

  return (
    <section className="screen-section no-scrollbar bg-[#F7F5EE] min-h-[100dvh] pb-24 select-none">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#F5F2E8] via-[#F7E8C8] to-[#568274] pt-3 pb-10 px-4">
        <img
          src="/img/admin-banner.jpg"
          alt=""
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-90"
        />

        <svg className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-44" viewBox="0 0 400 180" preserveAspectRatio="none" fill="none">
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
          <path d="M190 125V92h14V55l3-14 3 14v37h14c4-22 18-36 34-36s30 14 34 36h16V35l4-18 4 18v57h18V56l3-13 3 13v36h16c3-14 12-22 22-22s18 8 22 22h10v33H190z" fill="#8DB39B" opacity="0.85" />
          <path d="M224 92c4-20 17-33 34-33s30 13 34 33h-68z" fill="#1D7A56" opacity="0.75" />
          <path d="M0 125V82c12-12 28-14 40-4 10-14 30-14 42 0 12-8 26-4 34 8 14-6 30 2 38 14 10-6 22-2 28 8v17H0z" fill="#1E5238" opacity="0.85" />
          <rect y="124" width="400" height="56" fill="url(#adminWater)" />
        </svg>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0D3824]/85 via-[#0D3824]/45 to-transparent" />

        {/* Top Bar */}
        <div className="relative z-10 flex items-start justify-between">
          <button
            type="button"
            onClick={onBack || (() => setActiveView('settings'))}
            aria-label={onBack ? 'Go Back' : 'Admin Settings'}
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-[#14261C] active:scale-95 transition"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {onBack ? (
                <>
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          <div className="text-center leading-tight">
            <h1 className="font-serif text-[25px] font-bold text-[#0D4A2E] tracking-tight">Aamaal</h1>
            <p className="text-[11px] font-medium text-[#1F3528] -mt-0.5">{circleSettings.tagline}</p>
          </div>

          <button
            type="button"
            onClick={() => setActiveView('settings')}
            title={`Database: ${syncState}`}
            className="px-3 py-1 rounded-full bg-[#1C8549] text-white text-[12px] font-semibold shadow-sm active:scale-95 transition flex items-center space-x-1.5"
          >
            <span className={`w-2 h-2 rounded-full ${syncDot}`} />
            <span>Admin</span>
          </button>
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

      {/* MAIN BODY */}
      <div className="px-4 -mt-5 relative z-10 space-y-3.5">
        <MonthSwitcher year={selectedMonth.year} month={selectedMonth.month} onShift={shiftMonth} />

        {/* 3 KPI Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { value: monthlyStats.totalMembers, label: 'Total Members' },
            { value: monthlyStats.activeMembers, label: 'Active Members' },
            { value: monthlyStats.adminsCount, label: 'Admins' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[18px] bg-[#FCFBF7] border border-[#E6E2D5] shadow-[0_3px_12px_rgba(20,38,28,0.04)] py-3.5 px-2 text-center">
              <p className="text-[26px] font-bold text-[#14261C] leading-none">{stat.value}</p>
              <p className="text-[11px] font-medium text-[#55615A] mt-1.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Total Recitations Highlight Card */}
        <div className="w-full rounded-[18px] bg-[#FCFBF7] border border-[#E6E2D5] shadow-[0_3px_12px_rgba(20,38,28,0.04)] px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#E6F1E8] text-[#0D4A2E] flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.5c-.6 0-1 .5-1 1v1.2C8.3 5.5 6.5 7.9 6.5 10.5V12h11v-1.5c0-2.6-1.8-5-4.5-5.8V3.5c0-.5-.4-1-1-1zM5 13.5V20h4.5v-3.5a2.5 2.5 0 0 1 5 0V20H19v-6.5H5z" />
              </svg>
            </div>
            <div className="flex items-baseline space-x-2 min-w-0">
              <span className="text-[25px] font-bold text-[#14261C] leading-none">
                {monthlyStats.totalRecitations.toLocaleString()}
              </span>
              <span className="text-[12px] font-semibold text-[#3C4B42] truncate">Total Recitations</span>
            </div>
          </div>

          <div className="text-right shrink-0 ml-2">
            <p className={`text-[13px] font-bold leading-tight ${monthlyStats.pctChange >= 0 ? 'text-[#1C8549]' : 'text-[#B93A32]'}`}>
              {monthlyStats.pctChange >= 0 ? '↑' : '↓'} {Math.abs(monthlyStats.pctChange)}%
            </p>
            <p className="text-[10.5px] text-[#66736B] mt-0.5">vs. previous month</p>
          </div>
        </div>

        {/* 4 Quick Actions */}
        <div className="grid grid-cols-4 gap-2 pt-1 pb-1">
          {[
            {
              id: 'members', label: 'Members',
              icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>,
            },
            {
              id: 'aamaal', label: 'Aamaal',
              icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="15" y2="13" /><line x1="8" y1="17" x2="12.5" y2="17" /></svg>,
            },
            {
              id: 'monthly', label: 'Reports',
              icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-5 15H7v-4h2v4zm4 0h-2v-7h2v7zm4 0h-2v-2h2v2zm-3-9V3.5L18.5 8H14z" /></svg>,
            },
            {
              id: 'more_tools', label: 'More', badgeCount: pendingJamaatCount,
              icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="18" cy="12" r="2" /></svg>,
            },
          ].map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActiveView(tool.id)}
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
              <span className="text-[12px] font-semibold text-[#1F3528] leading-tight">{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="pt-0.5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[16px] font-bold text-[#14261C]">Recent Activity</h3>
            <button
              type="button"
              onClick={() => setActiveView('inspector')}
              className="text-[12.5px] font-semibold text-[#0D4A2E] flex items-center space-x-1 hover:opacity-80"
            >
              <span>View All</span>
              <span>→</span>
            </button>
          </div>

          <div className="rounded-[20px] bg-[#FCFBF7] border border-[#E6E2D5] shadow-[0_3px_12px_rgba(20,38,28,0.04)] divide-y divide-[#EDE9DC] overflow-hidden">
            {recentActivities.length === 0 ? (
              <div className="p-5 text-center text-[12.5px] text-[#55615A]">
                No recent circle activity yet. Logs and new member joins will appear here.
              </div>
            ) : (
              recentActivities.map((item) => (
                <div key={item.id} className="w-full px-3.5 py-3 flex items-center space-x-3">
                  <MemberAvatar member={item.member || { name: item.name }} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-[#14261C] leading-snug truncate">
                      <span className="font-bold">{item.name}</span>{' '}
                      <span className="text-[#4E5953]">{item.actionText}</span>
                    </p>
                    <p className="text-[11px] text-[#6E7A72] mt-0.5">{formatRelativeTime(item.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL FOR MORE TOOLS & UTILITY SUB-VIEWS */}
      {isModalOpen && (
        <div onClick={() => setActiveView(null)} className="fixed inset-0 z-[90] bg-black/55 backdrop-blur-sm flex items-center justify-center p-3 fade-in">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md max-h-[84dvh] rounded-[24px] bg-[#F7F5EE] border-2 border-[#C99E4C] shadow-2xl flex flex-col overflow-hidden">
            <div className="px-4 py-3 bg-[#0D4A2E] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-[18px]">{modalMeta?.icon}</span>
                <h3 className="font-serif text-[17px] font-semibold truncate">{modalMeta?.title}</h3>
              </div>
              <button type="button" onClick={() => setActiveView(null)} aria-label="Close" className="w-8 h-8 rounded-full bg-white/20 text-[#F0D58C] font-bold text-sm flex items-center justify-center">
                ✕
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-4 space-y-3">
              {activeView === 'more_tools' &&
                MORE_TOOLS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveView(item.id)}
                    className={`w-full text-left rounded-[16px] p-3.5 border flex items-center space-x-3 active:scale-[0.99] transition ${
                      item.highlight
                        ? 'bg-[#0D4A2E] text-white border-[#C99E4C]'
                        : 'bg-[#FCFBF7] text-[#14261C] border-[#E6E2D5]'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[18px] shrink-0 ${item.highlight ? 'bg-white/15' : 'bg-[#E6F1E8]'}`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-serif text-[15px] font-semibold truncate">{item.title}</h4>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-[#DFB75A] text-[#07361D] text-[9.5px] font-bold uppercase shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-[11.5px] truncate mt-0.5 ${item.highlight ? 'text-white/80' : 'text-[#55615A]'}`}>
                        {item.subtitle}
                      </p>
                    </div>
                    <span className="font-bold text-[16px] opacity-70">›</span>
                  </button>
                ))}

              {activeView === 'inspector' && (
                <div className="space-y-3">
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
                  <CircleStatistics aamaalList={aamaalList} allMembers={allMembers} allLogs={allLogs} />
                </div>
              )}

              {activeView === 'jamaat_requests' && (
                jamaatRequests.length === 0 ? (
                  <div className="rounded-[18px] bg-[#FCFBF7] border border-[#E6E2D5] p-6 text-center space-y-1.5">
                    <span className="text-[24px]">🕌</span>
                    <p className="font-serif text-[16px] font-semibold text-[#14261C]">No Jamaat Time Requests Yet</p>
                    <p className="text-[12px] text-[#55615A]">Submitted clock photos will appear here for approval.</p>
                  </div>
                ) : (
                  jamaatRequests.map((req) => (
                    <div key={req.id} className="rounded-[18px] bg-[#FCFBF7] border border-[#E6E2D5] p-4 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase bg-[#E6F1E8] text-[#0D4A2E]">
                            {req.status}
                          </span>
                          <h4 className="font-serif text-[15.5px] font-semibold text-[#14261C] mt-1">{req.masjidName}</h4>
                          <p className="text-[12px] text-[#0D4A2E] font-bold">{req.prayerKey?.toUpperCase()} → {req.proposedJamat}</p>
                        </div>
                        <span className="text-[10px] text-[#55615A]">{req.capturedAt}</span>
                      </div>
                      {req.clockPhoto && <img src={req.clockPhoto} alt="Masjid Clock" className="w-full h-40 object-cover rounded-xl" />}
                      {req.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <button type="button" onClick={() => handleApproveJamaatRequest(req)} className="btn-primary flex-1 py-2 text-[12px] font-bold">
                            Approve
                          </button>
                          <button type="button" onClick={() => handleRejectJamaatRequest(req.id)} className="px-3.5 py-2 rounded-full bg-red-100 text-red-700 text-[12px] font-bold">
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )
              )}

              {activeView === 'broadcast' && (
                <form onSubmit={handleSendBroadcast} className="space-y-3 bg-[#FCFBF7] p-4 rounded-[18px] border border-[#E6E2D5]">
                  <h4 className="font-serif text-[17px] font-semibold text-[#14261C]">Broadcast Announcement</h4>
                  <input type="text" value={broadcastTitle} onChange={(e) => setBroadcastTitle(e.target.value)} placeholder="Title (e.g., Special Thursday Durood)" className="w-full bg-[#F7F5EE] text-[12.5px] py-2 px-3 rounded-xl border border-[#DCD8C6]" />
                  <textarea rows={4} required value={broadcastBody} onChange={(e) => setBroadcastBody(e.target.value)} placeholder="Write your announcement message..." className="w-full bg-[#F7F5EE] text-[12.5px] p-3 rounded-xl border border-[#DCD8C6]" />
                  <button type="submit" className="w-full py-2.5 rounded-full bg-[#0D4A2E] text-white text-[13px] font-bold">
                    Send Broadcast Now
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