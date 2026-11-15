//Renders Section 5 of Admin Panel: Circle & Family Members (with Search, Add Member, Rename, Reset Data (N), Make/Remove Admin, Remove Member, and Member Details Inspector).
import React, { useState } from 'react';
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
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [removingMemberId, setRemovingMemberId] = useState(null);
  const [inspectedMemberId, setInspectedMemberId] = useState(null);

  const memberMap = {};
  allMembers.forEach((m) => {
    memberMap[m.id] = m;
  });

  const inspectedMember = memberMap[inspectedMemberId] || null;
  if (inspectedMember) {
    const parent = memberMap[inspectedMember.parentUid];
    const dependents = inspectedMember.isPrimary
      ? allMembers.filter(
          (f) => !f.isPrimary && f.parentUid === inspectedMember.id
        )
      : [];

    return (
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
    );
  }

  const filteredMembers = allMembers.filter((m) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      (m.name || '').toLowerCase().includes(q) ||
      (m.country || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-3.5">
      <div className="card rounded-[20px] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
              Member Management
            </span>
            <h3 className="font-serif text-[17.5px] font-semibold text-primary">
              👥 Circle &amp; Family Members ({allMembers.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingMemberId(null);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#0D4A2E] text-white text-[11.5px] font-semibold shadow-sm"
          >
            {showAddForm ? 'Close' : '+ Add Member'}
          </button>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search member by name or country..."
          className="bg-[#F5F2E8] text-[12.5px] py-2 px-3 rounded-xl"
        />

        {showAddForm && (
          <AddMember
            allMembers={allMembers}
            onAddMember={(newMem) => {
              if (onAddMember) onAddMember(newMem);
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Members List */}
        <div className="divide-y divide-[#E2DEC9]">
          {filteredMembers.map((m) => {
            const parent = memberMap[m.parentUid];
            const isAdminRole = m.role === 'admin';
            const userLogCount = allLogs.filter((l) => l.memberId === m.id).length;
            const isSelfPrimary = m.id === 'primary_member';
            const isEditing = editingMemberId === m.id;
            const isRemoving = removingMemberId === m.id;
            const dependentFamily = m.isPrimary
              ? allMembers.filter((f) => !f.isPrimary && f.parentUid === m.id)
              : [];

            return (
              <div key={m.id} className="py-3 first:pt-1 last:pb-0 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setInspectedMemberId(m.id)}
                    className="text-left flex-1 min-w-0"
                  >
                    <div className="flex items-center space-x-2">
                      <CountryFlag country={m.country || 'India'} size={18} />
                      <span className="font-serif text-[14.5px] font-bold text-primary truncate">
                        {m.name}
                      </span>
                      {isAdminRole && <span title="Admin">👑</span>}
                      {isSelfPrimary && (
                        <span className="px-2 py-0.5 rounded-full bg-[#DCE3C8] text-[#0D4A2E] text-[9px] font-bold uppercase">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-secondary mt-0.5">
                      {m.isPrimary
                        ? 'Core Member'
                        : `Family (via ${parent?.name || 'Member'})`}{' '}
                      • {m.country || 'India'}
                      {m.phone ? ` • 📱 ${m.phone}` : ''} • Privacy:{' '}
                      <strong className="capitalize text-primary">
                        {m.privacy || 'public'}
                      </strong>{' '}
                      • Logs: <strong className="text-[#135332]">{userLogCount}</strong>
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectedMemberId(m.id)}
                    className="px-2.5 py-1 rounded-lg bg-[#F5F2E8] border border-[#DCD8C6] text-primary text-[11px] font-semibold shrink-0"
                  >
                    Inspect ›
                  </button>
                </div>

                {/* Action Button Row (Matches index.html Admin Panel) */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMemberId(isEditing ? null : m.id);
                      setRemovingMemberId(null);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#EAE8D7] border border-[#D5D2BE] text-primary text-[11px] font-bold"
                  >
                    ✏️ Rename
                  </button>

                  <ResetMemberRecords
                    member={m}
                    logCount={userLogCount}
                    onConfirmReset={(id) => {
                      if (onResetMemberLogs) onResetMemberLogs(id);
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
                      className="px-2.5 py-1 rounded-lg bg-[#E5DEC9] text-[#6B2D26] text-[11px] font-bold"
                    >
                      🗑️ Remove Member
                    </button>
                  )}
                </div>

                {isEditing && (
                  <EditMember
                    member={m}
                    onSaveMember={(id, updates) => {
                      if (onUpdateMember) onUpdateMember(id, updates);
                      setEditingMemberId(null);
                    }}
                    onCancel={() => setEditingMemberId(null)}
                  />
                )}

                {isRemoving && (
                  <RemoveMember
                    member={m}
                    dependentFamilyCount={dependentFamily.length}
                    logCount={userLogCount}
                    onConfirmRemove={(id) => {
                      if (onRemoveMember) onRemoveMember(id);
                      setRemovingMemberId(null);
                    }}
                    onCancel={() => setRemovingMemberId(null)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}