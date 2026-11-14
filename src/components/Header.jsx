import React, { useState } from 'react';

export default function Header({ userName, onOpenNotifications, onOpenSettings }) {
  const [hasUnreadNotif, setHasUnreadNotif] = useState(true);

  const handleNotifClick = () => {
    setHasUnreadNotif(false);
    if (onOpenNotifications) onOpenNotifications();
  };

  return (
    <div className="relative z-10">
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-[54px] h-[46px] relative shrink-0 flex items-center justify-center overflow-hidden rounded-lg">
            <img
              alt="Aamaal Mosque Arch Logo"
              src="/logo.png"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="-mt-0.5">
            <h1 className="font-serif text-[25px] leading-none font-semibold text-[#0D4A2E] tracking-tight">
              Aamaal
            </h1>
            <p className="text-[10.5px] font-medium text-[#0D4A2E] tracking-[0.06em] mt-0.5">
              Live with Purpose
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleNotifClick}
            aria-label="Notifications"
            className="relative w-8 h-8 rounded-full bg-[#F5F2E8]/85 backdrop-blur-md border border-white/80 shadow-sm flex items-center justify-center text-[#0D4A2E] active:scale-95 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {hasUnreadNotif && (
              <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-[#C99E4C] ring-1 ring-[#F5F2E8]"></span>
            )}
          </button>

          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="w-8 h-8 rounded-full bg-[#F5F2E8]/85 backdrop-blur-md border border-white/80 shadow-sm flex items-center justify-center text-[#0D4A2E] active:scale-95 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        </div>
      </header>

      <div className="mt-5 pl-1">
        <div className="flex items-center space-x-2">
          <p className="text-[13px] font-medium text-[#0D4A2E]">
            {userName && userName.trim() ? `Assalamu Alaikum, ${userName.trim()}` : 'Assalamu Alaikum'}
          </p>
          {userName && userName.trim() && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#0D4A2E]/10 text-[#0D4A2E] border border-[#0D4A2E]/15">
              ✨ Personalized
            </span>
          )}
        </div>
        <h2 className="font-serif text-[23px] leading-[1.08] font-semibold text-[#0D4A2E] mt-0.5 max-w-[215px]">
          Your spiritual journey
        </h2>
        <p className="text-[11.5px] font-medium text-[#0D4A2E]/90 mt-0.5">
          Take a step closer to Allah
        </p>

        <div className="flex items-center mt-2.5 max-w-[155px]">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C99E4C] to-[#C99E4C]"></div>
          <div className="mx-1.5 w-2 h-2 rotate-45 border-[1.5px] border-[#C99E4C] bg-[#F5F2E8]"></div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C99E4C] to-[#C99E4C]"></div>
        </div>
      </div>
    </div>
  );
}
