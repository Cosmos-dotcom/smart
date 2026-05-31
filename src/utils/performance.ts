import type { PerformanceLevel } from '../types';

export function detectPerformance(): PerformanceLevel {
  try {
    const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    if (isMobile) return 'degraded';

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null
      || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return 'degraded';

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : '';

    const lowEndGPUs = ['Mali-4', 'Mali-T', 'Adreno 3', 'Adreno 505', 'PowerVR SGX', 'Intel HD'];
    if (renderer && lowEndGPUs.some(gpu => renderer.includes(gpu))) return 'degraded';

    const nav = navigator as Navigator & { deviceMemory?: number };
    if (nav.deviceMemory && nav.deviceMemory < 4) return 'degraded';
  } catch {
    return 'degraded';
  }

  return 'full';
}
