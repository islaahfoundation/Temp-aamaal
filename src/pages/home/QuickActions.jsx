//Renders the 4 primary quick-action cards (Daily Aamaal, Digital Tasbih, Heart Check-In, Duas Library) plus a "View All Shortcuts" button that opens AllShortcuts.jsx.

// src/components/QuickActions.jsx
import React from 'react';
import duaIcon from '../../assets/icons/dua-icon.png';

export default function QuickActions({
  onNavigateTab,
  onOpenAllShortcuts,
  onOpenStories,
  onOpenSavedDuas,
}) {
  const ACTIONS = [
    {
      id: 'tasbih',
      label: 'Tasbih',
      onClick: () => onNavigateTab && onNavigateTab('tasbih'),
      icon: (
        <svg className="w-6 h-6 text-[#0D4A2E]" viewBox="0 0 28 28" fill="currentColor">
          <circle cx="14" cy="4.5" r="1.8" />
          <circle cx="18.8" cy="6.2" r="1.8" />
          <circle cx="21.2" cy="10.5" r="1.8" />
          <circle cx="20.2" cy="15.5" r="1.8" />
          <circle cx="16.5" cy="18.8" r="1.8" />
          <circle cx="11.5" cy="18.8" r="1.8" />
          <circle cx="7.8" cy="15.5" r="1.8" />
          <circle cx="6.8" cy="10.5" r="1.8" />
          <circle cx="9.2" cy="6.2" r="1.8" />
          <path
            d="M14 20.5v4.5"
            stroke="#C99E4C"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: 'duas',
      label: 'Duas',
      onClick: () => onNavigateTab && onNavigateTab('duas'),
      icon: (
        <img
          src={duaIcon}
          alt="Duas"
          className="w-8 h-8 -my-1 object-contain"
        />
      ),
    },
    {
      id: 'stories',
      label: 'Stories',
      onClick: () =>
        onOpenStories
          ? onOpenStories()
          : onNavigateTab && onNavigateTab('stories'),
      icon: (
        <svg
          className="w-6 h-6 text-[#0D4A2E]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z" />
          <path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
    {
      id: 'saved',
      label: 'Saved',
      onClick: () =>
        onOpenSavedDuas
          ? onOpenSavedDuas()
          : onNavigateTab && onNavigateTab('duas'),
      icon: (
        <svg
          className="w-6 h-6 text-[#0D4A2E]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="my-3">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-serif text-[19px] font-semibold text-[#0D4A2E]">
          Quick Actions
        </h3>
        {onOpenAllShortcuts && (
          <button
            type="button"
            onClick={onOpenAllShortcuts}
            className="text-[12.5px] font-medium text-[#1A3826] flex items-center space-x-1"
          >
            <span>See all</span>
            <span>›</span>
          </button>
        )}
      </div>

      {/* 4-Column Quick Action Tiles */}
      <div className="grid grid-cols-4 gap-2.5">
        {ACTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              try {
                if (navigator.vibrate) navigator.vibrate(10);
              } catch (_) {}
              item.onClick();
            }}
            className="rounded-[18px] bg-[#E8E6D5] border border-white/90 shadow-soft-card py-3 px-2 flex flex-col items-center justify-center space-y-1.5 active:scale-95 transition"
          >
            {item.icon}
            <span className="text-[12px] font-medium text-[#1A3826]">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}