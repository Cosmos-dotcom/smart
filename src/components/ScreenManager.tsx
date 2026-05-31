import { useApp } from '../context/AppContext';
import HookScreen from '../screens/HookScreen';
import InputScreen from '../screens/InputScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import ChoiceScreen from '../screens/ChoiceScreen';
import AwakeningScreen from '../screens/AwakeningScreen';
import ShareScreen from '../screens/ShareScreen';
import { useState, useEffect, useRef, type ComponentType } from 'react';

const screens: Record<string, ComponentType> = {
  hook: HookScreen,
  input: InputScreen,
  analysis: AnalysisScreen,
  choice: ChoiceScreen,
  awakening: AwakeningScreen,
  share: ShareScreen,
};

function ScreenManager() {
  const { state } = useApp();
  const [visible, setVisible] = useState(true);
  const [currentScreen, setCurrentScreen] = useState(state.screen);
  const pendingScreenRef = useRef(state.screen);

  useEffect(() => {
    if (state.screen !== currentScreen) {
      pendingScreenRef.current = state.screen;
      setVisible(false);
      const timer = setTimeout(() => {
        setCurrentScreen(pendingScreenRef.current);
        setVisible(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [state.screen, currentScreen]);

  const ScreenComponent = screens[currentScreen];

  if (!ScreenComponent) {
    return <div className="screen-container"><p>屏幕加载中...</p></div>;
  }

  return (
    <div
      className="absolute inset-0 z-10"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.98)',
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <ScreenComponent />
    </div>
  );
}

export default ScreenManager;
