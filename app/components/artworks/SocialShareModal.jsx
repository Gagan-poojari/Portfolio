'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaWhatsapp, 
  FaLinkedin, 
  FaPinterest, 
  FaTelegramPlane, 
  FaRedditAlien, 
  FaFacebookF, 
  FaEnvelope, 
  FaLink, 
  FaCheck, 
  FaTimes,
  FaShareAlt,
  FaQrcode
} from 'react-icons/fa';
import { FaXTwitter, FaThreads } from 'react-icons/fa6';

export default function SocialShareModal({ isOpen, onClose, artwork }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !artwork) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://gagan-poojari.me';
  const currentUrl = `${origin}/artworks#${artwork.id}`;
  const artworkFullImg = artwork.image?.startsWith('http') ? artwork.image : `${origin}${artwork.image}`;

  const title = `"${artwork.title}" — graphite & charcoal drawing by Gagan Poojari`;
  const text = `Take a look at "${artwork.title}" (${artwork.category}, ${artwork.size}) — a hand-drawn artwork by Gagan Poojari:`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: currentUrl
        });
      } catch (err) {
        // User dismissed native share sheet
      }
    }
  };

  // Popular social media share destinations (matches YouTube, Pinterest & Instagram share patterns)
  const socialApps = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      bg: 'bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.35)]',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${currentUrl}`)}`,
    },
    {
      name: 'X',
      icon: FaXTwitter,
      bg: 'bg-black text-white border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.5)]',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'Pinterest',
      icon: FaPinterest,
      bg: 'bg-[#E60023] text-white shadow-[0_4px_16px_rgba(230,0,35,0.35)]',
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(artworkFullImg)}&description=${encodeURIComponent(title)}`,
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      bg: 'bg-[#0A66C2] text-white shadow-[0_4px_16px_rgba(10,102,194,0.35)]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'Telegram',
      icon: FaTelegramPlane,
      bg: 'bg-[#229ED9] text-white shadow-[0_4px_16px_rgba(34,158,217,0.35)]',
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: 'Reddit',
      icon: FaRedditAlien,
      bg: 'bg-[#FF4500] text-white shadow-[0_4px_16px_rgba(255,69,0,0.35)]',
      url: `https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`,
    },
    {
      name: 'Threads',
      icon: FaThreads,
      bg: 'bg-zinc-900 text-white border border-white/20 shadow-[0_4px_16px_rgba(255,255,255,0.1)]',
      url: `https://threads.net/intent/post?text=${encodeURIComponent(`${title} ${currentUrl}`)}`,
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      bg: 'bg-[#1877F2] text-white shadow-[0_4px_16px_rgba(24,119,242,0.35)]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      bg: 'bg-zinc-800 text-zinc-200 border border-white/10 hover:text-white',
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${currentUrl}`)}`,
    },
  ];

  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(currentUrl)}&bgcolor=0e1017&color=ffffff&margin=1`;

  return (
    <AnimatePresence>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[480px] bg-gradient-to-b from-[#10121a]/95 to-[#090a0f]/98 border border-white/15 rounded-3xl p-5 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(255,255,255,0.03)] space-y-5 overflow-hidden"
        >
          {/* Subtle Accent Glow Horizon */}
          <div className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/90">
                <FaShareAlt className="text-xs" />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-white tracking-wide">
                  Share Artwork
                </h3>
                <p className="text-[11px] text-zinc-400 font-light">
                  Send to friends or share across your channels
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>

          {/* Artwork Preview Pill */}
          <div className="flex items-center gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
            <div className="relative w-12 h-14 rounded-lg overflow-hidden border border-white/20 shadow-md bg-black shrink-0">
              <img 
                src={artwork.image} 
                alt={artwork.title} 
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white truncate">
                {artwork.title}
              </h4>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                {artwork.category} &bull; {artwork.size} &bull; by Gagan Poojari
              </p>
            </div>
            <button
              onClick={() => setShowQr(prev => !prev)}
              className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                showQr 
                  ? 'bg-white text-black border-white' 
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
              title="Toggle QR Code"
            >
              <FaQrcode className="text-sm" />
            </button>
          </div>

          {/* QR Code Reveal Panel */}
          <AnimatePresence>
            {showQr && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-2xl bg-[#090b12] border border-white/10 flex flex-col items-center justify-center space-y-2 text-center">
                  <div className="p-2.5 rounded-xl bg-[#0e1017] border border-white/15 shadow-inner">
                    <img 
                      src={qrApiUrl} 
                      alt="Artwork QR Code" 
                      className="w-36 h-36 rounded-lg"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Scan with any phone camera to open instantly
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Popular Social Media App Dock (YouTube / TikTok / Pinterest style) */}
          <div className="space-y-2">
            <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
              Share to app
            </p>

            <div className="grid grid-cols-5 sm:grid-cols-5 gap-2.5 sm:gap-3 justify-items-center py-1">
              {socialApps.slice(0, 5).map((app) => {
                const Icon = app.icon;
                return (
                  <a
                    key={app.name}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-1.5 transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    title={`Share on ${app.name}`}
                  >
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${app.bg}`}>
                      <Icon className="text-lg sm:text-xl" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-zinc-400 group-hover:text-white transition-colors truncate max-w-[64px] text-center">
                      {app.name}
                    </span>
                  </a>
                );
              })}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5 sm:gap-3 justify-items-center pt-1">
              {socialApps.slice(5).map((app) => {
                const Icon = app.icon;
                return (
                  <a
                    key={app.name}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-1.5 transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    title={`Share on ${app.name}`}
                  >
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${app.bg}`}>
                      <Icon className="text-base sm:text-lg" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-zinc-400 group-hover:text-white transition-colors truncate max-w-[64px] text-center">
                      {app.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Copy Direct Link Section */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="relative flex items-center rounded-2xl bg-white/[0.04] border border-white/10 p-1.5 pl-3 focus-within:border-white/30 transition-colors">
              <FaLink className="text-zinc-500 text-xs shrink-0 mr-2.5" />
              <input
                type="text"
                readOnly
                value={currentUrl}
                onFocus={(e) => e.target.select()}
                className="flex-1 bg-transparent text-xs text-zinc-300 font-mono outline-none select-all truncate pr-2"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl font-medium text-xs font-mono transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  copied
                    ? 'bg-emerald-500 text-black font-semibold shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-white text-black hover:bg-zinc-200 shadow-md active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <FaCheck className="text-[11px]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <span>Copy</span>
                )}
              </button>
            </div>

            {/* Native Mobile Share Button (if supported on mobile/tablet) */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                onClick={handleNativeShare}
                className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FaShareAlt className="text-[10px]" />
                <span>More options (System Share Sheet)</span>
              </button>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}