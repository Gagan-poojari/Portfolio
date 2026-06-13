'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── STATIC ITEMS ─────────────────────────────────────────────────────────────

const navLinks = [
  { name: 'Skills',   section: 'skills',   glyph: '⬡', num: '01' },
  { name: 'Courses',  section: 'courses',  glyph: '◎', num: '02' },
  { name: 'Projects', section: 'projects', glyph: '◈', num: '03' },
  { name: 'Contact',  section: 'contact',  glyph: '◇', num: '04' },
];

const staticCmdItems = [
  ...navLinks.map(l => ({
    label: l.name,
    desc: `Jump to ${l.name}`,
    section: l.section,
    type: 'nav',
    glyph: l.glyph,
    color: '#a3a3a3',
  })),
  { label: 'Resume',   desc: 'Open PDF in new tab',          href: '/resume.pdf',                                          type: 'action', glyph: '↗', color: '#F97316' },
  { label: 'GitHub',   desc: 'github.com/Gagan-poojari',     href: 'https://github.com/Gagan-poojari',                     type: 'social', glyph: '⌥', color: '#ffffff' },
  { label: 'LinkedIn', desc: 'Connect on LinkedIn',          href: 'https://www.linkedin.com/in/gagan-poojari-840744319/', type: 'social', glyph: '⌘', color: '#297bc9' },
];

const TYPE_LABELS = { nav: 'nav', action: 'action', social: 'social', page: 'page' };

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/** Collect visible text nodes from the page, skipping nav/script/style/palette */
function collectPageText() {
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'HEADER', 'NAV', 'META', 'LINK']);
  const results = [];

  const walk = (node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node;
      if (SKIP_TAGS.has(el.tagName)) return;
      if (el.getAttribute('data-cmd-palette') === 'true') return;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent || '').trim();
      if (text.length < 4) return;
      const parent = node.parentElement;
      if (!parent) return;
      const style = window.getComputedStyle(parent);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;
      results.push({ text, element: parent });
    } else {
      node.childNodes.forEach(walk);
    }
  };

  walk(document.body);
  return results;
}

/** Build ~60-char snippet centred on the match */
function buildSnippet(text, query) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, 72);
  const start = Math.max(0, idx - 28);
  const end   = Math.min(text.length, idx + query.length + 28);
  return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
}

/** Temporarily ring an element in purple, then clean up */
let lastHighlightCleanup = null;

function highlightElement(el) {
  if (lastHighlightCleanup) lastHighlightCleanup();
  const prev = el.style.cssText;
  el.style.outline       = '2px solid rgba(167,139,250,0.8)';
  el.style.outlineOffset = '3px';
  el.style.borderRadius  = '3px';
  el.style.transition    = 'outline 0.3s ease';
  const t = setTimeout(() => {
    el.style.outline       = '';
    el.style.outlineOffset = '';
    el.style.borderRadius  = '';
  }, 1600);
  lastHighlightCleanup = () => { clearTimeout(t); el.style.cssText = prev; };
}

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── HIGHLIGHT MATCH ──────────────────────────────────────────────────────────

