import { useApp } from '../context/AppContext';
import PosterPreview from '../components/PosterPreview';
import ScreenDecor from '../components/ScreenDecor';
import { generatePoster, downloadPoster } from '../utils/poster';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

function ShareScreen() {
  const { state, setScreen, reset } = useApp();
  const [generating, setGenerating] = useState(false);
  const result = state.userData.result;
  const sceneId = state.userData.scene?.id;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const tween = gsap.fromTo(containerRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' },
    );
    return () => { tween.kill(); };
  }, []);

  // Redirect if no result
  useEffect(() => {
    if (!result) setScreen('input');
  }, [result, setScreen]);

  if (!result) return null;

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const dataUrl = await generatePoster('poster-card');
      downloadPoster(dataUrl);
    } catch (err) {
      console.error('海报生成失败:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleRestart = () => {
    reset();
    setScreen('input');
  };

  return (
    <div className="screen-container">
      <ScreenDecor />

      {/* Top header */}
      <div className="absolute top-6 left-0 right-0 flex flex-col items-center gap-1 z-10">
        <p className="font-orbitron text-[10px] tracking-[0.5em] text-[var(--color-cyan)] opacity-40">
          QWEN OS
        </p>
        <p className="font-orbitron text-[8px] tracking-[0.3em] text-[var(--text-secondary)] opacity-30">
          SHARE YOUR CREATION
        </p>
      </div>

      <div ref={containerRef} className="flex w-full max-w-[430px] flex-col items-center gap-5 px-4">
        <div className="text-center">
          <p className="font-orbitron text-xs tracking-[0.3em] text-[var(--text-secondary)] uppercase mb-2">
            POSTER PREVIEW
          </p>
          <h2 className="text-xl font-bold">你的 AI 新物种海报</h2>
        </div>

        {/* Poster preview with glow frame */}
        <div className="relative mx-auto h-[520px] w-[292px] overflow-hidden rounded-2xl border border-[rgba(94,234,212,0.22)] shadow-[0_0_42px_rgba(94,234,212,0.14),0_18px_80px_rgba(0,0,0,0.45)] sm:h-[600px] sm:w-[337px]">
          <div
            style={{
              width: 375,
              height: 667,
              transform: 'scale(var(--poster-preview-scale))',
              transformOrigin: 'top left',
            }}
            className="[--poster-preview-scale:0.78] sm:[--poster-preview-scale:0.9]"
          >
            <PosterPreview result={result} sceneId={sceneId} />
          </div>
        </div>

        {/* Buttons */}
        <button
          className="btn-primary w-full"
          onClick={handleDownload}
          disabled={generating}
        >
          {generating ? '生成中...' : '下载海报'}
        </button>

        <button
          className="w-full py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          onClick={handleRestart}
        >
          重新选择
        </button>
      </div>

      {/* Bottom status */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-1 z-10">
        <p className="font-orbitron text-[7px] tracking-[0.2em] text-[var(--text-secondary)] opacity-25">
          POWERED BY QWEN NEURAL ENGINE
        </p>
      </div>
    </div>
  );
}

export default ShareScreen;
