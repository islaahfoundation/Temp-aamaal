// Renders the top greeting bar (Assalamu Alaikum, <Profile Name>) with an interactive dropdown to switch between the primary user and any linked family profiles, or jump directly to AccountDashboard.

import React, { useState } from 'react';
import { CountryFlag } from '../aamaal/WeeklySummary';
import logoImg from '../../assets/backgrounds/logo.png';

export default function ProfileSwitcher({
  profiles = [],
  activeProfile,
  unreadAlertsCount = 0,
  onSelectProfile,
  onOpenAccountPage,
  onOpenAlertInbox,
  onOpenSettings,
}) {
  const [openMenu, setOpenMenu] = useState(false);

  const current = activeProfile ||
    profiles[0] || {
      id: 'primary_member',
      name: 'Circle Member',
      country: 'India',
    };

  const rawName = (current.name || '').trim();
  const displayName =
    rawName && rawName !== 'Circle Member' ? rawName : '';

  return (
    <div className="relative pt-1 pb-2">
      {/* Top Bar: Aamaal Arch Logo + Notification Bell (Alert Inbox) & Settings Icons */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setOpenMenu(!openMenu)}
          className="flex items-center space-x-2.5 text-left group"
          title="Tap to switch family profile"
        >
          {/* Mosque Arch Logo */}
          <img
  src={logoImg}
  alt="Aamaal"
  className="w-11 h-11 object-contain shrink-0"
/>

<div>
  <div className="font-serif text-[27px] font-bold text-[#0D4A2E] leading-none tracking-tight">
    Aamaal
  </div>
  <div className="text-[10px] font-medium tracking-[0.08em] text-[#1A3826] mt-0.5">
    Live with Purpose
  </div>
</div>
        </button>

        {/* Top-Right Circular Action Buttons (Alert Inbox Bell + Settings Gear) */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onOpenAlertInbox}
            aria-label="Alert Inbox"
            className="relative w-9 h-9 rounded-full bg-[#F5F2E8]/90 border border-white shadow-sm flex items-center justify-center text-[#0D4A2E] active:scale-95 transition"
          >
            <svg
              className="w-[18px] h-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#0D4A2E] text-[#F0D58C] text-[9px] font-bold flex items-center justify-center border border-white">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Settings"
            className="w-9 h-9 rounded-full bg-[#F5F2E8]/90 border border-white shadow-sm flex items-center justify-center text-[#0D4A2E] active:scale-95 transition"
          >
            <svg
              className="w-[18px] h-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hero Greeting & Spiritual Journey Headline */}
      <div className="relative z-10">
        {/* Full-width greeting row so family names never get clipped */}
        <button
  type="button"
  onClick={() => setOpenMenu(!openMenu)}
  className="inline-flex items-center flex-wrap gap-x-1.5 max-w-full text-left text-[13.5px] font-medium text-[#0D4A2E] mb-1 bg-transparent"
>
  <span className="leading-snug">
    Assalamu Alaikum
    {displayName ? `, ${displayName}` : ''}
  </span>
  {profiles.length > 1 && (
    <span className="text-[10px] text-[#C99E4C] shrink-0">▾</span>
  )}
</button>

        <div className="pr-24">
          <h1 className="font-serif text-[29px] font-bold text-[#0D4A2E] leading-[1.12] tracking-tight">
            Your spiritual
            <br />
            journey
          </h1>

          <p className="text-[13px] font-medium text-[#1A3826] mt-1.5">
            Take a step closer to Allah
          </p>

          {/* Gold Ornamental Diamond Divider */}
          <div className="flex items-center space-x-2 mt-2 w-44">
            <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#C99E4C] to-[#C99E4C]" />
            <span className="text-[#C99E4C] text-[11px] leading-none">❖</span>
            <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#C99E4C] to-[#C99E4C]" />
          </div>
        </div>
      </div>

      {/* Profile Switcher Dropdown */}
      {openMenu && (
        <div className="absolute left-0 top-14 w-60 rounded-[18px] bg-[#F5F2E8] border border-[#D5D2BE] shadow-xl p-1.5 z-40 fade-in">
          <div className="px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wider text-secondary">
            Active Circle Profile
          </div>
          {profiles.map((prof) => {
            const isSelected = String(prof.id) === String(current.id);
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
              className="w-full mt-1 pt-1.5 border-t border-[#DCD8C6] text-center text-[11px] font-bold text-[#135332] py-1"
            >
              + Manage Family Profiles ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}