# 千问互动微站设计文档

## 1. 项目概述

面向大广赛阿里云千问命题的互动类广告作品。用户选择一个现实场景，系统模拟千问大模型将传统工具进化为"AI 新物种"，生成可传播的分享海报。

**技术栈：** React + TypeScript + Vite + Three.js (React Three Fiber + drei) + GSAP + tsParticles + html2canvas + Tailwind CSS

**项目名称：** 《千问 OS：启动 AI 时代的新物种》

---

## 2. 关键设计决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 3D 视觉 | 有机能量核心（drei MeshDistortMaterial + Float + Sparkles） | 开箱即用，视觉效果远超手写方案，性能影响小 |
| 进化转场 | 自动播放粒子溶解→重组 | 视觉冲击力最强，核心创意时刻 |
| 移动端策略 | 分层降级 | 微信 WebView 兼容性关键 |
| 音效 | 不做 | 避免移动端自动播放拦截和版权问题 |
| 海报风格 | 科技感暗黑风 | 和网站风格统一 |
| 屏幕转场 | 淡入淡出 0.5s | 最稳定，所有设备流畅 |
| 开发起点 | 基于 iPhone 模板改造 | 省去工程配置时间 |
| 字体 | Orbitron + Noto Sans SC | 科技感 + 中文支持 |

---

## 3. 整体架构

### 3.1 组件层级

```
App.tsx
├── PerformanceProvider (检测设备能力)
├── ScreenManager (状态机，管理屏幕切换)
│   ├── HookScreen
│   ├── InputScreen
│   ├── AnalysisScreen
│   ├── ChoiceScreen
│   ├── AwakeningScreen
│   └── ShareScreen
├── ParticleBackground (根据 performanceLevel 切换)
├── Hero3DModel (根据 performanceLevel 切换)
└── PosterGenerator (html2canvas 封装)
```

### 3.2 状态管理

使用 React Context + useState，不引入外部状态库。

```typescript
// 全局状态
const [screen, setScreen] = useState<Screen>('hook');
const [userData, setUserData] = useState<UserData>({
  scene: null,
  result: null,
});

// 屏幕枚举
type Screen = 'hook' | 'input' | 'analysis' | 'choice' | 'awakening' | 'share';
```

### 3.3 性能分层

`PerformanceProvider` 在首次加载时检测 WebGL、GPU、内存，输出 `performanceLevel: 'full' | 'degraded'`。

- **full 模式**：Three.js 球体 + tsParticles 粒子 + GSAP 动画
- **degraded 模式**：CSS 渐变发光球 + SVG 线条 + CSS 动画

---

## 4. 六幕屏幕设计

### 4.1 HookScreen（首页）

**目标：** 让用户一眼明白这是"千问 AI 操作系统互动体验"。

**布局：**
- 顶部：`QWEN OS`（Orbitron 字体）
- 中央：3D 发光球体 + 粒子背景
- 中部：Slogan "千问，启动 AI 时代的新物种"
- 下部：描述文字 + "开始唤醒"按钮

**动画：**
- 球体缓慢旋转 + 上下悬浮（`sin(time)` 驱动 y 轴）
- 粒子低密度、慢速、随机漂浮
- 文字 GSAP 逐行淡入（延迟 0.3s）
- 按钮从下方滑入 + 脉冲发光

---

### 4.2 InputScreen（场景选择）

**目标：** 让用户选择一个现实世界场景。

**布局：**
- 标题："你想让千问唤醒哪一种未来？"
- 2x2 卡片网格，每张包含图标 + 场景名称 + 一句话描述

**4 个场景：**
1. 未来汽车（🚗）
2. 未来软件（💻）
3. 智能硬件（🤖）
4. 内容创作（🎬）

**交互：**
- 卡片 GSAP stagger 入场（间隔 0.1s）
- 悬停：边框青绿发光 + 微微上移
- 点击：卡片放大 → 淡出 → 进入 AnalysisScreen

---

### 4.3 AnalysisScreen（分析中）

