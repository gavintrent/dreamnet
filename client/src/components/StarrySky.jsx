// src/components/StarrySky.jsx
import React, { useEffect, useState } from 'react';
import { ReactComponent as MoonIcon } from '../assets/icons/moon-svgrepo-com.svg';
import { ReactComponent as Star1 } from '../assets/icons/ungroup-svgrepo-com.svg';
import { ReactComponent as Star2 } from '../assets/icons/loader-svgrepo-com.svg';

const STAR_COUNT = 40;

export default function StarrySky({ starCount = STAR_COUNT }) {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const MIN_DISTANCE = 8;
    const MAX_ATTEMPTS = 100;
    const generatedStars = [];
    const placed = [];

    for (let i = 0; i < starCount; i++) {
      let attempts = 0;
      let x, y;
      let tooClose;

      do {
        x = Math.random() * 85 + 5;
        y = Math.random() * 50 + 5;
        tooClose = placed.some(p => Math.hypot(p.x - x, p.y - y) < MIN_DISTANCE);
        attempts++;
      } while (tooClose && attempts < MAX_ATTEMPTS);

      if (attempts < MAX_ATTEMPTS) {
        placed.push({ x, y });
        generatedStars.push({
          x,
          y,
          delay: Math.random() * 3,
          variant: Math.random() < 0.5 ? 'star1' : 'star2',
        });
      }
    }

    setStars(generatedStars);
  }, [starCount]);

  return (
    <>
      {/* Moon */}
      <div className="absolute top-4 right-16 w-12 h-12 text-yellow-200 animate-pulse-slow z-0">
        <MoonIcon className="w-full h-full fill-current" />
      </div>

      {/* Stars */}
      {stars.map((star, idx) => {
        const StarComp = star.variant === 'star1' ? Star1 : Star2;
        return (
          <div
            key={idx}
            className="absolute z-0 text-yellow-200 animate-twinkle"
            style={{
              top: `${star.y}%`,
              left: `${star.x}%`,
              width: '18px',
              height: '18px',
              animationDelay: `${star.delay}s`
            }}
          >
            <StarComp className="w-full h-full fill-current opacity-80" />
          </div>
        );
      })}
    </>
  );
}