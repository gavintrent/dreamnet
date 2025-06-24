// components/NotificationButton.jsx
import React, { useState, useEffect } from 'react';
import NotificationDropdown from './NotificationDropdown';
import PixelBellIcon from '../assets/icons/notification-svgrepo-com.svg';
import api from '../api';

export default function NotificationButton() {
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);

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

  return (
    <>
      <button className="btn btn-ghost btn-circle" onClick={() => setShowNotif((n) => !n)}>
        <div className="indicator">
          <img src={PixelBellIcon} alt="Notifications" className="w-6 h-6 object-contain" />
        </div>
      </button>

      {showNotif && (
        <NotificationDropdown
          notifications={notifications || []}
          onClose={() => setShowNotif(false)}
        />
      )}
    </>
  );
}