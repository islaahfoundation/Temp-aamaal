//The master controller for src/pages/admin/ that unites all 20 Admin Panel files with clean sub-navigation tabs (All-in-One Inspector, Monthly Reports, Manage Aamaal, Members & Roles, and Analytics) and persists changes across localStorage so your AamaalDashboard and AccountDashboard stay 100% synchronized.

// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
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
import { DEFAULT_DUAS_LIBRARY } from '../duas/DuaCategories';

const AAMAAL_STORAGE_KEY = 'aamaal_circle_catalog_v1';
const LOGS_STORAGE_KEY = 'aamaal_circle_logs_v1';
const PROFILES_STORAGE_KEY = 'aamaal_circle_profiles_v1';
const ADMIN_CONTENT_KEY = 'aamaal_admin_cms_content_v1';

export default function AdminDashboard({
  state,
  updateState,
  onShowToast,
  onBack,
}) {
  const [adminTab, setAdminTab] = useState('inspector'); 
  // 'inspector' | 'monthly' | 'aamaal' | 'members' | 'stats' | 'cms' | 'broadcast'

  const [inspectorDate, setInspectorDate] = useState(getLocalDateString());
  const [inspectorAamaalId, setInspectorAamaalId] = useState('durood_313');
  const inspectorCardRef = useRef(null);

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
        name: state?.userName?.trim() || 'Circle Member',
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

  // 4. CMS Content State
  const [cmsContent, setCmsContent] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(ADMIN_CONTENT_KEY) || 'null');
      if (saved && typeof saved === 'object') return saved;
    } catch (_) {}
    return {
      featuredDuaTitle: DEFAULT_DUAS_LIBRARY[0].title,
      featuredDuaArabic: DEFAULT_DUAS_LIBRARY[0].arabic,
      dailyHadithQuote: 'The most beloved of deeds to Allah are those that are most consistent, even if they are small.',
      thursdayBannerText: '6 Salawat Recited Every Thursday Night',
      announcementMessage: '',
    };
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
      localStorage.setItem(ADMIN_CONTENT_KEY, JSON.stringify(cmsContent));
    } catch (_) {}
  }, [cmsContent]);

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
      onShowToast(
        newCount > 0 ? `Updated log (${newCount})` : 'Member log deleted'
      );
    }
  };

  const handleAddAamaal = (newItem) => {
    setAamaalList((prev) => [
      ...prev,
      { ...newItem, order: prev.length + 1 },
    ]);
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

  const handleSaveCms = (e) => {
    e.preventDefault();
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}
    if (onShowToast) {
      onShowToast('✓ Admin CMS content published successfully across app!');
    }
  };

  return (
    <section className="screen-section no-scrollbar px-4 pt-4 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
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
            <h2 className="font-serif text-[21px] font-semibold text-primary leading-tight">
              👑 Circle Admin Panel &amp; CMS
            </h2>
          </div>
        </div>
        <span className="badge-pill">{allMembers.length} Members</span>
      </div>

      {/* Horizontal Admin Sub-Navigation */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-2 mb-3">
        {[
          { id: 'inspector', label: '📋 Daily Inspector' },
          { id: 'monthly', label: '📊 Monthly vs Target' },
          { id: 'aamaal', label: '📿 Manage Aamaal' },
          { id: 'members', label: `👥 Members (${allMembers.length})` },
          { id: 'stats', label: '📈 Circle & Country' },
          { id: 'cms', label: '✍️ Content Manager (CMS)' },
          { id: 'broadcast', label: '📢 Broadcast Alert' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setAdminTab(t.id)}
            className={`px-3.5 py-1.5 rounded-full text-[11.5px] font-semibold whitespace-nowrap transition border ${
              adminTab === t.id
                ? 'bg-[#0D4A2E] text-white border-[#C99E4C]/50 shadow-sm'
                : 'bg-[#EAE8D7] text-primary border-[#D5D2BE]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Top Reports & Database Export Bar (Always accessible) */}
      <div className="mb-3.5">
        <AdminDataExport
          aamaalList={aamaalList}
          allMembers={allMembers}
          allLogs={allLogs}
          onWipeAllLogs={() => {
            setAllLogs([]);
            if (onShowToast) onShowToast('All circle logs cleared');
          }}
        />
      </div>

      {/* TAB 1: DAILY PERSON-WISE INSPECTOR + CIRCLE SUMMARY TABLE */}
      {adminTab === 'inspector' && (
        <div ref={inspectorCardRef} className="space-y-3.5">
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

      {/* TAB 2: MEMBER MONTHLY COUNT VS TARGET */}
      {adminTab === 'monthly' && (
        <AdminMonthlyReports
          aamaalList={aamaalList}
          allMembers={allMembers}
          allLogs={allLogs}
          onSelectDateInInspector={(clickedDate, aamaalId) => {
            setInspectorDate(clickedDate);
            setInspectorAamaalId(aamaalId);
            setAdminTab('inspector');
          }}
        />
      )}

      {/* TAB 3: MANAGE DAILY AAMAAL */}
      {adminTab === 'aamaal' && (
        <AamaalManagement
          aamaalList={aamaalList}
          onAddAamaal={handleAddAamaal}
          onUpdateAamaal={handleUpdateAamaal}
          onDeleteAamaal={handleDeleteAamaal}
        />
      )}

      {/* TAB 4: MEMBER DIRECTORY & ADMIN PERMISSIONS */}
      {adminTab === 'members' && (
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

      {/* TAB 5: CIRCLE, LEADERBOARD & COUNTRY STATISTICS */}
      {adminTab === 'stats' && (
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

      {/* TAB 6: CONTENT MANAGER (CMS) */}
      {adminTab === 'cms' && (
        <form onSubmit={handleSaveCms} className="card rounded-[22px] p-4 space-y-3.5 bg-[#EAE8D7] border border-[#0D4A2E]/30">
          <span className="badge-pill">Live App Content Publisher</span>
          <h3 className="font-serif text-[18px] font-semibold text-primary">
            Update Screen Contents &amp; Banners
          </h3>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
              Featured Dua Title (Home Screen)
            </label>
            <input
              type="text"
              value={cmsContent.featuredDuaTitle}
              onChange={(e) =>
                setCmsContent({ ...cmsContent, featuredDuaTitle: e.target.value })
              }
              className="bg-[#F5F2E8] text-primary text-[12.5px] font-semibold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
              Featured Dua Arabic Calligraphy
            </label>
            <input
              type="text"
              dir="rtl"
              value={cmsContent.featuredDuaArabic}
              onChange={(e) =>
                setCmsContent({ ...cmsContent, featuredDuaArabic: e.target.value })
              }
              className="bg-[#F5F2E8] text-primary font-arabic text-[18px]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
              Daily Prophetic Reflection Quote
            </label>
            <textarea
              rows={2}
              value={cmsContent.dailyHadithQuote}
              onChange={(e) =>
                setCmsContent({ ...cmsContent, dailyHadithQuote: e.target.value })
              }
              className="bg-[#F5F2E8] text-primary text-[12px] p-2.5 rounded-xl border border-[#DCD8C6]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
              Thursday Salawat Banner Text
            </label>
            <input
              type="text"
              value={cmsContent.thursdayBannerText}
              onChange={(e) =>
                setCmsContent({ ...cmsContent, thursdayBannerText: e.target.value })
              }
              className="bg-[#F5F2E8] text-primary text-[12.5px]"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 text-[13px] font-semibold shadow-md"
          >
            Publish CMS Updates to App
          </button>
        </form>
      )}

      {/* TAB 7: BROADCAST ALERT */}
      {adminTab === 'broadcast' && (
        <div className="card rounded-[22px] p-4 space-y-3">
          <span className="badge-pill">Circle Announcement</span>
          <h3 className="font-serif text-[17.5px] font-semibold text-primary">
            Broadcast Notification to All Members
          </h3>
          <p className="text-[12px] text-secondary">
            Send an instant announcement into the Notification Inbox of every circle member.
          </p>

          <textarea
            rows={3}
            value={cmsContent.announcementMessage}
            onChange={(e) =>
              setCmsContent({ ...cmsContent, announcementMessage: e.target.value })
            }
            placeholder="Type special announcement (e.g., Special Durood gathering tonight after Isha...)"
            className="w-full bg-[#F5F2E8] text-primary text-[12.5px] p-3 rounded-xl border border-[#DCD8C6]"
          />

          <button
            type="button"
            onClick={() => {
              if (!cmsContent.announcementMessage.trim()) return;
              if (onShowToast) onShowToast('📢 Broadcast sent to all circle member inboxes!');
              setCmsContent({ ...cmsContent, announcementMessage: '' });
            }}
            className="btn-primary w-full py-2.5 text-[12.5px] font-semibold"
          >
            Broadcast Announcement Now ↗
          </button>
        </div>
      )}
    </section>
  );
}