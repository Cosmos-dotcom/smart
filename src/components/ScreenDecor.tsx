function ScreenDecor() {
  const dataTicks = ['QWEN', 'AGENT', 'VECTOR', 'MODEL', 'TOKEN', 'LATENT'];
  const lanes = [12, 24, 38, 54, 69, 82];

  return (
    <div className="screen-decor absolute inset-0 pointer-events-none overflow-hidden">
      <div className="decor-depth-map" />
      <div className="decor-scan-field" />
      <div className="decor-chromatic-sweep" />
      <div className="decor-circuit decor-circuit-left" />
      <div className="decor-circuit decor-circuit-right" />

      {lanes.map((top, index) => (
        <div
          key={top}
          className="decor-data-lane"
          style={{
            top: `${top}%`,
            animationDelay: `${index * -1.4}s`,
            opacity: index % 2 === 0 ? 0.36 : 0.22,
          }}
        >
          <span>{dataTicks[index]}</span>
          <span>{dataTicks[(index + 2) % dataTicks.length]}</span>
          <span>{dataTicks[(index + 4) % dataTicks.length]}</span>
        </div>
      ))}

      <svg className="decor-orbit decor-orbit-a" viewBox="0 0 360 220" aria-hidden="true">
        <path d="M26 120 C92 16 236 16 326 108" />
        <path d="M42 152 C120 215 262 196 338 80" />
      </svg>
      <svg className="decor-orbit decor-orbit-b" viewBox="0 0 360 220" aria-hidden="true">
        <path d="M18 84 C112 156 232 154 342 56" />
        <path d="M52 182 C116 78 252 34 330 112" />
      </svg>

      {/* Corner accent lines */}
      <svg className="absolute top-6 left-6 w-10 h-10 text-[var(--color-cyan)] opacity-25" viewBox="0 0 40 40">
        <path d="M0 16 L0 0 L16 0" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
      <svg className="absolute top-6 right-6 w-10 h-10 text-[var(--color-cyan)] opacity-25" viewBox="0 0 40 40">
        <path d="M24 0 L40 0 L40 16" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
      <svg className="absolute bottom-6 left-6 w-10 h-10 text-[var(--color-orange)] opacity-20" viewBox="0 0 40 40">
        <path d="M0 24 L0 40 L16 40" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
      <svg className="absolute bottom-6 right-6 w-10 h-10 text-[var(--color-orange)] opacity-20" viewBox="0 0 40 40">
        <path d="M24 40 L40 40 L40 24" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      </svg>

      {/* Horizontal scan lines */}
      <div className="absolute left-0 right-0 top-1/3 h-px opacity-[0.04]"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-cyan), transparent)' }} />
      <div className="absolute left-0 right-0 top-2/3 h-px opacity-[0.03]"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-orange), transparent)' }} />

      {/* Vertical accent lines */}
      <div className="absolute top-0 bottom-0 left-[15%] w-px opacity-[0.03]"
        style={{ background: 'linear-gradient(180deg, transparent, var(--color-cyan), transparent)' }} />
      <div className="absolute top-0 bottom-0 right-[15%] w-px opacity-[0.03]"
        style={{ background: 'linear-gradient(180deg, transparent, var(--color-orange), transparent)' }} />

      {/* Side accent dots */}
      <div className="absolute left-4 top-1/4 w-1.5 h-1.5 rounded-full bg-[var(--color-cyan)] opacity-30" />
      <div className="absolute left-4 top-1/2 w-1 h-1 rounded-full bg-[var(--color-cyan)] opacity-20" />
      <div className="absolute left-4 top-3/4 w-1.5 h-1.5 rounded-full bg-[var(--color-cyan)] opacity-25" />
      <div className="absolute right-4 top-1/4 w-1.5 h-1.5 rounded-full bg-[var(--color-orange)] opacity-25" />
      <div className="absolute right-4 top-1/2 w-1 h-1 rounded-full bg-[var(--color-orange)] opacity-20" />
      <div className="absolute right-4 top-3/4 w-1.5 h-1.5 rounded-full bg-[var(--color-orange)] opacity-30" />

      {/* Top decorative text */}
      <p className="absolute top-5 left-1/2 -translate-x-1/2 font-orbitron text-[9px] tracking-[0.5em] text-[var(--color-cyan)] opacity-[0.08]">
        QWEN OPERATING SYSTEM
      </p>

      {/* Bottom decorative text */}
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-orbitron text-[9px] tracking-[0.5em] text-[var(--color-orange)] opacity-[0.06]">
        AI SPECIES EVOLUTION
      </p>

      {/* Corner data decoration - top left */}
      <div className="absolute top-16 left-6 font-orbitron text-[8px] text-[var(--color-cyan)] opacity-[0.1] leading-relaxed">
        <p>SYS:ACTIVE</p>
        <p>VER:2.0</p>
      </div>

      {/* Corner data decoration - bottom right */}
      <div className="absolute bottom-16 right-6 font-orbitron text-[8px] text-[var(--color-orange)] opacity-[0.1] leading-relaxed text-right">
        <p>STATUS:OK</p>
        <p>AI:READY</p>
      </div>
    </div>
  );
}

export default ScreenDecor;
