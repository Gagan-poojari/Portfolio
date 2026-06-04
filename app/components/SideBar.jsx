'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const socials = [
  { name: 'GitHub',   url: 'https://github.com/Gagan-poojari',                      icon: FaGithub,   accent: '#ffffff' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/gagan-poojari-840744319/',   icon: FaLinkedin, accent: '#297bc9' },
];

export default function SlideBar() {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="fixed bottom-0 right-6 z-50 hidden lg:flex flex-col items-center gap-0"
    >
      {/* Icons */}
      <div className="flex flex-col items-center gap-4 mb-4">
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

      {/* Vertical line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1.8, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="w-px h-16 origin-top"
        style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)' }}
      />
    </motion.div>
  );
}