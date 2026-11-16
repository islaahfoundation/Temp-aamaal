//Renders an expandable directory drawer of all app shortcuts (Daily Aamaal, Digital Tasbih, Heart Check-In, Duas Library, Family Profiles, Circle Admin Panel, Seerah Stories, and Settings) right from the Home screen.

import React from 'react';

export default function AllShortcuts({
  onNavigateTab,
  onClose,
}) {
  const SHORTCUT_ITEMS = [
    {
      id: 'aamaal',
      title: 'Aamaal Tracker',
      desc: '313 Durood, Mulk & 100 Istighfar',
      icon: '📿',
      target: 'aamaal',
    },
    {
      id: 'tasbih',
      title: 'Digital Tasbih',
      desc: 'Interactive bead counter',
      icon: '✨',
      target: 'tasbih',
    },
    {
      id: 'feelings',
      title: 'Heart Check-In',
      desc: 'Prophetic Duas for your mood',
      icon: '🌿',
      target: 'feelings',
    },
    {
      id: 'duas',
      title: 'Duas & Adhkar',
      desc: 'Arabic + 4 translations & audio',
      icon: '🤲',
      target: 'duas',
    },
    {
      id: 'account',
      title: 'Family Profiles',
      desc: 'Add or switch household members',
      icon: '👨‍👩‍👧‍👦',
      target: 'account',
    },
    {
      id: 'admin',
      title: 'Circle Admin Panel',
      desc: 'Daily inspector & WhatsApp report',
      icon: '👑',
      target: 'admin',
    },
    {
      id: 'settings',
      title: 'Settings & Backup',
      desc: 'Preferences, language & reset',
      icon: '⚙️',
      target: 'settings',
    },
    {
      id: 'more',
      title: 'More Directory',
      desc: 'Stories, Learning & Masjids',
      icon: '🕌',
      target: 'more',
    },
  ];

  return (
    <div className="card rounded-[20px] p-4 mb-3.5 bg-[#EAE8D7] border border-[#0D4A2E]/30 space-y-3 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <span className="badge-pill">Full App Directory</span>
          <h3 className="font-serif text-[17.5px] font-semibold text-primary mt-1">
            All Aamaal Circle Shortcuts
          </h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F5F2E8] flex items-center justify-center text-primary font-bold text-xs"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {SHORTCUT_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              try {
                if (navigator.vibrate) navigator.vibrate(10);
              } catch (_) {}
              if (onNavigateTab) onNavigateTab(item.target);
              if (onClose) onClose();
            }}
            className="text-left rounded-2xl bg-[#F5F2E8] p-2.5 border border-[#DCD8C6] flex items-center space-x-2.5 active:scale-[0.98] transition"
          >
            <span className="w-8 h-8 rounded-xl bg-[#0D4A2E] text-[#F0D58C] flex items-center justify-center text-[15px] shrink-0">
              {item.icon}
            </span>
            <div className="min-w-0">
              <h4 className="font-serif text-[13px] font-semibold text-primary truncate">
                {item.title}
              </h4>
              <p className="text-[10px] text-secondary truncate">
                {item.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}