import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AvatarDropdown({ loggedIn, onLogout, avatarUrl }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const nav = useNavigate();
  const location = useLocation();

  const items = [
    location.pathname !== '/' && { label: 'Home', action: '/' },
    location.pathname !== '/dashboard' && { label: 'Profile', action: '/dashboard' },
    ...(!loggedIn
      ? [
          { label: 'Login', action: '/login' },
          { label: 'Register', action: '/register' },
        ]
      : [{ label: 'Logout', action: onLogout }]),
  ].filter(Boolean); // remove falsy items (like `false` or `null`)

  const handleSelect = (act) => {
    setOpen(false);
    typeof act === 'string' ? nav(act) : act();
  };

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button className="btn btn-ghost btn-circle avatar" onClick={() => setOpen((o) => !o)}>
        <div className="w-8 rounded-full">
          <img src={avatarUrl} alt="profile" />
        </div>
      </button>

      {open && (
        <ul className="absolute mt-3 z-50 w-52 p-2 shadow bg-base-100 rounded-box">
          {items.map(({ label, action }) => (
            <li key={label}>
              <button
                className="font-pixelify w-full text-left px-4 py-2 hover:text-gray-300 text-white rounded"
                onClick={() => handleSelect(action)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
