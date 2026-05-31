import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useApp } from '../context/AppContext';
import { usePerformance } from '../context/PerformanceContext';

// ─── Combination Data ───────────────────────────────────────

interface ComboResult {
  name: string;
  slogan: string;
}

const comboMap: Record<string, ComboResult> = {
  'search+translate':           { name: 'AI研究员', slogan: '千问赋予了软件搜索与翻译能力，信息边界正在消失。' },
  'search+create':              { name: 'AI设计师', slogan: '当搜索遇见创造，软件不再是工具，而成为灵感伙伴。' },
  'search+agent':               { name: 'AI管家',   slogan: '搜索加自主决策，你的AI管家比你更懂你要什么。' },
  'translate+create':           { name: 'AI导演',   slogan: '跨语言的创造力，让每个故事都能被全世界听见。' },
  'translate+agent':            { name: 'AI执行官', slogan: '理解世界，自主行动，AI执行官让沟通没有国界。' },
  'create+agent':               { name: 'AI创作者', slogan: '创造与执行的融合，一个不知疲倦的创作者正在觉醒。' },
  'search+translate+create':    { name: 'AI创作者', slogan: '搜索、翻译、创作三力合一，AI创作者正在改写内容的定义。' },
  'search+translate+agent':     { name: 'AI研究员', slogan: '信息无界，行动自主，AI研究员让知识真正流动起来。' },
  'search+create+agent':        { name: 'AI设计师', slogan: '从灵感到落地，AI设计师让创造不再有瓶颈。' },
  'translate+create+agent':     { name: 'AI导演',   slogan: '跨文化创作，自主执行，AI导演让创意没有边界。' },
};

const agiResult: ComboResult = {
  name: 'QWEN AGI',
  slogan: '你创造了一个真正的AI生命体。',
};

function getComboResult(activeIds: string[]): ComboResult | null {
  if (activeIds.length < 2) return null;
  if (activeIds.length === 4) return agiResult;
  const key = [...activeIds].sort().join('+');
  return comboMap[key] ?? null;
}

// ─── Stats Mapping ──────────────────────────────────────────

const statsMap: Record<string, { understanding: number; creativity: number; efficiency: number }> = {
  'search+translate':           { understanding: 95, creativity: 70, efficiency: 80 },
  'search+create':              { understanding: 80, creativity: 95, efficiency: 75 },
  'search+agent':               { understanding: 85, creativity: 70, efficiency: 95 },
  'translate+create':           { understanding: 75, creativity: 90, efficiency: 80 },
  'translate+agent':            { understanding: 85, creativity: 75, efficiency: 90 },
  'create+agent':               { understanding: 70, creativity: 90, efficiency: 90 },
  'search+translate+create':    { understanding: 90, creativity: 90, efficiency: 80 },
  'search+translate+agent':     { understanding: 90, creativity: 75, efficiency: 90 },
  'search+create+agent':        { understanding: 85, creativity: 90, efficiency: 90 },
  'translate+create+agent':     { understanding: 80, creativity: 90, efficiency: 90 },
};

// ─── Capability Node Data ───────────────────────────────────

const capabilities = [
  { id: 'search',    emoji: '🔍', label: '搜索', desc: '全网信息检索', before: '手动查资料', after: '意图检索', x: 92,  y: 68 },
  { id: 'translate', emoji: '🌐', label: '翻译', desc: '跨语言理解',   before: '逐句翻译',   after: '语义转换', x: 642, y: 58 },
  { id: 'create',    emoji: '🎨', label: '创作', desc: '内容生成创造', before: '空白文档',   after: '多模态生成', x: 96,  y: 328 },
  { id: 'agent',     emoji: '⚙️', label: 'Agent', desc: '自主决策执行', before: '重复点击',   after: '任务执行', x: 646, y: 318 },
];

