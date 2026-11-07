'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useAnimationFrame } from 'framer-motion';

// ── FULL-STACK / MERN TOPOLOGY (BLUE THEME) ──────────────────────────────────
const MERN_NODES = [
  { id: 0, name: 'Next.js 15', icon: '/icons/mern-icons/nextjs-icon.png', tag: 'Edge SSR & Cloud Gateway', x: 120, y: 35 },
  { id: 1, name: 'React 19', icon: '/icons/mern-icons/reactjs-icon.png', tag: 'Concurrent Architecture', x: 42, y: 105 },
  { id: 2, name: 'Express.js', icon: '/icons/mern-icons/expressjs-icon.png', tag: 'High-Throughput REST APIs', x: 198, y: 110 },
  { id: 3, name: 'MongoDB', icon: '/icons/mern-icons/mongodb-icon.webp', tag: 'Distributed Document Sharding', x: 55, y: 215 },
  { id: 4, name: 'Tailwind CSS', icon: '/icons/mern-icons/tailwind-css-icon.png', tag: 'Zero-Runtime Design Systems', x: 185, y: 225 },
  { id: 5, name: 'Git', icon: '/icons/mern-icons/git-icon.png', tag: 'GitOps & Cloud CI/CD Pipelines', x: 120, y: 295 },
];

const MERN_EDGES = [
  [0, 1], [0, 2], [1, 2],
  [1, 3], [2, 4], [2, 3],
  [3, 4], [3, 5], [4, 5],
];

// ── AI & ML NEURAL TOPOLOGY (RED THEME) ───────────────────────────────────────
// Layered Neural Topology: Input Layer -> Tensor Engine -> Inference Output
const AIML_NODES = [
  { id: 0, name: 'Python', icon: '/icons/aiml-icons/python-icon.png', tag: 'Vectorized Algorithmic Core', x: 45, y: 65 },
  { id: 1, name: 'NumPy', icon: '/icons/aiml-icons/numpy-icon.png', tag: 'N-Dimensional Tensor Math', x: 45, y: 235 },
  { id: 2, name: 'PyTorch', icon: '/icons/aiml-icons/pytorch-icon.png', tag: 'Deep Learning & Backprop', x: 125, y: 45 },
  { id: 3, name: 'TensorFlow', icon: '/icons/aiml-icons/tensorflow-icon.png', tag: 'Distributed Graph Engine', x: 125, y: 165 },
  { id: 4, name: 'OpenCV', icon: '/icons/aiml-icons/opencv-icon.webp', tag: 'Real-Time Computer Vision', x: 200, y: 95 },
  { id: 5, name: 'Scikit-Learn', icon: '/icons/aiml-icons/scikit-learn-icon.png', tag: 'Predictive Inference Models', x: 200, y: 245 },
];

const AIML_EDGES = [
  [0, 2], [0, 3], [1, 3],
  [2, 3], [2, 4], [3, 4],
  [3, 5], [4, 5], [1, 5],
];

