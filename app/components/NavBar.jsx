'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { CommandPalette } from './CommandPalette';

// ─── NAVIGATION CONFIG ────────────────────────────────────────────────────────

const navLinks = [
  { name: 'Skills', section: 'skills', num: '01' },
  { name: 'Courses', section: 'courses', num: '02' },
  { name: 'Projects', section: 'projects', num: '03' },
  { name: 'Artworks', href: '/artworks', num: '04' },
  { name: 'Contact', section: 'contact', num: '05' },
];

const socials = [
  {
    name: 'GitHub',
    url: 'https://github.com/Gagan-poojari',
    icon: FaGithub,
    accent: '#ffffff',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/gaganpoojari/',
    icon: FaLinkedin,
    accent: '#38bdf8',
  },
];

// Helper to smoothly scroll to in-page section with navbar offset
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const navH = 80;
  const targetY = el.getBoundingClientRect().top + window.pageYOffset - navH;
  window.scrollTo({ top: targetY, behavior: 'smooth' });
}


// ─── HOOKS ────────────────────────────────────────────────────────────────────

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}

function useBodyLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [locked]);
}


// Renders overlays on document.body so no parent stacking context can ever cover them
function Portal({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}

const dockIcons = {
  skills: <path d="m13 2-9 12h7l-1 8 9-12h-7z" />,
  courses: (<><path d="M2 9 12 4l10 5-10 5z" /><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></>),
  projects: (<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>),
  artworks: (<><path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-2 0-1.5-1-1.5-1-3s1-2 2.5-2H18a3 3 0 0 0 3-3c0-4.4-4-8-9-8z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10" cy="7" r="1" /><circle cx="15" cy="7" r="1" /></>),
  contact: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>),
};

function NavIcon({ id, className = 'w-[18px] h-[18px]' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {dockIcons[id]}
    </svg>
  );
}

function SearchIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

// ─── MOBILE SEARCH SHEET (replaces CommandPalette below lg — never overflows) ─

function MobileSearchSheet({ open, onClose, items }) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);

  useBodyLock(open);

  useEffect(() => {
    if (open) {
      setQuery('');
      setCursor(0);
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open]);

  const q = query.trim().toLowerCase();
  const results = q
    ? items.filter((i) => `${i.label} ${i.kind}`.toLowerCase().includes(q))
    : items;

  const pick = (item) => {
    if (!item) return;
    onClose();
    setTimeout(() => item.run(), 60);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    if (e.key === 'Enter') pick(results[cursor]);
    if (e.key === 'Escape') onClose();
  };

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[9999] lg:hidden flex flex-col"
            style={{ height: '100dvh', background: '#030406', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            {/* Input row */}
            <div className="flex items-center gap-2 px-3 pt-3 pb-2">
              <div className="flex-1 flex items-center gap-2.5 h-12 px-3.5 rounded-2xl border border-white/15 bg-white/[0.05] focus-within:border-sky-400/60 focus-within:shadow-[0_0_20px_rgba(56,189,248,0.18)] transition-all">
                <SearchIcon className="w-4 h-4 text-zinc-400 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
                  onKeyDown={onKeyDown}
                  placeholder="Search sections, links…"
                  className="flex-1 min-w-0 bg-transparent outline-none text-[16px] text-white placeholder:text-zinc-500 font-mono"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="go"
                />
                {query && (
                  <button onClick={() => { setQuery(''); inputRef.current?.focus(); }} className="text-zinc-500 text-xs px-1" aria-label="Clear">✕</button>
                )}
              </div>
              <button onClick={onClose} className="h-12 px-3 text-xs font-mono uppercase tracking-widest text-zinc-300 active:text-white">
                Close
              </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-3 pb-6">
              {results.length === 0 ? (
                <p className="text-center text-zinc-500 font-mono text-xs pt-12">No match for “{query}”</p>
              ) : (
                <ul className="space-y-1.5 pt-1">
                  {results.map((item, i) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.2), duration: 0.2 }}
                    >
                      <button
                        onClick={() => pick(item)}
                        onMouseEnter={() => setCursor(i)}
                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left transition-colors ${i === cursor ? 'border-white/25 bg-white/[0.08]' : 'border-white/[0.06] bg-white/[0.02]'
                          }`}
                      >
                        <span className="w-9 h-9 shrink-0 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-zinc-300 text-xs font-mono">
                          {item.icon ? <item.icon className="text-sm" /> : item.num}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm text-white font-mono truncate">{item.label}</span>
                          <span className="block text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-mono">{item.kind}</span>
                        </span>
                        <span className="text-zinc-500 text-xs">↵</span>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}

// ─── MAIN NAVBAR ─────────────────────────────────────────────────────────────

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('skills');
  const [isMac, setIsMac] = useState(false);

  const [hideHeader, setHideHeader] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.2 });
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHideHeader(y > 140 && y > prev + 2 && !isDesktop);
    if (y < prev - 2) setHideHeader(false);
  });

  const isManualNavRef = useRef(false);
  const manualTimeoutRef = useRef(null);

  // Platform detect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform));
    }
  }, []);

  // Handle section click: immediately animates active pill & locks manual transition
  const handleNavClick = (section, href, e) => {
    if (href) return;
    if (isHome && section) {
      if (e) e.preventDefault();
      setActiveSection(section);
      isManualNavRef.current = true;
      if (manualTimeoutRef.current) clearTimeout(manualTimeoutRef.current);
      manualTimeoutRef.current = setTimeout(() => {
        isManualNavRef.current = false;
      }, 950);
      scrollToSection(section);
    }
  };

  // Robust scroll spy: tracks active section accurately even for huge/variable height sections
  useEffect(() => {
    if (!isHome) return;

    let ticking = false;
    const checkScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);

          if (!isManualNavRef.current) {
            // If near bottom of the page, activate contact
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 90) {
              setActiveSection('contact');
              ticking = false;
              return;
            }

            const sectionIds = ['skills', 'courses', 'projects', 'contact'];
            const triggerPoint = 180; // 180px from top of viewport

            for (const id of sectionIds) {
              const el = document.getElementById(id);
              if (!el) continue;
              const rect = el.getBoundingClientRect();
              if (rect.top <= triggerPoint && rect.bottom > triggerPoint) {
                setActiveSection(id);
                break;
              }
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    checkScroll(); // initial check
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', checkScroll);
      if (manualTimeoutRef.current) clearTimeout(manualTimeoutRef.current);
    };
  }, [isHome]);

  // Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isDesktop) setCmdOpen(prev => !prev);
        else setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') { setCmdOpen(false); setSearchOpen(false); setMobileOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isDesktop]);

  // Lock page scroll while the drawer is open; auto-close drawer on desktop resize
  useBodyLock(mobileOpen);
  useEffect(() => { if (isDesktop) { setMobileOpen(false); setSearchOpen(false); } else { setCmdOpen(false); } }, [isDesktop]);

  const goSection = (section) => {
    if (isHome) scrollToSection(section);
    else router.push(`/#${section}`);
  };

  const searchItems = [
    ...navLinks.map((l) => ({
      id: l.name,
      label: l.name,
      kind: 'Navigate',
      num: l.num,
      run: () => (l.href ? router.push(l.href) : goSection(l.section)),
    })),
    { id: 'resume', label: 'Resume', kind: 'Open PDF', num: '↗', run: () => window.open('/resume.pdf', '_blank', 'noopener') },
    ...socials.map((s) => ({
      id: s.name, label: s.name, kind: 'External link', icon: s.icon,
      run: () => window.open(s.url, '_blank', 'noopener'),
    })),
  ];

  return (
    <>
      {isDesktop && <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />}
      <MobileSearchSheet open={searchOpen && !isDesktop} onClose={() => setSearchOpen(false)} items={searchItems} />

      {/* Main Header Container - fixed height with smooth glass transition */}
      <header
        className={`fixed top-0 left-0 right-0 z-[100] h-16 md:h-20 flex items-center transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out ${hideHeader && !mobileOpen ? '-translate-y-full' : 'translate-y-0'
          } ${scrolled || mobileOpen
            ? 'bg-[#050609]/80 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            : 'bg-transparent border-b border-transparent'
          }`}
      >
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* ── LEFT: PROMINENT SIGNATURE ── */}
          <div className="flex items-center z-10">
            <Link
              href="/"
              className="group flex items-center cursor-pointer select-none py-1"
              title="Gagan Poojari - Home"
            >
              <img
                src="/signature.svg"
                alt="Gagan Poojari Signature"
                className="h-7 sm:h-8 md:h-10 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.45)] group-hover:scale-[1.03]"
              />
            </Link>
          </div>

          {/* ── CENTER: MATHEMATICALLY CENTERED FLOATING NAV CAPSULE (DESKTOP lg: ONLY) ── */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto">
            <nav className="flex items-center gap-1 p-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              {navLinks.map((l) => {
                const isLinkActive = isHome
                  ? (activeSection === l.section)
                  : (pathname === l.href);
                const targetHref = l.href ? l.href : `/#${l.section}`;

                return (
                  <Link
                    key={l.name}
                    href={targetHref}
                    onClick={(e) => handleNavClick(l.section, l.href, e)}
                    className="relative flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono uppercase tracking-[0.16em] transition-colors duration-200 cursor-pointer select-none rounded-full"
                  >
                    {/* Active Pill Spring Transition */}
                    {isLinkActive && (
                      <motion.div
                        layoutId="active-nav-pill"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-white/10 border border-white/20 shadow-[0_0_14px_rgba(255,255,255,0.12)]"
                      />
                    )}

                    <span
                      className={`relative z-10 transition-colors duration-200 ${isLinkActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                      {l.name}
                    </span>

                    {/* Active Dot */}
                    {isLinkActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="relative z-10 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ── RIGHT: DESKTOP ACTIONS (lg: ONLY) ── */}
          <div className="hidden lg:flex items-center gap-3 z-10">
            {/* Social Icons */}
            <div className="flex items-center gap-1.5">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white hover:border-white/25 hover:bg-white/[0.08] transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                    title={s.name}
                  >
                    <Icon className="text-sm" />
                  </a>
                );
              })}
            </div>

            <div className="w-[1px] h-4 bg-white/15 mx-1" />

            {/* Command Palette Trigger */}
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 text-zinc-400 hover:text-white text-xs font-mono transition-all duration-200 cursor-pointer hover:scale-102 active:scale-98"
              title="Open Command Palette"
            >
              <span className="text-[11px] uppercase tracking-wider text-zinc-400">Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-zinc-300 font-sans border border-white/10">
                {isMac ? '⌘K' : 'Ctrl+K'}
              </kbd>
            </button>

            {/* Resume Button */}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/20 bg-white/[0.08] hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-widest transition-all duration-200 cursor-pointer group shadow-sm hover:scale-102 active:scale-98"
            >
              <span>Resume</span>
              <span className="text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
                ↗
              </span>
            </a>
          </div>

          {/* ── TABLET & MOBILE CONTROLS (< lg:) ── */}
          <div className="lg:hidden flex items-center gap-2 sm:gap-3 z-10">
            {/* Tablet-only Resume Pill */}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/20 bg-white/[0.08] hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-widest transition-all duration-200 cursor-pointer"
            >
              <span>Resume</span>
              <span className="text-[11px]">↗</span>
            </a>

            {/* Search Trigger */}
            <button
              onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
              className="h-9 w-9 sm:w-auto sm:px-3 rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 font-mono text-xs cursor-pointer active:scale-95 transition-all"
              aria-label="Search"
            >
              <SearchIcon className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px] text-zinc-400">Search</span>
            </button>

            {/* Mobile Hamburger Toggle Button (Touch Friendly 36px) */}
            <button
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label="Toggle Navigation Menu"
              className="w-9 h-9 rounded-lg border border-white/15 bg-white/[0.06] hover:bg-white/10 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-white transition-colors"
            >
              <span
                className={`w-4 h-[1.5px] bg-white block transition-transform duration-200 origin-center ${mobileOpen ? 'rotate-45 translate-y-[4.5px]' : ''
                  }`}
              />
              <span
                className={`w-4 h-[1.5px] bg-white block transition-opacity duration-150 ${mobileOpen ? 'opacity-0' : 'opacity-100'
                  }`}
              />
              <span
                className={`w-4 h-[1.5px] bg-white block transition-transform duration-200 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[4.5px]' : ''
                  }`}
              />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile & Tablet Drawer Menu */}
      <Portal>
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.button
                aria-label="Close menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-[98] lg:hidden bg-black/70 backdrop-blur-sm cursor-default"
              />

              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
                className="fixed inset-x-0 top-16 md:top-20 z-[99] lg:hidden border-b border-white/10 shadow-2xl px-5 pt-3 pb-5 font-mono overflow-y-auto overscroll-contain"
                style={{ maxHeight: 'calc(100dvh - 4rem)', background: '#050609' }}
              >
                <div className="flex flex-col">
                  {navLinks.map((l, i) => {
                    const isLinkActive = isHome ? activeSection === l.section : pathname === l.href;
                    const targetHref = l.href ? l.href : `/#${l.section}`;

                    return (
                      <motion.div
                        key={l.name}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 + i * 0.045, duration: 0.25 }}
                      >
                        <Link
                          href={targetHref}
                          onClick={(e) => {
                            setMobileOpen(false);
                            handleNavClick(l.section, l.href, e);
                          }}
                          className="group relative flex items-center gap-4 py-3.5 border-b border-white/[0.07] cursor-pointer"
                        >
                          <span className={`text-[10px] w-6 ${isLinkActive ? 'text-sky-400' : 'text-zinc-600'}`}>{l.num}</span>
                          <span
                            className={`flex-1 text-[22px] leading-none tracking-tight transition-colors ${isLinkActive ? 'text-white font-semibold' : 'text-zinc-400 group-active:text-white'
                              }`}
                          >
                            {l.name}
                          </span>
                          {isLinkActive ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8]" />
                          ) : (
                            <span className="text-zinc-600 text-sm group-active:translate-x-1 transition-transform">&rarr;</span>
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mobile Actions Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.25 }}
                  className="pt-5 flex items-center gap-2.5"
                >
                  {socials.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-zinc-300 active:scale-95 transition-all cursor-pointer"
                        title={s.name}
                      >
                        <Icon className="text-base" />
                      </a>
                    );
                  })}

                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 h-11 flex items-center justify-center rounded-xl border border-white/20 bg-white text-black text-xs font-mono font-semibold uppercase tracking-widest active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    Resume ↗
                  </a>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── MOBILE FLOATING DOCK ── */}
        <div
          className="fixed inset-x-0 z-[90] lg:hidden flex justify-center px-2 pointer-events-none"
          style={{ bottom: 'calc(env(safe-area-inset-bottom) + 14px)' }}
        >
          <AnimatePresence>
            {!isDesktop && isHome && scrolled && !mobileOpen && !searchOpen && (
              <motion.nav
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className="pointer-events-auto max-w-full flex items-center gap-0.5 p-1.5 rounded-full border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.7)]"
                style={{ background: 'rgba(8,9,12,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                aria-label="Section navigation"
              >
                {navLinks.map((l) => {
                  const id = l.name.toLowerCase();
                  const active = activeSection === l.section;
                  return (
                    <Link
                      key={l.name}
                      href={l.href ? l.href : `/#${l.section}`}
                      onClick={(e) => handleNavClick(l.section, l.href, e)}
                      aria-label={l.name}
                      className="relative flex items-center gap-1.5 h-10 px-3 rounded-full select-none"
                    >
                      {active && (
                        <motion.span
                          layoutId="dock-pill"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                          className="absolute inset-0 rounded-full bg-white/12 border border-white/25 shadow-[0_0_16px_rgba(255,255,255,0.15)]"
                        />
                      )}
                      <span className={`relative z-10 ${active ? 'text-white' : 'text-zinc-500'}`}><NavIcon id={id} /></span>
                      {active && (
                        <motion.span
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 'auto', opacity: 1 }}
                          className="relative z-10 overflow-hidden whitespace-nowrap text-[10px] font-mono uppercase tracking-[0.14em] text-white"
                        >
                          {l.name}
                        </motion.span>
                      )}
                    </Link>
                  );
                })}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </Portal>
    </>
  );
}