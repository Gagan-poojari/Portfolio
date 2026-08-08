'use client'
import Image from 'next/image'
import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import GlitchImage from './GlitchImage'

const mern_icons = [
  { id: 1, src: '/icons/mern-icons/nextjs-icon.png', alt: 'Next.js' },
  { id: 2, src: '/icons/mern-icons/reactjs-icon.png', alt: 'React.js' },
  { id: 3, src: '/icons/mern-icons/expressjs-icon.png', alt: 'Express.js' },
  { id: 4, src: '/icons/mern-icons/git-icon.png', alt: 'Git' },
  { id: 5, src: '/icons/mern-icons/mongodb-icon.webp', alt: 'MongoDB' },
]

const aiml_icons = [
  { id: 1, src: '/icons/aiml-icons/pytorch-icon.png', alt: 'PyTorch' },
  { id: 2, src: '/icons/aiml-icons/opencv-icon.webp', alt: 'OpenCV' },
  { id: 3, src: '/icons/aiml-icons/numpy-icon.png', alt: 'NumPy' },
  { id: 4, src: '/icons/aiml-icons/pandas-icon.png', alt: 'Pandas' },
  { id: 5, src: '/icons/aiml-icons/scikit-learn-icon.png', alt: 'Scikit-learn' },
]

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] } } }
const slideLeft = { hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.32, 0.72, 0, 1] } } }
const slideRight = { hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.32, 0.72, 0, 1] } } }
const staggerIcons = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.5 } } }
const iconItem = {
  hidden: { opacity: 0, scale: 0.7, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 18 } },
}

