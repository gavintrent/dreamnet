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
      <button className="btn btn-ghost hover:bg-[#52489f] btn-circle shadow-none border-none w-10 h-10 min-h-0" onClick={() => setOpen((o) => !o)}>
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
          <img src={avatarUrl} alt="profile" className="w-full h-full object-cover" />
        </div>
      </button>

      {open && (
        <ul className="absolute min-w-[6rem] top-12 z-50 w-60 max-w-full rounded-2xl bg-highlight p-4 shadow-none text-black jersey-10-regular space-y-2">
          {items.map(({ label, action }) => (
            <li key={label}>
              <button
                className="w-full text-left px-2 py-1 hover:bg-gray-200 rounded text-[#4c2f6f] font-semibold"
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
