import React, { useState } from 'react';
import { CountryFlag } from '../aamaal/WeeklySummary';
import { ScreenHeader } from './adminShared';
import MemberPermissions from './MemberPermissions';

export default function AdminSettings({
  allMembers = [],
  allLogs = [],
  aamaalList = [],
  circleSettings,
  onUpdateSettings,
  onUpdateMember,
  onOpenExport,
  onWipeAllLogs,
  onResetCircle,
  onBack,
}) {
  const [openPanel, setOpenPanel] = useState(null); // 'circle' | 'admins' | 'permissions' | 'notifications' | 'data' | 'danger'
  const [circleName, setCircleName] = useState(circleSettings?.circleName || '');
  const [tagline, setTagline] = useState(circleSettings?.tagline || '');
  const [shareUrl, setShareUrl] = useState(circleSettings?.shareUrl || '');
  const [confirmAction, setConfirmAction] = useState(null); // 'wipe' | 'reset' | null

  const togglePanel = (id) => {
    setOpenPanel((prev) => (prev === id ? null : id));
    setConfirmAction(null);
  };

  const handleBackupJson = () => {
    const payload = { exportedAt: new Date().toISOString(), circleSettings, aamaalList, allMembers, allLogs };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aamaal-circle-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const coreMembers = allMembers.filter((m) => m.isPrimary !== false);

  const settingRows = [
    {
      id: 'circle',
      title: 'Circle Information',
      subtitle: 'Name, description and preferences',
      icon: (
        <svg className="w-5 h-5 text-[#14261C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.5v2" />
          <path d="M6.5 11.5C6.5 8.5 9 6 12 6s5.5 2.5 5.5 5.5H6.5z" />
          <path d="M5 11.5V20h14v-8.5" />
          <path d="M10 20v-4a2 2 0 0 1 4 0v4" />
        </svg>
      ),
    },
    {
      id: 'admins',
      title: 'Manage Admins',
      subtitle: 'Add or remove administrators',
      icon: (
        <svg className="w-5 h-5 text-[#14261C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: 'permissions',
      title: 'Member Permissions',
      subtitle: 'Control access and features',
      icon: (
        <svg className="w-5 h-5 text-[#14261C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <path d="M17 11l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      subtitle: 'Manage admin alerts',
      icon: (
        <svg className="w-5 h-5 text-[#14261C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
    {
      id: 'data',
      title: 'Data Management',
      subtitle: 'Export, backup or reset data',
      icon: (
        <svg className="w-5 h-5 text-[#14261C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      ),
    },
  ];

  return (
    <section className="screen-section no-scrollbar bg-[#F7F5EE] min-h-[100dvh] flex flex-col pb-24 select-none">
      <ScreenHeader title="Admin Settings" onBack={onBack} />

      <div className="px-4 space-y-3 flex-1">
        {settingRows.map((row) => {
          const isOpen = openPanel === row.id;
          return (
            <div key={row.id} className="rounded-[18px] bg-[#FCFBF7] border border-[#E6E2D5] shadow-[0_2px_10px_rgba(20,38,28,0.03)] overflow-hidden">
              <button
                type="button"
                onClick={() => togglePanel(row.id)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left active:bg-[#F3F0E5] transition"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#F3F1E8] flex items-center justify-center shrink-0">
                    {row.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-bold text-[#14261C] leading-tight">{row.title}</p>
                    <p className="text-[12px] text-[#55615A] mt-0.5 truncate">{row.subtitle}</p>
                  </div>
                </div>
                <svg className={`w-4 h-4 text-[#7A827D] transition-transform shrink-0 ${isOpen ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* PANEL 1: CIRCLE INFO */}
              {isOpen && row.id === 'circle' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onUpdateSettings?.({ circleName: circleName.trim(), tagline: tagline.trim(), shareUrl: shareUrl.trim() });
                    setOpenPanel(null);
                  }}
                  className="px-4 pb-4 pt-2 border-t border-[#EDE9DC] space-y-2.5"
                >
                  <input type="text" value={circleName} onChange={(e) => setCircleName(e.target.value)} placeholder="Circle Name" className="w-full px-3 py-2 rounded-xl bg-[#F7F5EE] border border-[#E6E2D5] text-[13px]" />
                  <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Tagline" className="w-full px-3 py-2 rounded-xl bg-[#F7F5EE] border border-[#E6E2D5] text-[13px]" />
                  <input type="url" value={shareUrl} onChange={(e) => setShareUrl(e.target.value)} placeholder="Share URL" className="w-full px-3 py-2 rounded-xl bg-[#F7F5EE] border border-[#E6E2D5] text-[12.5px]" />
                  <button type="submit" className="w-full py-2.5 rounded-full bg-[#0D4A2E] text-white text-[13px] font-semibold">
                    Save Circle Info
                  </button>
                </form>
              )}

              {/* PANEL 2: MANAGE ADMINS */}
              {isOpen && row.id === 'admins' && (
                <div className="px-4 pb-4 pt-2 border-t border-[#EDE9DC] divide-y divide-[#EDE9DC]">
                  {coreMembers.map((member) => (
                    <div key={member.id} className="py-2.5 first:pt-1 last:pb-0 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <CountryFlag country={member.country || 'India'} size={16} />
                        <div className="min-w-0">
                          <p className="text-[13.5px] font-bold text-[#14261C] truncate">
                            {member.name} {member.role === 'admin' && '👑'}
                          </p>
                          <p className="text-[11px] text-[#55615A] capitalize">{member.role || 'member'}</p>
                        </div>
                      </div>
                      {member.id === 'primary_member' ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#E0F3E5] text-[#15693B] text-[10.5px] font-bold">Owner</span>
                      ) : (
                        <MemberPermissions member={member} onToggleRole={(id, nextRole) => onUpdateMember?.(id, { role: nextRole })} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* PANEL 3: MEMBER PERMISSIONS */}
              {isOpen && row.id === 'permissions' && (
                <div className="px-4 pb-4 pt-2.5 border-t border-[#EDE9DC] space-y-3">
                  <label className="flex items-center justify-between text-[13px] font-medium text-[#14261C]">
                    <span>Allow Linked Family Profiles</span>
                    <input
                      type="checkbox"
                      checked={Boolean(circleSettings?.allowFamilyProfiles)}
                      onChange={(e) => onUpdateSettings?.({ allowFamilyProfiles: e.target.checked })}
                      className="w-4 h-4 accent-[#0D4A2E]"
                    />
                  </label>
                  <div className="flex items-center justify-between text-[13px] font-medium text-[#14261C]">
                    <span>Default Member Privacy</span>
                    <select
                      value={circleSettings?.defaultPrivacy || 'public'}
                      onChange={(e) => onUpdateSettings?.({ defaultPrivacy: e.target.value })}
                      className="px-2.5 py-1 rounded-lg bg-[#F7F5EE] border border-[#E6E2D5] text-[12px] font-semibold"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="anonymous">Anonymous</option>
                    </select>
                  </div>
                </div>
              )}

              {/* PANEL 4: NOTIFICATIONS */}
              {isOpen && row.id === 'notifications' && (
                <div className="px-4 pb-4 pt-2.5 border-t border-[#EDE9DC] space-y-3">
                  {[
                    { key: 'notifyNewMember', label: 'New Member Join Alerts' },
                    { key: 'notifyJamaatRequests', label: 'Jamaat Time Change Requests' },
                    { key: 'notifyBroadcasts', label: 'PWA Push Broadcasts' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between text-[13px] font-medium text-[#14261C]">
                      <span>{item.label}</span>
                      <input
                        type="checkbox"
                        checked={Boolean(circleSettings?.[item.key])}
                        onChange={(e) => onUpdateSettings?.({ [item.key]: e.target.checked })}
                        className="w-4 h-4 accent-[#0D4A2E]"
                      />
                    </label>
                  ))}
                </div>
              )}

              {/* PANEL 5: DATA MANAGEMENT */}
              {isOpen && row.id === 'data' && (
                <div className="px-4 pb-4 pt-2.5 border-t border-[#EDE9DC] grid grid-cols-2 gap-2.5">
                  <button type="button" onClick={onOpenExport} className="py-2.5 rounded-full bg-[#0D4A2E] text-white text-[12.5px] font-semibold">
                    Export Reports
                  </button>
                  <button type="button" onClick={handleBackupJson} className="py-2.5 rounded-full bg-[#F7F5EE] border border-[#0D4A2E] text-[#0D4A2E] text-[12.5px] font-semibold">
                    Backup JSON
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* DANGER ZONE CARD */}
        <div className="rounded-[18px] bg-[#FFF8F8] border-[1.5px] border-[#E7A9A6] overflow-hidden">
          <button
            type="button"
            onClick={() => togglePanel('danger')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-3.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#FCE7E6] text-[#C93B34] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-[14.5px] font-bold text-[#C93B34] leading-tight">Danger Zone</p>
                <p className="text-[12px] text-[#A85B57] mt-0.5 truncate">Reset all data or delete circle</p>
              </div>
            </div>
            <svg className={`w-4 h-4 text-[#C93B34] transition-transform shrink-0 ${openPanel === 'danger' ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {openPanel === 'danger' && (
            <div className="px-4 pb-4 pt-2.5 border-t border-[#F4CECC] space-y-2.5">
              {!confirmAction ? (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setConfirmAction('wipe')}
                    className="py-2.5 rounded-full bg-[#FCE7E6] text-[#B93A32] text-[12px] font-bold"
                  >
                    Clear All Logs ({allLogs.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmAction('reset')}
                    className="py-2.5 rounded-full bg-[#C93B34] text-white text-[12px] font-bold"
                  >
                    Reset Circle
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[12px] font-semibold text-[#6B2D26]">
                    {confirmAction === 'wipe'
                      ? `Permanently delete all ${allLogs.length} recitation logs?`
                      : 'Reset all members, logs, and Aamaal back to factory defaults?'}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirmAction === 'wipe') onWipeAllLogs?.();
                        else onResetCircle?.();
                        setConfirmAction(null);
                        setOpenPanel(null);
                      }}
                      className="flex-1 py-2 rounded-full bg-[#C93B34] text-white text-[12px] font-bold"
                    >
                      Yes, Proceed
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmAction(null)}
                      className="px-4 py-2 rounded-full bg-white text-[#14261C] text-[12px] font-semibold border border-[#E6E2D5]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}