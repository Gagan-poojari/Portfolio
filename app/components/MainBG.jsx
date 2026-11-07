'use client';

import React, { useEffect, useRef, useState } from 'react';

// ── Cinematic Ambient Stardust ───────────────────────────────────────────────
function AmbientStardust({ active }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!active) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles;

    function makeParticles() {
      const count = Math.min(50, Math.max(25, Math.floor((W * H) / 35000)));
      const arr = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.2 + 0.4,
          alpha: Math.random() * 0.35 + 0.08,
          speed: Math.random() * 0.4 + 0.2,
          phase: Math.random() * Math.PI * 2,
        });
      }
      return arr;
    }

    function resize() {
      if (!canvas) return;
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      particles = makeParticles();
    }
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    function render() {
      t += 0.01;
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const a = p.alpha * (0.6 + 0.4 * Math.sin(t * p.speed + p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
        ctx.fill();

        // Very slow drifting upward
        p.y -= 0.15;
        if (p.y < -10) p.y = H + 10;
      }

      frameRef.current = requestAnimationFrame(render);
    }
    frameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.75 }}
    />
  );
}

// ── Interactive Mouse Spotlight ───────────────────────────────────────────────
function InteractiveSpotlight() {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setPos({ x, y });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 transition-opacity duration-700"
      style={{
        background: `radial-gradient(850px circle at ${pos.x}% ${pos.y}%, rgba(255, 255, 255, 0.04) 0%, transparent 65%)`,
      }}
    />
  );
}

// ── Architectural Cartesian Grid ──────────────────────────────────────────────
function ArchitecturalGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse 75% 65% at 50% 45%, black 25%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 45%, black 25%, transparent 80%)',
      }}
    />
  );
}

// ── Micro Film Grain ─────────────────────────────────────────────────────────
function StaticFilmGrain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 140;
    canvas.width = size;
    canvas.height = size;
    const imgData = ctx.createImageData(size, size);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const v = Math.random() * 255;
      imgData.data[i] = v;
      imgData.data[i + 1] = v;
      imgData.data[i + 2] = v;
      imgData.data[i + 3] = 16; // soft grain
    }
    ctx.putImageData(imgData, 0, 0);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 w-full h-full opacity-40 mix-blend-overlay"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

// ── Cinematic Vignette ────────────────────────────────────────────────────────
function CinematicVignette() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(3,4,6,0.65) 75%, #030406 100%)',
      }}
    />
  );
}

export default function MainBG({ children, className = '' }) {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '120px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-[#030406] ${className}`}
    >
      {/* Deep Luxury Ambient Radial Lights */}
      <div 
        className="pointer-events-none absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full blur-[140px] opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)' }}
      />
      <div 
        className="pointer-events-none absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)' }}
      />

      {/* Cartesian Grid Blueprint */}
      <ArchitecturalGrid />

      {/* Interactive Cursor Spotlight */}
      <InteractiveSpotlight />

      {/* Slow Ambient Stardust particles */}
      <AmbientStardust active={isInView} />

      {/* Cinematic Vignette */}
      <CinematicVignette />

      {/* Tactile Micro-Film Grain */}
      <StaticFilmGrain />

      {/* Children Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