**目标：** 模拟千问大模型正在理解用户选择。

**布局：**
- 中央：3D 球体脉冲加快
- 粒子速度加快、向中心汇聚
- 文字逐句切换

**文案序列（每 1 秒）：**
1. "千问正在理解你的选择..."
2. "正在连接行业知识与场景需求..."
3. "正在生成 AI 操作系统能力映射..."
4. "进化方案已完成。"

**技术：** `setTimeout` 链式调用，完成后自动跳转 ChoiceScreen

---

### 4.4 ChoiceScreen（进化对比）—— 核心创意

**目标：** 展示"千问如何让传统工具进化为智能体"。

**动画序列（约 5 秒自动播放）：**
1. 阶段 1 (0-1.5s)：显示"进化前"文字 + 灰暗描述
2. 阶段 2 (1.5-3s)：文字粒子化溶解，散开
3. 阶段 3 (3-4.5s)：粒子流动重组
4. 阶段 4 (4.5-5s)：形成"进化后"文字 + 青绿色描述

**实现方案：**
- **full 模式**：Three.js 粒子系统，文字 → BufferGeometry 粒子位置 → 重组
- **degraded 模式**：CSS 动画模拟——文字淡出 → 粒子 CSS 动画 → 新文字淡入

**按钮：** "生成我的 AI 新物种"（动画完成后浮现）

---

### 4.5 AwakeningScreen（AI 新物种档案）

**目标：** 给用户强烈的"生成结果感"。

**布局：**
- 标题：`YOUR AI SPECIES`（Orbitron）
- 卡片：AI 新物种名称 + Slogan
- 指标：AI 进化指数、理解力、创造力、效率（进度条 + 数值）
- 描述：千问的作用
- 按钮："生成分享海报"

**动画：**
- 卡片从下方滑入
- 数值从 0 增长到目标值（GSAP CountUp）
- 进度条同步填充
- 背景粒子变柔和

---

### 4.6 ShareScreen（海报生成）

**目标：** 生成可下载、可传播的分享海报。

**布局：**
- 海报预览区域（750x1334）
- "下载海报"按钮
- "重新选择"按钮

**海报内容：**
- `QWEN OS` 标题
- "我的 AI 新物种已被千问唤醒"
- AI 新物种名称 + Slogan
- AI 进化指数
- 二维码占位
- "千问大模型，让万物进化为智能体"

**技术：** `html2canvas` 截取海报 DOM → PNG → 下载

---

## 5. 视觉系统

### 5.1 色彩 Token

```css
:root {
  --bg: #070807;
  --bg-deep: #020302;
  --bg-card: rgba(12, 15, 14, 0.84);
  --color-cyan: #5eead4;
  --color-orange: #ff6a00;
  --color-green: #9ef86f;
  --text-primary: #f8f4ee;
  --text-secondary: #aeb8b0;
  --text-accent: #ffddc5;
  --glow-cyan: 0 0 40px rgba(94, 234, 212, 0.3);
  --glow-orange: 0 0 40px rgba(255, 106, 0, 0.3);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-normal: 0.5s;
}
```

### 5.2 字体

- 标题/Slogan：`Orbitron`（英文）+ `Noto Sans SC`（中文）
- 正文：`Noto Sans SC`
- 来源：Google Fonts CDN
- 备用：`system-ui, -apple-system, sans-serif`

### 5.3 3D 球体（drei 增强）

- `SphereGeometry(1, 64, 64)`
- `MeshDistortMaterial`：青绿色 + 有机扭曲表面（`distort: 0.3`, `speed: 2`）
- `Float`：悬浮动画（`speed: 1.5`, `floatIntensity: 0.6`）
- `Sparkles`：3D 场景内粒子闪烁（40 个，青绿色）
- `Environment`：`night` 预设光照
- `Outlines`：发光轮廓（`thickness: 0.02`, 青绿色）
- Canvas 自适应性能：`performance={{ min: 0.5, max: 1, debounce: 200 }}`

### 5.4 粒子系统

