import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import type { SceneData } from '../types';

interface Props {
  scene: SceneData;
  config: {
    eyebrow: string;
    header: string;
    sketchImage: string;
    finalImage: string;
    sketchAlt: string;
    finalAlt: string;
    keywords: readonly string[];
    beforeDescription: string;
    afterDescription: string;
    idleButtonLabel: string;
    statusLabel: string;
  };
  onGenerate: () => void;
}

function VisualEvolutionExperience({ scene, config, onGenerate }: Props) {
  const [phase, setPhase] = useState<'idle' | 'enhancing' | 'complete'>('idle');
  const frameRef = useRef<HTMLDivElement>(null);
  const finalImageRef = useRef<HTMLImageElement>(null);
  const keywordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const generateRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!frameRef.current) return;
    gsap.fromTo(
      frameRef.current,
      { opacity: 0, y: 28, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' },
    );
  }, []);

  const handleEnhance = () => {
    if (phase !== 'idle') return;
    setPhase('enhancing');

    const timeline = gsap.timeline({
      onComplete: () => setPhase('complete'),
    });

    timeline
      .to(keywordRefs.current, {
        opacity: 1,
        y: 0,
        color: '#5eead4',
        borderColor: 'rgba(94,234,212,0.58)',
        boxShadow: '0 0 24px rgba(94,234,212,0.18)',
        stagger: 0.12,
        duration: 0.28,
        ease: 'power2.out',
      })
      .to('.visual-evolution__scan', {
        yPercent: 118,
        opacity: 1,
        duration: 1.1,
        ease: 'power2.inOut',
      }, '-=0.08')
      .to(finalImageRef.current, {
        opacity: 1,
        scale: 1,
        filter: 'saturate(1.08) contrast(1.04) brightness(1)',
        duration: 1.1,
        ease: 'power3.out',
      }, '-=0.62')
      .to('.visual-evolution__sketch', {
        opacity: 0.18,
        filter: 'grayscale(1) contrast(0.9) brightness(0.62)',
        duration: 0.8,
        ease: 'power2.out',
      }, '<')
      .to('.visual-evolution__scan', {
        opacity: 0,
        duration: 0.22,
      }, '-=0.18')
      .fromTo(generateRef.current,
        { opacity: 0, y: 18, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.5)' },
        '-=0.15',
      );
  };

  return (
    <div className="flex h-full w-full max-w-5xl flex-col items-center justify-center gap-3 px-4 pt-14 pb-9 md:gap-4 md:pt-8 md:pb-0">
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="font-orbitron text-[10px] uppercase tracking-[0.34em] text-[var(--text-secondary)]">
          {config.eyebrow}
        </p>
        <h2 className="text-2xl font-bold text-[var(--color-cyan)] md:text-3xl">{scene.title}</h2>
        <p className="max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">{scene.subtitle}</p>
      </div>

      <div
        ref={frameRef}
        className="visual-evolution relative w-full overflow-hidden rounded-[22px] border border-[rgba(94,234,212,0.16)] bg-[rgba(2,7,7,0.72)] opacity-0 shadow-[0_0_70px_rgba(94,234,212,0.08)]"
      >
        <div className="grid max-h-[660px] min-h-[0] grid-cols-1 md:min-h-[620px] md:grid-cols-[minmax(0,1fr)_300px]">
          <div className="relative h-[390px] overflow-hidden sm:h-[460px] md:h-auto md:min-h-0">
            <img
              src={config.sketchImage}
              alt={config.sketchAlt}
              className="visual-evolution__sketch absolute inset-0 h-full w-full object-cover"
            />
            <img
              ref={finalImageRef}
              src={config.finalImage}
              alt={config.finalAlt}
              className="absolute inset-0 h-full w-full scale-[1.03] object-cover opacity-0"
              style={{ filter: 'saturate(0.82) contrast(0.94) brightness(0.78)' }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.76))]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_28%,transparent,rgba(0,0,0,0.36)_62%,rgba(0,0,0,0.72))]" />
            <div className="visual-evolution__scan absolute -top-1/4 left-0 right-0 h-1/3 opacity-0" />

            <div className="absolute bottom-12 left-5 right-5 flex flex-wrap gap-2 md:bottom-14">
              {config.keywords.map((keyword, index) => (
                <span
                  key={keyword}
                  ref={(node) => { keywordRefs.current[index] = node; }}
                  className="translate-y-2 rounded-full border border-[rgba(248,244,238,0.18)] bg-[rgba(1,7,7,0.62)] px-3 py-1.5 text-xs text-[rgba(248,244,238,0.66)] opacity-70 backdrop-blur-md"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <aside className="relative flex flex-col justify-between gap-3 border-t border-[rgba(94,234,212,0.12)] bg-[rgba(2,8,8,0.82)] p-4 md:gap-5 md:border-l md:border-t-0 md:p-5">
            <div className="grid grid-cols-2 gap-3 md:block md:space-y-4">
              <div>
                <p className="font-orbitron text-[10px] uppercase tracking-[0.28em] text-[rgba(248,244,238,0.42)]">
                  before
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[rgba(248,244,238,0.72)] md:text-sm">
                  {config.beforeDescription}
                </p>
              </div>

              <div className="hidden h-px bg-[linear-gradient(90deg,var(--color-cyan),transparent)] opacity-45 md:block" />

              <div>
                <p className="font-orbitron text-[10px] uppercase tracking-[0.28em] text-[var(--color-orange)]">
                  after
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-cyan)] md:text-sm">
                  {config.afterDescription}
                </p>
              </div>
            </div>

            <div className="space-y-2 md:space-y-3">
              {phase === 'idle' && (
                <button className="btn-primary w-full" onClick={handleEnhance}>
                  {config.idleButtonLabel}
                </button>
              )}
              {phase === 'enhancing' && (
                <div className="rounded-xl border border-[rgba(94,234,212,0.16)] bg-[rgba(94,234,212,0.06)] px-4 py-3 text-center">
                  <p className="font-orbitron text-[10px] uppercase tracking-[0.28em] text-[var(--color-cyan)]">
                    {config.statusLabel}
                  </p>
                </div>
              )}
              <button
                ref={generateRef}
                className="btn-primary w-full opacity-0"
                onClick={onGenerate}
                disabled={phase !== 'complete'}
              >
                生成我的 AI 新物种
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default VisualEvolutionExperience;
