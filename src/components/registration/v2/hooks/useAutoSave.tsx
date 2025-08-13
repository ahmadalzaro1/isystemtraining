import { useCallback } from 'react';

export const useAutoSave = (key: string, workshopId: string) => {
  const storageKey = `${key}-${workshopId}`;

  const saveData = useCallback((data: any) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save form data:', error);
    }
  }, [storageKey]);

  const loadData = useCallback(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Failed to load form data:', error);
      return null;
    }
  }, [storageKey]);

  const clearData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to clear form data:', error);
    }
  }, [storageKey]);

  return { saveData, loadData, clearData };
};