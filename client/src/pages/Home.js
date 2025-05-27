import React, { useEffect, useState } from 'react';
import api from '../api';
import DreamEntry from '../components/DreamEntry';

export default function Home() {
  const [feed, setFeed] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    api.get('/feed', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setFeed(res.data))
      .catch(err => console.error('Failed to fetch feed', err));

    api.get('/users/usernames')
      .then(res => {
        setUsers(res.data.map(u => ({ id: u, display: u })));
      })
      .catch(err => console.error('Failed to load users', err));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🌙 Welcome to DreamNet</h1>
      <p>A social dream journal where you can record and share your dreams with others.</p>

      {feed.length === 0 ? (
        <p style={{ marginTop: '2rem' }}>No dreams to show yet. Follow others to see their dreams here.</p>
      ) : (
        feed.map(dream => (
          <DreamEntry key={dream.id} dream={dream} users={users} />
        ))
      )}
    </div>
  );
}