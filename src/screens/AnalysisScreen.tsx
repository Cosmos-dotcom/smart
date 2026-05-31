import { useApp } from '../context/AppContext';
import ScreenDecor from '../components/ScreenDecor';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const analysisTexts = [
  '千问正在理解你的选择...',
  '正在连接行业知识与场景需求...',
  '正在生成 AI 操作系统能力映射...',
  '进化方案已完成。',
];

function AnalysisScreen() {
  const { state, setScreen } = useApp();
  const [textIndex, setTextIndex] = useState(0);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Text transitions
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    analysisTexts.forEach((_, i) => {
      if (i > 0) {
        timers.push(setTimeout(() => {
          setTextIndex(i);
          // Flash text animation
          if (textRef.current) {
            gsap.fromTo(textRef.current,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
            );
          }
        }, i * 1500));
      }
    });

    timers.push(setTimeout(() => {
      if (state.userData.scene) {
        setScreen('choice');
      }
    }, analysisTexts.length * 1500));

    return () => timers.forEach(clearTimeout);
  }, [setScreen, state.userData.scene]);

  // Pulsing ring animation
  useEffect(() => {
    if (!ringRef.current) return;
    const rings = ringRef.current.querySelectorAll('.pulse-ring');
    const tweens: gsap.core.Tween[] = [];
    rings.forEach((ring, i) => {
      tweens.push(gsap.fromTo(ring,
        { scale: 0.5, opacity: 0.6 },
        {
          scale: 2.5,
          opacity: 0,
          duration: 2,
          repeat: -1,
          delay: i * 0.6,
          ease: 'power1.out',
        },
      ));
    });
    return () => tweens.forEach(tw => tw.kill());
  }, []);

  const progress = ((textIndex + 1) / analysisTexts.length) * 100;

  return (
    <div className="screen-container">
      <ScreenDecor />

      {/* Top header */}
      <div className="absolute top-6 left-0 right-0 flex flex-col items-center gap-1 z-10">
        <p className="font-orbitron text-[10px] tracking-[0.5em] text-[var(--color-cyan)] opacity-40">
          QWEN OS
        </p>
        <p className="font-orbitron text-[8px] tracking-[0.3em] text-[var(--text-secondary)] opacity-30">
          NEURAL ANALYSIS
        </p>
      </div>

      {/* Pulsing rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div ref={ringRef} className="relative">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="pulse-ring absolute inset-0 rounded-full border border-[var(--color-cyan)]"
              style={{
                width: 120,
                height: 120,
                marginLeft: -60,
                marginTop: -60,
                left: '50%',
                top: '50%',
              }}
            />
          ))}
          {/* Center orb */}
          <div
            className="w-24 h-24 rounded-full relative"
            style={{
              background: 'radial-gradient(circle, rgba(94,234,212,0.4) 0%, rgba(94,234,212,0.1) 50%, transparent 70%)',
              boxShadow: '0 0 60px rgba(94,234,212,0.3), 0 0 120px rgba(94,234,212,0.1)',
            }}
          >
            <div
              className="absolute inset-3 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(94,234,212,0.8) 0%, rgba(94,234,212,0.3) 100%)',
                animation: 'pulse-glow 1.5s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>

      {/* Text content */}
      <div className="flex flex-col items-center gap-8 z-10">
        <p
          ref={textRef}
          className="text-lg md:text-xl text-[var(--color-cyan)] text-center font-medium"
          style={{ textShadow: '0 0 20px rgba(94,234,212,0.3)' }}
        >
          {analysisTexts[textIndex]}
        </p>

        {/* Progress bar */}
        <div className="w-56 flex flex-col items-center gap-2">
          <div className="w-full h-1.5 bg-[rgba(94,234,212,0.15)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--color-cyan), var(--color-orange))',
                boxShadow: '0 0 10px rgba(94,234,212,0.5)',
              }}
            />
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-orbitron">
            {Math.round(progress)}%
          </p>
        </div>
      </div>

      {/* Bottom status */}
      <div className="screen-status absolute bottom-6 left-0 right-0 flex flex-col items-center gap-1 z-10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-cyan)] animate-pulse" />
          <p className="font-orbitron text-[8px] tracking-[0.3em] text-[var(--color-cyan)] opacity-40">
            ANALYZING
          </p>
        </div>
        <p className="font-orbitron text-[7px] tracking-[0.2em] text-[var(--text-secondary)] opacity-25">
          QWEN NEURAL ENGINE v2.0
        </p>
      </div>
    </div>
  );
}

export default AnalysisScreen;
