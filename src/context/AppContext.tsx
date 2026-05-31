import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Screen, UserData, SceneData, ResultData } from '../types';

interface AppState {
  screen: Screen;
  userData: UserData;
}

interface AppContextType {
  state: AppState;
  setScreen: (screen: Screen) => void;
  selectScene: (scene: SceneData) => void;
  setResult: (result: ResultData) => void;
  reset: () => void;
}

const initialState: AppState = {
  screen: 'hook',
  userData: { scene: null, result: null },
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const setScreen = useCallback((screen: Screen) => {
    setState(prev => ({ ...prev, screen }));
  }, []);

  const selectScene = useCallback((scene: SceneData) => {
    setState(prev => ({
      ...prev,
      userData: { ...prev.userData, scene },
    }));
  }, []);

  const setResult = useCallback((result: ResultData) => {
    setState(prev => ({
      ...prev,
      userData: { ...prev.userData, result },
    }));
  }, []);

  const reset = useCallback(() => {
    setState({ screen: 'hook', userData: { scene: null, result: null } });
  }, []);

  return (
    <AppContext.Provider value={{ state, setScreen, selectScene, setResult, reset }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
