'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RULES = [
  'The first rule - you do not talk about the stack.',
  'The second rule - you DO NOT talk about the stack.',
  'Third rule - if someone says stop, the code stops.',
  'Fourth rule - only two eyes on the screen.',
  'Fifth rule - one project at a time.',
];

const THRESHOLDS = [0, 20, 42, 63, 85];

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0); // 0=loading 1=entering 2=exit
  const [activeRule, setActiveRule] = useState(0);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // ── Stars canvas ──────────────────────────────────────────────────────────
  const initStars = useCallback((canvas) => {
    const stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.3 + 0.2,
        speed: Math.random() * 0.18 + 0.04,
        opacity: Math.random() * 0.6 + 0.1,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.018 + 0.004,
      });
    }
    return stars;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let stars = initStars(canvas);

    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const dx = (mouseRef.current.x - cx) * 0.03;
      const dy = (mouseRef.current.y - cy) * 0.03;

      stars.forEach((s) => {
        s.y += s.speed;
        s.twinkle += s.twinkleSpeed;
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
        const tw = 0.5 + 0.5 * Math.sin(s.twinkle);
        ctx.beginPath();
        ctx.arc(s.x + dx, s.y + dy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${(s.opacity * tw).toFixed(3)})`;
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [initStars]);

  // ── Progress ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        const step = p < 80 ? 1.8 : p < 95 ? 0.9 : 0.4;
        return Math.min(p + step, 100);
      });
    }, 28);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    THRESHOLDS.forEach((t, i) => {
      if (progress >= t) setActiveRule(i);
    });
  }, [progress]);

  useEffect(() => {
    if (progress < 100) return;
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1100);
    const t3 = setTimeout(() => onComplete?.(), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [progress, onComplete]);

  const ruleState = (i) => {
    if (progress < 100 && i === activeRule) return 'active';
    if (i < activeRule || progress === 100) return 'done';
    return 'idle';
  };

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="fixed inset-0 z-[999] bg-[#050508] flex flex-col items-center justify-center overflow-hidden select-none"
        >
          {/* Stars */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: 0, animation: 'loaderStarsIn 1.2s ease 0.3s forwards' }}
          />

          {/* Film grain */}
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.025 }}>
            <svg width="100%" height="100%">
              <filter id="grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
              </filter>
              <rect width="100%" height="100%" filter="url(#grain)" />
            </svg>
          </div>

          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px)',
              opacity: 0.4,
            }}
          />

          {/* Color split gradients */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#297bc9]/[0.05] via-transparent to-transparent" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tl from-[#c7061c]/[0.05] via-transparent to-transparent" />

          {/* Diagonal slash */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ animation: 'loaderSlashIn 1.5s ease 0.5s both' }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-100%',
                left: '50%',
                width: '1px',
                height: '300%',
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 70%, transparent)',
                transform: 'rotate(22deg) translateX(-50%)',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-lg px-8">

            {/* Dual identity */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.4 }}
              className="flex items-center w-full"
            >
              <div className="flex-1 text-right pr-5" style={{ borderRight: '1px solid rgba(41,123,201,0.25)' }}>
                <p className="text-[9px] tracking-[0.25em] uppercase mb-1" style={{ color: 'rgba(41,123,201,0.5)' }}>
                  Personality I
                </p>
                <p className="text-[13px] tracking-[0.08em] italic font-serif" style={{ color: 'rgba(41,123,201,0.85)' }}>
                  MERN Developer
                </p>
              </div>

              {/* Center node */}
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-2 h-2 rounded-full bg-white mx-0 flex-shrink-0"
                style={{ boxShadow: '0 0 10px 2px rgba(255,255,255,0.3)' }}
              />

              <div className="flex-1 text-left pl-5" style={{ borderLeft: '1px solid rgba(199,6,28,0.25)' }}>
                <p className="text-[9px] tracking-[0.25em] uppercase mb-1" style={{ color: 'rgba(199,6,28,0.5)' }}>
                  Personality II
                </p>
                <p className="text-[13px] tracking-[0.08em] italic font-serif" style={{ color: 'rgba(199,6,28,0.85)' }}>
                  ML Engineer
                </p>
              </div>
            </motion.div>

            {/* Rules */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.8 }}
              className="w-full flex flex-col gap-[6px]"
            >
              {RULES.map((rule, i) => {
                const state = ruleState(i);
                return (
                  <motion.p
                    key={i}
                    className="text-[10px] tracking-[0.14em] uppercase text-center font-mono transition-all duration-500"
                    style={{
                      color:
                        state === 'active'
                          ? 'rgba(255,255,255,0.65)'
                          : state === 'done'
                          ? 'rgba(255,255,255,0.07)'
                          : 'rgba(255,255,255,0.12)',
                      letterSpacing: state === 'active' ? '0.18em' : '0.14em',
                    }}
                  >
                    {rule}
                    {state === 'active' && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.85, repeat: Infinity }}
                        className="inline-block w-[5px] h-[9px] bg-white/50 rounded-sm ml-2 align-middle"
                      />
                    )}
                  </motion.p>
                );
              })}
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="w-full"
            >
              <div className="relative w-full h-[1px] bg-white/[0.06] overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #297bc9, #fff 48%, #c7061c)',
                    transition: 'width 0.05s linear',
                  }}
                />
                {/* glow dot */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-white"
                  style={{
                    left: `${progress}%`,
                    boxShadow: '0 0 6px 2px rgba(255,255,255,0.5)',
                    transition: 'left 0.05s linear',
                    marginLeft: '-1.5px',
                  }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[8px] tracking-[0.2em] uppercase text-white/10 font-mono">
                  Gagan Poojari
                </span>
                <span className="text-[8px] tracking-[0.1em] text-white/20 font-mono tabular-nums">
                  {Math.floor(progress)}%
                </span>
              </div>
            </motion.div>

          </div>

          {/* Entering text */}
          <AnimatePresence>
            {phase === 1 && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.4em] uppercase text-white/20 font-mono whitespace-nowrap"
              >
                Entering the first rule...
              </motion.p>
            )}
          </AnimatePresence>

          {/* Bottom tag */}
          <span className="absolute bottom-5 right-6 text-[8px] tracking-[0.18em] text-white/[0.06] uppercase font-mono">
            MERN · DSML · 2025
          </span>

          {/* CSS for canvas fade */}
          <style>{`
            @keyframes loaderStarsIn { to { opacity: 1; } }
            @keyframes loaderSlashIn { from { opacity: 0; } to { opacity: 1; } }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;