'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, 
  FaSearchPlus, 
  FaSearchMinus, 
  FaRedo, 
  FaDownload, 
  FaPencilAlt, 
  FaShareAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import SocialShareModal from './SocialShareModal';
import { handleDownloadImage } from '../../artworks/downloadHelper';

export default function ArtworkModal({ artwork, artworks = [], onSelectArtwork, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [filterMode, setFilterMode] = useState('normal');
  const [shareOpen, setShareOpen] = useState(false);

  const currentIndex = artworks.findIndex(a => a.id === artwork?.id);

  const handlePrev = useCallback(() => {
    if (artworks.length === 0 || currentIndex === -1) return;
    const prevIdx = (currentIndex - 1 + artworks.length) % artworks.length;
    onSelectArtwork(artworks[prevIdx]);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [artworks, currentIndex, onSelectArtwork]);

  const handleNext = useCallback(() => {
    if (artworks.length === 0 || currentIndex === -1) return;
    const nextIdx = (currentIndex + 1) % artworks.length;
    onSelectArtwork(artworks[nextIdx]);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [artworks, currentIndex, onSelectArtwork]);

  // Keyboard navigation shortcuts
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

  if (!artwork) return null;

  const filterStyles = {
    normal: '',
    noir: 'grayscale(100%) contrast(140%) brightness(95%)',
    sepia: 'sepia(80%) contrast(120%) brightness(90%)',
    contrast: 'contrast(160%) brightness(105%)'
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 w-full max-w-5xl bg-[#09090c] border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
          >
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/70 hover:bg-white/20 text-white/70 hover:text-white border border-white/20 transition-all"
            >
              <FaTimes className="text-xs" />
            </button>

            {/* Left / Right Carousel Controls */}
            {artworks.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 hover:bg-white/20 text-white/70 hover:text-white border border-white/20 transition-all hidden sm:flex"
                  title="Previous artwork (Left Arrow)"
                >
                  <FaChevronLeft className="text-xs" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-14 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 hover:bg-white/20 text-white/70 hover:text-white border border-white/20 transition-all hidden sm:flex"
                  title="Next artwork (Right Arrow)"
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </>
            )}

            {/* Left: Interactive Canvas */}
            <div className="relative flex-1 bg-black flex flex-col items-center justify-center min-h-[400px] lg:min-h-[580px] p-4 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
              
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <motion.img
                  key={artwork.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: zoom }}
                  transition={{ duration: 0.25 }}
                  src={artwork.image}
                  alt={artwork.title}
                  style={{
                    x: pan.x,
                    y: pan.y,
                    filter: filterStyles[filterMode]
                  }}
                  className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl"
                />
              </div>

              {/* Toolbar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-mono shadow-2xl z-20">
                
                <button
                  onClick={() => setZoom(prev => Math.min(prev + 0.5, 3))}
                  className="p-1.5 hover:text-white/80 transition-colors"
                  title="Zoom In"
                >
                  <FaSearchPlus />
                </button>
                
                <span className="text-[10px] text-white/50 w-10 text-center">
                  {Math.round(zoom * 100)}%
                </span>

                <button
                  onClick={() => setZoom(prev => Math.max(prev - 0.5, 1))}
                  className="p-1.5 hover:text-white/80 transition-colors"
                  title="Zoom Out"
                >
                  <FaSearchMinus />
                </button>

                <div className="w-[1px] h-4 bg-white/20" />

                <button
                  onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                  className="p-1.5 hover:text-white/80 transition-colors"
                  title="Reset View"
                >
                  <FaRedo className="text-[10px]" />
                </button>

                <div className="w-[1px] h-4 bg-white/20" />

                <button
                  onClick={() => {
                    const modes = ['normal', 'noir', 'sepia', 'contrast'];
                    const next = modes[(modes.indexOf(filterMode) + 1) % modes.length];
                    setFilterMode(next);
                  }}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] uppercase font-bold text-white"
                >
                  {filterMode}
                </button>

              </div>

            </div>

            {/* Right: Details Panel */}
            <div className="w-full lg:w-[380px] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6 bg-[#08080b]">
              
              <div className="space-y-5">
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 text-white/70 text-xs font-mono">
                  <FaPencilAlt className="text-[10px] text-white/80" />
                  <span>{artwork.category}</span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold font-mono text-white leading-tight">
                    {artwork.title}
                  </h2>
                  <p className="text-xs font-mono text-white/60 mt-1">
                    {artwork.medium}
                  </p>
                </div>

                <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                  {artwork.description}
                </p>

                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-xs">
                  <div>
                    <span className="text-white/40 block text-[10px]">TIME SPENT</span>
                    <span className="text-white font-bold">{artwork.timeSpent}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px]">DIMENSIONS</span>
                    <span className="text-white font-bold">{artwork.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px]">YEAR</span>
                    <span className="text-white font-bold">{artwork.year}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px]">ARTIST</span>
                    <span className="text-white font-bold">{artwork.artist}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Highlights
                  </h4>
                  <div className="space-y-1.5">
                    {artwork.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs font-mono text-zinc-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                {/* RELIABLE DIRECT BLOB DOWNLOAD BUTTON */}
                <button
                  onClick={() => handleDownloadImage(artwork.image, `${artwork.id}-gagan-poojari.webp`)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-black font-mono font-bold text-xs hover:bg-zinc-200 transition-all shadow cursor-pointer"
                >
                  <FaDownload className="text-xs" />
                  <span>Download Image</span>
                </button>

                {/* SOCIAL SHARE BUTTON */}
                <button
                  onClick={() => setShareOpen(true)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-all font-mono text-xs flex items-center gap-1.5"
                  title="Share Artwork to Social Media"
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
