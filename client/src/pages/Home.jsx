import React, { useEffect, useState } from 'react';
import api from '../api';
import DreamGrid from '../components/DreamGrid';

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
    <div className="p-8">
      <div className="sticky top-[4.25rem] z-30 bg-transparent pt-4">
        <div className="flex justify-center mb-4 gap-4">
<div className="relative flex justify-center mb-6">
  {/* Outer Pill Background */}
  <div className="absolute inset-0 bg-[#d40f95] rounded-full z-0" />

  {/* Active Tab Outline */}
  <div
    className={`absolute left-[2px] top-[2px] bottom-[2px] w-[calc(50%-4px)] rounded-full border-4 border-[#5e0943] transition-transform duration-300 z-10 pointer-events-none`}
    style={{
      transform: feedType === 'following' ? 'translateX(calc(100% + 4px))' : 'translateX(0%)',
    }}
  />

  {/* Tabs */}
  <div className="flex w-full max-w-md relative z-20 rounded-full overflow-hidden">
    <button
      className={`w-1/2 font-pixelify text-lg py-3 px-4 transition-all duration-200 ${
        feedType === 'discover'
          ? 'text-white'
          : 'text-white text-opacity-50'
      }`}
      onClick={() => setFeedType('discover')}
    >
      Discover
    </button>

    <button
      className={`w-1/2 font-pixelify text-lg py-3 px-4 transition-all duration-200 ${
        feedType === 'following'
          ? 'text-white'
          : 'text-white text-opacity-50'
      }`}
      onClick={() => setFeedType('following')}
    >
      Following
    </button>
  </div>
</div>



        </div>
      </div>

      {dreams.length === 0 ? (
        <p className="text-center">No dreams to show.</p>
      ) : (
        <DreamGrid dreams={dreams} users={users} />
      )}
    </div>
  );
}
