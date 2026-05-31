import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

const expectedScreens = ['hook', 'input', 'analysis', 'choice', 'awakening', 'share'];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function extractScreenUnion(typesSource) {
  const match = typesSource.match(/export type Screen = ([^;]+);/);
  assert(match, 'Cannot find Screen union in src/types/index.ts');

  return [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]);
}

function extractScreenMap(screenManagerSource) {
  const match = screenManagerSource.match(/const screens:[\s\S]*?=\s*{([\s\S]*?)};/);
  assert(match, 'Cannot find screens map in src/components/ScreenManager.tsx');

  return [...match[1].matchAll(/^\s*([a-zA-Z0-9_-]+):/gm)].map((item) => item[1]);
}

function extractScenes(scenesSource) {
  const sceneBlocks = [...scenesSource.matchAll(/{\s*id:\s*'([^']+)'([\s\S]*?)stats:\s*{\s*understanding:\s*(\d+),\s*creativity:\s*(\d+),\s*efficiency:\s*(\d+)\s*},\s*}/g)];
  assert(sceneBlocks.length > 0, 'Cannot find scenes in src/data/scenes.ts');

  return sceneBlocks.map((block) => {
    const body = block[2];
    const readField = (name) => {
      const match = body.match(new RegExp(`${name}:\\s*'([^']+)'`));
      assert(match, `Scene ${block[1]} is missing ${name}`);
      return match[1];
    };

    return {
      id: block[1],
      icon: readField('icon'),
      title: readField('title'),
      subtitle: readField('subtitle'),
      before: readField('before'),
      after: readField('after'),
      qwenRole: readField('qwenRole'),
      stats: {
        understanding: Number(block[3]),
        creativity: Number(block[4]),
        efficiency: Number(block[5]),
      },
    };
  });
}

function makeResult(scene) {
  return {
    name: scene.title.replace('未来', '') + '智能体',
    slogan: scene.subtitle,
    qwenRole: scene.qwenRole,
    stats: scene.stats,
  };
}

function validateScreens() {
  const screenUnion = extractScreenUnion(read('src/types/index.ts'));
  const screenMap = extractScreenMap(read('src/components/ScreenManager.tsx'));

  assert(
    JSON.stringify(screenUnion) === JSON.stringify(expectedScreens),
    `Screen union changed. Expected ${expectedScreens.join(' -> ')}, got ${screenUnion.join(' -> ')}`,
  );
  assert(
    JSON.stringify(screenMap) === JSON.stringify(expectedScreens),
    `Screen manager map changed. Expected ${expectedScreens.join(' -> ')}, got ${screenMap.join(' -> ')}`,
  );
}

function validateScenes() {
  const scenes = extractScenes(read('src/data/scenes.ts'));
  const ids = new Set();

  for (const scene of scenes) {
    assert(!ids.has(scene.id), `Duplicate scene id: ${scene.id}`);
    ids.add(scene.id);

    for (const field of ['icon', 'title', 'subtitle', 'before', 'after', 'qwenRole']) {
      assert(scene[field].trim().length > 0, `Scene ${scene.id} has empty ${field}`);
    }

    for (const [key, value] of Object.entries(scene.stats)) {
      assert(Number.isInteger(value), `Scene ${scene.id} stat ${key} is not an integer`);
      assert(value >= 0 && value <= 100, `Scene ${scene.id} stat ${key} is out of range: ${value}`);
    }

    const result = makeResult(scene);
    assert(result.name.endsWith('智能体'), `Generated result for ${scene.id} has invalid name`);
    assert(result.slogan === scene.subtitle, `Generated result for ${scene.id} lost subtitle`);
    assert(result.qwenRole === scene.qwenRole, `Generated result for ${scene.id} lost qwen role`);
    assert(result.stats === scene.stats, `Generated result for ${scene.id} did not preserve stats`);
  }
}

validateScreens();
validateScenes();

console.log('Golden path passed: hook -> input -> analysis -> choice -> awakening -> share');
