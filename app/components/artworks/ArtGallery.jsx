'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaMicrophone } from 'react-icons/fa';
import { useArtworkLikes } from '../../artworks/useArtworkLikes';

const TILTS = [-1.4, 0.9, -0.6, 1.2, -1];

export default function ArtGallery({ artworks, activeCategory, onSelectArtwork, likeControls }) {
  const fallbackLikes = useArtworkLikes();
  const { isLiked, getLikeCount, toggleLike } = likeControls || fallbackLikes;

  const list = useMemo(() => {
    const numbered = artworks.map((a, i) => ({ ...a, no: i + 1 }));
    const filtered =
      activeCategory === 'all'
        ? numbered
        : numbered.filter((a) =>
            activeCategory === 'spiritual'
              ? a.categorySlug === 'spiritual' || a.categorySlug === 'surrealism'
              : a.categorySlug === activeCategory
          );
    return filtered;
  }, [artworks, activeCategory]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-14">
        <div>
          <p className="font-mono text-xs text-zinc-500">the work</p>
          <p className="font-handwriting text-xl text-zinc-400 mt-1 -rotate-1">
            tap one to get close.
          </p>
        </div>

      </div>

      <div key={activeCategory} className="columns-1 sm:columns-2 lg:columns-3 gap-x-10 lg:gap-x-14">
        {list.map((art, idx) => {
          const liked = isLiked(art.id);
          const count = getLikeCount(art.id);
          return (
            <motion.article
              key={art.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.06 }}
              className="group break-inside-avoid mb-16"
            >
              <button
                onClick={() => onSelectArtwork(art)}
                aria-label={`Open ${art.title}`}
                className="block w-full text-left cursor-pointer"
              >
                <div
                  className="relative transition-transform duration-500 ease-out [transform:rotate(var(--tilt))] group-hover:[transform:rotate(0deg)_translateY(-6px)]"
                  style={{ '--tilt': `${TILTS[(art.no - 1) % TILTS.length]}deg` }}
                >
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 -rotate-2 h-6 w-20 bg-white/25 shadow-sm z-10" />
                  <div className="bg-[#e7e3d9] p-2 sm:p-2.5 shadow-[0_22px_45px_rgba(0,0,0,0.65)]">
                    <img src={art.image} alt={art.title} loading="lazy" draggable={false} className="block w-full h-auto select-none" />
                  </div>
                </div>
              </button>

              <div className="mt-6 px-1 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-zinc-500">
                    No. {String(art.no).padStart(2, '0')} &middot; {art.category}
                  </p>
                  <h3 className="font-display text-2xl text-white mt-1">{art.title}</h3>
                  {art.words && <p className="font-handwriting text-lg text-[#e8dfc8]/90 leading-snug mt-1">{art.words}</p>}
                  {art.voice && (
                    <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
                      <FaMicrophone className="text-[10px]" /> voice note inside
                    </p>
                  )}
                </div>

                <button
                  onClick={(e) => toggleLike(art.id, e)}
                  aria-pressed={liked}
                  aria-label={liked ? 'Remove heart' : 'Heart this drawing'}
                  className={`shrink-0 mt-1 flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                    liked ? 'text-rose-400' : 'text-zinc-500 hover:text-rose-300'
                  }`}
                >
                  {liked ? <FaHeart /> : <FaRegHeart />}
                  <span className="font-mono tabular-nums">{count}</span>
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}