'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ARTWORKS_DATA } from './artworksData';
import ArtHeader from '../components/artworks/ArtHeader';
import ArtAtelierHero from '../components/artworks/ArtAtelierHero';
import ArtGallery from '../components/artworks/ArtGallery';
import ArtworkModal from '../components/artworks/ArtworkModal';
import DrawingSandbox from '../components/artworks/DrawingSandbox';
import { FaPencilAlt, FaArrowLeft, FaCoffee, FaCode, FaEnvelope } from 'react-icons/fa';

export default function ArtworksPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [sandboxOpen, setSandboxOpen] = useState(false);

  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * ARTWORKS_DATA.length);
    setSelectedArtwork(ARTWORKS_DATA[randomIndex]);
  };

  return (
    <main className="min-h-screen bg-[#070709] text-zinc-100 font-body selection:bg-white selection:text-black">
      
      {/* Editorial Header */}
      <ArtHeader onOpenSandbox={() => setSandboxOpen(true)} />

      {/* Atelier Exhibition Hero with Surprise Me */}
      <ArtAtelierHero
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onSurpriseMe={handleSurpriseMe}
        onOpenSandbox={() => setSandboxOpen(true)}
      />

      {/* Main Exhibition Gallery with Mouse Shine & Secrets */}
      <ArtGallery
        artworks={ARTWORKS_DATA}
        activeCategory={activeCategory}
        onSelectArtwork={(art) => setSelectedArtwork(art)}
      />

      {/* Real Talk: Behind the Pencils */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-400 text-xs font-mono">
              <FaCode className="text-zinc-300 text-[10px]" />
              <span>Full-Stack Dev by Day &bull; Sketcher by Night</span>
            </div>

            <h3 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-wide leading-tight">
              Why Spend 30 Hours with a Pencil When AI Takes 3 Seconds?
            </h3>

            <p className="text-sm text-zinc-300 leading-relaxed">
              Because there is something irreplaceable about putting physical lead to textured paper. When you push a line in code, you can undo it with <code>Cmd+Z</code>. With an 8B charcoal pencil, every stroke commits.
            </p>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Drawing trained my eye for micro-details, contrast, and visual rhythm more than any design software ever could. It’s my ultimate form of deep focus.
            </p>
          </div>

          {/* Quick Studio Facts Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0b0b0f] border border-white/10 space-y-4 shadow-xl">
            <h4 className="text-xs font-mono text-white uppercase tracking-widest font-semibold flex items-center gap-2 pb-3 border-b border-white/10">
              <FaCoffee className="text-amber-400" />
              <span>Gagan&apos;s Drawing Studio Routine</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="text-amber-400 font-mono text-sm">&rarr;</span>
                <p className="text-zinc-300">
                  <strong>The Weapons of Choice:</strong> Staedtler Mars Lumograph pencils (2B to 10B), Cretacolor compressed charcoal, and a 0.3mm mechanical pencil for skin pores.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-amber-400 font-mono text-sm">&rarr;</span>
                <p className="text-zinc-300">
                  <strong>The Mess:</strong> My hands and laptop trackpad end up covered in gray graphite dust after every weekend drawing binge.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-amber-400 font-mono text-sm">&rarr;</span>
                <p className="text-zinc-300">
                  <strong>Music Fuel:</strong> Lo-fi hip hop, Hans Zimmer soundtracks, and audiobooks on 1.25x speed while shading backdrops.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setSandboxOpen(true)}
                className="text-xs font-semibold text-black bg-white hover:bg-zinc-200 px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FaPencilAlt className="text-[10px]" />
                <span>Try the Sketchpad</span>
              </button>

              <Link
                href="/#contact"
                className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <FaEnvelope className="text-[10px]" />
                <span>Custom Portrait Inquiries &rarr;</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Lightbox Viewing Room Modal */}
      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          artworks={ARTWORKS_DATA}
          onSelectArtwork={setSelectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}

      {/* Drawing Sandbox Modal */}
      <DrawingSandbox
        isOpen={sandboxOpen}
        onClose={() => setSandboxOpen(false)}
      />

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-white/10 bg-black/70 text-center font-mono text-xs text-zinc-500 space-y-3">
        <div>
          Hand-crafted by Gagan Poojari &bull; Pencils, Paper &amp; Next.js
        </div>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <FaArrowLeft className="text-[10px]" /> Return to Main Portfolio
          </Link>
        </div>
      </footer>

    </main>
  );
}