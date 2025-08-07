'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

function generateStars(count, starColor) {
  const shadows = [];

  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 4000) - 2000;
    const y = Math.floor(Math.random() * 4000) - 2000;

    shadows.push(`${x}px ${y}px ${starColor}`);
  }

  return shadows.join(', ');
}

function StarLayer({
  count = 1000,
  size = 1,
  transition = { repeat: Infinity, duration: 50, ease: 'linear' },
  starColor = '#fff',
  className,
  ...props
}) {
  const [boxShadow, setBoxShadow] = useState('');

  useEffect(() => {
    setBoxShadow(generateStars(count, starColor));
  }, [count, starColor]);

  return (
    <motion.div
      animate={{ y: [0, -2000] }}
      className={cn('absolute top-0 left-0 w-full h-[2000px]', className)}
      data-slot="star-layer"
      transition={transition}
      {...props}
    >
      <div
        className="absolute bg-transparent rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow,
        }}
      />
      <div
        className="absolute bg-transparent rounded-full top-[2000px]"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow,
        }}
      />
    </motion.div>
  );
}

function StarsBackground({
  children,
  className,
  factor = 0.05,
  speed = 50,
  transition = { stiffness: 50, damping: 20 },
  starColor = '#fff',
  pointerEvents = true,
  ...props
}) {
  const offsetX = useMotionValue(1);
  const offsetY = useMotionValue(1);

  const springX = useSpring(offsetX, transition);
  const springY = useSpring(offsetY, transition);

  const handleMouseMove = useCallback(
    (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const newOffsetX = -(e.clientX - centerX) * factor;
      const newOffsetY = -(e.clientY - centerY) * factor;

      offsetX.set(newOffsetX);
      offsetY.set(newOffsetY);
    },
    [offsetX, offsetY, factor]
  );

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_#111_0%,_#000_100%)]',
        className
      )}
      data-slot="stars-background"
      onMouseMove={handleMouseMove}
      {...props}
    >
      <motion.div
        className={pointerEvents ? '' : 'pointer-events-none'}
        style={{ x: springX, y: springY }}
      >
        <StarLayer
          count={1000}
          size={1}
          starColor={starColor}
          transition={{ repeat: Infinity, duration: speed, ease: 'linear' }}
        />
        <StarLayer
          count={400}
          size={2}
          starColor={starColor}
          transition={{ repeat: Infinity, duration: speed * 2, ease: 'linear' }}
        />
        <StarLayer
          count={200}
          size={3}
          starColor={starColor}
          transition={{ repeat: Infinity, duration: speed * 3, ease: 'linear' }}
        />
      </motion.div>
      {children}
      
    </div>
  );
}

export { StarLayer, StarsBackground };