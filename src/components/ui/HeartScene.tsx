import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';

interface HeartMeshProps {
  rotationAngle: number;
  cameraZ: number;
  scale: number;
}

function HeartMesh({ rotationAngle, cameraZ, scale }: HeartMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // Heart shape with lobes at top, point at bottom
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.65);
    shape.bezierCurveTo(0, -0.65, -0.15, -0.9, -0.55, -0.9);
    shape.bezierCurveTo(-1.1, -0.9, -1.1, -0.35, -1.1, -0.35);
    shape.bezierCurveTo(-1.1, 0.1, -0.75, 0.54, 0, 0.9);
    shape.bezierCurveTo(0.75, 0.54, 1.1, 0.1, 1.1, -0.35);
    shape.bezierCurveTo(1.1, -0.35, 1.1, -0.9, 0.55, -0.9);
    shape.bezierCurveTo(0.15, -0.9, 0, -0.65, 0, -0.65);

    const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 12, bevelSize: 0.2, bevelThickness: 0.15, curveSegments: 32 };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotationAngle;
    }
    if (matRef.current) {
      matRef.current.envMapIntensity = 1.2 + Math.sin(rotationAngle * 2) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0} floatIntensity={0.15}>
      <mesh ref={meshRef} geometry={geometry} scale={scale} castShadow receiveShadow>
        <meshPhysicalMaterial
          ref={matRef}
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.05}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          transmission={0.3}
          thickness={1.5}
          ior={2.0}
          envMapIntensity={1.5}
          reflectivity={1}
          specularIntensity={1}
          specularColor={new THREE.Color('#ffffff')}
          sheen={0.5}
          sheenRoughness={0.3}
          sheenColor={new THREE.Color('#e8e8e8')}
        />
      </mesh>
    </Float>
  );
}

// Floating glass particles
function GlassParticles({ count = 25 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 14,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 8 - 2,
      scale: 0.02 + Math.random() * 0.06,
      speed: 0.1 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.offset) * 0.3,
        p.y + Math.cos(t * p.speed * 0.7 + p.offset) * 0.2,
        p.z,
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshPhysicalMaterial
        color="#ffffff"
        metalness={0.3}
        roughness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        transmission={0.5}
        thickness={0.5}
        transparent
        opacity={0.4}
      />
    </instancedMesh>
  );
}

function CameraController({ z }: { z: number }) {
  useFrame(({ camera }) => {
    camera.position.z = z;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

interface HeartSceneProps {
  rotationAngle: number;
  cameraZ: number;
  heartScale: number;
}

export function HeartScene({ rotationAngle, cameraZ, heartScale }: HeartSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ powerPreference: 'high-performance', antialias: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={['#050507']} />

      {/* Cinematic lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-4, 3, -3]} intensity={0.4} color="#e0e0e0" />
      <pointLight position={[0, -3, 4]} intensity={0.3} color="#cccccc" />
      <spotLight position={[0, 8, 4]} intensity={0.6} angle={0.4} penumbra={0.8} color="#ffffff" castShadow />

      <CameraController z={cameraZ} />
      <HeartMesh rotationAngle={rotationAngle} cameraZ={cameraZ} scale={heartScale} />
      <GlassParticles count={25} />
    </Canvas>
  );
}
