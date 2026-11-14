import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_REMINDERS = [
  {
    id: 'durood',
    title: 'Durood Count Reminder',
    subtitle: "Don't forget your daily 313 Durood Shareef",
    time: '08:30',
    enabled: true,
  },
  {
    id: 'mulk',
    title: 'Surah Mulk Nightly Alert',
    subtitle: 'Read Surah Mulk before sleep for protection',
    time: '21:45',
    enabled: true,
  },
  {
    id: 'thursday',
    title: 'Thursday Night Sunnah',
    subtitle: '6 Salawat Ibrahimiyyah every Thursday evening',
    time: '19:30',
    enabled: true,
  },
];

export default function NotificationIntro() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState(DEFAULT_REMINDERS);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('aamaal_reminders_schedule') || 'null');
      if (Array.isArray(saved) && saved.length > 0) {
        setReminders(saved);
      }
    } catch (_) {}
  }, []);

  const toggleReminder = (id) => {
    try {
      if (navigator.vibrate) navigator.vibrate(12);
    } catch (_) {}
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const updateTime = (id, newTime) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, time: newTime } : r))
    );
  };

  const handleContinue = () => {
    try {
      if (navigator.vibrate) navigator.vibrate(15);
      localStorage.setItem('aamaal_reminders_schedule', JSON.stringify(reminders));

      const activeCount = reminders.filter((r) => r.enabled).length;
      const appState = JSON.parse(localStorage.getItem('aamaal_circle_compact_v3') || '{}');
      localStorage.setItem(
        'aamaal_circle_compact_v3',
        JSON.stringify({ ...appState, remindersCount: activeCount })
      );
    } catch (_) {}
    navigate('/onboarding/permissions');
  };

  return (
    <section className="screen-section no-scrollbar px-5 pt-6 pb-6 flex flex-col justify-between">
      <div>
        {/* Top Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="./img/logo.png"
              alt="Aamaal"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="w-9 h-8 object-contain"
            />
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-gold leading-none">
                Islaah Foundation’s
              </p>
              <p className="font-serif text-[14px] font-semibold text-primary leading-tight">
                Aamaal Circle
              </p>
            </div>
          </div>
          <span className="badge-pill">Step 4 of 5</span>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mt-4">
          <h2 className="font-serif text-[26px] font-semibold text-primary">
            Stay Consistent
          </h2>
          <p className="text-[12.5px] text-secondary mt-1 max-w-[305px] mx-auto">
            Enable gentle daily reminders to help you stay on track with your Aamaal without missing a single day.
          </p>
        </div>

        {/* Interactive Notification Callout Cards */}
        <div className="space-y-2.5 mt-4">
          {reminders.map((item) => (
            <div
              key={item.id}
              className={`rounded-[16px] p-3 border transition ${
                item.enabled
                  ? 'bg-[#0F4C2B] text-white border-[#C99E4C]/55 shadow-md'
                  : 'bg-[#F3EFE2] text-primary border-white/90 shadow-soft-card opacity-80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      item.enabled
                        ? 'bg-[#DFB75A] text-[#07361D]'
                        : 'bg-[#EAE8D7] text-primary'
                    }`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <div>
                    <h4
                      className={`font-serif text-[14px] font-semibold leading-tight ${
                        item.enabled ? 'text-white' : 'text-primary'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <p
                      className={`text-[11px] mt-0.5 ${
                        item.enabled ? 'text-white/80' : 'text-secondary'
                      }`}
                    >
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleReminder(item.id)}
                  className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold transition ${
                    item.enabled
                      ? 'bg-[#DFB75A] text-[#07361D]'
                      : 'bg-[#EAE8D7] text-secondary'
                  }`}
                >
                  {item.enabled ? 'ON' : 'OFF'}
                </button>
              </div>

              {item.enabled && (
                <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between">
                  <span className="text-[11px] text-[#F0D58C] font-medium">
                    Reminder Time:
                  </span>
                  <input
                    type="time"
                    value={item.time}
                    onChange={(e) => updateTime(item.id, e.target.value)}
                    className="w-auto py-0.5 px-2 rounded-lg bg-black/25 border border-white/20 text-white text-[11.5px]"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 3 Feature Highlight Pillars */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="card-soft p-2.5 text-center">
            <h4 className="font-serif text-[12px] font-semibold text-primary">
              Timely Alerts
            </h4>
            <p className="text-[10px] text-secondary mt-0.5 leading-tight">
              Morning & night nudges.
            </p>
          </div>
          <div className="card-soft p-2.5 text-center">
            <h4 className="font-serif text-[12px] font-semibold text-primary">
              Custom Times
            </h4>
            <p className="text-[10px] text-secondary mt-0.5 leading-tight">
              Fit your daily routine.
            </p>
          </div>
          <div className="card-soft p-2.5 text-center">
            <h4 className="font-serif text-[12px] font-semibold text-primary">
              Peaceful
            </h4>
            <p className="text-[10px] text-secondary mt-0.5 leading-tight">
              Gentle, non-intrusive reminders.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="pt-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/onboarding/permissions')}
          className="text-[13px] font-medium text-muted px-2 py-2"
        >
          Skip
        </button>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
          <span className="w-5 h-2 rounded-full bg-[#0D4A2E]" />
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
        </div>

        <button
          onClick={handleContinue}
          className="btn-primary px-6 py-2.5 text-[13.5px]"
        >
          <span>Next</span>
          <span>›</span>
        </button>
      </footer>
    </section>
  );
}