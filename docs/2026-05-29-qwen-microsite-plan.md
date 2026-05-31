# 千问互动微站实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个 6 幕互动微站，用户选择场景 → 千问大模型将传统工具进化为 AI 新物种 → 生成分享海报。

**Architecture:** 基于 iPhone 3D 模板改造，使用 Provider 模式管理性能检测（full/degraded 两套渲染路径），React Context 管理全局状态（当前屏幕 + 用户数据），6 个屏幕组件通过 ScreenManager 切换。

**Tech Stack:** React 18 + TypeScript + Vite + Three.js (React Three Fiber + drei) + GSAP + tsParticles + html2canvas + Tailwind CSS

**设计文档:** `docs/2026-05-29-qwen-microsite-design.md`

---

## 文件结构总览

```
src/
├── App.tsx                          (重写)
├── main.tsx                         (修改: 移除 Sentry)
├── index.css                        (重写: 新视觉系统)
│
├── context/
│   ├── PerformanceContext.tsx        (新建: 性能检测 Provider)
│   └── AppContext.tsx                (新建: 全局状态 Context)
│
├── types/
│   └── index.ts                     (新建: 类型定义)
│
├── data/
│   └── scenes.ts                    (新建: 4 个场景数据)
│
├── utils/
│   ├── performance.ts               (新建: 性能检测逻辑)
│   ├── poster.ts                    (新建: 海报生成)
│   └── particlesConfig.ts           (新建: 粒子配置)
│
├── components/
│   ├── ScreenManager.tsx            (新建: 屏幕切换管理)
│   ├── ParticleBackground.tsx       (新建: 粒子背景)
│   ├── Hero3DModel.tsx              (新建: 3D 球体 - full 模式)
│   ├── GlowSphere.tsx               (新建: CSS 发光球 - degraded 模式)
│   ├── SceneCard.tsx                (新建: 场景选择卡片)
│   ├── StatsBar.tsx                 (新建: 指标进度条)
│   └── PosterPreview.tsx            (新建: 海报预览)
│
├── screens/
│   ├── HookScreen.tsx               (新建: 首页)
│   ├── InputScreen.tsx              (新建: 场景选择)
│   ├── AnalysisScreen.tsx           (新建: 分析中)
│   ├── ChoiceScreen.tsx             (新建: 进化对比)
│   ├── AwakeningScreen.tsx          (新建: AI 新物种档案)
│   └── ShareScreen.tsx              (新建: 海报生成)
│
└── styles/
    └── tokens.css                   (新建: CSS 变量)

删除的文件:
├── components/Hero.tsx
├── components/Features.tsx
├── components/Highlights.tsx
├── components/HowItWorks.tsx
├── components/IPhone.tsx
├── components/Lights.tsx
├── components/Loader.tsx
├── components/Model.tsx
├── components/ModelView.tsx
├── components/Navbar.tsx
├── components/Footer.tsx
├── components/VideoCarousel.tsx
├── constants/index.ts
├── utils/index.ts
├── utils/animations.ts
```

---

## 阶段 1：项目清理与基础设施

### Task 1: 清理模板内容

**Files:**
- Delete: `src/components/Hero.tsx`, `src/components/Features.tsx`, `src/components/Highlights.tsx`, `src/components/HowItWorks.tsx`, `src/components/IPhone.tsx`, `src/components/Lights.tsx`, `src/components/Loader.tsx`, `src/components/Model.tsx`, `src/components/ModelView.tsx`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/VideoCarousel.tsx`, `src/constants/index.ts`, `src/utils/index.ts`, `src/utils/animations.ts`
- Modify: `src/App.tsx`, `index.html`

- [ ] **Step 1: 删除所有 iPhone 相关组件和工具文件**

```bash
cd "C:/Users/junyang/Desktop/互动开发/iPhone-Showcase-Landing-Page--React-Frontend-main/iPhone-Showcase-Landing-Page--React-Frontend-main"
rm -f src/components/Hero.tsx src/components/Features.tsx src/components/Highlights.tsx src/components/HowItWorks.tsx src/components/IPhone.tsx src/components/Lights.tsx src/components/Loader.tsx src/components/Model.tsx src/components/ModelView.tsx src/components/Navbar.tsx src/components/Footer.tsx src/components/VideoCarousel.tsx
rm -f src/constants/index.ts src/utils/index.ts src/utils/animations.ts
rm -rf src/constants src/utils
rm -rf public/assets
```

- [ ] **Step 2: 重写 App.tsx 为最小骨架**

```tsx
// src/App.tsx
function App(): React.ReactElement {
  return (
    <main className="bg-[#070807] min-h-screen text-white">
      <div>千问 OS - 即将启动</div>
    </main>
  );
}

export default App;
```

- [ ] **Step 3: 更新 index.html**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#070807" />
    <title>千问 OS：启动 AI 时代的新物种</title>
    <meta name="description" content="千问大模型互动体验 - 选择一个场景，看看它如何被千问大模型重新进化" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: 清理 main.tsx 中的 Sentry 代码**

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 5: 清理 vite.config.ts 中的 Sentry 配置**

```ts
// vite.config.ts
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  resolve: {
    alias: {
      "/assets": path.resolve(process.cwd(), "public/assets"),
    },
  },
  plugins: [react()],
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1600,
  },
});
```

- [ ] **Step 6: 卸载不需要的依赖**

```bash
npm uninstall @sentry/react @sentry/vite-plugin lucide-react
```

- [ ] **Step 7: 验证项目能启动**

```bash
npm run dev
```
Expected: 浏览器打开后显示"千问 OS - 即将启动"，无报错。

- [ ] **Step 8: Commit**

```bash
git init
git add -A
git commit -m "chore: clean iPhone template, set up Qwen OS skeleton"
```

---

### Task 2: 安装新依赖

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 安装 tsParticles 和 html2canvas**

```bash
npm install @tsparticles/react @tsparticles/slim tsparticles-slim html2canvas
npm install -D @types/html2canvas
```

- [ ] **Step 2: 验证依赖安装成功**

```bash
npm ls @tsparticles/react @tsparticles/slim html2canvas
```
Expected: 三个包都显示版本号，无报错。

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add tspparticles and html2canvas dependencies"
```

