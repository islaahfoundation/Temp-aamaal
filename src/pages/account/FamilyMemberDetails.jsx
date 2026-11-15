import React, { useState } from 'react';
import { getLocalDaysList } from '../aamaal/CalendarHistory';
import FamilyMemberAamaal from './FamilyMemberAamaal';
import EditFamilyMember from './EditFamilyMember';
import RemoveFamilyMember from './RemoveFamilyMember';

export default function FamilyMemberDetails({
  member,
  allLogs = [],
  onUpdateMemberLog,
  onSaveMemberDetails,
  onResetMemberLogs,
  onRemoveMember,
  onMakeActiveProfile,
  onBack,
}) {
  const [subMode, setSubMode] = useState('overview'); // 'overview' | 'edit' | 'remove'

  if (!member) return null;

  const memberLogs = allLogs.filter((l) => l.memberId === member.id);
  const weekKeys = new Set(getLocalDaysList(7).map((d) => d.dateKey));

  const lifetimeCount = memberLogs.reduce(
    (sum, l) => sum + Number(l.count || 0),
    0
  );
  const weekCount = memberLogs
    .filter((l) => weekKeys.has(l.dateKey))
    .reduce((sum, l) => sum + Number(l.count || 0), 0);
  const daysActive = new Set(
    memberLogs.filter((l) => Number(l.count) > 0).map((l) => l.dateKey)
  ).size;

  return (
    <div className="space-y-3.5 fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn-secondary px-3 py-1 text-[11.5px]"
          >
            ‹ Back to Family List
          </button>
        )}

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setSubMode(subMode === 'edit' ? 'overview' : 'edit')}
            className="px-3 py-1 rounded-full bg-[#EAE8D7] text-primary text-[11.5px] font-semibold border border-[#D5D2BE]"
          >
            {subMode === 'edit' ? 'Close Edit' : '✏️ Edit'}
          </button>
          <button
            type="button"
            onClick={() =>
              setSubMode(subMode === 'remove' ? 'overview' : 'remove')
            }
            className="px-3 py-1 rounded-full bg-[#E5DEC9] text-[#6B2D26] text-[11.5px] font-semibold"
          >
            Manage Data
          </button>
        </div>
      </div>

      {/* Member Hero Summary Banner */}
      <div className="card-progress rounded-[22px] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-[#C99E4C]/50 flex items-center justify-center text-[24px]">
              {member.flag || '🇮🇳'}
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full bg-[#DFB75A]/20 text-[#F0D58C] text-[9.5px] font-bold uppercase tracking-wider">
                {member.isPrimary ? 'Core Member' : 'Family Profile'}
              </span>
              <h3 className="font-serif text-[20px] font-semibold text-white mt-0.5">
                {member.name}
              </h3>
              <p className="text-[11px] text-white/80 capitalize">
                {member.country || 'India'} • Leaderboard: {member.privacy || 'public'}
              </p>
            </div>
          </div>

          {onMakeActiveProfile && (
            <button
              type="button"
              onClick={() => onMakeActiveProfile(member.id)}
              className="px-3 py-1.5 rounded-full bg-[#DFB75A] text-[#07361D] text-[11px] font-bold shadow-sm"
            >
              Switch Active
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-white/15 text-center">
          <div>
            <div className="font-serif text-[17px] font-bold text-[#F0D58C]">
              {lifetimeCount.toLocaleString('en-US')}
            </div>
            <div className="text-[10px] text-white/80">Total Recited</div>
          </div>
          <div className="border-x border-white/15">
            <div className="font-serif text-[17px] font-bold text-white">
              {weekCount.toLocaleString('en-US')}
            </div>
            <div className="text-[10px] text-white/80">Last 7 Days</div>
          </div>
          <div>
            <div className="font-serif text-[17px] font-bold text-white">
              {daysActive} Days
            </div>
            <div className="text-[10px] text-white/80">Days Logged</div>
          </div>
        </div>
      </div>

      {/* Conditional Edit or Remove Panels */}
      {subMode === 'edit' && (
        <EditFamilyMember
          member={member}
          onSaveMember={(id, updates) => {
            if (onSaveMemberDetails) onSaveMemberDetails(id, updates);
            setSubMode('overview');
          }}
          onCancel={() => setSubMode('overview')}
        />
      )}

      {subMode === 'remove' && (
        <RemoveFamilyMember
          member={member}
          logCount={memberLogs.length}
          onResetMemberLogs={(id) => {
            if (onResetMemberLogs) onResetMemberLogs(id);
            setSubMode('overview');
          }}
          onConfirmRemoveMember={(id) => {
            if (onRemoveMember) onRemoveMember(id);
          }}
          onCancel={() => setSubMode('overview')}
        />
      )}

      {/* Daily Aamaal Logging Card for this Member */}
      <FamilyMemberAamaal
        member={member}
        allLogs={allLogs}
        onUpdateMemberLog={onUpdateMemberLog}
      />
    </div>
  );
}