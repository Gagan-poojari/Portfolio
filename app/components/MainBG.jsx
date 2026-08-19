'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

// ── Dense circuit dust — cyan/white pixel specks scattered everywhere,
//    with a few tighter dot-grid clusters (top-left / top-right / edges),
//    matching the reference art's "data field" texture ──────────────────
function CircuitDust() {
    const canvasRef = useRef(null);
    const frameRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H, dots, clusters;

        function rand(min, max) { return min + Math.random() * (max - min); }

        function makeClusters() {
            // small rectangular dot-grid patches, faint, static-ish
            const spots = [
                { x: 0.02, y: 0.05, w: 0.09, h: 0.14 },
                { x: 0.0, y: 0.32, w: 0.07, h: 0.1 },
                { x: 0.68, y: 0.15, w: 0.1, h: 0.14 },
                { x: 0.92, y: 0.08, w: 0.07, h: 0.18 },
                { x: 0.9, y: 0.55, w: 0.09, h: 0.16 },
                { x: 0.24, y: 0.4, w: 0.06, h: 0.05 },
            ];
            return spots.map((s) => {
                const gx = s.x * W, gy = s.y * H, gw = s.w * W, gh = s.h * H;
                const pts = [];
                const step = 9;
                for (let x = gx; x < gx + gw; x += step) {
                    for (let y = gy; y < gy + gh; y += step) {
                        if (Math.random() < 0.55) {
                            pts.push({ x: x + rand(-1.5, 1.5), y: y + rand(-1.5, 1.5), a: rand(0.05, 0.22) });
                        }
                    }
                }
                return pts;
            }).flat();
        }

        function makeDots() {
            const count = Math.max(70, Math.floor((W * H) / 16000));
            const arr = [];
            for (let i = 0; i < count; i++) {
                const isRed = Math.random() < 0.06;
                arr.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    r: rand(0.5, 1.3),
                    baseA: rand(0.08, 0.4),
                    speed: rand(0.3, 1.1),
                    phase: rand(0, Math.PI * 2),
                    color: isRed ? '199,60,60' : '150,220,235',
                });
            }
            return arr;
        }

        function resize() {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
            dots = makeDots();
            clusters = makeClusters();
        }
        resize();
        window.addEventListener('resize', resize);

        let t = 0;
        function render() {
            t += 0.012;
            ctx.clearRect(0, 0, W, H);

            // static-ish cluster dots (very faint twinkle)
            for (const p of clusters) {
                const a = p.a * (0.7 + 0.3 * Math.sin(t * 1.5 + p.x * 0.1));
                ctx.fillStyle = `rgba(120,210,230,${a})`;
                ctx.fillRect(p.x, p.y, 1.4, 1.4);
            }

            // roaming twinkling specks
            for (const d of dots) {
                const a = d.baseA * (0.4 + 0.6 * Math.sin(t * d.speed + d.phase));
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${d.color},${a})`;
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

// ── Very subtle animated film grain ─────────────────────────────────────
function Grain() {
    const canvasRef = useRef(null);
    const frameRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = (canvas.width = 160);
        const H = (canvas.height = 160);
        const imageData = ctx.createImageData(W, H);

        let last = 0;
        function draw(ts) {
            if (ts - last > 60) {
                last = ts;
                const buf = imageData.data;
                for (let i = 0; i < buf.length; i += 4) {
                    const v = Math.random() * 255;
                    buf[i] = buf[i + 1] = buf[i + 2] = v;
                    buf[i + 3] = 12;
                }
                ctx.putImageData(imageData, 0, 0);
            }
            frameRef.current = requestAnimationFrame(draw);
        }
        frameRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frameRef.current);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay"
            style={{ imageRendering: 'pixelated', opacity: 0.5 }}
        />
    );
}

// ── Rising smoke/nebula columns — red (left-of-center) & blue (right-of-
//    center), built from animated SVG turbulence masked over a color
//    gradient so they roil and drift like real smoke, not a static blob ──
function SmokeColumn({ side, color, seed }) {
    const filterId = `smoke-turb-${side}`;
    const gradId = `smoke-grad-${side}`;
    const left = side === 'left' ? '20%' : '56%';

    return (
        <svg
            className="absolute inset-0 w-full h-full"
            style={{ mixBlendMode: 'screen' }}
            preserveAspectRatio="none"
        >
            <defs>
                <filter id={filterId} x="-60%" y="-60%" width="220%" height="220%">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.006 0.016"
                        numOctaves={4}
                        seed={seed}
                        result="turb"
                    >
                        <animate
                            attributeName="baseFrequency"
                            values="0.005 0.014;0.009 0.020;0.005 0.014"
                            dur="22s"
                            repeatCount="indefinite"
                        />
                    </feTurbulence>
                    <feColorMatrix
                        in="turb"
                        type="matrix"
                        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 3.2 -1.3"
                        result="alphaShape"
                    />
                    <feComposite in="alphaShape" in2="SourceGraphic" operator="in" />
                </filter>
                <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={color} stopOpacity="0.6" />
                    <stop offset="40%" stopColor={color} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <rect
                x={left}
                y="0"
                width="22%"
                height="100%"
                fill={`url(#${gradId})`}
                filter={`url(#${filterId})`}
            />
        </svg>
    );
}

