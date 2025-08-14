import React, { useMemo } from 'react';
import { ReactComponent as MoonIcon } from '../assets/icons/moon-svgrepo-com.svg';
import { ReactComponent as Star1 } from '../assets/icons/ungroup-svgrepo-com.svg';
import { ReactComponent as Star2 } from '../assets/icons/loader-svgrepo-com.svg';

export default function StarrySky({ 
  starCount = 40, 
  yRange = [5, 55], 
  xRange = [5, 95], 
  includeMoon = true 
}) {
  const stars = useMemo(() => {
    const MIN_DISTANCE = 8;
    const MAX_ATTEMPTS = 100;
    const generated = [];
    const placed = [];

    for (let i = 0; i < starCount; i++) {
      let attempts = 0;
      let x, y;
      let tooClose;

      do {
        x = Math.random() * (xRange[1] - xRange[0]) + xRange[0];
        y = Math.random() * (yRange[1] - yRange[0]) + yRange[0]; // eslint-disable-next-line
        tooClose = placed.some(p => Math.hypot(p.x - x, p.y - y) < MIN_DISTANCE);
        attempts++;
      } while (tooClose && attempts < MAX_ATTEMPTS);

      if (attempts < MAX_ATTEMPTS) {
        placed.push({ x, y });
        generated.push({
          x,
          y,
          delay: Math.random() * 4,
          variant: Math.random() < 0.5 ? 'star1' : 'star2',
        });
      }
    }

    return generated;
  }, [starCount, yRange, xRange]);

  return (
    <>
      {/* Moon - conditionally rendered */}
      {includeMoon && (
        <div 
          className="absolute w-12 h-12 text-yellow-200 animate-pulse-slow z-0"
          style={{
            top: `${yRange[0]}%`,
            right: `${100 - xRange[1]}%`,
          }}
        >
          <MoonIcon className="w-full h-full fill-current" />
        </div>
      )}

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
              animationDelay: `${star.delay}s`,
            }}
          >
            <StarComp className="w-full h-full fill-current opacity-80" />
          </div>
        );
      })}
    </>
  );
}