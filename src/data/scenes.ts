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