// ── DYNAMIC ELASTIC GRAPH COMPONENT ──────────────────────────────────────────
function DynamicWebGraph({ nodes, edges, colorTheme, activeNodeId, setActiveNodeId }) {
  const [offsets, setOffsets] = useState({});

  const isBlue = colorTheme === 'blue';
  const lineColor = isBlue ? 'rgba(56, 189, 248, 0.22)' : 'rgba(239, 68, 68, 0.22)';
  const activeLineColor = isBlue ? 'rgba(56, 189, 248, 0.95)' : 'rgba(239, 68, 68, 0.95)';
  const glowShadow = isBlue ? '0 0 14px rgba(56, 189, 248, 0.65)' : '0 0 14px rgba(239, 68, 68, 0.65)';
  const borderHover = isBlue ? 'hover:border-sky-400/80' : 'hover:border-red-400/80';
  const tagBg = isBlue ? 'bg-sky-500/10 border-sky-400/40 text-sky-200' : 'bg-red-500/10 border-red-400/40 text-red-200';

  const getNodePos = (node) => {
    const off = offsets[node.id] || { x: 0, y: 0 };
    return {
      x: node.x + off.x,
      y: node.y + off.y,
    };
  };

  const handleDrag = (nodeId, info) => {
    setOffsets(prev => ({
      ...prev,
      [nodeId]: { x: info.offset.x, y: info.offset.y },
    }));
  };

  const handleDragEnd = (nodeId) => {
    setOffsets(prev => ({
      ...prev,
      [nodeId]: { x: 0, y: 0 },
    }));
  };

  return (
    <div className="relative w-[250px] h-[340px] select-none mx-auto">
      {/* SVG Elastic Web Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
        {edges.map(([startIdx, endIdx], i) => {
          const p1 = getNodePos(nodes[startIdx]);
          const p2 = getNodePos(nodes[endIdx]);
          const isEdgeActive = activeNodeId === startIdx || activeNodeId === endIdx;

          return (
            <line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={isEdgeActive ? activeLineColor : lineColor}
              strokeWidth={isEdgeActive ? '2' : '1.2'}
              strokeDasharray={isEdgeActive ? 'none' : '4 4'}
              style={{
                filter: isEdgeActive ? `drop-shadow(${glowShadow})` : 'none',
                transition: 'stroke 0.15s ease, stroke-width 0.15s ease',
              }}
            />
          );
        })}
      </svg>

      {/* Movable Interactive Icon Nodes */}
      {nodes.map((node) => {
        return (
          <div
            key={node.name}
            className="absolute z-10"
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <motion.div
              drag
              dragSnapToOrigin
              dragElastic={0.4}
              dragConstraints={{ left: -45, right: 45, top: -45, bottom: 45 }}
              onDrag={(e, info) => handleDrag(node.id, info)}
              onDragEnd={() => handleDragEnd(node.id)}
              onMouseEnter={() => setActiveNodeId(node.id)}
              onMouseLeave={() => setActiveNodeId(null)}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.92 }}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#080910]/95 border border-white/15 ${borderHover} backdrop-blur-2xl flex items-center justify-center p-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.85)] cursor-grab active:cursor-grabbing transition-colors touch-none`}
              title="Drag me!"
            >
              <Image
                src={node.icon}
                alt={node.name}
                width={28}
                height={28}
                className="w-full h-full object-contain pointer-events-none select-none"
              />
            </motion.div>

            {/* Micro Tooltip */}
            <AnimatePresence>
              {activeNodeId === node.id && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.9 }}
                  className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 z-40 px-2.5 py-1 rounded-lg border text-mono text-[10px] whitespace-nowrap shadow-2xl backdrop-blur-xl pointer-events-none ${tagBg}`}
                >
                  <span className="font-bold text-white">{node.name}:</span> {node.tag}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ── PERSONAL HANDWRITTEN THOUGHTS ─────────────────────────────────────────────
const THOUGHTS = [
  {
    id: 1,
    quote: "I'm of the opinion that engineering is a career where you realize how dumb you were a year ago. In other words, you never stop learning and growing.",
    // label: "ethos",
  },
  {
    id: 2,
    quote: "The real art for a programmer at present is to be versatile, to be able to learn, improvise and adapt to circumstances as they present themselves.",
    // label: "philosophy",
  },
  {
    id: 3,
    quote: "Best solutions to an engineering problem come from picking the right approach first, especially now that shipping a new feature is just a series of prompts and clicks.",
    // label: "architecture",
  },
];

// ── MOBILE ORBIT LAYER: icons orbit the portrait with depth (front/back) ─────
function OrbitLayer({ nodes, isBlue, activeId, onPick }) {
  const wrapRef = useRef(null);
  const itemRefs = useRef([]);
  const size = useRef({ w: 0, h: 0 });
  const angle = useRef(0);
  const speed = useRef(1);
  const elapsed = useRef(0);
  const activeRef = useRef(activeId);
  activeRef.current = activeId;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      size.current = { w: el.offsetWidth, h: el.offsetHeight };
    });
    ro.observe(el);
    size.current = { w: el.offsetWidth, h: el.offsetHeight };
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    const { w, h } = size.current;
    if (!w) return;
    const d = Math.min(delta, 50);
    elapsed.current += d;
    const target = activeRef.current == null ? 1 : 0;
    speed.current += (target - speed.current) * 0.08;
    angle.current += d * 0.00022 * speed.current;
    const fade = Math.min(1, elapsed.current / 500);
    const rx = w * 0.44;
    const ry = h * 0.4;
    const n = nodes.length;

    for (let i = 0; i < n; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const a = angle.current + (i * Math.PI * 2) / n;
      const s = Math.sin(a);
      const x = w / 2 + rx * Math.cos(a);
      const y = h * 0.5 + ry * s;
      const depth = (s + 1) / 2; // 0 back → 1 front
      const isActive = activeRef.current === nodes[i].id;
      const sc = (0.72 + 0.34 * depth) * (isActive ? 1.3 : 1);
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${sc})`;
      el.style.zIndex = isActive ? 40 : s > 0 ? 30 : 5;
      el.style.opacity = String((isActive ? 1 : s > 0 ? 1 : 0.5) * fade);
    }
  });

  const ring = isBlue ? 'rgba(56,189,248,0.28)' : 'rgba(239,68,68,0.28)';

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0">
      {/* Orbit track */}
      <svg className="absolute inset-0 w-full h-full z-[4] overflow-visible">
        <ellipse cx="50%" cy="50%" rx="44%" ry="40%" fill="none" stroke={ring} strokeWidth="1" strokeDasharray="2 7" strokeLinecap="round" />
        <ellipse cx="50%" cy="50%" rx="34%" ry="31%" fill="none" stroke={ring} strokeWidth="0.6" opacity="0.5" />
      </svg>

      {nodes.map((node, i) => {
        const isActive = activeId === node.id;
        const activeRing = isBlue
          ? 'border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.8)]'
          : 'border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.8)]';
        return (
          <button
            key={node.name}
            ref={(el) => (itemRefs.current[i] = el)}
            onClick={() => onPick(node.id)}
            aria-label={node.name}
            className={`pointer-events-auto absolute left-0 top-0 w-11 h-11 rounded-full bg-[#080910]/90 backdrop-blur-xl border flex items-center justify-center p-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.8)] will-change-transform ${
              isActive ? activeRing : 'border-white/15'
            }`}
            style={{ opacity: 0 }}
          >
            <Image src={node.icon} alt={node.name} width={28} height={28} className="w-full h-full object-contain pointer-events-none select-none" />
          </button>
        );
      })}
    </div>
  );
}

