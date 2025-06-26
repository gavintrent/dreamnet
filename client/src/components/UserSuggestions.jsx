import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ReactComponent as MoonIcon } from '../assets/icons/moon-svgrepo-com.svg';
import { ReactComponent as Star1 } from '../assets/icons/ungroup-svgrepo-com.svg';
import { ReactComponent as Star2 } from '../assets/icons/loader-svgrepo-com.svg';

const MIN_DISTANCE = 12;
const STAR_COUNT = 50;

export default function UserSuggestions() {
  const [users, setUsers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [starPositions, setStarPositions] = useState([]);
  const navigate = useNavigate();

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
          } while (
            placed.some(p => Math.hypot(p.x - x, p.y - y) < MIN_DISTANCE) &&
            attempts < 100
          );
          placed.push({ x, y });
          return { x, y };
        });

        setPositions(newPositions);

        // Random stars
        const stars = Array.from({ length: STAR_COUNT }, () => ({
          x: Math.random() * 95,
          y: Math.random() * 80 + 10,
          delay: Math.random() * 4,
          variant: Math.random() < 0.5 ? 'star1' : 'star2',
        }));
        setStarPositions(stars);
      })
      .catch(err => console.error('Failed to load suggestions', err));
  }, []);

  return (
    <div className="relative w-3/4 min-h-[100vh] mx-auto overflow-hidden">
      {/* Title */}
      <div className="col-span-full w-full bg-yellow-200 border border-yellow-300 text-yellow-900 rounded-md p-3 text-center font-pixelify">
        Find other dreamers...
      </div>

      <div className="mt-8">
        {/* Moon */}
        <div className="absolute top-24 right-24 z-0 opacity-80 w-10 h-10 animate-pulse-slow text-yellow-200">
          <MoonIcon className="w-full h-full fill-current" />
        </div>

        {/* Stars */}
        {starPositions.map((star, idx) => {
          const StarComponent = star.variant === 'star1' ? Star1 : Star2;
          return (
            <div
              key={idx}
              className="absolute z-0 opacity-60 animate-twinkle text-yellow-200"
              style={{
                top: `${star.y}%`,
                left: `${star.x}%`,
                width: '20px',
                height: '20px',
                animationDelay: `${star.delay}s`
              }}
            >
              <StarComponent className="w-full h-full fill-current" />
            </div>
          );
        })}

        {/* Avatars */}
        <div className="relative z-10 w-full h-[80vh] mt-4">
          {users.map((user, i) => {
            const avatarSrc = user.avatar?.trim()
              ? user.avatar
              : '/avatars/default-avatar-1.jpg';

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