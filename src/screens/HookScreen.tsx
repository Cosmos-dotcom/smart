import { useApp } from '../context/AppContext';
import { usePerformance } from '../context/PerformanceContext';
import Hero3DModel from '../components/Hero3DModel';
import GlowSphere from '../components/GlowSphere';
import ScreenDecor from '../components/ScreenDecor';
import BrandLockup from '../components/BrandLockup';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

function HookScreen() {
  const { setScreen } = useApp();
  const performance = usePerformance();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo('#hook-brand', { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .fromTo('#hook-subtitle', { opacity: 0, y: 20, letterSpacing: '0.5em' },
        { opacity: 1, y: 0, letterSpacing: '0.3em', duration: 0.8, ease: 'power2.out' }, '-=0.3')
      .fromTo('#hook-title', { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }, '-=0.4')
      .fromTo('#hook-desc', { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5')
      .fromTo('#hook-cta', { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.7)' }, '-=0.3');

    // Button pulse glow loop
    gsap.to('#hook-cta', {
      boxShadow: '0 0 30px rgba(94,234,212,0.4), 0 0 60px rgba(94,234,212,0.15)',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 2.5,
    });
  }, { scope: containerRef });

  return (
    <div className="screen-container" ref={containerRef}>
      <ScreenDecor />
      {/* Top brand */}
      <div id="hook-brand" className="absolute top-8 opacity-0">
        <BrandLockup />
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        {performance === 'full' ? <Hero3DModel /> : <GlowSphere />}
      </div>

      <div className="flex flex-col items-center gap-6 pb-16">
        <p id="hook-subtitle" className="font-orbitron text-sm tracking-[0.3em] text-[var(--text-secondary)] uppercase opacity-0">
          Interactive Experience
        </p>
        <h1 id="hook-title" className="text-3xl md:text-5xl font-bold text-center leading-tight opacity-0">
          千问，启动 AI 时代的新物种
        </h1>
        <p id="hook-desc" className="text-[var(--text-secondary)] text-base md:text-lg text-center max-w-md opacity-0">
          选择一个场景，看看它如何被千问大模型重新进化。
        </p>
        <button id="hook-cta" className="btn-primary mt-4 opacity-0" onClick={() => setScreen('input')}>
          开始唤醒
        </button>
      </div>
    </div>
  );
}

export default HookScreen;
