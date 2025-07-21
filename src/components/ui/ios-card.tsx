
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useIOSGestures } from '@/hooks/useIOSGestures';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface IOSCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onLongPress?: () => void;
  hapticOnTouch?: boolean;
  elevated?: boolean;
}

const IOSCard = forwardRef<HTMLDivElement, IOSCardProps>(
  ({ 
    className, 
    children, 
    onSwipeLeft, 
    onSwipeRight, 
    onLongPress,
    hapticOnTouch = false,
    elevated = false,
    ...props 
  }, ref) => {
    const { triggerHaptic } = useHapticFeedback();
    
    const gestureRef = useIOSGestures({
      onSwipeLeft,
      onSwipeRight,
      threshold: 80
    });

    const handleTouchStart = () => {
      if (hapticOnTouch) {
        triggerHaptic('selection');
      }
    };

    const handleLongPress = () => {
      if (onLongPress) {
        triggerHaptic('medium');
        onLongPress();
      }
    };

    return (
      <div
        ref={(element) => {
          if (ref) {
            if (typeof ref === 'function') {
              ref(element);
            } else {
              ref.current = element;
            }
          }
          if (gestureRef && element) {
            (gestureRef as React.MutableRefObject<HTMLElement | null>).current = element;
          }
        }}
        className={cn(
          "bg-white rounded-2xl transition-all duration-300 will-change-transform",
          "touch-manipulation select-none",
          elevated ? [
            "shadow-lg shadow-black/8 hover:shadow-xl hover:shadow-black/12",
            "hover:-translate-y-1 hover:scale-[1.02]",
            "active:translate-y-0 active:scale-[0.98]"
          ] : [
            "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/8"
          ],
          className
        )}
        onTouchStart={handleTouchStart}
        onContextMenu={onLongPress ? handleLongPress : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

IOSCard.displayName = 'IOSCard';

export { IOSCard };
