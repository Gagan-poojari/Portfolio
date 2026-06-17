'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// ─── DATA ────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: 'ruva',
    num: '01',
    title: 'RUVA',
    sub: 'Full-Stack E-Commerce',
    tagline: 'Traditional Indian ethnic wear - from catalogue to checkout, fully yours.',
    liveHref: 'https://ruvaonline.com/',
    githubHref: 'https://github.com/Gagan-poojari/ruva',
    image: '/projects/ruva.png',
    cat: 'Full-Stack',
    accent: '#DB2777',
    stack: ['Next.js', 'React', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Razorpay', 'Cloudinary', 'Tailwind CSS', 'Google OAuth', 'Gemini AI', 'EmailJS'],
    bullets: [
      'Product catalog, category browsing, cart, wishlist, and user profiles with complete order history.',
      'RESTful APIs with JWT auth, Google OAuth sign-in, and Razorpay payments with server-side verification.',
      'Admin dashboard with Cloudinary image uploads and Google Gemini AI auto-generating product descriptions.',
      'Hardened with rate limiting, CORS policies, and request validation; EmailJS for live order notifications.',
    ],
  },
  {
    id: 'pleeb',
    num: '02',
    title: 'Pleeb',
    sub: 'AI Video Auto-Censorship',
    tagline: 'Transcribes, detects profanity, and bleeps it - frame-accurate, every time.',
    liveHref: 'https://pleeb-meme-the-mess.streamlit.app/',
    githubHref: 'https://github.com/Gagan-poojari/pleeb',
    image: '/projects/pleeb.png',
    cat: 'ML & AI',
    accent: '#0194E2',
    stack: ['Python', 'FastAPI', 'Whisper', 'FFmpeg', 'MoviePy', 'Pydub', 'Next.js', 'SQLAlchemy', 'SSE', 'REST API'],
    bullets: [
      'AI-powered video censorship: transcribes speech with word-level timestamps, detects profanity, replaces flagged words with bleep/meme audio in perfect sync.',
      'FastAPI backend with background job processing and SSE progress streaming for the full upload → process → download pipeline.',
      'Whisper-timestamped for precise detection with normalization, lemmatization, n-gram detection, and confidence gating to eliminate false positives.',
      'Duration-based meme audio selection, volume matching, and lossless WAV processing for frame-accurate censorship timing.',
    ],
  },
  {
    id: 'mlops',
    num: '03',
    title: 'MLOps Pipeline',
    sub: 'End-to-End Sentiment Analysis',
    tagline: 'Production-grade NLP pipeline - from raw IMDB data to live predictions.',
    liveHref: 'https://github.com/Gagan-poojari/sentiment-mlops',
    githubHref: 'https://github.com/Gagan-poojari/sentiment-mlops',
    image: '/projects/mlops.png',
    cat: 'MLOps',
    accent: '#F97316',
    stack: ['Python', 'scikit-learn', 'NLTK', 'DVC', 'MLflow', 'DagsHub', 'Flask', 'Prometheus', 'GitHub Actions', 'AWS S3', 'pandas', 'NumPy'],
    bullets: [
      'End-to-end NLP pipeline for binary sentiment classification on IMDB data, serving real-time predictions via Flask UI.',
      'Fully reproducible ML workflow with DVC and MLflow on DagsHub for experiment tracking and Staging-to-Production model promotion.',
      'Automated CI with GitHub Actions - running dvc repro, unit tests, and conditional model promotion on every push.',
      'Prometheus counters and histograms for request volume, latency, and prediction distribution monitoring.',
    ],
  },
  {
    id: 'nammabenaka',
    num: '04',
    title: 'Namma Benaka',
    sub: 'Loan Management Platform',
    tagline: 'End-to-end fintech - from borrower onboarding to automated late-fee crons.',
    liveHref: 'https://www.nammabenaka.in/',
    githubHref: 'https://github.com/Gagan-poojari/',
    image: '/projects/nammabenaka.png',
    cat: 'Full-Stack',
    accent: '#F97316',
    stack: ['Next.js', 'React', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Tailwind CSS', 'Recharts', 'Node-Cron', 'bcrypt'],
    bullets: [
      'Full loan management platform: borrower onboarding, loan issuance, repayment tracking, Admin and Manager portals.',
      'REST APIs with JWT authentication, role-based authorization, and bcrypt-secured credentials.',
      'Full loan lifecycle: repayment schedules, payment recording, outstanding balance calculations, automated late-fee crons.',
      'Rich Recharts dashboards for portfolio overview, collections, overdue loans, and audit logs.',
    ],
  },
  {
    id: 'holmac',
    num: '05',
    title: 'HOLMAC Interiors',
    sub: 'Interior Design Portfolio',
    tagline: 'Cinematic entry video, Cloudinary galleries, and every lead captured.',
    liveHref: 'https://www.holmacinterior.com/',
    githubHref: 'https://github.com/Gagan-poojari/holmac_interior',
    image: '/projects/holmac.png',
    cat: 'Frontend',
    accent: '#F59E0B',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Cloudinary', 'EmailJS', 'Google Analytics', 'Framer Motion'],
    bullets: [
      'Multi-page marketing site with hero sections, service highlights, product catalogs, and client testimonials.',
      'Category-based Cloudinary image/video galleries with scroll-triggered animations.',
      'Network-aware branded entrance video that adapts quality based on connection speed.',
      'EmailJS lead capture, EMI calculator, WhatsApp click-to-chat, SEO metadata, and Analytics conversion tracking.',
    ],
  },
  {
    id: 'fice',
    num: '06',
    title: 'FICE',
    sub: 'Institute Enrollment Website',
    tagline: 'Dynamic course pages, query-param registration, and silky Framer carousels.',
    liveHref: 'https://www.fortuneudupi.in/',
    githubHref: 'https://github.com/Gagan-poojari/fice',
    image: '/projects/fice.png',
    cat: 'Frontend',
    accent: '#4F6EF7',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Swiper.js', 'EmailJS', 'next/image'],
    bullets: [
      'Responsive marketing site - course catalog, faculty highlights, student testimonials, and institute info.',
      'Next.js App Router with dynamic course detail pages, query-parameter registration, and EmailJS enrollment forms.',
      'Swiper carousels, Framer Motion scroll animations, and mobile hamburger nav with smooth in-page scrolling.',
    ],
  },
  {
    id: 'ledgerflow',
    num: '07', 
    title: 'LedgerFlow',
    sub: 'AP Automation Platform',
    tagline: 'Enterprise-grade accounts payable—from hybrid OCR capture to multi-level approvals and payments.',
    liveHref: 'https://github.com/Gagan-poojari/LedgerFlow', 
    githubHref: 'https://github.com/Gagan-poojari/LedgerFlow',
    image: '/projects/ledgerflow.png',
    cat: 'Full-Stack',
    accent: '#14B8A6',
    stack: ['Next.js', 'React', 'MongoDB', 'Mongoose', 'JWT', 'Tesseract.js', 'Gemini AI', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'Nodemailer'],
    bullets: [
      'Intelligent hybrid OCR pipeline running local Tesseract.js on images and fallback to Google Gemini Vision API for complex PDFs and low-confidence scans.',
      'Robust financial engine processing 2-way and 3-way matching rules against POs and GRNs within a strict ±₹2 / 2% tolerance threshold.',
      'Localized compliance framework validating 15-character Indian GSTINs using a custom reverse mod-36 checksum calculation.',
      'Dynamic multi-level approval matrix mapping thresholds (L1, L2, CFO) with automated SLA escalations and payment queue generation.',
    ],
  },
  {
    id: 'sufh',
    num: '08',
    title: 'Sri Udupi Food Hub',
    sub: 'Restaurant & Digital Menu',
    tagline: 'A flipbook menu, coverflow hero, and the soul of Udupi on every screen.',
    liveHref: 'https://github.com/Gagan-poojari/Sri-Udupi-Food-Hub/tree/main',
    githubHref: 'https://github.com/Gagan-poojari/Sri-Udupi-Food-Hub/tree/main',
    image: '/projects/sufh.png',
    cat: 'Frontend',
    accent: '#22C55E',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Swiper.js', 'react-pageflip', 'Framer Motion'],
    bullets: [
      'Fully responsive restaurant site - hero carousel, category-based menu browsing, and anchor navigation.',
      'Interactive flipbook-style digital menu using react-pageflip with JSON-driven categories and prices.',
      'Swiper.js coverflow hero with autoplay and pagination; custom gradients for desktop and mobile.',
    ],
  },
  {
    id: 'portfolio',
    num: '09',
    title: 'Portfolio',
    sub: 'This Very Website',
    tagline: 'Let the world know about me!',
    liveHref: '/',
    githubHref: 'https://github.com/Gagan-poojari/',
    image: '/projects/portfolio.png',
    cat: 'Frontend',
    accent: '#A855F7',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'EmailJS'],
    bullets: [
      'Cinematic dark experience - scanline effects, particle systems, rotating parallax elements, scroll-driven animations.',
      'Custom sections with per-category glow accents, animated badge grid, and stat counters.',
      'Horizontal scroll project section with drag support, animated detail panels, and category filtering.',
    ],
  },
  // {
  //   id: 'nn',
  //   num: '09',
  //   title: 'Neural Net from Scratch',
  //   sub: 'NumPy-only Digit Classifier',
  //   tagline: 'Backprop, gradient descent, 90% accuracy - zero ML libraries.',
  //   liveHref: 'https://github.com/Gagan-poojari/',
  //   githubHref: 'https://github.com/Gagan-poojari/',
  //   image: '/projects/nn.png',
  //   cat: 'ML & AI',
  //   accent: '#14B8A6',
  //   stack: ['Python', 'NumPy', 'Matplotlib', 'MNIST'],
  //   bullets: [
  //     'Handwritten digit classifier from scratch using only NumPy - no TensorFlow, no PyTorch.',
  //     'Implemented forward pass, backpropagation, and gradient descent manually from first principles.',
  //     'Achieved 90% test accuracy on MNIST, validating against industry-standard benchmarks.',
  //   ],
  // },
];

