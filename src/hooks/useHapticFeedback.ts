
import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: HapticType = 'light') => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Triggering haptic feedback: ${type}`);
    }
    
    // Check device capabilities first
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    // iOS-specific haptic feedback (preferred method)
    if (isIOS && typeof (window as any).DeviceMotionEvent?.requestPermission === 'function') {
      // iOS 13+ haptic engine (if available)
      try {
        if ((window as any).navigator.vibrate) {
          (window as any).navigator.vibrate(type === 'selection' ? 5 : type === 'light' ? 10 : type === 'medium' ? 20 : 30);
        }
      } catch (error) {
        // Fallback silently
      }
      return;
    }
    
    // Cross-platform vibration API fallback
    if ('vibrate' in navigator) {
      try {
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
      } catch (error) {
        // Fail silently for better cross-platform compatibility
        if (process.env.NODE_ENV === 'development') {
          console.warn('Haptic feedback not supported:', error);
        }
      }
    }
  }, []);

  return { triggerHaptic };
};
