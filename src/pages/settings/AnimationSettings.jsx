//Controls smooth screen transitions, Tasbih bead movement animations, progress ring animations, and reduced-motion accessibility.

import React from 'react';

export default function AnimationSettings({
  settings = {
    smoothTransitions: true,
    tasbihBeadAnimation: true,
    progressRingSweep: true,
    reducedMotion: false,
  },
  onUpdateSettings,
  onBack,
}) {
  const toggleItem = (key) => {
    try {
      if (navigator.vibrate) navigator.vibrate(8);
    } catch (_) {}
    if (onUpdateSettings) {
      onUpdateSettings({
        ...settings,
        [key]: !settings[key],
      });
    }
  };

  const OPTIONS = [
    {
      key: 'tasbihBeadAnimation',
      title: 'Interactive Tasbih Bead Motion',
      desc: 'Animate bead movement and counter pulse on every Dhikr tap',
    },
    {
      key: 'progressRingSweep',
      title: 'Circular Progress Ring Sweep',
      desc: 'Smoothly animate the Today’s Progress ring on the Home dashboard',
    },
    {
      key: 'smoothTransitions',
      title: 'Gentle Screen Fade Transitions',
      desc: 'Soft fade-in effect when switching between Duas, Aamaal, and Tabs',
    },
    {
      key: 'reducedMotion',
      title: 'Battery Saver / Reduced Motion Mode',
      desc: 'Minimize animations for instant transitions on older devices',
    },
  ];

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
        <span className="badge-pill">Motion &amp; Fluidity</span>
        <h3 className="font-serif text-[21px] font-semibold text-primary mt-1">
          ✨ Animation Settings
        </h3>
        <p className="text-[12px] text-secondary mt-0.5">
          Customize visual motion and counter feedback animations.
        </p>
      </div>

      <div className="card rounded-[20px] p-4 space-y-2.5">
        {OPTIONS.map((opt) => {
          const active = Boolean(settings[opt.key]);
          return (
            <div
              key={opt.key}
              className="flex items-center justify-between rounded-2xl bg-[#F5F2E8] p-3 border border-[#DCD8C6] gap-3"
            >
              <div>
                <h4 className="font-serif text-[14.5px] font-semibold text-primary">
                  {opt.title}
                </h4>
                <p className="text-[11px] text-secondary mt-0.5">{opt.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleItem(opt.key)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold shrink-0 ${
                  active
                    ? 'bg-[#0D4A2E] text-[#F0D58C]'
                    : 'bg-[#EAE8D7] text-secondary'
                }`}
              >
                {active ? 'On ✓' : 'Off'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}