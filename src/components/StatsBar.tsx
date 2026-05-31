interface Props {
  label: string;
  value: number;
  color?: string;
}

function StatsBar({ label, value, color = 'var(--color-cyan)' }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-sm text-[var(--text-secondary)] w-16 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-[rgba(94,234,212,0.1)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${clamped}%`, background: color }}
        />
      </div>
      <span className="text-sm font-bold w-8 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

export default StatsBar;