const CATS = ['All', 'Full-Stack', 'ML & AI', 'MLOps', 'Frontend'];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function hex2rgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// ─── PROJECT ROW ─────────────────────────────────────────────────────────────

function ProjectRow({ project, index, isExpanded, onToggle }) {
  const { num, title, sub, tagline, accent, stack, bullets, liveHref, githubHref } = project;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden"
    >
      {/* Divider */}
      <div
        className="w-full h-px mb-0"
        style={{ background: `linear-gradient(90deg, transparent, ${hex2rgba(accent, 0.18)}, transparent)` }}
      />

      <div
        className={`
          group relative flex flex-col md:flex-row items-stretch gap-0
          transition-all duration-500 cursor-pointer
          ${isExpanded ? 'bg-[rgba(255,255,255,0.025)]' : 'hover:bg-[rgba(255,255,255,0.018)]'}
          ${isEven ? '' : 'md:flex-row-reverse'}
        `}
        onClick={onToggle}
      >
        {/* ── Project Number (large ghost) */}
        <div
          className="absolute select-none pointer-events-none font-black leading-none z-0 overflow-hidden"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(80px, 14vw, 160px)',
            color: hex2rgba(accent, isExpanded ? 0.07 : 0.04),
            top: '50%',
            transform: 'translateY(-50%)',
            ...(isEven ? { right: '0.5rem' } : { left: '0.5rem' }),
            transition: 'color 0.4s',
            maxHeight: '100%',
            lineHeight: 1,
          }}
        >
          {num}
        </div>

        {/* Placeholder Visual pane */}
        {/* <div className={`relative md:w-[48%] w-full flex-shrink-0 overflow-hidden`}
          style={{ minHeight: '280px', aspectRatio: '16/10' }}>
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-700 group-hover:scale-[1.03]"
            style={{
              background: `radial-gradient(ellipse at 40% 50%, ${hex2rgba(accent, 0.15)}, transparent 70%), linear-gradient(135deg, #0a0a0a 0%, #111 100%)`,
            }}
          >
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `linear-gradient(${hex2rgba(accent, 0.15)} 1px, transparent 1px), linear-gradient(90deg, ${hex2rgba(accent, 0.15)} 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
              }}
            />
            <span
              className="relative z-10 font-black tracking-tighter select-none"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(52px, 8vw, 96px)',
                color: hex2rgba(accent, 0.22),
                letterSpacing: '-0.04em',
              }}
            >
              {title.slice(0, 3).toUpperCase()}
            </span>
          </div>

          <div className="absolute top-4 left-4 z-20">
            <span
              className="text-[9px] font-mono tracking-[0.2em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm border"
              style={{
                color: accent,
                borderColor: hex2rgba(accent, 0.3),
                background: hex2rgba(accent, 0.1),
              }}
            >
              {project.cat}
            </span>
          </div>
          
          <div
            className={`absolute top-0 bottom-0 w-[2px] transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`}
            style={{
              background: `linear-gradient(to bottom, transparent, ${accent}, transparent)`,
              [isEven ? 'right' : 'left']: 0,
            }}
          />
        </div> */}
        {/* ── Visual pane */}
