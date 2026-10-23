import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function FloatingPlanet() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
      ref.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
    }
  });
  return (
    <mesh ref={ref} position={[3, 0, -5]}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <meshStandardMaterial
        color="#4a00ff"
        emissive="#00f0ff"
        emissiveIntensity={0.4}
        roughness={0.3}
        metalness={0.8}
      />
    </mesh>
  );
}

function Rings() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.getElapsedTime() * 0.05;
  });
  return (
    <mesh ref={ref} position={[3, 0, -5]} rotation={[Math.PI / 3, 0, 0]}>
      <torusGeometry args={[2, 0.02, 16, 100]} />
      <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} />
    </mesh>
  );
}

function RotatingStars() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 0.01;
  });
  return (
    <group ref={ref}>
      <Stars radius={80} depth={60} count={6000} factor={4} saturation={0} fade speed={0.5} />
    </group>
  );
}

export default function FuturisticBackground() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.7, 0.4]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        background: 'radial-gradient(circle at 20% 30%, #0a0a2a, #02020a 70%)',
        opacity,
        y,
      }}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
        <pointLight position={[-10, -10, -5]} intensity={0.6} color="#ff2bd6" />
        <RotatingStars />
        <FloatingPlanet />
        <Rings />
      </Canvas>
    </motion.div>
  );
}