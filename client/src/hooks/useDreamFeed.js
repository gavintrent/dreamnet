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

  // Fetch users list on login
  useEffect(() => {
    if (!loggedIn) return;

    api.get('/users/usernames')
      .then(userRes => {
        setUsers(userRes.data.map(u => ({ id: u, display: u })));
      })
      .catch(err => console.error('Failed to fetch users:', err));
  }, [loggedIn]);

  // Load DISCOVER feed
  useEffect(() => {
    if (!loggedIn || feedType !== 'discover') return;

    if (discoverState.dreams.length === 0) {
      window.scrollTo(0, 0);
      fetchDiscover(0, true);
    } else {
      setTimeout(() => window.scrollTo(0, discoverState.scrollY), 0);
    }
  }, [loggedIn, feedType, discoverState.dreams.length, discoverState.scrollY, fetchDiscover]);

  // Load FOLLOWING feed
  useEffect(() => {
    if (!loggedIn || feedType !== 'following') return;

    if (followingState.dreams.length === 0) {
      window.scrollTo(0, 0);
      api.get('/feed', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => {
        setFollowingState({ dreams: res.data, scrollY: 0 });
      })
      .catch(err => console.error('Failed to fetch following feed:', err));
    } else {
      setTimeout(() => window.scrollTo(0, followingState.scrollY), 0);
    }
  }, [loggedIn, feedType, followingState.dreams.length, followingState.scrollY]);

  // Infinite scroll handling (only for discover feed)
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

  const currentState = feedType === 'discover' ? discoverState : followingState;

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