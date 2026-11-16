//Renders the 4 primary quick-action cards (Daily Aamaal, Digital Tasbih, Heart Check-In, Duas Library) plus a "View All Shortcuts" button that opens AllShortcuts.jsx.

import React from 'react';

export default function QuickActions({
  onNavigateTab,
  onOpenAllShortcuts,
}) {
  const PRIMARY_ACTIONS = [
    {
      id: 'aamaal',
      title: 'Daily Aamaal',
      subtitle: '313 Durood & Mulk',
      icon: '📿',
      badge: 'Track',
      onClick: () => onNavigateTab && onNavigateTab('aamaal'),
    },
    {
      id: 'tasbih',
      title: 'Digital Tasbih',
      subtitle: '33, 99 & 313 Counter',
      icon: '✨',
      badge: 'Beads',
      onClick: () => onNavigateTab && onNavigateTab('tasbih'),
    },
    {
      id: 'feelings',
      title: 'Heart Check-In',
      subtitle: 'Duas for your mood',
      icon: '🌿',
      badge: 'Remedy',
      onClick: () => onNavigateTab && onNavigateTab('feelings'),
    },
    {
      id: 'duas',
      title: 'Duas & Adhkar',
      subtitle: 'Arabic & 4 languages',
      icon: '🤲',
      badge: 'Read',
      onClick: () => onNavigateTab && onNavigateTab('duas'),
    },
  ];

  return (
    <div className="mb-3.5">
      <div className="flex items-center justify-between mb-2 px-0.5">
        <h3 className="font-serif text-[16px] font-semibold text-primary">
          Quick Actions
        </h3>
        {onOpenAllShortcuts && (
          <button
            type="button"
            onClick={onOpenAllShortcuts}
            className="text-[11.5px] font-semibold text-[#135332] underline"
          >
            All Shortcuts ›
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {PRIMARY_ACTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              try {
                if (navigator.vibrate) navigator.vibrate(10);
              } catch (_) {}
              item.onClick();
            }}
            className="text-left rounded-[18px] bg-[#F3EFE2] border border-white/90 shadow-soft-card p-3 flex items-start space-x-2.5 active:scale-[0.99] transition"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#165534] to-[#08351D] text-[#F0D58C] flex items-center justify-center text-[17px] shrink-0 shadow-sm">
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-[14px] font-semibold text-primary truncate">
                  {item.title}
                </h4>
              </div>
              <p className="text-[10.5px] text-secondary truncate mt-0.5">
                {item.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}