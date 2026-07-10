'use client';

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const CATEGORIES = ["All", "ML & AI", "DevOps & MLOps", "Backend", "Frontend", "Tools"];

const skills = [
  // ML & AI
  { name: "Python",           icon: "python",               cat: "ML & AI", color: "#3B82F6" },
  { name: "PyTorch",          icon: "pytorch",              cat: "ML & AI", color: "#EE4C2C" },
  { name: "OpenCV",           icon: "opencv",               cat: "ML & AI", color: "#5C3EE8" },
  { name: "NumPy",            icon: "numpy",                cat: "ML & AI", color: "#4DABF7" },
  { name: "Pandas",           icon: "pandas",               cat: "ML & AI", color: "#150458" },
  { name: "Streamlit",        icon: "streamlit",            cat: "ML & AI", color: "#FF4B4B" },
  { name: "FastAPI",          icon: "fastapi",              cat: "ML & AI", color: "#009688" },
  { name: "TensorFlow",       icon: "tensorflow",           cat: "ML & AI", color: "#FF6F00" },
  { name: "Azure AI Foundry", icon: "microsoftazure/white", cat: "ML & AI", color: "#0078D4" },

  // DevOps & MLOps
  { name: "Docker",       icon: "docker",          cat: "DevOps & MLOps", color: "#2496ED" },
  { name: "Kubernetes",   icon: "kubernetes/white",cat: "DevOps & MLOps", color: "#326CE5" },
  { name: "Linux",        icon: "linux",           cat: "DevOps & MLOps", color: "#FCC624" },
  { name: "AWS",          icon: "icloud",          cat:"DevOps & MLOps",  color: "#3B82F6" },
  { name: "Prometheus",   icon: "prometheus",      cat: "DevOps & MLOps", color: "#E6522C" },
  { name: "Grafana",      icon: "grafana",         cat: "DevOps & MLOps", color: "#F46800" },
  { name: "DVC",          icon: "dvc",             cat: "DevOps & MLOps", color: "#945DD6" },
  { name: "MLflow",       icon: "mlflow",          cat: "DevOps & MLOps", color: "#0194E2" },
  { name: "GitHub Actions",icon:"githubactions",   cat: "DevOps & MLOps", color: "#2088FF" },
  { name: "YAML",         icon: "yaml",            cat: "DevOps & MLOps", color: "#CB171E" },

  // Backend
  { name: "Node.js",      icon: "nodedotjs/darkgreen",cat:"Backend",     color: "#339933" },
  { name: "Express.js",   icon: "express/white",   cat: "Backend",       color: "#ffffff" },
  { name: "PostgreSQL",   icon: "postgresql/sky",  cat: "Backend",       color: "#336791" },
  { name: "MongoDB",      icon: "mongodb/darkgreen",cat:"Backend",       color: "#47A248" },
  { name: "JWT",          icon: "jsonwebtokens",    cat: "Backend",       color: "#d63aff" },
  { name: "Flask",        icon: "flask/white",     cat: "Backend",       color: "#ffffff" },

  // Frontend
  { name: "React.js",     icon: "react",           cat: "Frontend",      color: "#61DAFB" },
  { name: "Next.js",      icon: "nextdotjs/white", cat: "Frontend",      color: "#ffffff" },
  { name: "JavaScript",   icon: "javascript",      cat: "Frontend",      color: "#F7DF1E" },
  { name: "Tailwind CSS", icon: "tailwindcss",     cat: "Frontend",      color: "#06B6D4" },
  { name: "Framer Motion",icon: "framer",          cat: "Frontend",      color: "#0055FF" },
  { name: "Swiper.js",    icon: "swiper",          cat: "Frontend",      color: "#6332F6" },

  // Tools
  { name: "Git",          icon: "git",             cat: "Tools",         color: "#F05032" },
  { name: "GitHub",       icon: "github/white",    cat: "Tools",         color: "#ffffff" },
  { name: "Vercel",       icon: "vercel/white",    cat: "Tools",         color: "#ffffff" },
  { name: "NPM",          icon: "npm",             cat: "Tools",         color: "#CB3837" },
];

const catAccents = {
  "All":          "#a3a3a3",
  "ML & AI":      "#3B82F6",
  "DevOps & MLOps":"#E6522C",
  "Backend":      "#22C55E",
  "Frontend":     "#06B6D4",
  "Tools":        "#F59E0B",
};

