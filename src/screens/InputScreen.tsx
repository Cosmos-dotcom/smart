import { useApp } from '../context/AppContext';
import { scenes } from '../data/scenes';
import SceneCard from '../components/SceneCard';
import ScreenDecor from '../components/ScreenDecor';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import type { SceneData } from '../types';

function InputScreen() {
  const { selectScene, setScreen } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('#input-title',
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
    );
    gsap.fromTo('#input-subtitle',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.2 },
    );
    gsap.fromTo('.scene-card', { opacity: 0, y: 30, scale: 0.9 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, delay: 0.4, ease: 'back.out(1.4)',
    });
  }, { scope: containerRef });

  const handleSelect = (scene: SceneData, e: React.MouseEvent) => {
    selectScene(scene);
    // Animate clicked card: scale up → fade out → transition
    const card = (e.currentTarget as HTMLElement).closest('.scene-card');
    if (card) {
      gsap.to(card, {
        scale: 1.1,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => setScreen('analysis'),
      });
    } else {
      setScreen('analysis');
    }
  };

  return (
    <div className="screen-container" ref={containerRef}>
      <ScreenDecor />

      {/* Top brand */}
      <div className="absolute top-6 left-0 right-0 flex flex-col items-center gap-1 z-10">
        <p className="font-orbitron text-[10px] tracking-[0.5em] text-[var(--color-cyan)] opacity-40">
          QWEN OS
        </p>
      </div>

      <p id="input-subtitle" className="font-orbitron text-xs tracking-[0.3em] text-[var(--text-secondary)] uppercase mb-3 opacity-0">
        SELECT YOUR SCENE
      </p>
      <h2 id="input-title" className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-10 opacity-0"
        style={{ textShadow: '0 0 30px rgba(94,234,212,0.15)' }}
      >
        你想让千问唤醒哪一种未来？
      </h2>

      <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-lg w-full">
        {scenes.map((scene) => (
          <div key={scene.id} className="scene-card">
            <SceneCard scene={scene} onClick={(e) => handleSelect(scene, e)} />
          </div>
        ))}
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-1 z-10">
        <p className="font-orbitron text-[7px] tracking-[0.2em] text-[var(--text-secondary)] opacity-25">
          SELECT A SCENE TO BEGIN EVOLUTION
        </p>
      </div>
    </div>
  );
}

export default InputScreen;
