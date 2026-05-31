export type Screen = 'hook' | 'input' | 'analysis' | 'choice' | 'awakening' | 'share';
export type PerformanceLevel = 'full' | 'degraded';
export type ParticleMode = 'hook' | 'analysis' | 'result';

export interface SceneData {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  before: string;
  after: string;
  qwenRole: string;
  stats: {
    understanding: number;
    creativity: number;
    efficiency: number;
  };
}

export interface ResultData {
  name: string;
  slogan: string;
  qwenRole: string;
  stats: {
    understanding: number;
    creativity: number;
    efficiency: number;
  };
}

export interface UserData {
  scene: SceneData | null;
  result: ResultData | null;
}