// ── Cracked reflective floor with red/blue light pools ──────────────────
function CrackedFloor() {
    const canvasRef = useRef(null);

    const cracks = useMemo(() => {
        // deterministic-ish crack branches for both pools
        function branch(cx, cy, count) {
            const lines = [];
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const len = 30 + Math.random() * 70;
                let x = cx, y = cy;
                const segs = 3 + Math.floor(Math.random() * 3);
                for (let s = 0; s < segs; s++) {
                    const a = angle + (Math.random() - 0.5) * 1.2;
                    const l = len / segs;
                    const nx = x + Math.cos(a) * l;
                    const ny = y + Math.sin(a) * l * 0.35; // flatten for floor perspective
                    lines.push([x, y, nx, ny]);
                    x = nx; y = ny;
                }
            }
            return lines;
        }
        return { red: branch(0.28, 0.5, 10), blue: branch(0.72, 0.5, 10) };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function draw() {
            const W = (canvas.width = canvas.offsetWidth);
            const H = (canvas.height = canvas.offsetHeight);
            ctx.clearRect(0, 0, W, H);

            const drawSet = (lines, color) => {
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                for (const [x1, y1, x2, y2] of lines) {
                    ctx.beginPath();
                    ctx.moveTo(x1 * W, y1 * H);
                    ctx.lineTo(x2 * W, y2 * H);
                    ctx.stroke();
                }
            };
            drawSet(cracks.red, 'rgba(255,120,110,0.16)');
            drawSet(cracks.blue, 'rgba(110,170,255,0.16)');
        }
        draw();
        window.addEventListener('resize', draw);
        return () => window.removeEventListener('resize', draw);
    }, [cracks]);

    return (
        <div className="absolute bottom-0 left-0 w-full h-[34%] pointer-events-none overflow-hidden">
            {/* floor plane tint */}
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(5,6,8,0.4) 100%)' }}
            />
            {/* light pools reflected on the ground */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: '30vw', height: '16vh', left: '14%', bottom: '-6%',
                    background: 'radial-gradient(ellipse, rgba(255,40,40,0.35) 0%, rgba(255,40,40,0.08) 45%, transparent 75%)',
                    filter: 'blur(18px)',
                }}
                animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: '30vw', height: '16vh', left: '58%', bottom: '-6%',
                    background: 'radial-gradient(ellipse, rgba(60,140,255,0.35) 0%, rgba(60,140,255,0.08) 45%, transparent 75%)',
                    filter: 'blur(18px)',
                }}
                animate={{ opacity: [1, 0.7, 1], scale: [1.05, 1, 1.05] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
}

// ── Ambient red/blue bleed in the corners (kept from original, softened) ─
function AmbientBleed() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: '38vw', height: '55vh', bottom: '-15%', left: '-10%',
                    background: 'radial-gradient(circle, rgba(199,6,28,0.08) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
                animate={{ opacity: [0.5, 0.85, 0.5] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: '38vw', height: '55vh', top: '-15%', right: '-10%',
                    background: 'radial-gradient(circle, rgba(41,123,201,0.08) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
                animate={{ opacity: [0.85, 0.5, 0.85] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
        </div>
    );
}

// ── Faint corner HUD readouts + circuit brackets ─────────────────────────
function CornerDetail() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden font-mono">
            {/* dot-grid corner */}
            <div
                className="absolute bottom-0 left-0 w-56 h-56 opacity-[0.1]"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                    maskImage: 'radial-gradient(circle at 0% 100%, black 0%, transparent 75%)',
                    WebkitMaskImage: 'radial-gradient(circle at 0% 100%, black 0%, transparent 75%)',
                }}
            />
            {/* red hairline bars, top-left */}
            <div className="absolute top-[10%] left-[7%] flex gap-1 opacity-40">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-px"
                        style={{ height: 90 + i * 10, background: 'linear-gradient(to bottom, rgba(255,60,60,0.55), transparent)' }}
                        animate={{ opacity: [0.25, 0.6, 0.25] }}
                        transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                    />
                ))}
            </div>

            {/* HUD text readout, top-right */}
            <div className="absolute top-[28%] right-[6%] text-[10px] tracking-widest text-cyan-200/30 leading-4 text-left">
                <div>&gt;INNOVATE</div>
                <div>&gt;MASTER</div>
                <div>&gt;THINK</div>
                <div>&gt;HACK</div>
                <div>&gt;ENGINEER</div>
                <div>&gt;BUILD</div>
                <div>&gt;EXECUTE</div>
                <div>&gt;SCALE</div>
                <div>&gt;TRANSCEND</div>
            </div>

            {/* thin vertical accent lines */}
            <motion.div
                className="absolute top-0 right-[18%] w-px h-32"
                style={{ background: 'linear-gradient(to bottom, rgba(199,6,28,0.4), transparent)' }}
                animate={{ opacity: [0.25, 0.65, 0.25] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute top-0 left-[18%] w-px h-32"
                style={{ background: 'linear-gradient(to bottom, rgba(41,123,201,0.4), transparent)' }}
                animate={{ opacity: [0.65, 0.25, 0.65] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
        </div>
    );
}

// ── Angular connector lines with pulsing node dots (bottom-left white,
//    right-side red) — the little circuit "wires" from the reference ────
function ConnectorLines() {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            {/* bottom-left white connector */}
            <polyline
                points="2%,68% 5%,68% 14%,80%"
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1"
            />
            <circle cx="2%" cy="68%" r="3" fill="rgba(255,255,255,0.7)" />
            <motion.circle
                cx="14%" cy="80%" r="2.5" fill="rgba(255,255,255,0.9)"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* right-side red connector */}
            <polyline
                points="97%,58% 95%,68% 90%,80%"
                fill="none"
                stroke="rgba(255,70,70,0.45)"
                strokeWidth="1"
            />
            <motion.rect
                x="96%" y="calc(58% - 3px)" width="6" height="6"
                fill="rgba(255,70,70,0.85)"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            />
        </svg>
    );
}

// ── Heavy vignette — reads as near-black, not gray ───────────────────────
function Vignette() {
    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.92) 100%)',
            }}
        />
    );
}

function MainBG({ children, className = '' }) {
    return (
        <div
            className={`relative w-full h-full overflow-hidden ${className}`}
            style={{ background: 'linear-gradient(180deg, #050506 0%, #020203 45%, #000000 100%)' }}
        >
            <AmbientBleed />
            <CircuitDust />
            <SmokeColumn side="left" color="#ff2d2d" seed={3} />
            <SmokeColumn side="right" color="#2d7fff" seed={11} />
            <CornerDetail />
            <ConnectorLines />
            <CrackedFloor />
            <Vignette />
            <Grain />
            <div className="relative z-10 w-full h-full">{children}</div>
        </div>
    );
}

export default MainBG;