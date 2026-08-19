'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const IMG_SRC = '/g-hero-cutout.png'

// ── Canvas digital-rain flanking the portrait (Red left, Blue right) ────────
function DigitalRain({ side }) {
  const canvasRef = useRef(null)
  const frameRef = useRef(null)
  const color = side === 'left' ? '199,6,28' : '41,123,201'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const chars = '01アイウエオカキクケコサシスセソ01ABCDEF#$%01'.split('')
    const fontSize = 11
    let W, H, columns, drops

    function setup() {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
      columns = Math.max(1, Math.floor(W / fontSize))
      drops = new Array(columns).fill(0).map(() => Math.random() * -30)
    }
    setup()
    window.addEventListener('resize', setup)

    function draw() {
      ctx.clearRect(0, 0, W, H)
      ctx.font = `${fontSize}px monospace`
      for (let i = 0; i < columns; i++) {
        const head = drops[i]
        for (let t = 0; t < 7; t++) {
          const y = (head - t) * fontSize
          if (y < 0 || y > H) continue
          const alpha = Math.max(0, 0.8 - t * 0.13)
          const ch = chars[Math.floor(Math.random() * chars.length)]
          ctx.fillStyle = `rgba(${color},${alpha})`
          ctx.fillText(ch, i * fontSize, y)
        }
        drops[i] += 0.55
        if (drops[i] * fontSize > H + 60 && Math.random() > 0.985) drops[i] = Math.random() * -20
      }
      frameRef.current = requestAnimationFrame(draw)
    }
    frameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', setup)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 bottom-0 w-12 sm:w-14 md:w-16 pointer-events-none"
      style={{
        [side]: '-2.8rem',
        maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
        opacity: 0.6,
      }}
    />
  )
}

// ── Slow-rotating split red/blue halo ───────────────────────────────────────
function HaloRings() {
  return (
    <>
      <motion.svg
        viewBox="0 0 300 300"
        className="absolute pointer-events-none"
        style={{ top: '-10%', left: '50%', width: '96%', height: '96%', transform: 'translateX(-50%)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 46, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="150" cy="150" r="132" fill="none" stroke="rgba(199,6,28,0.45)" strokeWidth="1.2"
          strokeDasharray="415 415" transform="rotate(-90 150 150)" />
        <circle cx="150" cy="150" r="132" fill="none" stroke="rgba(41,123,201,0.45)" strokeWidth="1.2"
          strokeDasharray="415 415" strokeDashoffset="-415" transform="rotate(-90 150 150)" />
      </motion.svg>

      <motion.svg
        viewBox="0 0 300 300"
        className="absolute pointer-events-none"
        style={{ top: '-10%', left: '50%', width: '96%', height: '96%', transform: 'translateX(-50%)' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 64, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="150" cy="150" r="108" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeDasharray="3 9" />
      </motion.svg>
    </>
  )
}

// ── Breathing glow behind head (Red left, Blue right) ──────────────────────
function GlowPulse() {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        top: '-6%', left: '50%', width: '80%', height: '55%', transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse at 35% 50%, rgba(199,6,28,0.32), transparent 65%), radial-gradient(ellipse at 65% 50%, rgba(41,123,201,0.32), transparent 65%)',
        filter: 'blur(26px)',
      }}
      animate={{ opacity: [0.55, 0.9, 0.55] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

// ── Pulsing floor-glow under portrait ──────────────────────────────────────
function BottomGlow() {
  return (
    <motion.div
      className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-20 pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at 30% 50%, rgba(199,6,28,0.45), transparent 70%), radial-gradient(ellipse at 70% 50%, rgba(41,123,201,0.45), transparent 70%)',
        filter: 'blur(20px)',
      }}
      animate={{ opacity: [0.5, 1, 0.5], scaleX: [0.94, 1.04, 0.94] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export default function GlitchImage() {
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    let active = true
    async function cycle() {
      while (active) {
        setGlitch(true)
        await new Promise((r) => setTimeout(r, 260))
        if (!active) return
        setGlitch(false)
        await new Promise((r) => setTimeout(r, 2200 + Math.random() * 2200))
      }
    }
    cycle()
    return () => { active = false }
  }, [])

  return (
    <motion.div
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-[215px] sm:w-[260px] md:w-[300px] lg:w-[345px]"
    >
      <HaloRings />
      <GlowPulse />
      <DigitalRain side="left" />
      <DigitalRain side="right" />
      {/* <BottomGlow /> */}

      <div className="relative z-10 rounded-sm">
        <Image
          src={IMG_SRC}
          alt="Gagan Poojari"
          width={620}
          height={860}
          priority
          className="w-full h-auto object-contain drop-shadow-[0_0_25px_rgba(199,6,28,0.25)]"
          style={{ filter: glitch ? 'contrast(1.15) saturate(1.3)' : 'none', transition: 'filter 0.15s ease' }}
        />
      </div>
    </motion.div>
  )
}