function getCapabilityPosition(index: number, isMobile: boolean) {
  if (!isMobile) return { x: capabilities[index]!.x, y: capabilities[index]!.y };
  return [
    { x: 38, y: 30 },
    { x: 210, y: 30 },
    { x: 38, y: 188 },
    { x: 210, y: 188 },
  ][index]!;
}

// ─── Node Label Components ──────────────────────────────────

function CapabilityLabel({
  emoji,
  label,
  desc,
  before,
  after,
  active,
}: {
  emoji: string;
  label: string;
  desc: string;
  before: string;
  after: string;
  active: boolean;
}) {
  return (
    <div className="software-node-label select-none">
      <div className="software-node-label__top">
        <span className="software-node-label__icon">{emoji}</span>
        <span className="software-node-label__status">{active ? 'AI 编排' : '手动工具'}</span>
      </div>
      <span className="software-node-label__title">{label}</span>
      <span className="software-node-label__desc">{desc}</span>
      <div className="software-node-label__shift">
        <span>{active ? after : before}</span>
      </div>
    </div>
  );
}

function CoreLabel({ agiMode }: { agiMode: boolean }) {
  return (
    <div className="software-core-label select-none">
      <span className="software-core-label__halo" />
      <span className="software-core-label__icon">{agiMode ? '🧠' : '⚡'}</span>
      <span className="software-core-label__title">{agiMode ? 'QWEN AGI' : 'QWEN OS'}</span>
      <span className="software-core-label__desc">{agiMode ? '完整自动编排中枢' : '等待能力接入'}</span>
    </div>
  );
}

function ResultLabel({ name, slogan }: { name: string; slogan: string }) {
  return (
    <div className="software-result-label select-none">
      <span className="software-result-label__tag">OUTPUT</span>
      <span className="software-result-label__title">{name}</span>
      <span className="software-result-label__desc">{slogan}</span>
    </div>
  );
}

// ─── Build helpers ──────────────────────────────────────────

function buildNodes(activeIds: Set<string>, agiMode: boolean, comboResult: ComboResult | null, isMobile: boolean): Node[] {
  const capNodes: Node[] = capabilities.map((cap, index) => ({
    id: cap.id,
    type: 'default' as const,
    data: {
      label: (
        <CapabilityLabel
          emoji={cap.emoji}
          label={cap.label}
          desc={cap.desc}
          before={cap.before}
          after={cap.after}
          active={activeIds.has(cap.id)}
        />
      ),
    },
    position: getCapabilityPosition(index, isMobile),
    draggable: false,
    selectable: false,
    className: `capability-node${activeIds.has(cap.id) ? ' active' : ''}`,
  }));

  const coreNode: Node = {
    id: 'qwen-core',
    type: 'default',
    data: { label: <CoreLabel agiMode={agiMode} /> },
    position: isMobile ? { x: 126, y: 338 } : { x: 356, y: 206 },
    draggable: false,
    selectable: false,
    className: `core-node${agiMode ? ' agi-active' : ''}`,
  };

  const resultNodes: Node[] = comboResult
    ? [{
        id: 'result',
        type: 'default' as const,
        data: { label: <ResultLabel name={comboResult.name} slogan={comboResult.slogan} /> },
        position: isMobile ? { x: 108, y: 462 } : { x: 342, y: 404 },
        draggable: false,
        selectable: false,
        className: 'result-node',
      }]
    : [];

  return [...capNodes, coreNode, ...resultNodes];
}

function buildEdges(activeIds: Set<string>): Edge[] {
  return [
    { id: 'e-search',    source: 'search',    target: 'qwen-core', animated: activeIds.has('search'), className: activeIds.has('search') ? 'active-flow-edge' : '' },
    { id: 'e-translate', source: 'translate', target: 'qwen-core', animated: activeIds.has('translate'), className: activeIds.has('translate') ? 'active-flow-edge' : '' },
    { id: 'e-create',    source: 'create',    target: 'qwen-core', animated: activeIds.has('create'), className: activeIds.has('create') ? 'active-flow-edge' : '' },
    { id: 'e-agent',     source: 'agent',     target: 'qwen-core', animated: activeIds.has('agent'), className: activeIds.has('agent') ? 'active-flow-edge' : '' },
  ];
}

