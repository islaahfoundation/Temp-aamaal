//The master controller for src/pages/notifications/ that unites all 7 components (CreateReminder, EditReminder, NotificationCenter, NotificationDetails, ReminderHistory, and ReminderPreferences) with persistent localStorage state.

import React, { useState, useEffect, useRef } from 'react';
import CreateReminder from './CreateReminder';
import EditReminder from './EditReminder';
import NotificationCenter from './NotificationCenter';
import NotificationDetails from './NotificationDetails';
import ReminderHistory from './ReminderHistory';
import ReminderPreferences from './ReminderPreferences';

const REMINDERS_STORAGE_KEY = 'aamaal_reminders_list_v1';
const BROADCASTS_STORAGE_KEY = 'aamaal_broadcast_alerts_v1';
const REMINDER_LOGS_KEY = 'aamaal_reminder_logs_v1';
const REMINDER_PREFS_KEY = 'aamaal_reminder_prefs_v1';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DEFAULT_REMINDERS = [
  {
    id: 'rem_morning_durood',
    title: '313 Durood Shareef Circle',
    category: 'Daily Aamaal',
    time: '07:30',
    times: ['07:30', '13:30', '20:30'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    icon: '📿',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    translation:
      'O Allah, send peace and blessings upon Muhammad ﷺ and the family of Muhammad ﷺ.',
    romanUrdu:
      'Aye Allah! Muhammad ﷺ aur Aap ﷺ ki Aal par rehmat aur barakat naazil farma.',
    urdu: 'اے اللہ! محمد ﷺ اور آلِ محمد ﷺ پر رحمت و برکت نازل فرما۔',
    hindi: 'ऐ अल्लाह! मुहम्मद ﷺ और आप ﷺ की आल पर रहमत व बरकत नाज़िल फ़रमा।',
    enabled: true,
    read: false,
  },
  {
    id: 'rem_night_mulk',
    title: 'Recite Surah Al-Mulk Before Sleep',
    category: 'Night Protection',
    time: '21:45',
    times: ['21:45'],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    icon: '🌙',
    arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    translation:
      'Blessed is He in whose hand is dominion, and He is over all things competent. (Surah Al-Mulk 67:1)',
    romanUrdu:
      'Badi barakat wala hai Woh zaat jiske haath mein saari badshahi hai aur Woh har cheez par qaadir hai.',
    urdu: 'بڑی برکت والا ہے وہ ذات جس کے ہاتھ میں ساری بادشاہی ہے اور وہ ہر چیز پر قادر ہے۔',
    hindi:
      'बड़ी बरकत वाला है वह ज़ात जिसके हाथ में सारी बादशाही है और वह हर चीज़ पर क़ादिर है।',
    enabled: true,
    read: false,
  },
  {
    id: 'rem_thursday_salawat',
    title: '6 Salawat Recited Every Thursday Night',
    category: 'Weekly Sunnah',
    time: '18:30',
    times: ['18:30'],
    days: ['Thu', 'Fri'],
    icon: '✨',
    arabic: 'إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ',
    translation:
      'Indeed, Allah and His angels send blessings upon the Prophet ﷺ. O you who believe, send blessings and abundant peace upon him.',
    romanUrdu:
      'Beshak Allah aur Uske farishte Nabi ﷺ par Durood bhejte hain. Aye Iman walo! Aap ﷺ par kasrat se Durood aur Salaam bhejo.',
    urdu: 'بے شک اللہ اور اس کے فرشتے نبی ﷺ پر درود بھیجتے ہیں۔',
    hindi: 'बेशक अल्लाह और उसके फ़रिश्ते नबी ﷺ पर दुरूद भेजते हैं।',
    enabled: true,
    read: false,
  },
];

// Helper to fire a real PWA Notification (Service Worker first, fallback to Window Notification)
async function firePwaNotification(title, body) {
  try {
    if (navigator.vibrate) navigator.vibrate([150, 80, 150]);
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

export default function ReminderDashboard({
  state,
  updateState,
  onShowToast,
  onBack,
}) {
  const [activeTab, setActiveTab] = useState('schedules'); // 'schedules' | 'inbox' | 'history' | 'prefs'
  const [showCreate, setShowCreate] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifPermission, setNotifPermission] = useState(() =>
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'unsupported'
  );

  const lastTriggeredRef = useRef(new Set());

  const [reminders, setReminders] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(REMINDERS_STORAGE_KEY) || 'null'
      );
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch (_) {}
    return DEFAULT_REMINDERS;
  });

  // Load Admin Broadcasts so they appear in Alert Inbox for ALL profiles
  const [broadcasts, setBroadcasts] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(BROADCASTS_STORAGE_KEY) || '[]'
      );
      return Array.isArray(saved) ? saved : [];
    } catch (_) {
      return [];
    }
  });

  const [historyLogs, setHistoryLogs] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(REMINDER_LOGS_KEY) || 'null'
      );
      if (Array.isArray(saved)) return saved;
    } catch (_) {}
    return [];
  });

  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(REMINDER_PREFS_KEY) || 'null'
      );
      if (saved) return saved;
    } catch (_) {}
    return {
      globalEnabled: true,
      vibrateOnAlert: true,
      thursdaySalawatBoost: true,
      quietHoursStart: '23:00',
      quietHoursEnd: '04:45',
    };
  });

  // Refresh broadcasts whenever switching to Alert Inbox tab
  useEffect(() => {
    if (activeTab === 'inbox') {
      try {
        const saved = JSON.parse(
          localStorage.getItem(BROADCASTS_STORAGE_KEY) || '[]'
        );
        if (Array.isArray(saved)) setBroadcasts(saved);
      } catch (_) {}
    }
  }, [activeTab]);

  // Persist reminders
  useEffect(() => {
    try {
      localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
    } catch (_) {}
    if (updateState) {
      const activeCount = reminders.filter((r) => r.enabled).length;
      updateState({ remindersCount: preferences.globalEnabled ? activeCount : 0 });
    }
  }, [reminders, preferences.globalEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(REMINDER_LOGS_KEY, JSON.stringify(historyLogs));
    } catch (_) {}
  }, [historyLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(REMINDER_PREFS_KEY, JSON.stringify(preferences));
    } catch (_) {}
  }, [preferences]);

  // 7b: Live PWA Alarm Engine (Checks every 30 seconds for matching day + HH:MM)
  useEffect(() => {
    if (!preferences.globalEnabled) return undefined;

    const checkAlarms = () => {
      const now = new Date();
      const todayDay = DAY_NAMES[now.getDay()];
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const currentHHMM = `${hh}:${mm}`;

      reminders.forEach((rem) => {
        if (!rem.enabled) return;
        const scheduledDays = rem.days || DAY_NAMES;
        if (!scheduledDays.includes(todayDay)) return;

        const scheduledTimes =
          Array.isArray(rem.times) && rem.times.length > 0
            ? rem.times
            : [rem.time];

        if (scheduledTimes.includes(currentHHMM)) {
          const triggerKey = `${rem.id}_${todayDay}_${currentHHMM}`;
          if (!lastTriggeredRef.current.has(triggerKey)) {
            lastTriggeredRef.current.add(triggerKey);
            firePwaNotification(
              `Aamaal Circle • ${rem.title}`,
              rem.translation || 'Time for your scheduled remembrance.'
            );
            if (onShowToast) onShowToast(`🔔 Alarm: ${rem.title}`);
          }
        }
      });
    };

    checkAlarms();
    const interval = setInterval(checkAlarms, 30000);
    return () => clearInterval(interval);
  }, [reminders, preferences.globalEnabled, onShowToast]);

  const handleRequestPwaPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      if (onShowToast) onShowToast('Notifications are not supported in this browser');
      return;
    }
    try {
      const result = await Notification.requestPermission();
      setNotifPermission(result);
      if (result === 'granted') {
        if (onShowToast) onShowToast('✓ PWA Alarms & Notifications enabled!');
        firePwaNotification(
          'Aamaal Circle Alarms Active',
          'Your scheduled Sunnah reminders will now alert you on time.'
        );
      } else if (onShowToast) {
        onShowToast('Please allow notifications in browser/PWA settings');
      }
    } catch (_) {}
  };

  const handleToggleEnable = (id) => {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (_) {}
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleCreateReminder = (newRem) => {
    setReminders((prev) => [newRem, ...prev]);
    setShowCreate(false);
    if (onShowToast) onShowToast(`Added "${newRem.title}"`);
  };

  const handleUpdateReminder = (id, updates) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
    setEditingReminder(null);
    if (onShowToast) onShowToast('Reminder schedule updated');
  };

  const handleDeleteReminder = (id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    setEditingReminder(null);
    setSelectedNotification(null);
    if (onShowToast) onShowToast('Reminder deleted');
  };

  const handleLogReminderAction = (item, status = 'completed') => {
    const newLog = {
      id: `rlog_${Date.now()}`,
      reminderId: item.id,
      title: item.title,
      status,
      timestamp: new Date().toISOString(),
    };
    setHistoryLogs((prev) => [newLog, ...prev]);
    setReminders((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, read: true } : r))
    );
    setBroadcasts((prev) => {
      const updated = prev.map((b) =>
        b.id === item.id ? { ...b, read: true } : b
      );
      try {
        localStorage.setItem(BROADCASTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    setSelectedNotification(null);

    if (onShowToast) {
      onShowToast(
        status === 'completed'
          ? `MashaAllah! Completed "${item.title}"`
          : `Snoozed "${item.title}" for 15 minutes`
      );
    }
  };

  const handleTriggerTestNotification = () => {
    firePwaNotification(
      'Aamaal Circle • Gentle Reminder',
      'Time for your daily 313 Durood Shareef & remembrance of Allah.'
    );
    if (onShowToast) {
      onShowToast('🔔 Test Sunnah Reminder triggered!');
    }
  };

  // Combined Alert Inbox (Admin Broadcasts on top + Scheduled Reminders)
  const combinedInbox = [...broadcasts, ...reminders];
  const unreadInboxCount = combinedInbox.filter((n) => !n.read).length;

  if (selectedNotification) {
    return (
      <section className="screen-section no-scrollbar px-5 pt-4 pb-6">
        <NotificationDetails
          notification={selectedNotification}
          onMarkCompleted={(item) => handleLogReminderAction(item, 'completed')}
          onSnooze={(item) => handleLogReminderAction(item, 'snoozed')}
          onEdit={(item) => {
            setSelectedNotification(null);
            setEditingReminder(item);
          }}
          onBack={() => setSelectedNotification(null)}
        />
      </section>
    );
  }

  return (
    <section className="screen-section no-scrollbar px-5 pt-4 pb-6 space-y-3.5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary px-3 py-1 text-[11.5px]"
            >
              ‹ Back
            </button>
          )}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
              Daily &amp; Thursday Alerts
            </span>
            <h2 className="font-serif text-[23px] font-semibold text-primary leading-tight">
              Reminders &amp; Alerts
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowCreate(!showCreate);
            setEditingReminder(null);
          }}
          className="px-3.5 py-1.5 rounded-full bg-[#0D4A2E] text-white text-[11.5px] font-semibold shadow-sm"
        >
          {showCreate ? 'Close' : '+ New Reminder'}
        </button>
      </div>

      {/* PWA Notification Permission Banner */}
      {notifPermission !== 'granted' && notifPermission !== 'unsupported' && (
        <div className="rounded-[18px] bg-[#0F4C2B] text-white px-4 py-3 flex items-center justify-between gap-2 border border-[#C99E4C]/50">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F0D58C] block">
              PWA Alarm Permission
            </span>
            <p className="text-[11.5px] text-white/90">
              Enable notifications so your daily alarms ring on this device.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRequestPwaPermission}
            className="px-3 py-1.5 rounded-full bg-[#DFB75A] text-[#07361D] text-[11px] font-bold shrink-0"
          >
            Enable
          </button>
        </div>
      )}

      {/* Sub-Navigation Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'schedules', label: `⏰ Schedules (${reminders.length})` },
          {
            id: 'inbox',
            label: `🔔 Alert Inbox${unreadInboxCount > 0 ? ` (${unreadInboxCount})` : ''}`,
          },
          { id: 'history', label: `⏱ History (${historyLogs.length})` },
          { id: 'prefs', label: '⚙️ Preferences' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-[11.5px] font-semibold whitespace-nowrap border transition ${
              activeTab === tab.id
                ? 'bg-[#0D4A2E] text-white border-[#C99E4C]/50 shadow-sm'
                : 'bg-[#EAE8D7] text-primary border-[#D5D2BE]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {showCreate && (
        <CreateReminder
          onSaveReminder={handleCreateReminder}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {editingReminder && (
        <EditReminder
          reminder={editingReminder}
          onUpdateReminder={handleUpdateReminder}
          onDeleteReminder={handleDeleteReminder}
          onCancel={() => setEditingReminder(null)}
        />
      )}

      {/* TAB 1: SCHEDULED REMINDERS LIST */}
      {activeTab === 'schedules' && (
        <div className="space-y-2.5">
          {reminders.map((rem) => {
            const timesList =
              Array.isArray(rem.times) && rem.times.length > 0
                ? rem.times
                : [rem.time];

            return (
              <div
                key={rem.id}
                onClick={() => setSelectedNotification(rem)}
                className="card rounded-[20px] p-4 cursor-pointer active:scale-[0.99] transition space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="badge-pill">{rem.category}</span>
                    <h3 className="font-serif text-[17px] font-semibold text-primary mt-1 truncate">
                      {rem.title}
                    </h3>
                    <p className="text-[11.5px] text-secondary mt-0.5">
                      ⏰{' '}
                      <strong className="text-primary">
                        {timesList.join(' • ')}
                      </strong>{' '}
                      ({timesList.length}x/day)
                    </p>
                    <p className="text-[10.5px] text-secondary mt-0.5">
                      {(rem.days || []).join(', ')}
                    </p>
                  </div>

                  <div
                    className="flex items-center space-x-1.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setEditingReminder(rem)}
                      className="px-2.5 py-1 rounded-lg bg-[#EAE8D7] text-primary text-[11px] font-bold border border-[#D5D2BE]"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleEnable(rem.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
                        rem.enabled
                          ? 'bg-[#0D4A2E] text-[#F0D58C]'
                          : 'bg-[#E5DEC9] text-secondary'
                      }`}
                    >
                      {rem.enabled ? 'On ✓' : 'Off'}
                    </button>
                  </div>
                </div>

                {rem.arabic && (
                  <div className="rounded-xl bg-[#0F4C2B] px-3 py-2 text-right border border-[#C99E4C]/40">
                    <p
                      dir="rtl"
                      className="font-arabic text-[19px] text-[#F0D58C] line-clamp-1"
                    >
                      {rem.arabic}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: ALERT INBOX (Admin Broadcasts + Reminders) */}
      {activeTab === 'inbox' && (
        <NotificationCenter
          notifications={combinedInbox}
          onSelectNotification={(item) => setSelectedNotification(item)}
          onMarkAllRead={() => {
            setReminders((prev) => prev.map((r) => ({ ...r, read: true })));
            setBroadcasts((prev) => {
              const updated = prev.map((b) => ({ ...b, read: true }));
              try {
                localStorage.setItem(
                  BROADCASTS_STORAGE_KEY,
                  JSON.stringify(updated)
                );
              } catch (_) {}
              return updated;
            });
            if (onShowToast) onShowToast('All alerts marked as read');
          }}
        />
      )}

      {/* TAB 3: REMINDER HISTORY */}
      {activeTab === 'history' && (
        <ReminderHistory
          historyLogs={historyLogs}
          onClearHistory={() => {
            setHistoryLogs([]);
            if (onShowToast) onShowToast('Reminder history cleared');
          }}
        />
      )}

      {/* TAB 4: PREFERENCES */}
      {activeTab === 'prefs' && (
        <ReminderPreferences
          preferences={preferences}
          onUpdatePreferences={setPreferences}
          onSendTestNotification={handleTriggerTestNotification}
        />
      )}
    </section>
  );
}