| 模式 | 粒子数 | 速度 | 效果 |
|------|--------|------|------|
| hook | 50 | 低 | 随机漂浮 |
| analysis | 150 | 高 | 向中心汇聚 |
| result | 80 | 中 | 柔和扩散 |

---

## 6. 数据结构

```typescript
// src/data/scenes.ts
interface Scene {
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

const scenes: Scene[] = [
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

---

## 7. 性能检测

```typescript
// src/utils/performance.ts
export function detectPerformance(): 'full' | 'degraded' {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return 'degraded';

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    : '';

  const lowEndGPUs = ['Mali-4', 'Mali-T', 'Adreno 3', 'Adreno 505', 'PowerVR SGX'];
  if (lowEndGPUs.some(gpu => renderer.includes(gpu))) return 'degraded';

  if (navigator.deviceMemory && navigator.deviceMemory < 4) return 'degraded';

  return 'full';
}
```

---

## 8. 海报生成

```typescript
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

**注意事项：**
- 海报区域不使用跨域图片
- 不使用复杂 CSS filter
- 字体提前加载（Google Fonts `display=swap`）
- 固定尺寸 750x1334

---

## 9. 工程结构

```
src/
├── App.tsx
├── main.tsx
├── index.css
│
├── components/
│   ├── ScreenManager.tsx
│   ├── ParticleBackground.tsx
│   ├── Hero3DModel.tsx
│   ├── GlowSphere.tsx (degraded 模式)
│   ├── SceneCard.tsx
│   ├── AnalysisLoading.tsx
│   ├── EvolutionAnimation.tsx
│   ├── ResultCard.tsx
│   ├── StatsBar.tsx
│   └── PosterPreview.tsx
│
├── screens/
│   ├── HookScreen.tsx
│   ├── InputScreen.tsx
│   ├── AnalysisScreen.tsx
│   ├── ChoiceScreen.tsx
│   ├── AwakeningScreen.tsx
│   └── ShareScreen.tsx
│
├── context/
│   ├── PerformanceContext.tsx
│   └── AppContext.tsx
│
├── data/
│   └── scenes.ts
│
├── types/
│   └── index.ts
│
├── utils/
│   ├── performance.ts
│   ├── poster.ts
│   └── particlesConfig.ts
│
└── styles/
    └── tokens.css
```

---

## 10. 开发阶段

### 阶段 1：跑通主流程
- 清理 iPhone 模板原始内容
- 建立 6 个屏幕组件
- 建立状态机
- 建立场景数据
- 6 屏完整切换

### 阶段 2：视觉背景
- 接入 tsParticles
- 三种粒子模式
- 移动端性能检查

### 阶段 3：3D 模型
- Hero3DModel 组件
- AI 核心球体
- 辉光后处理
- degraded 模式 CSS fallback

### 阶段 4：GSAP 动画
- 首页文字入场
- 场景卡片 stagger
- 分析文字动效
- 进化动画（核心）
- 结果指数增长

### 阶段 5：海报生成
- PosterPreview DOM
- generatePoster 函数
- 下载功能
- 海报视觉优化

### 阶段 6：适配与部署
- 移动端适配
- 性能降级完善
- 微信浏览器测试
- 部署上线
- 二维码生成

---

## 11. 不做的功能

- 用户登录/数据库
- 排行榜
- 复杂小游戏
- 真实多人互动
- 复杂后端
- 音效
- 过多页面分支

---

## 12. 验收清单

- [ ] 首页突出 Slogan
- [ ] 10 秒内理解玩法
- [ ] 完整走完 6 幕流程
- [ ] 明确的千问品牌表达
- [ ] 体现 AI 操作系统概念
- [ ] 体现千行百业应用
- [ ] 有互动性
- [ ] 有传播海报
- [ ] 移动端正常体验
- [ ] 微信浏览器正常打开
- [ ] 海报能生成下载
- [ ] 动画流畅
- [ ] 按钮容易点击
- [ ] 低端设备降级正常
