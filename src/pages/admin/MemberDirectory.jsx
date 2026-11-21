//Renders Section 5 of Admin Panel: Circle & Family Members (with Search, Add Member, Rename, Reset Data (N), Make/Remove Admin, Remove Member, and Member Details Inspector).
import React, { useState, useMemo, useRef } from 'react';
import { CountryFlag } from '../aamaal/WeeklySummary';
import { ScreenHeader, MemberAvatar, StatusBadge } from './adminShared';
import AddMember from './AddMember';
import EditMember from './EditMember';
import RemoveMember from './RemoveMember';
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [removingMemberId, setRemovingMemberId] = useState(null);
  const [inspectedMemberId, setInspectedMemberId] = useState(null);
  const searchInputRef = useRef(null);

  // Single-pass indexed lookups (avoids O(N*M) scans during render)
  const { memberMap, activeSet, logCountByMember, dependentsByParent, counts } = useMemo(() => {
    const mMap = {};
    const depMap = {};
    allMembers.forEach((m) => {
      mMap[m.id] = m;
      if (!m.isPrimary && m.parentUid) {
        if (!depMap[m.parentUid]) depMap[m.parentUid] = [];
        depMap[m.parentUid].push(m);
      }
    });

    const actSet = new Set();
    const lCount = {};
    allLogs.forEach((l) => {
      if (Number(l.count || 0) > 0 && l.memberId) {
        actSet.add(l.memberId);
        lCount[l.memberId] = (lCount[l.memberId] || 0) + 1;
      }
    });

    let active = 0;
    allMembers.forEach((m) => { if (actSet.has(m.id)) active += 1; });

    return {
      memberMap: mMap,
      activeSet: actSet,
      logCountByMember: lCount,
      dependentsByParent: depMap,
      counts: { all: allMembers.length, active, inactive: allMembers.length - active },
    };
  }, [allMembers, allLogs]);

  const inspectedMember = memberMap[inspectedMemberId] || null;
  if (inspectedMember) {
    return (
      <div className="h-[100dvh] w-full bg-[#F7F5EE] overflow-hidden flex flex-col">
        <MemberDetails
          member={inspectedMember}
          parentMember={memberMap[inspectedMember.parentUid]}
          dependentFamily={dependentsByParent[inspectedMember.id] || []}
          aamaalList={aamaalList}
          allLogs={allLogs}
          onUpdateMember={onUpdateMember}
          onResetMemberLogs={onResetMemberLogs}
          onRemoveMember={(id) => {
            onRemoveMember?.(id);
            setInspectedMemberId(null);
          }}
          onDeleteSingleLog={onDeleteSingleLog}
          onBack={() => setInspectedMemberId(null)}
        />
      </div>
    );
  }

  const filteredMembers = allMembers.filter((m) => {
    const isActive = activeSet.has(m.id);
    if (statusFilter === 'active' && !isActive) return false;
    if (statusFilter === 'inactive' && isActive) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (m.name || '').toLowerCase().includes(q) || (m.country || '').toLowerCase().includes(q);
  });

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <section className="screen-section no-scrollbar bg-[#F7F5EE] min-h-[100dvh] flex flex-col pb-24 select-none">
      <ScreenHeader
        title={`Members (${allMembers.length})`}
        onBack={onBack}
        rightSlot={
          <button
            type="button"
            onClick={() => searchInputRef.current?.focus()}
            aria-label="Focus Search"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#14261C] active:scale-95 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="20" y1="20" x2="16.65" y2="16.65" />
            </svg>
          </button>
        }
      />

      <div className="px-4 flex-1 flex flex-col space-y-3">
        {/* Segmented Filter Tabs */}
        <div className="rounded-full bg-[#EFECE1] p-1 grid grid-cols-3 gap-1 border border-[#E5E1D3]">
          {[
            { id: 'all', label: `All (${counts.all})` },
            { id: 'active', label: `Active (${counts.active})` },
            { id: 'inactive', label: `Inactive (${counts.inactive})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`py-2 rounded-full text-[12.5px] font-semibold transition ${
                statusFilter === tab.id ? 'bg-[#0D4A2E] text-white shadow-sm' : 'text-[#4E5953]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-[#7A827D] pointer-events-none">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
            className="w-full h-[42px] pl-10 pr-4 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] text-[13.5px] text-[#14261C] placeholder:text-[#8A928D] focus:outline-none focus:border-[#0D4A2E]"
          />
        </div>

        {/* Bulk Selection Action Bar */}
        {selectedIds.length > 0 && (
          <div className="rounded-[14px] bg-[#0D4A2E] text-white px-3.5 py-2 flex items-center justify-between text-[12px]">
            <span className="font-semibold">{selectedIds.length} selected</span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  onResetMemberLogs?.(selectedIds);
                  setSelectedIds([]);
                }}
                className="px-2.5 py-1 rounded-full bg-white/15 text-[#F0D58C] font-bold"
              >
                Reset Logs
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-2 py-1 text-white/80 font-semibold"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {showAddForm && (
          <AddMember
            allMembers={allMembers}
            onAddMember={(newMem) => {
              onAddMember?.(newMem);
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Members List */}
        <div className="flex-1 divide-y divide-[#EAE6D8]">
          {filteredMembers.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-[#55615A]">No members match this filter.</div>
          ) : (
            filteredMembers.map((m) => {
              const isActive = activeSet.has(m.id);
              const badgeKey = m.privacy === 'private' ? 'private' : isActive ? 'active' : 'inactive';
              const isSelfPrimary = m.id === 'primary_member';
              const userLogCount = logCountByMember[m.id] || 0;
              const isChecked = selectedIds.includes(m.id);
              const isMenuOpen = openMenuId === m.id;
              const isEditing = editingMemberId === m.id;
              const isRemoving = removingMemberId === m.id;

              return (
                <div key={m.id} className="py-3 space-y-2">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked}
                      onClick={() => toggleSelect(m.id)}
                      className={`w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center shrink-0 transition ${
                        isChecked ? 'bg-[#0D4A2E] border-[#0D4A2E] text-white' : 'bg-transparent border-[#C2BEB0]'
                      }`}
                    >
                      {isChecked && (
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setInspectedMemberId(m.id)}
                      className="flex items-center space-x-3 flex-1 min-w-0 text-left"
                    >
                      <MemberAvatar member={m} size="lg" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[14.5px] font-bold text-[#14261C] truncate">{m.name}</span>
                          {m.role === 'admin' && <span title="Admin" className="text-[12px]">👑</span>}
                        </div>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <CountryFlag country={m.country || 'India'} size={14} />
                          <span className="text-[12px] text-[#55615A] truncate">{m.country || 'India'}</span>
                        </div>
                      </div>
                    </button>

                    <StatusBadge status={badgeKey} />

                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(isMenuOpen ? null : m.id);
                        setEditingMemberId(null);
                        setRemovingMemberId(null);
                      }}
                      aria-label="Member actions"
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[#3C4B42] hover:bg-[#EAE8D7] shrink-0"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="12" cy="19" r="2" />
                      </svg>
                    </button>
                  </div>

                  {isMenuOpen && (
                    <div className="ml-7 p-2.5 rounded-[14px] bg-[#FCFBF7] border border-[#E6E2D5] flex items-center gap-1.5 flex-wrap">
                      <button type="button" onClick={() => setInspectedMemberId(m.id)} className="px-2.5 py-1 rounded-lg bg-[#F7F5EE] border border-[#DCD8C6] text-[#0D4A2E] text-[11px] font-bold">
                        👁 Inspect
                      </button>
                      <button type="button" onClick={() => { setEditingMemberId(isEditing ? null : m.id); setRemovingMemberId(null); }} className="px-2.5 py-1 rounded-lg bg-[#F7F5EE] border border-[#DCD8C6] text-[#0D4A2E] text-[11px] font-bold">
                        ✏️ Edit
                      </button>
                      <button type="button" onClick={() => { onResetMemberLogs?.(m.id); setOpenMenuId(null); }} className="px-2.5 py-1 rounded-lg bg-[#FBF0CC] text-[#7D510D] text-[11px] font-bold">
                        🔄 Reset ({userLogCount})
                      </button>
                      {m.isPrimary && !isSelfPrimary && (
                        <MemberPermissions member={m} onToggleRole={(id, nextRole) => onUpdateMember?.(id, { role: nextRole })} />
                      )}
                      {!isSelfPrimary && (
                        <button type="button" onClick={() => { setRemovingMemberId(isRemoving ? null : m.id); setEditingMemberId(null); }} className="px-2.5 py-1 rounded-lg bg-[#F7E5E4] text-[#B93A32] text-[11px] font-bold">
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
                          onUpdateMember?.(id, updates);
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
                        dependentFamilyCount={(dependentsByParent[m.id] || []).length}
                        logCount={userLogCount}
                        onConfirmRemove={(id) => {
                          onRemoveMember?.(id);
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

        {/* Bottom Primary CTA */}
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