const catGlyphs = {
  "All":          "◈",
  "ML & AI":      "⬡",
  "DevOps & MLOps":"⚙",
  "Backend":      "⬢",
  "Frontend":     "◇",
  "Tools":        "⌗",
};

function Particle({ seed }) {
  const style = {
    position: "absolute",
    left:  `${(seed * 137.5) % 100}%`,
    top:   `${(seed * 97.3)  % 100}%`,
    width:  `${1 + (seed % 3)}px`,
    height: `${1 + (seed % 3)}px`,
    borderRadius: "50%",
    background: `hsla(${(seed * 47) % 360}, 70%, 70%, 0.18)`,
    animation: `drift-${seed % 3} ${6 + (seed % 6)}s ease-in-out infinite`,
    animationDelay: `${(seed * 0.37) % 4}s`,
    pointerEvents: "none",
  };
  return <span style={style} />;
}

function ScanLine() {
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
      background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
      borderRadius: "inherit",
    }} />
  );
}

function SkillBadge({ skill, index, accent, visible }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.85 }}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 32, scale: 0.85 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      transition={{ delay: index * 0.035, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "7px 14px 7px 10px",
        borderRadius: "8px",
        border: `1px solid ${hovered ? skill.color + "66" : "rgba(255,255,255,0.08)"}`,
        background: hovered
          ? `linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)`
          : "rgba(255,255,255,0.04)",
        cursor: "default",
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(6px)",
        boxShadow: hovered ? `0 0 18px ${skill.color}22, inset 0 0 12px ${skill.color}0a` : "none",
      }}
    >
      {hovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(circle at 20% 50%, ${skill.color}12 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      )}
      {/* color dot */}
      <span style={{
        width: "6px", height: "6px", borderRadius: "50%",
        background: skill.color,
        flexShrink: 0,
        boxShadow: `0 0 6px ${skill.color}`,
        transition: "box-shadow 0.25s",
        ...(hovered ? { boxShadow: `0 0 10px ${skill.color}, 0 0 20px ${skill.color}55` } : {}),
      }} />
      <img
        src={`https://cdn.simpleicons.org/${skill.icon}`}
        alt={skill.name}
        draggable={false}
        style={{
          width: "15px", height: "15px", flexShrink: 0,
          opacity: hovered ? 1 : 0.65,
          filter: hovered ? `drop-shadow(0 0 4px ${skill.color}aa)` : "none",
          transition: "all 0.25s",
        }}
        onError={e => { e.target.style.display = "none"; }}
      />
      <span style={{
        fontSize: "12.5px",
        fontFamily: "'DM Mono', 'JetBrains Mono', monospace",
        fontWeight: 400,
        letterSpacing: "0.01em",
        color: hovered ? "#fff" : "rgba(255,255,255,0.7)",
        transition: "color 0.25s",
        whiteSpace: "nowrap",
      }}>
        {skill.name}
      </span>
    </motion.div>
  );
}

