import type { ISourceOptions } from '@tsparticles/engine';

const baseConfig: ISourceOptions = {
  fullScreen: { enable: false },
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    color: { value: '#5eead4' },
    links: {
      enable: true,
      color: '#5eead4',
      opacity: 0.15,
      distance: 150,
    },
    move: {
      enable: true,
      direction: 'none',
      outModes: { default: 'out' },
      speed: 0.5,
    },
    number: { value: 40, density: { enable: true, width: 1920, height: 1080 } },
    opacity: { value: { min: 0.1, max: 0.3 } },
    shape: { type: 'circle' },
    size: { value: { min: 1, max: 3 } },
  },
  detectRetina: true,
};

export const hookConfig: ISourceOptions = {
  ...baseConfig,
  particles: {
    ...baseConfig.particles!,
    number: { value: 50, density: { enable: true, width: 1920, height: 1080 } },
    move: {
      ...baseConfig.particles!.move!,
      speed: 0.5,
    },
    opacity: { value: { min: 0.1, max: 0.3 } },
  },
};

export const analysisConfig: ISourceOptions = {
  ...baseConfig,
  particles: {
    ...baseConfig.particles!,
    number: { value: 150, density: { enable: true, width: 1920, height: 1080 } },
    move: {
      ...baseConfig.particles!.move!,
      speed: 3,
    },
    opacity: { value: { min: 0.2, max: 0.5 } },
    links: {
      ...baseConfig.particles!.links!,
      opacity: 0.3,
    },
  },
};

export const resultConfig: ISourceOptions = {
  ...baseConfig,
  particles: {
    ...baseConfig.particles!,
    number: { value: 80, density: { enable: true, width: 1920, height: 1080 } },
    move: {
      ...baseConfig.particles!.move!,
      speed: 1,
    },
    opacity: { value: { min: 0.15, max: 0.35 } },
    color: { value: ['#5eead4', '#9ef86f'] },
  },
};
