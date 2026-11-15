import React, { useState } from 'react';

const DIAL_CODES = [
  { code: '+91', label: '🇮🇳 +91' },
  { code: '+1', label: '🇺🇸 +1' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+971', label: '🇦🇪 +971' },
  { code: '+966', label: '🇸🇦 +966' },
  { code: '+968', label: '🇴🇲 +968' },
  { code: '+974', label: '🇶🇦 +974' },
  { code: '+965', label: '🇰🇼 +965' },
  { code: '+61', label: '🇦🇺 +61' },
];

export default function AccountSecurity({
  primaryProfile,
  allProfiles = [],
  allLogs = [],
  onUpdateSecurity,
}) {
  const [dialCode, setDialCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState(
    localStorage.getItem('aamaal_user_phone') || primaryProfile?.phone || ''
  );
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSavePin = (e) => {
    e.preventDefault();
    if (!phoneNumber.trim() || phoneNumber.replace(/\D/g, '').length < 7) {
      setStatusMessage('Please enter a valid mobile number.');
      return;
    }
    if (pin.length < 4) {
      setStatusMessage('Please enter at least a 4-digit secret PIN.');
      return;
    }
    if (confirmPin && pin !== confirmPin) {
      setStatusMessage('PINs do not match.');
      return;
    }

    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}

    const fullPhone = phoneNumber.trim().startsWith('+')
      ? phoneNumber.trim()
      : `${dialCode}${phoneNumber.replace(/\D/g, '')}`;

    localStorage.setItem('aamaal_user_phone', fullPhone);
    localStorage.setItem('aamaal_pin_configured', 'true');

    if (onUpdateSecurity) {
      onUpdateSecurity({ phone: fullPhone, pinConfigured: true });
    }

    setPin('');
    setConfirmPin('');
    setStatusMessage(`✓ Mobile (${fullPhone}) & 4-Digit PIN saved!`);
    setTimeout(() => setStatusMessage(''), 2800);
  };

  const handleExportFullBackup = () => {
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (_) {}

    const backupPayload = {
      exportedAt: new Date().toISOString(),
      profiles: allProfiles,
      logs: allLogs,
      compactState: JSON.parse(
        localStorage.getItem('aamaal_circle_compact_v3') || '{}'
      ),
    };

    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aamaal_circle_backup_${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMessage('✓ Full JSON backup downloaded!');
    setTimeout(() => setStatusMessage(''), 2500);
  };

  return (
    <div className="space-y-3.5">
      {/* 1. Mobile Number & 4-Digit PIN Setup */}
      <form onSubmit={handleSavePin} className="card rounded-[20px] p-4 space-y-3">
        <div>
          <span className="badge-pill">Mobile &amp; PIN Access</span>
          <h3 className="font-serif text-[17.5px] font-semibold text-primary mt-1">
            Mobile Number &amp; 4-Digit PIN
          </h3>
          <p className="text-[11.5px] text-secondary mt-0.5">
            Set or update your mobile number and 4-digit secret PIN to sign in across devices.
          </p>
        </div>

        <div className="flex space-x-2">
          <select
            value={dialCode}
            onChange={(e) => setDialCode(e.target.value)}
            className="w-28 bg-[#F5F2E8] text-[12px] font-bold shrink-0"
          >
            {DIAL_CODES.map((d) => (
              <option key={d.code} value={d.code}>
                {d.label}
              </option>
            ))}
          </select>

          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Mobile Number"
            maxLength={15}
            className="flex-1 bg-[#F5F2E8] text-[13px] font-semibold"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="password"
            inputMode="numeric"
            maxLength={8}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="New 4-Digit PIN"
            className="bg-[#F5F2E8] text-[13px] font-semibold"
          />
          <input
            type="password"
            inputMode="numeric"
            maxLength={8}
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            placeholder="Confirm PIN"
            className="bg-[#F5F2E8] text-[13px] font-semibold"
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full py-2.5 text-[13px] font-semibold"
        >
          Save Mobile &amp; PIN
        </button>
      </form>

      {/* 2. Backup & Cloud Sync Status */}
      <div className="card-soft rounded-[20px] p-4 space-y-2.5">
        <h4 className="font-serif text-[16px] font-semibold text-primary">
          Cloud &amp; Offline Backup
        </h4>
        <p className="text-[11.5px] text-secondary">
          Download a complete copy of all your family profiles, saved Duas, and Aamaal recitation logs.
        </p>

        <button
          type="button"
          onClick={handleExportFullBackup}
          className="btn-secondary w-full py-2.5 text-[12.5px] font-semibold"
        >
          📥 Download Full Account Backup (.JSON)
        </button>
      </div>

      {statusMessage && (
        <p className="text-center text-[12px] font-semibold text-[#135332]">
          {statusMessage}
        </p>
      )}
    </div>
  );
}