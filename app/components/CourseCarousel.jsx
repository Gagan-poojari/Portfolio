'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'

/* ─────────────────────────────────────────────
    DATA
───────────────────────────────────────────── */
const courses = [
  {
    id: 1,
    src: '/assets/coursera_ml_course.svg',
    alt: 'Supervised ML by Stanford',
    link: 'https://www.coursera.org/account/accomplishments/specialization/CC56MG0KYTMX',
    by: 'Stanford University',
    code: 'SYS.ML.001',
    status: 'VERIFIED',
    statusColor: '#22c55e',
    tag: 'ML & AI',
    tagColor: '#3B82F6',
    year: '2024',
  },
  {
    id: 2,
    src: '/assets/coursera_course1.svg',
    alt: 'Machine Learning Basics',
    link: 'https://www.coursera.org/account/accomplishments/specialization/CC56MG0KYTMX',
    by: 'DeepLearning.AI',
    code: 'SYS.AI.002',
    status: 'VERIFIED',
    statusColor: '#22c55e',
    tag: 'ML & AI',
    tagColor: '#3B82F6',
    year: '2024',
  },
  {
    id: 3,
    src: '/assets/coursera_course2.svg',
    alt: 'AI for Everyone',
    link: 'https://www.coursera.org/account/accomplishments/verify/XQDG7QNOVJGF',
    by: 'DeepLearning.AI',
    code: 'SYS.GENAI.003',
    status: 'VERIFIED',
    statusColor: '#22c55e',
    tag: 'GenAI',
    tagColor: '#3B82F6',
    year: '2023',
  },
  {
    id: 4,
    src: '/assets/coursera_course3.svg',
    alt: 'Deep Learning Intro',
    link: 'https://www.coursera.org/account/accomplishments/verify/NPRA1XKJR153',
    by: 'DeepLearning.AI',
    code: 'SYS.DL.004',
    status: 'VERIFIED',
    statusColor: '#22c55e',
    tag: 'Deep Learning',
    tagColor: '#06b6d4',
    year: '2023',
  },
  {
    id: 5,
    src: '/assets/azure_ai_associate.jpg',
    alt: 'Azure AI Apps and Agents Developer Associate',
    link: 'https://learn.microsoft.com/en-us/users/gaganpoojari-6040/credentials/certification/azure-ai-apps-and-agents-developer-associate',
    by: 'Microsoft',
    code: 'SYS.AZ.005',
    status: 'VERIFIED',
    statusColor: '#22c55e',
    tag: 'Azure AI',
    tagColor: '#0078D4',
    year: '2026',
  },
  {
    id: 6,
    src: '/assets/ai_skills_fest_2026.png',
    alt: 'AI Skills Fest 2026',
    link: 'https://www.credly.com/badges/d87897df-ed83-4a8b-8dd4-a8a678b25662/',
    by: 'Microsoft (via Credly)',
    code: 'SYS.AI.006',
    status: 'VERIFIED',
    statusColor: '#22c55e',
    tag: 'AI Literacy',
    tagColor: '#3B82F6',
    year: '2026',
  },
  {
    id: 7,
    src: '/assets/azure_ai_agents_path.jpg',
    alt: 'Develop AI Agents on Azure',
    link: 'https://learn.microsoft.com/en-us/users/gaganpoojari-6040/achievements',
    by: 'Microsoft Learn',
    code: 'SYS.PATH.007',
    status: 'COMPLETED',
    statusColor: '#3B82F6',
    tag: 'Learning Path',
    tagColor: '#0078D4',
    year: '2026',
  },
  {
    id: 8,
    src: '/assets/azure_nlp_path.jpg',
    alt: 'Develop Natural Language Solutions in Azure',
    link: 'https://learn.microsoft.com/en-us/users/gaganpoojari-6040/achievements',
    by: 'Microsoft Learn',
    code: 'SYS.PATH.008',
    status: 'COMPLETED',
    statusColor: '#3B82F6',
    tag: 'Learning Path',
    tagColor: '#0078D4',
    year: '2026',
  },
  {
    id: 9,
    src: '/assets/azure_genai_apps_path.jpg',
    alt: 'Develop Generative AI Apps in Azure',
    link: 'https://learn.microsoft.com/en-us/users/gaganpoojari-6040/achievements',
    by: 'Microsoft Learn',
    code: 'SYS.PATH.009',
    status: 'COMPLETED',
    statusColor: '#3B82F6',
    tag: 'Learning Path',
    tagColor: '#0078D4',
    year: '2026',
  },
]