<div
  className="relative md:w-[48%] w-full flex-shrink-0 overflow-hidden bg-black"
  style={{ minHeight: '320px' }}
>
  <motion.div
    className="absolute inset-0"
    whileHover={{ scale: 1.04 }}
    transition={{ duration: 0.7 }}
  >
    <Image
      src={project.image}
      alt={title}
      fill
      className="object-cover"
    />
  </motion.div>

  {/* dark overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

  {/* accent glow */}
  <div
    className="absolute inset-0"
    style={{
      background: `linear-gradient(
        135deg,
        ${hex2rgba(accent, 0.15)},
        transparent 45%
      )`,
    }}
  />

  {/* category */}
  <div className="absolute top-5 left-5 z-20">
    <span
      className="text-[9px] font-mono tracking-[0.2em] uppercase px-3 py-1.5 rounded-full backdrop-blur-md border"
      style={{
        color: accent,
        borderColor: hex2rgba(accent, 0.35),
        background: hex2rgba(accent, 0.15),
      }}
    >
      {project.cat}
    </span>
  </div>

  {/* project number */}
  <div
    className="absolute bottom-4 right-5 z-20 font-black"
    style={{
      fontFamily: "'Syne', sans-serif",
      fontSize: '70px',
      color: hex2rgba(accent, 0.18),
      lineHeight: 1,
    }}
  >
    {num}
  </div>

  {/* accent edge */}
  <div
    className={`absolute top-0 bottom-0 w-[2px] ${
      isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'
    }`}
    style={{
      background: `linear-gradient(to bottom, transparent, ${accent}, transparent)`,
      [isEven ? 'right' : 'left']: 0,
    }}
  />
