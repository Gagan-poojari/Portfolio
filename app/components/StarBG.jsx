'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// ─── WebGL canvas star field ───────────────────────────────────────────────
function StarCanvas() {
  const canvasRef = useRef(null);
  const frameRef  = useRef(null);
  const starsRef  = useRef([]);
  const shootersRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return; // fallback to CSS if WebGL unavailable

    // ── shaders ──
    const vsSource = `
      attribute vec2 a_position;
      attribute float a_size;
      attribute float a_brightness;
      uniform vec2 u_resolution;
      varying float v_brightness;
      void main() {
        vec2 clip = (a_position / u_resolution) * 2.0 - 1.0;
        gl_Position = vec4(clip * vec2(1, -1), 0, 1);
        gl_PointSize = a_size;
        v_brightness = a_brightness;
      }
    `;
    const fsSource = `
      precision mediump float;
      varying float v_brightness;
      uniform float u_time;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float dist = length(uv);
        if (dist > 0.5) discard;
        float alpha = (1.0 - dist * 2.0) * v_brightness;
        gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
      }
    `;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s); return s;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(prog); gl.useProgram(prog);

    const aPos  = gl.getAttribLocation(prog, 'a_position');
    const aSize = gl.getAttribLocation(prog, 'a_size');
    const aBri  = gl.getAttribLocation(prog, 'a_brightness');
    const uRes  = gl.getUniformLocation(prog, 'u_resolution');
    const uTime = gl.getUniformLocation(prog, 'u_time');

    let W, H, stars;

    function initStars() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      const count = Math.floor((W * H) / 900);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() < 0.07 ? 2.8 + Math.random() * 1.4
             : Math.random() < 0.25 ? 1.8 + Math.random() * 0.8
             : 0.8 + Math.random() * 0.8,
        baseBri: 0.35 + Math.random() * 0.65,
        twinkleSpeed: 0.4 + Math.random() * 2.2,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleAmp: 0.08 + Math.random() * 0.28,
      }));
      starsRef.current = stars;
    }

    initStars();
    window.addEventListener('resize', initStars);

    // shooting star state
    let shooters = [];
    shootersRef.current = shooters;

    function spawnShooter() {
      shooters.push({
        x: Math.random() * W * 1.3,
        y: -20,
        vx: -(3 + Math.random() * 4),
        vy: 2.5 + Math.random() * 3,
        life: 1,
        decay: 0.012 + Math.random() * 0.01,
        length: 80 + Math.random() * 120,
      });
    }

    let lastShoot = 0;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    let t = 0;
    function render() {
      t += 0.016;
      gl.viewport(0, 0, W, H);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uTime, t);

      // build star buffers
      const pos = new Float32Array(stars.length * 2);
      const siz = new Float32Array(stars.length);
      const bri = new Float32Array(stars.length);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const twinkle = Math.sin(t * s.twinkleSpeed + s.twinklePhase) * s.twinkleAmp;
        pos[i * 2]     = s.x;
        pos[i * 2 + 1] = s.y;
        siz[i] = s.size;
        bri[i] = Math.max(0, Math.min(1, s.baseBri + twinkle));
      }

      const posBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const sizBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, sizBuf);
      gl.bufferData(gl.ARRAY_BUFFER, siz, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aSize);
      gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0);

      const briBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, briBuf);
      gl.bufferData(gl.ARRAY_BUFFER, bri, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aBri);
      gl.vertexAttribPointer(aBri, 1, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, stars.length);

      // cleanup
      gl.deleteBuffer(posBuf);
      gl.deleteBuffer(sizBuf);
      gl.deleteBuffer(briBuf);

      // shooting stars (Canvas2D overlay handles these - see below)
      if (t - lastShoot > 3.5 + Math.random() * 4) {
        spawnShooter();
        lastShoot = t;
      }

      frameRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', initStars);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
}

// ─── shooting stars (Canvas 2D) ───────────────────────────────────────────
function ShootingStars() {
  const canvasRef = useRef(null);
  const frameRef  = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let shooters = [];
    let lastSpawn = 0;

    function render(ts) {
      ctx.clearRect(0, 0, W, H);

      if (ts - lastSpawn > (3500 + Math.random() * 5000)) {
        shooters.push({
          x: Math.random() * W * 1.4,
          y: -10,
          vx: -(4 + Math.random() * 5),
          vy: 2 + Math.random() * 3.5,
          life: 1,
          length: 90 + Math.random() * 130,
        });
        lastSpawn = ts;
      }

      shooters = shooters.filter(s => s.life > 0);
      for (const s of shooters) {
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.014;

        const alpha = s.life * 0.85;
        const tailX = s.x - (s.vx / Math.hypot(s.vx, s.vy)) * s.length;
        const tailY = s.y - (s.vy / Math.hypot(s.vx, s.vy)) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.6, `rgba(180,210,255,${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(255,255,255,${alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // tip glow
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(render);
    }

    frameRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: 'block' }}
    />
  );
}

// ─── nebula / depth glows ─────────────────────────────────────────────────
function NebulaLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Deep blue cluster */}
      <div
        className="absolute rounded-full opacity-[0.07]"
        style={{
          width: '60vw', height: '50vh',
          top: '10%', left: '-10%',
          background: 'radial-gradient(ellipse, #297bc9 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Red cluster */}
      <div
        className="absolute rounded-full opacity-[0.06]"
        style={{
          width: '50vw', height: '45vh',
          top: '5%', right: '-5%',
          background: 'radial-gradient(ellipse, #c7061c 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />
      {/* Center pale blue depth */}
      <div
        className="absolute rounded-full opacity-[0.04]"
        style={{
          width: '40vw', height: '40vh',
          top: '30%', left: '30%',
          background: 'radial-gradient(ellipse, #a0c4f0 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  );
}

// ─── main export ──────────────────────────────────────────────────────────
function StarsBackground({
  children,
  className,
  factor = 0.04,
  transition = { stiffness: 40, damping: 22 },
  pointerEvents = true,
  starColor = '#fff',
  ...props
}) {
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const springX = useSpring(offsetX, transition);
  const springY = useSpring(offsetY, transition);

  const handleMouseMove = useCallback((e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    offsetX.set(-(e.clientX - cx) * factor);
    offsetY.set(-(e.clientY - cy) * factor);
  }, [offsetX, offsetY, factor]);

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden',
        className
      )}
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0a0e1a 0%, #000005 60%, #000000 100%)' }}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {/* Nebula behind stars */}
      <NebulaLayer />

      {/* Stars - parallax wrapper */}
      <motion.div
        className={cn('absolute inset-0', pointerEvents ? '' : 'pointer-events-none')}
        style={{ x: springX, y: springY }}
      >
        <StarCanvas />
      </motion.div>

      {/* Shooting stars - no parallax, full screen */}
      <ShootingStars />

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

export { StarsBackground };