// ── MOBILE / TABLET STAGE ────────────────────────────────────────────────────
function MobileStage() {
  const stageRef = useRef(null);
  const portraitRef = useRef(null);
  const [engine, setEngine] = useState('mern');
  const [activeId, setActiveId] = useState(null);
  const [lens, setLens] = useState({ x: 0, y: 0, active: false });

  // Touch/pointer parallax: name drifts one way, portrait the other
  const px = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 110, damping: 18 });
  const nameX = useTransform(sx, [-0.5, 0.5], [-20, 20]);
  const portraitX = useTransform(sx, [-0.5, 0.5], [7, -7]);

  const isBlue = engine === 'mern';
  const nodes = isBlue ? MERN_NODES : AIML_NODES;
  const activeNode = nodes.find((n) => n.id === activeId) || null;

  const handleMove = (e) => {
    const s = stageRef.current?.getBoundingClientRect();
    if (s) px.set((e.clientX - s.left) / s.width - 0.5);
    const p = portraitRef.current?.getBoundingClientRect();
    if (p) setLens({ x: e.clientX - p.left, y: e.clientY - p.top, active: true });
  };
  const handleLeave = () => {
    px.set(0);
    setLens((l) => ({ ...l, active: false }));
  };
  const switchEngine = (k) => {
    setEngine(k);
    setActiveId(null);
  };
  const pick = (id) => setActiveId((cur) => (cur === id ? null : id));

  const sizes = '(max-width: 640px) 70vw, 340px';
  const nameCls = 'text-transparent bg-clip-text font-bold bg-gradient-to-b';

  return (
    <div className="lg:hidden flex flex-col items-center relative w-full my-auto py-2">
      {/* Stage: name + portrait + orbit share one coordinate space → always centered together */}
      <div
        ref={stageRef}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        onPointerUp={handleLeave}
        onPointerCancel={handleLeave}
        className="relative isolate mx-auto"
        style={{ width: 'min(100%, 440px, 46dvh)', aspectRatio: '1 / 1.08', touchAction: 'pan-y' }}
      >
        {/* Engine-colored aura */}
        <div
          className="pointer-events-none absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[92%] aspect-square rounded-full blur-3xl transition-opacity duration-700"
          style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.35), transparent 65%)', opacity: isBlue ? 0.55 : 0 }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[92%] aspect-square rounded-full blur-3xl transition-opacity duration-700"
          style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.35), transparent 65%)', opacity: isBlue ? 0 : 0.55 }}
        />

        {/* NAME — sits a bit lower, behind head & shoulders */}
        <motion.div
          style={{ x: nameX }}
          className="pointer-events-none select-none absolute inset-x-0 top-[21%] z-[8] flex flex-col items-center text-center font-display leading-[0.76] tracking-wider"
        >
          <span style={{ fontSize: 'min(19vw, 118px)' }} className={`${nameCls} from-white/80 via-white/40 to-white/10 drop-shadow-[0_0_40px_rgba(255,255,255,0.08)]`}>
            GAGAN
          </span>
          <span style={{ fontSize: 'min(19vw, 118px)' }} className={`${nameCls} from-white/65 via-white/30 to-white/5`}>
            POOJARI
          </span>
        </motion.div>

        {/* Portrait */}
        <motion.div style={{ x: portraitX }} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] aspect-[4/5] z-20">
          <div
            ref={portraitRef}
            className="relative w-full h-full"
            style={{
              maskImage: 'linear-gradient(to bottom, black 0%, black 82%, rgba(0,0,0,0.5) 93%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 82%, rgba(0,0,0,0.5) 93%, transparent 100%)',
            }}
          >
            <Image src="/gagan-cutout-bw.webp" alt="" fill priority sizes={sizes} className="object-contain object-bottom select-none brightness-0 pointer-events-none" />
            <Image src="/gagan-cutout-bw.webp" alt="Gagan Poojari" fill priority sizes={sizes} className="object-contain object-bottom select-none contrast-[1.14] drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] pointer-events-none" />
            <div
              className="absolute inset-0 transition-opacity duration-200 pointer-events-none"
              style={{
                opacity: lens.active ? 1 : 0,
                maskImage: `radial-gradient(circle 110px at ${lens.x}px ${lens.y}px, black 35%, transparent 100%)`,
                WebkitMaskImage: `radial-gradient(circle 110px at ${lens.x}px ${lens.y}px, black 35%, transparent 100%)`,
              }}
            >
              <Image src="/gagan-cutout.webp" alt="" fill priority sizes={sizes} className="object-contain object-bottom select-none contrast-[1.08] pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Orbiting tech icons (re-mounts on engine switch) */}
        <OrbitLayer key={engine} nodes={nodes} isBlue={isBlue} activeId={activeId} onPick={pick} />
      </div>

      {/* Engine switcher */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-xl shadow-lg z-20">
        <button
          onClick={() => switchEngine('mern')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-mono text-[11px] uppercase tracking-wider transition-all duration-200 ${
            isBlue ? 'bg-sky-500/20 border border-sky-400/50 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.3)]' : 'text-zinc-400 border border-transparent'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isBlue ? 'bg-sky-400 shadow-[0_0_6px_#38bdf8]' : 'bg-zinc-600'}`} />
          MERN &bull; Cloud
        </button>
        <button
          onClick={() => switchEngine('aiml')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-mono text-[11px] uppercase tracking-wider transition-all duration-200 ${
            !isBlue ? 'bg-red-500/20 border border-red-400/50 text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.3)]' : 'text-zinc-400 border border-transparent'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${!isBlue ? 'bg-red-400 shadow-[0_0_6px_#ef4444]' : 'bg-zinc-600'}`} />
          AI &bull; ML
        </button>
      </div>
    </div>
  );
}

