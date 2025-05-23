import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Example protected route to fetch user info
    api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUsername(res.data.username))
    .catch(() => {
      localStorage.removeItem('token');
      navigate('/login');
    });
  }, [navigate]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome back, {username} 🌌</h2>
      <p>Here's your dream journal dashboard. You can view or add new dreams.</p>
    </div>
  );
}
