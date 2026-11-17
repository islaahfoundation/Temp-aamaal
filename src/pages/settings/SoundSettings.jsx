//Configures audio recitation volume, soft wooden Tasbih click sound effects (synthesized cleanly via Web Audio API so zero external sound files are needed), and completion chimes.

import React from 'react';

export default function SoundSettings({
  settings = {
    duaAudioEnabled: true,
    tasbihClickSound: false,
    completionChime: true,
    audioVolume: 85,
  },
  onUpdateSettings,
  onShowToast,
  onBack,
}) {
  const updateKey = (key, val) => {
    if (onUpdateSettings) {
      onUpdateSettings({
        ...settings,
        [key]: val,
      });
    }
  };

  // Pure Web Audio API Wooden Bead Click / Chime Preview
  const playTestChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, ctx.currentTime);
        gain.gain.setValueAtTime(
          ((settings.audioVolume || 85) / 100) * 0.25,
          ctx.currentTime
        );
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (_) {}
    if (onShowToast) onShowToast('🔊 Played gentle chime preview');
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
        <span className="badge-pill">Audio &amp; Recitation</span>
        <h3 className="font-serif text-[21px] font-semibold text-primary mt-1">
          🔊 Sound &amp; Audio Settings
        </h3>
        <p className="text-[12px] text-secondary mt-0.5">
          Manage Arabic Dua audio recitation playback and subtle counter chimes.
        </p>
      </div>

      <div className="card rounded-[20px] p-4 space-y-4">
        <div>
          <div className="flex items-center justify-between text-[12px] font-bold text-primary mb-1">
            <span>Recitation &amp; Chime Volume</span>
            <span className="text-[#0D4A2E]">{settings.audioVolume || 85}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={settings.audioVolume || 85}
            onChange={(e) =>
              updateKey('audioVolume', Number(e.target.value))
            }
            className="w-full accent-[#0D4A2E]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-2xl bg-[#F5F2E8] p-3 border border-[#DCD8C6]">
            <div>
              <h4 className="font-serif text-[14.5px] font-semibold text-primary">
                Arabic Dua Audio Player
              </h4>
              <p className="text-[11px] text-secondary">
                Show the Listen bar inside Dua Details to hear Arabic pronunciation
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                updateKey('duaAudioEnabled', !settings.duaAudioEnabled)
              }
              className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                settings.duaAudioEnabled !== false
                  ? 'bg-[#0D4A2E] text-[#F0D58C]'
                  : 'bg-[#EAE8D7] text-secondary'
              }`}
            >
              {settings.duaAudioEnabled !== false ? 'On ✓' : 'Off'}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-[#F5F2E8] p-3 border border-[#DCD8C6]">
            <div>
              <h4 className="font-serif text-[14.5px] font-semibold text-primary">
                Soft Tasbih Bead Click Sound
              </h4>
              <p className="text-[11px] text-secondary">
                Play a subtle acoustic tap when counting digital Tasbih beads
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                updateKey('tasbihClickSound', !settings.tasbihClickSound)
              }
              className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                settings.tasbihClickSound
                  ? 'bg-[#0D4A2E] text-[#F0D58C]'
                  : 'bg-[#EAE8D7] text-secondary'
              }`}
            >
              {settings.tasbihClickSound ? 'On ✓' : 'Off'}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={playTestChime}
          className="btn-primary w-full py-2.5 text-[12.5px] font-semibold"
        >
          🔊 Test Audio Chime
        </button>
      </div>
    </div>
  );
}