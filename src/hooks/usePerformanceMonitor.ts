import { useEffect } from 'react';

interface PerformanceMetrics {
  component: string;
  renderTime: number;
  timestamp: number;
}

const performanceMetrics: PerformanceMetrics[] = [];

export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      performanceMetrics.push({
        component: componentName,
        renderTime,
        timestamp: Date.now()
      });
      
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.debug(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
};

export const getPerformanceMetrics = () => [...performanceMetrics];

export const clearPerformanceMetrics = () => {
  performanceMetrics.length = 0;
};