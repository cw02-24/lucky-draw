import { useState, useCallback, useEffect } from 'react';

/**
 * Hook to trigger haptic feedback on supported mobile devices
 */
export const useHaptics = () => {
  const vibrate = useCallback((pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        console.warn('Haptic feedback failed', e);
      }
    }
  }, []);

  const triggerSpinStart = () => vibrate(50);
  const triggerWin = () => vibrate([100, 50, 100]);

  return { triggerSpinStart, triggerWin };
};
