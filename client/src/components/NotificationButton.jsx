import React, { useState, useEffect, useRef } from 'react';
import NotificationDropdown from './NotificationDropdown';
import { ReactComponent as PixelBellIcon } from '../assets/icons/notification-svgrepo-com.svg';
import api from '../api';

export default function NotificationButton() {
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const wrapperRef = useRef(null);

  // Fetch notifications when dropdown is shown
  useEffect(() => {
    if (showNotif) {
      const fetchNotifications = async () => {
        try {
          const res = await api.get('/notifications', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setNotifications(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          console.error('Failed to fetch notifications:', err);
          setNotifications([]);
        }
      };
      fetchNotifications();
    }
  }, [showNotif]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    };

    if (showNotif) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotif]);

  return (
    <div ref={wrapperRef}>
      <button
        className="w-10 h-10 min-h-0 rounded-full bg-transparent hover:bg-[#52489f] transition-colors duration-200 flex items-center justify-center border-none shadow-none focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 focus:ring-offset-[#28243d]"
        onClick={() => setShowNotif((n) => !n)}
      >
        <div className="indicator">
          <PixelBellIcon className="w-6 h-6 text-highlight" />
        </div>
      </button>

      {showNotif && (
        <NotificationDropdown
          notifications={notifications}
          onClose={() => setShowNotif(false)}
        />
      )}
    </div>
  );
}
