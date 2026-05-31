import { PerformanceProvider } from './context/PerformanceContext';
import { AppProvider } from './context/AppContext';
import { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { usePerformance } from './context/PerformanceContext';
import ScreenManager from './components/ScreenManager';
import ParticleBackground from './components/ParticleBackground';
import SceneBackground from './components/SceneBackground';

function AppShell(): React.ReactElement {
  const performance = usePerformance();
  const content = (
    <div
      className={`relative w-full h-full overflow-hidden vignette perf-${performance}`}
      style={{ background: 'var(--bg)' }}
    >
      <SceneBackground />
      <div className="ambient-glow" />
      <div className="grid-overlay" />
      {performance === 'full' && <ParticleBackground />}
      <ScreenManager />
    </div>
  );

  if (performance === 'degraded') return content;

  return (
    <ParticlesProvider init={loadSlim}>
      {content}
    </ParticlesProvider>
  );
}

function App(): React.ReactElement {
  return (
    <PerformanceProvider>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </PerformanceProvider>
  );
}

export default App;
