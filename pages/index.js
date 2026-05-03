import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, MeshDistortMaterial, Float } from '@react-three/drei';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import p5 to prevent Next.js Server-Side Rendering conflicts
const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), { ssr: false });

// --- 3D WEBGL COMPONENT ---
// Creates a fluid, distorting geometric wireframe representing digital works
const CyberArtifact = () => {
  const meshRef = useRef();
  
  useFrame((state) => {
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial 
          color="#ffffff" 
          wireframe={true} 
          distort={0.4} 
          speed={1.5} 
          roughness={0.2} 
          metalness={0.8} 
        />
      </mesh>
    </Float>
  );
};

// --- P5.JS GENERATIVE OVERLAY ---
// Minimalist, mouse-reactive connection nodes
let particles = [];
const P5Overlay = (p5) => {
  p5.setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: p5.random(p5.width),
        y: p5.random(p5.height),
        vx: p5.random(-0.5, 0.5),
        vy: p5.random(-0.5, 0.5)
      });
    }
  };

  p5.draw = (p5) => {
    p5.clear(); // Transparent background to show 3D canvas
    p5.stroke(255, 35);
    p5.strokeWeight(1);
    
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      
      // Bounce off edges
      if (p.x < 0 || p.x > p5.width) p.vx *= -1;
      if (p.y < 0 || p.y > p5.height) p.vy *= -1;
      
      // Draw connecting lines if near the mouse
      let d = p5.dist(p5.mouseX, p5.mouseY, p.x, p.y);
      if (d < 180) {
        p5.line(p5.mouseX, p5.mouseY, p.x, p.y);
      }
    });
  };

  p5.windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };
};

// --- MAIN PAGE LAYOUT ---
export default function Home() {
  return (
    <div style={{ backgroundColor: '#050505', width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      
      {/* LAYER 1: 3D Environment */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.1} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <Environment preset="studio" />
          <CyberArtifact />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
        </Canvas>
      </div>

      {/* LAYER 2: p5.js Interactive Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}>
        <Sketch 
          setup={(p5, parentRef) => P5Overlay(p5).setup(p5, parentRef)} 
          draw={(p5) => P5Overlay(p5).draw(p5)} 
          windowResized={(p5) => P5Overlay(p5).windowResized(p5)} 
        />
      </div>

      {/* LAYER 3: Minimalist Interface */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', height: '100%', padding: '2.5rem', color: '#fff', fontFamily: 'Helvetica, sans-serif' }}
      >
        {/* Navigation */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', mixBlendMode: 'difference' }}>INVOXEA</div>
          <nav style={{ display: 'flex', gap: '3rem', fontSize: '0.75rem', mixBlendMode: 'difference' }}>
            <a href="#" style={{ cursor: 'pointer', textDecoration: 'none', color: '#fff' }}>Collections</a>
            <a href="#" style={{ cursor: 'pointer', textDecoration: 'none', color: '#fff' }}>Digital Works</a>
            <a href="#" style={{ cursor: 'pointer', textDecoration: 'none', color: '#fff' }}>Events</a>
            <a href="#" style={{ cursor: 'pointer', textDecoration: 'none', color: '#fff' }}>Login / Vault</a>
          </nav>
        </header>

        {/* Center Call to Action */}
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', pointerEvents: 'none' }}>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{ fontSize: '5rem', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0, textAlign: 'center', mixBlendMode: 'difference', fontWeight: '300' }}
          >
            Enter System
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            style={{ marginTop: '1.5rem', letterSpacing: '0.15em', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}
          >
            Physical // Digital // Spatial
          </motion.p>
        </main>

        {/* Footer / Utilities */}
        <footer style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <span>© 2026 INVOXEA LTD.</span>
          <span>System Active // Latency: 12ms</span>
        </footer>
      </motion.div>
    </div>
  );
}
