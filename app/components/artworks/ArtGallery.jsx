'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaExpand, 
  FaSearchPlus, 
  FaClock, 
  FaCheck, 
  FaTh, 
  FaThLarge, 
  FaSlidersH,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

export default function ArtGallery({
  artworks,
  activeCategory,
  onSelectArtwork,
  magnifierActive,
  audioEnabled
}) {
  const [hoveredId, setHoveredId] = useState(null);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, show: false, artworkId: null });
  
  // Layout Mode: 'fit' (4-col compact - all in 1 screen), 'detailed' (2-col), 'filmstrip' (horizontal)
  const [viewLayout, setViewLayout] = useState('fit');
  
  // Dynamic Studio Spotlight Angle (in degrees)
  const [spotlightAngle, setSpotlightAngle] = useState(45);

  const filteredArtworks = activeCategory === 'all'
    ? artworks
    : artworks.filter(a => a.categorySlug === activeCategory);

  const triggerAudioClick = () => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {
      // Audio fallback
    }
  };

  const handleMouseMove = (e, artwork) => {
    if (!magnifierActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLensPos({
      x,
      y,
      percentX: (x / rect.width) * 100,
      percentY: (y / rect.height) * 100,
      show: true,
      artworkId: artwork.id,
      imageSrc: artwork.image
    });
  };

  const handleMouseLeave = () => {
    setLensPos(prev => ({ ...prev, show: false }));
  };

  // Compute CSS box-shadow for museum spotlight based on angle
  const rad = (spotlightAngle * Math.PI) / 180;
  const shadowX = Math.round(Math.cos(rad) * 12);
  const shadowY = Math.round(Math.sin(rad) * 12);

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Gallery Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4 font-mono">
        <div>
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Exhibition Works ({filteredArtworks.length})
          </h2>
          <p className="text-xs text-white/40 mt-0.5">
            {magnifierActive 
              ? 'Hover to inspect pencil strokes with precision glass lens' 
              : 'Click any piece to inspect'}
          </p>
        </div>

        {/* Right Tools: Layout Switcher + Spotlight Angle Slider */}
        <div className="flex items-center gap-3">
          
          {/* Studio Spotlight Angle Slider */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60">
            <FaSlidersH className="text-white/40 text-[10px]" />
            <span className="text-[10px]">Spotlight:</span>
            <input
              type="range"
              min="0"
              max="360"
              value={spotlightAngle}
              onChange={(e) => setSpotlightAngle(Number(e.target.value))}
              className="w-16 accent-white cursor-pointer"
              title="Adjust Museum Spotlight Angle"
            />
            <span className="text-[10px] w-6 text-right font-bold text-white">{spotlightAngle}°</span>
          </div>

          {/* Layout Mode Buttons */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5">
            <button
              onClick={() => setViewLayout('fit')}
              className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 transition-all ${
                viewLayout === 'fit' ? 'bg-white text-black font-bold shadow' : 'text-white/50 hover:text-white'
              }`}
              title="Compact View - Fit all 4 artworks on 1 screen"
            >
              <FaTh className="text-[10px]" />
              <span>Compact</span>
            </button>

            <button
              onClick={() => setViewLayout('detailed')}
              className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 transition-all ${
                viewLayout === 'detailed' ? 'bg-white text-black font-bold shadow' : 'text-white/50 hover:text-white'
              }`}
              title="Detailed Showcase"
            >
              <FaThLarge className="text-[10px]" />
              <span>Showcase</span>
            </button>
          </div>

        </div>
      </div>

      {/* GALLERY DISPLAY */}
      {viewLayout === 'fit' ? (
        
        /* 4-COLUMN COMPACT VIEW - FITS CLEANLY ON ONE SCREEN! */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredArtworks.map((artwork, idx) => {
              const isHovered = hoveredId === artwork.id;
              const isLensHere = lensPos.show && lensPos.artworkId === artwork.id;

              return (
                <motion.div
                  key={artwork.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onMouseEnter={() => {
                    setHoveredId(artwork.id);
                    triggerAudioClick();
                  }}
                  onMouseLeave={() => {
                    setHoveredId(null);
                    handleMouseLeave();
                  }}
                  className="group relative rounded-xl bg-[#09090c] border border-white/10 overflow-hidden shadow-xl transition-all duration-300 hover:border-white/30"
                  style={{
                    boxShadow: isHovered 
                      ? `${shadowX}px ${shadowY}px 30px rgba(255,255,255,0.12)` 
                      : '0 8px 24px rgba(0,0,0,0.6)'
                  }}
                >
                  
                  {/* Image Container with compact height */}
                  <div
                    onClick={() => {
                      triggerAudioClick();
                      onSelectArtwork(artwork);
                    }}
                    onMouseMove={(e) => handleMouseMove(e, artwork)}
                    onMouseLeave={handleMouseLeave}
                    className="relative h-[280px] w-full overflow-hidden bg-black cursor-pointer flex items-center justify-center p-2"
                  >
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className={`max-h-full w-auto max-w-full object-contain transition-transform duration-300 ${
                        isHovered ? 'scale-105' : 'scale-100'
                      }`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />

                    {/* Glass Loupe Lens */}
                    {isLensHere && (
                      <div
                        className="pointer-events-none absolute w-36 h-36 rounded-full border-2 border-white/80 shadow-[0_0_20px_rgba(0,0,0,0.9)] overflow-hidden z-30"
                        style={{
                          left: lensPos.x - 72,
                          top: lensPos.y - 72,
                          backgroundImage: `url(${artwork.image})`,
                          backgroundPosition: `${lensPos.percentX}% ${lensPos.percentY}%`,
                          backgroundSize: '280%',
                          backgroundColor: '#000'
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-full h-[1px] bg-white/30" />
                          <div className="h-full w-[1px] bg-white/30 absolute" />
                          <span className="absolute bottom-1.5 text-[8px] font-mono text-white bg-black/80 border border-white/20 px-1.5 py-0.5 rounded-full">
                            2.5x
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Hover Overlay Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30 backdrop-blur-[1px]">
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black font-mono font-bold text-[11px] shadow-lg transform translate-y-1 group-hover:translate-y-0 transition-transform">
                        <FaExpand className="text-[10px]" />
                        <span>Inspect</span>
                      </div>
                    </div>

                  </div>

                  {/* Compact Info Footer */}
                  <div className="p-3.5 bg-[#08080b] border-t border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold font-mono text-white truncate group-hover:text-zinc-200">
                        {artwork.title}
                      </h3>
                      <span className="text-[10px] font-mono text-white/40">{artwork.timeSpent}</span>
                    </div>

                    <p className="text-[11px] font-mono text-white/50 truncate">
                      {artwork.medium}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-white/40">
                      <span>{artwork.year}</span>
                      <button
                        onClick={() => {
                          triggerAudioClick();
                          onSelectArtwork(artwork);
                        }}
                        className="text-white hover:underline font-bold"
                      >
                        Inspect →
                      </button>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      ) : (

        /* 2-COLUMN SHOWCASE VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredArtworks.map((artwork, idx) => {
              const isHovered = hoveredId === artwork.id;
              const isLensHere = lensPos.show && lensPos.artworkId === artwork.id;

              return (
                <motion.div
                  key={artwork.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  onMouseEnter={() => {
                    setHoveredId(artwork.id);
                    triggerAudioClick();
                  }}
                  onMouseLeave={() => {
                    setHoveredId(null);
                    handleMouseLeave();
                  }}
                  className="group relative rounded-2xl bg-[#09090c] border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/30"
                  style={{
                    boxShadow: isHovered 
                      ? `${shadowX}px ${shadowY}px 36px rgba(255,255,255,0.12)` 
                      : '0 10px 30px rgba(0,0,0,0.6)'
                  }}
                >

                  <div className="p-4 flex items-center justify-between border-b border-white/10 bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                      <span className="text-xs font-mono text-white/50 uppercase tracking-wider">
                        {artwork.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono text-white/40">
                      <span className="flex items-center gap-1">
                        <FaClock className="text-[10px]" /> {artwork.timeSpent}
                      </span>
                      <span>•</span>
                      <span>{artwork.year}</span>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      triggerAudioClick();
                      onSelectArtwork(artwork);
                    }}
                    onMouseMove={(e) => handleMouseMove(e, artwork)}
                    onMouseLeave={handleMouseLeave}
                    className="relative h-[380px] w-full overflow-hidden bg-black cursor-pointer flex items-center justify-center p-3"
                  >
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className={`max-h-full w-auto max-w-full object-contain transition-transform duration-500 ${
                        isHovered ? 'scale-105' : 'scale-100'
                      }`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                    {isLensHere && (
                      <div
                        className="pointer-events-none absolute w-44 h-44 rounded-full border-2 border-white/80 shadow-[0_0_24px_rgba(0,0,0,0.9)] overflow-hidden z-30"
                        style={{
                          left: lensPos.x - 88,
                          top: lensPos.y - 88,
                          backgroundImage: `url(${artwork.image})`,
                          backgroundPosition: `${lensPos.percentX}% ${lensPos.percentY}%`,
                          backgroundSize: '280%',
                          backgroundColor: '#000'
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-full h-[1px] bg-white/30" />
                          <div className="h-full w-[1px] bg-white/30 absolute" />
                          <span className="absolute bottom-2 text-[9px] font-mono text-white bg-black/80 border border-white/20 px-2 py-0.5 rounded-full">
                            2.5x
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30 backdrop-blur-[2px]">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-mono font-bold text-xs shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                        <FaExpand className="text-xs" />
                        <span>Inspect</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 bg-[#08080b]">
                    <div>
                      <h3 className="text-lg font-bold font-mono text-white group-hover:text-zinc-200 transition-colors">
                        {artwork.title}
                      </h3>
                      <p className="text-xs font-mono text-white/50 mt-0.5">
                        {artwork.medium}
                      </p>
                    </div>

                    <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                      {artwork.description}
                    </p>

                    <div className="space-y-1 pt-2 border-t border-white/5">
                      {artwork.details.slice(0, 2).map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] font-mono text-white/60">
                          <FaCheck className="text-white/60 text-[9px] shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 text-[11px] font-mono border-t border-white/5">
                      <span className="text-white/40">Artist: <strong className="text-white">{artwork.artist}</strong></span>
                      <button
                        onClick={() => {
                          triggerAudioClick();
                          onSelectArtwork(artwork);
                        }}
                        className="text-white/80 hover:text-white font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        <span>Inspect</span> →
                      </button>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      )}

    </section>
  );
}
