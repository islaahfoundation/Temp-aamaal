import React from 'react';

function DefaultAvatar({ name = '' }) {
  const initial = name.trim() ? name.trim()[0].toUpperCase() : 'A';
  return (
    <div className="w-12 h-12 rounded-full bg-[#DCE5DD] border border-[#C6D5C8] flex items-center justify-center shrink-0 text-[#0D4A2E] font-serif text-[18px] font-bold">
      {initial}
    </div>
  );
}

export default function FamilySelector({
  profiles = [],
  activeProfileId,
  onSelectProfile,
  onOpenAddFamily,
  onContinue,
}) {
  const activeMember =
    profiles.find((m) => m.id === activeProfileId) || profiles[0] || null;

  const handleSelect = (memberId) => {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
      localStorage.setItem('aamaal_active_profile_id', String(memberId));
    } catch (_) {}
    if (onSelectProfile) onSelectProfile(memberId);
  };

  const handleContinue = () => {
    if (!activeMember) return;
    try {
      if (navigator.vibrate) navigator.vibrate(18);
      localStorage.setItem('aamaal_active_profile_id', String(activeMember.id));
    } catch (_) {}
    if (onContinue) onContinue(activeMember);
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#FAF8F2] px-4 pt-5 pb-4 flex flex-col justify-between min-h-[520px] select-none">
      {/* Main Content */}
      <div className="relative z-10 w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="font-serif text-[25px] font-bold text-[#14261C] leading-tight">
            Select a Profile
          </h1>
          <p className="text-[12.5px] text-[#4E5953] mt-1">
            Choose whose Aamaal you want to view
          </p>
        </div>

        {/* Profile Cards List */}
        <div className="space-y-3">
          {profiles.map((member) => {
            const isActive = member.id === activeProfileId;
            const subtitleParts = [];
            if (member.age) subtitleParts.push(`Age: ${member.age}`);
            else if (member.isPrimary) subtitleParts.push('Primary');
            subtitleParts.push(member.country || 'India');

            return (
              <button
                key={member.id}
                type="button"
                onClick={() => handleSelect(member.id)}
                className={`w-full rounded-[20px] px-4 py-3.5 border-[1.5px] transition flex items-center justify-between text-left active:scale-[0.99] ${
                  isActive
                    ? 'bg-[#E9F5EC] border-[#0D4A2E] shadow-sm'
                    : 'bg-[#FDFCF8] border-[#E8E5D8] shadow-[0_2px_10px_rgba(20,38,28,0.04)]'
                }`}
              >
                {/* Left: Avatar + Name & Meta */}
                <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover bg-[#DCE5DD] border border-[#C6D5C8] shrink-0"
                    />
                  ) : (
                    <DefaultAvatar name={member.name} />
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-[17px] font-bold text-[#14261C] leading-snug truncate">
                      {member.name}
                    </h3>
                    <p className="text-[12px] text-[#55615A] mt-0.5 truncate">
                      {subtitleParts.join(' • ')}
                    </p>
                  </div>
                </div>

                {/* Right: Radio / Checkmark Indicator */}
                <div className="ml-3 shrink-0">
                  {isActive ? (
                    <span className="w-6 h-6 rounded-full bg-[#0D4A2E] text-white flex items-center justify-center">
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  ) : (
                    <span className="block w-6 h-6 rounded-full border-[1.6px] border-[#B8B5A8] bg-transparent" />
                  )}
                </div>
              </button>
            );
          })}

          {/* Add Family Member Card */}
          {onOpenAddFamily && (
            <button
              type="button"
              onClick={() => {
                try {
                  if (navigator.vibrate) navigator.vibrate(10);
                } catch (_) {}
                onOpenAddFamily();
              }}
              className="w-full rounded-[20px] px-4 py-4 bg-[#E1EFE2] border border-[#C8DEC9] flex items-center space-x-3.5 text-left active:scale-[0.99] transition"
            >
              <span className="w-9 h-9 ml-1.5 rounded-full border-[1.8px] border-[#0D4A2E] text-[#0D4A2E] flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
              <span className="font-serif text-[16px] font-semibold text-[#14261C]">
                Add Family Member
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Continue CTA */}
      <footer className="relative z-10 w-full pt-6 pb-1 shrink-0">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full h-[48px] rounded-full bg-gradient-to-r from-[#0B462B] via-[#135B39] to-[#083B23] text-white text-[15px] font-semibold shadow-md active:scale-[0.98] transition"
        >
          Continue
        </button>
      </footer>

      {/* Subtle Bottom Mosque Skyline Silhouette */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-24 opacity-35"
        viewBox="0 0 400 90"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="familySkylineGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E6D5A7" stopOpacity="0" />
            <stop offset="100%" stopColor="#E6D5A7" stopOpacity="0.65" />
          </linearGradient>
        </defs>
        <rect width="400" height="90" fill="url(#familySkylineGlow)" />
        <path
          d="M0 90V64h18V36l3-12 3 12v28h14c3-14 12-22 22-22s19 8 22 22h18V46l2.5-9 2.5 9v18h36V38l3-11 3 11v26h14c4-18 17-30 31-30s27 12 31 30h14V38l3-11 3 11v26h36V46l2.5-9 2.5 9v18h18c3-14 12-22 22-22s19 8 22 22h14V36l3-12 3 12v28h18v26H0z"
          fill="#7D9B84"
        />
      </svg>
    </div>
  );
}