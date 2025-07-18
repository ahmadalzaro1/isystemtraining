import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverProps = {}
) => {
  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options;
  
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [node, setNode] = useState<Element | null>(null);
  
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Ensure we have a valid node to observe
    if (!node) return;

    // Stop observing if already visible and freezeOnceVisible is enabled
    if (freezeOnceVisible && entry?.isIntersecting) return;

    // Clean up previous observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create new observer
    observer.current = new IntersectionObserver(
      ([entry]) => setEntry(entry),
      { threshold, root, rootMargin }
    );

    // Start observing
    observer.current.observe(node);

    // Cleanup
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [node, threshold, root, rootMargin, freezeOnceVisible, entry?.isIntersecting]);

  return [setNode, entry] as const;
};