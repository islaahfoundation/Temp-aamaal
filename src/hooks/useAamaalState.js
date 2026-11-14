import { useState, useEffect, useCallback } from 'react';
import {
  loadAamaalState,
  saveAamaalState,
  clearAamaalState
} from '../services/aamaalService';

export function useAamaalState() {
  const [state, setState] = useState(() => loadAamaalState());

  useEffect(() => {
    saveAamaalState(state);
  }, [state]);

  const updateState = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    const fresh = clearAamaalState();
    setState(fresh);
  }, []);

  return { state, updateState, resetAll };
}
