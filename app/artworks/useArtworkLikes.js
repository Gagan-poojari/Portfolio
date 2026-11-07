'use client';
import { useState, useEffect, useCallback } from 'react';

export const BASE_LIKES = {
  'ronaldo-goat': 42,
  'paul-walker': 58,
  'radha-krishna-eyes': 64,
  'ronaldo-portrait': 37,
  'falling-in-eyes': 29,
};

export function useArtworkLikes() {
  const [likes, setLikes] = useState(BASE_LIKES);
  const [likedIds, setLikedIds] = useState([]);
  const [justLikedId, setJustLikedId] = useState(null);

  // Hydrate from localStorage once mounted
  useEffect(() => {
    try {
      const storedLikes = localStorage.getItem('gagan_art_likes');
      const storedLikedIds = localStorage.getItem('gagan_art_user_liked');
      
      if (storedLikes) {
        const parsed = JSON.parse(storedLikes);
        setLikes(prev => ({ ...prev, ...parsed }));
      }
      if (storedLikedIds) {
        setLikedIds(JSON.parse(storedLikedIds));
      }
    } catch (err) {
      console.warn('Could not read artwork likes from localStorage', err);
    }
  }, []);

  const toggleLike = useCallback((artId, e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    setLikedIds(prevLiked => {
      const isAlreadyLiked = prevLiked.includes(artId);
      const nextLiked = isAlreadyLiked
        ? prevLiked.filter(id => id !== artId)
        : [...prevLiked, artId];

      if (!isAlreadyLiked) {
        setJustLikedId(artId);
        setTimeout(() => setJustLikedId(prev => (prev === artId ? null : prev)), 1000);
      } else {
        setJustLikedId(null);
      }

      try {
        localStorage.setItem('gagan_art_user_liked', JSON.stringify(nextLiked));
      } catch (err) {}

      setLikes(prevCounts => {
        const currentCount = prevCounts[artId] ?? BASE_LIKES[artId] ?? 0;
        const nextCount = isAlreadyLiked ? Math.max(0, currentCount - 1) : currentCount + 1;
        const nextCounts = { ...prevCounts, [artId]: nextCount };
        try {
          localStorage.setItem('gagan_art_likes', JSON.stringify(nextCounts));
        } catch (err) {}
        return nextCounts;
      });

      return nextLiked;
    });
  }, []);

  const isLiked = useCallback((artId) => likedIds.includes(artId), [likedIds]);
  const getLikeCount = useCallback((artId) => likes[artId] ?? BASE_LIKES[artId] ?? 0, [likes]);

  return {
    likes,
    likedIds,
    justLikedId,
    toggleLike,
    isLiked,
    getLikeCount,
  };
}
