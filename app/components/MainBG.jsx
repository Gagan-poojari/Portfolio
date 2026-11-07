'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

// ── Dense circuit dust — cyan/white pixel specks ─────────────────────────────
function CircuitDust({ active }) {
    const canvasRef = useRef(null);
    const frameRef = useRef(null);

    useEffect(() => {
        if (!active) {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H, dots, clusters;

        function rand(min, max) { return min + Math.random() * (max - min); }

        function makeClusters() {
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
                const step = 12; // optimized spacing
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
            const count = Math.min(80, Math.max(40, Math.floor((W * H) / 24000)));
            const arr = [];
            for (let i = 0; i < count; i++) {
                const isRed = Math.random() < 0.06;
                arr.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    r: rand(0.5, 1.2),
                    baseA: rand(0.08, 0.35),
                    speed: rand(0.3, 1.0),
                    phase: rand(0, Math.PI * 2),
                    color: isRed ? '199,60,60' : '150,220,235',
                });
            }
            return arr;
        }

        function resize() {
            if (!canvas) return;
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

            // static-ish cluster dots
            for (let i = 0; i < clusters.length; i++) {
                const p = clusters[i];
                const a = p.a * (0.7 + 0.3 * Math.sin(t * 1.5 + p.x * 0.1));
                ctx.fillStyle = `rgba(120,210,230,${a})`;
                ctx.fillRect(p.x, p.y, 1.4, 1.4);
            }

            // roaming twinkling specks
            for (let i = 0; i < dots.length; i++) {
                const d = dots[i];
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
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            window.removeEventListener('resize', resize);
        };
    }, [active]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ display: 'block' }}
        />
    );
}

// ── Static Film Grain (Drawn ONCE on mount — 0% ongoing CPU impact) ───────────
function Grain() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = (canvas.width = 128);
        const H = (canvas.height = 128);
        const imageData = ctx.createImageData(W, H);
        const buf = imageData.data;

        for (let i = 0; i < buf.length; i += 4) {
            const v = Math.random() * 255;
            buf[i] = buf[i + 1] = buf[i + 2] = v;
            buf[i + 3] = 10;
        }
        ctx.putImageData(imageData, 0, 0);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay"
            style={{ imageRendering: 'pixelated', opacity: 0.4 }}
        />
    );
}

// ── Rising smoke columns with optimized 2-octave turbulence ───────────────────
function SmokeColumn({ side, color, seed, active }) {
    if (!active) return null;

    const filterId = `smoke-turb-${side}`;
    const gradId = `smoke-grad-${side}`;
    const left = side === 'left' ? '20%' : '56%';

    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ mixBlendMode: 'screen' }}
            preserveAspectRatio="none"
        >
            <defs>
                <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.007 0.016"
                        numOctaves={2} // Reduced from 4 to 2 (drastically cuts CPU computation)
                        seed={seed}
                        result="turb"
                    >
                        <animate
                            attributeName="baseFrequency"
                            values="0.006 0.014;0.008 0.018;0.006 0.014"
                            dur="24s"
                            repeatCount="indefinite"
                        />
                    </feTurbulence>
                    <feColorMatrix
                        in="turb"
                        type="matrix"
                        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 3.0 -1.2"
                        result="alphaShape"
                    />
                    <feComposite in="alphaShape" in2="SourceGraphic" operator="in" />
                </filter>
                <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                    <stop offset="40%" stopColor={color} stopOpacity="0.18" />
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

