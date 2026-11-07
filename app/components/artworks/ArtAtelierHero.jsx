'use client';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ARTWORKS_DATA, TOTAL_HOURS, LONGEST_HOURS, YEAR_SPAN } from '../../artworks/artworksData';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'portrait', label: 'Portraits' },
  { id: 'sports', label: 'Sports' },
  { id: 'spiritual', label: 'Fine art' },
];

const countFor = (id) =>
  id === 'all'
    ? ARTWORKS_DATA.length
    : ARTWORKS_DATA.filter((a) => (id === 'spiritual' ? a.categorySlug === 'spiritual' || a.categorySlug === 'surrealism' : a.categorySlug === id)).length;

// Move your cursor (or finger) across the hero and it leaves a graphite smudge that slowly fades.
function Smudge({ hostRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, last = null, raf = 0, idle = 0, running = false;

    const size = () => {
      w = host.offsetWidth;
      h = host.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(host);

    const frame = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.018)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
      idle++;
      if (idle > 420) {
        running = false;
        ctx.clearRect(0, 0, w, h);
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const move = (e) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) {
        last = null;
        return;
      }
      if (last) {
        ctx.strokeStyle = 'rgba(214,214,220,0.11)';
        ctx.lineWidth = 18 + Math.random() * 12;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(214,214,220,0.35)';
        ctx.shadowBlur = 22;
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      last = { x, y };
      idle = 0;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    const leave = () => { last = null; };

    window.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
    };
  }, [hostRef]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 w-full h-full" />;
}

export default function ArtAtelierHero({ activeCategory, setActiveCategory, onSurpriseMe }) {
  const hostRef = useRef(null);

  return (
    <section ref={hostRef} className="relative overflow-hidden pt-32 sm:pt-40 pb-14 px-4 sm:px-6 lg:px-8 border-b border-white/10">
      <Smudge hostRef={hostRef} />

      <div className="relative max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs text-zinc-500 mb-5"
        >
          sketchbook / {YEAR_SPAN}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-[clamp(3rem,11vw,8.5rem)] leading-[0.92] text-white"
        >
          Pencil <span className="text-zinc-500">&amp;</span>
          <br />
          <span className="relative inline-block">
            charcoal.
            <svg viewBox="0 0 400 18" preserveAspectRatio="none" className="absolute left-0 -bottom-1 w-full h-3 sm:h-4 overflow-visible" aria-hidden>
              <motion.path
                d="M3 11 C 70 3, 140 15, 210 8 S 340 4, 397 10"
                fill="none"
                stroke="#e8dfc8"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, delay: 0.7, ease: 'easeInOut' }}
              />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 max-w-xl text-base sm:text-lg text-zinc-300 leading-relaxed"
        >
          I write code for a living and draw when I want my head to go quiet. Mostly portraits, a few sports pieces, a couple of odd ones. All graphite or charcoal on paper.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 font-mono text-xs sm:text-sm text-zinc-400"
        >
          {/* {ARTWORKS_DATA.length}+ drawings &nbsp;/&nbsp; {TOTAL_HOURS} hours &nbsp;/&nbsp; longest took {LONGEST_HOURS} */}
          {ARTWORKS_DATA.length}+ drawings &nbsp;/&nbsp; 100+ hours
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm"
        >
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative pb-1.5 transition-colors cursor-pointer ${active ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'}`}
              >
                {cat.label}
                <sup className="ml-0.5 font-mono text-[10px] text-zinc-600">{countFor(cat.id)}</sup>
                {active && <motion.span layoutId="cat-underline" className="absolute left-0 right-0 bottom-0 h-px bg-[#e8dfc8]" />}
              </button>
            );
          })}

          <button
            onClick={onSurpriseMe}
            className="ml-auto text-zinc-400 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60 transition-colors cursor-pointer"
          >
            pick one for me &rarr;
          </button>
        </motion.div>
      </div>

      <p className="pointer-events-none absolute right-6 sm:right-12 top-36 sm:top-44 rotate-[6deg] font-handwriting text-lg text-zinc-500 [@media(hover:none)]:hidden hidden md:block">
        go on, smudge the page
      </p>
    </section>
  );
}