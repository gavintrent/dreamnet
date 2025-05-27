import React, { useEffect, useState } from 'react';
import api from '../api';
import DreamEntry from '../components/DreamEntry';

export default function Home({ loggedIn }) {
  const [feedType, setFeedType] = useState('discover'); // 'following' or 'discover'
  const [dreams, setDreams] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0); // page = number of batches loaded
  const [hasMore, setHasMore] = useState(true);

  const fetchDreams = async (pageToFetch = 0, reset = false) => {
    try {
      const res = await api.get(`/dreams/discover?page=${pageToFetch}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const newDreams = res.data;

      if (reset) {
        setDreams(newDreams);
        setPage(1);
      } else {
        setDreams(prev => [...prev, ...newDreams]);
        setPage(prev => prev + 1);
      }

      setHasMore(newDreams.length === 20);
    } catch (err) {
      console.error('Failed to fetch discover dreams:', err);
    }
  };


  useEffect(() => {
  if (!loggedIn) return;

  const fetchInitialData = async () => {
    try {
      const userRes = await api.get('/users/usernames');
      setUsers(userRes.data.map(u => ({ id: u, display: u })));

      if (feedType === 'following') {
        const res = await api.get('/feed', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setDreams(res.data);
      } else {
        fetchDreams(0, true);
      }
    } catch (err) {
      console.error('Failed to fetch dreams:', err);
    }
  };

  fetchInitialData();
}, [feedType, loggedIn]);

useEffect(() => {
  if (feedType !== 'discover' || !hasMore) return;

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      >= document.documentElement.offsetHeight - 100
    ) {
      fetchDreams(page);
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [feedType, hasMore, page]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🌙 Welcome to DreamNet</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setFeedType('discover')}
          style={{ fontWeight: feedType === 'discover' ? 'bold' : 'normal' }}
        >
          Discover
        </button>
        {' | '}
        <button
          onClick={() => setFeedType('following')}
          style={{ fontWeight: feedType === 'following' ? 'bold' : 'normal' }}
        >
          Following
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
