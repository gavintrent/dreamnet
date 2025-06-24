// hooks/useDreamFeed.js
import { useEffect, useState, useCallback } from 'react';
import api from '../api';

export default function useDreamFeed(loggedIn, feedType) {
  const [users, setUsers] = useState([]);

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

  const currentState = feedType === 'discover' ? discoverState : followingState;

  const fetchDiscover = useCallback(async (pageToFetch = 0, reset = false) => {
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
  }, []);

  useEffect(() => {
    if (!loggedIn) return;

    api.get('/users/usernames')
      .then(userRes => {
        setUsers(userRes.data.map(u => ({ id: u, display: u })));
      })
      .catch(err => console.error('Failed to fetch users:', err));

    if (currentState.dreams.length) {
      setTimeout(() => window.scrollTo(0, currentState.scrollY), 0);
    } else {
      window.scrollTo(0, 0);
      if (feedType === 'discover') fetchDiscover(0, true);

      api.get('/feed', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(res => {
        setFollowingState({ dreams: res.data, scrollY: 0 });
      }).catch(err => console.error('Failed to preload following feed:', err));
    }
  }, [loggedIn, feedType, currentState, fetchDiscover]);

  const handleScroll = useCallback(() => {
    if (
      feedType === 'discover' &&
      discoverState.hasMore &&
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
    ) {
      fetchDiscover(discoverState.page);
    }
  }, [feedType, discoverState, fetchDiscover]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    users,
    dreams: currentState.dreams,
    hasMore: discoverState.hasMore,
    page: discoverState.page,
    setDiscoverState,
    setFollowingState,
    discoverState,
    followingState,
    fetchDiscover,
  };
}