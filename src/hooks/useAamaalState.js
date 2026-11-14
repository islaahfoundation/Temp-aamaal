import { useState, useEffect, useCallback } from 'react';
import { loadAamaalState, saveAamaalState, clearAamaalState } from '../services/aamaalService';

export function useAamaalState() {
  const [state, setState] = useState(() => loadAamaalState());

  useEffect(() => {
    saveAamaalState(state);
  }, [state]);

  const updateState = useCallback((updater) => {
    setState((prev) => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
  }, []);

  const resetAll = useCallback(() => {
    setState(clearAamaalState());
  }, []);

  return { state, updateState, resetAll };
}
