'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    url: 'https://www.linkedin.com/in/gagan-poojari-840744319/', 
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

// ─── MAIN NAVBAR ─────────────────────────────────────────────────────────────

export default function NavBar() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('skills');
  const [isMac, setIsMac] = useState(false);

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
        setCmdOpen(prev => !prev);
      }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

      {/* Main Header Container - fixed height with smooth glass transition */}
      <header
        className={`fixed top-0 left-0 right-0 z-[100] h-18 md:h-20 flex items-center transition-colors duration-300 ease-out ${
          scrolled
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
                className="h-10 sm:h-11 md:h-12 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.45)] group-hover:scale-[1.03]"
              />
            </Link>
          </div>

          {/* ── CENTER: MATHEMATICALLY CENTERED FLOATING NAV CAPSULE ── */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto">
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
                      className={`relative z-10 transition-colors duration-200 ${
                        isLinkActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white'
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

          {/* ── RIGHT: BALANCED ACTION CLUSTER ── */}
          <div className="hidden md:flex items-center gap-3 z-10">
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

          {/* ── MOBILE CONTROLS ── */}
          <div className="md:hidden flex items-center gap-2 z-10">
            <button
              onClick={() => setCmdOpen(true)}
              className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white flex items-center justify-center font-mono text-xs cursor-pointer active:scale-95 transition-transform"
              aria-label="Search"
            >
              ⌘
            </button>

            <button
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label="Toggle Navigation Menu"
              className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] flex flex-col items-center justify-center gap-1.5 p-1.5 cursor-pointer text-white"
            >
              <span
                className={`w-4 h-[1.5px] bg-white block transition-transform duration-200 origin-center ${
                  mobileOpen ? 'rotate-45 translate-y-[4.5px]' : ''
                }`}
              />
              <span
                className={`w-4 h-[1.5px] bg-white block transition-opacity duration-150 ${
                  mobileOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-4 h-[1.5px] bg-white block transition-transform duration-200 origin-center ${
                  mobileOpen ? '-rotate-45 -translate-y-[4.5px]' : ''
                }`}
              />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-x-0 top-18 z-[99] md:hidden bg-[#050609]/95 border-b border-white/10 backdrop-blur-2xl shadow-2xl px-6 py-5 font-mono"
          >
            <div className="flex flex-col divide-y divide-white/10">
              {navLinks.map((l) => {
                const isLinkActive = isHome 
                  ? (activeSection === l.section)
                  : (pathname === l.href);
                const targetHref = l.href ? l.href : `/#${l.section}`;

                return (
                  <Link
                    key={l.name}
                    href={targetHref}
                    onClick={(e) => {
                      setMobileOpen(false);
                      handleNavClick(l.section, l.href, e);
                    }}
                    className="flex items-center justify-between py-3.5 text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className={isLinkActive ? 'text-white font-bold' : ''}>
                      {l.name}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-600 font-mono">{l.num}</span>
                      <span className="text-zinc-500 text-xs">&rarr;</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Actions Footer */}
            <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title={s.name}
                    >
                      <Icon className="text-xs" />
                    </a>
                  );
                })}
              </div>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex-1 py-2 px-3 rounded-lg border border-white/20 bg-white/10 text-white text-center text-xs font-mono uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                Resume ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
