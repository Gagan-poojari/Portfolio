'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ARTWORKS_DATA } from './artworksData';
import ArtHeader from '../components/artworks/ArtHeader';
import ArtAtelierHero from '../components/artworks/ArtAtelierHero';
import ArtGallery from '../components/artworks/ArtGallery';
import ArtworkModal from '../components/artworks/ArtworkModal';
import DrawingSandbox from '../components/artworks/DrawingSandbox';
import { FaPencilAlt, FaArrowLeft } from 'react-icons/fa';

export default function ArtworksPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [magnifierActive, setMagnifierActive] = useState(true);
  const [sandboxOpen, setSandboxOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#070709] text-zinc-100 font-sans selection:bg-white selection:text-black">
      
      {/* Header */}
      <ArtHeader
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        magnifierActive={magnifierActive}
        setMagnifierActive={setMagnifierActive}
        onOpenSandbox={() => setSandboxOpen(true)}
      />

      {/* Hero */}
      <ArtAtelierHero
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Gallery */}
      <ArtGallery
        artworks={ARTWORKS_DATA}
        activeCategory={activeCategory}
        onSelectArtwork={(art) => setSelectedArtwork(art)}
        magnifierActive={magnifierActive}
        audioEnabled={audioEnabled}
      />

      {/* Artist Statement */}
      <section className="py-14 px-4 max-w-3xl mx-auto border-t border-white/10 text-center space-y-3 font-mono">
        <div className="inline-flex items-center justify-center p-2.5 rounded-full bg-white/5 border border-white/15 text-white text-sm mb-1">
          <FaPencilAlt />
        </div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          A Note on the Craft
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed italic max-w-xl mx-auto">
          "Drawing realistic portraits requires the exact same discipline as writing clean code - patience, precision, and relentless attention to micro details."
        </p>
      </section>

      {/* Lightbox Modal */}
      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          artworks={ARTWORKS_DATA}
          onSelectArtwork={setSelectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}

      {/* Drawing Sandbox */}
      <DrawingSandbox
        isOpen={sandboxOpen}
        onClose={() => setSandboxOpen(false)}
      />

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10 bg-black/60 text-center font-mono text-xs text-white/40 space-y-2">
        <div>
          Gagan Poojari - Code & Art
        </div>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors underline"
          >
            <FaArrowLeft className="text-[10px]" /> Back to Portfolio
          </Link>
        </div>
      </footer>

    </main>
  );
}
