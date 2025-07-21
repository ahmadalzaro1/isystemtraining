
import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: HapticType = 'light') => {
    // Check if device supports haptic feedback
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate(30);
          break;
        case 'selection':
          navigator.vibrate(5);
          break;
        case 'success':
          navigator.vibrate([10, 50, 10]);
          break;
        case 'warning':
          navigator.vibrate([20, 100, 20]);
          break;
        case 'error':
          navigator.vibrate([50, 50, 50]);
          break;
        default:
          navigator.vibrate(10);
      }
    }
    
    // iOS-specific haptic feedback (if available)
    if (typeof (window as any).DeviceMotionEvent?.requestPermission === 'function') {
      // This is iOS 13+ with motion permissions
      console.log(`iOS haptic feedback: ${type}`);
    }
  }, []);

  return { triggerHaptic };
};