// ── MAIN HERO MASTERPIECE ────────────────────────────────────────────────────
export default function HeroMasterpiece() {
  const portraitRef = useRef(null);

  // ── Dynamic States ─────────────────────────────────────────────────────────
  const [lens, setLens] = useState({ x: 260, y: 280, active: false });
  const [activeMernId, setActiveMernId] = useState(null);
  const [activeAiId, setActiveAiId] = useState(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Localized color spotlight on transparent cutout
  const handlePortraitMouseMove = (e) => {
    if (!portraitRef.current) return;
    const rect = portraitRef.current.getBoundingClientRect();
    setLens({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handlePortraitTouchMove = (e) => {
    if (!portraitRef.current || !e.touches || !e.touches[0]) return;
    const rect = portraitRef.current.getBoundingClientRect();
    setLens({
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
      active: true,
    });
  };

  const handlePortraitMouseLeave = () => {
    setLens((prev) => ({ ...prev, active: false }));
  };

  const currentThought = THOUGHTS[quoteIndex];

  return (
    <section className="relative w-full min-h-[100dvh] lg:min-h-screen flex flex-col justify-between pt-20 sm:pt-24 lg:pt-8 pb-5 sm:pb-6 px-3 sm:px-6 lg:px-8 max-w-[1440px] mx-auto font-body select-none overflow-x-clip">
      
      {/* ── BACKGROUND: MONUMENTAL, ROCK-SOLID NAME (BROUGHT UP, BEHIND HEAD & SHOULDERS) ── */}
      <div className="hidden lg:flex absolute inset-x-0 lg:top-[21%] flex-col items-center justify-center pointer-events-none select-none z-0">
        <div className="flex flex-col items-center justify-center text-center font-display leading-[0.74] tracking-wider w-full">
          <span className="text-[17vw] sm:text-[14.5vw] md:text-[13vw] lg:text-[11vw] xl:text-[9.5vw] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/80 via-white/40 to-white/10 drop-shadow-[0_0_45px_rgba(255,255,255,0.08)]">
            GAGAN
          </span>
          <span className="text-[17vw] sm:text-[14.5vw] md:text-[13vw] lg:text-[11vw] xl:text-[9.5vw] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/65 via-white/30 to-white/5 drop-shadow-[0_0_35px_rgba(255,255,255,0.05)]">
            POOJARI
          </span>
        </div>
      </div>

      {/* ── MAIN STAGE ───────────────────────────────────────────────────────── */}
      
      {/* DESKTOP STAGE (lg: 1024px+): WIDESCREEN 3-COLUMN MASTERPIECE */}
      <div className="hidden lg:grid relative my-auto py-1 sm:py-2 grid-cols-12 gap-2 items-center z-10 w-full">
        
        {/* ── LEFT: FULL-STACK / MERN BLUE TOPOLOGY ── */}
        <div className="col-span-3 flex flex-col items-start space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 text-sky-300 font-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
            <span>MERN &bull; CLOUD ARCHITECTURE</span>
          </div>

          <DynamicWebGraph
            nodes={MERN_NODES}
            edges={MERN_EDGES}
            colorTheme="blue"
            activeNodeId={activeMernId}
            setActiveNodeId={setActiveMernId}
          />
        </div>

        {/* ── CENTER: ELEVATED PORTRAIT SILHOUETTE ── */}
        <div className="col-span-6 flex flex-col items-center justify-center relative">
          <div className="pointer-events-none absolute -inset-8 bg-gradient-to-tr from-white/15 via-zinc-400/10 to-transparent rounded-full blur-3xl opacity-50" />

          <div
            ref={portraitRef}
            onMouseMove={handlePortraitMouseMove}
            onTouchMove={handlePortraitTouchMove}
            onMouseLeave={handlePortraitMouseLeave}
            className="group relative w-[360px] md:w-[410px] lg:w-[440px] xl:w-[475px] aspect-[4/5] flex items-center justify-center cursor-crosshair select-none z-20"
          >
            <div 
              className="relative w-full h-full"
              style={{
                maskImage: 'linear-gradient(to bottom, black 0%, black 82%, rgba(0,0,0,0.5) 93%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 82%, rgba(0,0,0,0.5) 93%, transparent 100%)',
              }}
            >
              {/* Layer 0: Silhouette Shield */}
              <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-0">
                <Image
                  src="/gagan-cutout-bw.webp"
                  alt=""
                  fill
                  priority
                  sizes="475px"
                  className="object-contain object-bottom select-none filter brightness-0"
                />
              </div>

              {/* Layer 1: High-Contrast B&W Cutout */}
              <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10">
                <Image
                  src="/gagan-cutout-bw.webp"
                  alt="Gagan Poojari - B&W Cutout"
                  fill
                  priority
                  sizes="475px"
                  className="object-contain object-bottom select-none filter contrast-[1.14] drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)]"
                />
              </div>

              {/* Layer 2: Color Spotlight Reveal */}
              <div
                className="absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-200 pointer-events-none z-20"
                style={{
                  opacity: lens.active ? 1 : 0,
                  maskImage: lens.active
                    ? `radial-gradient(circle 140px at ${lens.x}px ${lens.y}px, black 35%, transparent 100%)`
                    : 'none',
                  WebkitMaskImage: lens.active
                    ? `radial-gradient(circle 140px at ${lens.x}px ${lens.y}px, black 35%, transparent 100%)`
                    : 'none',
                }}
              >
                <Image
                  src="/gagan-cutout.webp"
                  alt="Gagan Poojari - Color Spotlight"
                  fill
                  priority
                  sizes="475px"
                  className="object-contain object-bottom select-none filter contrast-[1.08] drop-shadow-[0_20px_45px_rgba(255,255,255,0.15)]"
                />
              </div>

              {lens.active && (
                <div
                  className="pointer-events-none absolute w-[240px] h-[240px] rounded-full border border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.45)] mix-blend-screen transition-transform duration-75 z-30"
                  style={{
                    left: lens.x,
                    top: lens.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: AI / ML RED NEURAL TOPOLOGY ── */}
        <div className="col-span-3 flex flex-col items-end space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 mr-7 rounded-full border border-red-500/30 text-red-300 font-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_#ef4444]" />
            <span>AI &bull; MACHINE LEARNING</span>
          </div>

          <DynamicWebGraph
            nodes={AIML_NODES}
            edges={AIML_EDGES}
            colorTheme="red"
            activeNodeId={activeAiId}
            setActiveNodeId={setActiveAiId}
          />
        </div>

      </div>

      {/* MOBILE & TABLET STAGE (< lg) */}
      <MobileStage />

      {/* ── BOTTOM ANCHOR: MINIMALIST HANDWRITTEN FIELD NOTE & SIGNATURE ── */}
      <div className="relative w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto flex flex-col items-center justify-center z-30 pt-1 pb-2 sm:pb-3 px-4 pointer-events-auto">
        <div 
          onClick={() => setQuoteIndex((prev) => (prev < THOUGHTS.length - 1 ? prev + 1 : 0))}
          className="group relative flex flex-col items-center text-center cursor-pointer select-none transition-transform duration-300 hover:scale-[1.01]"
          title="Click to cycle thoughts"
        >
          {/* Handwritten Quote Body */}
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center max-w-2xl px-2"
            >
              <p className="font-handwriting text-lg sm:text-xl md:text-2xl lg:text-[27px] text-zinc-100/95 leading-snug sm:leading-relaxed font-normal tracking-wide drop-shadow-[0_2px_15px_rgba(255,255,255,0.06)]">
                &ldquo;{currentThought.quote}&rdquo;
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Minimalist Micro Dot Indicators */}
          <div className="flex items-center gap-1.5 mt-2 opacity-35 group-hover:opacity-80 transition-opacity">
            {THOUGHTS.map((t, idx) => (
              <span
                key={t.id}
                className={`h-1 rounded-full transition-all duration-300 ${
                  quoteIndex === idx ? 'w-4 bg-white/90' : 'w-1 bg-zinc-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}