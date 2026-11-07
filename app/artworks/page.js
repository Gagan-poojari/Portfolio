'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ARTWORKS_DATA } from './artworksData';
import ArtHeader from '../components/artworks/ArtHeader';
import ArtAtelierHero from '../components/artworks/ArtAtelierHero';
import ArtGallery from '../components/artworks/ArtGallery';
import ArtworkModal from '../components/artworks/ArtworkModal';
import DrawingSandbox from '../components/artworks/DrawingSandbox';
import Flashlight from '../components/artworks/Flashlight';
import { useArtworkLikes } from './useArtworkLikes';
import { FaArrowLeft } from 'react-icons/fa';

export default function ArtworksPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const [lightsOff, setLightsOff] = useState(false);
  const likeControls = useArtworkLikes();

  // Open / close a drawing and keep the URL hash in sync (share links are /artworks#<id>)
  const select = useCallback((art) => {
    setSelectedArtwork(art);
    const base = window.location.pathname + window.location.search;
    window.history.replaceState(null, '', art ? `#${art.id}` : base);
  }, []);

  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.slice(1);
      const art = ARTWORKS_DATA.find((a) => a.id === id);
      if (art) setSelectedArtwork(art);
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  const pickRandom = () => select(ARTWORKS_DATA[Math.floor(Math.random() * ARTWORKS_DATA.length)]);

  return (
    <main className="min-h-screen bg-[#070709] text-zinc-100 font-body selection:bg-[#e8dfc8] selection:text-black">
      <ArtHeader
        onOpenSandbox={() => setSandboxOpen(true)}
        lightsOff={lightsOff}
        onToggleLights={() => setLightsOff((v) => !v)}
      />

      <ArtAtelierHero
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onSurpriseMe={pickRandom}
      />

      <ArtGallery
        artworks={ARTWORKS_DATA}
        activeCategory={activeCategory}
        onSelectArtwork={select}
        likeControls={likeControls}
      />

      {/* On the desk */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-12 md:gap-20">
          <div>
            <p className="font-mono text-xs text-zinc-500 mb-4">on the desk</p>
            <p className="font-display text-3xl sm:text-4xl text-white leading-tight">
              Code has Ctrl+Z. Charcoal doesn&apos;t.
            </p>
            <p className="mt-6 max-w-lg text-zinc-400 leading-relaxed">
              Drawing trained my eye for contrast, detail and rhythm more than any design tool did. It&apos;s also the one thing I do where I can&apos;t multitask.
            </p>
          </div>

          <ul className="space-y-5 font-handwriting text-xl text-zinc-300">
            <li>&#8594; Staedtler Mars Lumograph, 2B to 10B</li>
            <li>&#8594; Cretacolor compressed charcoal</li>
            <li>&#8594; a 0.3mm mechanical pencil for skin pores</li>
            <li>&#8594; lo-fi, Hans Zimmer, audiobooks at 1.25x</li>
            <li className="text-zinc-500">&#8594; graphite dust on my hands and my trackpad</li>
          </ul>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          <button onClick={() => setSandboxOpen(true)} className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors cursor-pointer">
            Draw something on my sketchpad
          </button>
          <Link href="/#contact" className="text-zinc-400 hover:text-white transition-colors">
            Any suggestions? Say hi &rarr;
          </Link>
        </div>
      </section>

      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          artworks={ARTWORKS_DATA}
          onSelectArtwork={select}
          onClose={() => select(null)}
          likeControls={likeControls}
        />
      )}

      <DrawingSandbox isOpen={sandboxOpen} onClose={() => setSandboxOpen(false)} />

      <Flashlight on={lightsOff} />

      <footer className="py-10 px-4 border-t border-white/10 text-center text-xs text-zinc-600 space-y-3">
        <p>&copy; {new Date().getFullYear()} Gagan Poojari</p>
        <Link href="/" className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors">
          <FaArrowLeft className="text-[10px]" /> Back to portfolio
        </Link>
      </footer>
    </main>
  );
}