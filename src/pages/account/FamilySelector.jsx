import React from 'react';

export default function FamilySelector({
  profiles = [],
  activeProfileId,
  onSelectProfile,
  onInspectMember,
  onOpenAddFamily,
}) {
  return (
    <div className="card rounded-[20px] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
            Household Circle
          </span>
          <h3 className="font-serif text-[17px] font-semibold text-primary">
            Active Profile &amp; Family Members
          </h3>
        </div>
        {onOpenAddFamily && (
          <button
            type="button"
            onClick={onOpenAddFamily}
            className="px-3 py-1.5 rounded-full bg-[#0D4A2E] text-white text-[11.5px] font-semibold shadow-sm"
          >
            + Add Member
          </button>
        )}
      </div>

      <p className="text-[11.5px] text-secondary">
        Tap a profile to make it active for logging daily Aamaal, or tap{' '}
        <strong>Details</strong> to view or edit their individual recitations.
      </p>

      <div className="space-y-2">
        {profiles.map((member) => {
          const isActive = member.id === activeProfileId;
          return (
            <div
              key={member.id}
              className={`rounded-[16px] p-3 border transition flex items-center justify-between ${
                isActive
                  ? 'bg-[#0F4C2B] text-white border-[#C99E4C]/60 shadow-md'
                  : 'bg-[#F5F2E8] text-primary border-[#DCD8C6]'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  try {
                    if (navigator.vibrate) navigator.vibrate(10);
                  } catch (_) {}
                  if (onSelectProfile) onSelectProfile(member.id);
                }}
                className="flex items-center space-x-2.5 text-left flex-1 min-w-0"
              >
                <span className="text-[20px] shrink-0">
                  {member.flag || '🇮🇳'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <h4
                      className={`font-serif text-[14.5px] font-semibold truncate ${
                        isActive ? 'text-white' : 'text-primary'
                      }`}
                    >
                      {member.name}
                    </h4>
                    {member.isPrimary && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          isActive
                            ? 'bg-[#DFB75A] text-[#07361D]'
                            : 'bg-[#DCE3C8] text-primary'
                        }`}
                      >
                        You
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[10.5px] capitalize mt-0.5 ${
                      isActive ? 'text-white/80' : 'text-secondary'
                    }`}
                  >
                    {member.isPrimary ? 'Core Account' : 'Family Member'} •{' '}
                    {member.country || 'India'} • {member.privacy || 'public'}
                  </p>
                </div>
              </button>

              <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                {isActive && (
                  <span className="px-2 py-0.5 rounded-full bg-white/15 text-[#F0D58C] text-[10px] font-bold">
                    Active ✓
                  </span>
                )}
                {onInspectMember && (
                  <button
                    type="button"
                    onClick={() => onInspectMember(member)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border ${
                      isActive
                        ? 'bg-white/15 text-white border-white/25'
                        : 'bg-[#EAE8D7] text-primary border-[#D5D2BE]'
                    }`}
                  >
                    Details ›
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}