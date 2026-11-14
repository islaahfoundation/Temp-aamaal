import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'aamaal_circle_compact_v3';

export default function AccountRecovery() {
  const navigate = useNavigate();
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [backupJson, setBackupJson] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleCloudRestore = (e) => {
    e.preventDefault();
    try {
      if (navigator.vibrate) navigator.vibrate(20);
    } catch (_) {}
    if (!recoveryEmail.trim()) return;
    localStorage.setItem('aamaal_user_email', recoveryEmail.trim());
    localStorage.setItem('aamaal_onboarded', 'true');
    setFeedback(`Recovery link & cloud sync initiated for ${recoveryEmail.trim()}.`);
    setTimeout(() => navigate('/home', { replace: true }), 1100);
  };

  const handleJsonImport = () => {
    if (!backupJson.trim()) return;
    try {
      const parsed = JSON.parse(backupJson);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      localStorage.setItem('aamaal_onboarded', 'true');
      setFeedback('Alhamdulillah! Progress restored successfully.');
      setTimeout(() => navigate('/home', { replace: true }), 900);
    } catch (_) {
      setFeedback('Invalid backup format. Please paste valid Aamaal backup data.');
    }
  };

  return (
    <section className="screen-section no-scrollbar px-5 pt-6 pb-6 flex flex-col justify-between">
      <div>
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/onboarding/authentication')}
            className="btn-secondary px-3 py-1 text-[11.5px]"
          >
            ‹ Back
          </button>
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-gold">
            Account & Backup
          </span>
          <button
            onClick={() => navigate('/home')}
            className="text-[12px] font-medium text-muted"
          >
            Home ›
          </button>
        </div>

        {/* Title */}
        <div className="mt-4">
          <h2 className="font-serif text-[25px] font-semibold text-primary">
            Restore Your Journey
          </h2>
          <p className="text-[12.5px] text-secondary mt-1">
            Recover your saved Duas, Tasbih counts, and family profiles from cloud sync or a saved backup code.
          </p>
        </div>

        {/* 1. Email Cloud Recovery */}
        <form onSubmit={handleCloudRestore} className="card mt-4 space-y-2.5">
          <h3 className="font-serif text-[15.5px] font-semibold text-primary">
            Restore via Email
          </h3>
          <p className="text-[11.5px] text-secondary">
            Enter the email address linked to your Islaah Foundation Aamaal Circle profile:
          </p>
          <input
            type="email"
            required
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
            placeholder="Enter your email address..."
            className="bg-[#F5F2E8] text-[13px]"
          />
          <button type="submit" className="btn-primary w-full py-2.5 text-[13px]">
            Send Recovery &amp; Sync
          </button>
        </form>

        {/* 2. Local Backup Code / JSON Restore */}
        <div className="card-soft mt-3.5 space-y-2">
          <h3 className="font-serif text-[15px] font-semibold text-primary">
            Paste Backup Data (Offline Restore)
          </h3>
          <textarea
            rows={3}
            value={backupJson}
            onChange={(e) => setBackupJson(e.target.value)}
            placeholder='{"userName":"...","dhikrCount":313}'
            className="bg-[#F5F2E8] text-[12px]"
          />
          <button
            type="button"
            onClick={handleJsonImport}
            className="btn-secondary w-full py-2 text-[12.5px] font-semibold"
          >
            Import Backup Data
          </button>
        </div>

        {feedback && (
          <div className="mt-3 p-3 rounded-xl bg-[#DCE3C8] text-primary text-[12px] font-medium text-center">
            {feedback}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="pt-4 mt-4 shrink-0">
        <button
          type="button"
          onClick={() => {
            localStorage.setItem('aamaal_onboarded', 'true');
            navigate('/home', { replace: true });
          }}
          className="btn-secondary w-full py-3 text-[13px] font-semibold"
        >
          Continue Without Restoring ›
        </button>
      </footer>
    </section>
  );
}