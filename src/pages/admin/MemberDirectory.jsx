//Renders Section 5 of Admin Panel: Circle & Family Members (with Search, Add Member, Rename, Reset Data (N), Make/Remove Admin, Remove Member, and Member Details Inspector).
import React, { useState, useMemo, useRef } from 'react';
import { CountryFlag } from '../aamaal/WeeklySummary';
import AddMember from './AddMember';
import EditMember from './EditMember';
import RemoveMember from './RemoveMember';
import ResetMemberRecords from './ResetMemberRecords';
import MemberPermissions from './MemberPermissions';
import MemberDetails from './MemberDetails';

export default function MemberDirectory({
  allMembers = [],
  aamaalList = [],
  allLogs = [],
  onAddMember,
  onUpdateMember,
  onResetMemberLogs,
  onRemoveMember,
  onDeleteSingleLog,
  onBack,
}) {
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [removingMemberId, setRemovingMemberId] = useState(null);
  const [inspectedMemberId, setInspectedMemberId] = useState(null);
  const searchInputRef = useRef(null);

  const memberMap = useMemo(() => {
    const map = {};
    allMembers.forEach((m) => {
      map[m.id] = m;
    });
    return map;
  }, [allMembers]);

  // Active = member has at least 1 recitation log > 0
  const activeMemberIds = useMemo(() => {
    const set = new Set();
    allLogs.forEach((l) => {
      if (Number(l.count || 0) > 0 && l.memberId) {
        set.add(l.memberId);
      }
    });
    return set;
  }, [allLogs]);

  const counts = useMemo(() => {
    let active = 0;
    let inactive = 0;
    allMembers.forEach((m) => {
      if (activeMemberIds.has(m.id)) active += 1;
      else inactive += 1;
    });
    return { all: allMembers.length, active, inactive };
  }, [allMembers, activeMemberIds]);

  const inspectedMember = memberMap[inspectedMemberId] || null;
  if (inspectedMember) {
    const parent = memberMap[inspectedMember.parentUid];
    const dependents = inspectedMember.isPrimary
      ? allMembers.filter(
          (f) => !f.isPrimary && f.parentUid === inspectedMember.id
        )
      : [];

    return (
      <div className="bg-[#F5F2E8] min-h-[100dvh] px-4 pt-4 pb-24">
        <MemberDetails
          member={inspectedMember}
          parentMember={parent}
          dependentFamily={dependents}
          aamaalList={aamaalList}
          allLogs={allLogs}
          onUpdateMember={onUpdateMember}
          onResetMemberLogs={onResetMemberLogs}
          onRemoveMember={(id) => {
            if (onRemoveMember) onRemoveMember(id);
            setInspectedMemberId(null);
          }}
          onDeleteSingleLog={onDeleteSingleLog}
          onBack={() => setInspectedMemberId(null)}
        />
      </div>
    );
  }

  const filteredMembers = allMembers.filter((m) => {
    const isActive = activeMemberIds.has(m.id);
    if (statusFilter === 'active' && !isActive) return false;
    if (statusFilter === 'inactive' && isActive) return false;

    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      (m.name || '').toLowerCase().includes(q) ||
      (m.country || '').toLowerCase().includes(q)
    );
  });

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <section className="screen-section no-scrollbar bg-[#F5F2E8] min-h-[100dvh] flex flex-col pb-24 select-none">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#F5F2E8]/95 backdrop-blur-md px-4 pt-3.5 pb-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to Admin Overview"
              className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-[#14261C] active:scale-95 transition shrink-0"
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
          )}
          <h2 className="font-serif text-[23px] font-bold text-[#14261C] leading-none truncate">
            Members ({allMembers.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={() => searchInputRef.current?.focus()}
          aria-label="Focus Search"
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#14261C] active:scale-95 transition"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="20" y1="20" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <div className="px-4 flex-1 flex flex-col space-y-3">
        {/* Segmented Filter Tabs: All / Active / Inactive */}
        <div className="rounded-full bg-[#E8E6D5] p-1 grid grid-cols-3 gap-1 border border-[#DCD8C6]">
          {[
            { id: 'all', label: `All (${counts.all})` },
            { id: 'active', label: `Active (${counts.active})` },
            { id: 'inactive', label: `Inactive (${counts.inactive})` },
          ].map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`py-2 rounded-full text-[12.5px] font-semibold transition ${
                  active
                    ? 'bg-[#0D4A2E] text-white shadow-sm'
                    : 'text-[#3C4B42] hover:text-[#14261C]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-[#6E7A72] pointer-events-none">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="20" y1="20" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search members..."
            className="w-full h-[42px] pl-10 pr-4 rounded-[14px] bg-[#E8E6D5] border border-[#DCD8C6] text-[13.5px] text-[#14261C] placeholder:text-[#7A827D] focus:outline-none focus:border-[#0D4A2E] transition"
          />
        </div>

        {/* Add Member Inline Form */}
        {showAddForm && (
          <div className="pt-1">
            <AddMember
              allMembers={allMembers}
              onAddMember={(newMem) => {
                if (onAddMember) onAddMember(newMem);
                setShowAddForm(false);
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Members List */}
        <div className="flex-1 divide-y divide-[#E2DEC9]">
          {filteredMembers.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-[#55615A]">
              No members match this filter.
            </div>
          ) : (
            filteredMembers.map((m) => {
              const isActive = activeMemberIds.has(m.id);
              const isPrivate = m.privacy === 'private';
              const isSelfPrimary = m.id === 'primary_member';
              const userLogCount = allLogs.filter((l) => l.memberId === m.id).length;
              const isMenuOpen = openMenuId === m.id;
              const isEditing = editingMemberId === m.id;
              const isRemoving = removingMemberId === m.id;
              const isChecked = selectedIds.includes(m.id);
              const dependentFamily = m.isPrimary
                ? allMembers.filter((f) => !f.isPrimary && f.parentUid === m.id)
                : [];

              const statusBadge = isPrivate
                ? { label: 'Private', cls: 'bg-[#E8E1F5] text-[#5B3E96]' }
                : isActive
                ? { label: 'Active', cls: 'bg-[#DFF2E3] text-[#15693B]' }
                : { label: 'Inactive', cls: 'bg-[#E5E3D9] text-[#5E645F]' };

              return (
                <div key={m.id} className="py-3 space-y-2.5">
                  <div className="flex items-center space-x-3">
                    {/* Checkbox */}
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked}
                      onClick={() => toggleSelect(m.id)}
                      className={`w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center shrink-0 transition ${
                        isChecked
                          ? 'bg-[#0D4A2E] border-[#0D4A2E] text-white'
                          : 'bg-transparent border-[#B8B4A4]'
                      }`}
                    >
                      {isChecked && (
                        <svg
                          className="w-3 h-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>

                    {/* Avatar + Name & Country */}
                    <button
                      type="button"
                      onClick={() => setInspectedMemberId(m.id)}
                      className="flex items-center space-x-3 flex-1 min-w-0 text-left"
                    >
                      {m.avatar ? (
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-11 h-11 rounded-full object-cover bg-[#DCE5DD] border border-[#C6D5C8] shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-[#DCE8DF] border border-[#C6D5C8] flex items-center justify-center font-serif font-bold text-[16px] text-[#0D4A2E] shrink-0">
                          {(m.name || 'M').trim()[0]?.toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[14.5px] font-bold text-[#14261C] truncate">
                            {m.name}
                          </span>
                          {m.role === 'admin' && (
                            <span title="Admin" className="text-[12px]">
                              👑
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <CountryFlag country={m.country || 'India'} size={14} />
                          <span className="text-[12px] text-[#55615A] truncate">
                            {m.country || 'India'}
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Status Pill */}
                    <span
                      className={`px-3 py-1 rounded-full text-[11.5px] font-semibold shrink-0 ${statusBadge.cls}`}
                    >
                      {statusBadge.label}
                    </span>

                    {/* 3-Dot Action Menu Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(isMenuOpen ? null : m.id);
                        setEditingMemberId(null);
                        setRemovingMemberId(null);
                      }}
                      aria-label="Member actions"
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[#3C4B42] hover:bg-[#E8E6D5] shrink-0"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="12" cy="19" r="2" />
                      </svg>
                    </button>
                  </div>

                  {/* Expanded Action Menu (Triggered by ⋮) */}
                  {isMenuOpen && (
                    <div className="ml-7 p-2.5 rounded-[14px] bg-[#E8E6D5] border border-[#DCD8C6] flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setInspectedMemberId(m.id)}
                        className="px-2.5 py-1 rounded-lg bg-[#F5F2E8] border border-[#D5D2BE] text-[#0D4A2E] text-[11px] font-bold"
                      >
                        👁 Inspect
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingMemberId(isEditing ? null : m.id);
                          setRemovingMemberId(null);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#F5F2E8] border border-[#D5D2BE] text-[#0D4A2E] text-[11px] font-bold"
                      >
                        ✏️ Rename
                      </button>

                      <ResetMemberRecords
                        member={m}
                        logCount={userLogCount}
                        onConfirmReset={(id) => {
                          if (onResetMemberLogs) onResetMemberLogs(id);
                          setOpenMenuId(null);
                        }}
                      />

                      {m.isPrimary && !isSelfPrimary && (
                        <MemberPermissions
                          member={m}
                          onToggleRole={(id, nextRole) => {
                            if (onUpdateMember) onUpdateMember(id, { role: nextRole });
                          }}
                        />
                      )}

                      {!isSelfPrimary && (
                        <button
                          type="button"
                          onClick={() => {
                            setRemovingMemberId(isRemoving ? null : m.id);
                            setEditingMemberId(null);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#E5D5CE] text-[#6B2D26] text-[11px] font-bold"
                        >
                          🗑️ Remove
                        </button>
                      )}
                    </div>
                  )}

                  {isEditing && (
                    <div className="ml-7">
                      <EditMember
                        member={m}
                        onSaveMember={(id, updates) => {
                          if (onUpdateMember) onUpdateMember(id, updates);
                          setEditingMemberId(null);
                          setOpenMenuId(null);
                        }}
                        onCancel={() => setEditingMemberId(null)}
                      />
                    </div>
                  )}

                  {isRemoving && (
                    <div className="ml-7">
                      <RemoveMember
                        member={m}
                        dependentFamilyCount={dependentFamily.length}
                        logCount={userLogCount}
                        onConfirmRemove={(id) => {
                          if (onRemoveMember) onRemoveMember(id);
                          setRemovingMemberId(null);
                          setOpenMenuId(null);
                        }}
                        onCancel={() => setRemovingMemberId(null)}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Primary CTA: + Add Member */}
        <div className="pt-3">
          <button
            type="button"
            onClick={() => {
              setShowAddForm((prev) => !prev);
              setOpenMenuId(null);
              setEditingMemberId(null);
            }}
            className="w-full h-[48px] rounded-full bg-gradient-to-r from-[#0B462B] via-[#135B39] to-[#083B23] text-white text-[15px] font-semibold shadow-md active:scale-[0.98] transition flex items-center justify-center space-x-2"
          >
            <span className="text-[18px] leading-none">+</span>
            <span>{showAddForm ? 'Close Add Member' : 'Add Member'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}