//The master controller for src/pages/notifications/ that unites all 7 components (CreateReminder, EditReminder, NotificationCenter, NotificationDetails, ReminderHistory, and ReminderPreferences) with persistent localStorage state.

import React, { useState, useEffect } from 'react';
import CreateReminder from './CreateReminder';
import EditReminder from './EditReminder';
import NotificationCenter from './NotificationCenter';
import NotificationDetails from './NotificationDetails';
import ReminderHistory from './ReminderHistory';
import ReminderPreferences from './ReminderPreferences';

const REMINDERS_STORAGE_KEY = 'aamaal_reminders_list_v1';
const REMINDER_LOGS_KEY = 'aamaal_reminder_logs_v1';
const REMINDER_PREFS_KEY = 'aamaal_reminder_prefs_v1';

const DEFAULT_REMINDERS = [
  {
    id: 'rem_morning_durood',
    title: 'Morning 313 Durood Shareef',
    category: 'Daily Aamaal',
    time: '07:30',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    icon: '📿',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    translation:
      'O Allah, send peace and blessings upon Muhammad ﷺ and the family of Muhammad ﷺ.',
    romanUrdu:
      'Aye Allah! Muhammad ﷺ aur Aap ﷺ ki Aal par rehmat aur barakat naazil farma.',
    urdu: 'اے اللہ! محمد ﷺ اور آلِ محمد ﷺ پر رحمت بھیج۔',
    hindi: 'ऐ अल्लाह! मुहम्मद ﷺ और आप ﷺ की आल पर रहमत नाज़िल फ़रमा।',
    enabled: true,
    read: false,
  },
  {
    id: 'rem_night_mulk',
    title: 'Recite Surah Al-Mulk Before Sleep',
    category: 'Night Protection',
    time: '21:45',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    icon: '🌙',
    arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    translation:
      'Blessed is He in whose hand is dominion, and He is over all things competent. (Surah Al-Mulk 67:1)',
    romanUrdu:
      'Badi barakat wala hai Woh zaat jiske haath mein saari badshahi hai aur Woh har cheez par qaadir hai.',
    urdu: 'بڑی برکت والا ہے وہ جس کے ہاتھ میں بادشاہی ہے اور وہ ہر چیز پر قادر ہے۔',
    hindi: 'बड़ी बरकत वाला है वह जिसके हाथ में बादशाही है और वह हर चीज़ पर क़ादिर है।',
    enabled: true,
    read: false,
  },
  {
    id: 'rem_thursday_salawat',
    title: '6 Salawat Recited Every Thursday Night',
    category: 'Weekly Sunnah',
    time: '18:30',
    days: ['Thu', 'Fri'],
    icon: '🕌',
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

  const [reminders, setReminders] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(REMINDERS_STORAGE_KEY) || 'null'
      );
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch (_) {}
    return DEFAULT_REMINDERS;
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
    try {
      if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
      if (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        new Notification('Aamaal Circle • Gentle Reminder', {
          body: 'Time for your daily 313 Durood Shareef & remembrance of Allah.',
        });
      }
    } catch (_) {}
    if (onShowToast) {
      onShowToast('🔔 Test Sunnah Reminder triggered!');
    }
  };

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

      {/* Sub-Navigation Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: 'schedules', label: `🕰️ Schedules (${reminders.length})` },
          { id: 'inbox', label: '📬 Alert Inbox' },
          { id: 'history', label: `📜 History (${historyLogs.length})` },
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
          {reminders.map((rem) => (
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
                    🕰️ <strong className="text-primary">{rem.time}</strong> •{' '}
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
          ))}
        </div>
      )}

      {/* TAB 2: NOTIFICATION INBOX */}
      {activeTab === 'inbox' && (
        <NotificationCenter
          notifications={reminders}
          onSelectNotification={(item) => setSelectedNotification(item)}
          onMarkAllRead={() => {
            setReminders((prev) => prev.map((r) => ({ ...r, read: true })));
            if (onShowToast) onShowToast('All notifications marked as read');
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