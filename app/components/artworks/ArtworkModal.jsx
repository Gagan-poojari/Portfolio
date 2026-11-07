'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, 
  FaSearchPlus, 
  FaSearchMinus, 
  FaRedo, 
  FaDownload, 
  FaShareAlt,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaLightbulb,
  FaPenNib,
  FaEye,
  FaInfoCircle,
  FaHeart,
  FaRegHeart
} from 'react-icons/fa';
import SocialShareModal from './SocialShareModal';
import { handleDownloadImage } from '../../artworks/downloadHelper';
import { useArtworkLikes } from '../../artworks/useArtworkLikes';

export default function ArtworkModal({ artwork, artworks = [], onSelectArtwork, onClose, likeControls }) {
  const fallbackLikes = useArtworkLikes();
  const { isLiked, getLikeCount, toggleLike, justLikedId } = likeControls || fallbackLikes;
  const userLiked = isLiked(artwork?.id);
  const likeCount = getLikeCount(artwork?.id);
  const justLiked = justLikedId === artwork?.id;

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Cool feature toggles
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [lampShine, setLampShine] = useState(true);
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  
  const [shareOpen, setShareOpen] = useState(false);
  const containerRef = useRef(null);

  const currentIndex = artworks.findIndex(a => a.id === artwork?.id);

  const handlePrev = useCallback(() => {
    if (artworks.length === 0 || currentIndex === -1) return;
    const prevIdx = (currentIndex - 1 + artworks.length) % artworks.length;
    onSelectArtwork(artworks[prevIdx]);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActiveHotspot(null);
  }, [artworks, currentIndex, onSelectArtwork]);

  const handleNext = useCallback(() => {
    if (artworks.length === 0 || currentIndex === -1) return;
    const nextIdx = (currentIndex + 1) % artworks.length;
    onSelectArtwork(artworks[nextIdx]);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActiveHotspot(null);
  }, [artworks, currentIndex, onSelectArtwork]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handlePrev, handleNext]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
    setActiveHotspot(null);
  };
  const zoomOut = () => {
    setZoom(prev => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };
  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (lampShine && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setShinePos({ x, y });
    }

    if (!isDragging || zoom <= 1) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!artwork) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-7 font-body">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 w-full max-w-6xl bg-[#0c0c11] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[92vh]"
          >
            
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/70 hover:bg-white/20 text-zinc-300 hover:text-white border border-white/20 transition-all cursor-pointer"
              title="Close (Esc)"
            >
              <FaTimes className="text-xs" />
            </button>

            {/* Left / Right Carousel Buttons */}
            {artworks.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/70 hover:bg-white/20 text-zinc-300 hover:text-white border border-white/20 transition-all hidden sm:flex cursor-pointer"
                  title="Previous artwork (Left Arrow)"
                >
                  <FaChevronLeft className="text-xs" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-4 lg:right-[415px] top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/70 hover:bg-white/20 text-zinc-300 hover:text-white border border-white/20 transition-all hidden sm:flex cursor-pointer"
                  title="Next artwork (Right Arrow)"
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </>
            )}

            {/* Left: Interactive Canvas with Hotspots & Shine */}
            <div 
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`relative flex-1 bg-[#050508] flex items-center justify-center min-h-[380px] lg:min-h-[620px] p-4 sm:p-6 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 ${
                zoom > 1 ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
            >
              
              {/* Image & Hotspot Wrapper */}
              <div 
                className="relative inline-block max-h-[74vh] max-w-full"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                }}
              >
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  draggable={false}
                  className="max-h-[74vh] w-auto max-w-full object-contain rounded-lg shadow-2xl select-none"
                />

                {/* Simulated Desk Lamp Graphite Shine */}
                {lampShine && (
                  <div
                    className="pointer-events-none absolute inset-0 rounded-lg mix-blend-overlay transition-opacity duration-150"
                    style={{
                      background: `radial-gradient(circle 220px at ${shinePos.x}% ${shinePos.y}%, rgba(255, 255, 255, 0.45) 0%, transparent 80%)`,
                    }}
                  />
                )}

                {/* Interactive Hotspot Pins (Visible when 1x zoom and toggled ON) */}
                {showHotspots && zoom === 1 && artwork.hotspots && artwork.hotspots.map((spot) => {
                  const isSelected = activeHotspot?.id === spot.id;

                  return (
                    <div
                      key={spot.id}
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                      {/* Pulse Ping */}
                      <span className="absolute -inset-1 rounded-full bg-amber-400/40 animate-ping pointer-events-none" />
                      
                      {/* Pin Trigger */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHotspot(isSelected ? null : spot);
                        }}
                        className={`relative w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all shadow-lg cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-black border-white scale-110'
                            : 'bg-black/80 text-amber-300 border-amber-400/80 hover:bg-amber-400 hover:text-black'
                        }`}
                        title={spot.title}
                      >
                        ?
                      </button>

                      {/* Tooltip Card */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 8 }}
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 p-3 rounded-xl bg-black/95 border border-amber-400/50 shadow-2xl z-30 text-left pointer-events-auto"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1">
                                <FaLightbulb className="text-[9px]" /> {spot.title}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveHotspot(null);
                                }}
                                className="text-zinc-400 hover:text-white text-xs p-0.5"
                              >
                                &times;
                              </button>
                            </div>
                            <p className="text-[11px] text-zinc-200 leading-relaxed">
                              {spot.note}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Interactive Dock */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white text-xs shadow-2xl z-20">
                
                {/* Hotspot Toggle */}
                {artwork.hotspots && (
                  <button
                    onClick={() => {
                      setShowHotspots(!showHotspots);
                      setActiveHotspot(null);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                      showHotspots 
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                    title="Toggle secret sketch annotations"
                  >
                    <FaLightbulb className="text-[10px]" />
                    <span>Secrets</span>
                    <span className="text-[9px] px-1 bg-white/10 rounded">{showHotspots ? 'ON' : 'OFF'}</span>
                  </button>
                )}

                <div className="w-[1px] h-3.5 bg-white/20" />

                {/* Desk Lamp Shine Toggle */}
                <button
                  onClick={() => setLampShine(!lampShine)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                    lampShine 
                      ? 'bg-white/20 text-white border border-white/30 font-medium' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Simulate realistic desk lamp graphite shine"
                >
                  <FaEye className="text-[10px]" />
                  <span>Graphite Shine</span>
                </button>

                <div className="w-[1px] h-3.5 bg-white/20" />

                {/* Zoom Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={zoomIn}
                    className="p-1 hover:text-white text-zinc-400 transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <FaSearchPlus />
                  </button>
                  <span className="text-[10px] text-zinc-400 w-8 text-center font-mono">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={zoomOut}
                    className="p-1 hover:text-white text-zinc-400 transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <FaSearchMinus />
                  </button>
                  {zoom > 1 && (
                    <button
                      onClick={resetZoom}
                      className="p-1 hover:text-white text-zinc-400 transition-colors cursor-pointer ml-1"
                      title="Reset View"
                    >
                      <FaRedo className="text-[9px]" />
                    </button>
                  )}
                </div>

              </div>

            </div>

            {/* Right: Human Story & Studio Dossier */}
            <div className="w-full lg:w-[410px] p-6 sm:p-7 flex flex-col justify-between overflow-y-auto space-y-6 bg-[#0a0a0e]">
              
              <div className="space-y-5">
                
                {/* Category & Counter */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 text-zinc-300 text-xs font-mono">
                    {artwork.category}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    {currentIndex + 1} of {artworks.length}
                  </span>
                </div>

                {/* Titles */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-wide text-white leading-tight">
                    {artwork.title}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1 font-medium">
                    {artwork.subtitle}
                  </p>
                </div>

                {/* First-Person Human Story */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-semibold">
                    The Story Behind This Drawing
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-body">
                    &ldquo;{artwork.story}&rdquo;
                  </p>
                </div>

                {/* Fun Fact */}
                {artwork.funFact && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                    <FaInfoCircle className="text-sm shrink-0 mt-0.5 text-amber-400" />
                    <span><strong>Behind-the-scenes:</strong> {artwork.funFact}</span>
                  </div>
                )}

                {/* Tools & Time Spent */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <FaClock className="text-zinc-500 text-[11px]" /> Time Invested:
                    </span>
                    <span className="text-zinc-200 font-medium">{artwork.timeSpent}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <FaPenNib className="text-zinc-500 text-[11px]" /> Medium &amp; Pencils:
                    </span>
                    <span className="text-zinc-200 font-medium truncate max-w-[210px] text-right" title={artwork.pencils || artwork.medium}>
                      {artwork.pencils || artwork.medium}
                    </span>
                  </div>
                </div>

                {/* Hotspot Guide Callout */}
                {artwork.hotspots && (
                  <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-zinc-400">
                    <span>💡 Tap the yellow <strong>?</strong> pins on the drawing to see how specific details were rendered.</span>
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-2.5">
                {/* Like Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => toggleLike(artwork.id, e)}
                  className={`relative flex items-center gap-2 px-3.5 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    userLiked
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                      : 'bg-white/5 hover:bg-white/10 border-white/15 text-zinc-300 hover:text-white'
                  }`}
                  title={userLiked ? 'Liked! Click to undo' : 'Leave a heart for this artwork'}
                >
                  <motion.div animate={justLiked ? { scale: [1, 1.45, 1] } : {}} transition={{ duration: 0.35 }}>
                    {userLiked ? (
                      <FaHeart className="text-rose-500 text-sm" />
                    ) : (
                      <FaRegHeart className="text-zinc-400 group-hover:text-rose-400 text-sm" />
                    )}
                  </motion.div>
                  <span className="font-mono text-xs">{likeCount}</span>
                  <AnimatePresence>
                    {justLiked && (
                      <motion.span
                        initial={{ opacity: 0, y: 0, scale: 0.8 }}
                        animate={{ opacity: 1, y: -22, scale: 1.15 }}
                        exit={{ opacity: 0, y: -30, scale: 0.9 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold font-mono text-rose-400 pointer-events-none drop-shadow"
                      >
                        +1
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <button
                  onClick={() => handleDownloadImage(artwork.image, `${artwork.id}-gagan-poojari.webp`)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all shadow-md cursor-pointer"
                >
                  <FaDownload className="text-xs" />
                  <span>Download High-Res</span>
                </button>

                <button
                  onClick={() => setShareOpen(true)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-zinc-300 hover:text-white transition-all text-xs flex items-center gap-2 cursor-pointer"
                  title="Share Artwork"
                >
                  <FaShareAlt className="text-xs" />
                  <span>Share</span>
                </button>
              </div>

            </div>

          </motion.div>

        </div>
      </AnimatePresence>

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        artwork={artwork}
      />
    </>
  );
}