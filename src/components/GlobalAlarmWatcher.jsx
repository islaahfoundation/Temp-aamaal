//This runs globally in the background across the entire app, checks every 5 seconds, plays a gentle Web Audio chime, fires a PWA Notification, and shows a Ringing Alarm Popup on screen.

import React, { useState, useEffect, useRef } from 'react';
import { DEFAULT_AAMAAL_LIST } from '../pages/aamaal/AamaalCategories';
import { getLocalDateString } from '../pages/aamaal/DateSelector';

const REMINDERS_STORAGE_KEY = 'aamaal_reminders_list_v1';
const REMINDER_LOGS_KEY = 'aamaal_reminder_logs_v1';
const REMINDER_PREFS_KEY = 'aamaal_reminder_prefs_v1';
const AAMAAL_LOGS_KEY = 'aamaal_circle_logs_v1';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function playAlarmChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99]; // C5 - E5 - G5 gentle chime
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.22);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.22);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + i * 0.22 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.22 + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.22);
      osc.stop(ctx.currentTime + i * 0.22 + 0.65);
    });
  } catch (_) {}
}

async function fireSystemNotification(title, body) {
  try {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
  } catch (_) {}

  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, {
          body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [200, 100, 200],
          tag: `aamaal_alarm_${Date.now()}`,
        });
        return;
      }
    }
    new Notification(title, { body });
  } catch (_) {}
}

function isCompletedToday(rem) {
  const todayKey = getLocalDateString();

  // Check Reminder History
  try {
    const historyLogs = JSON.parse(localStorage.getItem(REMINDER_LOGS_KEY) || '[]');
    const doneInHistory = historyLogs.some((log) => {
      if (log.reminderId !== rem.id || log.status !== 'completed') return false;
      const d = new Date(log.timestamp);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}` === todayKey;
    });
    if (doneInHistory) return true;
  } catch (_) {}

  // Check Daily Aamaal Tracker
  if (rem.linkedAamaalId) {
    try {
      const aamaalLogs = JSON.parse(localStorage.getItem(AAMAAL_LOGS_KEY) || '[]');
      const meta = DEFAULT_AAMAAL_LIST.find((a) => a.id === rem.linkedAamaalId);
      const target = Number(meta?.target || 1);
      const todayLog = aamaalLogs.find(
        (l) => l.aamaalId === rem.linkedAamaalId && l.dateKey === todayKey
      );
      if (todayLog && Number(todayLog.count || 0) >= target) return true;
    } catch (_) {}
  }

  return false;
}

export default function GlobalAlarmWatcher({ onShowToast }) {
  const [ringingAlarm, setRingingAlarm] = useState(null);
  const triggeredRef = useRef(new Set());

  useEffect(() => {
    const checkAlarms = () => {
      try {
        const prefs = JSON.parse(localStorage.getItem(REMINDER_PREFS_KEY) || 'null');
        if (prefs && prefs.globalEnabled === false) return;

        const reminders = JSON.parse(
          localStorage.getItem(REMINDERS_STORAGE_KEY) || '[]'
        );
        if (!Array.isArray(reminders) || reminders.length === 0) return;

        const now = new Date();
        const todayDay = DAY_NAMES[now.getDay()];
        const todayDateKey = getLocalDateString();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const currentHHMM = `${hh}:${mm}`;

        for (const rem of reminders) {
          if (!rem.enabled) continue;
          if (isCompletedToday(rem)) continue;

          const days = Array.isArray(rem.days) && rem.days.length > 0 ? rem.days : DAY_NAMES;
          if (!days.includes(todayDay)) continue;

          const times =
            Array.isArray(rem.times) && rem.times.length > 0
              ? rem.times
              : [rem.time];

          if (times.includes(currentHHMM)) {
            const triggerKey = `${rem.id}_${todayDateKey}_${currentHHMM}`;
            if (!triggeredRef.current.has(triggerKey)) {
              triggeredRef.current.add(triggerKey);
              playAlarmChime();
              fireSystemNotification(
                `Aamaal Circle • ${rem.title}`,
                rem.translation || 'Time for your scheduled remembrance.'
              );
              setRingingAlarm(rem);
              break;
            }
          }
        }
      } catch (_) {}
    };

    checkAlarms();
    const interval = setInterval(checkAlarms, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!ringingAlarm) return null;

  const handleMarkCompleted = () => {
    try {
      const existing = JSON.parse(localStorage.getItem(REMINDER_LOGS_KEY) || '[]');
      const newLog = {
        id: `rlog_${Date.now()}`,
        reminderId: ringingAlarm.id,
        title: ringingAlarm.title,
        status: 'completed',
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(
        REMINDER_LOGS_KEY,
        JSON.stringify([newLog, ...(Array.isArray(existing) ? existing : [])])
      );
    } catch (_) {}

    if (onShowToast) {
      onShowToast(`MashaAllah! "${ringingAlarm.title}" completed — alarms paused for today`);
    }
    setRingingAlarm(null);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
      <div className="w-full max-w-sm rounded-[26px] bg-[#F5F2E8] border-2 border-[#C99E4C] shadow-2xl p-5 space-y-4 text-center">
        <div className="w-14 h-14 rounded-full bg-[#0D4A2E] text-[#F0D58C] flex items-center justify-center text-[26px] mx-auto shadow-md animate-bounce">
          🔔
        </div>

        <div>
          <span className="badge-pill">{ringingAlarm.category || 'Sunnah Alarm'}</span>
          <h3 className="font-serif text-[21px] font-bold text-[#0D4A2E] mt-1.5">
            {ringingAlarm.title}
          </h3>
        </div>

        {ringingAlarm.arabic && (
          <div className="rounded-2xl bg-[#0F4C2B] p-3.5 border border-[#C99E4C]/50">
            <p dir="rtl" className="font-arabic text-[22px] text-[#F0D58C] leading-relaxed">
              {ringingAlarm.arabic}
            </p>
          </div>
        )}

        {ringingAlarm.translation && (
          <p className="text-[12.5px] text-secondary leading-relaxed">
            {ringingAlarm.translation}
          </p>
        )}

        <div className="flex items-center space-x-2 pt-1">
          <button
            type="button"
            onClick={handleMarkCompleted}
            className="btn-primary flex-1 py-3 text-[13px] font-bold shadow-md"
          >
            ✓ Mark Done
          </button>
          <button
            type="button"
            onClick={() => setRingingAlarm(null)}
            className="btn-secondary px-4 py-3 text-[12.5px] font-semibold"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}