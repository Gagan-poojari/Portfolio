'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaHeart, FaRegHeart, FaSearchPlus, FaLightbulb } from 'react-icons/fa';
import { useArtworkLikes } from '../../artworks/useArtworkLikes';

export default function ArtGallery({
  artworks,
  activeCategory,
  onSelectArtwork,
  likeControls
}) {
  const fallbackLikes = useArtworkLikes();
  const { isLiked, getLikeCount, toggleLike, justLikedId } = likeControls || fallbackLikes;

  const [hoveredId, setHoveredId] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, id: null });

  const filteredArtworks = activeCategory === 'all'
    ? artworks
    : artworks.filter(a => {
        if (activeCategory === 'spiritual') {
          return a.categorySlug === 'spiritual' || a.categorySlug === 'surrealism';
        }
        return a.categorySlug === activeCategory;
      });

  const handleMouseMove = (e, artId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y, id: artId });
  };

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-body">
      
      {/* Gallery Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-wider text-white">
            The Sketch Collection
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Move your cursor across any drawing to catch the graphite shine. Tap to inspect secrets.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <FaLightbulb className="text-amber-400 text-xs" />
            <span>Interactive Secrets Available</span>
          </span>
        </div>
      </div>

      {/* Artwork Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredArtworks.map((artwork, idx) => {
            const isHovered = hoveredId === artwork.id;
            const hasGlow = mousePos.id === artwork.id;
            const userLiked = isLiked(artwork.id);
            const count = getLikeCount(artwork.id);
            const justLiked = justLikedId === artwork.id;

            return (
              <motion.article
                key={artwork.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                onMouseEnter={() => setHoveredId(artwork.id)}
                onMouseLeave={() => {
                  setHoveredId(null);
                  setMousePos({ x: 0, y: 0, id: null });
                }}
                onMouseMove={(e) => handleMouseMove(e, artwork.id)}
                onClick={() => onSelectArtwork(artwork)}
                className="group relative rounded-2xl bg-[#0b0b0f] border border-white/10 overflow-hidden shadow-xl hover:border-white/30 transition-all duration-300 flex flex-col cursor-pointer"
              >
                
                {/* Image Frame with Interactive Graphite Shine */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#050508] flex items-center justify-center p-4 sm:p-5">
                  
                  <div className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden bg-black shadow-inner">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      loading="lazy"
                      className={`max-h-full max-w-full object-contain transition-transform duration-500 ease-out select-none ${
                        isHovered ? 'scale-[1.03]' : 'scale-100'
                      }`}
                    />

                    {/* Interactive Graphite Shine Simulation (Follows Mouse Cursor!) */}
                    {hasGlow && (
                      <div
                        className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-150"
                        style={{
                          background: `radial-gradient(circle 180px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.45) 0%, transparent 80%)`,
                        }}
                      />
                    )}

                    {/* Subtle vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50 group-hover:opacity-20 transition-opacity" />

                    {/* Hover Inspect CTA */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 backdrop-blur-[2px]">
                      <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-semibold text-xs shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <FaSearchPlus className="text-xs" />
                        <span>Inspect Secrets &amp; Zoom</span>
                      </span>
                    </div>

                    {/* Quick Metadata Badges */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 border border-white/15 text-[10px] font-mono text-zinc-300 backdrop-blur-md">
                      {artwork.year}
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/75 border border-white/15 text-[10px] font-mono text-zinc-300 backdrop-blur-md">
                      <FaClock className="text-[9px] text-zinc-400" />
                      <span>{artwork.timeSpent.split(' ')[0]} hrs</span>
                    </div>

                  </div>

                </div>

                {/* Card Story & Content */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-[#0b0b0f] border-t border-white/10 space-y-4">
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                        {artwork.category}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono">
                        {artwork.hotspots?.length || 3} Behind-the-Scenes Notes
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors">
                      {artwork.title}
                    </h3>

                    <p className="text-xs font-mono text-zinc-400">
                      {artwork.medium}
                    </p>
                  </div>

                  {/* Story excerpt */}
                  <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                    &ldquo;{artwork.story}&rdquo;
                  </p>

                  {/* Bottom Footer: Like Button & Inspect Link */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    
                    {/* Visitor Reaction Button with Live Like Counter */}
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      onClick={(e) => toggleLike(artwork.id, e)}
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer group/like ${
                        userLiked
                          ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                          : 'bg-white/5 hover:bg-white/15 border-white/10 text-zinc-300 hover:text-white'
                      }`}
                      title={userLiked ? 'Liked! Click to undo' : 'Leave a heart for this drawing'}
                    >
                      <motion.div
                        animate={justLiked ? { scale: [1, 1.45, 1] } : {}}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                      >
                        {userLiked ? (
                          <FaHeart className="text-rose-500 text-xs" />
                        ) : (
                          <FaRegHeart className="text-zinc-400 group-hover/like:text-rose-400 text-xs transition-colors" />
                        )}
                      </motion.div>
                      
                      <span className="font-mono text-[11px] font-medium tabular-nums">{count}</span>

                      {/* Floating +1 popover */}
                      <AnimatePresence>
                        {justLiked && (
                          <motion.span
                            initial={{ opacity: 0, y: 0, scale: 0.8 }}
                            animate={{ opacity: 1, y: -20, scale: 1.15 }}
                            exit={{ opacity: 0, y: -28, scale: 0.9 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold font-mono text-rose-400 pointer-events-none drop-shadow"
                          >
                            +1
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <span className="inline-flex items-center gap-1.5 font-medium text-white group-hover:translate-x-1 transition-transform">
                      <span>Explore</span> &rarr;
                    </span>

                  </div>

                </div>

              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

    </section>
  );
}
