//Settings modal for Haptic vibration intensity, Click sound effects, and Bead motion on/off.

// src/pages/tasbih/TasbihFeedback.jsx
// src/pages/tasbih/TasbihFeedback.jsx
import React from 'react';
import { BEAD_MATERIAL_THEMES } from './engine/BeadCanvas';

export default function TasbihFeedback({
  settings = {
    hapticsEnabled: true,
    soundEnabled: true,
    motionEnabled: true,
  },
  currentMaterial = 'olivewood',
  onUpdateSettings,
  onSelectMaterial,
  onClose,
}) {
  const toggleKey = (key) => {
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

  return (
    <div className="absolute right-5 top-20 z-50 rounded-[24px] bg-[#F5F2E8] border border-[#C99E4C] shadow-2xl p-4 w-72 space-y-3 max-h-[75vh] overflow-y-auto no-scrollbar fade-in">
      <div className="flex items-center justify-between pb-1 border-b border-[#DCD8C6]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#135332]">
          Tasbih Settings &amp; Beads
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-[#EAE8D7] text-primary font-bold text-xs flex items-center justify-center"
          >
            ✕
          </button>
        )}
      </div>

      {/* Feedback Toggles */}
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-xl bg-[#FFFDF9] p-3 border border-[#DCD8C6]">
          <div>
            <h4 className="font-serif text-[14px] font-semibold text-primary">
              Haptic Vibration
            </h4>
            <p className="text-[10.5px] text-secondary">
              Tactile feedback on bead advance
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleKey('hapticsEnabled')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
              settings.hapticsEnabled !== false
                ? 'bg-[#0D4A2E] text-[#F0D58C]'
                : 'bg-[#EAE8D7] text-secondary'
            }`}
          >
            {settings.hapticsEnabled !== false ? 'On ✓' : 'Off'}
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#FFFDF9] p-3 border border-[#DCD8C6]">
          <div>
            <h4 className="font-serif text-[14px] font-semibold text-primary">
              Wooden Click Sound
            </h4>
            <p className="text-[10.5px] text-secondary">
              Acoustic bead tap click effect
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleKey('soundEnabled')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
              settings.soundEnabled !== false
                ? 'bg-[#0D4A2E] text-[#F0D58C]'
                : 'bg-[#EAE8D7] text-secondary'
            }`}
          >
            {settings.soundEnabled !== false ? 'On ✓' : 'Off'}
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#FFFDF9] p-3 border border-[#DCD8C6]">
          <div>
            <h4 className="font-serif text-[14px] font-semibold text-primary">
              Bead Motion Animation
            </h4>
            <p className="text-[10.5px] text-secondary">
              Smooth spring movement on tap/swipe
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggleKey('motionEnabled')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
              settings.motionEnabled !== false
                ? 'bg-[#0D4A2E] text-[#F0D58C]'
                : 'bg-[#EAE8D7] text-secondary'
            }`}
          >
            {settings.motionEnabled !== false ? 'On ✓' : 'Off'}
          </button>
        </div>
      </div>

      {/* Bead Material & Gemstone Theme Picker (Moved from Image Button) */}
      <div className="space-y-1.5 pt-2 border-t border-[#DCD8C6]">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary">
          Bead Material &amp; Theme
        </label>
        {Object.values(BEAD_MATERIAL_THEMES).map((mat) => {
          const isSelected = currentMaterial === mat.id;
          return (
            <button
              key={mat.id}
              type="button"
              onClick={() => {
                try {
                  if (navigator.vibrate) navigator.vibrate(8);
                } catch (_) {}
                if (onSelectMaterial) onSelectMaterial(mat.id);
              }}
              className={`w-full text-left rounded-xl p-2.5 border transition flex items-center justify-between ${
                isSelected
                  ? 'bg-[#0D4A2E] border-[#C99E4C] shadow-sm'
                  : 'bg-[#FFFDF9] border-[#DCD8C6] hover:bg-[#EAE8D7]'
              }`}
            >
              <div className="min-w-0 pr-2">
                <h4
                  className="font-serif text-[13.5px] font-semibold truncate"
                  style={{ color: isSelected ? '#FFFFFF' : '#0D4A2E' }}
                >
                  {mat.name}
                </h4>
                <p
                  className="text-[10px] truncate"
                  style={{
                    color: isSelected
                      ? 'rgba(255, 255, 255, 0.85)'
                      : '#4E5953',
                  }}
                >
                  {mat.description}
                </p>
              </div>
              {isSelected && (
                <span className="text-[#F0D58C] font-bold shrink-0">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}