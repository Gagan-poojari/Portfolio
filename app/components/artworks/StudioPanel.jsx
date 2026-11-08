'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

// The current drawing, blurred into a soft glow behind the panel + a bit of paper grain
export function AmbientGlow({ src }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -inset-10 bg-cover bg-center opacity-[0.28] blur-3xl scale-125 transition-[background-image] duration-700"
        style={{ backgroundImage: `url(${src})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#09090c]/30 via-[#09090c]/70 to-[#09090c]" />
      <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay" style={{ backgroundImage: NOISE }} />
    </div>
  );
}

// His real signature, written in left to right every time a drawing opens
export function Signature({ id }) {
  return (
    <div className="mt-4 flex gap-2">
        <span> - </span>
      <motion.img
        key={id}
        src="/signature.svg"
        alt="Gagan Poojari's signature"
        draggable={false}
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.25 }}
        className="h-9 w-auto brightness-0 invert opacity-90 -rotate-2 select-none"
      />
    </div>
  );
}

const SHEETS_CM = { A5: [14.8, 21], A4: [21, 29.7], A3: [29.7, 42], A2: [42, 59.4] };

// Top-down desk: the drawing at its real proportions next to a pencil (17.5 cm) and a mug (8 cm).
// A desk lamp follows your cursor / finger.
export function DeskScene({ src, size }) {
  const [landscape, setLandscape] = useState(false);
  const [lamp, setLamp] = useState(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLandscape(img.naturalWidth > img.naturalHeight);
    img.src = src;
  }, [src]);

  const base = SHEETS_CM[size];
  if (!base) return null;

  const W = 340;
  const H = 240;
  const [cw, ch] = landscape ? [base[1], base[0]] : base;
  const S = Math.min(5, (H - 24) / ch, (W - 120) / cw); // px per cm, same for every object
  const sw = cw * S;
  const sh = ch * S;
  const sx = 22;
  const sy = (H - sh) / 2;
  const rightC = (sx + sw + W) / 2;

  const pencilLen = 17.5 * S;
  const pencilW = Math.max(4, 0.8 * S);
  const mugR = 4 * S;

  const move = (e) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    setLamp({ x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H });
  };
  const lx = lamp ? lamp.x : sx + sw / 2;
  const ly = lamp ? lamp.y : sy + sh / 2;

  return (
    <div>
      <p className="font-mono text-[11px] uppercase text-zinc-500 mb-3">to scale</p>
      <div
        ref={boxRef}
        onPointerMove={move}
        onPointerDown={move}
        onPointerLeave={() => setLamp(null)}
        className="relative rounded-xl overflow-hidden border border-white/10 touch-none"
        style={{ aspectRatio: `${W} / ${H}` }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" aria-label={`${size} drawing next to a pencil and a mug`}>
          <defs>
            <linearGradient id="desk" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#201b16" />
              <stop offset="1" stopColor="#131010" />
            </linearGradient>
            <pattern id="grain" width="340" height="6" patternUnits="userSpaceOnUse">
              <rect width="340" height="1" y="2" fill="rgba(255,255,255,0.03)" />
            </pattern>
            <filter id="sheet-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.7" />
            </filter>
          </defs>
          <rect width={W} height={H} fill="url(#desk)" />
          <rect width={W} height={H} fill="url(#grain)" />

          {/* the drawing */}
          <g filter="url(#sheet-shadow)">
            <image href={src} x={sx} y={sy} width={sw} height={sh} preserveAspectRatio="xMidYMid slice" />
            <rect x={sx} y={sy} width={sw} height={sh} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
          </g>

          {/* pencil */}
          <g transform={`translate(${rightC} ${sy + sh * 0.38}) rotate(14)`}>
            <rect x={-pencilW / 2} y={-pencilLen / 2} width={pencilW} height={pencilLen - pencilW * 1.8} fill="#2a2a31" />
            <rect x={-pencilW / 2} y={-pencilLen / 2} width={pencilW} height={pencilW * 0.9} fill="#b0524c" />
            <rect x={-pencilW / 2} y={-pencilLen / 2 + pencilW * 0.9} width={pencilW} height={pencilW * 0.35} fill="#8c8c94" />
            <polygon
              points={`${-pencilW / 2},${pencilLen / 2 - pencilW * 1.8} ${pencilW / 2},${pencilLen / 2 - pencilW * 1.8} 0,${pencilLen / 2}`}
              fill="#d9c4a0"
            />
            <polygon
              points={`${-pencilW * 0.2},${pencilLen / 2 - pencilW * 0.6} ${pencilW * 0.2},${pencilLen / 2 - pencilW * 0.6} 0,${pencilLen / 2}`}
              fill="#111"
            />
          </g>

          {/* mug */}
          <g transform={`translate(${rightC - 4} ${H - mugR - 14})`}>
            <path d={`M${mugR - 1} ${-mugR * 0.35} q ${mugR * 0.6} 0 ${mugR * 0.6} ${mugR * 0.35} q 0 ${mugR * 0.35} ${-mugR * 0.6} ${mugR * 0.35}`} fill="none" stroke="#3a3a42" strokeWidth={mugR * 0.2} />
            <circle r={mugR} fill="#2b2b31" stroke="#46464f" strokeWidth="0.8" />
            <circle r={mugR * 0.82} fill="#0d0a09" />
            <ellipse cx={-mugR * 0.25} cy={-mugR * 0.3} rx={mugR * 0.3} ry={mugR * 0.12} fill="rgba(255,255,255,0.08)" />
          </g>
        </svg>

        {/* desk lamp */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-[background] duration-100"
          style={{
            background: `radial-gradient(circle at ${(lx / W) * 100}% ${(ly / H) * 100}%, rgba(255,226,170,0.2) 0%, rgba(255,226,170,0) 38%), radial-gradient(circle at ${(lx / W) * 100}% ${(ly / H) * 100}%, rgba(0,0,0,0) 0%, rgba(4,3,3,0.74) 62%)`,
          }}
        />
      </div>
      <p className="mt-2 font-handwriting text-lg text-zinc-400 leading-snug">
        {size} is {cw} &times; {ch} cm. that&apos;s a normal pencil and a small mug next to it.
      </p>
    </div>
  );
}

// Film-strip style jump bar
export function ContactSheet({ artworks, activeId, onSelect }) {
  return (
    <div>
      <div className="flex gap-1.5 p-1.5 rounded-md bg-[#0b0b0e] border border-white/10">
        {artworks.map((a, i) => {
          const active = a.id === activeId;
          return (
            <button key={a.id} onClick={() => onSelect(a)} aria-label={a.title} className="flex-1 min-w-0 cursor-pointer group">
              <div
                className={`aspect-[3/4] overflow-hidden rounded-[2px] transition-all duration-300 ${
                  active ? 'ring-1 ring-[#e8dfc8] -translate-y-0.5' : 'opacity-45 grayscale group-hover:opacity-90 group-hover:grayscale-0'
                }`}
              >
                <img src={a.image} alt="" draggable={false} className="w-full h-full object-cover" />
              </div>
              <span className={`block mt-1 text-center font-mono text-[9px] ${active ? 'text-[#e8dfc8]' : 'text-zinc-600'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Hand-drawn tally marks: four strokes and a slash, like counting days on a wall
export function Tally({ n }) {
  const MAX_GROUPS = 12;
  const groups = Math.min(MAX_GROUPS, Math.floor(n / 5));
  const rem = n % 5;
  const wob = (i) => ((i * 7) % 5) * 0.35 - 0.7;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[#e8dfc8]/75" aria-hidden>
      {Array.from({ length: groups }).map((_, g) => (
        <svg key={g} width="28" height="22" viewBox="0 0 28 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          {[4, 10, 16, 22].map((x, i) => (
            <line key={x} x1={x + wob(i + g)} y1="2" x2={x + wob(i + g + 2)} y2="20" />
          ))}
          <line x1="1" y1="16" x2="27" y2="6" />
        </svg>
      ))}
      {n > MAX_GROUPS * 5 && <span className="font-handwriting text-lg">+</span>}
      {rem > 0 && (
        <svg width={rem * 6 + 4} height="22" viewBox={`0 0 ${rem * 6 + 4} 22`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          {Array.from({ length: rem }).map((_, i) => (
            <line key={i} x1={3 + i * 6 + wob(i)} y1="2" x2={3 + i * 6 + wob(i + 3)} y2="20" />
          ))}
        </svg>
      )}
    </div>
  );
}