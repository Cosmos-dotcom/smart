# QWEN OS Interactive

QWEN OS Interactive 是一个基于 React、TypeScript、Vite、Three.js、GSAP 和 Tailwind CSS 的前端互动微站。项目围绕“千问让不同场景进化为 AI 新物种”的体验路径展开：用户选择场景，系统展示分析和进化动画，生成结果卡片，并支持导出分享海报。

## 当前项目身份

- 项目名称：`qwen-os-interactive`
- 应用类型：前端单页互动体验
- 主要入口：`src/App.tsx`
- 场景数据：`src/data/scenes.ts`
- 流程页面：`src/screens`
- 视觉组件：`src/components`
- 部署产物：`dist`

## 技术栈

- React 18 + TypeScript
- Vite 7
- Tailwind CSS
- GSAP / @gsap/react
- Three.js / @react-three/fiber / @react-three/drei
- tsparticles
- html2canvas

## 体验流程

1. `hook`：首页唤醒入口。
2. `input`：选择一个未来场景。
3. `analysis`：展示千问分析过程。
4. `choice`：展示进化前后变化。
5. `awakening`：生成 AI 新物种结果。
6. `share`：预览并下载分享海报。

## 本地运行

PowerShell 可能会阻止 `npm.ps1`，本项目在 Windows PowerShell 下建议使用 `npm.cmd`：

```powershell
npm.cmd install
npm.cmd run dev
```

如果使用支持 npm shim 的终端，也可以使用常规命令：

```bash
npm install
npm run dev
```

## 构建

```powershell
npm.cmd run build
```

当前环境排查记录：在 Node `v24.14.0` 下，`tsc -b` 可以通过，但 Vite/esbuild 阶段可能报错：

```text
Cannot read directory "../..": Access is denied.
Could not resolve "C:\\Users\\junyang\\Desktop\\smart\\vite.config.ts"
```

这个错误发生在 Vite 调用 esbuild 加载配置阶段，不是 TypeScript 编译错误。建议优先切换到 Node LTS 22，重新安装依赖后再构建：

```powershell
node -v
Remove-Item -Recurse -Force node_modules
npm.cmd install
npm.cmd run build
```

如果仍失败，继续检查当前用户对 `C:\Users\junyang\Desktop\smart` 及父目录的读取权限。

## 自动验证

项目提供一条不依赖浏览器测试框架的黄金路径验证：

```powershell
npm.cmd run test:golden
```

它验证：

- 屏幕流程顺序固定且完整。
- 场景数据字段完整。
- 场景统计值在 0 到 100 之间。
- 从选择场景到生成结果的数据规则可用。

这不是完整浏览器端到端测试。等构建环境稳定后，建议再补 Playwright 测试，覆盖真实点击、动画跳转和海报下载。

## 部署

项目已包含 Vercel 和 Netlify 的 SPA 回退配置：

- `vercel.json`
- `netlify.toml`

部署命令使用：

```bash
npm run build
```

发布目录为：

```text
dist
```

## 维护建议

- 不要把新文案散落在页面组件中，优先集中到 `src/data` 或后续新增的 `src/content`。
- 修改流程顺序时，同步更新 `scripts/golden-path.mjs`。
- 如果引入真实后端 API，不要硬编码不存在的 URL；先在 `.env.example` 中声明占位符，并在调用处使用清晰的 `YOUR_API_ENDPOINT_HERE`。