---

### Task 3: 建立类型定义和 CSS Token

**Files:**
- Create: `src/types/index.ts`
- Create: `src/styles/tokens.css`
- Modify: `src/index.css`

- [ ] **Step 1: 创建类型定义**

```ts
// src/types/index.ts
export type Screen = 'hook' | 'input' | 'analysis' | 'choice' | 'awakening' | 'share';
export type PerformanceLevel = 'full' | 'degraded';
export type ParticleMode = 'hook' | 'analysis' | 'result';

export interface SceneData {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  before: string;
  after: string;
  qwenRole: string;
  stats: {
    understanding: number;
    creativity: number;
    efficiency: number;
  };
}

export interface ResultData {
  name: string;
  slogan: string;
  qwenRole: string;
  stats: {
    understanding: number;
    creativity: number;
    efficiency: number;
  };
}

export interface UserData {
  scene: SceneData | null;
  result: ResultData | null;
}
```

- [ ] **Step 2: 创建 CSS Token 文件**

```css
/* src/styles/tokens.css */
:root {
  --bg: #070807;
  --bg-deep: #020302;
  --bg-card: rgba(12, 15, 14, 0.84);
  --bg-card-hover: rgba(20, 25, 22, 0.9);

  --color-cyan: #5eead4;
  --color-orange: #ff6a00;
  --color-green: #9ef86f;

  --text-primary: #f8f4ee;
  --text-secondary: #aeb8b0;
  --text-accent: #ffddc5;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;

  --glow-cyan: 0 0 40px rgba(94, 234, 212, 0.3);
  --glow-orange: 0 0 40px rgba(255, 106, 0, 0.3);
  --glow-cyan-strong: 0 0 60px rgba(94, 234, 212, 0.5);

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 0.3s;
  --dur-normal: 0.5s;
  --dur-slow: 0.8s;
}
```

- [ ] **Step 3: 重写 index.css**

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import './styles/tokens.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  color: var(--text-primary);
  background: var(--bg);
  font-family: 'Noto Sans SC', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  user-select: none;
  -webkit-user-select: none;
}

canvas {
  touch-action: none;
}

#root {
  width: 100%;
  height: 100%;
}

/* Orbitron 用于英文标题 */
.font-orbitron {
  font-family: 'Orbitron', sans-serif;
}

/* 屏幕容器 */
.screen-container {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: hidden;
}

/* 按钮基础样式 */
.btn-primary {
  padding: 14px 36px;
  border-radius: var(--radius-lg);
  background: transparent;
  border: 1px solid var(--color-cyan);
  color: var(--color-cyan);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  background: rgba(94, 234, 212, 0.1);
  box-shadow: var(--glow-cyan);
}

.btn-primary:active {
  transform: scale(0.97);
}

