import { useMemo } from 'react';
import Particles from '@tsparticles/react';
import { hookConfig, analysisConfig, resultConfig } from '../utils/particlesConfig';
import { useApp } from '../context/AppContext';
import { usePerformance } from '../context/PerformanceContext';

function ParticleBackground() {
  const { state } = useApp();
  const perfLevel = usePerformance();

  const config = useMemo(() => {
    if (perfLevel === 'degraded') return null;

    switch (state.screen) {
      case 'hook':
        return hookConfig;
      case 'analysis':
        return analysisConfig;
      case 'awakening':
      case 'share':
        return resultConfig;
      default:
        return hookConfig;
    }
  }, [state.screen, perfLevel]);

  if (!config) return null;

  return (
    <div className="absolute inset-0 z-0">
      <Particles
        id="tsparticles"
        options={config as object}
        className="w-full h-full"
      />
    </div>
  );
}

export default ParticleBackground;
