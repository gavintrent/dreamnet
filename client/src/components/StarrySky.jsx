import React, { useMemo } from 'react';
import { ReactComponent as MoonIcon } from '../assets/icons/moon-svgrepo-com.svg';
import { ReactComponent as Star1 } from '../assets/icons/ungroup-svgrepo-com.svg';
import { ReactComponent as Star2 } from '../assets/icons/loader-svgrepo-com.svg';

export default function StarrySky({ 
  starCount = 40, 
  yRange = [0, 55], 
  xRange = [5, 95], 
  includeMoon = true,
  minDistance = 8
}) {
  const stars = useMemo(() => {
    const MAX_ATTEMPTS = 100;
    const generated = [];
    const placed = [];

    // Moon dimensions and position (if enabled)
    const moonSize = 12; // 12% of container width/height
    const moonOverlapSize = 8; // Smaller size for overlap detection to allow closer star placement
    // Moon is positioned using 'right' CSS property, so calculate its left edge
    const moonLeft = 100 - (100 - xRange[1]) - moonOverlapSize; // Convert right positioning to left edge
    const moonRight = moonLeft + moonOverlapSize;
    const moonTop = yRange[0];
    const moonBottom = moonTop + moonOverlapSize;

    for (let i = 0; i < starCount; i++) {
      let attempts = 0;
      let x, y;
      let tooClose;
      let onMoon;

      do {
        x = Math.random() * (xRange[1] - xRange[0]) + xRange[0];
        y = Math.random() * (yRange[1] - yRange[0]) + yRange[0];
        
        // Check if star is too close to other stars
        tooClose = placed.some(p => Math.hypot(p.x - x, p.y - y) < minDistance);
        
        // Check if star overlaps with moon (only if moon is enabled)
        onMoon = includeMoon && 
          x >= moonLeft && x <= moonRight && 
          y >= moonTop && y <= moonBottom;
        
        attempts++;
      } while ((tooClose || onMoon) && attempts < MAX_ATTEMPTS);

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
  }, [starCount, yRange, xRange, includeMoon, minDistance]);

  return (
    <>
      {/* Moon - conditionally rendered */}
      {includeMoon && (
        <div 
          className="absolute w-12 h-12 text-[#f5b841] animate-pulse-slow z-0"
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
            className="absolute z-0 text-[#f5b841] animate-twinkle"
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