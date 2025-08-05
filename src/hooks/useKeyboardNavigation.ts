import { useEffect, useCallback, useRef } from 'react';

interface UseKeyboardNavigationOptions {
  onEnter?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: () => void;
  onShiftTab?: () => void;
  enabled?: boolean;
}

/**
 * Hook for handling keyboard navigation
 * Provides consistent keyboard interaction patterns
 */
export const useKeyboardNavigation = (options: UseKeyboardNavigationOptions = {}): React.RefObject<HTMLElement> => {
  const {
    onEnter,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    onShiftTab,
    enabled = true
  } = options;

  const elementRef = useRef<HTMLElement>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    switch (event.key) {
      case 'Enter':
        if (onEnter) {
          event.preventDefault();
          onEnter();
        }
        break;
      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape();
        }
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp();
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown();
        }
        break;
      case 'ArrowLeft':
        if (onArrowLeft) {
          event.preventDefault();
          onArrowLeft();
        }
        break;
      case 'ArrowRight':
        if (onArrowRight) {
          event.preventDefault();
          onArrowRight();
        }
        break;
      case 'Tab':
        if (event.shiftKey && onShiftTab) {
          event.preventDefault();
          onShiftTab();
        } else if (!event.shiftKey && onTab) {
          event.preventDefault();
          onTab();
        }
        break;
    }
  }, [enabled, onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab, onShiftTab]);

  useEffect(() => {
    const element = elementRef.current;
    if (element && enabled) {
      element.addEventListener('keydown', handleKeyDown);
      return () => element.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);

  return elementRef;
};

/**
 * Hook for managing focus within a container
 * Useful for modal dialogs and dropdown menus
 */
export const useFocusManagement = (): {
  focusableElementsRef: React.RefObject<HTMLElement>;
  trapFocus: () => void;
  restoreFocus: () => void;
} => {
  const focusableElementsRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  const trapFocus = useCallback(() => {
    previousActiveElement.current = document.activeElement;
    
    const container = focusableElementsRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousActiveElement.current instanceof HTMLElement) {
      previousActiveElement.current.focus();
    }
  }, []);

  return {
    focusableElementsRef,
    trapFocus,
    restoreFocus
  };
};