
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
    onClick,
    ...props 
  }, ref) => {
    const { triggerHaptic } = useHapticFeedback();
    
    const gestureRef = useIOSGestures({
      onSwipeLeft,
      onSwipeRight,
      threshold: 80
    });

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      console.log('IOSCard clicked');
      
      if (hapticOnTouch) {
        triggerHaptic('selection');
      }
      
      if (onClick) {
        onClick(e);
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
          "bg-surface2 rounded-xl border border-[hsl(var(--border))] transition-all duration-ios ease-ios will-change-transform",
          "touch-manipulation select-none",
          elevated ? [
            "shadow-elev-1 hover:shadow-elev-2",
            "hover:-translate-y-1 hover:scale-[1.02]",
            "active:translate-y-0 active:scale-[0.98]"
          ] : [
            "shadow-elev-1"
          ],
          className
        )}
        onClick={handleClick}
        onContextMenu={onLongPress ? handleLongPress : undefined}
        style={{
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

IOSCard.displayName = 'IOSCard';

export { IOSCard };
