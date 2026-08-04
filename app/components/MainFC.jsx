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

const GLITCH_CHARS = '!<>-_\\/[]{}-=+*^?#@%$&ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

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
  const [heading, setHeading] = useState('WELCOME TO MY PORTFOLIO...')
  const [triggered, setTriggered] = useState(false)
  const [hasSwitched, setHasSwitched] = useState(false)

  useEffect(() => {
    if (hasSwitched) return
    const t = setTimeout(() => {
      setHeading("I'M GAGAN POOJARI")
      setTriggered(true)
      setHasSwitched(true)
    }, 2500)
    return () => clearTimeout(t)
  }, [hasSwitched])

  return (
    <>
      <style>{`
        @keyframes cursor-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .heading-cursor {
          display:inline-block; width:3px; height:0.85em;
          background:#f0f0f0; margin-left:4px; vertical-align:middle;
          border-radius:1px; animation:cursor-blink 1.1s step-end infinite;
        }
      `}</style>

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

        <GlitchDecodeHeading text={heading} triggered={triggered} />

      </div>
    </>
  )
}

export default MainFC