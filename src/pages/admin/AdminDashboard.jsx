//The master controller for src/pages/admin/ that unites all 20 Admin Panel files with clean sub-navigation tabs (All-in-One Inspector, Monthly Reports, Manage Aamaal, Members & Roles, and Analytics) and persists changes across localStorage so your AamaalDashboard and AccountDashboard stay 100% synchronized.

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

const AAMAAL_STORAGE_KEY = 'aamaal_circle_catalog_v1';
const LOGS_STORAGE_KEY = 'aamaal_circle_logs_v1';
const PROFILES_STORAGE_KEY = 'aamaal_circle_profiles_v1';

export default function AdminDashboard({
  state,
  updateState,
  onShowToast,
  onBack,
}) {
  const [adminTab, setAdminTab] = useState('inspector'); // 'inspector' | 'monthly' | 'aamaal' | 'members' | 'stats'
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
              👑 Circle Admin Panel
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
    </section>
  );
}