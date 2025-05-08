import { useState, useEffect } from 'react';

/**
 * A custom hook that persists state in localStorage
 * @param key - The localStorage key to use
 * @param initialValue - The initial value if nothing is in localStorage
 * @returns A state array similar to useState, but persisted
 */
export function usePersistentState<T>(key: string, initialValue: T) {
  // Get stored value from localStorage or use initialValue
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, state]);

  return [state, setState] as const;
}