export default function SkillsSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], [40, -20]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [inView, setInView] = useState(false);

  const filteredSkills = activeCategory === "All"
    ? skills
    : skills.filter(s => s.cat === activeCategory);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const accent = catAccents[activeCategory];

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{
        position: "relative",
        background: "#000",
        minHeight: "100vh",
        padding: "80px 24px 100px",
        overflow: "hidden",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        @keyframes drift-0 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(12px,-20px)} }
        @keyframes drift-1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-18px,14px)} }
        @keyframes drift-2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(8px,22px)} }
        @keyframes scanmove {
          0%{transform:translateY(-100%)}
          100%{transform:translateY(100vh)}
        }
        .cat-pill {
          transition: all 0.22s ease;
          cursor: pointer;
          user-select: none;
        }
        .cat-pill:hover { background: rgba(255,255,255,0.08) !important; }
        @media (max-width: 600px) {
          .skills-title { font-size: 13vw !important; }
          .cat-bar { flex-wrap: wrap !important; gap: 6px !important; }
          .skills-grid { gap: 8px !important; }
        }
      `}</style>

      {/* Background particles */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {Array.from({ length: 40 }, (_, i) => <Particle key={i} seed={i + 1} />)}
      </div>

      {/* Moving scan beam */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.35), transparent)",
        animation: "scanmove 8s linear infinite",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* Radial glow center */}
      <div style={{
        position: "absolute",
        top: "30%", left: "50%", transform: "translate(-50%, -50%)",
        width: "600px", height: "400px",
        background: `radial-gradient(ellipse, ${accent}0d 0%, transparent 70%)`,
        pointerEvents: "none", zIndex: 0,
        transition: "background 0.5s ease",
      }} />

      {/* Grid lines bg */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
      }} />

      <ScanLine />

      {/* ── TITLE ────────────────────────── */}
      <motion.div style={{ y: titleY, position: "relative", zIndex: 10, textAlign: "center", marginBottom: "56px" }}>
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={inView ? { opacity: 1, letterSpacing: "0.35em" } : {}}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "10px",
            fontFamily: "'DM Mono', monospace",
            fontWeight: 400,
            color: accent,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            marginBottom: "16px",
            transition: "color 0.4s",
          }}
        >
          ◈ &nbsp; sys.skills.load() &nbsp; ◈
        </motion.p>

        <h2
          className="skills-title"
          style={{
            fontSize: "clamp(32px, 8vw, 100px)",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          UNDER THE
          <br />
          <span style={{
            WebkitTextStroke: `2px ${accent}`,
            color: "transparent",
            transition: "all 0.4s ease",
            filter: `drop-shadow(0 0 30px ${accent}44)`,
          }}>
            HOOD
          </span>
        </h2>

        {/* Rotating gear behind the title */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            rotate,
            width: "260px", height: "260px",
            opacity: 0.045,
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          <img src="/steel-flower.webp" alt="" draggable={false} style={{ width: "100%" }} />
        </motion.div>
      </motion.div>

      {/* ── CATEGORY FILTER ──────────────── */}
      <div className="cat-bar" style={{
        display: "flex", justifyContent: "center", gap: "8px",
        flexWrap: "wrap", position: "relative", zIndex: 10, marginBottom: "44px",
      }}>
        {CATEGORIES.map(cat => {
          const isActive = cat === activeCategory;
          const catColor = catAccents[cat];
          return (
            <motion.button
              key={cat}
              className="cat-pill"
              whileTap={{ scale: 0.94 }}
              onClick={() => setActiveCategory(cat)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "6px 16px",
                borderRadius: "999px",
                border: `1px solid ${isActive ? catColor + "88" : "rgba(255,255,255,0.1)"}`,
                background: isActive ? `${catColor}18` : "rgba(255,255,255,0.04)",
                color: isActive ? catColor : "rgba(255,255,255,0.5)",
                fontSize: "11px",
                fontFamily: "'DM Mono', monospace",
                fontWeight: isActive ? 500 : 400,
                letterSpacing: "0.04em",
                boxShadow: isActive ? `0 0 14px ${catColor}33` : "none",
                outline: "none",
              }}
            >
              <span>{catGlyphs[cat]}</span>
              <span>{cat}</span>
              {isActive && (
                <motion.span
                  layoutId="dot"
                  style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: catColor,
                    boxShadow: `0 0 6px ${catColor}`,
                    marginLeft: "2px",
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ── SKILLS GRID ──────────────────── */}
      <motion.div
        layout
        className="skills-grid"
        style={{
          position: "relative", zIndex: 10,
          display: "flex", flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill, i) => (
            <SkillBadge
              key={skill.name}
              skill={skill}
              index={i}
              accent={catAccents[skill.cat]}
              visible={inView}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ── BOTTOM STATS BAR ─────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{
          position: "relative", zIndex: 10,
          marginTop: "60px",
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Live Projects", value: 5 + '+' },
          // { label: "Categories", value: CATEGORIES.length - 1 },
          { label: "Total Skills", value: Math.round(skills.length / 10) * 10 + '+' }, //round to nearest 10
          { label: "CGPA", value: "8.89" },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "clamp(22px, 4vw, 32px)",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1,
            }}>{value}</div>
            <div style={{
              fontSize: "9px",
              fontFamily: "'DM Mono', monospace",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: "6px",
            }}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* bottom fade out */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "80px",
        background: "linear-gradient(to bottom, transparent, #000)",
        pointerEvents: "none", zIndex: 2,
      }} />
    </section>
  );
}