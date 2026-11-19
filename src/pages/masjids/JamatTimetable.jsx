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
  isAdmin = false,
  onUpdateJamatTimes,
  onSubmitChangeRequest,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isRequestingChange, setIsRequestingChange] = useState(false);
  const [draftTimings, setDraftTimings] = useState(masjid?.timings || {});

  // Non-admin change request state
  const [reqPrayerKey, setReqPrayerKey] = useState('fajr');
  const [reqProposedJamat, setReqProposedJamat] = useState('');
  const [reqNote, setReqNote] = useState('');
  const [clockPhotoDataUrl, setClockPhotoDataUrl] = useState('');
  const [capturedTimestamp, setCapturedTimestamp] = useState('');

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

  const handlePhotoCapture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setClockPhotoDataUrl(reader.result || '');
      setCapturedTimestamp(
        new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date())
      );
    };
    reader.readAsDataURL(file);
  };

  const handleSendChangeRequest = (e) => {
    e.preventDefault();
    if (!reqProposedJamat.trim() || !clockPhotoDataUrl) return;
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}

    const requestPayload = {
      id: `jreq_${Date.now()}`,
      masjidId: masjid.id,
      masjidName: masjid.name,
      prayerKey: reqPrayerKey,
      proposedJamat: reqProposedJamat.trim(),
      note: reqNote.trim(),
      clockPhoto: clockPhotoDataUrl,
      capturedAt: capturedTimestamp || new Date().toLocaleString(),
      status: 'pending',
    };

    if (onSubmitChangeRequest) {
      onSubmitChangeRequest(requestPayload);
    }

    setReqProposedJamat('');
    setReqNote('');
    setClockPhotoDataUrl('');
    setCapturedTimestamp('');
    setIsRequestingChange(false);
  };

  return (
    <div className="card rounded-[22px] p-4 space-y-3 border border-[#D5D2BE]">
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
            Congregation Schedule
          </span>
          <h3 className="font-serif text-[17.5px] font-semibold text-primary">
            🕌 Azan &amp; Jamaat Timetable
          </h3>
        </div>

        {/* Admin: Direct Edit | Non-Admin: Request Change with Clock Photo */}
        {isAdmin && onUpdateJamatTimes ? (
          <button
            type="button"
            onClick={() => {
              setDraftTimings(masjid.timings || {});
              setIsEditing(!isEditing);
              setIsRequestingChange(false);
            }}
            className="px-3 py-1 rounded-full bg-[#0D4A2E] text-[#F0D58C] border border-[#C99E4C] text-[11px] font-bold shrink-0"
          >
            {isEditing ? 'Cancel' : '✏️ Update Times'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsRequestingChange(!isRequestingChange);
              setIsEditing(false);
            }}
            className="px-3 py-1 rounded-full bg-[#EAE8D7] border border-[#D5D2BE] text-primary text-[11px] font-bold shrink-0"
          >
            {isRequestingChange ? 'Cancel' : '📷 Request Change'}
          </button>
        )}
      </div>

      {/* ADMIN DIRECT EDIT FORM */}
      {isAdmin && isEditing ? (
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
            Save Jamaat Timetable (Admin)
          </button>
        </form>
      ) : isRequestingChange ? (
        /* NON-ADMIN TIME CHANGE REQUEST WITH DIGITAL CLOCK PHOTO */
        <form
          onSubmit={handleSendChangeRequest}
          className="rounded-2xl bg-[#EAE8D7] p-3.5 border border-[#0D4A2E]/30 space-y-3 fade-in"
        >
          <div>
            <span className="badge-pill">Member Verification Request</span>
            <p className="text-[11.5px] text-secondary mt-1">
              Only admins can update Jamaat times. Capture a photo of the Masjid&apos;s digital clock showing the updated time along with the current date &amp; time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                Prayer
              </label>
              <select
                value={reqPrayerKey}
                onChange={(e) => setReqPrayerKey(e.target.value)}
                className="w-full bg-[#F5F2E8] text-primary text-[12px] font-semibold py-2 px-2.5 rounded-xl border border-[#D5D2BE]"
              >
                {PRAYER_META.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
                New Jamaat Time
              </label>
              <input
                type="text"
                required
                value={reqProposedJamat}
                onChange={(e) => setReqProposedJamat(e.target.value)}
                placeholder="e.g. 05:50 AM"
                className="w-full bg-[#F5F2E8] text-primary text-[12px] font-semibold py-2 px-2.5 rounded-xl border border-[#D5D2BE]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
              Capture Digital Clock Photo (Required)
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              required
              onChange={handlePhotoCapture}
              className="w-full text-[11.5px] text-primary bg-[#F5F2E8] p-2 rounded-xl border border-[#D5D2BE]"
            />

            {clockPhotoDataUrl && (
              <div className="mt-2 rounded-xl overflow-hidden border border-[#C99E4C] bg-[#0F4C2B] p-2 space-y-1">
                <img
                  src={clockPhotoDataUrl}
                  alt="Captured Masjid digital clock"
                  className="w-full h-36 object-cover rounded-lg"
                />
                <div className="text-[10.5px] font-bold text-[#F0D58C] text-center">
                  🕒 Verified Capture: {capturedTimestamp}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-secondary mb-1">
              Optional Note for Admin
            </label>
            <input
              type="text"
              value={reqNote}
              onChange={(e) => setReqNote(e.target.value)}
              placeholder="e.g., Changed starting this Friday"
              className="w-full bg-[#F5F2E8] text-primary text-[12px] py-2 px-2.5 rounded-xl border border-[#D5D2BE]"
            />
          </div>

          <button
            type="submit"
            disabled={!reqProposedJamat.trim() || !clockPhotoDataUrl}
            className={`w-full py-2.5 rounded-full text-[12.5px] font-semibold transition ${
              reqProposedJamat.trim() && clockPhotoDataUrl
                ? 'btn-primary shadow-md'
                : 'bg-[#D5D2BE] text-secondary cursor-not-allowed'
            }`}
          >
            Submit Change Request to Admin ›
          </button>
        </form>
      ) : (
        /* STANDARD TIMETABLE DISPLAY */
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