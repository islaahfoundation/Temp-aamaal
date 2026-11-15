//Displays a comprehensive admin drill-down view for any circle or family member: per-Aamaal recitation totals, recent log history, role toggle, rename/edit, reset logs, and remove member.   

import React, { useState } from 'react';
import { CountryFlag } from '../aamaal/WeeklySummary';
import { formatAnyDatePretty } from '../aamaal/DateSelector';
import EditMember from './EditMember';
import RemoveMember from './RemoveMember';
import ResetMemberRecords from './ResetMemberRecords';
import MemberPermissions from './MemberPermissions';

export default function MemberDetails({
  member,
  parentMember,
  dependentFamily = [],
  aamaalList = [],
  allLogs = [],
  onUpdateMember,
  onResetMemberLogs,
  onRemoveMember,
  onDeleteSingleLog,
  onBack,
}) {
  const [subAction, setSubAction] = useState(null); // 'edit' | 'remove' | null

  if (!member) return null;

  const memberLogs = allLogs
    .filter((l) => l.memberId === member.id)
    .sort((a, b) => (b.dateKey || '').localeCompare(a.dateKey || ''));

  const totalLifetime = memberLogs.reduce(
    (sum, l) => sum + Number(l.count || 0),
    0
  );

  const aamaalMap = {};
  aamaalList.forEach((a) => {
    aamaalMap[a.id] = a.name;
  });

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
            ‹ Back to Directory
          </button>
        )}

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setSubAction(subAction === 'edit' ? null : 'edit')}
            className="px-3 py-1 rounded-lg bg-[#EAE8D7] text-primary text-[11px] font-bold border border-[#D5D2BE]"
          >
            ✏️ Rename / Edit
          </button>
          <ResetMemberRecords
            member={member}
            logCount={memberLogs.length}
            onConfirmReset={(id) => {
              if (onResetMemberLogs) onResetMemberLogs(id);
            }}
          />
        </div>
      </div>

      {/* Member Hero Card */}
      <div className="card-progress rounded-[22px] p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-[#C99E4C]/50 flex items-center justify-center shrink-0">
              <CountryFlag country={member.country || 'India'} size={22} />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-serif text-[19px] font-semibold text-white">
                  {member.name}
                </h3>
                {member.role === 'admin' && <span>👑</span>}
              </div>
              <p className="text-[11px] text-white/80">
                {member.isPrimary
                  ? 'Core Member'
                  : `Family (via ${parentMember?.name || 'Member'})`}{' '}
                • {member.country || 'India'} • Privacy:{' '}
                <strong className="capitalize text-[#F0D58C]">
                  {member.privacy || 'public'}
                </strong>
              </p>
              {member.phone && (
                <p className="text-[11px] text-[#F0D58C] mt-0.5">
                  📱 {member.phone}
                </p>
              )}
            </div>
          </div>

          {member.isPrimary && (
            <MemberPermissions
              member={member}
              onToggleRole={(id, nextRole) => {
                if (onUpdateMember) onUpdateMember(id, { role: nextRole });
              }}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-white/15 text-center">
          <div>
            <div className="font-serif text-[18px] font-bold text-[#F0D58C]">
              {totalLifetime.toLocaleString('en-US')}
            </div>
            <div className="text-[10.5px] text-white/80">
              Cumulative Recitations
            </div>
          </div>
          <div className="border-l border-white/15">
            <div className="font-serif text-[18px] font-bold text-white">
              {memberLogs.length} Logs
            </div>
            <div className="text-[10.5px] text-white/80">Total Entries</div>
          </div>
        </div>
      </div>

      {subAction === 'edit' && (
        <EditMember
          member={member}
          onSaveMember={(id, updates) => {
            if (onUpdateMember) onUpdateMember(id, updates);
            setSubAction(null);
          }}
          onCancel={() => setSubAction(null)}
        />
      )}

      {subAction === 'remove' && (
        <RemoveMember
          member={member}
          dependentFamilyCount={dependentFamily.length}
          logCount={memberLogs.length}
          onConfirmRemove={(id) => {
            if (onRemoveMember) onRemoveMember(id);
          }}
          onCancel={() => setSubAction(null)}
        />
      )}

      {/* Breakdown by Aamaal */}
      <div className="card rounded-[20px] p-4 space-y-2.5">
        <h4 className="font-serif text-[15.5px] font-semibold text-primary">
          Totals by Aamaal
        </h4>
        <div className="divide-y divide-[#E2DEC9]">
          {aamaalList.map((a) => {
            const sum = memberLogs
              .filter((l) => l.aamaalId === a.id)
              .reduce((acc, l) => acc + Number(l.count || 0), 0);
            return (
              <div
                key={a.id}
                className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-[12.5px]"
              >
                <span className="font-semibold text-primary">{a.name}</span>
                <strong className="font-serif text-[14px] text-[#135332]">
                  {sum.toLocaleString('en-US')}
                </strong>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Logs List */}
      <div className="card rounded-[20px] p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-[15.5px] font-semibold text-primary">
            Recent Recitation Logs ({memberLogs.length})
          </h4>
          {!member.isPrimary && (
            <button
              type="button"
              onClick={() => setSubAction('remove')}
              className="text-[11px] font-bold text-[#6B2D26] underline"
            >
              🗑️ Remove Member
            </button>
          )}
        </div>

        {memberLogs.length === 0 ? (
          <p className="text-[12px] text-muted py-2">
            No recitation logs recorded for this member yet.
          </p>
        ) : (
          <div className="divide-y divide-[#E2DEC9] max-h-56 overflow-y-auto no-scrollbar">
            {memberLogs.slice(0, 20).map((log) => (
              <div
                key={log.id}
                className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-[12px]"
              >
                <div>
                  <span className="font-bold text-primary">
                    {aamaalMap[log.aamaalId] || log.aamaalId}
                  </span>
                  <span className="text-secondary ml-2">
                    • {formatAnyDatePretty(log.dateKey)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <strong className="text-[#135332]">
                    {Number(log.count).toLocaleString('en-US')}
                  </strong>
                  {onDeleteSingleLog && (
                    <button
                      type="button"
                      onClick={() => onDeleteSingleLog(log.id)}
                      className="text-[#6B2D26] text-[11px] font-bold px-1.5"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}