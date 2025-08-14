import { useEffect, useState, useCallback } from 'react';

interface ViewportSize {
  width: number;
  height: number;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
}

export const useViewportResize = () => {
  const [viewport, setViewport] = useState<ViewportSize>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1024,
        height: 768,
        isSmall: false,
        isMedium: true,
        isLarge: false,
      };
    }
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      width,
      height,
      isSmall: width < 640,
      isMedium: width >= 640 && width < 1024,
      isLarge: width >= 1024,
    };
  });

  const updateViewport = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    setViewport({
      width,
      height,
      isSmall: width < 640,
      isMedium: width >= 640 && width < 1024,
      isLarge: width >= 1024,
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Use ResizeObserver for better performance if available
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(updateViewport);
      resizeObserver.observe(document.documentElement);
      
      return () => resizeObserver.disconnect();
    }
    
    // Fallback to window resize event
    const handleResize = () => updateViewport();
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateViewport]);

  return viewport;
};