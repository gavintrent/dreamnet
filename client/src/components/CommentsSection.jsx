import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StarrySky from './StarrySky';

const MIN_DISTANCE = 200; // Increased minimum distance between comments
const MAX_COMMENTS = 20; // Maximum comments to display
const MIN_HEIGHT = 400; // Minimum height in pixels
const MAX_HEIGHT = 1200; // Increased maximum height to accommodate better spacing
const COMMENT_WIDTH = 180; // Reduced width of comment bubbles
const COMMENT_HEIGHT = 120; // Approximate height of comment bubbles with tail

export default function CommentsSection({
  comments,
  replyingTo,
  setReplyingTo,
  newComment,
  setNewComment,
  submitComment,
}) {
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);

  // Memoize StarrySky to prevent re-renders
  const memoizedStarrySky = useMemo(() => (
    <StarrySky
      starCount={60}
      yRange={[5, 95]}
      xRange={[5, 95]}
      includeMoon={false}
    />
  ), []);

  // Filter to only top-level comments and limit to most recent
  const topLevelComments = comments
    .filter(c => c.parent_id === null)
    .slice(-MAX_COMMENTS);

  // Calculate dynamic height based on comment count and positioning needs
  const commentCount = topLevelComments.length;
  const baseHeight = commentCount * COMMENT_HEIGHT;
  const spacingBuffer = commentCount * 50; // Additional space for positioning
  const dynamicHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, baseHeight + spacingBuffer));

  // Memoize comment positions to prevent constant re-rendering
  const memoizedPositions = useMemo(() => {
    if (topLevelComments.length === 0) return [];

    // Use actual container dimensions instead of hardcoded values
    const containerWidth = 1200; // Use a more reasonable container width for better spacing
    const containerHeight = dynamicHeight; // Container height in pixels
    
    // Convert pixel dimensions to percentages for positioning
    const commentWidthPercent = (COMMENT_WIDTH / containerWidth) * 100;
    const commentHeightPercent = (COMMENT_HEIGHT / containerHeight) * 100;
    
    // Calculate the radius needed for each comment (using the larger dimension)
    const commentRadius = Math.max(COMMENT_WIDTH, COMMENT_HEIGHT) / 2;
    const minSpacing = MIN_DISTANCE + commentRadius;
    
    // Convert minSpacing to percentage - FIXED calculation
    const minSpacingPercent = (minSpacing / containerWidth) * 100;
    
    // Ensure minimum spacing is never too small (at least 5% of container width)
    const safeMinSpacing = Math.max(minSpacingPercent, 5);
    
    console.log('Spacing debug:', {
      MIN_DISTANCE,
      commentRadius,
      minSpacing,
      minSpacingPercent,
      safeMinSpacing,
      commentWidthPercent,
      commentHeightPercent,
      containerWidth
    });
    
    // Simple random placement with collision detection
    const positions = [];
    let attempts = 0;
    const maxAttempts = 1000; // Maximum attempts per comment
    
    for (let i = 0; i < topLevelComments.length; i++) {
      let placed = false;
      let x, y;
      
      // Try to place this comment
      while (!placed && attempts < maxAttempts) {
        attempts++;
        
        // Generate random position
        x = Math.random() * 80 + 10; // 10% to 90% (adds 10% margin on each side)
        y = Math.random() * 80 + 10; // 10% to 90% (adds 10% margin on each side)
        
        // Check if this position overlaps with any existing comment
        let hasCollision = false;
        for (const existingPos of positions) {
          // Calculate centers of both comments
          const currentCenterX = x + commentWidthPercent / 2;
          const currentCenterY = y + commentHeightPercent / 2;
          const existingCenterX = existingPos.x + commentWidthPercent / 2;
          const existingCenterY = existingPos.y + commentHeightPercent / 2;
          
          // Calculate distance between centers
          const dx = currentCenterX - existingCenterX;
          const dy = currentCenterY - existingCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Check if centers are too close (using the minimum spacing requirement)
          if (distance < safeMinSpacing) {
            hasCollision = true;
            console.log(`Collision detected: distance=${distance.toFixed(2)}, minSpacing=${safeMinSpacing.toFixed(2)}`);
            break;
          }
        }
        
        // If no collision, place the comment
        if (!hasCollision) {
          positions.push({ x, y });
          placed = true;
          console.log(`Comment ${i} placed at (${x.toFixed(2)}, ${y.toFixed(2)})`);
        }
      }
      
      // If we couldn't place the comment after max attempts, 
      // we need to expand the space
      if (!placed) {
        console.warn(`Could not place comment ${i} after ${maxAttempts} attempts. Space may be too constrained.`);
        
        // Place it anyway at a safe distance from the last placed comment
        if (positions.length > 0) {
          const lastPos = positions[positions.length - 1];
          
          // Calculate centers for proper distance measurement
          const lastCenterX = lastPos.x + commentWidthPercent / 2;
          const lastCenterY = lastPos.y + commentHeightPercent / 2;
          
          const safeDistance = safeMinSpacing * 1.2; // 20% extra spacing
          const angle = Math.random() * Math.PI * 2;
          
          // Place new comment center at safe distance from last comment center
          const newCenterX = lastCenterX + Math.cos(angle) * safeDistance;
          const newCenterY = lastCenterY + Math.sin(angle) * safeDistance;
          
          // Convert center position back to top-left positioning point
          x = newCenterX - commentWidthPercent / 2;
          y = newCenterY - commentHeightPercent / 2;
          
          // Ensure within bounds
          x = Math.max(10, Math.min(90 - commentWidthPercent, x));
          y = Math.max(10, Math.min(90 - commentHeightPercent, y));
          
          positions.push({ x, y });
          console.log(`Comment ${i} placed via fallback at (${x.toFixed(2)}, ${y.toFixed(2)})`);
        } else {
          // Fallback: place in center
          positions.push({
            x: 50 - commentWidthPercent / 2,
            y: 50 - commentHeightPercent / 2
          });
          console.log(`Comment ${i} placed in center`);
        }
      }
    }
    
    console.log('Final positions:', positions);
    return positions;
  }, [topLevelComments.length, dynamicHeight]); // Include dynamicHeight in dependencies

  return (
    <div className="relative w-full mx-auto overflow-hidden" style={{ minHeight: `${dynamicHeight}px` }}>

      <div className="relative">
        {memoizedStarrySky}

        {/* Comment Bubbles */}
        <div className="relative z-10 w-full" style={{ height: `${dynamicHeight - 100}px` }}>
          {topLevelComments.map((comment, i) => {
            const avatarSrc = comment.user?.avatar?.trim()
              ? comment.user.avatar
              : '/avatars/default-avatar-1.jpg';

            const { x, y } = memoizedPositions[i] || { x: 0, y: 0 };
            const floatOffset = i % 2 === 0 ? 'translate-y-1' : '-translate-y-1';

            return (
              <div
                key={comment.id}
                className={`absolute animate-[floatFade3_6s_ease-in-out_infinite] ${floatOffset} group transition-all`}
                style={{
                  top: `${y}%`,
                  left: `${x}%`,
                  animationDelay: `${(i % 6) * 0.4}s`,
                }}
              >
                {/* Comment Bubble */}
                <div className="max-w-[180px] bg-[#f6eee3] rounded-lg p-3 relative mb-3">
                  {/* Speech bubble tail */}
                  <div className="absolute bottom-0 left-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#f6eee3] transform translate-y-full"></div>
                  
                  <p className="text-black text-sm font-['Jersey_10'] leading-relaxed">
                    {comment.content}
                  </p>
                </div>

                {/* Avatar and Username Row */}
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => navigate(`/users/${comment.username}`)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/40 shadow-lg flex-shrink-0">
                    <img
                      src={avatarSrc}
                      alt={comment.username}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  
                  <div className="text-sm text-white font-pixelify font-bold">
                    @{comment.username}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comment Input */}
        <div className="relative z-20 mt-8 flex justify-center">
          <div className="w-full max-w-md bg-[#f6eee3] border border-gray-400 rounded-lg p-3 shadow-md">
            <textarea
              className="w-full border border-gray-300 rounded-lg px-2 py-1 font-['Jersey_10'] text-sm resize-none focus:outline-none focus:ring-2 ring-highlight bg-white text-black"
              rows={1}
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <button
              onClick={submitComment}
              className="mt-2 w-full bg-highlight text-white text-xs px-3 py-1 rounded-lg hover:bg-[#c54ca6] font-pixelify transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
