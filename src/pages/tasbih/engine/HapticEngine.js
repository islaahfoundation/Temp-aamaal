//Provides subtle tactile vibration feedback (navigator.vibrate) for bead advances (+1), undo (-1), 33/100 intervals, and goal completion.

// src/pages/tasbih/engine/HapticEngine.js

export const HapticEngine = {
  isSupported() {
    return typeof window !== 'undefined' && 'vibrate' in navigator;
  },

  triggerBeadAdvance(enabled = true, intensity = 12) {
    if (!enabled || !this.isSupported()) return;
    try {
      navigator.vibrate(intensity);
    } catch (_) {}
  },

  triggerBeadUndo(enabled = true) {
    if (!enabled || !this.isSupported()) return;
    try {
      navigator.vibrate([8, 25, 8]);
    } catch (_) {}
  },

  triggerRoundMilestone(enabled = true) {
    if (!enabled || !this.isSupported()) return;
    try {
      navigator.vibrate([18, 40, 28]);
    } catch (_) {}
  },

  triggerGoalComplete(enabled = true) {
    if (!enabled || !this.isSupported()) return;
    try {
      navigator.vibrate([25, 50, 25, 50, 45]);
    } catch (_) {}
  },
};

export default HapticEngine;