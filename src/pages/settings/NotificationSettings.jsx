//Embeds ReminderPreferences from src/pages/notifications/ReminderPreferences.jsx and provides a direct link to open the full ReminderDashboard.

import React from 'react';
import ReminderPreferences from '../notifications/ReminderPreferences';

export default function NotificationSettings({
  settings,
  onUpdateSettings,
  onOpenFullReminders,
  onShowToast,
  onBack,
}) {
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

      <ReminderPreferences
        preferences={{
          globalEnabled: settings?.globalRemindersEnabled !== false,
          vibrateOnAlert: settings?.hapticsEnabled !== false,
          thursdaySalawatBoost: settings?.thursdaySalawatBoost !== false,
        }}
        onUpdatePreferences={(nextPrefs) => {
          if (onUpdateSettings) {
            onUpdateSettings({
              ...settings,
              globalRemindersEnabled: nextPrefs.globalEnabled,
              hapticsEnabled: nextPrefs.vibrateOnAlert,
              thursdaySalawatBoost: nextPrefs.thursdaySalawatBoost,
            });
          }
        }}
        onSendTestNotification={() => {
          if (onShowToast) {
            onShowToast('🔔 Test Sunnah notification sent!');
          }
        }}
      />

      {onOpenFullReminders && (
        <button
          type="button"
          onClick={onOpenFullReminders}
          className="btn-primary w-full py-3 text-[13px] font-semibold shadow-sm"
        >
          🕰️ Manage Daily Reminder Times &amp; Schedules ›
        </button>
      )}
    </div>
  );
}