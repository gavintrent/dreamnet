// components/NotificationDropdown.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000); // in seconds

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationDropdown({ notifications, onClose }) {
  const navigate = useNavigate();

  const handleClick = (username) => {
    navigate(`/users/${username}`);
    onClose();
  };

  return (
    <div className="absolute right-4 top-16 z-50 w-80 max-w-full rounded-box bg-base-100 p-4 shadow-md text-black">
      <h3 className="text-lg font-pixelify mb-2">Notifications</h3>
      {notifications.length === 0 ? (
        <p className="text-sm text-gray-500">No mentions yet.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n, idx) => (
            <li
              key={idx}
              onClick={() => handleClick(n.from_username)}
              className="cursor-pointer hover:bg-gray-200 rounded px-2 py-1"
            >
              <div>
                <span className="font-semibold text-[#d40f95]">@{n.from_username}</span> dreamt of you!
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{timeAgo(n.created_at)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}