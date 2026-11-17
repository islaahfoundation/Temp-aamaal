//Lets the user customize which cards appear on the Home Dashboard (Today's Progress Ring, Quick Actions Row, Daily Featured Dua, Continue Reading Seerah, and Thursday Salawat Reminder).

import React from 'react';

export default function HomeCustomisation({
  settings = {
    showHomeProgress: true,
    showQuickActions: true,
    showFeaturedDua: true,
    showContinueReading: true,
    showThursdayReminder: true,
  },
  onUpdateSettings,
  onBack,
}) {
  const toggleSection = (key) => {
    try {
      if (navigator.vibrate) navigator.vibrate(8);
    } catch (_) {}
    if (onUpdateSettings) {
      onUpdateSettings({
        ...settings,
        [key]: settings[key] === false ? true : false,
      });
    }
  };

  const HOME_SECTIONS = [
    {
      key: 'showHomeProgress',
      title: 'Today’s Progress Ring & Goals Card',
      desc: '0%–100% circular progress ring with Dhikr, Sessions & Reminders',
    },
    {
      key: 'showQuickActions',
      title: '4-Column Quick Actions Row',
      desc: 'Fast shortcuts to Tasbih, Duas, Stories, and Saved bookmarks',
    },
    {
      key: 'showFeaturedDua',
      title: 'Daily Featured Dua Card',
      desc: 'Split Quran illustration card with daily Prophetic supplication',
    },
    {
      key: 'showContinueReading',
      title: 'Continue Reading (The Valley of Makkah)',
      desc: 'Resume your current Seerah lesson directly from the Home screen',
    },
    {
      key: 'showThursdayReminder',
      title: 'Thursday Night Salawat Banner',
      desc: 'Bottom reminder banner with green mosque silhouette',
    },
  ];

  return (
    <div className="space-y-3.5 fade-in">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary px-3.5 py-1.5 text-[11.5px] font-semibold"
        >
          ‹ Back to Settings
        </button>
      )}

      <div>
        <span className="badge-pill">Dashboard Layout</span>
        <h3 className="font-serif text-[21px] font-semibold text-primary mt-1">
          🏠 Home Screen Customisation
        </h3>
        <p className="text-[12px] text-secondary mt-0.5">
          Choose which sections and widgets appear on your main Home tab.
        </p>
      </div>

      <div className="card rounded-[20px] p-4 space-y-2.5">
        {HOME_SECTIONS.map((sec) => {
          const isVisible = settings[sec.key] !== false;
          return (
            <div
              key={sec.key}
              className="flex items-center justify-between rounded-2xl bg-[#F5F2E8] p-3 border border-[#DCD8C6] gap-3"
            >
              <div>
                <h4 className="font-serif text-[14.5px] font-semibold text-primary">
                  {sec.title}
                </h4>
                <p className="text-[11px] text-secondary mt-0.5">{sec.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleSection(sec.key)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 ${
                  isVisible
                    ? 'bg-[#0D4A2E] text-[#F0D58C]'
                    : 'bg-[#EAE8D7] text-secondary'
                }`}
              >
                {isVisible ? 'Visible ✓' : 'Hidden'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}