</div>

        {/* ── Content pane */}
        <div className={`relative z-10 flex-1 min-w-0 flex flex-col justify-center px-8 md:px-12 py-10 md:py-14 overflow-hidden`}>
          <p
            className="text-[9px] font-mono tracking-[0.28em] uppercase mb-3"
            style={{ color: hex2rgba(accent, 0.7) }}
          >
            Project {num} &nbsp;·&nbsp; {sub}
          </p>

          <h3
            className="font-black leading-[0.92] tracking-tight mb-4 break-words min-w-0"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(28px, 3.5vw, 52px)',
            }}
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, #fff, ${hex2rgba(accent, 0.9)})`,
              }}
            >
              {title}
            </span>
          </h3>

          <p className="text-[13px] text-white/50 leading-relaxed mb-6 max-w-md">{tagline}</p>

          {/* Stack pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {stack.slice(0, 6).map(s => (
              <span
                key={s}
                className="text-[9.5px] font-mono px-2.5 py-1 rounded border transition-all duration-300"
                style={{
                  color: isExpanded ? accent : 'rgba(255,255,255,0.4)',
                  borderColor: isExpanded ? hex2rgba(accent, 0.3) : 'rgba(255,255,255,0.1)',
                  background: isExpanded ? hex2rgba(accent, 0.07) : 'transparent',
                }}
              >
                {s}
              </span>
            ))}
            {stack.length > 6 && (
              <span className="text-[9.5px] font-mono px-2.5 py-1 rounded border border-white/10 text-white/25">
                +{stack.length - 6}
              </span>
            )}
          </div>

          {/* Live + GitHub buttons */}
          <div className="flex gap-2 flex-wrap mb-5">
            <Link
              href={liveHref}
              target="_blank"
              onClick={e => e.stopPropagation()}
              className="text-[9.5px] font-mono tracking-[0.15em] uppercase px-4 py-2 rounded-lg border transition-all duration-200 hover:scale-[1.03]"
              style={{
                color: accent,
                borderColor: hex2rgba(accent, 0.35),
                background: hex2rgba(accent, 0.1),
              }}
            >
              View Live ↗
            </Link>
            <Link
              href={githubHref}
              target="_blank"
              onClick={e => e.stopPropagation()}
              className="text-[9.5px] font-mono tracking-[0.15em] uppercase px-4 py-2 rounded-lg border border-white/15 bg-white/[0.04] text-white/55 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
            >
              GitHub →
            </Link>
          </div>

          {/* Expand toggle */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 rounded-full border flex items-center justify-center text-sm flex-shrink-0"
              style={{
                borderColor: isExpanded ? accent : 'rgba(255,255,255,0.15)',
                color: isExpanded ? accent : 'rgba(255,255,255,0.4)',
                background: isExpanded ? hex2rgba(accent, 0.1) : 'transparent',
              }}
            >
              +
            </motion.div>
            <span
              className="text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-300"
              style={{ color: isExpanded ? accent : 'rgba(255,255,255,0.3)' }}
            >
              {isExpanded ? 'Collapse' : 'View Details'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Expanded Detail Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div
              className="px-8 md:px-16 py-8 md:py-12 grid md:grid-cols-2 gap-10"
              style={{
                borderTop: `1px solid ${hex2rgba(accent, 0.12)}`,
                background: `linear-gradient(to bottom, ${hex2rgba(accent, 0.04)}, transparent)`,
              }}
            >
              {/* Bullets */}
              <div>
                <p className="text-[9px] font-mono tracking-[0.25em] uppercase mb-4" style={{ color: hex2rgba(accent, 0.6) }}>
                  What I built
                </p>
                <ul className="flex flex-col gap-4">
                  {bullets.map((b, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                      className="flex gap-3 items-start text-[13px] leading-relaxed text-white/55"
                    >
                      <span
                        className="w-[5px] h-[5px] rounded-full mt-[6px] shrink-0"
                        style={{ background: accent }}
                      />
                      <span>{b}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Stack + Links */}
              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-[9px] font-mono tracking-[0.25em] uppercase mb-4" style={{ color: hex2rgba(accent, 0.6) }}>
                    Full Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {stack.map((s, i) => (
                      <motion.span
                        key={s}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                        className="text-[10px] font-mono px-3 py-1.5 rounded-md border"
                        style={{
                          color: accent,
                          borderColor: hex2rgba(accent, 0.25),
                          background: hex2rgba(accent, 0.07),
                        }}
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[9px] font-mono tracking-[0.25em] uppercase mb-4" style={{ color: hex2rgba(accent, 0.6) }}>
                    Links
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <Link
                      href={liveHref}
                      target="_blank"
                      onClick={e => e.stopPropagation()}
                      className="text-[10px] font-mono tracking-wider uppercase px-5 py-2.5 rounded-lg border transition-all duration-200 hover:scale-[1.03]"
                      style={{
                        color: accent,
                        borderColor: hex2rgba(accent, 0.35),
                        background: hex2rgba(accent, 0.1),
                      }}
                    >
                      View Live ↗
                    </Link>
                    <Link
                      href={githubHref}
                      target="_blank"
                      onClick={e => e.stopPropagation()}
                      className="text-[10px] font-mono tracking-wider uppercase px-5 py-2.5 rounded-lg border border-white/15 bg-white/[0.04] text-white/55 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                    >
                      GitHub →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom divider */}
      <div
        className="w-full h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${hex2rgba(accent, 0.18)}, transparent)` }}
      />
    </motion.div>
  );
}

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────

export default function ProjectSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const visible = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.cat === activeFilter);

  const handleToggle = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <section id="projects" className="relative bg-black py-24 overflow-hidden">

      {/* Background grid atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      {/* ── Header */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center px-6 mb-14"
      >
        <p className="text-[9px] tracking-[0.4em] uppercase text-white/25 mb-5 font-mono">
          ◈ &nbsp; Selected Work &nbsp; ◈
        </p>
        <h2
          className="font-black leading-[0.88] tracking-tight"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(56px, 10vw, 110px)',
            color: '#fff',
          }}
        >
          MY<br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(90deg, #F97316, #DB2777, #A855F7, #0194E2)' }}
          >
            PROJECTS
          </span>
        </h2>
        <p className="mt-5 text-[10px] font-mono tracking-widest text-white/20 uppercase">
          Click any row to expand &nbsp;·&nbsp; {PROJECTS.length + 1}+ projects
        </p>
      </motion.div>

      {/* ── Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative z-10 flex justify-center gap-2 flex-wrap px-6 mb-14"
      >
        {CATS.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveFilter(cat); setExpandedId(null); }}
            className="text-[10px] font-mono tracking-[0.2em] uppercase px-4 py-2 rounded-full border transition-all duration-200 outline-none"
            style={{
              borderColor: activeFilter === cat ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
              background: activeFilter === cat ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
              color: activeFilter === cat ? '#fff' : 'rgba(255,255,255,0.4)',
            }}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* ── Project rows */}
      <div className="relative z-10 max-w-7xl mx-auto px-0 md:px-6">
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={index}
              isExpanded={expandedId === project.id}
              onToggle={() => handleToggle(project.id)}
            />
          ))}
        </AnimatePresence>
      </div>

    </section>
  );
}