/* triple for gapless loop */
const LOOPED = [...courses, ...courses, ...courses]

/* ─────────────────────────────────────────────
    TILT CARD WRAPPER
───────────────────────────────────────────── */
function TiltCard({ children, style, className, onClick }) {
  const ref = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const sRx = useSpring(rx, { stiffness: 200, damping: 22 })
  const sRy = useSpring(ry, { stiffness: 200, damping: 22 })
  const rotateX = useTransform(sRx, v => `${v}deg`)
  const rotateY = useTransform(sRy, v => `${v}deg`)

  const onMove = useCallback(e => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    rx.set(((e.clientY - cy) / (r.height / 2)) * -7)
    ry.set(((e.clientX - cx) / (r.width / 2)) * 7)
  }, [rx, ry])

  const onLeave = useCallback(() => { rx.set(0); ry.set(0) }, [rx, ry])

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ ...style, rotateX, rotateY, transformStyle: 'preserve-3d', perspective: '800px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
    SCAN REVEAL — replaces the old per-frame glitch
    A single clip-path wipe + a bright scan-beam sweeping across it,
    both driven by one framer-motion animate() call each — GPU
    composited (transform/clip-path only), no per-frame React state,
    so it can't stutter the scroll-in like the old rAF glitch did.
───────────────────────────────────────────── */
function ScanReveal({ text, triggered, color = '#3B82F6' }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <motion.span
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={triggered ? { clipPath: 'inset(0 0% 0 0)' } : {}}
        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'inline-block' }}
      >
        {text}
      </motion.span>

      {triggered && (
        <motion.span
          initial={{ left: '0%', opacity: 0 }}
          animate={{ left: '100%', opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], times: [0, 0.08, 0.85, 1] }}
          style={{
            position: 'absolute',
            top: '-6%',
            bottom: '-6%',
            width: '3px',
            background: color,
            boxShadow: `0 0 16px 3px ${color}, 0 0 40px 10px ${color}55`,
            pointerEvents: 'none',
          }}
        />
      )}
    </span>
  )
}

