import { useEffect, useState } from 'react';

/**
 * Hook to detect user's accessibility preferences
 */
export const useAccessibility = (): {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersReducedTransparency: boolean;
  fontSize: 'small' | 'medium' | 'large';
} => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);
  const [prefersReducedTransparency, setPrefersReducedTransparency] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  useEffect(() => {
    // Check reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent): void => {
      setPrefersReducedMotion(e.matches);
    };
    
    motionQuery.addEventListener('change', handleMotionChange);

    // Check high contrast preference
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(contrastQuery.matches);
    
    const handleContrastChange = (e: MediaQueryListEvent): void => {
      setPrefersHighContrast(e.matches);
    };
    
    contrastQuery.addEventListener('change', handleContrastChange);

    // Check reduced transparency preference (mainly for iOS)
    const transparencyQuery = window.matchMedia('(prefers-reduced-transparency: reduce)');
    setPrefersReducedTransparency(transparencyQuery.matches);
    
    const handleTransparencyChange = (e: MediaQueryListEvent): void => {
      setPrefersReducedTransparency(e.matches);
    };
    
    transparencyQuery.addEventListener('change', handleTransparencyChange);

    // Detect font size preference
    const fontSize = window.getComputedStyle(document.documentElement).fontSize;
    const fontSizeNum = parseFloat(fontSize);
    
    if (fontSizeNum <= 14) {
      setFontSize('small');
    } else if (fontSizeNum >= 18) {
      setFontSize('large');
    } else {
      setFontSize('medium');
    }

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
      transparencyQuery.removeEventListener('change', handleTransparencyChange);
    };
  }, []);

  return {
    prefersReducedMotion,
    prefersHighContrast,
    prefersReducedTransparency,
    fontSize
  };
};

/**
 * Hook for announcing content to screen readers
 */
export const useScreenReader = (): {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
} => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
};