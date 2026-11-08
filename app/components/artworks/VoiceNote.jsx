'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaMicrophone } from 'react-icons/fa';

const BARS = 64;

const fmt = (s) => {
  if (!isFinite(s) || s < 0) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

// Real waveform from the actual audio file
async function loadPeaks(src, bars) {
  const res = await fetch(src);
  if (!res.ok) throw new Error('fetch failed');
  const buf = await res.arrayBuffer();
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = new Ctx();
  try {
    const audio = await new Promise((resolve, reject) => ctx.decodeAudioData(buf, resolve, reject));
    const data = audio.getChannelData(0);
    const block = Math.max(1, Math.floor(data.length / bars));
    const step = Math.max(1, Math.floor(block / 200));
    const peaks = [];
    for (let i = 0; i < bars; i++) {
      let sum = 0;
      let n = 0;
      for (let j = 0; j < block; j += step) {
        sum += Math.abs(data[i * block + j] || 0);
        n++;
      }
      peaks.push(sum / Math.max(1, n));
    }
    const max = Math.max(...peaks) || 1;
    return peaks.map((p) => Math.max(0.08, p / max));
  } finally {
    ctx.close?.();
  }
}

export default function VoiceNote({ src, words }) {
  const audioRef = useRef(null);
  const trackRef = useRef(null);
  const [peaks, setPeaks] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;
    let alive = true;
    loadPeaks(src, BARS).then((p) => alive && setPeaks(p)).catch(() => {});
    return () => { alive = false; };
  }, [src]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !playing) return;
    let raf;
    const tick = () => {
      setProgress(a.duration ? a.currentTime / a.duration : 0);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // stop talking when the drawing changes or the viewer closes
  useEffect(() => () => audioRef.current?.pause(), []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => setError(true));
    else { a.pause(); setPlaying(false); }
  };

  const seek = (e) => {
    const a = audioRef.current;
    const t = trackRef.current;
    if (!a || !t || !a.duration) return;
    const r = t.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    a.currentTime = frac * a.duration;
    setProgress(frac);
  };

  if (!src && !words) return null;

  return (
    <div className="space-y-4">
      {src && !error && (
        <div>
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase text-zinc-500 mb-3">
            <FaMicrophone className="text-[10px]" /> hear it from me
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={toggle}
              aria-label={playing ? 'Pause voice note' : 'Play voice note'}
              className="shrink-0 h-12 w-12 rounded-full bg-[#e8dfc8] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              {playing ? <FaPause className="text-sm" /> : <FaPlay className="text-sm ml-0.5" />}
            </button>

            <div className="flex-1 min-w-0">
              <div
                ref={trackRef}
                onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); seek(e); }}
                onPointerMove={(e) => { if (e.buttons) seek(e); }}
                className="flex items-center gap-[2px] h-12 cursor-pointer touch-none select-none"
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
              >
                {Array.from({ length: BARS }).map((_, i) => (
                  <span
                    key={i}
                    className={`flex-1 rounded-full transition-colors duration-100 ${peaks ? '' : 'animate-pulse'}`}
                    style={{
                      height: `${(peaks ? peaks[i] : 0.2 + ((i * 37) % 10) / 40) * 100}%`,
                      background: i / BARS < progress ? '#e8dfc8' : 'rgba(255,255,255,0.18)',
                    }}
                  />
                ))}
              </div>
              <div className="mt-1 flex justify-between font-mono text-[10px] text-zinc-600">
                <span>{fmt(progress * duration)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>
          </div>

          <audio
            ref={audioRef}
            src={src}
            preload="metadata"
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onEnded={() => { setPlaying(false); setProgress(0); }}
            onError={() => setError(true)}
          />
        </div>
      )}

      {words && <p className="font-handwriting text-xl leading-snug text-[#e8dfc8]">&ldquo;{words}&rdquo;</p>}
    </div>
  );
}