// ── Cracked floor with light pools ───────────────────────────────────────────
function CrackedFloor() {
    const canvasRef = useRef(null);

    const cracks = useMemo(() => {
        function branch(cx, cy, count) {
            const lines = [];
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const len = 30 + Math.random() * 60;
                let x = cx, y = cy;
                const segs = 3;
                for (let s = 0; s < segs; s++) {
                    const a = angle + (Math.random() - 0.5) * 1.0;
                    const l = len / segs;
                    const nx = x + Math.cos(a) * l;
                    const ny = y + Math.sin(a) * l * 0.35;
                    lines.push([x, y, nx, ny]);
                    x = nx; y = ny;
                }
            }
            return lines;
        }
        return { red: branch(0.28, 0.5, 8), blue: branch(0.72, 0.5, 8) };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function draw() {
            if (!canvas) return;
            const W = (canvas.width = canvas.offsetWidth);
            const H = (canvas.height = canvas.offsetHeight);
            ctx.clearRect(0, 0, W, H);

            const drawSet = (lines, color) => {
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                for (let i = 0; i < lines.length; i++) {
                    const [x1, y1, x2, y2] = lines[i];
                    ctx.beginPath();
                    ctx.moveTo(x1 * W, y1 * H);
                    ctx.lineTo(x2 * W, y2 * H);
                    ctx.stroke();
                }
            };
            drawSet(cracks.red, 'rgba(255,120,110,0.14)');
            drawSet(cracks.blue, 'rgba(110,170,255,0.14)');
        }
        draw();
        window.addEventListener('resize', draw);
        return () => window.removeEventListener('resize', draw);
    }, [cracks]);

    return (
        <div className="absolute bottom-0 left-0 w-full h-[34%] pointer-events-none overflow-hidden">
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(5,6,8,0.4) 100%)' }}
            />
            <div
                className="absolute rounded-full"
                style={{
                    width: '30vw', height: '16vh', left: '14%', bottom: '-6%',
                    background: 'radial-gradient(ellipse, rgba(255,40,40,0.3) 0%, rgba(255,40,40,0.06) 45%, transparent 75%)',
                    filter: 'blur(16px)',
                }}
            />
            <div
                className="absolute rounded-full"
                style={{
                    width: '30vw', height: '16vh', left: '58%', bottom: '-6%',
                    background: 'radial-gradient(ellipse, rgba(60,140,255,0.3) 0%, rgba(60,140,255,0.06) 45%, transparent 75%)',
                    filter: 'blur(16px)',
                }}
            />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
}

// ── Corner HUD details ────────────────────────────────────────────────────────
function CornerDetail() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden font-mono">
            <div
                className="absolute bottom-0 left-0 w-56 h-56 opacity-[0.08]"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                    maskImage: 'radial-gradient(circle at 0% 100%, black 0%, transparent 75%)',
                    WebkitMaskImage: 'radial-gradient(circle at 0% 100%, black 0%, transparent 75%)',
                }}
            />
            <div className="absolute top-[10%] left-[7%] flex gap-1 opacity-35">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-px"
                        style={{ height: 90 + i * 10, background: 'linear-gradient(to bottom, rgba(255,60,60,0.5), transparent)' }}
                    />
                ))}
            </div>

            <div className="absolute top-[28%] right-[6%] text-[10px] tracking-widest text-cyan-200/25 leading-4 text-left select-none">
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

            <div
                className="absolute top-0 right-[18%] w-px h-32 opacity-40"
                style={{ background: 'linear-gradient(to bottom, rgba(199,6,28,0.4), transparent)' }}
            />
            <div
                className="absolute top-0 left-[18%] w-px h-32 opacity-40"
                style={{ background: 'linear-gradient(to bottom, rgba(41,123,201,0.4), transparent)' }}
            />
        </div>
    );
}

// ── Connector lines ───────────────────────────────────────────────────────────
function ConnectorLines() {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <polyline
                points="2%,68% 5%,68% 14%,80%"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
            />
            <circle cx="2%" cy="68%" r="3" fill="rgba(255,255,255,0.6)" />
            <circle cx="14%" cy="80%" r="2.5" fill="rgba(255,255,255,0.8)" />

            <polyline
                points="97%,58% 95%,68% 90%,80%"
                fill="none"
                stroke="rgba(255,70,70,0.4)"
                strokeWidth="1"
            />
            <rect
                x="96%" y="calc(58% - 3px)" width="6" height="6"
                fill="rgba(255,70,70,0.75)"
            />
        </svg>
    );
}

// ── Vignette ──────────────────────────────────────────────────────────────────
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
    const containerRef = useRef(null);
    const [isInView, setIsInView] = useState(true);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0, rootMargin: '120px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full overflow-hidden ${className}`}
            style={{ background: 'linear-gradient(180deg, #050506 0%, #020203 45%, #000000 100%)' }}
        >
            <CircuitDust active={isInView} />
            <SmokeColumn side="left" color="#ff2d2d" seed={3} active={isInView} />
            <SmokeColumn side="right" color="#2d7fff" seed={11} active={isInView} />
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