function HighlightMatch({ text, query }) {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark style={{ background: 'rgba(167,139,250,0.35)', color: '#c4b5fd', borderRadius: 2, padding: '0 1px' }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

// ─── GROUP LABEL ─────────────────────────────────────────────────────────────

function GroupLabel({ label }) {
  return (
    <div style={{
      padding: '6px 16px 3px',
      fontSize: 9,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.2)',
      fontFamily: "'Share Tech Mono',monospace",
    }}>
      {label}
    </div>
  );
}

// ─── COMMAND PALETTE ──────────────────────────────────────────────────────────

export function CommandPalette({ open, onClose }) {
  const [query,       setQuery]       = useState('');
  const [cursor,      setCursor]      = useState(0);
  const [pageResults, setPageResults] = useState([]);
  const [searching,   setSearching]   = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setCursor(0);
      setPageResults([]);
      setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 60);
    }
  }, [open]);

  // Page text search — debounced 180ms, fires after 2+ chars
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim() || query.trim().length < 2) {
      setPageResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(() => {
      const q    = query.trim().toLowerCase();
      const nodes = collectPageText();
      const seen  = new Set();
      const hits  = [];

      for (const { text, element } of nodes) {
        if (!text.toLowerCase().includes(q)) continue;
        const snippet = buildSnippet(text, query.trim());
        const key     = snippet.slice(0, 60);
        if (seen.has(key)) continue;
        seen.add(key);
        hits.push({
          label:   snippet,
          desc:    element.tagName.toLowerCase(),
          type:    'page',
          glyph:   '◉',
          color:   '#a78bfa',
          element,
        });
        if (hits.length >= 6) break;
      }

      setPageResults(hits);
      setSearching(false);
    }, 180);
  }, [query]);

  // Filtered static items
  const staticFiltered = query.trim()
    ? staticCmdItems.filter(i =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.desc.toLowerCase().includes(query.toLowerCase())
      )
    : staticCmdItems;

  const allResults    = [...staticFiltered, ...pageResults];
  const firstPageIdx  = staticFiltered.length;
  const hasPageHits   = pageResults.length > 0;

  useEffect(() => { setCursor(0); }, [query]);

  const navigate = useCallback((item) => {
    onClose();
    if (item.section) {
      setTimeout(() => scrollToSection(item.section), 150);
    } else if (item.element) {
      setTimeout(() => {
        item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        highlightElement(item.element);
      }, 150);
    } else if (item.href) {
      window.open(item.href, '_blank');
    }
  }, [onClose]);

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, allResults.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    if (e.key === 'Escape')    onClose();
    if (e.key === 'Enter' && allResults[cursor]) navigate(allResults[cursor]);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-[998]"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
          />

          {/* Palette */}
          <motion.div
            data-cmd-palette="true"
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1,    y: 0   }}
            exit={{    opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[999] top-[16%]"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(92vw, 520px)',
              maxWidth: 'calc(100vw - 24px)',
              borderRadius: 14,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(5,5,9,0.99)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
            }}
          >
            {/* Top shimmer */}
            <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)' }} />

            {/* Input row */}
            <div style={{
              padding: '13px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontFamily: "'Share Tech Mono',monospace", flexShrink: 0 }}>
                {searching ? '⟳' : '⌘'}
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search commands or page…"
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: '#fff', fontSize: 14, fontFamily: "'Share Tech Mono',monospace",
                  caretColor: '#fff', minWidth: 0,
                }}
              />
              <kbd
                onClick={onClose}
                style={{
                  fontSize: 9, padding: '2px 7px', borderRadius: 5, flexShrink: 0,
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)',
                  cursor: 'pointer', fontFamily: "'Share Tech Mono',monospace",
                }}
              >ESC</kbd>
            </div>

            {/* Results list */}
            <div style={{ maxHeight: 360, overflowY: 'auto', padding: '6px 0 8px' }}>
              {allResults.length === 0 && !searching && (
                <p style={{
                  textAlign: 'center', padding: 24,
                  color: 'rgba(255,255,255,0.2)', fontSize: 12,
                  fontFamily: "'Share Tech Mono',monospace",
                }}>
                  No results
                </p>
              )}

              {allResults.map((item, i) => {
                const isActive    = cursor === i;
                const isFirstPage = hasPageHits && i === firstPageIdx;

                return (
                  <React.Fragment key={`${item.type}-${item.label}-${i}`}>
                    {/* "On this page" group divider */}
                    {isFirstPage && (
                      <div style={{ margin: '6px 0 2px' }}>
                        <div style={{ height: 1, margin: '0 16px', background: 'rgba(255,255,255,0.05)' }} />
                        <GroupLabel label="On this page" />
                      </div>
                    )}

                    <div
                      onClick={() => navigate(item)}
                      onMouseEnter={() => setCursor(i)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: item.type === 'page' ? '9px 16px' : '10px 16px',
                        cursor: 'pointer',
                        background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                        transition: 'background 0.1s',
                        borderLeft: isActive ? `2px solid ${item.color}` : '2px solid transparent',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {item.type === 'page' ? (
                          <>
                            <p style={{
                              margin: 0, fontSize: 12,
                              color: isActive ? '#e9d5ff' : 'rgba(255,255,255,0.65)',
                              fontFamily: "'Share Tech Mono',monospace",
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              <HighlightMatch text={item.label} query={query} />
                            </p>
                            <p style={{
                              margin: '2px 0 0', fontSize: 10,
                              color: 'rgba(167,139,250,0.45)',
                              fontFamily: "'Share Tech Mono',monospace",
                            }}>
                              &lt;{item.desc}&gt;
                            </p>
                          </>
                        ) : (
                          <>
                            <p style={{
                              margin: 0, fontSize: 13, color: '#fff',
                              fontFamily: "'Share Tech Mono',monospace", fontWeight: 700,
                            }}>
                              <HighlightMatch text={item.label} query={query} />
                            </p>
                            <p style={{
                              margin: '1px 0 0', fontSize: 11,
                              color: 'rgba(255,255,255,0.3)',
                              fontFamily: "'Share Tech Mono',monospace",
                            }}>
                              {item.desc}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Type badge */}
                      <span style={{
                        fontSize: 9, flexShrink: 0,
                        color: isActive ? hexToRgba(item.color, 0.7) : 'rgba(255,255,255,0.18)',
                        fontFamily: "'Share Tech Mono',monospace",
                        transition: 'color 0.15s',
                      }}>
                        {TYPE_LABELS[item.type]}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}

              {searching && (
                <p style={{
                  textAlign: 'center', padding: '8px 0',
                  color: 'rgba(167,139,250,0.4)', fontSize: 10,
                  fontFamily: "'Share Tech Mono',monospace",
                }}>
                  scanning page…
                </p>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '8px 16px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', gap: 14, alignItems: 'center',
            }}>
              {[['↑↓', 'navigate'], ['↵', 'select'], ['esc', 'close']].map(([key, label]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <kbd style={{
                    fontSize: 9, padding: '2px 5px', borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.03)',
                    fontFamily: "'Share Tech Mono',monospace",
                  }}>{key}</kbd>
                  <span style={{
                    fontSize: 10, color: 'rgba(255,255,255,0.18)',
                    fontFamily: "'Share Tech Mono',monospace",
                  }}>{label}</span>
                </div>
              ))}

              {hasPageHits && (
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#a78bfa', opacity: 0.7 }} />
                  <span style={{ fontSize: 9, color: 'rgba(167,139,250,0.5)', fontFamily: "'Share Tech Mono',monospace" }}>
                    {pageResults.length} on page
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;