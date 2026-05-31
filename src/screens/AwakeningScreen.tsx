import { useApp } from '../context/AppContext';
import StatsBar from '../components/StatsBar';
import ScreenDecor from '../components/ScreenDecor';
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

function AwakeningScreen() {
  const { state, setScreen } = useApp();
  const [show, setShow] = useState(false);
  const [countedScore, setCountedScore] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const result = state.userData.result;

  const avgScore = result
    ? Math.round((result.stats.understanding + result.stats.creativity + result.stats.efficiency) / 3)
    : 0;

  // Reveal animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
      // Card entrance
      if (cardRef.current) {
        gsap.fromTo(cardRef.current,
          { opacity: 0, y: 40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
        );
      }
      // Title flash
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, letterSpacing: '0.5em' },
          { opacity: 1, letterSpacing: '0.2em', duration: 1, delay: 0.3, ease: 'power2.out' },
        );
      }
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // CountUp animation
  useEffect(() => {
    if (!show) return;
    let rafId = 0;
    const duration = 2000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCountedScore(Math.round(avgScore * eased));
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };
    // Delay countup to sync with card reveal
    const timer = setTimeout(() => { rafId = requestAnimationFrame(animate); }, 600);
    return () => { clearTimeout(timer); cancelAnimationFrame(rafId); };
  }, [show, avgScore]);

  // Redirect if no result
  useEffect(() => {
    if (!result) setScreen('input');
  }, [result, setScreen]);

  if (!result) return null;

  return (
    <div className="screen-container">
      <ScreenDecor />
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(94,234,212,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Top header */}
      <div className="absolute top-6 left-0 right-0 flex flex-col items-center gap-1 z-10">
        <p className="font-orbitron text-[10px] tracking-[0.5em] text-[var(--color-cyan)] opacity-40">
          QWEN OS
        </p>
        <p className="font-orbitron text-[8px] tracking-[0.3em] text-[var(--text-secondary)] opacity-30">
          SPECIES AWAKENING
        </p>
      </div>

      <div
        ref={cardRef}
        className="glass-card p-8 max-w-sm w-full flex flex-col items-center gap-5 opacity-0 relative overflow-hidden"
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--color-cyan), transparent)',
          }}
        />

        <h3
          ref={titleRef}
          className="font-orbitron text-sm tracking-[0.2em] text-[var(--text-secondary)] opacity-0"
        >
          YOUR AI SPECIES
        </h3>

        <h2 className="text-2xl md:text-3xl font-bold text-center">{result.name}</h2>
        <p className="text-sm text-[var(--color-cyan)] text-center">{result.slogan}</p>

        {/* Divider */}
        <div className="w-16 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--color-cyan), transparent)' }} />

        {/* Score display */}
        <div ref={scoreRef} className="w-full text-center py-2">
          <p className="text-xs text-[var(--text-secondary)] mb-2 tracking-wider">AI 进化指数</p>
          <p
            className="text-5xl md:text-6xl font-bold"
            style={{
              background: 'linear-gradient(135deg, var(--color-cyan), var(--color-orange))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
            }}
          >
            {countedScore}
          </p>
        </div>

        {/* Stats */}
        <div className="w-full flex flex-col gap-3">
          <StatsBar label="理解力" value={result.stats.understanding} />
          <StatsBar label="创造力" value={result.stats.creativity} color="var(--color-green)" />
          <StatsBar label="效率" value={result.stats.efficiency} color="var(--color-orange)" />
        </div>

        {/* Divider */}
        <div className="w-16 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--color-orange), transparent)' }} />

        <p className="text-sm text-[var(--text-secondary)] text-center leading-relaxed">
          {result.qwenRole}
        </p>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--color-orange), transparent)',
          }}
        />
      </div>

      {/* CTA button */}
      {show && (
        <button
          className="btn-primary mt-6"
          style={{ animationDelay: '1.5s' }}
          onClick={() => setScreen('share')}
        >
          生成分享海报
        </button>
      )}

      {/* Bottom status */}
      <div className="screen-status absolute bottom-6 left-0 right-0 flex flex-col items-center gap-1 z-10">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-[var(--color-orange)] opacity-60" />
          <p className="font-orbitron text-[8px] tracking-[0.3em] text-[var(--color-orange)] opacity-30">
            EVOLUTION COMPLETE
          </p>
          <div className="w-1 h-1 rounded-full bg-[var(--color-orange)] opacity-60" />
        </div>
      </div>
    </div>
  );
}

export default AwakeningScreen;
