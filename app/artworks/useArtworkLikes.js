'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { ARTWORKS_DATA } from './artworksData';

const SEEDS = Object.fromEntries(ARTWORKS_DATA.map((a) => [a.id, a.likeSeed || 0]));

const LIKED_KEY = 'gagan_art_user_liked';

// Counts live on the server (/api/likes), so every visitor sees the same numbers.
// Which drawings *you* hearted is remembered on this device only.
// Each drawing starts from its `likeSeed` (artworksData.js). Real hearts are added on top.
// Without the API, only your own heart is added on top of the seed.
export function useArtworkLikes() {
  const [counts, setCounts] = useState({});
  const [likedIds, setLikedIds] = useState([]);
  const [justLikedId, setJustLikedId] = useState(null);
  const [shared, setShared] = useState(false);

  const likedRef = useRef([]);
  const sharedRef = useRef(false);
  const seq = useRef({});

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(LIKED_KEY) || '[]');
      if (Array.isArray(stored)) {
        likedRef.current = stored;
        setLikedIds(stored);
      }
    } catch {}

    let alive = true;
    fetch('/api/likes', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive || !d?.counts) return;
        sharedRef.current = true;
        setShared(true);
        setCounts(d.counts);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const toggleLike = useCallback((artId, e) => {
    if (e?.stopPropagation) e.stopPropagation();

    // Read from a ref, never do side effects inside a state updater
    // (React StrictMode runs updaters twice, which is what made the old counter jump by 2).
    const wasLiked = likedRef.current.includes(artId);
    const next = wasLiked ? likedRef.current.filter((id) => id !== artId) : [...likedRef.current, artId];
    const delta = wasLiked ? -1 : 1;

    likedRef.current = next;
    setLikedIds(next);
    try { localStorage.setItem(LIKED_KEY, JSON.stringify(next)); } catch {}

    if (!wasLiked) {
      setJustLikedId(artId);
      setTimeout(() => setJustLikedId((cur) => (cur === artId ? null : cur)), 900);
    } else {
      setJustLikedId(null);
    }

    if (!sharedRef.current) return;

    // Optimistic bump, then trust the server's number
    setCounts((c) => ({ ...c, [artId]: Math.max(0, (c[artId] || 0) + delta) }));
    const mine = (seq.current[artId] = (seq.current[artId] || 0) + 1);

    fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: artId, delta }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (seq.current[artId] === mine && typeof d.count === 'number') {
          setCounts((c) => ({ ...c, [artId]: d.count }));
        }
      })
      .catch(() => {
        if (seq.current[artId] === mine) {
          setCounts((c) => ({ ...c, [artId]: Math.max(0, (c[artId] || 0) - delta) }));
          // roll the heart back too, so UI and server agree
          likedRef.current = wasLiked ? [...likedRef.current, artId] : likedRef.current.filter((id) => id !== artId);
          setLikedIds(likedRef.current);
          try { localStorage.setItem(LIKED_KEY, JSON.stringify(likedRef.current)); } catch {}
        }
      });
  }, []);

  const isLiked = useCallback((artId) => likedIds.includes(artId), [likedIds]);
  const getLikeCount = useCallback(
    (artId) => (SEEDS[artId] || 0) + (shared ? counts[artId] || 0 : likedIds.includes(artId) ? 1 : 0),
    [counts, shared, likedIds]
  );

  return { likes: counts, likedIds, justLikedId, shared, toggleLike, isLiked, getLikeCount };
}