import type { SceneData } from '../types';

interface Props {
  scene: SceneData;
  onClick: (e: React.MouseEvent) => void;
}

function SceneCard({ scene, onClick }: Props) {
  return (
    <button
      className="w-full min-h-[176px] p-5 md:p-6 flex flex-col items-center justify-center gap-3 cursor-pointer
                 rounded-xl relative overflow-hidden group transition-all duration-300
                 hover:-translate-y-1 active:scale-95"
      style={{
        background: 'linear-gradient(135deg, rgba(9,20,18,0.94) 0%, rgba(18,25,21,0.9) 54%, rgba(23,16,10,0.88) 100%)',
        border: '1px solid rgba(94,234,212,0.18)',
        boxShadow: '0 18px 60px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
      onClick={onClick}
    >
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(94,234,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,106,0,0.035) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(ellipse at center, black 18%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 18%, transparent 78%)',
        }}
      />

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 opacity-45 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(94,234,212,0.13) 0%, transparent 68%)',
        }}
      />

      {/* Top accent line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-cyan), transparent)' }}
      />

      <span className="text-3xl md:text-4xl relative z-10 drop-shadow-[0_0_18px_rgba(94,234,212,0.22)]">{scene.icon}</span>
      <h3 className="text-base md:text-lg font-bold text-[var(--text-primary)] relative z-10">{scene.title}</h3>
      <p className="text-xs md:text-sm text-[var(--text-secondary)] text-center leading-relaxed relative z-10 max-w-[13rem]">
        {scene.subtitle}
      </p>
    </button>
  );
}

export default SceneCard;
