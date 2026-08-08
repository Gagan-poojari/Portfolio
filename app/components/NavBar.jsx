'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { CommandPalette } from './CommandPalette';

// ─── DATA ────────────────────────────────────────────────────────────────────

const navLinks = [
  { name: 'Skills', section: 'skills', glyph: '⬡', num: '01' },
  { name: 'Courses', section: 'courses', glyph: '◎', num: '02' },
  { name: 'Projects', section: 'projects', glyph: '◈', num: '03' },
  { name: 'Artworks', href: '/artworks', glyph: '✎', num: '04' },
  { name: 'Contact', section: 'contact', glyph: '◇', num: '05' },
];

const socials = [
  { name: 'GitHub', url: 'https://github.com/Gagan-poojari', icon: FaGithub, accent: '#ffffff', hoverBg: 'rgba(255,255,255,0.08)' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/gagan-poojari-840744319/', icon: FaLinkedin, accent: '#297bc9', hoverBg: 'rgba(41,123,201,0.12)' },
];

const cmdItems = [
  ...navLinks.map(l => ({ label: l.name, desc: `Jump to ${l.name}`, section: l.section, type: 'nav', glyph: l.glyph, color: '#a3a3a3' })),
  { label: 'Resume', desc: 'Open PDF in new tab', href: '/resume.pdf', type: 'action', glyph: '↗', color: '#F97316' },
  { label: 'GitHub', desc: 'github.com/Gagan-poojari', href: socials[0].url, type: 'social', glyph: '⌥', color: '#ffffff' },
  { label: 'LinkedIn', desc: 'Connect on LinkedIn', href: socials[1].url, type: 'social', glyph: '⌘', color: '#297bc9' },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// smooth scroll without touching the URL
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── COMMAND PALETTE ─────────────────────────────────────────────────────────

// function CommandPalette({ open, onClose }) {
//   const [query, setQuery] = useState('');
//   const [cursor, setCursor] = useState(0);
//   const inputRef = useRef(null);

//   const results = query.trim()
//     ? cmdItems.filter(i =>
//       i.label.toLowerCase().includes(query.toLowerCase()) ||
//       i.desc.toLowerCase().includes(query.toLowerCase())
//     )
//     : cmdItems;

//   useEffect(() => {
//     if (open) { setQuery(''); setCursor(0); setTimeout(() => inputRef.current?.focus(), 60); }
//   }, [open]);

//   useEffect(() => { setCursor(0); }, [query]);

//   const navigate = useCallback((item) => {
//     onClose();
//     if (item.section) {
//       setTimeout(() => scrollToSection(item.section), 150);
//     } else if (item.href) {
//       window.open(item.href, '_blank');
//     }
//   }, [onClose]);

//   const handleKey = (e) => {
//     if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)); }
//     if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
//     if (e.key === 'Escape') onClose();
//     if (e.key === 'Enter' && results[cursor]) navigate(results[cursor]);
//   };

//   return (
//     <AnimatePresence>
//       {open && (
//         <>
//           <motion.div
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             transition={{ duration: 0.15 }}
//             onClick={onClose}
//             className="fixed inset-0 z-[998]"
//             style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
//           />
//           <motion.div
//             initial={{ opacity: 0, scale: 0.96, y: -12 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.96, y: -12 }}
//             transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
//             className="fixed z-[999] top-[16%] w-[92vw] max-w-[520px]"
//             style={{
//               left: '50%',
//               transform: 'translateX(-50%)',
//               maxWidth: 'min(520px, calc(100vw - 24px))',
//               borderRadius: 14, overflow: 'hidden',
//               border: '1px solid rgba(255,255,255,0.1)',
//               background: 'rgba(5,5,9,0.99)',
//               boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
//             }}
//           >
//             <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)' }} />

//             <div style={{ padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
//               <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontFamily: "'Share Tech Mono',monospace" }}>⌘</span>
//               <input
//                 ref={inputRef}
//                 value={query}
//                 onChange={e => setQuery(e.target.value)}
//                 onKeyDown={handleKey}
//                 placeholder="Search commands…"
//                 style={{
//                   flex: 1, background: 'none', border: 'none', outline: 'none',
//                   color: '#fff', fontSize: 14, fontFamily: "'Share Tech Mono',monospace",
//                   caretColor: '#fff',
//                 }}
//               />
//               <kbd
//                 onClick={onClose}
//                 style={{
//                   fontSize: 9, padding: '2px 7px', borderRadius: 5,
//                   border: '1px solid rgba(255,255,255,0.12)',
//                   color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)',
//                   cursor: 'pointer', fontFamily: "'Share Tech Mono',monospace",
//                 }}
//               >ESC</kbd>
//             </div>

//             <div style={{ maxHeight: 320, overflowY: 'auto', padding: '6px 0 8px' }}>
//               {results.length === 0 && (
//                 <p style={{ textAlign: 'center', padding: 24, color: 'rgba(255,255,255,0.2)', fontSize: 12, fontFamily: "'Share Tech Mono',monospace" }}>
//                   No results
//                 </p>
//               )}
//               {results.map((item, i) => (
//                 <div
//                   key={item.label}
//                   onClick={() => navigate(item)}
//                   onMouseEnter={() => setCursor(i)}
//                   style={{
//                     display: 'flex', alignItems: 'center', gap: 12,
//                     padding: '10px 16px', cursor: 'pointer',
//                     background: cursor === i ? 'rgba(255,255,255,0.05)' : 'transparent',
//                     transition: 'background 0.1s',
//                     borderLeft: cursor === i ? `2px solid ${item.color}` : '2px solid transparent',
//                   }}
//                 >
//                   {/* <span style={{
//                     width: 26, height: 26, borderRadius: 7,
//                     border: `1px solid ${hexToRgba(item.color, 0.2)}`,
//                     background: hexToRgba(item.color, 0.1),
//                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     fontSize: 12, color: item.color, flexShrink: 0,
//                   }}>
//                     {item.glyph}
//                   </span> */}
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <p style={{ margin: 0, fontSize: 13, color: '#fff', fontFamily: "'Share Tech Mono',monospace", fontWeight: 700 }}>{item.label}</p>
//                     <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: "'Share Tech Mono',monospace", marginTop: 1 }}>{item.desc}</p>
//                   </div>
//                   <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', fontFamily: "'Share Tech Mono',monospace", flexShrink: 0 }}>{item.type}</span>
//                 </div>
//               ))}
//             </div>

//             <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 14 }}>
//               {[['↑↓', 'navigate'], ['↵', 'select'], ['esc', 'close']].map(([key, label]) => (
//                 <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
//                   <kbd style={{ fontSize: 9, padding: '2px 5px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.03)', fontFamily: "'Share Tech Mono',monospace" }}>{key}</kbd>
//                   <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', fontFamily: "'Share Tech Mono',monospace" }}>{label}</span>
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }

// ─── MAGNETIC NAV LINK ────────────────────────────────────────────────────────

function NavLink({ section, href, name, glyph, isActive }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 400, damping: 25 });
  const sy = useSpring(y, { stiffness: 400, damping: 25 });
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 5);
  }, [x, y]);

  const onLeave = useCallback(() => { x.set(0); y.set(0); setHovered(false); }, [x, y]);

  const handleClick = useCallback((e) => {
    if (href) return;
    e.preventDefault();
    scrollToSection(section);
  }, [section, href]);

  const LinkOrBtn = href ? Link : 'button';
  const extraProps = href ? { href } : { onClick: handleClick };

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseEnter={() => setHovered(true)} onMouseLeave={onLeave}>
      <LinkOrBtn
        {...extraProps}
        className="relative flex items-center gap-1.5 text-xs tracking-widest uppercase transition-colors duration-200 bg-transparent border-none outline-none cursor-none"
        style={{
          fontFamily: "'Share Tech Mono',monospace",
          color: isActive ? '#fff' : hovered ? '#fff' : 'rgba(255,255,255,0.4)',
        }}
      >
        <span className="relative">
          {name}
          <motion.span
            className="absolute -bottom-[2px] left-0 h-[1.5px]"
            animate={{ width: isActive || hovered ? '100%' : '0%' }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            style={{
              background: isActive
                ? 'rgba(255,255,255,0.7)'
                : 'linear-gradient(90deg,rgba(255,255,255,0.8),rgba(255,255,255,0.2))',
            }}
          />
        </span>

        {isActive && (
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff', opacity: 0.7, flexShrink: 0 }} />
        )}
      </LinkOrBtn>
    </motion.div>
  );
}

