'use client';
import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPencilAlt, 
  FaEraser, 
  FaTrashAlt, 
  FaDownload, 
  FaTimes,
  FaPaperPlane,
  FaCheck,
  FaSpinner
} from 'react-icons/fa';

export default function DrawingSandbox({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('charcoal');
  const [brushSize, setBrushSize] = useState(4);
  const [paperTexture, setPaperTexture] = useState('dark');

  // Send Sketch Form State
  const [showSendModal, setShowSendModal] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sketchDataUrl, setSketchDataUrl] = useState('');
  const [compactSketchData, setCompactSketchData] = useState('');

  // Audio Context Ref for Real Charcoal Scratching Sound
  const audioCtxRef = useRef(null);
  const noiseNodeRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Initialize Canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 440;

    fillBackground(ctx, canvas.width, canvas.height, paperTexture);
  }, [isOpen, paperTexture]);

  const fillBackground = (ctx, w, h, texture) => {
    if (texture === 'dark') {
      ctx.fillStyle = '#09090b';
    } else if (texture === 'bristol') {
      ctx.fillStyle = '#f8fafc';
    } else {
      ctx.fillStyle = '#1c1917';
    }
    ctx.fillRect(0, 0, w, h);
  };

  // Real Charcoal Scratching Sound Generator
  const playScratchSound = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (!noiseNodeRef.current) {
        const bufferSize = ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
        filter.Q.setValueAtTime(3.0, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.015, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        whiteNoise.start();

        noiseNodeRef.current = whiteNoise;
        gainNodeRef.current = gain;
      } else if (gainNodeRef.current) {
        gainNodeRef.current.gain.setValueAtTime(0.02, ctx.currentTime);
      }
    } catch (e) {
      // Audio fallback
    }
  };

  const stopScratchSound = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        gainNodeRef.current.gain.setValueAtTime(0.0001, audioCtxRef.current.currentTime);
      } catch (e) {}
    }
  };

  const getToolSettings = () => {
    switch (tool) {
      case 'charcoal':
        return { color: paperTexture === 'bristol' ? '#111827' : '#e4e4e7', alpha: 0.85 };
      case 'graphite':
        return { color: paperTexture === 'bristol' ? '#4b5563' : '#a1a1aa', alpha: 0.5 };
      case 'highlight':
        return { color: '#ffffff', alpha: 0.9 };
      case 'eraser':
        return { color: paperTexture === 'bristol' ? '#f8fafc' : paperTexture === 'dark' ? '#09090b' : '#1c1917', alpha: 1 };
      default:
        return { color: '#ffffff', alpha: 0.8 };
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);

    const settings = getToolSettings();
    ctx.strokeStyle = settings.color;
    ctx.globalAlpha = settings.alpha;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setIsDrawing(true);
    playScratchSound();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();

    playScratchSound();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    stopScratchSound();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    fillBackground(ctx, canvas.width, canvas.height, paperTexture);
  };

  const downloadSketch = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'gagan-sketch.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const openSendDrawer = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // High-res preview data URL
      const fullData = canvas.toDataURL('image/png');
      setSketchDataUrl(fullData);

      // Compress to 380x280 JPEG for lightweight email payload (~15KB)
      try {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 380;
        tempCanvas.height = 280;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(canvas, 0, 0, 380, 280);
        const compactJpeg = tempCanvas.toDataURL('image/jpeg', 0.6);
        setCompactSketchData(compactJpeg);
      } catch (e) {
        setCompactSketchData(fullData);
      }
    }
    setShowSendModal(true);
  };

  const handleSendSketch = async (e) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim()) {
      setSendError('Please provide your name and email.');
      return;
    }

    setSending(true);
    setSendError('');

    try {
      const userMsg = senderMessage.trim() || 'No message provided.';
      
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_name: senderName.trim(),
          from_email: senderEmail.trim(),
          message: userMsg,
          sketch_data: compactSketchData || sketchDataUrl
        })
      });

      if (res.ok) {
        setSentSuccess(true);
        setTimeout(() => {
          setShowSendModal(false);
          setSentSuccess(false);
          setSenderName('');
          setSenderEmail('');
          setSenderMessage('');
        }, 2200);
      } else {
        const data = await res.json();
        setSendError(data.error || 'Could not transmit sketch. Please try again.');
      }
    } catch (err) {
      setSendError('Connection issue. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-4xl bg-[#09090c] border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <FaPencilAlt className="text-white/80" />
            <h3 className="text-sm font-bold font-mono text-white">
              Sketchpad Sandbox
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3.5 bg-[#0c0c10] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          
          <div className="flex items-center gap-2">
            {[
              { id: 'charcoal', label: 'Charcoal (8B)', color: 'bg-zinc-400' },
              { id: 'graphite', label: 'Graphite (2B)', color: 'bg-zinc-600' },
              { id: 'highlight', label: 'White Pencil', color: 'bg-white text-black' },
              { id: 'eraser', label: 'Eraser', icon: FaEraser },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`px-3 py-1 rounded-full border flex items-center gap-1.5 transition-all ${
                  tool === t.id
                    ? 'border-white bg-white/20 text-white font-bold'
                    : 'border-white/10 bg-white/5 text-white/50 hover:text-white'
                }`}
              >
                {t.icon ? <t.icon className="text-xs" /> : <span className={`w-2 h-2 rounded-full ${t.color}`} />}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/50">Size:</span>
            <input
              type="range"
              min="1"
              max="24"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20 accent-white cursor-pointer"
            />
            <span className="text-white font-bold w-5">{brushSize}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-white/50">Paper:</span>
            {[
              { id: 'dark', label: 'Dark' },
              { id: 'bristol', label: 'White' },
              { id: 'parchment', label: 'Kraft' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPaperTexture(p.id)}
                className={`px-2 py-0.5 rounded text-[10px] border transition-all ${
                  paperTexture === p.id 
                    ? 'border-white bg-white/20 text-white font-bold' 
                    : 'border-white/10 text-white/40 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

        </div>

        {/* Canvas Area */}
        <div className="relative w-full bg-black flex items-center justify-center p-3">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full rounded-xl cursor-crosshair shadow-inner touch-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-white/10 bg-[#09090c] flex items-center justify-between font-mono text-xs">
          <button
            onClick={clearCanvas}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 border border-white/15 transition-all"
          >
            <FaTrashAlt />
            <span>Clear</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadSketch}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
            >
              <FaDownload />
              <span>Download</span>
            </button>

            {/* SEND DIRECTLY TO GAGAN BUTTON */}
            <button
              onClick={openSendDrawer}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold transition-all shadow"
            >
              <FaPaperPlane className="text-xs" />
              <span>Send to Gagan ✉️</span>
            </button>
          </div>
        </div>

        {/* Send Sketch Modal Overlay */}
        <AnimatePresence>
          {showSendModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-md z-30 p-6 flex flex-col justify-center max-w-lg mx-auto"
            >
              <button
                onClick={() => setShowSendModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10"
              >
                <FaTimes />
              </button>

              <h4 className="text-lg font-bold font-mono text-white mb-1">
                Send Your Sketch to Gagan
              </h4>
              <p className="text-xs font-mono text-zinc-400 mb-4">
                Send your drawing along with a note directly to Gagan’s inbox.
              </p>

              {sentSuccess ? (
                <div className="p-6 rounded-xl bg-white/5 border border-white/20 text-center space-y-2 font-mono">
                  <FaCheck className="text-emerald-400 text-2xl mx-auto" />
                  <h5 className="text-white font-bold text-sm">Sketch Transmitted!</h5>
                  <p className="text-xs text-zinc-400">Gagan has received your drawing and message.</p>
                </div>
              ) : (
                <form onSubmit={handleSendSketch} className="space-y-3 font-mono text-xs">
                  
                  {/* Sketch Preview */}
                  {sketchDataUrl && (
                    <div className="flex items-center gap-3 p-2 rounded-lg border border-white/10 bg-white/5">
                      <img src={sketchDataUrl} alt="Your Sketch" className="w-16 h-12 object-cover rounded border border-white/20" />
                      <span className="text-[11px] text-zinc-300">Your sketch will be transmitted to Gagan.</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-zinc-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white outline-none focus:border-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white outline-none focus:border-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Message / Note</label>
                    <textarea
                      rows={3}
                      value={senderMessage}
                      onChange={(e) => setSenderMessage(e.target.value)}
                      placeholder="What do you think of Gagan's art or your sketch?"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white outline-none focus:border-white/50 resize-none"
                    />
                  </div>

                  {sendError && <p className="text-red-400 text-[11px]">{sendError}</p>}

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSendModal(false)}
                      className="px-4 py-2 rounded-lg border border-white/15 text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sending}
                      className="px-5 py-2 rounded-lg bg-white text-black font-bold flex items-center gap-2 hover:bg-zinc-200 disabled:opacity-50"
                    >
                      {sending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                      <span>{sending ? 'Sending...' : 'Send Sketch'}</span>
                    </button>
                  </div>

                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
