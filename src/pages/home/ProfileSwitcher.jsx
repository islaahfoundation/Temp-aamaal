//Renders the top greeting bar (Assalamu Alaikum, Ubaid) with an interactive dropdown to switch between the primary user and any linked family profiles, or jump directly to AccountDashboard.

import React, { useState } from 'react';
import { CountryFlag } from '../aamaal/WeeklySummary';

export default function ProfileSwitcher({
  profiles = [],
  activeProfile,
  onSelectProfile,
  onOpenAccountPage,
}) {
  const [openMenu, setOpenMenu] = useState(false);

  const current = activeProfile ||
    profiles[0] || {
      id: 'primary_member',
      name: 'Circle Member',
      country: 'India',
    };

  const getTimeGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Blessed Morning • Sabah al-Khair';
    if (hr < 17) return 'Peaceful Afternoon • Masa al-Khair';
    return 'Tranquil Evening • Masa al-Noor';
  };

  return (
    <div className="relative flex items-center justify-between mb-3">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
          {getTimeGreeting()}
        </span>
        <h1 className="font-serif text-[23px] font-semibold text-primary leading-tight">
          Assalamu Alaikum, {current.name.split(/\s+/)[0]}
        </h1>
      </div>

      {/* Active Profile Pill */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            try {
              if (navigator.vibrate) navigator.vibrate(8);
            } catch (_) {}
            setOpenMenu(!openMenu);
          }}
          className="px-3 py-1.5 rounded-full bg-[#F3EFE2] border border-[#D5D2BE] shadow-soft-card flex items-center space-x-2 text-[12px] font-bold text-primary"
        >
          <CountryFlag country={current.country || 'India'} size={16} />
          <span className="max-w-[95px] truncate">{current.name}</span>
          <span className="text-[9px] text-secondary">▼</span>
        </button>

        {openMenu && (
          <div className="absolute right-0 top-full mt-1.5 w-56 rounded-[18px] bg-[#F5F2E8] border border-[#D5D2BE] shadow-xl p-1.5 z-40 fade-in">
            <div className="px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wider text-secondary">
              Switch Active Profile
            </div>

            {profiles.map((prof) => {
              const isSelected = prof.id === current.id;
              return (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => {
                    if (onSelectProfile) onSelectProfile(prof.id);
                    setOpenMenu(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-left text-[12px] flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-[#0D4A2E] text-white font-bold'
                      : 'text-primary hover:bg-[#EAE8D7]'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <CountryFlag country={prof.country || 'India'} size={15} />
                    <span className="truncate">{prof.name}</span>
                  </div>
                  {isSelected && <span className="text-[#F0D58C]">✓</span>}
                </button>
              );
            })}

            {onOpenAccountPage && (
              <button
                type="button"
                onClick={() => {
                  setOpenMenu(false);
                  onOpenAccountPage();
                }}
                className="w-full mt-1 pt-1.5 border-t border-[#DCD8C6] text-center text-[11px] font-bold text-[#135332] py-1.5"
              >
                + Manage Family Profiles ›
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}