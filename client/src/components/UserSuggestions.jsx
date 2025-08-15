import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import StarrySky from './StarrySky';
import { getAvatarUrl } from '../utils/avatarUtils';

const MIN_DISTANCE = 12;
const yRange = [10, 90];

export default function UserSuggestions() {
  const [users, setUsers] = useState([]);
  const [positions, setPositions] = useState([]);
  const navigate = useNavigate();

  // Memoize StarrySky to prevent re-renders
  const memoizedStarrySky = useMemo(() => (
    <StarrySky
      starCount={60}
      yRange={yRange}
      includeMoon={false}
    />
  ), []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    api.get('/users/suggestions', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUsers(res.data);

        const placed = [];
        const newPositions = res.data.map(() => {
          let x, y;
          let attempts = 0;
          do {
            x = Math.random() * 90;
            y = Math.random() * 80;
            attempts++;
          } while ( // eslint-disable-next-line
            placed.some(p => Math.hypot(p.x - x, p.y - y) < MIN_DISTANCE) &&
            attempts < 100
          );
          placed.push({ x, y });
          return { x, y };
        });

        setPositions(newPositions);
      })
      .catch(err => console.error('Failed to load suggestions', err));
  }, []);

  return (
    <div className="relative w-3/4 min-h-[100vh] mx-auto overflow-hidden">
      {/* Title */}
      <div className="col-span-full w-full bg-[#f5b841] text-yellow-900 rounded-md p-3 text-center font-pixelify">
        Find other dreamers...
      </div>

      <div className="mt-8 relative">
        
        {memoizedStarrySky}

        {/* Avatars */}
        <div className="relative z-10 w-full h-[80vh] mt-4">
          {users.map((user, i) => {
            const avatarSrc = getAvatarUrl(user.avatar);

            const { x, y } = positions[i] || { x: 0, y: 0 };
            const floatOffset = i % 2 === 0 ? 'translate-y-1' : '-translate-y-1';

            return (
              <div
                key={user.id}
                className={`absolute animate-[floatFade3_6s_ease-in-out_infinite] ${floatOffset} group transition-all`}
                style={{
                  top: `${y}%`,
                  left: `${x}%`,
                  animationDelay: `${(i % 6) * 0.4}s`,
                }}
              >
                <div
                  className="w-16 h-16 rounded-full overflow-hidden border border-white/30 shadow-md hover:shadow-lg hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => navigate(`/users/${user.username}`)}
                >
                  <img
                    src={avatarSrc}
                    alt={user.username}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="mt-1 text-xs text-white text-center font-pixelify truncate max-w-[4.5rem]">
                  {user.name || `@${user.username}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}