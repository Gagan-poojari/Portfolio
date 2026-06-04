'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const navLinks = [
  { name: 'Skills',    href: '#skills'   },
  { name: 'Courses',   href: '#courses'  },
  { name: 'Projects',  href: '#projects' },
  { name: 'Contact',   href: '#contact'  },
];

const socials = [
  { name: 'GitHub',   url: 'https://github.com/Gagan-poojari',                      icon: FaGithub,   accent: '#ffffff' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/gagan-poojari-840744319/',   icon: FaLinkedin, accent: '#297bc9' },
];

const NavLink = ({ href, name }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    y.set(((e.clientY - r.top)  / r.height - 0.5) * 4);
  }, [x, y]);

  const onLeave = useCallback(() => { x.set(0); y.set(0); setHovered(false); }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      className="relative"
    >
      <Link
        href={href}
        className="relative text-sm font-medium tracking-wide transition-colors duration-200"
        style={{ color: hovered ? '#fff' : 'rgba(255,255,255,0.55)' }}
      >
        {name}
        <span
          className="absolute -bottom-[2px] left-0 h-[1.5px] transition-all duration-300"
          style={{
            width: hovered ? '100%' : '0%',
            background: 'linear-gradient(90deg,#297bc9,#c7061c)',
          }}
        />
      </Link>
    </motion.div>
  );
};

const NavBar = () => {
  const [scrolled, setScrolled]     = useState(false);
  const [progress, setProgress]     = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ticking = useRef(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const sy  = window.scrollY;
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

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 z-[200] h-[2px] pointer-events-none transition-opacity duration-500"
        style={{
          width: `${progress}%`,
          // background: 'linear-gradient(90deg,#297bc9,#fff 50%,#c7061c)',
          background: 'linear-gradient(90deg,#000000,#fff)',
          // background: '#ffffff90',
          opacity: scrolled ? 1 : 0,
          transition: 'width 0.08s linear, opacity 0.5s ease',
        }}
      />

      {/* Navbar */}
      <motion.header
        initial={false}
        animate={scrolled ? 'scrolled' : 'top'}
        variants={{
          top:      { height: 70, backgroundColor: 'rgba(0,0,0,0)' },
          scrolled: { height: 56, backgroundColor: 'rgba(4,4,8,0.9)' },
        }}
        transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center px-6 lg:px-10"
        style={{
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 mr-auto">
          {/* <motion.img
            src="/sign.svg"
            alt="Gagan Poojari"
            animate={{ width: scrolled ? 88 : 100, opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="h-15 object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          /> */}
          <img
            src="/sign.svg"
            alt="Gagan Poojari"
            className="h-15 object-contain w-auto max-w-[90px] "
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => <NavLink key={l.name} {...l} />)}

          {/* Resume */}
          <motion.a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            whileHover="hover"
            whileTap={{ scale: 0.96 }}
            className="relative overflow-hidden text-sm font-medium tracking-wide text-white/55 border border-white/15 px-4 py-[6px] rounded-sm transition-colors duration-200 hover:text-white hover:border-white/35"
          >
            {/* fill sweep */}
            <motion.span
              variants={{ hover: { scaleX: 1 } }}
              initial={{ scaleX: 0 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0 origin-left pointer-events-none"
              style={{ background: 'linear-gradient(90deg,rgba(41,123,201,0.12),rgba(199,6,28,0.08))' }}
            />
            <span className="relative">Resume ↗</span>
          </motion.a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
          className="md:hidden ml-4 flex flex-col gap-[5px] p-1"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
            className="block w-5 h-[1.5px] bg-white/70 origin-center"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
            className="block w-5 h-[1.5px] bg-white/70"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
            className="block w-5 h-[1.5px] bg-white/70 origin-center"
          />
        </button>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="fixed left-0 right-0 z-[99] md:hidden bg-[rgba(4,4,8,0.97)] border-b border-white/[0.07]"
            style={{
              top: scrolled ? 56 : 70,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Accent line */}
            <div className="h-[1px]" style={{ background: 'linear-gradient(90deg,#297bc9,transparent 40%,transparent 60%,#c7061c)' }} />

            <div className="flex flex-col px-8 py-6 gap-1">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-3 border-b border-white/[0.05] text-sm tracking-wide text-white/45 hover:text-white transition-colors duration-200 group"
                  >
                    {l.name}
                    <span className="text-white/20 group-hover:text-white/60 transition-colors duration-200 text-xs">→</span>
                  </Link>
                </motion.div>
              ))}

              <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-4 text-sm tracking-wide text-white/55 border border-white/12 px-5 py-3 text-center hover:text-white hover:border-white/30 transition-all duration-200 rounded-sm"
              >
                Resume ↗
              </motion.a>
            </div>
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="flex items-center justify-center gap-0"
    >
      {/* Icons */}
      <div className="flex items-center gap-4 mb-4">
        {socials.map(({ name, url, icon: Icon, accent }, i) => (
          <motion.a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 + i * 0.1, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            onMouseEnter={() => setHovered(name)}
            onMouseLeave={() => setHovered(null)}
            className="relative flex items-center justify-center w-11 h-11 rounded-sm border transition-all duration-300"
            style={{
              background: hovered === name ? `${accent}12` : 'transparent',
              borderColor: hovered === name ? `${accent}60` : 'rgba(255,255,255,0.1)',
              color: hovered === name ? accent : 'rgba(255,255,255,0.35)',
              fontSize: 18,
            }}
          >
            <Icon />

            {/* Label tooltip */}
            <AnimatePresence>
              {hovered === name && (
                <motion.span
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-[calc(100%+10px)] top-1/2 -translate-y-1/2 text-[11px] font-mono tracking-[0.18em] uppercase whitespace-nowrap pointer-events-none"
                  style={{ color: accent }}
                >
                  {name}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.a>
        ))}
      </div>

      
    </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;