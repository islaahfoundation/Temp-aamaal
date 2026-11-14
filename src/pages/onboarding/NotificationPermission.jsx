import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotificationPermission() {
  const navigate = useNavigate();
  const [notifStatus, setNotifStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [hapticsEnabled, setHapticsEnabled] = useState(
    localStorage.getItem('aamaal_haptics_enabled') !== 'false'
  );
  const [statusMessage, setStatusMessage] = useState('');

  const requestSystemNotifications = async () => {
    try {
      if (navigator.vibrate) navigator.vibrate(25);
    } catch (_) {}

    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotifStatus(perm);
        localStorage.setItem('aamaal_notifications_permission', perm);
        setStatusMessage(
          perm === 'granted'
            ? 'Alhamdulillah! Daily reminders enabled.'
            : `Notification status: ${perm}`
        );
      } catch (_) {
        setStatusMessage('Notification preference saved.');
      }
    } else {
      localStorage.setItem('aamaal_notifications_permission', 'granted');
      setNotifStatus('granted');
      setStatusMessage('Reminders saved for your device.');
    }
  };

  const testAndEnableHaptics = () => {
    const nextVal = !hapticsEnabled;
    setHapticsEnabled(nextVal);
    localStorage.setItem('aamaal_haptics_enabled', String(nextVal));
    if (nextVal) {
      try {
        if (navigator.vibrate) navigator.vibrate([35, 50, 45]);
      } catch (_) {}
      setStatusMessage('Tactile haptic pulse enabled!');
    } else {
      setStatusMessage('Tactile haptic pulse muted.');
    }
  };

  const handleFinishSteps = () => {
    try {
      if (hapticsEnabled && navigator.vibrate) navigator.vibrate([25, 40, 25]);
    } catch (_) {}
    localStorage.setItem('aamaal_haptics_enabled', String(hapticsEnabled));
    navigate('/onboarding/authentication');
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
          <span className="badge-pill">Step 5 of 5</span>
        </div>

        {/* Title & Description */}
        <div className="text-center mt-4">
          <h2 className="font-serif text-[25px] font-semibold text-primary">
            Alerts & Tactile Feel
          </h2>
          <p className="text-[12.5px] text-secondary mt-1 max-w-[305px] mx-auto">
            Enhance your digital tasbih with subtle vibrations during counts and allow gentle reminder notifications.
          </p>
        </div>

        {/* Haptic Wave Visual Card */}
        <div className="card-progress p-4 mt-4 text-center relative">
          <svg className="w-full h-24 mx-auto" viewBox="0 0 320 96">
            <ellipse
              cx="160"
              cy="48"
              rx="135"
              ry="40"
              fill="none"
              stroke="#C99E4C"
              strokeWidth="1.5"
              opacity={hapticsEnabled ? '0.5' : '0.15'}
            />
            <ellipse
              cx="160"
              cy="48"
              rx="95"
              ry="28"
              fill="none"
              stroke="#F0D58C"
              strokeWidth="2"
              opacity={hapticsEnabled ? '0.8' : '0.2'}
            />
            <circle
              cx="160"
              cy="48"
              r="24"
              fill="#07361D"
              stroke="#DFB75A"
              strokeWidth="2.5"
            />
            <circle
              cx="160"
              cy="48"
              r="14"
              fill="none"
              stroke="#F0D58C"
              strokeWidth="3"
              strokeDasharray="5 4"
            />
          </svg>

          <h3 className="font-serif text-[16.5px] font-semibold text-white mt-1">
            Tactile (Haptic) Feedback
          </h3>
          <p className="text-[11.5px] text-white/80 mt-0.5">
            Feel each bead tap without looking at the screen
          </p>

          <div className="mt-3 flex items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={testAndEnableHaptics}
              className="px-4 py-1.5 rounded-full bg-[#DFB75A] text-[#07361D] text-[12px] font-bold shadow-sm"
            >
              {hapticsEnabled ? '✓ Touch Effects Enabled (Tap to Test)' : 'Enable Touch Effects'}
            </button>
          </div>
        </div>

        {/* System Notification Permission Card */}
        <div className="card mt-3 flex items-center justify-between p-3.5">
          <div className="pr-3">
            <h4 className="font-serif text-[14.5px] font-semibold text-primary">
              Device Notification Access
            </h4>
            <p className="text-[11.5px] text-secondary mt-0.5">
              {notifStatus === 'granted'
                ? 'Permission granted for Durood & Surah Mulk alerts'
                : 'Allow browser/device alerts for your chosen times'}
            </p>
          </div>
          <button
            type="button"
            onClick={requestSystemNotifications}
            className={`px-3.5 py-1.5 rounded-full text-[11.5px] font-semibold shrink-0 ${
              notifStatus === 'granted'
                ? 'bg-[#DCE3C8] text-primary'
                : 'bg-[#0D4A2E] text-white'
            }`}
          >
            {notifStatus === 'granted' ? 'Granted ✓' : 'Allow Alerts'}
          </button>
        </div>

        {statusMessage && (
          <p className="text-center text-[11.5px] font-medium text-[#135332] mt-2">
            {statusMessage}
          </p>
        )}

        {/* 3 Feature Highlight Pillars */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="card-soft p-2.5 text-center">
            <h4 className="font-serif text-[12px] font-semibold text-primary">
              Realistic Taps
            </h4>
            <p className="text-[10px] text-secondary mt-0.5 leading-tight">
              Natural bead feel.
            </p>
          </div>
          <div className="card-soft p-2.5 text-center">
            <h4 className="font-serif text-[12px] font-semibold text-primary">
              Focus Aid
            </h4>
            <p className="text-[10px] text-secondary mt-0.5 leading-tight">
              Eyes-free Dhikr count.
            </p>
          </div>
          <div className="card-soft p-2.5 text-center">
            <h4 className="font-serif text-[12px] font-semibold text-primary">
              Custom Controls
            </h4>
            <p className="text-[10px] text-secondary mt-0.5 leading-tight">
              Toggle anytime in More.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="pt-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/onboarding/authentication')}
          className="text-[13px] font-medium text-muted px-2 py-2"
        >
          Skip
        </button>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
          <span className="w-2 h-2 rounded-full bg-[#C9CDAC]" />
          <span className="w-5 h-2 rounded-full bg-[#0D4A2E]" />
        </div>

        <button
          onClick={handleFinishSteps}
          className="btn-primary px-6 py-2.5 text-[13.5px]"
        >
          <span>Finish</span>
          <span>›</span>
        </button>
      </footer>
    </section>
  );
}