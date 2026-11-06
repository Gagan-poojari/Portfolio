'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaPencilAlt } from 'react-icons/fa';

export default function ArtHeader({ onOpenSandbox }) {
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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-body ${
        scrolled 
          ? 'bg-[#08080b]/90 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl' 
          : 'bg-gradient-to-b from-black/80 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Back Link & Gallery Identifier */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs text-zinc-300 hover:text-white transition-all group"
          >
            <FaArrowLeft className="text-[10px] group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Portfolio</span>
          </Link>

          <div className="hidden sm:flex items-center gap-3 border-l border-white/15 pl-5">
            <span className="text-xs uppercase tracking-widest text-zinc-300 font-mono font-medium">
              Gagan&apos;s Sketchbook
            </span>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-xs text-zinc-400">
              100% Pencil &amp; Charcoal on Paper
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSandbox}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-black font-medium text-xs transition-all shadow-sm cursor-pointer"
          >
            <FaPencilAlt className="text-[10px]" />
            <span>Visitor Sketchpad</span>
          </button>
        </div>

      </div>
    </header>
  );
}