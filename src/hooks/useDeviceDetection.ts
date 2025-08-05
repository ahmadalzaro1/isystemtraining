
import { useState, useEffect } from 'react';

interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  supportsHaptics: boolean;
  viewport: {
    width: number;
    height: number;
  };
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    hasTouch: false,
    supportsHaptics: false,
    viewport: { width: 0, height: 0 }
  });

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      // Device detection
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isAndroid = /android/.test(userAgent);
      const isMobile = hasTouch && viewport.width < 768;
      const isTablet = hasTouch && viewport.width >= 768 && viewport.width < 1024;
      const isDesktop = !hasTouch || viewport.width >= 1024;

      // Haptics support detection
      const supportsHaptics = isIOS || ('vibrate' in navigator);

      const newDeviceInfo = {
        isIOS,
        isAndroid,
        isMobile,
        isTablet,
        isDesktop,
        hasTouch,
        supportsHaptics,
        viewport
      };

      

      setDeviceInfo(newDeviceInfo);
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    window.addEventListener('orientationchange', detectDevice);

    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('orientationchange', detectDevice);
    };
  }, []);

  return deviceInfo;
};
