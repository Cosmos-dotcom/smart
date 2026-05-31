import { useApp } from '../context/AppContext';
import ScreenDecor from '../components/ScreenDecor';
import { useState, useRef, useEffect, useCallback } from 'react';
import EvolutionAnimation from '../components/EvolutionAnimation';
import WorkflowEditor from '../components/WorkflowEditor';
import VisualEvolutionExperience from '../components/VisualEvolutionExperience';
import { assetPath } from '../utils/assetPath';
import gsap from 'gsap';

const visualEvolutionConfigs = {
  car: {
    eyebrow: 'MOBILITY UPGRADE',
    header: 'ROUTE INTELLIGENCE',
    sketchImage: assetPath('assets/posters/car-route-sketch.png'),
    finalImage: assetPath('assets/posters/car-route-final.png'),
    sketchAlt: '未来汽车路线草图',
    finalAlt: '千问 AI 增强后的智能交通路线',
    keywords: ['目的地', '拥堵', '天气', '最优路线'],
    beforeDescription: '只有一条粗略路线，车辆只能按固定导航前往目的地。',
    afterDescription: '千问理解环境、偏好和交通状态，把路线升级为实时决策网络。',
    idleButtonLabel: '接入千问 AI',
    statusLabel: 'optimizing route',
  },
  hardware: {
    eyebrow: 'DEVICE NETWORK',
    header: 'SPATIAL INTELLIGENCE',
    sketchImage: assetPath('assets/posters/hardware-devices-sketch.png'),
    finalImage: assetPath('assets/posters/hardware-devices-final.png'),
    sketchAlt: '智能硬件孤立设备草图',
    finalAlt: '千问 AI 连接后的空间智能网络',
    keywords: ['环境感知', '设备联动', '主动服务', '空间智能'],
    beforeDescription: '设备彼此孤立，只能等待简单指令，无法理解完整空间状态。',
    afterDescription: '千问把设备、环境和人的需求连接起来，形成主动协作的智能空间。',
    idleButtonLabel: '接入千问 AI',
    statusLabel: 'linking devices',
  },
  creator: {
    eyebrow: 'CREATIVE UPGRADE',
    header: 'SKETCH TO FINAL IMAGE',
    sketchImage: assetPath('assets/posters/creator-sketch-city.png'),
    finalImage: assetPath('assets/posters/creator-final-city.png'),
    sketchAlt: '内容创作草图',
    finalAlt: '千问 AI 增强后的城市成品',
    keywords: ['未来城市', '主干道', '能源塔', 'AI 增强'],
    beforeDescription: '只有一个粗糙城市构想，线条、透视和细节都停留在灵感草稿阶段。',
    afterDescription: '千问理解关键词和构图，把同一座城市重构为完整的高质量视觉成品。',
    idleButtonLabel: '接入千问 AI',
    statusLabel: 'interpreting keywords',
  },
} as const;

