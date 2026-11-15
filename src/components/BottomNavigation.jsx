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
      ),
    },
    {
      id: 'aamaal',
      label: 'Aamaal',
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
    {
      id: 'duas',
      label: 'Duas',
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
    {
      id: 'more',
      label: 'More',
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
  ];

  // Keep 'More' highlighted when viewing Tasbih from the More directory
  const effectiveTab = activeTab === 'tasbih' ? 'more' : activeTab;

  return (
    <nav className="relative z-30 h-[62px] shrink-0 bg-[#F5F2E8]/95 backdrop-blur-md rounded-t-[24px] shadow-nav-bar border-t border-white/90 px-6 flex items-center justify-between select-none">
      {tabs.map((tab) => {
        const isActive = effectiveTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            className={`nav-tab-btn relative flex flex-col items-center justify-center w-16 h-full transition ${
              isActive ? 'text-[#0D4A2E]' : 'text-[#4E5953]'
            }`}
          >
            {tab.icon}
            <span
              className={`text-[11.5px] mt-0.5 ${
                isActive ? 'font-semibold' : 'font-medium'
              }`}
            >
              {tab.label}
            </span>
            {isActive && (
              <span className="nav-indicator absolute bottom-1 w-10 h-[3px] rounded-full bg-[#0D4A2E]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}