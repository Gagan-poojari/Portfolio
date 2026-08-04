'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaVolumeMute, FaVolumeUp, FaSearchPlus, FaPaintBrush } from 'react-icons/fa';

export default function ArtHeader({ 
  audioEnabled, 
  setAudioEnabled,
  magnifierActive,
  setMagnifierActive,
  onOpenSandbox
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#09090b]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-xl' 
          : 'bg-gradient-to-b from-black/80 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Back Link & Title */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-xs text-white/80 hover:text-white transition-all font-mono group"
          >
            <FaArrowLeft className="text-[10px] group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Portfolio</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span>
            <h1 className="text-sm font-bold tracking-widest text-white uppercase font-mono">
              Gagan <span className="text-white/40 font-light">•</span> Art
            </h1>
          </div>
        </div>

        {/* Right: Controls & Toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Lens Toggle */}
          <button
            onClick={() => setMagnifierActive(!magnifierActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
              magnifierActive
                ? 'border-white/40 bg-white/15 text-white font-bold'
                : 'border-white/10 bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle magnifying glass"
          >
            <FaSearchPlus className="text-xs" />
            <span className="hidden md:inline">Lens</span>
            {magnifierActive && <span className="text-[9px] px-1 bg-white/20 rounded">ON</span>}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-full border text-xs font-mono transition-all ${
              audioEnabled
                ? 'border-white/40 bg-white/15 text-white'
                : 'border-white/10 bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
            }`}
            title={audioEnabled ? "Mute sound" : "Enable sound"}
          >
            {audioEnabled ? <FaVolumeUp className="text-white" /> : <FaVolumeMute />}
          </button>

          {/* Canvas Button */}
          <button
            onClick={onOpenSandbox}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black font-bold text-xs font-mono hover:bg-zinc-200 transition-all shadow-sm"
          >
            <FaPaintBrush className="text-xs" />
            <span>Sketchpad</span>
          </button>

        </div>

      </div>
    </header>
  );
}
