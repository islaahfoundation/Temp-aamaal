import React, { useState, useEffect } from 'react';
import PersonalProfile from './PersonalProfile';
import FamilySelector from './FamilySelector';
import AddFamilyMember from './AddFamilyMember';
import FamilyMemberDetails from './FamilyMemberDetails';
import AccountSecurity from './AccountSecurity';
import LogoutConfirmation from './LogoutConfirmation';

const LOGS_STORAGE_KEY = 'aamaal_circle_logs_v1';
const PROFILES_STORAGE_KEY = 'aamaal_circle_profiles_v1';
const ACTIVE_PROFILE_KEY = 'aamaal_active_profile_id';

export default function AccountDashboard({
  state,
  updateState,
  onNavigateTab,
  onShowToast,
  onBack,
}) {
  const [activeTab, setActiveTab] = useState('family'); // 'family' | 'profile' | 'security'
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [inspectedMemberId, setInspectedMemberId] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PROFILES_STORAGE_KEY) || 'null');
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch (_) {}
    return [
      {
        id: 'primary_member',
        name: state?.userName?.trim() || 'Circle Member',
        country: 'India',
        flag: '🇮🇳',
        privacy: 'public',
        isPrimary: true,
        createdAt: Date.now(),
      },
    ];
  });

  const [activeProfileId, setActiveProfileId] = useState(() => {
    try {
      return (
        localStorage.getItem(ACTIVE_PROFILE_KEY) ||
        state?.activeProfileId ||
        'primary_member'
      );
    } catch (_) {
      return 'primary_member';
    }
  });

  const [allLogs, setAllLogs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LOGS_STORAGE_KEY) || 'null');
      if (Array.isArray(saved)) return saved;
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    } catch (_) {}
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(allLogs));
    } catch (_) {}
  }, [allLogs]);

  const primaryProfile = profiles.find((p) => p.isPrimary) || profiles[0];
  const inspectedMember = profiles.find((p) => p.id === inspectedMemberId) || null;

  const activateMember = (member) => {
    if (!member) return;
    setActiveProfileId(member.id);
    try {
      localStorage.setItem(ACTIVE_PROFILE_KEY, String(member.id));
    } catch (_) {}
    if (updateState) {
      updateState({
        activeProfileId: member.id,
        activeProfileName: member.name,
      });
    }
  };

  const handleUpdateMemberLog = (memberId, aamaalId, dateKey, newCount) => {
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
        newCount > 0 ? `Saved ${newCount} recitations` : 'Recitation cleared'
      );
    }
  };

  return (
    <section className="screen-section no-scrollbar px-5 pt-4 pb-6">
      {/* Top Bar */}
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
              Aamaal Circle Account
            </span>
            <h2 className="font-serif text-[22px] font-semibold text-primary leading-tight">
              Account &amp; Family
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
          className="px-3 py-1 rounded-full bg-[#E5DEC9] text-[#6B2D26] text-[11px] font-semibold"
        >
          Sign Out
        </button>
      </div>

      {/* Sub-Navigation Pills */}
      <div className="flex space-x-2 mb-4">
        {[
          { id: 'family', label: `👨‍👩‍👧‍👦 Family (${profiles.length})` },
          { id: 'profile', label: '👤 My Profile' },
          { id: 'security', label: '🔐 PIN & Backup' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setInspectedMemberId(null);
              setShowAddFamily(false);
            }}
            className={`flex-1 py-2 rounded-full text-[11.5px] font-semibold transition ${
              activeTab === tab.id
                ? 'bg-[#0D4A2E] text-white shadow-sm'
                : 'bg-[#EAE8D7] text-primary border border-[#D5D2BE]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Optional Logout Confirmation Box */}
      {showLogoutConfirm && (
        <div className="mb-4">
          <LogoutConfirmation
            userName={primaryProfile?.name || 'Member'}
            onConfirmLogout={() => {
              setShowLogoutConfirm(false);
              if (onShowToast) onShowToast('Signed out');
              if (onNavigateTab) onNavigateTab('authentication');
            }}
            onCancel={() => setShowLogoutConfirm(false)}
          />
        </div>
      )}

      {/* TAB 1: FAMILY PROFILES & MEMBER INSPECTOR */}
      {activeTab === 'family' && (
        <div className="space-y-3.5">
          {inspectedMember ? (
            <FamilyMemberDetails
              member={inspectedMember}
              allLogs={allLogs}
              onUpdateMemberLog={handleUpdateMemberLog}
              onMakeActiveProfile={(id) => {
                const found = profiles.find((p) => p.id === id);
                if (found) activateMember(found);
                if (onShowToast) onShowToast(`${inspectedMember.name} is now active`);
              }}
              onSaveMemberDetails={(id, updates) => {
                setProfiles((prev) =>
                  prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
                );
                if (id === primaryProfile.id && updates.name && updateState) {
                  updateState({ userName: updates.name });
                }
                if (onShowToast) onShowToast('Member profile updated');
              }}
              onResetMemberLogs={(id) => {
                setAllLogs((prev) => prev.filter((l) => l.memberId !== id));
                if (onShowToast) onShowToast('Member logs reset to 0');
              }}
              onRemoveMember={(id) => {
                setProfiles((prev) => prev.filter((p) => p.id !== id));
                setAllLogs((prev) => prev.filter((l) => l.memberId !== id));
                setInspectedMemberId(null);
                if (activeProfileId === id) activateMember(primaryProfile);
                if (onShowToast) onShowToast('Family profile removed');
              }}
              onBack={() => setInspectedMemberId(null)}
            />
          ) : (
            <>
              {showAddFamily && (
                <AddFamilyMember
                  primaryMemberName={primaryProfile?.name || 'Member'}
                  defaultCountry={primaryProfile?.country || 'India'}
                  onAddMember={(newMember) => {
                    setProfiles((prev) => [...prev, newMember]);
                    activateMember(newMember);
                    setShowAddFamily(false);
                    if (onShowToast) {
                      onShowToast(`${newMember.name} added to your family circle!`);
                    }
                  }}
                  onCancel={() => setShowAddFamily(false)}
                />
              )}

              <FamilySelector
                profiles={profiles}
                activeProfileId={activeProfileId}
                onSelectProfile={(id) => {
                  const found = profiles.find((p) => p.id === id);
                  if (found) {
                    activateMember(found);
                    if (onShowToast) onShowToast(`Selected: ${found.name}`);
                  }
                }}
                onContinue={(member) => {
                  activateMember(member);
                  if (onShowToast) onShowToast(`Viewing ${member.name}'s Aamaal`);
                  if (onNavigateTab) onNavigateTab('aamaal');
                }}
                onOpenAddFamily={() => setShowAddFamily(true)}
              />
            </>
          )}
        </div>
      )}

      {/* TAB 2: PERSONAL PROFILE */}
      {activeTab === 'profile' && (
        <PersonalProfile
          primaryProfile={primaryProfile}
          onSavePrimaryProfile={(updates) => {
            setProfiles((prev) =>
              prev.map((p) =>
                p.id === primaryProfile.id ? { ...p, ...updates } : p
              )
            );
            if (updates.name && updateState) {
              updateState({ userName: updates.name });
            }
            if (onShowToast) onShowToast('Personal profile saved!');
          }}
        />
      )}

      {/* TAB 3: ACCOUNT SECURITY & BACKUP */}
      {activeTab === 'security' && (
        <AccountSecurity
          primaryProfile={primaryProfile}
          allProfiles={profiles}
          allLogs={allLogs}
          onUpdateSecurity={(secUpdates) => {
            setProfiles((prev) =>
              prev.map((p) =>
                p.id === primaryProfile.id ? { ...p, ...secUpdates } : p
              )
            );
            if (onShowToast) onShowToast('Security settings updated');
          }}
        />
      )}
    </section>
  );
}