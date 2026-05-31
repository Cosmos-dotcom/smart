import type { ResultData } from '../types';
import { assetPath } from '../utils/assetPath';

const posterBackgrounds: Record<string, string> = {
  car: assetPath('assets/posters/car-route-final.png'),
  software: assetPath('assets/posters/poster-software.png'),
  hardware: assetPath('assets/posters/hardware-devices-final.png'),
  creator: assetPath('assets/posters/creator-final-city.png'),
};

const fallbackPosterBackground = posterBackgrounds.car;

interface Props {
  result: ResultData;
  sceneId?: string;
}

function PosterPreview({ result, sceneId }: Props) {
  const avgScore = Math.round(
    (result.stats.understanding + result.stats.creativity + result.stats.efficiency) / 3,
  );
  const posterBackground = sceneId ? posterBackgrounds[sceneId] ?? fallbackPosterBackground : fallbackPosterBackground;

  const stats = [
    { label: '理解力', value: result.stats.understanding, color: '#5eead4' },
    { label: '创造力', value: result.stats.creativity, color: '#9ef86f' },
    { label: '效率', value: result.stats.efficiency, color: '#ff9a44' },
  ];

  return (
    <div id="poster-card" className="relative h-[667px] w-[375px] overflow-hidden bg-[#020403] text-[var(--text-primary)]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${posterBackground})` }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,5,5,0.04)_0%,rgba(1,5,5,0.16)_34%,rgba(1,5,5,0.64)_68%,rgba(1,5,5,0.97)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_28%,transparent_0%,rgba(0,0,0,0.18)_52%,rgba(0,0,0,0.7)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(0,0,0,0.62),transparent)]" />
      <div
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage: 'linear-gradient(rgba(94,234,212,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,106,0,0.035) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage: 'linear-gradient(180deg, transparent 0%, black 18%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 18%, black 85%, transparent 100%)',
        }}
      />

      <div className="absolute left-0 right-0 top-0 h-1 bg-[linear-gradient(90deg,transparent,var(--color-cyan),var(--color-orange),transparent)]" />

      <header className="relative z-10 flex items-start justify-between px-7 pt-7">
        <div>
          <p
            className="font-orbitron text-[22px] tracking-[0.42em] text-[var(--color-cyan)]"
            style={{ textShadow: '0 0 24px rgba(94,234,212,0.48)' }}
          >
            QWEN OS
          </p>
          <p className="mt-2 font-orbitron text-[9px] uppercase tracking-[0.28em] text-[rgba(248,244,238,0.62)]">
            AI Species Report
          </p>
        </div>

        <div className="rounded-full border border-[rgba(255,106,0,0.5)] bg-[rgba(4,8,7,0.76)] px-3 py-2 text-center shadow-[0_0_28px_rgba(255,106,0,0.18)] backdrop-blur-sm">
          <p className="font-orbitron text-2xl font-bold text-[var(--color-orange)]">{avgScore}</p>
          <p className="font-orbitron text-[7px] tracking-[0.16em] text-[rgba(248,244,238,0.52)]">INDEX</p>
        </div>
      </header>

      <main className="absolute inset-x-5 bottom-[86px] z-10">
        <div className="relative overflow-hidden rounded-2xl border border-[rgba(94,234,212,0.24)] bg-[linear-gradient(135deg,rgba(2,9,8,0.82),rgba(5,16,14,0.68))] p-5 shadow-[0_0_52px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.09)] backdrop-blur-md">
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-cyan),transparent)]" />

          <p className="font-orbitron text-[9px] uppercase tracking-[0.28em] text-[rgba(174,184,176,0.72)]">
            awakened species
          </p>
          <h3 className="mt-2 text-[30px] font-bold leading-tight text-white">
            {result.name}
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-cyan)]">
            {result.slogan}
          </p>

          <div className="mt-5 flex flex-col gap-3">
            {stats.map(({ label, value, color }) => (
              <div key={label} className="grid grid-cols-[48px_1fr_34px] items-center gap-3">
                <span className="text-[12px] text-[rgba(248,244,238,0.72)]">{label}</span>
                <div className="h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.1)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${value}%`,
                      background: color,
                      boxShadow: `0 0 14px ${color}`,
                    }}
                  />
                </div>
                <span className="text-right font-orbitron text-[12px] font-bold" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="absolute inset-x-7 bottom-7 z-10 flex items-center justify-between">
        <div className="max-w-[172px]">
          <img
            src={assetPath('assets/brand/aliyun-qwen-logo.png')}
            alt="阿里云 × 千问大模型"
            className="mb-2 w-[152px] rounded-md bg-white px-2 py-1"
          />
          <p className="text-[11px] leading-relaxed text-[rgba(248,244,238,0.68)]">
            千问大模型，让万物进化为智能体
          </p>
          <p className="mt-1 font-orbitron text-[8px] tracking-[0.22em] text-[rgba(94,234,212,0.58)]">
            POWERED BY QWEN OS
          </p>
        </div>

        <div className="grid h-11 w-11 grid-cols-5 grid-rows-5 gap-[2px] rounded-md bg-[rgba(248,244,238,0.9)] p-1">
          {Array.from({ length: 25 }, (_, index) => (
            <span
              key={index}
              className={(index * 7 + index) % 5 === 0 || [0, 1, 5, 6, 18, 19, 23, 24].includes(index)
                ? 'bg-[#07100e]'
                : 'bg-transparent'}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}

export default PosterPreview;
