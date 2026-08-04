'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTwitter, 
  FaLinkedin, 
  FaWhatsapp, 
  FaReddit, 
  FaLink, 
  FaCheck, 
  FaTimes,
  FaShareAlt
} from 'react-icons/fa';

export default function SocialShareModal({ isOpen, onClose, artwork }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !artwork) return null;

  const currentUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/artworks#${artwork.id}` 
    : 'https://gagan-poojari.me/artworks';

  const title = `Check out "${artwork.title}" - Original Sketch by Gagan Poojari`;
  const text = `Explore "${artwork.title}", a hand-drawn ${artwork.medium} sketch by Gagan Poojari.`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
        // User cancelled or native share failed
      }
    }
  };

  const shareLinks = [
    {
      name: 'X (Twitter)',
      icon: FaTwitter,
      color: 'bg-zinc-800 hover:bg-black text-white border-zinc-700',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      color: 'bg-[#0077b5]/20 hover:bg-[#0077b5]/30 text-[#0077b5] border-[#0077b5]/40',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border-[#25D366]/40',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + currentUrl)}`
    },
    {
      name: 'Reddit',
      icon: FaReddit,
      color: 'bg-[#FF4500]/20 hover:bg-[#FF4500]/30 text-[#FF4500] border-[#FF4500]/40',
      url: `https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-[#0d0e14] border border-white/20 rounded-2xl p-6 shadow-2xl space-y-5 font-mono"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-white">
              <FaShareAlt className="text-sm text-white/80" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Share Artwork</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10"
            >
              <FaTimes />
            </button>
          </div>

          {/* Artwork Preview Card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <img 
              src={artwork.image} 
              alt={artwork.title} 
              className="w-12 h-16 object-cover rounded border border-white/20"
            />
            <div>
              <h4 className="text-xs font-bold text-white">{artwork.title}</h4>
              <p className="text-[10px] text-white/50">{artwork.medium}</p>
            </div>
          </div>

          {/* Native Web Share Button (if supported) */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow"
            >
              <FaShareAlt className="text-xs" />
              <span>Share via Device Share Sheet</span>
            </button>
          )}

          {/* Social Icons Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {shareLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${item.color}`}
                >
                  <Icon className="text-sm" />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>

          {/* Copy Direct Link */}
          <div className="pt-2 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-[11px] outline-none select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              {copied ? <FaCheck className="text-emerald-400" /> : <FaLink />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
