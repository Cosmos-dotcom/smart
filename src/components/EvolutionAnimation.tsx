import { useRef, useEffect, useCallback } from 'react';
import { wrapText } from '../utils/textWrap';

interface Props {
  beforeText: string;
  afterText: string;
  width: number;
  height: number;
  onComplete: () => void;
}

interface EnergyNode {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  offset: number;
  lane: number;
}

const CYAN = '#5eead4';
const ORANGE = '#ff6a00';
const GREEN = '#9ef86f';
const INK = '#07100e';
const TOTAL = 7.2;

function createNodes(count: number): EnergyNode[] {
  return Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2,
    radius: 0.22 + (i % 7) * 0.055,
    speed: 0.35 + (i % 5) * 0.075,
    size: 1.2 + (i % 4) * 0.45,
    offset: (i * 0.618) % 1,
    lane: i % 3,
  }));
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function phaseAlpha(elapsed: number, start: number, end: number) {
  return clamp01((elapsed - start) / (end - start));
}

function drawPanel(ctx: CanvasRenderingContext2D, width: number, height: number, elapsed: number) {
  const pad = Math.max(12, width * 0.04);
  const panelX = pad;
  const panelY = pad * 0.7;
  const panelW = width - pad * 2;
  const panelH = height - pad * 1.4;

  const pulse = 0.5 + Math.sin(elapsed * 2.2) * 0.5;
  const bg = ctx.createLinearGradient(panelX, panelY, panelX + panelW, panelY + panelH);
  bg.addColorStop(0, 'rgba(5, 12, 10, 0.88)');
  bg.addColorStop(0.52, 'rgba(7, 16, 14, 0.72)');
  bg.addColorStop(1, 'rgba(18, 14, 9, 0.7)');

  roundedRect(ctx, panelX, panelY, panelW, panelH, 18);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.strokeStyle = `rgba(94, 234, 212, ${0.16 + pulse * 0.06})`;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  roundedRect(ctx, panelX, panelY, panelW, panelH, 18);
  ctx.clip();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = 'rgba(94, 234, 212, 0.18)';
  ctx.lineWidth = 1;
  for (let x = panelX + 20; x < panelX + panelW; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, panelY);
    ctx.lineTo(x - panelH * 0.22, panelY + panelH);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawTextBlock(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  width: number,
  height: number,
  fontSize: number,
  color: string,
  alpha: number,
  label: string,
) {
  if (alpha <= 0) return;

  const lineHeight = fontSize * 1.38;
  const blockHeight = Math.max(lineHeight, lines.length * lineHeight);
  const startY = height / 2 - blockHeight / 2 + lineHeight / 2;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = '600 10px "Orbitron", sans-serif';
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha * 0.6;
  ctx.fillText(label, width / 2, height * 0.22);

  ctx.globalAlpha = alpha;
  ctx.font = `700 ${fontSize}px "Noto Sans SC", sans-serif`;
  ctx.shadowColor = color;
  ctx.shadowBlur = 14;
  ctx.fillStyle = '#f8f4ee';
  lines.forEach((line, index) => {
    const y = startY + index * lineHeight;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.strokeText(line, width / 2, y);
    ctx.fillText(line, width / 2, y);
  });
  ctx.shadowBlur = 0;

  const underlineW = Math.min(width * 0.52, 190);
  const underlineY = startY + blockHeight / 2 + 18;
  const gradient = ctx.createLinearGradient(width / 2 - underlineW / 2, underlineY, width / 2 + underlineW / 2, underlineY);
  gradient.addColorStop(0, 'transparent');
  gradient.addColorStop(0.5, color);
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.globalAlpha = alpha * 0.78;
  ctx.fillRect(width / 2 - underlineW / 2, underlineY, underlineW, 1.5);
  ctx.restore();
}

function drawEnergyNodes(
  ctx: CanvasRenderingContext2D,
  nodes: EnergyNode[],
  width: number,
  height: number,
  elapsed: number,
  progress: number,
) {
  const cx = width / 2;
  const cy = height / 2;
  const base = Math.min(width, height);
  const transition = phaseAlpha(elapsed, 2.6, 4.6);

  for (const node of nodes) {
    const angle = node.angle + elapsed * node.speed + transition * Math.PI * 0.85;
    const orbitRadius = base * (node.radius + Math.sin(elapsed * 1.4 + node.offset * 8) * 0.018);
    const wave = Math.sin(elapsed * 2 + node.offset * 9);
    const x = cx + Math.cos(angle) * orbitRadius * (1.08 + node.lane * 0.08);
    const y = cy + Math.sin(angle * 1.18) * orbitRadius * 0.52 + wave * 3;
    const color = transition > node.offset ? ORANGE : node.lane === 1 ? GREEN : CYAN;
    const alpha = 0.28 + Math.sin(elapsed * 4 + node.offset * 10) * 0.18;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(x, y, node.size + progress * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawScan(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  elapsed: number,
) {
  const scanProgress = phaseAlpha(elapsed, 1.6, 5.2);
  if (scanProgress <= 0 || scanProgress >= 1) return;

  const x = width * (0.12 + 0.76 * easeInOutCubic(scanProgress));
  const beam = ctx.createLinearGradient(x - 28, 0, x + 28, 0);
  beam.addColorStop(0, 'transparent');
  beam.addColorStop(0.48, 'rgba(158, 248, 111, 0.32)');
  beam.addColorStop(0.5, 'rgba(255, 255, 255, 0.75)');
  beam.addColorStop(0.52, 'rgba(255, 106, 0, 0.32)');
  beam.addColorStop(1, 'transparent');

  ctx.save();
  ctx.fillStyle = beam;
  ctx.fillRect(x - 28, height * 0.12, 56, height * 0.76);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, height * 0.16);
  ctx.lineTo(x, height * 0.84);
  ctx.stroke();
  ctx.restore();
}

function drawArcs(ctx: CanvasRenderingContext2D, width: number, height: number, elapsed: number) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.38;
  const spin = elapsed * 0.55;

  ctx.save();
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    const start = spin + i * 2.1;
    const end = start + 0.85 + Math.sin(elapsed + i) * 0.15;
    ctx.strokeStyle = i === 2 ? 'rgba(255, 106, 0, 0.42)' : 'rgba(94, 234, 212, 0.34)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius + i * 17, radius * (0.42 + i * 0.04), 0, start, end);
    ctx.stroke();
  }
  ctx.restore();
}

function EvolutionAnimation({ beforeText, afterText, width, height, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<EnergyNode[]>(createNodes(76));
  const completedRef = useRef(false);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const fontSize = Math.min(width * 0.115, 34);
    ctx.font = `700 ${fontSize}px "Noto Sans SC", sans-serif`;
    const maxTextWidth = width * 0.76;
    const beforeLines = wrapText(ctx, beforeText, maxTextWidth);
    const afterLines = wrapText(ctx, afterText, maxTextWidth);

    let startTime = 0;

    const frame = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const progress = clamp01(elapsed / TOTAL);

      ctx.clearRect(0, 0, width, height);
      drawPanel(ctx, width, height, elapsed);
      drawArcs(ctx, width, height, elapsed);
      drawEnergyNodes(ctx, nodesRef.current, width, height, elapsed, progress);
      drawScan(ctx, width, height, elapsed);

      const beforeFadeOut = 1 - easeInOutCubic(phaseAlpha(elapsed, 2.2, 3.35));
      const afterFadeIn = easeOutCubic(phaseAlpha(elapsed, 3.65, 5.0));
      drawTextBlock(ctx, beforeLines, width, height, fontSize, CYAN, beforeFadeOut, 'CURRENT STATE');
      drawTextBlock(ctx, afterLines, width, height, fontSize, ORANGE, afterFadeIn, 'QWEN EVOLVED STATE');

      ctx.save();
      ctx.font = '500 9px "Orbitron", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(174, 184, 176, 0.58)';
      ctx.fillText(`EVOLUTION ${Math.round(progress * 100).toString().padStart(2, '0')}%`, width / 2, height - 18);
      ctx.restore();

      if (progress < 1) {
        animRef.current = requestAnimationFrame(frame);
      } else if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    };

    completedRef.current = false;
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(frame);
  }, [beforeText, afterText, width, height, onComplete]);

  useEffect(() => {
    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className="block"
      aria-label="QWEN evolution animation"
      role="img"
    />
  );
}

export default EvolutionAnimation;