const BlueIcon = ({ src, alt }) => (
  <motion.div variants={iconItem} whileHover={{ scale: 1.15, rotate: 4, y: -3 }}
    transition={{ type: 'spring', stiffness: 320, damping: 14 }}
    className="group relative p-[5px] cursor-default">
    <Image src={src} alt={alt} title={alt} width={80} height={80}
      className="w-11 sm:w-12 p-[7px] border border-[#297bc9]/50 rounded-xl bg-[#297bc9]/5
                 backdrop-blur-sm transition-all duration-300
                 group-hover:border-[#297bc9]/90 group-hover:shadow-[0_0_14px_rgba(41,123,201,0.35)]
                 group-hover:bg-[#297bc9]/10" />
  </motion.div>
)

const RedIcon = ({ src, alt }) => (
  <motion.div variants={iconItem} whileHover={{ scale: 1.15, rotate: -4, y: -3 }}
    transition={{ type: 'spring', stiffness: 320, damping: 14 }}
    className="group relative p-[5px] cursor-default">
    <Image src={src} alt={alt} title={alt} width={80} height={80}
      className="w-11 sm:w-12 p-[7px] border border-[#c7061c]/50 rounded-xl bg-[#c7061c]/5
                 backdrop-blur-sm transition-all duration-300
                 group-hover:border-[#c7061c]/90 group-hover:shadow-[0_0_14px_rgba(199,6,28,0.35)]
                 group-hover:bg-[#c7061c]/10" />
  </motion.div>
)

// ── Cinematic name reveal using Bebas Neue ──────────────────────────────────
function CinematicHeading({ phase }) {
  const welcomeLines = ['WELCOME', 'TO MY PORTFOLIO']
  const nameLines = [{ text: 'GAGAN', solid: true }, { text: 'POOJARI', solid: false }]

  return (
    <div className="relative flex flex-col items-center justify-center text-center px-4 select-none" style={{ minHeight: 140 }}>
      <AnimatePresence mode="wait">

        {/* Phase 0 — Welcome */}
        {phase === 0 && (
          <motion.div
            key="welcome"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.13 } },
              exit: { transition: { staggerChildren: 0.07, staggerDirection: -1 } },
            }}
            className="flex flex-col items-center"
            style={{ gap: '0.15em' }}
          >
            {welcomeLines.map((word, i) => (
              <div key={i} style={{ overflow: 'hidden' }}>
                <motion.span
                  variants={{
                    hidden: { y: '110%', opacity: 0 },
                    show:  { y: 0, opacity: 1, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
                    exit:  { y: '-115%', opacity: 0, transition: { duration: 0.38, ease: [0.7, 0, 0.84, 0] } },
                  }}
                  className="block"
                  style={{
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: i === 0 ? 'clamp(0.9rem, 4.5vw, 2rem)' : 'clamp(0.55rem, 2.2vw, 0.9rem)',
                    fontWeight: i === 0 ? 500 : 300,
                    letterSpacing: i === 0 ? '0.28em' : '0.6em',
                    color: i === 0 ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.32)',
                  }}
                >
                  {word}
                </motion.span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Phase 1 — Name */}
        {phase === 1 && (
          <motion.div
            key="name"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 0.04 } } }}
            className="flex flex-col items-center"
            style={{ gap: 0, lineHeight: 0.88 }}
          >
            {nameLines.map(({ text, solid }, i) => (
              <div key={i} style={{ overflow: 'hidden' }}>
                <motion.h1
                  variants={{
                    hidden: { y: '108%', skewY: 3, opacity: 0 },
                    show: { y: 0, skewY: 0, opacity: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  style={{
                    fontFamily: 'var(--font-bebas), sans-serif',
                    fontSize: 'clamp(3.5rem, 14vw, 8.5rem)',
                    fontWeight: 400,
                    letterSpacing: '0.03em',
                    lineHeight: 0.88,
                    margin: 0,
                    WebkitTextStroke: solid ? '0px' : '1.5px rgba(255,255,255,0.7)',
                    color: solid ? 'rgba(255,255,255,0.95)' : 'transparent',
                  }}
                >
                  {text}
                </motion.h1>
              </div>
            ))}

            {/* Gradient rule + tagline */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 w-full flex flex-col items-center gap-2"
              style={{ transformOrigin: 'left center' }}
            >
              <div style={{
                height: '1px',
                width: '100%',
                background: 'linear-gradient(90deg, rgba(41,123,201,0.8), rgba(255,255,255,0.12), rgba(199,6,28,0.8))',
              }} />
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                style={{
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontSize: 'clamp(0.5rem, 1.4vw, 0.68rem)',
                  letterSpacing: '0.38em',
                  color: 'rgba(255,255,255,0.28)',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                }}
              >
                Mern Stack &nbsp;·&nbsp; AI / ML &nbsp;·&nbsp; Artist
              </motion.p>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

function GlitchDecodeHeading({ text, triggered }) {
  const [letters, setLetters] = useState(() =>
    text.split('').map((ch) => ({
      char: ch,
      locked: true,
      glitchX: 0,
      glitchY: 0,
      hue: 200,
      shadowX1: 0,
      shadowX2: 0,
    }))
  )
  const [done, setDone] = useState(true)
  const [scanFlash, setScanFlash] = useState(false)
  const rafRef = useRef(null)
  const stateRef = useRef({ locked: [], iter: [] })

  useEffect(() => {
    setLetters(
      text.split('').map((ch) => ({
        char: ch, locked: true,
        glitchX: 0, glitchY: 0, hue: 200, shadowX1: 0, shadowX2: 0,
      }))
    )
    setDone(true)
  }, [text])

  useEffect(() => {
    if (!triggered) return

    setScanFlash(true)
    setTimeout(() => setScanFlash(false), 600)

    const MAX_ITER = 10
    const STAGGER = 38

    stateRef.current.locked = Array(text.length).fill(false)
    stateRef.current.iter = Array(text.length).fill(-9999)

    text.split('').forEach((_, i) => {
      setTimeout(() => { stateRef.current.iter[i] = 0 }, i * STAGGER)
    })

    setDone(false)

    let lastFrame = 0
    const FRAME_MS = 45

    function tick(ts) {
      if (ts - lastFrame < FRAME_MS) { rafRef.current = requestAnimationFrame(tick); return }
      lastFrame = ts

      const state = stateRef.current
      let allDone = true
      const next = []

      for (let i = 0; i < text.length; i++) {
        if (state.locked[i]) {
          next.push({ char: text[i], locked: true, glitchX: 0, glitchY: 0, hue: 200, shadowX1: 0, shadowX2: 0 })
          continue
        }
        if (state.iter[i] < 0) {
          next.push({ char: ' ', locked: false, glitchX: 0, glitchY: 0, hue: 200, shadowX1: 0, shadowX2: 0 })
          allDone = false
          continue
        }

        allDone = false

        if (state.iter[i] >= MAX_ITER) {
          state.locked[i] = true
          next.push({ char: text[i], locked: true, glitchX: 0, glitchY: 0, hue: 200, shadowX1: 0, shadowX2: 0 })
        } else {
          const bias = state.iter[i] / MAX_ITER
          const ch = Math.random() < bias
            ? text[i]
            : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          state.iter[i]++
          next.push({
            char: ch,
            locked: false,
            glitchX: (Math.random() - 0.5) * 6,
            glitchY: (Math.random() - 0.5) * 4,
            hue: Math.floor(Math.random() * 60) + 180,
            shadowX1: (Math.random() - 0.5) * 4,
            shadowX2: (Math.random() - 0.5) * 4,
          })
        }
      }

      setLetters(next)

      if (allDone) { setDone(true); return }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggered])

  return (
    <div className="relative flex flex-col items-center justify-center text-center px-4">
      <AnimatePresence>
        {scanFlash && (
          <motion.div
            className="absolute inset-x-0 h-[2px] pointer-events-none"
            style={{ background: 'rgba(41,123,201,0.7)', top: '50%' }}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      <h1 className="transformers text-xl md:text-4xl lg:text-5xl font-extrabold tracking-widest">
        {letters.map((l, i) => (
          <span
            key={i}
            className="inline-block transformers"
            style={{
              WebkitTextStroke: `1px #fff`,
              color: "transparent",
              lineHeight: 0.92,
              margin: 0,
              fontWeight: 800,
              transform: l.locked ? 'none' : `translate(${l.glitchX}px,${l.glitchY}px)`,
              opacity: l.locked ? 1 : 0.85,
              textShadow: l.locked
                ? 'none'
                : `0 0 8px rgba(100,200,255,0.6), ${l.shadowX1}px 0 rgba(199,6,28,0.7), ${l.shadowX2}px 0 rgba(41,123,201,0.7)`,
              transition: l.locked ? 'color 0.15s ease, text-shadow 0.2s ease' : 'none',
            }}
          >
            {text[i] === ' ' ? '\u00A0' : l.char}
          </span>
        ))}
        <span className="heading-cursor" aria-hidden="true" />
      </h1>

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="mt-2 h-[1.5px] w-2/3"
            style={{
              background: 'linear-gradient(90deg,transparent,#fff 30%,#fff 70%,transparent)',
              transformOrigin: 'center',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const MainFC = () => {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 2200)
    return () => clearTimeout(t)
  }, [])

  return (
    <>

      <div className="min-h-screen flex flex-col justify-center items-center gap-16 lg:gap-20 p-8 pt-24 overflow-hidden">

        <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} glareEnable={false} className="w-full max-w-5xl">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 relative">

            <div className="pointer-events-none absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-[#297bc9]/8 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#c7061c]/8 to-transparent" />

            {/* LEFT - MERN */}
            <motion.div className="w-full lg:w-1/3 flex flex-col items-center lg:items-end gap-5" initial="hidden" animate="show" variants={fadeUp}>
              <motion.div className="text-center lg:text-right transformers" variants={slideLeft} initial="hidden" animate="show">
                <p className="text-[#297bc9] text-3xl lg:text-4xl font-bold tracking-wide leading-tight">MERN STACK</p>
                <p className="text-[#297bc9]/65 text-xl lg:text-2xl font-semibold tracking-[0.12em] mt-1">DEVELOPER</p>
              </motion.div>
              <motion.div className="flex flex-wrap justify-center lg:justify-end" variants={staggerIcons} initial="hidden" animate="show">
                {mern_icons.map((item) => <BlueIcon key={item.id} src={item.src} alt={item.alt} />)}
              </motion.div>
            </motion.div>

            {/* CENTER */}
            <motion.div className="relative z-10 flex-shrink-0"
              initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1], delay: 0.15 }}>
              {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2',
                'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'
              ].map((cls, i) => (
                <span key={i} className={`absolute w-4 h-4 border-white/20 rounded-sm ${cls}`} style={{ margin: '-6px' }} />
              ))}
              <div className="border border-[#c7061c]/30 rounded-sm p-[2px]">
                <div className="border border-[#297bc9]/15 rounded-sm">
                  <GlitchImage />
                </div>
              </div>
            </motion.div>

            {/* RIGHT - AI/ML */}
            <motion.div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start gap-5" initial="hidden" animate="show" variants={fadeUp}>
              <motion.div className="flex flex-wrap justify-center lg:justify-start" variants={staggerIcons} initial="hidden" animate="show">
                {aiml_icons.map((item) => <RedIcon key={item.id} src={item.src} alt={item.alt} />)}
              </motion.div>
              <motion.div className="text-center lg:text-left transformers" variants={slideRight} initial="hidden" animate="show">
                <p className="text-[#c7061c] text-3xl lg:text-4xl font-bold tracking-wide leading-tight">AI / Machine Learning</p>
                <p className="text-[#c7061c]/65 text-xl lg:text-2xl font-semibold tracking-[0.12em] mt-1">ENGINEER</p>
              </motion.div>
            </motion.div>

          </div>
        </Tilt>

        <CinematicHeading phase={phase} />

      </div>
    </>
  )
}

export default MainFC