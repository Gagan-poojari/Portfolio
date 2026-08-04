'use client';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPencilAlt } from 'react-icons/fa';

export default function ArtAtelierHero({ activeCategory, setActiveCategory }) {
  const canvasRef = useRef(null);

  // Subtle Ambient Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.4 + 0.1,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      pulse: Math.random() * 0.02 + 0.005,
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Warm natural museum spotlight glow
      const gradient = ctx.createRadialGradient(mouseX, mouseY, 5, mouseX, mouseY, 350);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.alpha += Math.sin(Date.now() * p.pulse) * 0.008;
        const clampedAlpha = Math.max(0.1, Math.min(0.5, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${clampedAlpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const categories = [
    { id: 'all', label: 'All Works' },
    { id: 'portrait', label: 'Portraits' },
    { id: 'sports', label: 'Sports' },
    { id: 'spiritual', label: 'Fine Art' },
  ];

  return (
    <section className="relative min-h-[58vh] flex flex-col justify-center items-center pt-28 pb-12 px-4 overflow-hidden border-b border-white/10">
      
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto z-0" />

      <div className="relative z-10 max-w-4xl text-center space-y-6">

        {/* Minimalist Subtitle Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-white/5 text-white/70 text-xs font-mono tracking-widest uppercase"
        >
          <FaPencilAlt className="text-white/80 text-[10px]" />
          <span>Gagan Poojari - Sketches & Drawings</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none font-mono uppercase"
        >
          Graphite <span className="text-white/40 font-light">&</span> Charcoal
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto text-xs sm:text-sm text-zinc-400 font-mono leading-relaxed"
        >
          A curated collection of hand-drawn graphite portraits and charcoal studies. Built with focus, precision, and heavy shadow depth.
        </motion.p>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2"
        >
          {[
            { value: '120+', label: 'Hours' },
            { value: '5+', label: 'Original Works' },
            { value: 'HB-10B', label: 'Graphite Range' },
            { value: 'A3 & A4', label: 'Format' },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-3 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm flex flex-col items-center hover:border-white/20 transition-colors"
            >
              <span className="text-lg font-bold font-mono text-white">{stat.value}</span>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Category Pill Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 pt-3"
        >
          {categories.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1 rounded-full text-xs font-mono transition-all duration-200 ${
                  active
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
