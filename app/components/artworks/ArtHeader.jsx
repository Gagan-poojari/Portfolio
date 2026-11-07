'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaPencilAlt, FaLightbulb, FaRegLightbulb } from 'react-icons/fa';

export default function ArtHeader({ onOpenSandbox, lightsOff, onToggleLights }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-[#070709]/85 backdrop-blur-md border-b border-white/10 py-3' : 'py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        <Link href="/" className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
          <FaArrowLeft className="text-[11px] group-hover:-translate-x-0.5 transition-transform" />
          <span>Portfolio</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLights}
            aria-pressed={lightsOff}
            title={lightsOff ? 'Turn the lights back on' : 'Turn the lights off'}
            className={`h-9 px-3 rounded-full border text-xs flex items-center gap-2 transition-colors cursor-pointer ${
              lightsOff
                ? 'bg-[#e8dfc8] text-black border-[#e8dfc8]'
                : 'border-white/15 text-zinc-300 hover:text-white hover:border-white/40'
            }`}
          >
            {lightsOff ? <FaLightbulb className="text-[12px]" /> : <FaRegLightbulb className="text-[12px]" />}
            <span className="hidden xs:inline sm:inline">{lightsOff ? 'Lights on' : 'Lights off'}</span>
          </button>

          <button
            onClick={onOpenSandbox}
            className="h-9 px-3.5 rounded-full bg-white text-black text-xs font-medium flex items-center gap-2 hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <FaPencilAlt className="text-[10px]" />
            <span>Sketchpad</span>
          </button>
        </div>
      </div>
    </header>
  );
}