// ─── SOCIAL ICON BUTTON ───────────────────────────────────────────────────────

function SocialBtn({ name, url, icon: Icon, accent, hoverBg }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-200 overflow-visible cursor-none"
      style={{
        borderColor: hovered ? hexToRgba(accent, 0.5) : 'rgba(255,255,255,0.1)',
        background: hovered ? hoverBg : 'rgba(255,255,255,0.04)',
        color: hovered ? accent : 'rgba(255,255,255,0.35)',
        fontSize: 15,
      }}
    >
      <Icon />
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 text-[9px] tracking-widest uppercase whitespace-nowrap pointer-events-none px-2 py-1 rounded z-10"
            style={{
              fontFamily: "'Share Tech Mono',monospace",
              background: 'rgba(10,10,14,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: accent,
            }}
          >
            {name}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}

// ─── MAIN NAVBAR ─────────────────────────────────────────────────────────────

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showCmdHint, setShowCmdHint] = useState(false);
  const ticking = useRef(false);

  // Scroll progress + shrink
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        const max = document.body.scrollHeight - window.innerHeight;
        setScrolled(sy > 30);
        setProgress(max > 0 ? (sy / max) * 100 : 0);
        if (sy > 30 && mobileOpen) setMobileOpen(false);
        ticking.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileOpen]);

  // Active section via IntersectionObserver
  useEffect(() => {
    const ids = navLinks.map(l => l.section);
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.35 },
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  // Cmd+K global shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(v => !v); }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Show cmd hint after 3s
  useEffect(() => {
    const t = setTimeout(() => setShowCmdHint(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const headerH = scrolled ? 52 : 68;

  return (
    <>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

      {/* ── SCROLL PROGRESS BAR ── */}
      {/* <div
        className="fixed top-0 left-0 z-[200] h-[1.5px] pointer-events-none"
        style={{
          width: `${progress}%`,
          // background: 'linear-gradient(90deg,#E8341A,#fff,#1A7BE8)',
          background: 'linear-gradient(90deg,#000000,#fff)',
          opacity: scrolled ? 1 : 0,
          transition: 'width 0.06s linear, opacity 0.4s ease',
          boxShadow: '0 0 8px rgba(255,255,255,0.4)',
        }}
      /> */}

      {/* ── NAVBAR ── */}
      <motion.header
        initial={false}
        animate={{ height: headerH }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center px-5 lg:px-10"
        style={{
          background: scrolled ? 'rgba(4,5,8,0.92)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          transition: 'background 0.4s ease, border-color 0.4s ease',
        }}
      >
        {scrolled && (
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(255,255,255,0.008) 3px,rgba(255,255,255,0.008) 4px)',
          }} />
        )}

        {/* ── LOGO ── */}
        <Link href="/" className="flex-shrink-0 mr-auto group relative cursor-none">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="relative">
            <img
              src="/sign.svg"
              alt="Gagan Poojari"
              className="object-contain transition-all duration-300"
              style={{
                height: scrolled ? 70 : 80,
                width: 'auto', maxWidth: 96,
                filter: 'brightness(0) invert(1)',
                opacity: 0.88,
              }}
            />
            <motion.span
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="absolute -bottom-1 left-0 right-0 h-[1px] origin-left"
              style={{ background: 'rgba(255,255,255,0.25)' }}
            />
          </motion.div>
        </Link>

        {/* ── DESKTOP NAV LINKS ── */}
        <nav className="hidden md:flex items-center gap-7 mr-5">
          {navLinks.map((l, i) => (
            <motion.div
              key={l.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <NavLink {...l} isActive={activeSection === l.section} />
            </motion.div>
          ))}
        </nav>

        {/* ── RIGHT CLUSTER ── */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex items-center gap-3"
        >
          {/* Social icons */}
          {socials.map(s => <SocialBtn key={s.name} {...s} />)}

          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)' }} />

          {/* Cmd+K button */}
          <motion.button
            onClick={() => setCmdOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="relative flex items-center gap-2 rounded-lg border transition-all duration-200 overflow-hidden cursor-none"
            style={{
              padding: '6px 12px',
              fontFamily: "'Share Tech Mono',monospace",
              fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderColor: 'rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            <AnimatePresence>
              {showCmdHint && (
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-[3px] -right-[3px] w-2 h-2 rounded-full bg-white"
                  style={{ boxShadow: '0 0 6px rgba(255,255,255,0.8)' }}
                />
              )}
            </AnimatePresence>
            <span style={{ fontSize: 11 }}>⌘</span>
            <span>K</span>
          </motion.button>

          {/* Resume */}
          <motion.a
            href="/resume.pdf" target="_blank" rel="noopener noreferrer"
            whileHover="hov"
            whileTap={{ scale: 0.96 }}
            className="relative overflow-hidden flex items-center gap-1.5 rounded-lg border transition-colors duration-200 cursor-none"
            style={{
              padding: '6px 14px',
              fontFamily: "'Share Tech Mono',monospace",
              fontSize: 10, letterSpacing: '0.15em',
              textTransform: 'uppercase',
              borderColor: 'rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            <motion.span
              variants={{ hov: { scaleX: 1 } }}
              initial={{ scaleX: 0 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0 origin-left pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            />
            <span className="relative">Resume</span>
            <motion.span variants={{ hov: { x: 2, y: -2 } }} transition={{ duration: 0.2 }} className="relative">↗</motion.span>
          </motion.a>
        </motion.div>

        {/* ── MOBILE CONTROLS ── */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setCmdOpen(true)}
            className="cursor-none"
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 13, fontFamily: "'Share Tech Mono',monospace",
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >⌘</button>

          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
            className="flex flex-col gap-[5px] p-1 cursor-none"
          >
            <motion.span animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} className="block w-5 h-[1.5px] bg-white/60 origin-center" />
            <motion.span animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} transition={{ duration: 0.2 }} className="block w-5 h-[1.5px] bg-white/60" />
            <motion.span animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.25 }} className="block w-5 h-[1.5px] bg-white/60 origin-center" />
          </button>
        </div>
      </motion.header>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, y: -8, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="fixed left-0 right-0 z-[99] md:hidden"
            style={{
              top: scrolled ? 52 : 68,
              background: 'rgba(4,5,8,0.98)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(255,255,255,0.008) 3px,rgba(255,255,255,0.008) 4px)',
            }} />

            <div className="relative px-6 py-5">
              <div className="flex flex-col">
                {navLinks.map((l, i) => {
                  const isAct = activeSection === l.section;
                  const LinkOrBtn = l.href ? Link : 'button';
                  const extraProps = l.href 
                    ? { href: l.href, onClick: () => setMobileOpen(false) }
                    : { onClick: () => { setMobileOpen(false); setTimeout(() => scrollToSection(l.section), 150); } };

                  return (
                    <motion.div
                      key={l.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.28 }}
                    >
                      <LinkOrBtn
                        {...extraProps}
                        className="w-full flex items-center justify-between py-3.5 border-b group transition-all duration-200 cursor-pointer bg-transparent"
                        style={{ borderColor: 'rgba(255,255,255,0.06)', fontFamily: "'Share Tech Mono',monospace" }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm tracking-wide" style={{ color: isAct ? '#fff' : 'rgba(255,255,255,0.5)' }}>{l.name}</span>
                          {isAct && <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff', opacity: 0.6 }} />}
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)' }}>{l.num}</span>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }} className="group-hover:text-white/60 transition-colors">→</span>
                        </div>
                      </LinkOrBtn>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.22 }}
                className="flex items-center justify-between mt-5 gap-3"
              >
                <div className="flex gap-2.5">
                  {socials.map(({ name, url, icon: Icon }) => (
                    <a
                      key={name}
                      href={url} target="_blank" rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 cursor-none"
                      style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', fontSize: 15 }}
                    >
                      <Icon />
                    </a>
                  ))}
                </div>

                <a
                  href="/resume.pdf" target="_blank" rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center text-[10px] tracking-widest uppercase py-2.5 rounded-lg border transition-all duration-200 cursor-none"
                  style={{
                    fontFamily: "'Share Tech Mono',monospace",
                    borderColor: 'rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  Resume ↗
                </a>
              </motion.div>

              <p style={{ marginTop: 12, textAlign: 'center', fontSize: 9, fontFamily: "'Share Tech Mono',monospace", color: 'rgba(255,255,255,0.15)', letterSpacing: '0.15em' }}>
                ⌘K - command palette
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;