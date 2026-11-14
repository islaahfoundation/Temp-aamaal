import React from 'react';

export default function BottomNavigation({ activeTab, onChangeTab }) {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3L3 10.5h2.5v9.5h5v-6h3v6h5v-9.5H21L12 3z" />
        </svg>
      )
    },
    {
      id: 'tasbih',
      label: 'Tasbih',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 28 28" fill="currentColor">
          <circle cx="14" cy="4.5" r="1.8" /><circle cx="18.5" cy="5.8" r="1.8" /><circle cx="21.5" cy="9.2" r="1.8" /><circle cx="22.2" cy="13.8" r="1.8" /><circle cx="20.2" cy="18" r="1.8" /><circle cx="16.4" cy="20.5" r="1.8" /><circle cx="11.6" cy="20.5" r="1.8" /><circle cx="7.8" cy="18" r="1.8" /><circle cx="5.8" cy="13.8" r="1.8" /><circle cx="6.5" cy="9.2" r="1.8" /><circle cx="9.5" cy="5.8" r="1.8" />
          <path d="M14 22v3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'duas',
      label: 'Duas',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      )
    },
    {
      id: 'more',
      label: 'More',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
          <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
        </svg>
      )
    }
  ];

  return (
    <nav className="relative z-30 h-[62px] shrink-0 bg-[#F5F2E8]/95 backdrop-blur-md rounded-t-[24px] shadow-nav-bar border-t border-white/90 px-6 flex items-center justify-between select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`relative flex flex-col items-center justify-center w-16 h-full transition ${
              isActive ? 'text-[#0D4A2E]' : 'text-[#4E5953]'
            }`}
          >
            {tab.icon}
            <span className={`text-[11.5px] mt-0.5 ${isActive ? 'font-semibold' : 'font-medium'}`}>
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute bottom-1 w-10 h-[3px] rounded-full bg-[#0D4A2E]"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
