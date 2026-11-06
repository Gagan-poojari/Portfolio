'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FaDice, FaPencilAlt, FaFire } from 'react-icons/fa';

export default function ArtAtelierHero({ 
  activeCategory, 
  setActiveCategory, 
  onSurpriseMe, 
  onOpenSandbox 
}) {
  const categories = [
    { id: 'all', label: 'All Works' },
    { id: 'portrait', label: 'Portraits' },
    { id: 'sports', label: 'Sports' },
    { id: 'spiritual', label: 'Fine Art' },
  ];

  return (
    <section className="relative pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden font-body">
      
      {/* Subtle organic studio vignette */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 15%, rgba(255, 255, 255, 0.08) 0%, transparent 55%),
            radial-gradient(circle at 85% 85%, rgba(199, 6, 28, 0.04) 0%, transparent 40%),
            radial-gradient(circle at 15% 85%, rgba(41, 123, 201, 0.04) 0%, transparent 40%)
          `
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        
        {/* Human Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-sm text-xs font-mono text-zinc-300"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>0% Prompts &bull; 100% Pencils &amp; Smudged Fingers</span>
        </motion.div>

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-wider text-white uppercase leading-[0.95]">
            Drawn By Hand.
          </h1>
          <p className="font-display text-2xl sm:text-3xl text-zinc-400 tracking-wide uppercase">
            Charcoal, Graphite &amp; 140+ Hours of Pure Focus
          </p>
        </motion.div>

        {/* Human Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300 leading-relaxed font-normal"
        >
          I build software by day and sketch with pencils by night. In a world where AI creates images in 3 seconds, these are 5 pieces that took 30+ hours of squinting at paper with an 8B pencil, blending with tortillons, and rubbing charcoal on my jeans.
        </motion.p>

        {/* Quick Action Pills for Visitors */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-2"
        >
          <button
            onClick={onSurpriseMe}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-all shadow-sm cursor-pointer"
          >
            <FaDice className="text-sm text-amber-400" />
            <span>Surprise Me (Random Pick)</span>
          </button>

          <button
            onClick={onOpenSandbox}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-all shadow-md cursor-pointer"
          >
            <FaPencilAlt className="text-xs" />
            <span>Doodle in my Sketchpad</span>
          </button>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 pt-4"
        >
          {categories.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10'
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