function ChoiceScreen() {
  const { state, setScreen, setResult } = useApp();
  const [phase, setPhase] = useState<'intro' | 'evolving' | 'done'>('intro');
  const [animWidth, setAnimWidth] = useState(320);
  const scene = state.userData.scene;
  const btnRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEvolutionDone = useCallback(() => setPhase('done'), []);

  // Responsive animation width
  const measureRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const w = Math.min(520, node.clientWidth - 16);
      setAnimWidth(w);
    }
  }, []);

  // Intro phase
  useEffect(() => {
    if (phase !== 'intro') return;
    const timer = setTimeout(() => setPhase('evolving'), 1200);
    return () => clearTimeout(timer);
  }, [phase]);

  // Animate button in when done
  useEffect(() => {
    if (phase === 'done' && btnRef.current) {
      gsap.fromTo(btnRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.3 },
      );
    }
  }, [phase]);

  // Redirect if no scene selected
  useEffect(() => {
    if (!scene) setScreen('input');
  }, [scene, setScreen]);

  if (!scene) return null;

  const handleGenerate = () => {
    setResult({
      name: scene.title.replace('未来', '') + '智能体',
      slogan: scene.subtitle,
      qwenRole: scene.qwenRole,
      stats: scene.stats,
    });
    setScreen('awakening');
  };

  const visualConfig = scene.id === 'car' || scene.id === 'hardware' || scene.id === 'creator'
    ? visualEvolutionConfigs[scene.id]
    : null;

  // Software scene: render WorkflowEditor instead of evolution animation
  if (scene.id === 'software') {
    return (
      <div className="screen-container">
        <ScreenDecor />

        {/* Top header */}
        <div className="absolute top-6 left-0 right-0 flex flex-col items-center gap-1 z-10">
          <p className="font-orbitron text-[10px] tracking-[0.5em] text-[var(--color-cyan)] opacity-40">
            QWEN OS
          </p>
          <p className="font-orbitron text-[8px] tracking-[0.3em] text-[var(--text-secondary)] opacity-30">
            WORKFLOW EDITOR
          </p>
        </div>

        <WorkflowEditor />

        {/* Bottom status */}
        <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-1 z-10">
          <div className="flex items-center gap-3">
            <div className="w-6 h-px bg-[var(--color-cyan)] opacity-20" />
            <p className="font-orbitron text-[7px] tracking-[0.2em] text-[var(--text-secondary)] opacity-25">
              SELECT CAPABILITIES TO CREATE YOUR AI SPECIES
            </p>
            <div className="w-6 h-px bg-[var(--color-orange)] opacity-20" />
          </div>
        </div>
      </div>
    );
  }

  if (visualConfig) {
    return (
      <div className="screen-container">
        <ScreenDecor />

        <div className="absolute top-6 left-0 right-0 flex flex-col items-center gap-1 z-10">
          <p className="font-orbitron text-[10px] tracking-[0.5em] text-[var(--color-cyan)] opacity-40">
            QWEN OS
          </p>
          <p className="font-orbitron text-[8px] tracking-[0.3em] text-[var(--text-secondary)] opacity-30">
            {visualConfig.header}
          </p>
        </div>

        <VisualEvolutionExperience scene={scene} config={visualConfig} onGenerate={handleGenerate} />

        <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-1 z-10">
          <div className="flex items-center gap-3">
            <div className="w-6 h-px bg-[var(--color-cyan)] opacity-20" />
            <p className="font-orbitron text-[7px] tracking-[0.2em] text-[var(--text-secondary)] opacity-25">
              {visualConfig.header}
            </p>
            <div className="w-6 h-px bg-[var(--color-orange)] opacity-20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container" ref={containerRef}>
      <ScreenDecor />

      {/* Top header — always visible */}
      <div className="absolute top-6 left-0 right-0 flex flex-col items-center gap-1 z-10">
        <p className="font-orbitron text-[10px] tracking-[0.5em] text-[var(--color-cyan)] opacity-40">
          QWEN OS
        </p>
        <p className="font-orbitron text-[8px] tracking-[0.3em] text-[var(--text-secondary)] opacity-30">
          EVOLUTION PROTOCOL
        </p>
      </div>

      {/* Intro phase */}
      {phase === 'intro' && (
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <span className="text-6xl">{scene.icon}</span>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-bold text-[var(--color-cyan)]">{scene.title}</h2>
            <p className="text-sm text-[var(--text-secondary)]">{scene.subtitle}</p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-2 h-2 rounded-full bg-[var(--color-cyan)] animate-pulse" />
            <p className="text-sm text-[var(--color-cyan)] opacity-70">千问正在解析进化路径...</p>
          </div>
        </div>
      )}

      {/* Evolution phase */}
      {phase === 'evolving' && (
        <div className="flex flex-col items-center gap-5 w-full max-w-xl" ref={measureRef}>
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-[rgba(94,234,212,0.28)]" />
            <p className="text-xs text-[var(--text-secondary)] tracking-widest uppercase font-orbitron">
              QWEN EVOLUTION
            </p>
            <div className="h-px w-10 bg-[rgba(255,106,0,0.28)]" />
          </div>
          <EvolutionAnimation
            beforeText={scene.before}
            afterText={scene.after}
            width={animWidth}
            height={Math.round(animWidth * 0.62)}
            onComplete={handleEvolutionDone}
          />
        </div>
      )}

      {/* Done phase */}
      {phase === 'done' && (
        <div className="flex flex-col items-center gap-6 max-w-xl w-full">
          <div className="relative w-full overflow-hidden rounded-[20px] border border-[rgba(94,234,212,0.14)] bg-[linear-gradient(135deg,rgba(8,17,15,0.9),rgba(20,13,7,0.72))] p-5 shadow-[0_0_60px_rgba(94,234,212,0.08)]">
            <div className="absolute inset-0 opacity-40" style={{
              backgroundImage: 'linear-gradient(rgba(94,234,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,0.04) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }} />
            <div className="absolute left-1/2 top-0 h-full w-px bg-[linear-gradient(180deg,transparent,rgba(255,106,0,0.5),transparent)]" />
            <div className="relative grid grid-cols-1 items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]">
              <div className="rounded-xl border border-[rgba(94,234,212,0.12)] bg-[rgba(3,8,7,0.54)] p-4 text-center opacity-55">
                <p className="mb-2 font-orbitron text-[10px] tracking-[0.24em] text-[var(--text-secondary)]">BEFORE</p>
                <p className="text-sm md:text-base leading-relaxed">{scene.before}</p>
              </div>

              <div className="flex min-h-12 items-center justify-center gap-2 sm:w-14 sm:flex-col">
                <div className="h-px w-16 bg-[linear-gradient(90deg,transparent,var(--color-cyan))] sm:h-10 sm:w-px sm:bg-[linear-gradient(180deg,transparent,var(--color-cyan))]" />
                <div className="relative h-11 w-11">
                  <div className="absolute inset-0 rounded-full bg-[rgba(255,106,0,0.18)] blur-md" />
                  <div className="absolute inset-2 rounded-full border border-[rgba(255,106,0,0.55)]" />
                  <div className="absolute inset-[15px] rounded-full bg-[var(--color-orange)] shadow-[0_0_24px_rgba(255,106,0,0.55)]" />
                </div>
                <div className="h-px w-16 bg-[linear-gradient(90deg,var(--color-orange),transparent)] sm:h-10 sm:w-px sm:bg-[linear-gradient(180deg,var(--color-orange),transparent)]" />
              </div>

              <div className="rounded-xl border border-[rgba(255,106,0,0.36)] bg-[rgba(10,10,8,0.7)] p-4 text-center shadow-[0_0_36px_rgba(255,106,0,0.14)]">
                <p className="mb-2 font-orbitron text-[10px] tracking-[0.24em] text-[var(--color-orange)]">AFTER</p>
                <p className="text-sm md:text-base leading-relaxed text-[var(--color-cyan)]">{scene.after}</p>
              </div>
            </div>
            <div className="relative mt-4 flex flex-col items-center gap-1 font-orbitron text-[9px] tracking-[0.22em] text-[rgba(174,184,176,0.5)] sm:flex-row sm:justify-between">
              <span>OLD LOGIC</span>
              <span className="text-[var(--color-orange)]">QWEN MUTATION COMPLETE</span>
              <span>NEW AGENT</span>
            </div>
          </div>

          <button
            ref={btnRef}
            className="btn-primary opacity-0"
            onClick={handleGenerate}
          >
            生成我的 AI 新物种
          </button>
        </div>
      )}

      {/* Bottom status — always visible */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-1 z-10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-px bg-[var(--color-cyan)] opacity-20" />
          <p className="font-orbitron text-[7px] tracking-[0.2em] text-[var(--text-secondary)] opacity-25">
            {phase === 'intro' ? 'INITIALIZING' : phase === 'evolving' ? 'PROCESSING' : 'COMPLETE'}
          </p>
          <div className="w-6 h-px bg-[var(--color-orange)] opacity-20" />
        </div>
      </div>
    </div>
  );
}

export default ChoiceScreen;
