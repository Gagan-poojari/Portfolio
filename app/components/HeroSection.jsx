'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'

const phrases = ['MERN Developer', 'ML Engineer', 'Open Source Contributor']

const icons = [
  { src: '/icons/mern-icons/reactjs-icon.png',      label: 'React'      },
  { src: '/icons/mern-icons/nextjs-icon.png',        label: 'Next.js'    },
  { src: '/icons/dsml-icons/docker-icon.webp',       label: 'Docker'     },
  { src: '/icons/mern-icons/mongodb-icon.webp',      label: 'MongoDB'    },
  { src: '/icons/dsml-icons/scikit-learn-icon.png',  label: 'Sklearn'    },
  { src: '/icons/dsml-icons/kubernetes-icon.png',    label: 'Kubernetes' },
]

export default function HeroSection() {
  // ── Typewriter ─────────────────────────────────────────────
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting]   = useState(false)
  const [paused, setPaused]       = useState(false)

  useEffect(() => {
    if (paused) return
    const phrase = phrases[phraseIdx % phrases.length]
    if (!deleting && displayed === phrase) {
      setPaused(true)
      setTimeout(() => { setDeleting(true); setPaused(false) }, 1400)
      return
    }
    if (deleting && displayed === '') {
      setDeleting(false)
      setPhraseIdx(i => i + 1)
      return
    }
    const t = setTimeout(() => {
      setDisplayed(prev =>
        deleting
          ? phrase.substring(0, prev.length - 1)
          : phrase.substring(0, prev.length + 1)
      )
    }, deleting ? 40 : 90)
    return () => clearTimeout(t)
  }, [displayed, deleting, phraseIdx, paused])

  // ── Mouse parallax on image ────────────────────────────────
  const imgRef = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springCfg = { stiffness: 120, damping: 22 }
  const smx = useSpring(mx, springCfg)
  const smy = useSpring(my, springCfg)
  const rotX = useTransform(smy, [-0.5, 0.5], [8, -8])
  const rotY = useTransform(smx, [-0.5, 0.5], [-8, 8])

  const onMouseMove = useCallback((e) => {
    const r = imgRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top)  / r.height - 0.5)
  }, [mx, my])
  const onMouseLeave = useCallback(() => { mx.set(0); my.set(0) }, [mx, my])

  // ── Cursor glow ────────────────────────────────────────────
  const glowX = useMotionValue(-200)
  const glowY = useMotionValue(-200)
  const sGlowX = useSpring(glowX, { stiffness: 80, damping: 20 })
  const sGlowY = useSpring(glowY, { stiffness: 80, damping: 20 })

  useEffect(() => {
    const move = (e) => { glowX.set(e.clientX); glowY.set(e.clientY) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [glowX, glowY])

  // ── Which phrase color ─────────────────────────────────────
  const isML = phrases[phraseIdx % phrases.length].includes('ML') ||
               phrases[phraseIdx % phrases.length].includes('Open')

  return (
    <section className="relative min-h-screen w-full bg-[#050508] text-white flex flex-col items-center justify-center overflow-hidden px-6">

      {/* Cursor glow */}
      <motion.div
        className="pointer-events-none fixed z-0 w-[500px] h-[500px] rounded-full"
        style={{
          x: sGlowX, y: sGlowY,
          translateX: '-50%', translateY: '-50%',
          background: 'radial-gradient(circle, rgba(41,123,201,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Split BG gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#297bc9]/[0.07] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tl from-[#c7061c]/[0.07] via-transparent to-transparent" />
        {/* Diagonal rule */}
        <div
          className="absolute top-0 bottom-0 left-1/2 w-px opacity-[0.04]"
          style={{ background: 'linear-gradient(to bottom,transparent,#fff 20%,#fff 80%,transparent)', transform: 'rotate(15deg) translateX(-50%)' }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-4xl">

        {/* Portrait */}
        <motion.div
          ref={imgRef}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
          style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 800 }}
          className="relative group cursor-default"
        >
          {/* Corner brackets */}
          {[
            'top-0 left-0 border-t border-l',
            'top-0 right-0 border-t border-r',
            'bottom-0 left-0 border-b border-l',
            'bottom-0 right-0 border-b border-r',
          ].map((cls, i) => (
            <span
              key={i}
              className={`absolute w-5 h-5 border-white/30 transition-all duration-500 group-hover:border-white/70 ${cls}`}
              style={{ margin: '-1px' }}
            />
          ))}

          {/* Outer red ring */}
          <div className="p-[1px] rounded-sm" style={{ background: 'rgba(199,6,28,0.25)' }}>
            {/* Inner blue ring */}
            <div className="p-[1px] rounded-sm" style={{ background: 'rgba(41,123,201,0.15)' }}>
              <div className="relative w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] lg:w-[260px] lg:h-[260px] overflow-hidden rounded-sm">
                <Image
                  src="/me.jpg"
                  alt="Gagan Poojari"
                  fill
                  priority
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                />
                {/* Scanline overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.3) 2px,rgba(0,0,0,0.3) 4px)',
                  }}
                />
                {/* Color split flash on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg,rgba(41,123,201,0.12) 0%,transparent 50%,rgba(199,6,28,0.12) 100%)' }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Name */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        >
          <h1 className="transformers text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-widest text-white"
            style={{ textShadow: '0 0 40px rgba(255,255,255,0.08)' }}
          >
            GAGAN{' '}
            <span
              className="transition-colors duration-700"
              style={{ color: isML ? '#c7061c' : '#297bc9' }}
            >
              POOJARI
            </span>
          </h1>

          {/* Typewriter */}
          <div className="mt-3 h-8 flex items-center justify-center gap-0">
            <span
              className="text-lg sm:text-xl font-mono tracking-[0.12em] transition-colors duration-500"
              style={{ color: isML ? 'rgba(199,6,28,0.8)' : 'rgba(41,123,201,0.8)' }}
            >
              {displayed}
            </span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.85, repeat: Infinity }}
              className="inline-block w-[2px] h-5 ml-[2px] align-middle"
              style={{ background: isML ? '#c7061c' : '#297bc9' }}
            />
          </div>

          {/* Dual identity tag */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#297bc9]/60">MERN Stack</span>
            <span className="w-px h-3 bg-white/15" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/20">·</span>
            <span className="w-px h-3 bg-white/15" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#c7061c]/60">DSML</span>
          </div>
        </motion.div>

        {/* Icons row */}
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.7 } } }}
        >
          {icons.map(({ src, label }, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 12, scale: 0.8 },
                show:   { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 260, damping: 18 } },
              }}
              whileHover={{ y: -4, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 16 }}
              className="group relative flex flex-col items-center gap-1 cursor-default"
            >
              <div
                className="w-11 h-11 sm:w-12 sm:h-12 p-[9px] border border-white/10 rounded-lg bg-white/[0.03] backdrop-blur-sm
                           transition-all duration-300
                           group-hover:border-white/25 group-hover:bg-white/[0.07]"
              >
                <Image src={src} alt={label} width={36} height={36} className="w-full h-full object-contain" />
              </div>
              <span className="text-[8px] font-mono tracking-widest text-white/20 group-hover:text-white/50 transition-colors duration-300 uppercase">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA row */}
        <motion.div
          className="flex items-center gap-4 flex-wrap justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        >
          <a
            href="#projects"
            className="group relative overflow-hidden text-[11px] font-mono tracking-[0.2em] uppercase px-7 py-3 border border-white/20 rounded-sm text-white/70 hover:text-white transition-colors duration-300"
          >
            <span
              className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out pointer-events-none"
              style={{ background: 'linear-gradient(90deg,rgba(41,123,201,0.15),rgba(199,6,28,0.1))' }}
            />
            <span className="relative">View Work</span>
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono tracking-[0.2em] uppercase px-7 py-3 text-white/40 hover:text-white/70 transition-colors duration-300 border border-transparent hover:border-white/10 rounded-sm"
          >
            Resume ↗
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-white/20">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 origin-top"
          style={{ background: 'linear-gradient(to bottom,rgba(255,255,255,0.2),transparent)' }}
        />
      </motion.div>

    </section>
  )
}