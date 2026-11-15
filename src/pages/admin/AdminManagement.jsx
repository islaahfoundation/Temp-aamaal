//Displays the list of Circle Administrators and allows promoting or demoting core members via MemberPermissions.

import React from 'react';
import { CountryFlag } from '../aamaal/WeeklySummary';
import MemberPermissions from './MemberPermissions';

export default function AdminManagement({
  allMembers = [],
  onToggleAdminRole,
}) {
  const coreMembers = allMembers.filter((m) => m.isPrimary !== false);

  return (
    <div className="card rounded-[20px] p-4 space-y-3">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
          Circle Governance
        </span>
        <h3 className="font-serif text-[17px] font-semibold text-primary">
          👑 Circle Administrators &amp; Roles
        </h3>
        <p className="text-[11.5px] text-secondary mt-0.5">
          Grant or revoke Admin Panel access for core circle members.
        </p>
      </div>

      <div className="divide-y divide-[#E2DEC9]">
        {coreMembers.map((member) => (
          <div
            key={member.id}
            className="py-2.5 first:pt-1 last:pb-0 flex items-center justify-between gap-2"
          >
            <div className="flex items-center space-x-2 min-w-0">
              <CountryFlag country={member.country || 'India'} size={18} />
              <div className="min-w-0">
                <h4 className="font-serif text-[14px] font-semibold text-primary truncate">
                  {member.name}{' '}
                  {member.role === 'admin' && (
                    <span title="Admin">👑</span>
                  )}
                </h4>
                <p className="text-[10.5px] text-secondary">
                  {member.country || 'India'} • Role:{' '}
                  <strong className="capitalize text-primary">
                    {member.role || 'member'}
                  </strong>
                </p>
              </div>
            </div>

            <MemberPermissions
              member={member}
              onToggleRole={() => {
                if (onToggleAdminRole) onToggleAdminRole(member.id);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}