/* 玻璃拟态卡片 */
.glass-card {
  background: var(--bg-card);
  border: 1px solid rgba(94, 234, 212, 0.15);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

- [ ] **Step 4: 在 index.html 中添加 Google Fonts**

在 `<head>` 中添加：
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=Orbitron:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

- [ ] **Step 5: 更新 tailwind.config.js 扩展色彩**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'qwen-bg': '#070807',
        'qwen-cyan': '#5eead4',
        'qwen-orange': '#ff6a00',
        'qwen-green': '#9ef86f',
        'qwen-card': 'rgba(12, 15, 14, 0.84)',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 6: 验证项目能启动**

```bash
npm run dev
```
Expected: 页面背景变为 #070807，无报错。

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add type definitions, CSS tokens, and visual system"
```

---

### Task 4: 建立场景数据

**Files:**
- Create: `src/data/scenes.ts`

- [ ] **Step 1: 创建场景数据文件**

```ts
// src/data/scenes.ts
import type { SceneData } from '../types';

export const scenes: SceneData[] = [
  {
    id: 'car',
    icon: '🚗',
    title: '未来汽车',
    subtitle: '从交通工具进化为懂你的出行伙伴',
    before: '只能执行固定驾驶规则',
    after: '能理解路况、情绪、目的和模糊需求',
    qwenRole: '千问让汽车拥有理解、推理与决策能力',
    stats: { understanding: 92, creativity: 88, efficiency: 95 },
  },
  {
    id: 'software',
    icon: '💻',
    title: '未来软件',
    subtitle: '从工具进化为主动协作的智能专家',
    before: '需要用户一步步操作',
    after: '只需表达目标，它就能完成复杂任务',
    qwenRole: '千问让软件拥有自然语言理解与任务执行能力',
    stats: { understanding: 90, creativity: 85, efficiency: 93 },
  },
  {
    id: 'hardware',
    icon: '🤖',
    title: '智能硬件',
    subtitle: '从冷冰冰设备进化为懂你的生活伙伴',
    before: '只能听懂简单指令',
    after: '能理解你的习惯、环境和潜在需求',
    qwenRole: '千问让硬件拥有感知、理解和主动服务能力',
    stats: { understanding: 88, creativity: 82, efficiency: 90 },
  },
  {
    id: 'creator',
    icon: '🎬',
    title: '内容创作',
    subtitle: '从灵感卡壳进化为人人可创作',
    before: '创意表达门槛高',
    after: '文字、图片、视频都能被 AI 快速生成',
    qwenRole: '千问与万相让创作从灵感直接走向成片',
    stats: { understanding: 85, creativity: 95, efficiency: 88 },
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/scenes.ts
git commit -m "feat: add scene data for 4 scenarios"
```

---

## 阶段 2：核心状态管理

### Task 5: 性能检测工具

**Files:**
- Create: `src/utils/performance.ts`

- [ ] **Step 1: 创建性能检测函数**

```ts
// src/utils/performance.ts
import type { PerformanceLevel } from '../types';

export function detectPerformance(): PerformanceLevel {
  // 1. WebGL 支持检测
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'degraded';

    // 2. GPU 型号检测
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : '';

    // 3. 已知低端 GPU 黑名单
    const lowEndGPUs = ['Mali-4', 'Mali-T', 'Adreno 3', 'Adreno 505', 'PowerVR SGX', 'Intel HD'];
    if (renderer && lowEndGPUs.some(gpu => renderer.includes(gpu))) return 'degraded';

    // 4. 内存检测
    if (navigator.deviceMemory && navigator.deviceMemory < 4) return 'degraded';
  } catch {
    return 'degraded';
  }

  return 'full';
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/performance.ts
git commit -m "feat: add performance detection utility"
```

---

### Task 6: PerformanceContext

**Files:**
- Create: `src/context/PerformanceContext.tsx`

- [ ] **Step 1: 创建性能 Context**

```tsx
// src/context/PerformanceContext.tsx
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { detectPerformance } from '../utils/performance';
import type { PerformanceLevel } from '../types';

const PerformanceContext = createContext<PerformanceLevel>('full');

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const level = useMemo(() => detectPerformance(), []);

  return (
    <PerformanceContext.Provider value={level}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance(): PerformanceLevel {
  return useContext(PerformanceContext);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/context/PerformanceContext.tsx
git commit -m "feat: add PerformanceContext with device detection"
```

---

### Task 7: AppContext（全局状态）

**Files:**
- Create: `src/context/AppContext.tsx`

- [ ] **Step 1: 创建全局状态 Context**

```tsx
// src/context/AppContext.tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Screen, UserData, SceneData, ResultData } from '../types';

interface AppState {
  screen: Screen;
  userData: UserData;
}

interface AppContextType {
  state: AppState;
  setScreen: (screen: Screen) => void;
  selectScene: (scene: SceneData) => void;
  setResult: (result: ResultData) => void;
  reset: () => void;
}

const initialState: AppState = {
  screen: 'hook',
  userData: { scene: null, result: null },
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const setScreen = useCallback((screen: Screen) => {
    setState(prev => ({ ...prev, screen }));
  }, []);

  const selectScene = useCallback((scene: SceneData) => {
    setState(prev => ({
      ...prev,
      userData: { ...prev.userData, scene },
    }));
  }, []);

  const setResult = useCallback((result: ResultData) => {
    setState(prev => ({
      ...prev,
      userData: { ...prev.userData, result },
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <AppContext.Provider value={{ state, setScreen, selectScene, setResult, reset }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/context/AppContext.tsx
git commit -m "feat: add AppContext for global state management"
```

---

### Task 8: 更新 App.tsx 接入 Provider

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: 重写 App.tsx**

```tsx
// src/App.tsx
import { PerformanceProvider } from './context/PerformanceContext';
import { AppProvider } from './context/AppContext';
import ScreenManager from './components/ScreenManager';
import ParticleBackground from './components/ParticleBackground';

function App(): React.ReactElement {
  return (
    <PerformanceProvider>
      <AppProvider>
        <div className="relative w-full h-full overflow-hidden" style={{ background: 'var(--bg)' }}>
          <ParticleBackground />
          <ScreenManager />
        </div>
      </AppProvider>
    </PerformanceProvider>
  );
}

export default App;
```

- [ ] **Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire up App with PerformanceProvider and AppProvider"
```

---

## 阶段 3：屏幕组件（基础结构）

### Task 9: ScreenManager

**Files:**
- Create: `src/components/ScreenManager.tsx`

- [ ] **Step 1: 创建屏幕管理器**

```tsx
// src/components/ScreenManager.tsx
import { useApp } from '../context/AppContext';
import HookScreen from '../screens/HookScreen';
import InputScreen from '../screens/InputScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import ChoiceScreen from '../screens/ChoiceScreen';
import AwakeningScreen from '../screens/AwakeningScreen';
import ShareScreen from '../screens/ShareScreen';
import { useState, useEffect, type ComponentType } from 'react';

const screens: Record<string, ComponentType> = {
  hook: HookScreen,
  input: InputScreen,
  analysis: AnalysisScreen,
  choice: ChoiceScreen,
  awakening: AwakeningScreen,
  share: ShareScreen,
};

function ScreenManager() {
  const { state } = useApp();
  const [visible, setVisible] = useState(true);
  const [currentScreen, setCurrentScreen] = useState(state.screen);

  useEffect(() => {
    if (state.screen !== currentScreen) {
      // 淡出
      setVisible(false);
      const timer = setTimeout(() => {
        setCurrentScreen(state.screen);
        // 淡入
        setVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.screen, currentScreen]);

  const ScreenComponent = screens[currentScreen];

  return (
    <div
      className="absolute inset-0 z-10 transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <ScreenComponent />
    </div>
  );
}

export default ScreenManager;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ScreenManager.tsx
git commit -m "feat: add ScreenManager with fade transition"
```

---

### Task 10: HookScreen（首页）

**Files:**
- Create: `src/screens/HookScreen.tsx`

- [ ] **Step 1: 创建首页骨架**

```tsx
// src/screens/HookScreen.tsx
import { useApp } from '../context/AppContext';
import { usePerformance } from '../context/PerformanceContext';
import Hero3DModel from '../components/Hero3DModel';
import GlowSphere from '../components/GlowSphere';

function HookScreen() {
  const { setScreen } = useApp();
  const performance = usePerformance();

  return (
    <div className="screen-container">
      {/* 3D 球体或 CSS 降级 */}
      <div className="flex-1 flex items-center justify-center w-full">
        {performance === 'full' ? <Hero3DModel /> : <GlowSphere />}
      </div>

      {/* 文案区域 */}
      <div className="flex flex-col items-center gap-6 pb-16">
        <p className="font-orbitron text-sm tracking-[0.3em] text-[var(--text-secondary)] uppercase">
          QWEN OS Interactive Experience
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-center leading-tight">
          千问，启动 AI 时代的新物种
        </h1>
        <p className="text-[var(--text-secondary)] text-base md:text-lg text-center max-w-md">
          选择一个场景，看看它如何被千问大模型重新进化。
        </p>
        <button className="btn-primary mt-4" onClick={() => setScreen('input')}>
          开始唤醒
        </button>
      </div>
    </div>
  );
}

export default HookScreen;
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/HookScreen.tsx
git commit -m "feat: add HookScreen with layout and CTA"
```

---

### Task 11: InputScreen（场景选择）

**Files:**
- Create: `src/screens/InputScreen.tsx`
- Create: `src/components/SceneCard.tsx`

- [ ] **Step 1: 创建 SceneCard 组件**

```tsx
// src/components/SceneCard.tsx
import type { SceneData } from '../types';

interface Props {
  scene: SceneData;
  onClick: () => void;
  delay?: number;
}

function SceneCard({ scene, onClick }: Props) {
  return (
    <button
      className="glass-card p-6 flex flex-col items-center gap-3 cursor-pointer
                 transition-all duration-300 hover:border-[var(--color-cyan)]
                 hover:shadow-[var(--glow-cyan)] hover:-translate-y-1 active:scale-95"
      onClick={onClick}
    >
      <span className="text-4xl">{scene.icon}</span>
      <h3 className="text-lg font-bold text-[var(--text-primary)]">{scene.title}</h3>
      <p className="text-sm text-[var(--text-secondary)] text-center leading-relaxed">
        {scene.subtitle}
      </p>
    </button>
  );
}

export default SceneCard;
```

- [ ] **Step 2: 创建 InputScreen**

```tsx
// src/screens/InputScreen.tsx
import { useApp } from '../context/AppContext';
import { scenes } from '../data/scenes';
import SceneCard from '../components/SceneCard';
import type { SceneData } from '../types';

function InputScreen() {
  const { selectScene, setScreen } = useApp();

  const handleSelect = (scene: SceneData) => {
    selectScene(scene);
    setScreen('analysis');
  };

  return (
    <div className="screen-container">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-10">
        你想让千问唤醒哪一种未来？
      </h2>

      <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-lg w-full">
        {scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            onClick={() => handleSelect(scene)}
          />
        ))}
      </div>
    </div>
  );
}

export default InputScreen;
```

- [ ] **Step 3: Commit**

```bash
git add src/screens/InputScreen.tsx src/components/SceneCard.tsx
git commit -m "feat: add InputScreen with scene selection cards"
```

---

### Task 12: AnalysisScreen（分析中）

**Files:**
- Create: `src/screens/AnalysisScreen.tsx`

- [ ] **Step 1: 创建分析页**

```tsx
// src/screens/AnalysisScreen.tsx
import { useApp } from '../context/AppContext';
import { useState, useEffect } from 'react';

const analysisTexts = [
  '千问正在理解你的选择...',
  '正在连接行业知识与场景需求...',
  '正在生成 AI 操作系统能力映射...',
  '进化方案已完成。',
];

function AnalysisScreen() {
  const { state, setScreen } = useApp();
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    analysisTexts.forEach((_, i) => {
      if (i > 0) {
        timers.push(setTimeout(() => setTextIndex(i), i * 1200));
      }
    });

    // 完成后跳转
    timers.push(setTimeout(() => {
      if (state.userData.scene) {
        // 生成结果数据
        const scene = state.userData.scene;
        // setResult 在 ChoiceScreen 中处理
        setScreen('choice');
      }
    }, analysisTexts.length * 1200));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="screen-container">
      <div className="flex flex-col items-center gap-8">
        {/* 分析文字 */}
        <p className="text-xl md:text-2xl text-[var(--color-cyan)] text-center transition-opacity duration-300">
          {analysisTexts[textIndex]}
        </p>

        {/* 简单进度条 */}
        <div className="w-48 h-1 bg-[rgba(94,234,212,0.2)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-cyan)] rounded-full transition-all duration-300"
            style={{ width: `${((textIndex + 1) / analysisTexts.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default AnalysisScreen;
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/AnalysisScreen.tsx
git commit -m "feat: add AnalysisScreen with text sequence and progress"
```

---

### Task 13: ChoiceScreen（进化对比）

**Files:**
- Create: `src/screens/ChoiceScreen.tsx`

- [ ] **Step 1: 创建进化对比页（基础版，无复杂动画）**

```tsx
// src/screens/ChoiceScreen.tsx
import { useApp } from '../context/AppContext';
import { useState, useEffect } from 'react';

function ChoiceScreen() {
  const { state, setScreen, setResult } = useApp();
  const [phase, setPhase] = useState<'before' | 'transition' | 'after'>('before');
  const scene = state.userData.scene;

  useEffect(() => {
    // 阶段1: 显示进化前 (1.5s)
    const t1 = setTimeout(() => setPhase('transition'), 1500);
    // 阶段2: 过渡 (1.5s)
    const t2 = setTimeout(() => setPhase('after'), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!scene) {
    setScreen('input');
    return null;
  }

  const handleGenerate = () => {
    setResult({
      name: scene.title.replace('未来', '') + '智能体',
      slogan: scene.subtitle,
      qwenRole: scene.qwenRole,
      stats: scene.stats,
    });
    setScreen('awakening');
  };

  return (
    <div className="screen-container">
      <div className="flex flex-col items-center gap-8 max-w-md w-full">
        {/* 进化前 */}
        <div
          className={`glass-card p-6 w-full text-center transition-all duration-500 ${
            phase === 'before' ? 'opacity-100' : 'opacity-30'
          }`}
        >
          <p className="text-sm text-[var(--text-secondary)] mb-2">进化前</p>
          <p className="text-lg">{scene.before}</p>
        </div>

        {/* 千问赋能 */}
        <div
          className={`text-center transition-opacity duration-500 ${
            phase === 'transition' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-[var(--color-orange)] text-lg font-bold">
            ✦ 千问大模型赋能 ✦
          </p>
        </div>

        {/* 进化后 */}
        <div
          className={`glass-card p-6 w-full text-center transition-all duration-500 border-[var(--color-cyan)] ${
            phase === 'after' ? 'opacity-100 border shadow-[var(--glow-cyan)]' : 'opacity-0'
          }`}
        >
          <p className="text-sm text-[var(--color-cyan)] mb-2">进化后</p>
          <p className="text-lg">{scene.after}</p>
        </div>

        {/* 按钮 */}
        {phase === 'after' && (
          <button
            className="btn-primary mt-4 animate-fade-in"
            onClick={handleGenerate}
          >
            生成我的 AI 新物种
          </button>
        )}
      </div>
    </div>
  );
}

export default ChoiceScreen;
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/ChoiceScreen.tsx
git commit -m "feat: add ChoiceScreen with before/after comparison"
```

---

### Task 14: AwakeningScreen（AI 新物种档案）

**Files:**
- Create: `src/screens/AwakeningScreen.tsx`
- Create: `src/components/StatsBar.tsx`

- [ ] **Step 1: 创建 StatsBar 组件**

```tsx
// src/components/StatsBar.tsx
interface Props {
  label: string;
  value: number;
  color?: string;
}

function StatsBar({ label, value, color = 'var(--color-cyan)' }: Props) {
  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-sm text-[var(--text-secondary)] w-16 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-[rgba(94,234,212,0.1)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-sm font-bold w-8 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

export default StatsBar;
```

- [ ] **Step 2: 创建 AwakeningScreen**

```tsx
// src/screens/AwakeningScreen.tsx
import { useApp } from '../context/AppContext';
import StatsBar from '../components/StatsBar';
import { useEffect, useState } from 'react';

function AwakeningScreen() {
  const { state, setScreen } = useApp();
  const [show, setShow] = useState(false);
  const result = state.userData.result;

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!result) {
    setScreen('input');
    return null;
  }

  const avgScore = Math.round(
    (result.stats.understanding + result.stats.creativity + result.stats.efficiency) / 3
  );

  return (
    <div className="screen-container">
      <div
        className={`glass-card p-8 max-w-sm w-full flex flex-col items-center gap-6 transition-all duration-700 ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <p className="font-orbitron text-sm tracking-[0.2em] text-[var(--text-secondary)]">
          YOUR AI SPECIES
        </p>

        <h2 className="text-2xl font-bold text-center">{result.name}</h2>
        <p className="text-sm text-[var(--text-secondary)] text-center">{result.slogan}</p>

        {/* 进化指数 */}
        <div className="w-full text-center">
          <p className="text-sm text-[var(--text-secondary)] mb-1">AI 进化指数</p>
          <p className="text-5xl font-bold text-[var(--color-cyan)]">{avgScore}</p>
        </div>

        {/* 指标 */}
        <div className="w-full flex flex-col gap-3">
          <StatsBar label="理解力" value={result.stats.understanding} />
          <StatsBar label="创造力" value={result.stats.creativity} color="var(--color-green)" />
          <StatsBar label="效率" value={result.stats.efficiency} color="var(--color-orange)" />
        </div>

        {/* 千问作用 */}
        <p className="text-sm text-[var(--text-secondary)] text-center leading-relaxed">
          {result.qwenRole}
        </p>

        <button className="btn-primary" onClick={() => setScreen('share')}>
          生成分享海报
        </button>
      </div>
    </div>
  );
}

export default AwakeningScreen;
```

- [ ] **Step 3: Commit**

```bash
git add src/screens/AwakeningScreen.tsx src/components/StatsBar.tsx
git commit -m "feat: add AwakeningScreen with AI species card and stats"
```

---

### Task 15: ShareScreen（海报生成）

**Files:**
- Create: `src/screens/ShareScreen.tsx`
- Create: `src/components/PosterPreview.tsx`
- Create: `src/utils/poster.ts`

- [ ] **Step 1: 创建海报生成工具**

```ts
// src/utils/poster.ts
import html2canvas from 'html2canvas';

export async function generatePoster(elementId: string): Promise<string> {
  const target = document.getElementById(elementId);
  if (!target) throw new Error('Poster element not found');

  const canvas = await html2canvas(target, {
    backgroundColor: '#070807',
    scale: 2,
    useCORS: true,
    width: 750,
    height: 1334,
  });

  return canvas.toDataURL('image/png');
}

export function downloadPoster(dataUrl: string, filename = 'qwen-ai-poster.png'): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

- [ ] **Step 2: 创建 PosterPreview 组件**

```tsx
// src/components/PosterPreview.tsx
import type { ResultData } from '../types';

interface Props {
  result: ResultData;
}

function PosterPreview({ result }: Props) {
  const avgScore = Math.round(
    (result.stats.understanding + result.stats.creativity + result.stats.efficiency) / 3
  );

  return (
    <div
      id="poster-card"
      className="w-[375px] h-[667px] flex flex-col items-center justify-between p-8"
      style={{ background: 'var(--bg)' }}
    >
      {/* 顶部 */}
      <div className="flex flex-col items-center gap-2">
        <p className="font-orbitron text-lg tracking-[0.3em] text-[var(--color-cyan)]">QWEN OS</p>
        <div className="w-16 h-px bg-[var(--color-cyan)] opacity-30" />
      </div>

      {/* 中部 */}
      <div className="flex flex-col items-center gap-6 flex-1 justify-center">
        <p className="text-sm text-[var(--text-secondary)]">我的 AI 新物种已被千问唤醒</p>

        <div className="glass-card p-6 w-full text-center">
          <h3 className="text-xl font-bold mb-2">{result.name}</h3>
          <p className="text-sm text-[var(--text-secondary)]">{result.slogan}</p>
        </div>

        {/* 进化指数 */}
        <div className="text-center">
          <p className="text-sm text-[var(--text-secondary)] mb-1">AI 进化指数</p>
          <p className="text-6xl font-bold text-[var(--color-cyan)]">{avgScore}</p>
        </div>

        {/* 指标 */}
        <div className="w-full flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">理解力</span>
            <span className="text-[var(--color-cyan)]">{result.stats.understanding}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">创造力</span>
            <span className="text-[var(--color-green)]">{result.stats.creativity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">效率</span>
            <span className="text-[var(--color-orange)]">{result.stats.efficiency}</span>
          </div>
        </div>
      </div>

      {/* 底部 */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
          <span className="text-black text-xs font-bold">QR</span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] text-center">
          千问大模型，让万物进化为智能体
        </p>
      </div>
    </div>
  );
}

export default PosterPreview;
```

- [ ] **Step 3: 创建 ShareScreen**

```tsx
// src/screens/ShareScreen.tsx
import { useApp } from '../context/AppContext';
import PosterPreview from '../components/PosterPreview';
import { generatePoster, downloadPoster } from '../utils/poster';
import { useState } from 'react';

function ShareScreen() {
  const { state, setScreen, reset } = useApp();
  const [generating, setGenerating] = useState(false);
  const result = state.userData.result;

  if (!result) {
    setScreen('input');
    return null;
  }

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
      <div className="flex flex-col items-center gap-6 max-w-sm w-full">
        <h2 className="text-xl font-bold">你的 AI 新物种海报</h2>

        {/* 海报预览 - 缩小显示 */}
        <div className="w-full overflow-hidden rounded-xl" style={{ maxHeight: '50vh' }}>
          <div className="origin-top-left" style={{ transform: 'scale(0.45)', width: '375px' }}>
            <PosterPreview result={result} />
          </div>
        </div>

        {/* 按钮 */}
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
    </div>
  );
}

export default ShareScreen;
```

- [ ] **Step 4: 验证完整流程**

```bash
npm run dev
```
Expected: 能从首页 → 选场景 → 分析 → 进化对比 → AI 档案 → 海报页完整走通。

- [ ] **Step 5: Commit**

```bash
git add src/screens/ShareScreen.tsx src/components/PosterPreview.tsx src/utils/poster.ts
git commit -m "feat: add ShareScreen with poster generation and download"
```

---

## 阶段 4：粒子背景

### Task 16: tsParticles 配置

**Files:**
- Create: `src/utils/particlesConfig.ts`

- [ ] **Step 1: 创建三种粒子配置**

```ts
// src/utils/particlesConfig.ts
import type { ISourceOptions } from '@tsparticles/engine';

const baseConfig: Partial<ISourceOptions> = {
  fullScreen: { enable: false },
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    color: { value: '#5eead4' },
    links: {
      enable: true,
      color: '#5eead4',
      opacity: 0.15,
      distance: 150,
    },
    move: {
      enable: true,
      direction: 'none',
      outModes: { default: 'out' },
    },
    number: { density: { enable: true, width: 1920, height: 1080 } },
    opacity: { value: { min: 0.1, max: 0.4 } },
    shape: { type: 'circle' },
    size: { value: { min: 1, max: 3 } },
  },
  detectRetina: true,
};

export const hookConfig: ISourceOptions = {
  ...baseConfig as ISourceOptions,
  particles: {
    ...baseConfig.particles as ISourceOptions['particles'],
    number: { value: 40, density: { enable: true, width: 1920, height: 1080 } },
    move: {
      ...baseConfig.particles?.move as ISourceOptions['particles'] extends { move: infer M } ? M : never,
      speed: 0.5,
    },
    opacity: { value: { min: 0.1, max: 0.3 } },
  },
};

export const analysisConfig: ISourceOptions = {
  ...baseConfig as ISourceOptions,
  particles: {
    ...baseConfig.particles as ISourceOptions['particles'],
    number: { value: 100, density: { enable: true, width: 1920, height: 1080 } },
    move: {
      ...baseConfig.particles?.move as ISourceOptions['particles'] extends { move: infer M } ? M : never,
      speed: 3,
      direction: 'center',
    },
    opacity: { value: { min: 0.2, max: 0.5 } },
    links: {
      ...baseConfig.particles?.links as ISourceOptions['particles'] extends { links: infer L } ? L : never,
      opacity: 0.3,
    },
  },
};

export const resultConfig: ISourceOptions = {
  ...baseConfig as ISourceOptions,
  particles: {
    ...baseConfig.particles as ISourceOptions['particles'],
    number: { value: 60, density: { enable: true, width: 1920, height: 1080 } },
    move: {
      ...baseConfig.particles?.move as ISourceOptions['particles'] extends { move: infer M } ? M : never,
      speed: 1,
    },
    opacity: { value: { min: 0.15, max: 0.35 } },
    color: { value: ['#5eead4', '#9ef86f'] },
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/particlesConfig.ts
git commit -m "feat: add tsParticles configurations for 3 modes"
```

---

### Task 17: ParticleBackground 组件

**Files:**
- Create: `src/components/ParticleBackground.tsx`

- [ ] **Step 1: 创建粒子背景组件**

```tsx
// src/components/ParticleBackground.tsx
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useCallback, useMemo } from 'react';
import { hookConfig, analysisConfig, resultConfig } from '../utils/particlesConfig';
import { useApp } from '../context/AppContext';
import { usePerformance } from '../context/PerformanceContext';
import type { Engine } from '@tsparticles/engine';

function ParticleBackground() {
  const { state } = useApp();
  const performance = usePerformance();

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  // 根据当前屏幕选择粒子配置
  const config = useMemo(() => {
    if (performance === 'degraded') return null;

    switch (state.screen) {
      case 'hook':
        return hookConfig;
      case 'analysis':
        return analysisConfig;
      case 'awakening':
      case 'share':
        return resultConfig;
      default:
        return hookConfig;
    }
  }, [state.screen, performance]);

  if (!config) return null;

  return (
    <div className="absolute inset-0 z-0">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={config}
        className="w-full h-full"
      />
    </div>
  );
}

export default ParticleBackground;
```

- [ ] **Step 2: 验证粒子效果**

```bash
npm run dev
```
Expected: 首页有缓慢漂浮的青绿色粒子，分析页粒子变多变快。

- [ ] **Step 3: Commit**

```bash
git add src/components/ParticleBackground.tsx
git commit -m "feat: add ParticleBackground with mode-based configs"
```

---

## 阶段 5：3D 球体

### Task 18: Hero3DModel（full 模式 — drei 增强版）

**Files:**
- Create: `src/components/Hero3DModel.tsx`

**使用 drei 组件：**
- `Float` — 悬浮动画（替代手写 useFrame）
- `MeshDistortMaterial` — 有机扭曲材质（替代 MeshStandardMaterial）
- `Sparkles` — 3D 场景内粒子闪烁
- `Environment` — 专业光照预设
- `Outlines` — 发光轮廓

- [ ] **Step 1: 创建 3D 能量核心球体组件**

```tsx
// src/components/Hero3DModel.tsx
import { Canvas } from '@react-three/fiber';
import {
  Float,
  MeshDistortMaterial,
  Sparkles,
  Environment,
  Outlines,
} from '@react-three/drei';

function EnergySphere() {
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#5eead4"
          emissive="#5eead4"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.15}
          distort={0.3}
          speed={2}
        />
        <Outlines thickness={0.02} color="#5eead4" opacity={0.4} />
      </mesh>
    </Float>
  );
}

function Hero3DModel() {
  return (
    <div className="w-64 h-64 md:w-80 md:h-80">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5, max: 1, debounce: 200 }}
      >
        <Environment preset="night" />
        <EnergySphere />
        <Sparkles
          count={40}
          scale={4}
          size={1.5}
          color="#5eead4"
          speed={0.4}
          opacity={0.5}
        />
      </Canvas>
    </div>
  );
}

export default Hero3DModel;
```

- [ ] **Step 2: 验证 3D 球体**

```bash
npm run dev
```
Expected: 首页中央显示有机扭曲的青绿色能量球体，表面微微波动，周围有粒子闪烁，球体缓慢悬浮旋转。

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero3DModel.tsx
git commit -m "feat: add Hero3DModel with drei enhanced energy sphere (Float, MeshDistortMaterial, Sparkles, Environment, Outlines)"
```

---

### Task 19: GlowSphere（degraded 模式）

**Files:**
- Create: `src/components/GlowSphere.tsx`

- [ ] **Step 1: 创建 CSS 降级球体**

```tsx
// src/components/GlowSphere.tsx
function GlowSphere() {
  return (
    <div className="w-48 h-48 md:w-64 md:h-64 relative flex items-center justify-center">
      {/* 外层光晕 */}
      <div
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(94,234,212,0.15) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      {/* 球体 */}
      <div
        className="w-32 h-32 md:w-40 md:h-40 rounded-full animate-float"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #5eead4, #0d9488)',
          boxShadow: '0 0 60px rgba(94,234,212,0.4), inset 0 0 30px rgba(94,234,212,0.2)',
        }}
      />
    </div>
  );
}

export default GlowSphere;
```

- [ ] **Step 2: 在 index.css 中添加浮动动画**

在 `index.css` 末尾添加：
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/GlowSphere.tsx src/index.css
git commit -m "feat: add GlowSphere CSS fallback for degraded mode"
```

---

## 阶段 6：GSAP 动画增强

### Task 20: HookScreen 入场动画

**Files:**
- Modify: `src/screens/HookScreen.tsx`

- [ ] **Step 1: 为 HookScreen 添加 GSAP 入场动画**

```tsx
// src/screens/HookScreen.tsx
import { useApp } from '../context/AppContext';
import { usePerformance } from '../context/PerformanceContext';
import Hero3DModel from '../components/Hero3DModel';
import GlowSphere from '../components/GlowSphere';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

function HookScreen() {
  const { setScreen } = useApp();
  const performance = usePerformance();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo('#hook-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo('#hook-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
      .fromTo('#hook-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .fromTo('#hook-cta', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
  }, { scope: containerRef });

  return (
    <div className="screen-container" ref={containerRef}>
      <div className="flex-1 flex items-center justify-center w-full">
        {performance === 'full' ? <Hero3DModel /> : <GlowSphere />}
      </div>

      <div className="flex flex-col items-center gap-6 pb-16">
        <p id="hook-subtitle" className="font-orbitron text-sm tracking-[0.3em] text-[var(--text-secondary)] uppercase opacity-0">
          QWEN OS Interactive Experience
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
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/HookScreen.tsx
git commit -m "feat: add GSAP entrance animations to HookScreen"
```

---

### Task 21: InputScreen 卡片 stagger 动画

**Files:**
- Modify: `src/screens/InputScreen.tsx`

- [ ] **Step 1: 为场景卡片添加 stagger 入场**

```tsx
// src/screens/InputScreen.tsx
import { useApp } from '../context/AppContext';
import { scenes } from '../data/scenes';
import SceneCard from '../components/SceneCard';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import type { SceneData } from '../types';

function InputScreen() {
  const { selectScene, setScreen } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('#input-title', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 });
    gsap.fromTo('.scene-card', { opacity: 0, y: 30, scale: 0.95 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, delay: 0.3,
    });
  }, { scope: containerRef });

  const handleSelect = (scene: SceneData) => {
    selectScene(scene);
    setScreen('analysis');
  };

  return (
    <div className="screen-container" ref={containerRef}>
      <h2 id="input-title" className="text-2xl md:text-4xl font-bold text-center mb-10 opacity-0">
        你想让千问唤醒哪一种未来？
      </h2>

      <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-lg w-full">
        {scenes.map((scene) => (
          <div key={scene.id} className="scene-card">
            <SceneCard scene={scene} onClick={() => handleSelect(scene)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default InputScreen;
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/InputScreen.tsx
git commit -m "feat: add stagger animation to InputScreen cards"
```

---

### Task 22: AwakeningScreen 数值增长动画

**Files:**
- Modify: `src/screens/AwakeningScreen.tsx`

- [ ] **Step 1: 为数值添加 CountUp 效果**

```tsx
// src/screens/AwakeningScreen.tsx
import { useApp } from '../context/AppContext';
import StatsBar from '../components/StatsBar';
import { useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

function AwakeningScreen() {
  const { state, setScreen } = useApp();
  const result = state.userData.result;
  const containerRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [countedScore, setCountedScore] = useState(0);

  const avgScore = result
    ? Math.round((result.stats.understanding + result.stats.creativity + result.stats.efficiency) / 3)
    : 0;

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // CountUp 动画
  useGSAP(() => {
    if (!show || !result) return;
    const obj = { value: 0 };
    gsap.to(obj, {
      value: avgScore,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => setCountedScore(Math.round(obj.value)),
    });
  }, [show, avgScore]);

  if (!result) {
    setScreen('input');
    return null;
  }

  return (
    <div className="screen-container" ref={containerRef}>
      <div
        className={`glass-card p-8 max-w-sm w-full flex flex-col items-center gap-6 transition-all duration-700 ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <p className="font-orbitron text-sm tracking-[0.2em] text-[var(--text-secondary)]">
          YOUR AI SPECIES
        </p>

        <h2 className="text-2xl font-bold text-center">{result.name}</h2>
        <p className="text-sm text-[var(--text-secondary)] text-center">{result.slogan}</p>

        <div className="w-full text-center">
          <p className="text-sm text-[var(--text-secondary)] mb-1">AI 进化指数</p>
          <p className="text-5xl font-bold text-[var(--color-cyan)]">{countedScore}</p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <StatsBar label="理解力" value={result.stats.understanding} />
          <StatsBar label="创造力" value={result.stats.creativity} color="var(--color-green)" />
          <StatsBar label="效率" value={result.stats.efficiency} color="var(--color-orange)" />
        </div>

        <p className="text-sm text-[var(--text-secondary)] text-center leading-relaxed">
          {result.qwenRole}
        </p>

        <button className="btn-primary" onClick={() => setScreen('share')}>
          生成分享海报
        </button>
      </div>
    </div>
  );
}

export default AwakeningScreen;
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/AwakeningScreen.tsx
git commit -m "feat: add CountUp animation to AwakeningScreen stats"
```

---

## 阶段 7：最终验证

### Task 23: 完整流程验证

- [ ] **Step 1: 启动开发服务器**

```bash
npm run dev
```

- [ ] **Step 2: 逐屏验证**

验证清单：
- [ ] HookScreen：3D 球体显示，文字动画，按钮可点击
- [ ] InputScreen：4 张卡片显示，stagger 入场，点击进入分析
- [ ] AnalysisScreen：文字逐句切换，进度条，自动跳转
- [ ] ChoiceScreen：进化前→赋能→进化后三阶段动画
- [ ] AwakeningScreen：卡片滑入，数值 CountUp，进度条
- [ ] ShareScreen：海报预览，下载按钮可点击

- [ ] **Step 3: 测试降级模式**

在 Chrome DevTools 中模拟低端设备：
- 打开 DevTools → More tools → Rendering
- 勾选 "Disable WebGL"
- 刷新页面，验证 CSS 球体正常显示

- [ ] **Step 4: 测试移动端**

```bash
npm run dev -- --host
```
用手机访问本地地址，验证：
- 触摸操作正常
- 文字可读
- 按钮可点击
- 流程完整

- [ ] **Step 5: Commit 最终状态**

```bash
git add -A
git commit -m "feat: complete Qwen OS interactive microsite v1"
```

---

## 开发顺序总结

```
阶段 1: 项目清理与基础设施
  Task 1: 清理模板内容
  Task 2: 安装新依赖
  Task 3: 类型定义和 CSS Token
  Task 4: 场景数据

阶段 2: 核心状态管理
  Task 5: 性能检测工具
  Task 6: PerformanceContext
  Task 7: AppContext
  Task 8: 更新 App.tsx

阶段 3: 屏幕组件
  Task 9: ScreenManager
  Task 10: HookScreen
  Task 11: InputScreen + SceneCard
  Task 12: AnalysisScreen
  Task 13: ChoiceScreen
  Task 14: AwakeningScreen + StatsBar
  Task 15: ShareScreen + PosterPreview + poster.ts

阶段 4: 粒子背景
  Task 16: tsParticles 配置
  Task 17: ParticleBackground 组件

阶段 5: 3D 球体
  Task 18: Hero3DModel (full)
  Task 19: GlowSphere (degraded)

阶段 6: GSAP 动画
  Task 20: HookScreen 入场动画
  Task 21: InputScreen stagger
  Task 22: AwakeningScreen CountUp

阶段 7: 最终验证
  Task 23: 完整流程验证
```
