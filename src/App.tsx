import { PerformanceProvider } from './context/PerformanceContext';
import { AppProvider } from './context/AppContext';
import { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import ScreenManager from './components/ScreenManager';
import ParticleBackground from './components/ParticleBackground';
import SceneBackground from './components/SceneBackground';

function App(): React.ReactElement {
  return (
    <PerformanceProvider>
      <AppProvider>
        <ParticlesProvider init={loadSlim}>
          <div className="relative w-full h-full overflow-hidden vignette" style={{ background: 'var(--bg)' }}>
            <SceneBackground />
            <div className="ambient-glow" />
            <div className="grid-overlay" />
            <ParticleBackground />
            <ScreenManager />
          </div>
        </ParticlesProvider>
      </AppProvider>
    </PerformanceProvider>
  );
}

export default App;
