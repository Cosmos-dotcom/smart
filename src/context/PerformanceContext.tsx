import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { detectPerformance } from '../utils/performance';
import type { PerformanceLevel } from '../types';

const PerformanceContext = createContext<PerformanceLevel>('full');

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const level = useMemo(() => detectPerformance(), []);

  return (
    <PerformanceContext.Provider value={level}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance(): PerformanceLevel {
  return useContext(PerformanceContext);
}
