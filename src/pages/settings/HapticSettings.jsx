//Configures tactile vibration feedback (navigator.vibrate) for Tasbih bead taps, 33/99/313 target completions, and button presses, complete with a live "Test Haptic Pulse" button.

import React from 'react';

export default function HapticSettings({
  settings = {
    hapticsEnabled: true,
    tasbihTapIntensity: 12,
    milestoneVibration: true,
  },
  onUpdateSettings,
  onShowToast,
  onBack,
}) {
  const updateField = (key, val) => {
    if (onUpdateSettings) {
      onUpdateSettings({
        ...settings,
        [key]: val,
      });
    }
  };

  const triggerTestPulse = (pattern) => {
    try {
      if (navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (_) {}
    if (onShowToast) {
      onShowToast('✨ Haptic vibration pulse tested');
    }
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
        <span className="badge-pill">Tactile Feedback</span>
        <h3 className="font-serif text-[21px] font-semibold text-primary mt-1">
          📳 Haptic &amp; Vibration Settings
        </h3>
        <p className="text-[12px] text-secondary mt-0.5">
          Feel a gentle tactile pulse on every Tasbih bead and completed Aamaal goal.
        </p>
      </div>

      <div className="card rounded-[20px] p-4 space-y-3.5">
        {/* Master Haptics Toggle */}
        <div className="flex items-center justify-between rounded-2xl bg-[#F5F2E8] p-3 border border-[#DCD8C6]">
          <div>
            <h4 className="font-serif text-[15px] font-semibold text-primary">
              Enable Tactile Haptics
            </h4>
            <p className="text-[11px] text-secondary mt-0.5">
              Vibrate softly when counting beads or logging daily Aamaal
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              updateField('hapticsEnabled', !settings.hapticsEnabled)
            }
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold ${
              settings.hapticsEnabled !== false
                ? 'bg-[#0D4A2E] text-[#F0D58C]'
                : 'bg-[#EAE8D7] text-secondary'
            }`}
          >
            {settings.hapticsEnabled !== false ? 'On ✓' : 'Off'}
          </button>
        </div>

        {/* Intensity Selector */}
        <div>
          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-secondary mb-1.5">
            Tasbih Bead Tap Intensity
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: 8, label: 'Soft (8ms)' },
              { val: 14, label: 'Medium (14ms)' },
              { val: 25, label: 'Firm (25ms)' },
            ].map((item) => {
              const active =
                (settings.tasbihTapIntensity || 14) === item.val;
              return (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => {
                    updateField('tasbihTapIntensity', item.val);
                    triggerTestPulse(item.val);
                  }}
                  className={`py-2 px-2 rounded-xl text-[11.5px] font-semibold border transition ${
                    active
                      ? 'bg-[#0D4A2E] text-white border-[#0D4A2E]'
                      : 'bg-[#F5F2E8] text-primary border-[#DCD8C6]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Milestone Double-Pulse Toggle */}
        <div className="flex items-center justify-between rounded-2xl bg-[#F5F2E8] p-3 border border-[#DCD8C6]">
          <div>
            <h4 className="font-serif text-[15px] font-semibold text-primary">
              33 / 99 / 313 Target Alert Pulse
            </h4>
            <p className="text-[11px] text-secondary mt-0.5">
              Distinct triple-pulse when you reach your target bead count
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              updateField('milestoneVibration', !settings.milestoneVibration)
            }
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold ${
              settings.milestoneVibration !== false
                ? 'bg-[#0D4A2E] text-[#F0D58C]'
                : 'bg-[#EAE8D7] text-secondary'
            }`}
          >
            {settings.milestoneVibration !== false ? 'On ✓' : 'Off'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => triggerTestPulse([18, 40, 25])}
          className="btn-primary w-full py-2.5 text-[12.5px] font-semibold"
        >
          📳 Test Target Completion Pulse
        </button>
      </div>
    </div>
  );
}