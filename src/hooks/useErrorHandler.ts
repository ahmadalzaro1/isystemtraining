import { useCallback } from 'react';
import { toast } from 'sonner';

export interface UseErrorHandlerReturn {
  handleError: (error: unknown, fallbackMessage?: string) => void;
  handleAsyncError: <T>(
    asyncFn: () => Promise<T>,
    fallbackMessage?: string
  ) => Promise<T | null>;
}

/**
 * Centralized error handling hook
 * Provides consistent error handling across the application
 */
export const useErrorHandler = (): UseErrorHandlerReturn => {
  const handleError = useCallback((error: unknown, fallbackMessage = 'An error occurred'): void => {
    let errorMessage = fallbackMessage;
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }

    // Log error for debugging
    console.error('Error handled:', error);
    
    // Show user-friendly toast
    toast.error(errorMessage);
    
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error monitoring service
      // sendErrorToMonitoring(error);
    }
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    fallbackMessage = 'Operation failed'
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, fallbackMessage);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
};