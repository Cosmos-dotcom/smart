import { Suspense } from 'react';
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
        <Suspense fallback={null}>
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
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Hero3DModel;
