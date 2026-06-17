'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const GLITCH_CHARS = '!<>-_\\/[]{}-=+*^?#@%$&ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const SOCIALS = [
  {
    name: 'GitHub',
    handle: 'Gagan-poojari',
    hovcol: '#ffffff',
    url: 'https://github.com/Gagan-poojari',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    handle: 'gagan-poojari',
    hovcol: '#0a66c2',
    url: 'https://www.linkedin.com/in/gagan-poojari-840744319/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#297bc9">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────
   VALIDATION
───────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(fields) {
  const errors = {};
  if (!fields.from_name.trim()) errors.from_name = 'Name is required.';
  else if (fields.from_name.trim().length < 2) errors.from_name = 'Name is too short.';

  if (!fields.from_email.trim()) errors.from_email = 'Email is required.';
  else if (!EMAIL_RE.test(fields.from_email.trim())) errors.from_email = 'Enter a valid email address.';

  if (!fields.message.trim()) errors.message = 'Message is required.';

  return errors;
}

/* ─────────────────────────────────────────────
   STATUS CONFIG
───────────────────────────────────────────── */
const STATUS_MAP = {
  idle:        { label: '> Send Message',          color: 'var(--c-blue)' },
  sending:     { label: '> Transmitting...',        color: 'var(--c-yellow)' },
  success:     { label: '> Message Sent ✓',         color: 'var(--c-green)' },
  network_err: { label: '> Network Error — Retry',  color: 'var(--c-red)' },
};

/* ─────────────────────────────────────────────
   PARTICLE CANVAS
───────────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const dots = useRef([]);
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    const mkDot = () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.4 + 0.3, a: Math.random() * 0.35 + 0.08,
    });

    resize();
    dots.current = Array.from({ length: 55 }, mkDot);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.current.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
        const dx = d.x - mouse.current.x, dy = d.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) { d.x += dx / dist * 0.5; d.y += dy / dist * 0.5; }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(41,123,201,${d.a})`;
        ctx.fill();
      });
      for (let i = 0; i < dots.current.length; i++) {
        for (let j = i + 1; j < dots.current.length; j++) {
          const dx = dots.current[i].x - dots.current[j].x;
          const dy = dots.current[i].y - dots.current[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(dots.current[i].x, dots.current[i].y);
            ctx.lineTo(dots.current[j].x, dots.current[j].y);
            ctx.strokeStyle = `rgba(41,123,201,${0.06 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf.current = requestAnimationFrame(draw);
    };

    const onMove = e => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    canvas.parentElement.addEventListener('mousemove', onMove);
    canvas.parentElement.addEventListener('mouseleave', onLeave);
    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
      canvas.parentElement?.removeEventListener('mousemove', onMove);
      canvas.parentElement?.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   GLITCH DECODE LABEL
───────────────────────────────────────────── */
function GlitchText({ text, triggered, style = {} }) {
  const [letters, setLetters] = useState(() =>
    text.split('').map(ch => ({ char: ch, locked: true, gx: 0, gy: 0, hue: 200 }))
  );
  const rafRef = useRef(null);
  const stateRef = useRef({ locked: [], iter: [] });

  useEffect(() => {
    setLetters(text.split('').map(ch => ({ char: ch, locked: true, gx: 0, gy: 0, hue: 200 })));
  }, [text]);

  useEffect(() => {
    if (!triggered) return;
    const MAX = 8, STAGGER = 35;
    stateRef.current.locked = Array(text.length).fill(false);
    stateRef.current.iter = Array(text.length).fill(-9999);
    text.split('').forEach((_, i) => {
      setTimeout(() => { stateRef.current.iter[i] = 0; }, i * STAGGER);
    });
    let last = 0;
    const tick = ts => {
      if (ts - last < 42) { rafRef.current = requestAnimationFrame(tick); return; }
      last = ts;
      const s = stateRef.current;
      let allDone = true;
      const next = [];
      for (let i = 0; i < text.length; i++) {
        if (s.locked[i]) { next.push({ char: text[i], locked: true, gx: 0, gy: 0, hue: 200 }); continue; }
        if (s.iter[i] < 0) { next.push({ char: ' ', locked: false, gx: 0, gy: 0, hue: 200 }); allDone = false; continue; }
        allDone = false;
        if (s.iter[i] >= MAX) {
          s.locked[i] = true;
          next.push({ char: text[i], locked: true, gx: 0, gy: 0, hue: 200 });
        } else {
          const bias = s.iter[i] / MAX;
          const ch = Math.random() < bias ? text[i] : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          s.iter[i]++;
          next.push({ char: ch, locked: false, gx: (Math.random() - 0.5) * 5, gy: (Math.random() - 0.5) * 3, hue: Math.floor(Math.random() * 60) + 180 });
        }
      }
      setLetters(next);
      if (allDone) return;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [triggered, text]);

  return (
    <span style={style}>
      {letters.map((l, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            transform: l.locked ? 'none' : `translate(${l.gx}px,${l.gy}px)`,
            color: l.locked ? 'inherit' : `hsl(${l.hue},80%,70%)`,
            textShadow: l.locked ? 'none' : `${(Math.random() - 0.5) * 3}px 0 rgba(199,6,28,0.7), ${(Math.random() - 0.5) * 3}px 0 rgba(41,123,201,0.7)`,
          }}
        >
          {text[i] === ' ' ? '\u00A0' : l.char}
        </span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────
   TERMINAL INPUT FIELD
───────────────────────────────────────────── */
function TerminalField({ label, id, type = 'text', value, onChange, placeholder, rows, maxLength, error, onBlur }) {
  const [focused, setFocused] = useState(false);
  const isTextarea = !!rows;
  const Tag = isTextarea ? 'textarea' : 'input';
  const hasError = !!error;

  const borderColor = hasError
    ? 'rgba(199,6,28,0.6)'
    : focused
    ? 'rgba(41,123,201,0.55)'
    : 'rgba(255,255,255,0.08)';

  const bgColor = hasError
    ? 'rgba(199,6,28,0.04)'
    : focused
    ? 'rgba(41,123,201,0.04)'
    : 'rgba(255,255,255,0.02)';

  const shadow = hasError
    ? '0 0 0 3px rgba(199,6,28,0.07), inset 0 0 20px rgba(199,6,28,0.04)'
    : focused
    ? '0 0 0 3px rgba(41,123,201,0.07), inset 0 0 20px rgba(41,123,201,0.04)'
    : 'none';

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label htmlFor={id} style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
        color: hasError ? 'rgba(199,6,28,0.8)' : focused ? 'var(--c-blue)' : 'rgba(255,255,255,0.3)',
        fontFamily: "'DM Mono', monospace",
        marginBottom: '6px',
        transition: 'color 0.2s',
      }}>
        <span style={{ color: hasError ? 'rgba(199,6,28,0.7)' : focused ? 'var(--c-blue)' : 'rgba(255,255,255,0.2)' }}>{'>'}</span>
        {label}
        {focused && !hasError && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ width: '6px', height: '11px', background: 'var(--c-blue)', display: 'inline-block', marginLeft: '2px' }}
          />
        )}
        {hasError && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ marginLeft: 'auto', fontSize: '9px', color: 'rgba(199,6,28,0.85)', letterSpacing: '0.05em', textTransform: 'none', fontFamily: "'DM Mono', monospace" }}
          >
            ⚠ {error}
          </motion.span>
        )}
      </label>
      <div style={{
        position: 'relative',
        border: `1px solid ${borderColor}`,
        borderRadius: '6px',
        background: bgColor,
        transition: 'all 0.22s ease',
        boxShadow: shadow,
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '6px', zIndex: 1,
          background: 'repeating-linear-gradient(to bottom,transparent 0,transparent 3px,rgba(255,255,255,0.008) 3px,rgba(255,255,255,0.008) 4px)',
        }} />
        <Tag
          id={id}
          type={type}
          name={id}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur?.(); }}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          style={{
            position: 'relative', zIndex: 2,
            width: '100%', background: 'transparent',
            border: 'none', outline: 'none',
            padding: '11px 14px',
            color: '#e8e8e8',
            fontSize: '13px',
            fontFamily: "'DM Mono', monospace",
            letterSpacing: '0.02em',
            resize: isTextarea ? 'none' : undefined,
            display: 'block',
            lineHeight: 1.6,
          }}
        />
        {isTextarea && maxLength && (
          <span style={{
            position: 'absolute', bottom: '8px', right: '10px', zIndex: 3,
            fontSize: '10px', fontFamily: "'DM Mono', monospace",
            color: value.length > maxLength * 0.85 ? 'rgba(199,6,28,0.6)' : 'rgba(255,255,255,0.15)',
            pointerEvents: 'none',
          }}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NETWORK ERROR TOAST
───────────────────────────────────────────── */
function NetworkErrorToast({ visible, onRetry }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.3 }}
          style={{
            marginTop: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(199,6,28,0.3)',
            background: 'rgba(199,6,28,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px' }}>⚡</span>
            <div>
              <p style={{ margin: 0, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(199,6,28,0.9)', fontFamily: "'DM Mono', monospace" }}>
                Network Error
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Mono', monospace" }}>
                Message failed to send. Check your connection.
              </p>
            </div>
          </div>
          <button
            onClick={onRetry}
            style={{
              flexShrink: 0,
              fontSize: '10px', fontFamily: "'DM Mono', monospace",
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '6px 12px', borderRadius: '6px',
              border: '1px solid rgba(199,6,28,0.4)',
              background: 'rgba(199,6,28,0.12)',
              color: 'rgba(199,6,28,0.9)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(199,6,28,0.22)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(199,6,28,0.12)'; }}
          >
            ↺ Retry
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   MAIN CONTACT SECTION
───────────────────────────────────────────── */
const Contact = () => {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [glitchTriggered, setGlitchTriggered] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | success | network_err
  const [fields, setFields] = useState({ from_name: '', from_email: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 0.5], [20, -10]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        setTimeout(() => setGlitchTriggered(true), 300);
      }
    }, { threshold: 0.15 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const setField = useCallback((key, val) => {
    setFields(prev => ({ ...prev, [key]: val }));
    // Clear field error on change if field was touched
    if (touched[key]) {
      const next = { ...fields, [key]: val };
      const errs = validate(next);
      setFieldErrors(prev => ({ ...prev, [key]: errs[key] || '' }));
    }
  }, [fields, touched]);

  const handleBlur = useCallback((key) => {
    setTouched(prev => ({ ...prev, [key]: true }));
    const errs = validate(fields);
    setFieldErrors(prev => ({ ...prev, [key]: errs[key] || '' }));
  }, [fields]);

  const progress = Object.values(fields).filter(v => v.trim()).length / 3;

  const sendEmail = async e => {
    e.preventDefault();
    if (status === 'sending' || status === 'success') return;

    setTouched({ from_name: true, from_email: true, message: true });
    const errs = validate(fields);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_name: fields.from_name.trim(),
          from_email: fields.from_email.trim(),
          message: fields.message.trim(),
        }),
      });

      if (!response.ok) throw new Error('Send failed');

      setStatus('success');
      setFields({ from_name: '', from_email: '', message: '' });
      setFieldErrors({});
      setTouched({});
    } catch {
      setStatus('network_err');
    }
  };

  const handleRetry = () => setStatus('idle');

  const btnStatus = status === 'network_err' ? 'idle' : status;
  const btnColor = STATUS_MAP[btnStatus].color;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        :root {
          --c-blue: #297bc9;
          --c-red: #c7061c;
          --c-green: #22c55e;
          --c-yellow: #f59e0b;
        }
        @keyframes scanmove {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .contact-social:hover .social-arrow { transform: translateX(3px); }
        .contact-social .social-arrow { transition: transform 0.2s; }
      `}</style>

      <section
        id="contact"
        ref={sectionRef}
        style={{
          position: 'relative',
          background: '#000',
          minHeight: '100vh',
          padding: 'clamp(30px,5vw,60px) clamp(16px,5vw,40px)',
          overflow: 'hidden',
          fontFamily: "'DM Mono', monospace",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ParticleCanvas />

        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }} />

        {/* Scan beam */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0,
          height: '1px',
          background: 'linear-gradient(90deg,transparent,rgba(41,123,201,0.3),transparent)',
          animation: 'scanmove 9s linear infinite',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Scanlines overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: 'repeating-linear-gradient(to bottom,transparent 0,transparent 3px,rgba(255,255,255,0.009) 3px,rgba(255,255,255,0.009) 4px)',
        }} />

        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '35vw', height: '35vw', maxWidth: 420, maxHeight: 420, background: 'radial-gradient(circle, rgba(41,123,201,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '28vw', height: '28vw', maxWidth: 340, maxHeight: 340, background: 'radial-gradient(circle, rgba(199,6,28,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* ── MAIN LAYOUT ── */}
        <div style={{
          position: 'relative', zIndex: 10,
          maxWidth: '1100px', width: '100%', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(32px, 6vw, 80px)',
          alignItems: 'center',
        }}>

          {/* ── LEFT ── */}
          <motion.div style={{ y: titleY }}>
            <h2 style={{ margin: '0 0 1.5rem 0', lineHeight: 0.9, letterSpacing: '-0.03em' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(46px, 8vw, 80px)', color: '#fff' }}>
                LET'S
              </div>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: 'clamp(46px, 8vw, 80px)',
                WebkitTextStroke: '2px var(--c-blue)', color: 'transparent',
                filter: 'drop-shadow(0 0 30px rgba(41,123,201,0.35))',
              }}>
                <GlitchText text="TALK" triggered={glitchTriggered} />
              </div>
            </h2>

            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, marginBottom: '2.5rem', fontFamily: "'DM Mono', monospace" }}>
              <span style={{ color: 'var(--c-blue)' }}>// </span>
              Open to collaborations, freelance,<br />and full-time opportunities.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SOCIALS.map((s, i) => (
                <motion.a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(255,255,255,0.02)',
                    textDecoration: 'none', color: 'rgba(255,255,255,0.6)',
                    transition: 'all 0.22s ease', backdropFilter: 'blur(4px)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = s.hovcol;
                    e.currentTarget.style.background = `${s.hovcol}15`;
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.boxShadow = `0 0 25px ${s.hovcol}22`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)';
                    e.currentTarget.style.background = 'rgba(255,255,255,.02)';
                    e.currentTarget.style.color = 'rgba(255,255,255,.6)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ color: 'var(--c-blue)', flexShrink: 0 }}>{s.icon}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: 'block', fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>
                      {s.name.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '12px', fontFamily: "'DM Mono', monospace" }}>/{s.handle}</span>
                  </span>
                  <span className="social-arrow" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>→</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: FORM ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: 0.3 }}
          >
            <div
              className="lg:min-w-[500px] md:min-w-[400px]"
              style={{
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.09)', borderRadius: '12px',
                background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(12px)',
                padding: 'clamp(20px,4vw,32px)', overflow: 'hidden',
              }}
            >
              {/* Inner scanline */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'repeating-linear-gradient(to bottom,transparent 0,transparent 3px,rgba(255,255,255,0.007) 3px,rgba(255,255,255,0.007) 4px)',
                borderRadius: '12px',
              }} />

              {/* Corner accents */}
              {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
                <span key={pos} style={{
                  position: 'absolute',
                  ...(pos.includes('top') ? { top: -1 } : { bottom: -1 }),
                  ...(pos.includes('left') ? { left: -1 } : { right: -1 }),
                  width: 14, height: 14,
                  borderTop: pos.includes('top') ? '2px solid rgba(41,123,201,0.4)' : 'none',
                  borderBottom: pos.includes('bottom') ? '2px solid rgba(41,123,201,0.4)' : 'none',
                  borderLeft: pos.includes('left') ? '2px solid rgba(41,123,201,0.4)' : 'none',
                  borderRight: pos.includes('right') ? '2px solid rgba(41,123,201,0.4)' : 'none',
                }} />
              ))}

              {/* Progress bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>Form.completion</span>
                  <span style={{ fontSize: '9px', fontFamily: "'DM Mono', monospace", color: 'var(--c-blue)' }}>{Math.round(progress * 100)}%</span>
                </div>
                <div style={{ height: '2px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, var(--c-blue), #5b9bd5)', borderRadius: '2px' }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    style={{ textAlign: 'center', padding: '2.5rem 1rem' }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                      style={{
                        width: 56, height: 56, borderRadius: '50%',
                        border: '1px solid rgba(34,197,94,0.4)',
                        background: 'rgba(34,197,94,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.25rem', fontSize: 22, color: 'var(--c-green)',
                      }}
                    >✓</motion.div>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: '#fff', margin: '0 0 8px' }}>
                      Transmission complete.
                    </p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                      I'll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    ref={formRef}
                    onSubmit={sendEmail}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ position: 'relative', zIndex: 2 }}
                  >
                    <TerminalField
                      label="Your Name"
                      id="from_name"
                      value={fields.from_name}
                      onChange={e => setField('from_name', e.target.value)}
                      onBlur={() => handleBlur('from_name')}
                      placeholder="John Doe"
                      error={fieldErrors.from_name}
                    />
                    <TerminalField
                      label="Email Address"
                      id="from_email"
                      type="email"
                      value={fields.from_email}
                      onChange={e => setField('from_email', e.target.value)}
                      onBlur={() => handleBlur('from_email')}
                      placeholder="example@gmail.com"
                      error={fieldErrors.from_email}
                    />
                    <TerminalField
                      label="Message"
                      id="message"
                      value={fields.message}
                      onChange={e => setField('message', e.target.value)}
                      onBlur={() => handleBlur('message')}
                      placeholder="Hey, I'd love to collaborate on..."
                      rows={4}
                      maxLength={500}
                      error={fieldErrors.message}
                    />

                    {/* Submit button */}
                    <motion.button
                      type="submit"
                      disabled={status === 'sending'}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%', marginTop: '4px',
                        padding: '13px 20px',
                        border: `1px solid ${btnColor}55`,
                        borderRadius: '8px',
                        background: `${btnColor}12`,
                        color: btnColor,
                        fontSize: '12px', letterSpacing: '0.1em',
                        fontFamily: "'DM Mono', monospace",
                        cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                        transition: 'all 0.22s ease',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        position: 'relative', overflow: 'hidden',
                      }}
                      onMouseEnter={e => {
                        if (status !== 'sending') {
                          e.currentTarget.style.background = `${btnColor}22`;
                          e.currentTarget.style.boxShadow = `0 0 20px ${btnColor}22`;
                        }
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = `${btnColor}12`;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {status === 'sending' && (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          style={{ display: 'inline-block', width: 12, height: 12, border: `1.5px solid ${btnColor}44`, borderTop: `1.5px solid ${btnColor}`, borderRadius: '50%' }}
                        />
                      )}
                      {STATUS_MAP[btnStatus].label}
                    </motion.button>

                    {/* Network error toast — only shown for real send failures */}
                    <NetworkErrorToast
                      visible={status === 'network_err'}
                      onRetry={handleRetry}
                    />
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to bottom, transparent, #000)',
          pointerEvents: 'none', zIndex: 2,
        }} />
      </section>
    </>
  );
};

export default Contact;