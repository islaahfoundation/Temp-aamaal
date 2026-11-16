//Manages browser push notification permissions (Notification.requestPermission()), test notification trigger, gentle sound/vibration toggles, and Quiet Hours.

import React, { useState } from 'react';

export default function ReminderPreferences({
  preferences = {
    globalEnabled: true,
    vibrateOnAlert: true,
    thursdaySalawatBoost: true,
    quietHoursStart: '23:00',
    quietHoursEnd: '04:45',
  },
  onUpdatePreferences,
  onSendTestNotification,
}) {
  const [permissionState, setPermissionState] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const handleRequestBrowserPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    try {
      const res = await Notification.requestPermission();
      setPermissionState(res);
      if (res === 'granted' && onSendTestNotification) {
        onSendTestNotification();
      }
    } catch (_) {}
  };

  const togglePref = (key) => {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (_) {}
    if (onUpdatePreferences) {
      onUpdatePreferences({
        ...preferences,
        [key]: !preferences[key],
      });
    }
  };

  return (
    <div className="card rounded-[20px] p-4 space-y-3.5 bg-[#EAE8D7] border border-[#0D4A2E]/25">
      <div className="flex items-center justify-between">
        <div>
          <span className="badge-pill">Alert Settings</span>
          <h3 className="font-serif text-[17.5px] font-semibold text-primary mt-1">
            ⚙️ Notification Preferences
          </h3>
        </div>

        <button
          type="button"
          onClick={onSendTestNotification}
          className="px-3 py-1.5 rounded-full bg-[#0D4A2E] text-[#F0D58C] text-[11px] font-bold shadow-sm"
        >
          🔔 Send Test Alert
        </button>
      </div>

      {/* Browser Permission Status Banner */}
      <div className="rounded-xl bg-[#F5F2E8] p-3 border border-[#DCD8C6] flex items-center justify-between gap-2">
        <div>
          <h4 className="text-[12.5px] font-bold text-primary">
            Device Push Permission
          </h4>
          <p className="text-[11px] text-secondary">
            Status:{' '}
            <strong className="capitalize text-[#135332]">
              {permissionState === 'granted'
                ? 'Allowed ✓'
                : permissionState === 'denied'
                ? 'Blocked in Browser'
                : 'Not Enabled Yet'}
            </strong>
          </p>
        </div>

        {permissionState !== 'granted' && (
          <button
            type="button"
            onClick={handleRequestBrowserPermission}
            className="px-3 py-1.5 rounded-xl bg-[#DCE3C8] text-[#0D4A2E] text-[11px] font-bold shrink-0"
          >
            Allow Alerts
          </button>
        )}
      </div>

      {/* Toggles */}
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-xl bg-[#F5F2E8] px-3 py-2.5 border border-[#DCD8C6]">
          <div>
            <h4 className="text-[12.5px] font-semibold text-primary">
              Master Daily Reminders
            </h4>
            <p className="text-[10.5px] text-secondary">
              Enable all scheduled Aamaal &amp; Sunnah alerts
            </p>
          </div>
          <button
            type="button"
            onClick={() => togglePref('globalEnabled')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
              preferences.globalEnabled
                ? 'bg-[#0D4A2E] text-white'
                : 'bg-[#E5DEC9] text-[#6B2D26]'
            }`}
          >
            {preferences.globalEnabled ? 'Active ✓' : 'Paused'}
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#F5F2E8] px-3 py-2.5 border border-[#DCD8C6]">
          <div>
            <h4 className="text-[12.5px] font-semibold text-primary">
              Thursday &amp; Friday Salawat Boost
            </h4>
            <p className="text-[10.5px] text-secondary">
              Extra Durood Shareef reminder on Thursday evening
            </p>
          </div>
          <button
            type="button"
            onClick={() => togglePref('thursdaySalawatBoost')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
              preferences.thursdaySalawatBoost
                ? 'bg-[#0D4A2E] text-white'
                : 'bg-[#EAE8D7] text-secondary'
            }`}
          >
            {preferences.thursdaySalawatBoost ? 'On ✓' : 'Off'}
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#F5F2E8] px-3 py-2.5 border border-[#DCD8C6]">
          <div>
            <h4 className="text-[12.5px] font-semibold text-primary">
              Gentle Haptic Vibration
            </h4>
            <p className="text-[10.5px] text-secondary">
              Soft vibration pulse when reminders trigger
            </p>
          </div>
          <button
            type="button"
            onClick={() => togglePref('vibrateOnAlert')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
              preferences.vibrateOnAlert
                ? 'bg-[#0D4A2E] text-white'
                : 'bg-[#EAE8D7] text-secondary'
            }`}
          >
            {preferences.vibrateOnAlert ? 'On ✓' : 'Off'}
          </button>
        </div>
      </div>
    </div>
  );
}