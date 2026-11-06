'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPencilAlt, 
  FaEraser, 
  FaTrashAlt, 
  FaDownload, 
  FaTimes,
  FaPaperPlane,
  FaCheck,
  FaSpinner,
  FaUndo,
  FaMagic
} from 'react-icons/fa';

const TRACE_TEMPLATES = [
  { id: 'none', label: 'Blank Canvas' },
  { id: 'ronaldo-goat', label: 'Trace CR7', img: '/artworks/ronaldo-goat.webp' },
  { id: 'paul-walker', label: 'Trace Paul Walker', img: '/artworks/paul-walker-portrait.webp' },
  { id: 'radha-krishna-eyes', label: 'Trace Divine Eyes', img: '/artworks/radha-krishna-eyes.webp' },
];

export default function DrawingSandbox({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('charcoal');
  const [brushSize, setBrushSize] = useState(5);
  const [paperTexture, setPaperTexture] = useState('dark');
  const [traceTemplate, setTraceTemplate] = useState('none');
  const [history, setHistory] = useState([]);

  // Send Sketch Form State
  const [showSendModal, setShowSendModal] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sketchDataUrl, setSketchDataUrl] = useState('');

  const fillBackground = useCallback((ctx, w, h, texture) => {
    if (texture === 'dark') {
      ctx.fillStyle = '#0c0c10';
    } else if (texture === 'bristol') {
      ctx.fillStyle = '#fafaf9';
    } else {
      ctx.fillStyle = '#1c1917';
    }
    ctx.fillRect(0, 0, w, h);
  }, []);

  const saveHistoryState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), imageData]);
  }, []);

  // Initialize Canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth || 700;
    canvas.height = 460;

    fillBackground(ctx, canvas.width, canvas.height, paperTexture);
    setHistory([]);
  }, [isOpen, paperTexture, fillBackground]);

  const handleUndo = () => {
    if (history.length <= 1) {
      clearCanvas();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const newHistory = [...history];
    newHistory.pop();
    const previous = newHistory[newHistory.length - 1];
    ctx.putImageData(previous, 0, 0);
    setHistory(newHistory);
  };

  const getToolSettings = () => {
    switch (tool) {
      case 'charcoal':
        return { 
          color: paperTexture === 'bristol' ? '#18181b' : '#f4f4f5', 
          alpha: 0.9 
        };
      case 'graphite':
        return { 
          color: paperTexture === 'bristol' ? '#52525b' : '#a1a1aa', 
          alpha: 0.55 
        };
      case 'highlight':
        return { 
          color: '#ffffff', 
          alpha: 0.95 
        };
      case 'eraser':
        return { 
          color: paperTexture === 'bristol' ? '#fafaf9' : paperTexture === 'dark' ? '#0c0c10' : '#1c1917', 
          alpha: 1 
        };
      default:
        return { color: '#ffffff', alpha: 0.85 };
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
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveHistoryState();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    fillBackground(ctx, canvas.width, canvas.height, paperTexture);
    setHistory([]);
  };

  const downloadSketch = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `my-drawing-gagan-atelier.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const openSendDrawer = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const fullData = canvas.toDataURL('image/png');
      setSketchDataUrl(fullData);
    }
    setShowSendModal(true);
  };

  const handleSendSketch = async (e) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim()) {
      setSendError('Please enter your name and email.');
      return;
    }

    setSending(true);
    setSendError('');

    try {
      const userMsg = senderMessage.trim() || 'Drawn with the Atelier Sketchpad.';
      
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_name: senderName.trim(),
          from_email: senderEmail.trim(),
          message: userMsg,
          sketch_data: sketchDataUrl
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
        }, 2500);
      } else {
        const data = await res.json();
        setSendError(data.error || 'Could not send drawing. Please try again.');
      }
    } catch (err) {
      setSendError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const currentTemplate = TRACE_TEMPLATES.find(t => t.id === traceTemplate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md font-body">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-4xl bg-[#0d0d12] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>The Visitor Sketchpad</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 font-normal">
                  Interactive Studio
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Doodle something, trace an artwork, or send your sketch straight to Gagan.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Toolbar Row 1: Tools, Size, Paper */}
        <div className="px-5 py-2.5 bg-[#0a0a0e] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Tools */}
          <div className="flex items-center gap-1.5">
            {[
              { id: 'charcoal', label: '8B Charcoal', dot: 'bg-zinc-200' },
              { id: 'graphite', label: '2B Lead', dot: 'bg-zinc-500' },
              { id: 'highlight', label: 'White Chalk', dot: 'bg-white' },
              { id: 'eraser', label: 'Eraser', icon: FaEraser },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all cursor-pointer ${
                  tool === t.id
                    ? 'border-white/50 bg-white/15 text-white font-semibold shadow-sm'
                    : 'border-white/5 bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.icon ? <t.icon className="text-xs" /> : <span className={`w-2 h-2 rounded-full ${t.dot}`} />}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Stroke Size */}
          <div className="flex items-center gap-2 text-zinc-400">
            <span>Stroke:</span>
            <input
              type="range"
              min="1"
              max="30"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20 accent-white cursor-pointer"
            />
            <span className="text-white font-mono w-5">{brushSize}px</span>
          </div>

          {/* Paper Type */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">Paper:</span>
            {[
              { id: 'dark', label: 'Noir Sheet' },
              { id: 'bristol', label: 'Bristol White' },
              { id: 'parchment', label: 'Kraft' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPaperTexture(p.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] border transition-all cursor-pointer ${
                  paperTexture === p.id 
                    ? 'border-white/50 bg-white/20 text-white font-medium' 
                    : 'border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

        </div>

        {/* Toolbar Row 2: Trace Guide Selector */}
        <div className="px-5 py-2 bg-[#09090c] border-b border-white/5 flex items-center gap-2 text-xs overflow-x-auto">
          <span className="text-zinc-500 font-mono text-[11px] flex items-center gap-1 shrink-0">
            <FaMagic className="text-amber-400 text-[10px]" /> Tracing Guide:
          </span>
          {TRACE_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setTraceTemplate(tmpl.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] shrink-0 border transition-all cursor-pointer ${
                traceTemplate === tmpl.id
                  ? 'border-amber-400/60 bg-amber-400/15 text-amber-300 font-medium'
                  : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:text-white'
              }`}
            >
              {tmpl.label}
            </button>
          ))}
          {traceTemplate !== 'none' && (
            <span className="text-[10px] text-zinc-500 font-mono ml-auto hidden sm:inline">
              Faint guide shown underneath &bull; Shade over it!
            </span>
          )}
        </div>

        {/* Canvas Area with Optional Tracing Watermark */}
        <div className="relative w-full bg-black/40 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          
          {/* Faint Tracing Watermark Guide */}
          {currentTemplate?.img && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-3 sm:p-4 z-0">
              <img
                src={currentTemplate.img}
                alt="Tracing Guide"
                className="max-h-[440px] w-auto max-w-full object-contain opacity-20 filter grayscale invert"
              />
            </div>
          )}

          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="relative z-10 w-full rounded-xl cursor-crosshair shadow-2xl touch-none border border-white/10"
          />
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-white/10 bg-[#0a0a0e] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              title="Undo last stroke"
            >
              <FaUndo className="text-[10px]" />
              <span>Undo</span>
            </button>
            <button
              onClick={clearCanvas}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-all cursor-pointer"
            >
              <FaTrashAlt className="text-[10px]" />
              <span>Clear</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={downloadSketch}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all font-medium cursor-pointer"
            >
              <FaDownload className="text-[11px]" />
              <span>Save PNG</span>
            </button>

            {/* Send to Gagan */}
            <button
              onClick={openSendDrawer}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold transition-all shadow-md cursor-pointer"
            >
              <FaPaperPlane className="text-[11px]" />
              <span>Send Drawing to Gagan</span>
            </button>
          </div>
        </div>

        {/* Send Modal Overlay */}
        <AnimatePresence>
          {showSendModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-md z-30 p-6 sm:p-8 flex flex-col justify-center max-w-lg mx-auto"
            >
              <button
                onClick={() => setShowSendModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <FaTimes />
              </button>

              <h4 className="text-xl font-bold text-white mb-1">
                Drop Your Sketch in My Inbox
              </h4>
              <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                I love seeing what visitors draw! Your sketch will be rendered into a direct viewable image and sent straight to my personal inbox.
              </p>

              {sentSuccess ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                  <FaCheck className="text-emerald-400 text-2xl mx-auto" />
                  <h5 className="text-white font-semibold text-sm">Drawing Received!</h5>
                  <p className="text-xs text-zinc-300">Thanks for sharing your art with me! I will check it out shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSendSketch} className="space-y-3.5 text-xs">
                  
                  {sketchDataUrl && (
                    <div className="flex items-center gap-3 p-2.5 rounded-xl border border-white/10 bg-white/5">
                      <img 
                        src={sketchDataUrl} 
                        alt="Your Sketch" 
                        className="w-16 h-12 object-cover rounded-lg border border-white/15 bg-black" 
                      />
                      <span className="text-[11px] text-zinc-300">
                        Your original drawing will be delivered cleanly.
                      </span>
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white outline-none focus:border-white/50 transition-colors"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white outline-none focus:border-white/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Note / Message (Optional)</label>
                    <textarea
                      rows={3}
                      value={senderMessage}
                      onChange={(e) => setSenderMessage(e.target.value)}
                      placeholder="Loved your Paul Walker sketch! Here's a quick doodle I made..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white outline-none focus:border-white/50 resize-none transition-colors"
                    />
                  </div>

                  {sendError && <p className="text-red-400 text-xs">{sendError}</p>}

                  <div className="pt-2 flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowSendModal(false)}
                      className="px-4 py-2 rounded-xl border border-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sending}
                      className="px-5 py-2 rounded-xl bg-white text-black font-semibold flex items-center gap-2 hover:bg-zinc-200 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {sending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane className="text-xs" />}
                      <span>{sending ? 'Sending...' : 'Send Drawing'}</span>
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