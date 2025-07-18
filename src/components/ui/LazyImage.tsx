import { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage = ({
  src,
  alt,
  className,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
  fallback = '/placeholder.svg',
  loading = 'lazy',
  onLoad,
  onError
}: LazyImageProps) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [setIntersectionRef, entry] = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current) {
      setIntersectionRef(imgRef.current);
      setImageRef(imgRef.current);
    }
  }, [setIntersectionRef]);

  useEffect(() => {
    if (entry?.isIntersecting && imageSrc === placeholder && !hasError) {
      // Start loading the actual image
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        onLoad?.();
      };
      
      img.onerror = () => {
        setImageSrc(fallback);
        setHasError(true);
        onError?.();
      };
      
      img.src = src;
    }
  }, [entry?.isIntersecting, src, fallback, placeholder, imageSrc, hasError, onLoad, onError]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-70',
        className
      )}
      loading={loading}
      decoding="async"
      onLoad={() => {
        if (imageSrc !== placeholder) {
          setIsLoaded(true);
          onLoad?.();
        }
      }}
      onError={() => {
        if (imageSrc !== fallback) {
          setImageSrc(fallback);
          setHasError(true);
          onError?.();
        }
      }}
    />
  );
};