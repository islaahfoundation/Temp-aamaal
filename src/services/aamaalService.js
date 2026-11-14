const STORAGE_KEY = 'aamaal_circle_compact_v3';

export const defaultState = {
  userName: '',
  focusChips: ['Ease in Affairs', 'Daily Dhikr'],
  dhikrCount: 0,
  sessionsCount: 0,
  remindersCount: 1,
  tasbihCurrent: 0,
  tasbihTarget: 33,
  activePhraseId: 'subhanallah',
  savedDuaIds: ['ease-in-affairs'],
  storyLesson: 2,
  activeDuaFilter: 'all'
};

export function loadAamaalState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch (e) {
    return { ...defaultState };
  }
}

export function saveAamaalState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save Aamaal state:', e);
  }
}

export function clearAamaalState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  return { ...defaultState };
}

export function calculateGoalsProgress(state) {
  let goalsCompleted = 0;
  if (state.dhikrCount > 0) goalsCompleted++;
  if (state.sessionsCount > 0) goalsCompleted++;
  if (state.remindersCount > 0 && (state.dhikrCount > 0 || state.sessionsCount > 0)) {
    goalsCompleted++;
  }

  const percentage = Math.round((goalsCompleted / 3) * 100);
  const circumference = 251.2;
  const visualOffset =
    percentage === 0
      ? circumference * 0.22
      : circumference - (percentage / 100) * circumference;

  return { goalsCompleted, percentage, visualOffset };
}
