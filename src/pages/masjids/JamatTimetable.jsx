//Renders the daily congregation (Jamaat) timetable for Fajr, Dhuhr, Asr, Maghrib, Isha, and Jumu'ah, automatically highlighting the Next Upcoming Jamaat, and allowing users or admins to customize Jamaat times for their local Masjid.

import React, { useState } from 'react';

const PRAYER_META = [
  { key: 'fajr', label: 'Fajr', icon: '🌅', defaultAzan: '05:15 AM', defaultJamat: '05:40 AM' },
  { key: 'dhuhr', label: 'Dhuhr', icon: '☀️', defaultAzan: '12:30 PM', defaultJamat: '01:15 PM' },
  { key: 'asr', label: 'Asr', icon: '🌤️', defaultAzan: '04:00 PM', defaultJamat: '04:30 PM' },
  { key: 'maghrib', label: 'Maghrib', icon: '🌇', defaultAzan: '06:02 PM', defaultJamat: '06:07 PM' },
  { key: 'isha', label: 'Isha', icon: '🌙', defaultAzan: '07:30 PM', defaultJamat: '08:00 PM' },
  { key: 'jumuah', label: 'Jumu’ah (Friday)', icon: '🕌', defaultAzan: '12:45 PM', defaultJamat: '01:30 PM' },
];

function parseTimeStringToMinutes(timeStr = '') {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + mins;
}

export default function JamatTimetable({
  masjid,
  onUpdateJamatTimes,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTimings, setDraftTimings] = useState(masjid?.timings || {});

  if (!masjid) return null;

  const timings = masjid.timings || {};

  // Determine which daily prayer is next based on current local time
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const dailyKeys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  let nextPrayerKey = 'fajr';
  for (const k of dailyKeys) {
    const jamatStr = timings[k]?.jamat || '';
    const jamatMins = parseTimeStringToMinutes(jamatStr);
    if (jamatMins > currentMinutes) {
      nextPrayerKey = k;
      break;
    }
  }

  const handleSaveTimings = (e) => {
    e.preventDefault();
    try {
      if (navigator.vibrate) navigator.vibrate(12);
    } catch (_) {}
    if (onUpdateJamatTimes) {
      onUpdateJamatTimes(masjid.id, draftTimings);
    }
    setIsEditing(false);
  };

  return (
    <div className="card rounded-[22px] p-4 space-y-3 border border-[#D5D2BE]">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
            Congregation Schedule
          </span>
          <h3 className="font-serif text-[17.5px] font-semibold text-primary">
            🕰️ Azan &amp; Jamaat Timetable
          </h3>
        </div>

        {onUpdateJamatTimes && (
          <button
            type="button"
            onClick={() => {
              setDraftTimings(masjid.timings || {});
              setIsEditing(!isEditing);
            }}
            className="px-3 py-1 rounded-full bg-[#EAE8D7] border border-[#D5D2BE] text-primary text-[11px] font-bold"
          >
            {isEditing ? 'Cancel' : '✏️ Update Times'}
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSaveTimings} className="space-y-2.5 fade-in">
          {PRAYER_META.map((p) => {
            const cur = draftTimings[p.key] || {
              azan: p.defaultAzan,
              jamat: p.defaultJamat,
            };
            return (
              <div
                key={p.key}
                className="rounded-xl bg-[#F5F2E8] p-2.5 border border-[#DCD8C6] grid grid-cols-3 items-center gap-2"
              >
                <span className="text-[12px] font-bold text-primary">
                  {p.icon} {p.label}
                </span>
                <input
                  type="text"
                  value={cur.azan}
                  onChange={(e) =>
                    setDraftTimings((prev) => ({
                      ...prev,
                      [p.key]: { ...cur, azan: e.target.value },
                    }))
                  }
                  placeholder="Azan (e.g. 05:15 AM)"
                  className="bg-white text-[11.5px] py-1.5 px-2 rounded-lg border border-[#D5D2BE]"
                />
                <input
                  type="text"
                  value={cur.jamat}
                  onChange={(e) =>
                    setDraftTimings((prev) => ({
                      ...prev,
                      [p.key]: { ...cur, jamat: e.target.value },
                    }))
                  }
                  placeholder="Jamaat (e.g. 05:40 AM)"
                  className="bg-white text-[11.5px] font-bold py-1.5 px-2 rounded-lg border border-[#0D4A2E]/40"
                />
              </div>
            );
          })}

          <button
            type="submit"
            className="btn-primary w-full py-2.5 text-[12.5px] font-semibold"
          >
            Save Jamaat Timetable
          </button>
        </form>
      ) : (
        <div className="overflow-hidden rounded-[16px] border border-[#E2DEC9]">
          <div className="grid grid-cols-3 bg-[#EAE8D7] px-3.5 py-2 text-[10.5px] font-bold uppercase tracking-wider text-secondary">
            <span>Prayer</span>
            <span className="text-center">Azan</span>
            <span className="text-right">Jamaat</span>
          </div>

          <div className="divide-y divide-[#E2DEC9] bg-[#F5F2E8]">
            {PRAYER_META.map((p) => {
              const row = timings[p.key] || {
                azan: p.defaultAzan,
                jamat: p.defaultJamat,
              };
              const isNext = p.key === nextPrayerKey;

              return (
                <div
                  key={p.key}
                  className={`grid grid-cols-3 items-center px-3.5 py-2.5 text-[12.5px] ${
                    isNext
                      ? 'bg-[#0F4C2B] text-white font-semibold'
                      : 'text-primary'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 truncate">
                    <span>{p.icon}</span>
                    <span className="truncate">{p.label}</span>
                    {isNext && (
                      <span className="px-1.5 py-0.2 rounded bg-[#DFB75A] text-[#07361D] text-[8.5px] font-bold uppercase ml-1">
                        Next
                      </span>
                    )}
                  </div>

                  <div
                    className={`text-center text-[12px] ${
                      isNext ? 'text-white/85' : 'text-secondary'
                    }`}
                  >
                    {row.azan}
                  </div>

                  <div
                    className={`text-right font-serif text-[13.5px] font-bold ${
                      isNext ? 'text-[#F0D58C]' : 'text-[#135332]'
                    }`}
                  >
                    {row.jamat}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}