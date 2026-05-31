import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { assetPath } from '../utils/assetPath';

const BACKGROUNDS = {
  hero: assetPath('assets/backgrounds/hero-ai-chamber.png'),
  evolution: assetPath('assets/backgrounds/evolution-neural-field.png'),
  result: assetPath('assets/backgrounds/result-awakening-lab.png'),
} as const;

function SceneBackground() {
  const { state } = useApp();

  const image = useMemo(() => {
    switch (state.screen) {
      case 'hook':
      case 'analysis':
        return BACKGROUNDS.hero;
      case 'awakening':
      case 'share':
        return BACKGROUNDS.result;
      case 'input':
      case 'choice':
      default:
        return BACKGROUNDS.evolution;
    }
  }, [state.screen]);

  return (
    <div className="scene-background" aria-hidden="true">
      <div
        key={image}
        className="scene-background__image"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="scene-background__shade" />
      <div className="scene-background__focus" />
    </div>
  );
}

export default SceneBackground;
