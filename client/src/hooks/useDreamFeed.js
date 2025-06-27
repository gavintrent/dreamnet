import { useEffect, useState, useCallback } from 'react';
import api from '../api';

export default function useDreamFeed(loggedIn, feedType) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Fetch DISCOVER dreams (paginated)
  const fetchDiscover = useCallback(async (page = 0, reset = false) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await api.get(`/dreams/discover?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const newDreams = res.data;

      setDiscoverState(prev => {
        const all = reset ? newDreams : [...prev.dreams, ...newDreams];
        const unique = Array.from(new Map(all.map(d => [d.id, d])).values());

        return {
          dreams: unique,
          page: reset ? 1 : prev.page + 1,
          hasMore: newDreams.length === 20,
          scrollY: reset ? 0 : prev.scrollY,
        };
      });
    } catch (err) {
      console.error('Failed to fetch discover dreams:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Fetch FOLLOWING dreams (static)
  const fetchFollowing = useCallback(async () => {
    try {
      const res = await api.get('/feed', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFollowingState(prev => ({
        dreams: res.data,
        scrollY: prev.scrollY || 0
      }));
    } catch (err) {
      console.error('Failed to fetch following feed:', err);
    }
  }, []);

  // Load user mentions
  useEffect(() => {
    if (!loggedIn) return;

    api.get('/users/usernames')
      .then(res => {
        setUsers(res.data.map(u => ({ id: u, display: u })));
      })
      .catch(err => console.error('Failed to fetch users:', err));
  }, [loggedIn]);

  // Load Discover feed & scroll position on tab switch
  useEffect(() => {
    if (!loggedIn || feedType !== 'discover') return;

    window.scrollTo(0, discoverState.scrollY);

    if (discoverState.dreams.length === 0) {
      fetchDiscover(0, true);
    }
  }, [
    loggedIn, 
    feedType, 
    discoverState.scrollY, 
    discoverState.dreams.length, 
    fetchDiscover,
  ]);

  // Load Following feed & scroll position on tab switch
  useEffect(() => {
    if (!loggedIn || feedType !== 'following') return;

    window.scrollTo(0, followingState.scrollY);

    if (followingState.dreams.length === 0) {
      fetchFollowing();
    }
  }, [
  loggedIn,
  feedType,
  followingState.scrollY,
  followingState.dreams.length,
  fetchFollowing,
]);

  // Save scrollY on scroll
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      if (feedType === 'discover') {
        setDiscoverState(prev => ({ ...prev, scrollY: y }));
      } else if (feedType === 'following') {
        setFollowingState(prev => ({ ...prev, scrollY: y }));
      }

      // Infinite scroll only for discover
      if (
        feedType === 'discover' &&
        !isLoading &&
        discoverState.hasMore &&
        window.innerHeight + y >= document.documentElement.scrollHeight - 100
      ) {
        fetchDiscover(discoverState.page);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [feedType, discoverState.hasMore, discoverState.page, isLoading, fetchDiscover]);

  const currentState = feedType === 'discover' ? discoverState : followingState;

  return {
    users,
    dreams: currentState?.dreams || [],
    hasMore: discoverState?.hasMore ?? false,
    page: discoverState?.page ?? 0,
    fetchDiscover,
    setDiscoverState,
    setFollowingState,
  };
}