/* ─────────────────────────────────────────────
    CREDENTIAL CARD
───────────────────────────────────────────── */
function CredCard({ course, index, onClick, isDragging }) {
  const [hovered, setHovered] = useState(false)

  return (
    <TiltCard
      onClick={() => { if (!isDragging) onClick(course) }}
      style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
      className="relative flex-shrink-0"
    >
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={{
          borderColor: hovered ? `${course.tagColor}55` : 'rgba(255,255,255,0.08)',
          boxShadow: hovered
            ? `0 0 0 1px ${course.tagColor}22, 0 20px 40px -12px ${course.tagColor}33, inset 0 0 24px rgba(255,255,255,0.02)`
            : '0 0 0 0 transparent',
        }}
        transition={{ duration: 0.25 }}
        style={{
          width: 'clamp(250px, 85vw, 340px)',
          background: '#080808',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '20px',
          position: 'relative',
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        {/* scanlines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '12px',
          background: 'repeating-linear-gradient(to bottom,transparent 0,transparent 3px,rgba(255,255,255,0.007) 3px,rgba(255,255,255,0.007) 4px)',
        }} />

        {/* glow radial on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '12px',
                background: `radial-gradient(circle at 30% 20%, ${course.tagColor}0d 0%, transparent 65%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* corner accents */}
        {[
          { top: -1, left: -1, borderTop: true, borderLeft: true },
          { top: -1, right: -1, borderTop: true, borderRight: true },
          { bottom: -1, left: -1, borderBottom: true, borderLeft: true },
          { bottom: -1, right: -1, borderBottom: true, borderRight: true },
        ].map((c, i) => (
          <motion.span key={i} animate={{ opacity: hovered ? 1 : 0.25 }} transition={{ duration: 0.2 }} style={{
            position: 'absolute', width: 12, height: 12,
            ...(c.top !== undefined ? { top: c.top } : { bottom: c.bottom }),
            ...(c.left !== undefined ? { left: c.left } : { right: c.right }),
            borderTop: c.borderTop ? `1.5px solid ${course.tagColor}` : 'none',
            borderBottom: c.borderBottom ? `1.5px solid ${course.tagColor}` : 'none',
            borderLeft: c.borderLeft ? `1.5px solid ${course.tagColor}` : 'none',
            borderRight: c.borderRight ? `1.5px solid ${course.tagColor}` : 'none',
          }} />
        ))}

        {/* top meta bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '14px', paddingBottom: '12px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          fontFamily: "'DM Mono', monospace",
        }}>
          <span style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
            {course.code}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: course.statusColor,
              boxShadow: `0 0 6px ${course.statusColor}`,
              flexShrink: 0,
              animation: course.status === 'VERIFIED' ? 'credPulse 2s ease-in-out infinite' : 'none',
            }} />
            <span style={{
              fontSize: '9px', letterSpacing: '0.15em', color: course.statusColor,
              textTransform: 'uppercase',
            }}>
              {course.status}
            </span>
          </div>
        </div>

        {/* image */}
        <div style={{
          width: '100%', height: '160px', position: 'relative',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '8px', overflow: 'hidden', marginBottom: '16px',
        }}>
          <Image
            src={course.src}
            alt={course.alt}
            fill
            draggable={false}
            className="object-contain p-4"
            style={{ transition: 'transform 0.4s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
            sizes="340px"
          />
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'repeating-linear-gradient(to bottom,transparent 0,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)',
          }} />
        </div>

        {/* info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <h4 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700, fontSize: '15px', color: '#fff',
              lineHeight: 1.3, margin: 0,
              transition: 'color 0.2s',
              ...(hovered ? { color: course.tagColor } : {}),
            }}>
              {course.alt}
            </h4>
            <span style={{
              flexShrink: 0,
              fontSize: '9px', fontFamily: "'DM Mono', monospace",
              color: course.tagColor,
              border: `1px solid ${course.tagColor}44`,
              background: `${course.tagColor}0e`,
              borderRadius: '4px', padding: '2px 7px',
              letterSpacing: '0.1em', whiteSpace: 'nowrap',
              marginTop: 2,
            }}>
              {course.tag}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontFamily: "'DM Mono', monospace", color: 'rgba(255,255,255,0.35)' }}>
              {course.by}
            </span>
            <motion.span
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 6 }}
              transition={{ duration: 0.18 }}
              style={{ fontSize: '10px', fontFamily: "'DM Mono', monospace", color: course.tagColor, letterSpacing: '0.1em' }}
            >
              INSPECT ↗
            </motion.span>
          </div>
        </div>
      </motion.div>
    </TiltCard>
  )
}

/* ─────────────────────────────────────────────
    MODAL
───────────────────────────────────────────── */
function InspectModal({ course, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      }}
    >
      <motion.div
        initial={{ scale: 0.88, y: 28, rotateX: -8 }}
        animate={{ scale: 1, y: 0, rotateX: 0 }}
        exit={{ scale: 0.88, y: 28, rotateX: 8 }}
        transition={{ type: 'spring', stiffness: 240, damping: 24 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#090909',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '16px',
          padding: 'clamp(20px,4vw,36px)',
          maxWidth: '520px', width: '100%',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* scanlines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'repeating-linear-gradient(to bottom,transparent 0,transparent 3px,rgba(255,255,255,0.007) 3px,rgba(255,255,255,0.007) 4px)',
        }} />

        {/* corner accents */}
        {[
          { top: -1, left: -1, borderTop: true, borderLeft: true },
          { top: -1, right: -1, borderTop: true, borderRight: true },
          { bottom: -1, left: -1, borderBottom: true, borderLeft: true },
          { bottom: -1, right: -1, borderBottom: true, borderRight: true },
        ].map((c, i) => (
          <span key={i} style={{
            position: 'absolute', width: 14, height: 14,
            ...(c.top !== undefined ? { top: c.top } : { bottom: c.bottom }),
            ...(c.left !== undefined ? { left: c.left } : { right: c.right }),
            borderTop: c.borderTop ? `1.5px solid ${course.tagColor}` : 'none',
            borderBottom: c.borderBottom ? `1.5px solid ${course.tagColor}` : 'none',
            borderLeft: c.borderLeft ? `1.5px solid ${course.tagColor}` : 'none',
            borderRight: c.borderRight ? `1.5px solid ${course.tagColor}` : 'none',
          }} />
        ))}

        {/* glow */}
        <div style={{
          position: 'absolute', top: '-30%', left: '-10%', pointerEvents: 'none',
          width: '60%', height: '50%',
          background: `radial-gradient(circle, ${course.tagColor}12 0%, transparent 70%)`,
        }} />

        {/* header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          paddingBottom: '16px', marginBottom: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          position: 'relative', zIndex: 1,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '9px', fontFamily: "'DM Mono', monospace", letterSpacing: '0.18em', color: course.tagColor }}>
                {course.code}
              </span>
              <span style={{ fontSize: '9px', fontFamily: "'DM Mono', monospace", letterSpacing: '0.12em', color: course.statusColor, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: course.statusColor, display: 'inline-block' }} />
                {course.status}
              </span>
            </div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(18px,3vw,22px)', color: '#fff', margin: '0 0 4px' }}>
              {course.alt}
            </h3>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
              {course.by} · {course.year}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent', borderRadius: '6px', padding: '5px 10px',
              cursor: 'pointer', transition: 'all 0.18s',
              flexShrink: 0, marginLeft: '12px',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
          >
            ESC
          </button>
        </div>

        {/* image */}
        <div style={{
          width: '100%', height: '200px', position: 'relative',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '10px', overflow: 'hidden', marginBottom: '20px',
          zIndex: 1,
        }}>
          <Image src={course.src} alt={course.alt} fill className="object-contain p-6" sizes="520px" />
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'repeating-linear-gradient(to bottom,transparent 0,transparent 3px,rgba(0,0,0,0.03) 3px,rgba(0,0,0,0.03) 4px)',
          }} />
        </div>

        {/* actions */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <a
            href={course.link}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1, minWidth: '160px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '13px 20px',
              background: `${course.tagColor}18`,
              border: `1px solid ${course.tagColor}55`,
              borderRadius: '10px',
              fontFamily: "'DM Mono', monospace",
              fontSize: '11px', letterSpacing: '0.1em', color: course.tagColor,
              textDecoration: 'none', fontWeight: 500,
              transition: 'all 0.22s',
              boxShadow: `0 0 20px ${course.tagColor}14`,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${course.tagColor}28`; e.currentTarget.style.boxShadow = `0 0 30px ${course.tagColor}28` }}
            onMouseLeave={e => { e.currentTarget.style.background = `${course.tagColor}18`; e.currentTarget.style.boxShadow = `0 0 20px ${course.tagColor}14` }}
          >
            VERIFY CREDENTIAL ↗
          </a>
          <button
            onClick={onClose}
            style={{
              padding: '13px 20px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              fontFamily: "'DM Mono', monospace",
              fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            DISMISS
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
    MAIN
───────────────────────────────────────────── */
export default function CourseCarousel() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)
  const [inspected, setInspected] = useState(null)
  const [inView, setInView] = useState(false)
  const [glitchTriggered, setGlitchTriggered] = useState(false)

  /* drag-to-scroll tracking state */
  const dragState = useRef({ dragging: false, startX: 0, scrollLeft: 0, moved: false })
  const [isDragging, setIsDragging] = useState(false)

  const onPointerDown = e => {
    const track = trackRef.current
    if (!track) return
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      scrollLeft: track.scrollLeft,
      moved: false,
      captured: false,
    }
    setIsDragging(false)
    const dx = e.clientX - dragState.current.startX
    track.style.cursor = 'grabbing'
    if (Math.abs(dx) > 4 && !dragState.current.captured) {
      track.setPointerCapture(e.pointerId)
      dragState.current.captured = true
    }
  }

  const onPointerMove = e => {
    if (!dragState.current.dragging) return
    const dx = e.clientX - dragState.current.startX
    if (Math.abs(dx) > 4) { 
      dragState.current.moved = true
      setIsDragging(true) 
    }
    trackRef.current.scrollLeft = dragState.current.scrollLeft - dx
  }

  const onPointerUp = e => {
    dragState.current.dragging = false
  
    if (
      trackRef.current &&
      trackRef.current.hasPointerCapture(e.pointerId)
    ) {
      trackRef.current.releasePointerCapture(e.pointerId)
    }
  
    const wasDragging = dragState.current.moved
  
    requestAnimationFrame(() => {
      setIsDragging(false)
    })
  
    dragState.current.moved = false
  }

  /* auto-scroll */
  const autoScrollRef = useRef(null)
  const scrollPosRef = useRef(0)
  const oneSetRef = useRef(0)
  const SPEED = 0.6

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const updateWidths = () => {
      const oneSet = track.scrollWidth / 3
      oneSetRef.current = oneSet
      if (track.scrollLeft === 0 && oneSet > 0) {
        track.scrollLeft = oneSet
        scrollPosRef.current = oneSet
      }
    }

    updateWidths()

    // Recalculate after images/fonts load
    const timeoutId = setTimeout(updateWidths, 800)

    window.addEventListener('resize', updateWidths)
    const observer = new ResizeObserver(updateWidths)
    observer.observe(track)

    const tick = () => {
      const oneSet = oneSetRef.current
      if (oneSet > 0) {
        if (!isPaused && !dragState.current.dragging) {
          scrollPosRef.current += SPEED
          if (scrollPosRef.current >= oneSet * 2) {
            scrollPosRef.current = oneSet
          }
          track.scrollLeft = scrollPosRef.current
        } else {
          scrollPosRef.current = track.scrollLeft
        }
      }
      autoScrollRef.current = requestAnimationFrame(tick)
    }
    autoScrollRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(autoScrollRef.current)
      window.removeEventListener('resize', updateWidths)
      observer.disconnect()
      clearTimeout(timeoutId)
    }
  }, [isPaused])

  /* intersection */
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); setTimeout(() => setGlitchTriggered(true), 300) }
    }, { threshold: 0.1 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');

        @keyframes scanmove {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes credPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .cred-track::-webkit-scrollbar { display: none; }
        .cred-track { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <section
        id="courses"
        ref={sectionRef}
        style={{
          position: 'relative',
          background: '#000',
          padding: 'clamp(60px,8vw,100px) 0',
          overflow: 'hidden',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 100%)',
        }} />

        {/* scan beam */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0, height: '1px',
          background: 'linear-gradient(90deg,transparent,rgba(59,130,246,0.3),transparent)',
          animation: 'scanmove 10s linear infinite',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* scanlines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: 'repeating-linear-gradient(to bottom,transparent 0,transparent 3px,rgba(255,255,255,0.008) 3px,rgba(255,255,255,0.008) 4px)',
        }} />

        {/* glow orbs */}
        <div style={{ position: 'absolute', top: '0%', left: '15%', width: '40vw', height: '40vw', maxWidth: 500, maxHeight: 500, background: 'radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '0%', right: '10%', width: '30vw', height: '30vw', maxWidth: 380, maxHeight: 380, background: 'radial-gradient(circle,rgba(168,85,247,0.05) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'absolute', bottom: '12px', right: 'clamp(12px,3vw,24px)', fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', fontFamily: "'DM Mono', monospace", zIndex: 2, pointerEvents: 'none' }}>
          LATENCY: 0.02MS // SCROLL ON
        </div>

        {/* ── HEADER ── */}
        <div style={{ position: 'relative', zIndex: 10, padding: '0 clamp(16px,5vw,48px)', marginBottom: 'clamp(32px,5vw,56px)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <motion.p
                initial={{ opacity: 0, letterSpacing: '0.6em' }}
                animate={inView ? { opacity: 1, letterSpacing: '0.35em' } : {}}
                transition={{ duration: 0.8 }}
                style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#3B82F6', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>// What made my skills</span>
              </motion.p>
              <h2 style={{ margin: 0, lineHeight: 0.92, letterSpacing: '-0.03em' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,7vw,80px)', color: '#fff' }}>
                  COURSES &
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(28px,7vw,80px)', WebkitTextStroke: '2px rgba(59,130,246,0.8)', color: 'transparent', filter: 'drop-shadow(0 0 28px rgba(59,130,246,0.3))' }}>
                  <ScanReveal text="CERTIFICATIONS" triggered={glitchTriggered} color="#3B82F6" />
                </div>
              </h2>
            </div>

            {/* status badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 16px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: isPaused ? '#f59e0b' : '#22c55e',
                  animation: 'credPulse 2s ease-in-out infinite',
                }} />
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: isPaused ? '#f59e0b' : '#22c55e',
                }} />
              </span>
              <span style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
                {isPaused ? 'Paused' : 'Live Stream'}
              </span>
            </motion.div>
          </div>
        </div>

        {/* ── CAROUSEL TRACK ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* edge fade masks */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 'clamp(16px,4vw,80px)', background: 'linear-gradient(90deg,#000,transparent)', zIndex: 3, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 'clamp(16px,4vw,80px)', background: 'linear-gradient(270deg,#000,transparent)', zIndex: 3, pointerEvents: 'none' }} />

          <div
            ref={trackRef}
            className="cred-track"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
              display: 'flex', gap: '20px',
              overflowX: 'scroll',
              padding: 'clamp(16px,3vw,32px) clamp(16px,5vw,80px)',
              cursor: 'grab',
              perspective: '1000px',
            }}
          >
            {LOOPED.map((course, index) => (
              <CredCard
                key={`${course.id}-${index}`}
                course={course}
                index={index}
                onClick={setInspected}
                isDragging={dragState.current.moved}
              />
            ))}
          </div>
        </div>

        {/* bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to bottom,transparent,#000)', pointerEvents: 'none', zIndex: 2 }} />
      </section>

      <AnimatePresence>
        {inspected && <InspectModal course={inspected} onClose={() => setInspected(null)} />}
      </AnimatePresence>
    </>
  )
}