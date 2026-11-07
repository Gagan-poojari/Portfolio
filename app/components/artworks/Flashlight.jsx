'use client';
import React, { useEffect, useRef, useState } from 'react';

// "Lights off" mode: the whole page goes dark, your cursor / finger is the torch.
export default function Flashlight({ on }) {
  const ref = useRef(null);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    if (!on) return;
    setHint(true);
    const hide = setTimeout(() => setHint(false), 3500);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const set = () => {
      ref.current?.style.setProperty('--fx', `${x}px`);
      ref.current?.style.setProperty('--fy', `${y}px`);
    };
    const move = (e) => {
      const p = e.touches ? e.touches[0] : e;
      if (!p) return;
      tx = p.clientX;
      ty = p.clientY;
    };
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      set();
      raf = requestAnimationFrame(tick);
    };
    set();
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('touchstart', move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      clearTimeout(hide);
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchstart', move);
    };
  }, [on]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[35] transition-opacity duration-700 ${on ? 'opacity-100' : 'opacity-0'}`}
      style={{
        background:
          'radial-gradient(circle min(40vw, 270px) at var(--fx, 50%) var(--fy, 50%), rgba(0,0,0,0) 0%, rgba(2,2,4,0.55) 45%, rgba(2,2,4,0.975) 100%)',
      }}
    >
      <p
        className={`absolute bottom-24 left-0 right-0 text-center font-handwriting text-xl text-white/70 transition-opacity duration-700 ${
          on && hint ? 'opacity-100' : 'opacity-0'
        }`}
      >
        lights are off. move around.
      </p>
    </div>
  );
}