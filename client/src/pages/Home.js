import React, { useEffect, useState } from 'react';
import api from '../api';
import DreamEntry from '../components/DreamEntry';

export default function Home({ loggedIn }) {
  const [feedType, setFeedType] = useState('following'); // 'following' or 'discover'
  const [dreams, setDreams] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!loggedIn) return;

    const fetchData = async () => {
      try {
        const [dreamRes, userRes] = await Promise.all([
          api.get(feedType === 'following' ? '/feed' : '/dreams/discover', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          api.get('/users/usernames')
        ]);

        setDreams(dreamRes.data);
        setUsers(userRes.data.map(u => ({ id: u, display: u })));
      } catch (err) {
        console.error('Failed to fetch dreams:', err);
      }
    };

    fetchData();
  }, [feedType, loggedIn]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🌙 Welcome to DreamNet</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setFeedType('following')}
          style={{ fontWeight: feedType === 'following' ? 'bold' : 'normal' }}
        >
          Following
        </button>
        {' | '}
        <button
          onClick={() => setFeedType('discover')}
          style={{ fontWeight: feedType === 'discover' ? 'bold' : 'normal' }}
        >
          Discover
        </button>
      </div>

      {dreams.length === 0 ? (
        <p>No dreams to show.</p>
      ) : (
        dreams.map((dream) => (
          <DreamEntry key={dream.id} dream={dream} users={users} />
        ))
      )}
    </div>
  );
}
