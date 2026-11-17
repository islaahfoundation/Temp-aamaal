//Controls Circle Leaderboard Privacy (Show Real Name vs Hide Name as "Circle Member" for Ikhlas/sincerity), Local Data Backup Export (JSON), and Reset All App Data.

import React from 'react';

export default function PrivacySecurity({
  settings = {
    leaderboardPrivacy: 'public',
  },
  onUpdateSettings,
  onResetAllData,
  onShowToast,
  onBack,
}) {
  const handlePrivacyChange = (mode) => {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
      // Sync primary profile privacy in aamaal_circle_profiles_v1
      const raw = localStorage.getItem('aamaal_circle_profiles_v1');
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const updated = list.map((p) =>
            p.isPrimary ? { ...p, privacy: mode } : p
          );
          localStorage.setItem(
            'aamaal_circle_profiles_v1',
            JSON.stringify(updated)
          );
        }
      }
    } catch (_) {}

    if (onUpdateSettings) {
      onUpdateSettings({
        ...settings,
        leaderboardPrivacy: mode,
      });
    }
    if (onShowToast) {
      onShowToast(
        mode === 'private'
          ? '🔒 Your name is now hidden as "Circle Member" on leaderboards'
          : '🌍 Your name is now visible on Circle leaderboards'
      );
    }
  };

  const handleExportLocalBackup = () => {
    try {
      const backupObj = {
        exportedAt: new Date().toISOString(),
        profiles: JSON.parse(
          localStorage.getItem('aamaal_circle_profiles_v1') || '[]'
        ),
        logs: JSON.parse(
          localStorage.getItem('aamaal_circle_logs_v1') || '[]'
        ),
        settings,
      };
      const blob = new Blob([JSON.stringify(backupObj, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aamaal_circle_backup_${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      if (onShowToast) onShowToast('📥 Downloaded JSON backup file');
    } catch (_) {}
  };

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
        <span className="badge-pill">Sincerity (Ikhlas) &amp; Data</span>
        <h3 className="font-serif text-[21px] font-semibold text-primary mt-1">
          🔒 Privacy &amp; Data Security
        </h3>
        <p className="text-[12px] text-secondary mt-0.5">
          Control how your name appears on the Weekly/Monthly Circle Leaderboard and manage your stored data.
        </p>
      </div>

      {/* Leaderboard Privacy Mode */}
      <div className="card rounded-[20px] p-4 space-y-3">
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-gold block">
          Leaderboard Visibility
        </span>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handlePrivacyChange('public')}
            className={`p-3 rounded-2xl text-left border transition ${
              (settings.leaderboardPrivacy || 'public') === 'public'
                ? 'bg-[#0D4A2E] text-white border-[#C99E4C]'
                : 'bg-[#F5F2E8] text-primary border-[#DCD8C6]'
            }`}
          >
            <div className="text-[13px] font-bold">🌍 Public Name</div>
            <p className="text-[10.5px] opacity-85 mt-0.5">
              Inspire others by showing your name &amp; flag
            </p>
          </button>

          <button
            type="button"
            onClick={() => handlePrivacyChange('private')}
            className={`p-3 rounded-2xl text-left border transition ${
              settings.leaderboardPrivacy === 'private'
                ? 'bg-[#0D4A2E] text-white border-[#C99E4C]'
                : 'bg-[#F5F2E8] text-primary border-[#DCD8C6]'
            }`}
          >
            <div className="text-[13px] font-bold">🔒 Anonymous</div>
            <p className="text-[10.5px] opacity-85 mt-0.5">
              Count towards total as &ldquo;Circle Member&rdquo;
            </p>
          </button>
        </div>
      </div>

      {/* Backup & Reset */}
      <div className="card rounded-[20px] p-4 space-y-2.5">
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-secondary block">
          Device Storage &amp; Backup
        </span>

        <button
          type="button"
          onClick={handleExportLocalBackup}
          className="btn-secondary w-full py-2.5 text-[12.5px] font-semibold"
        >
          📥 Download Full Data Backup (.JSON)
        </button>

        {onResetAllData && (
          <button
            type="button"
            onClick={onResetAllData}
            className="btn-danger w-full py-2.5 text-[12.5px] font-semibold"
          >
            🗑️ Reset All Local App Data
          </button>
        )}
      </div>
    </div>
  );
}