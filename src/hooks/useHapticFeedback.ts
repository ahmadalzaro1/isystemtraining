
import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';

interface WindowWithHaptics extends Window {
  DeviceMotionEvent?: {
    requestPermission?: () => Promise<'granted' | 'denied'>;
  };
  navigator: Navigator & {
    vibrate?: (pattern: number | number[]) => boolean;
  };
}

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: HapticType = 'light'): void => {
    // Check device capabilities first
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const windowWithHaptics = window as WindowWithHaptics;
    
    // iOS-specific haptic feedback (preferred method)
    if (isIOS && typeof windowWithHaptics.DeviceMotionEvent?.requestPermission === 'function') {
      // iOS 13+ haptic engine (if available)
      try {
        if (windowWithHaptics.navigator.vibrate) {
          const duration = type === 'selection' ? 5 : type === 'light' ? 10 : type === 'medium' ? 20 : 30;
          windowWithHaptics.navigator.vibrate(duration);
        }
      } catch (error) {
        // Fallback silently
      }
      return;
    }
    
    // Cross-platform vibration API fallback
    if ('vibrate' in navigator && windowWithHaptics.navigator.vibrate) {
      try {
        switch (type) {
          case 'light':
            windowWithHaptics.navigator.vibrate(10);
            break;
          case 'medium':
            windowWithHaptics.navigator.vibrate(20);
            break;
          case 'heavy':
            windowWithHaptics.navigator.vibrate(30);
            break;
          case 'selection':
            windowWithHaptics.navigator.vibrate(5);
            break;
          case 'success':
            windowWithHaptics.navigator.vibrate([10, 50, 10]);
            break;
          case 'warning':
            windowWithHaptics.navigator.vibrate([20, 100, 20]);
            break;
          case 'error':
            windowWithHaptics.navigator.vibrate([50, 50, 50]);
            break;
          default:
            windowWithHaptics.navigator.vibrate(10);
        }
      } catch (error) {
        // Fail silently for better cross-platform compatibility
      }
    }
  }, []);

  return { triggerHaptic };
};
