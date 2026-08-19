'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
const staggerIcons = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } } }
const iconItem = {
  hidden: { opacity: 0, scale: 0.7, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 18 } },
}

const RedIcon = ({ src, alt }) => (
  <motion.div variants={iconItem} whileHover={{ scale: 1.15, rotate: -4, y: -3 }}
    transition={{ type: 'spring', stiffness: 320, damping: 14 }}
    className="group relative p-[4px] cursor-default">
    <Image src={src} alt={alt} title={alt} width={80} height={80}
      className="w-9 sm:w-11 md:w-12 p-[6px] border border-[#c7061c]/50 rounded-xl bg-[#c7061c]/5
                 backdrop-blur-sm transition-all duration-300
                 group-hover:border-[#c7061c]/90 group-hover:shadow-[0_0_14px_rgba(199,6,28,0.35)]
                 group-hover:bg-[#c7061c]/10" />
  </motion.div>
)

const BlueIcon = ({ src, alt }) => (
  <motion.div variants={iconItem} whileHover={{ scale: 1.15, rotate: 4, y: -3 }}
    transition={{ type: 'spring', stiffness: 320, damping: 14 }}
    className="group relative p-[4px] cursor-default">
    <Image src={src} alt={alt} title={alt} width={80} height={80}
      className="w-9 sm:w-11 md:w-12 p-[6px] border border-[#297bc9]/50 rounded-xl bg-[#297bc9]/5
                 backdrop-blur-sm transition-all duration-300
                 group-hover:border-[#297bc9]/90 group-hover:shadow-[0_0_14px_rgba(41,123,201,0.35)]
                 group-hover:bg-[#297bc9]/10" />
  </motion.div>
)

const UnderlineBar = ({ tone = 'red', align = 'left' }) => (
  <div
    className={`h-[2px] w-28 sm:w-36 md:w-44 mt-2 ${align === 'right' ? 'ml-auto' : ''}`}
    style={{
      background:
        tone === 'red'
          ? align === 'right'
            ? 'linear-gradient(270deg, rgba(199,6,28,0.9), transparent)'
            : 'linear-gradient(90deg, rgba(199,6,28,0.9), transparent)'
          : align === 'right'
          ? 'linear-gradient(270deg, rgba(41,123,201,0.9), transparent)'
          : 'linear-gradient(90deg, rgba(41,123,201,0.9), transparent)',
    }}
  />
)

// ── Cinematic name reveal ────────────────────────────────────────────────────
function CinematicHeading({ phase }) {
  const welcomeLines = ['WELCOME', 'TO MY PORTFOLIO']

  return (
    <div className="relative flex flex-col items-center justify-center text-center px-4 select-none" style={{ minHeight: 140 }}>
      <AnimatePresence mode="wait">

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
                    fontSize: i === 0 ? 'clamp(0.9rem, 4vw, 1.8rem)' : 'clamp(0.55rem, 2vw, 0.85rem)',
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

        {phase === 1 && (
          <motion.div
            key="tagline"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 0.04 } } }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 w-full flex flex-col items-center gap-2"
              style={{ transformOrigin: 'center' }}
            >
              <div style={{
                height: '1px',
                width: '100%',
                maxWidth: '480px',
                background: 'linear-gradient(90deg, rgba(199,6,28,0.8), rgba(255,255,255,0.12), rgba(41,123,201,0.8))',
              }} />
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                style={{
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontSize: 'clamp(0.55rem, 1.4vw, 0.72rem)',
                  letterSpacing: '0.35em',
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                }}
              >
                <span className="text-[#c7061c]">MERN STACK</span> &nbsp;·&nbsp; <span>ARTIST</span> &nbsp;·&nbsp; <span className="text-[#297bc9]">AI / ML</span> 
              </motion.p>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

const MainFC = () => {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center gap-6 md:gap-10 p-4 sm:p-8 pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-16 overflow-hidden">

      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 relative">

          {/* Soft circular ambient radial glows behind left/right columns */}
          {/* <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#c7061c]/15 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#297bc9]/15 blur-3xl" /> */}

          {/* LEFT - MERN (RED PALETTE) */}
          <motion.div className="w-full md:w-1/3 flex flex-col items-center md:items-end gap-3 md:gap-4 z-10" initial="hidden" animate="show" variants={fadeUp}>
            <motion.div className="text-center md:text-right transformers" variants={slideLeft}>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-wide text-white leading-tight">
                MERN STACK <br className="hidden md:inline" />
                <span className="text-[#c7061c]">DEVELOPER</span>
              </h3>
              <UnderlineBar tone="red" align="right" />
            </motion.div>
            <motion.div className="flex flex-wrap justify-center md:justify-end gap-1" variants={staggerIcons} initial="hidden" animate="show">
              {mern_icons.map((item) => <RedIcon key={item.id} src={item.src} alt={item.alt} />)}
            </motion.div>
          </motion.div>

          {/* CENTER - PORTRAIT */}
          <motion.div className="relative z-10 flex-shrink-0 my-2 md:my-0"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1], delay: 0.15 }}>
            <GlitchImage />
          </motion.div>

          {/* RIGHT - AI/ML (BLUE PALETTE) */}
          <motion.div className="w-full md:w-1/3 flex flex-col items-center md:items-start gap-3 md:gap-4 z-10" initial="hidden" animate="show" variants={fadeUp}>
            <motion.div className="text-center md:text-left transformers" variants={slideRight}>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-wide text-white leading-tight">
                AI / ML <br className="hidden md:inline" />
                <span className="text-[#297bc9]">ENTHUSIAST</span>
              </h3>
              <UnderlineBar tone="blue" align="left" />
            </motion.div>
            <motion.div className="flex flex-wrap justify-center md:justify-start gap-1" variants={staggerIcons} initial="hidden" animate="show">
              {aiml_icons.map((item) => <BlueIcon key={item.id} src={item.src} alt={item.alt} />)}
            </motion.div>
          </motion.div>

        </div>
      </div>

      <CinematicHeading phase={phase} />

    </div>
  )
}

export default MainFC