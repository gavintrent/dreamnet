import React, { useEffect, useState } from 'react';
import api from '../api';
import DreamGrid from '../components/DreamGrid';

export default function Home({ loggedIn }) {
  const [feedType, setFeedType] = useState('discover'); // 'following' or 'discover'
  const [users, setUsers] = useState([]);

  // Two-state cache for each feed
  const [discoverState, setDiscoverState] = useState({
    dreams: [],
    page: 0,
    hasMore: true,
    scrollY: 0,
  });
  const [followingState, setFollowingState] = useState({
    dreams: [],
    scrollY: 0,
  });

  // Pick the current state based on active feed
  const currentState = feedType === 'discover' ? discoverState : followingState;
  const { dreams, page, hasMore } = currentState;

  // Helper to switch feeds and save scroll position
  const switchFeed = async (newFeed) => {
  if (newFeed === 'discover' && discoverState.dreams.length === 0) {
    // Preload discover dreams before switching tab
    await fetchDiscover(0, true);
  }

  // Save current scroll position
  if (feedType === 'discover') {
    setDiscoverState(prev => ({ ...prev, scrollY: window.scrollY }));
  } else {
    setFollowingState(prev => ({ ...prev, scrollY: window.scrollY }));
  }

  setFeedType(newFeed);
};

  // Fetch a page of discover dreams
  const fetchDiscover = async (pageToFetch = 0, reset = false) => {
    try {
      const res = await api.get(`/dreams/discover?page=${pageToFetch}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const newDreams = res.data;

      setDiscoverState(prev => {
        const combined = reset ? newDreams : [...prev.dreams, ...newDreams];
        return {
          ...prev,
          dreams: combined,
          page: reset ? 1 : prev.page + 1,
          hasMore: newDreams.length === 20,
          scrollY: reset ? 0 : prev.scrollY,
        };
      });
    } catch (err) {
      console.error('Failed to fetch discover dreams:', err);
    }
  };

  // Effect: on feedType or login change, restore or fetch data
  useEffect(() => {
  if (!loggedIn) return;

  // Fetch usernames once
  api.get('/users/usernames')
    .then(userRes => {
      setUsers(userRes.data.map(u => ({ id: u, display: u })));
    })
    .catch(err => console.error('Failed to fetch users:', err));

  const cache = currentState;

  if (cache.dreams.length) {
    setTimeout(() => window.scrollTo(0, cache.scrollY), 0);
  } else {
    window.scrollTo(0, 0);
    if (feedType === 'discover') {
      fetchDiscover(0, true);
    }

    // preload the following feed *without switching to it*
    api.get('/feed', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setFollowingState(prev => ({
        ...prev,
        dreams: res.data,
        scrollY: 0,
      }));
    }).catch(err => console.error('Failed to preload following feed:', err));
  }
}, [feedType, loggedIn, currentState]);


  // Infinite scroll for discover feed
  useEffect(() => {
    if (feedType !== 'discover' || !hasMore) return;

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        fetchDiscover(page);
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
            <div className="absolute inset-0 bg-[#EB5FC1] rounded-full z-0" />

            {/* Active Tab Outline */}
            <div
              className={`absolute left-[2px] top-[2px] bottom-[2px] w-[calc(50%-4px)] rounded-full border-4 border-[#FFFFF2] transition-transform duration-300 z-10 pointer-events-none`}
              style={{
                transform: feedType === 'following'
                  ? 'translateX(calc(100% + 4px))'
                  : 'translateX(0%)',
              }}
            />

            {/* Tabs */}
            <div className="flex w-full max-w-md relative z-20 rounded-full overflow-hidden">
              <button
                className={`w-1/2 font-pixelify text-lg py-3 px-4 transition-all duration-200 ${
                  feedType === 'discover'
                    ? 'text-[#4c2f6f]'
                    : 'text-[#4c2f6f] text-opacity-50'
                }`}
                onClick={() => switchFeed('discover')}
              >
                Discover
              </button>

              <button
                className={`w-1/2 font-pixelify text-lg py-3 px-4 transition-all duration-200 ${
                  feedType === 'following'
                    ? 'text-white'
                    : 'text-white text-opacity-50'
                }`}
                onClick={() => switchFeed('following')}
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
        <div key={feedType} className={`retro-fade-in`}>
          <DreamGrid dreams={dreams} users={users} />
        </div>
      )}
    </div>
  );
}
