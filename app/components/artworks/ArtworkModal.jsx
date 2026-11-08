'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaTimes, FaSearchPlus, FaSearchMinus, FaDownload, FaShareAlt, FaChevronLeft, FaChevronRight,
  FaHeart, FaRegHeart, FaSearch, FaAdjust, FaLayerGroup, FaDrawPolygon, FaBorderAll, FaHistory,
} from 'react-icons/fa';
import SocialShareModal from './SocialShareModal';
import VoiceNote from './VoiceNote';
import { AmbientGlow, Signature, DeskScene, ContactSheet, Tally } from './StudioPanel';
import { handleDownloadImage } from '../../artworks/downloadHelper';
import { useArtworkLikes } from '../../artworks/useArtworkLikes';
import { analyzeImage } from '../../artworks/imagestudy';

const LOUPE_R = 90;
const LOUPE_Z = 2.8;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export default function ArtworkModal({ artwork, artworks = [], onSelectArtwork, onClose, likeControls }) {
  const fallbackLikes = useArtworkLikes();
  const { isLiked, getLikeCount, toggleLike } = likeControls || fallbackLikes;

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState('none'); // 'none' | 'squint' | 'values' | 'edges'
  const [grid, setGrid] = useState(false);
  const [gridRows, setGridRows] = useState(5);
  const [study, setStudy] = useState(null);
  const [loupe, setLoupe] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 0, y: 0, w: 0, h: 0, show: false, touch: false });
  const [process, setProcess] = useState(false);
  const [split, setSplit] = useState(50);
  const [shareOpen, setShareOpen] = useState(false);

  const imgRef = useRef(null);
  const pointers = useRef(new Map());
  const g = useRef({ startDist: 0, startZoom: 1, startPan: { x: 0, y: 0 }, startPt: { x: 0, y: 0 } });

  const idx = artworks.findIndex((a) => a.id === artwork?.id);
  const liked = isLiked(artwork?.id);
  const count = getLikeCount(artwork?.id);

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setLoupePos((p) => ({ ...p, show: false }));
  }, []);

  useEffect(() => {
    resetView();
    setProcess(false);
    setSplit(50);
  }, [artwork?.id, resetView]);

  // Edge map for the Lines view
  useEffect(() => {
    let alive = true;
    setStudy(null);
    analyzeImage(artwork.image).then((r) => alive && setStudy(r)).catch(() => {});
    return () => { alive = false; };
  }, [artwork?.image]);

  const go = useCallback(
    (dir) => {
      if (artworks.length < 2 || idx === -1) return;
      onSelectArtwork(artworks[(idx + dir + artworks.length) % artworks.length]);
    },
    [artworks, idx, onSelectArtwork]
  );

  const setZoomSafe = (z) => {
    const next = clamp(z, 1, 4);
    setZoom(next);
    if (next === 1) setPan({ x: 0, y: 0 });
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea')) return;
      const k = e.key.toLowerCase();
      if (k === 'escape') onClose();
      else if (k === 'arrowleft') go(-1);
      else if (k === 'arrowright') go(1);
      else if (k === 'e') setMode((m) => (m === 'edges' ? 'none' : 'edges'));
      else if (k === 'g') setGrid((v) => !v);
      else if (k === 'l') setLoupe((v) => !v);
      else if (k === 's') setMode((m) => (m === 'squint' ? 'none' : 'squint'));
      else if (k === 'v') setMode((m) => (m === 'values' ? 'none' : 'values'));
      else if (k === '+' || k === '=') setZoomSafe(zoom + 0.5);
      else if (k === '-') setZoomSafe(zoom - 0.5);
      else if (k === '0') resetView();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, go, zoom, resetView]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ── Pointer gestures: drag-pan, pinch-zoom, swipe to change drawing ──
  const updateLoupe = (e) => {
    if (!loupe || zoom !== 1 || !imgRef.current) return;
    const r = imgRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    setLoupePos({ x, y, w: r.width, h: r.height, show: x >= 0 && y >= 0 && x <= r.width && y <= r.height, touch: e.pointerType === 'touch' });
  };

  const onPointerDown = (e) => {
    if (e.target.closest('[data-ui]')) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      g.current.startPt = { x: e.clientX, y: e.clientY };
      g.current.startPan = pan;
      setDragging(zoom > 1 && !loupe);
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      g.current.startDist = Math.hypot(a.x - b.x, a.y - b.y);
      g.current.startZoom = zoom;
      setLoupePos((p) => ({ ...p, show: false }));
    }
    updateLoupe(e);
  };

  const onPointerMove = (e) => {
    updateLoupe(e);
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (g.current.startDist) setZoomSafe(g.current.startZoom * (d / g.current.startDist));
    } else if (pointers.current.size === 1 && zoom > 1 && !loupe) {
      setPan({
        x: g.current.startPan.x + (e.clientX - g.current.startPt.x),
        y: g.current.startPan.y + (e.clientY - g.current.startPt.y),
      });
    }
  };

  const onPointerUp = (e) => {
    const wasSingle = pointers.current.size === 1;
    pointers.current.delete(e.pointerId);
    setDragging(false);
    if (e.pointerType === 'touch') setLoupePos((p) => ({ ...p, show: false }));
    if (wasSingle && zoom === 1 && !loupe && e.pointerType !== 'mouse') {
      const dx = e.clientX - g.current.startPt.x;
      const dy = e.clientY - g.current.startPt.y;
      if (Math.abs(dx) > 70 && Math.abs(dy) < 60) go(dx < 0 ? 1 : -1);
    }
  };

  if (!artwork) return null;

  const imgFilter = mode === 'squint' ? 'blur(6px) contrast(1.5) grayscale(1)' : mode === 'values' ? 'url(#values-4)' : 'none';
  const hasWip = Boolean(artwork.wip);

  const tools = [
        // { id: 'edges', icon: FaDrawPolygon, label: 'Lines', on: mode === 'edges', run: () => setMode((m) => (m === 'edges' ? 'none' : 'edges')), hint: 'E' },
    { id: 'grid', icon: FaBorderAll, label: 'Grid', on: grid, run: () => setGrid((v) => !v), hint: 'G' },
    { id: 'loupe', icon: FaSearch, label: 'Loupe', on: loupe, run: () => { setLoupe((v) => !v); resetView(); }, hint: 'L' },
    { id: 'squint', icon: FaAdjust, label: 'Squint', on: mode === 'squint', run: () => setMode((m) => (m === 'squint' ? 'none' : 'squint')), hint: 'S' },
    // { id: 'values', icon: FaLayerGroup, label: 'Values', on: mode === 'values', run: () => setMode((m) => (m === 'values' ? 'none' : 'values')), hint: 'V' },
    ...(hasWip ? [{ id: 'process', icon: FaHistory, label: 'Process', on: process, run: () => setProcess((v) => !v), hint: '' }] : []),
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-stretch lg:items-center justify-center lg:p-6">
        {/* hidden SVG filter: collapses the drawing into 4 tones */}
        <svg width="0" height="0" className="absolute" aria-hidden>
          <defs>
            <filter id="values-4" colorInterpolationFilters="sRGB">
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="discrete" tableValues="0 0.33 0.66 1" />
                <feFuncG type="discrete" tableValues="0 0.33 0.66 1" />
                <feFuncB type="discrete" tableValues="0 0.33 0.66 1" />
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="fixed inset-0 bg-black/92 backdrop-blur-xl" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full lg:max-w-6xl h-[100dvh] lg:h-auto lg:max-h-[92vh] flex flex-col lg:flex-row bg-[#09090c] lg:rounded-2xl lg:border border-white/10 overflow-hidden shadow-2xl"
        >
          <button
            onClick={onClose}
            data-ui
            aria-label="Close"
            className="absolute top-3 right-3 z-30 h-10 w-10 rounded-full bg-black/70 border border-white/15 text-zinc-300 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
          >
            <FaTimes className="text-xs" />
          </button>

          {/* ── Stage ── */}
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerLeave={() => setLoupePos((p) => ({ ...p, show: false }))}
            onWheel={(e) => setZoomSafe(zoom - e.deltaY * 0.002)}
            onDoubleClick={(e) => { if (!e.target.closest('[data-ui]')) setZoomSafe(zoom > 1 ? 1 : 2.5); }}
            className={`relative h-[56dvh] lg:h-auto lg:flex-1 lg:min-h-[620px] bg-[#050507] flex items-center justify-center overflow-hidden select-none touch-none ${
              loupe ? 'cursor-crosshair' : zoom > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : ''
            }`}
          >
            {/* counter + prev/next */}
            {artworks.length > 1 && (
              <div data-ui className="absolute top-3 left-3 z-30 flex items-center gap-1 h-10 pl-1 pr-3 rounded-full bg-black/70 border border-white/15 text-zinc-300">
                <button onClick={() => go(-1)} aria-label="Previous" className="h-8 w-8 flex items-center justify-center hover:text-white cursor-pointer"><FaChevronLeft className="text-[11px]" /></button>
                <span className="font-mono text-xs tabular-nums">{idx + 1}/{artworks.length}</span>
                <button onClick={() => go(1)} aria-label="Next" className="h-8 w-8 flex items-center justify-center hover:text-white cursor-pointer"><FaChevronRight className="text-[11px]" /></button>
              </div>
            )}

            <div
              className="relative inline-block"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transition: dragging ? 'none' : 'transform 0.18s ease-out',
              }}
            >
              {/* Process slider: unfinished (left) vs finished (right) */}
              {process && hasWip && (
                <img src={artwork.wip} alt="" draggable={false} className="absolute inset-0 w-full h-full object-contain" />
              )}
              <img
                ref={imgRef}
                src={artwork.image}
                alt={artwork.title}
                draggable={false}
                onLoad={(e) => setGridRows(Math.max(3, Math.round(4 * (e.currentTarget.naturalHeight / e.currentTarget.naturalWidth))))}
                className="block max-h-[calc(56dvh-5.5rem)] lg:max-h-[76vh] max-w-full w-auto object-contain shadow-2xl transition-[filter] duration-300"
                style={{
                  filter: imgFilter,
                  opacity: mode === 'edges' ? 0 : 1,
                  clipPath: process && hasWip ? `inset(0 0 0 ${split}%)` : undefined,
                }}
              />
              {process && hasWip && (
                <>
                  <span className="pointer-events-none absolute top-0 bottom-0 w-px bg-white/80" style={{ left: `${split}%` }} />
                  <span className="pointer-events-none absolute top-2 left-2 font-handwriting text-lg text-white drop-shadow">process</span>
                  <span className="pointer-events-none absolute top-2 right-2 font-handwriting text-lg text-white drop-shadow">finished</span>
                  <input
                    data-ui
                    type="range"
                    min="0"
                    max="100"
                    value={split}
                    onChange={(e) => setSplit(Number(e.target.value))}
                    aria-label="Process slider"
                    className="absolute bottom-3 left-4 right-4 accent-[#e8dfc8]"
                  />
                </>
              )}

              {/* Loupe */}
              {loupe && loupePos.show && (
                <div
                  className="pointer-events-none absolute rounded-full border-2 border-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.7)] bg-no-repeat"
                  style={{
                    width: LOUPE_R * 2,
                    height: LOUPE_R * 2,
                    left: loupePos.x - LOUPE_R,
                    top: loupePos.y - LOUPE_R - (loupePos.touch ? 90 : 0),
                    backgroundImage: `url(${artwork.image})`,
                    backgroundSize: `${loupePos.w * LOUPE_Z}px ${loupePos.h * LOUPE_Z}px`,
                    backgroundPosition: `${LOUPE_R - loupePos.x * LOUPE_Z}px ${LOUPE_R - loupePos.y * LOUPE_Z}px`,
                  }}
                />
              )}

              {/* Edge map (measured from the image's pixels) */}
              {study && (
                <div
                  className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-300 ${mode === 'edges' ? 'opacity-100' : 'opacity-0'}`}
                >
                  <img src={study.edgeUrl} alt="" draggable={false} className="w-full h-full object-fill" />
                </div>
              )}

              {/* Proportion grid */}
              {grid && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(232,223,200,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(232,223,200,0.35) 1px, transparent 1px)',
                    backgroundSize: `${100 / 4}% ${100 / gridRows}%`,
                    boxShadow: 'inset 0 0 0 1px rgba(232,223,200,0.35)',
                  }}
                />
              )}
            </div>

            {/* Viewing tools */}
            <div data-ui className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-0.5 p-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 max-w-[calc(100%-1rem)]">
              {tools.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={t.run}
                    title={t.hint ? `${t.label} (${t.hint})` : t.label}
                    aria-pressed={t.on}
                    className={`h-9 px-2.5 sm:px-3 rounded-full flex items-center gap-1.5 text-[11px] transition-colors cursor-pointer ${
                      t.on ? 'bg-[#e8dfc8] text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Icon className="text-[12px]" />
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                );
              })}
              <span className="w-px h-4 bg-white/15 mx-1" />
              <button onClick={() => setZoomSafe(zoom - 0.5)} aria-label="Zoom out" className="h-9 w-8 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"><FaSearchMinus className="text-xs" /></button>
              <button onClick={() => setZoomSafe(zoom + 0.5)} aria-label="Zoom in" className="h-9 w-8 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"><FaSearchPlus className="text-xs" /></button>
            </div>
          </div>

          {/* ── Info ── */}
          <div className="relative flex-1 lg:flex-none lg:w-[400px] min-h-0 overflow-hidden border-t lg:border-t-0 lg:border-l border-white/10">
            <AmbientGlow src={artwork.image} />
            <div className="relative h-full overflow-y-auto p-6 lg:p-8 flex flex-col gap-6">
            <div>
              <p className="font-mono text-xs text-zinc-500">
                No. {String(idx + 1).padStart(2, '0')} &middot; {artwork.category}{artwork.size ? ` · ${artwork.size}` : ''}
              </p>
              <h2 className="font-display text-4xl text-white mt-2 leading-none">{artwork.title}</h2>
              <Signature id={artwork.id} />
            </div>
              <div className="mt-auto space-y-4">
              <div className="flex items-center gap-3">
                <Tally n={count} />
                <span className="font-handwriting text-lg text-zinc-400 shrink-0">{count} hearts</span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={(e) => toggleLike(artwork.id, e)}
                  aria-pressed={liked}
                  className={`h-11 px-4 rounded-xl border flex items-center gap-2 text-sm transition-colors cursor-pointer ${
                    liked ? 'border-rose-500/50 bg-rose-500/10 text-rose-300' : 'border-white/15 text-zinc-300 hover:text-white hover:border-white/40'
                  }`}
                >
                  {liked ? <FaHeart className="text-rose-500" /> : <FaRegHeart />}
                  <span className="font-mono text-xs tabular-nums">{count}</span>
                </button>

                <button
                  onClick={() => handleDownloadImage(artwork.image, `${artwork.id}-gagan-poojari.webp`)}
                  className="flex-1 h-11 rounded-xl bg-white text-black text-sm font-medium flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  <FaDownload className="text-xs" /> Download
                </button>

                <button
                  onClick={() => setShareOpen(true)}
                  aria-label="Share"
                  className="h-11 w-11 rounded-xl border border-white/15 text-zinc-300 hover:text-white hover:border-white/40 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <FaShareAlt className="text-sm" />
                </button>
              </div>
            </div>

            <ContactSheet artworks={artworks} activeId={artwork.id} onSelect={onSelectArtwork} />

            <VoiceNote key={artwork.id} src={artwork.voice} words={artwork.words} />

            <DeskScene src={artwork.image} size={artwork.size} />
            
          </div>
          </div>
        </motion.div>
      </div>

      <SocialShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} artwork={artwork} />
    </>
  );
}