// ─── Component ──────────────────────────────────────────────

function WorkflowEditor() {
  const { setResult, setScreen } = useApp();
  const performance = usePerformance();
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());
  const [agiMode, setAgiMode] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  const activeArray = useMemo(() => [...activeIds], [activeIds]);
  const comboResult = useMemo(() => getComboResult(activeArray), [activeArray]);
  const activeCount = activeIds.size;
  const fitPadding = isMobile ? 0.08 : 0.15;

  const [nodes, setNodes, onNodesChange] = useNodesState(buildNodes(activeIds, agiMode, comboResult, isMobile));
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildEdges(activeIds));

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Sync nodes/edges when state changes
  useEffect(() => {
    setNodes(buildNodes(activeIds, agiMode, comboResult, isMobile));
    setEdges(buildEdges(activeIds));
  }, [activeIds, agiMode, comboResult, isMobile, setNodes, setEdges]);

  // Handle node click
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (!capabilities.some((c) => c.id === node.id)) return;

    setActiveIds((prev) => {
      const next = new Set(prev);
      if (next.has(node.id)) {
        next.delete(node.id);
      } else {
        next.add(node.id);
      }

      const wasAll = prev.size === 4;
      const isAll = next.size === 4;
      if (isAll && !wasAll) {
        setAgiMode(true);
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 1000);
      } else if (!isAll && wasAll) {
        setAgiMode(false);
      }

      return next;
    });
  }, []);

  // Handle generate
  const handleGenerate = useCallback(() => {
    if (!comboResult) return;

    const statsKey = [...activeArray].sort().join('+');
    const stats = activeArray.length === 4
      ? { understanding: 95, creativity: 95, efficiency: 95 }
      : statsMap[statsKey] ?? { understanding: 80, creativity: 80, efficiency: 80 };

    setResult({
      name: comboResult.name,
      slogan: comboResult.slogan,
      qwenRole: comboResult.slogan,
      stats,
    });
    setScreen('awakening');
  }, [comboResult, activeArray, setResult, setScreen]);

  const onConnect: OnConnect = useCallback(() => {}, []);

  const handleAutoCompose = useCallback(() => {
    setActiveIds(new Set(capabilities.map((cap) => cap.id)));
    setAgiMode(true);
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 1000);
  }, []);

  const handleReset = useCallback(() => {
    setActiveIds(new Set());
    setAgiMode(false);
  }, []);

  if (performance === 'degraded') {
    return (
      <div className={`workflow-editor workflow-editor--simple workflow-editor--active-${activeCount}`}>
        {showFlash && <div className="agi-flash-overlay" />}

        <div className="workflow-editor__brief">
          <div>
            <p className="workflow-editor__eyebrow">SOFTWARE ORCHESTRATION</p>
            <h2>把零散工具编排成 AI 工作流</h2>
          </div>
          <p>移动端使用轻量模式，保留核心互动，减少画布和粒子带来的卡顿。</p>
        </div>

        <div className="workflow-simple">
          <div className="workflow-simple__header">
            <span>BEFORE</span>
            <strong>手动工具堆叠</strong>
          </div>

          <div className="workflow-simple__grid">
            {capabilities.map((cap) => {
              const active = activeIds.has(cap.id);
              return (
                <button
                  key={cap.id}
                  type="button"
                  className={`workflow-simple-card${active ? ' active' : ''}`}
                  onClick={() => {
                    setActiveIds((prev) => {
                      const next = new Set(prev);
                      if (next.has(cap.id)) next.delete(cap.id);
                      else next.add(cap.id);

                      const isAll = next.size === 4;
                      setAgiMode(isAll);
                      if (isAll && prev.size !== 4) {
                        setShowFlash(true);
                        setTimeout(() => setShowFlash(false), 700);
                      }
                      return next;
                    });
                  }}
                >
                  <span className="workflow-simple-card__icon">{cap.emoji}</span>
                  <span className="workflow-simple-card__title">{cap.label}</span>
                  <span className="workflow-simple-card__desc">{active ? cap.after : cap.before}</span>
                </button>
              );
            })}
          </div>

          <div className={`workflow-simple-core${activeCount > 0 ? ' active' : ''}`}>
            <span>{agiMode ? 'QWEN AGI' : 'QWEN OS'}</span>
            <strong>{comboResult?.name ?? `${activeCount}/4 能力接入`}</strong>
          </div>

          <div className="workflow-simple__header workflow-simple__header--right">
            <span>AFTER</span>
            <strong>AI 自动编排</strong>
          </div>
        </div>

        <div className="workflow-editor__footer">
          <div className="workflow-progress" aria-label={`已接入 ${activeCount} 个能力`}>
            {capabilities.map((cap) => (
              <span
                key={cap.id}
                className={`workflow-progress__step${activeIds.has(cap.id) ? ' active' : ''}`}
              >
                {cap.label}
              </span>
            ))}
          </div>

          <div className={`soul-copy ${comboResult ? 'visible' : ''}`}>
            {comboResult?.slogan ?? '至少接入两个能力后，软件会从单点工具变成可组合的智能工作流。'}
          </div>

          <div className="workflow-editor__actions">
            <button className="workflow-secondary-action" type="button" onClick={handleAutoCompose}>
              一键接入千问 AI
            </button>
            <button className="workflow-ghost-action" type="button" onClick={handleReset}>
              重置
            </button>
          </div>

          <button
            className={`btn-primary ${comboResult ? 'can-generate' : ''}`}
            onClick={handleGenerate}
          >
            生成我的 AI 新物种
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`workflow-editor workflow-editor--active-${activeCount}`}>
      {showFlash && <div className="agi-flash-overlay" />}

      <div className="workflow-editor__brief">
        <div>
          <p className="workflow-editor__eyebrow">SOFTWARE ORCHESTRATION</p>
          <h2>把零散工具编排成 AI 工作流</h2>
        </div>
        <p>点击能力节点，观察千问如何把搜索、翻译、创作和执行连接成一个会主动完成任务的软件系统。</p>
      </div>

      <div className="workflow-editor__canvas">
        <div className="workflow-editor__ambient" aria-hidden="true">
          <span className="software-orbit software-orbit--one" />
          <span className="software-orbit software-orbit--two" />
          <span className="software-orbit software-orbit--three" />
          <span className="software-scanline" />
        </div>

        <div className="software-stage-label software-stage-label--before">
          <span>BEFORE</span>
          <strong>手动工具堆叠</strong>
        </div>
        <div className="software-stage-label software-stage-label--after">
          <span>AFTER</span>
          <strong>AI 自动编排</strong>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: fitPadding }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
        />
      </div>

      <div className="workflow-editor__footer">
        <div className="workflow-progress" aria-label={`已接入 ${activeCount} 个能力`}>
          {capabilities.map((cap) => (
            <span
              key={cap.id}
              className={`workflow-progress__step${activeIds.has(cap.id) ? ' active' : ''}`}
            >
              {cap.label}
            </span>
          ))}
        </div>

        <div className={`soul-copy ${comboResult ? 'visible' : ''}`}>
          {comboResult?.slogan ?? '至少接入两个能力后，软件会从单点工具变成可组合的智能工作流。'}
        </div>

        <div className="workflow-editor__actions">
          <button
            className="workflow-secondary-action"
            type="button"
            onClick={handleAutoCompose}
          >
            一键接入千问 AI
          </button>
          <button
            className="workflow-ghost-action"
            type="button"
            onClick={handleReset}
          >
            重置
          </button>
        </div>

        <button
          className={`btn-primary ${comboResult ? 'can-generate' : ''}`}
          onClick={handleGenerate}
        >
          生成我的 AI 新物种
        </button>
      </div>
    </div>
  );
}

export default WorkflowEditor;
