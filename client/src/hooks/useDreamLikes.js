import { useState, useEffect } from 'react';
import api from '../api';

export default function useDreamLikes(dreamId) {
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    api.get(`/likes/${dreamId}`)
      .then(res => setLikeCount(res.data.count))
      .catch(console.error);

    const token = localStorage.getItem('token');
    if (token) {
      api.get(`/likes/${dreamId}/user`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setLiked(res.data.liked))
        .catch(console.error);
    }
  }, [dreamId]);

  const toggleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (liked) {
      await api.delete(`/likes/${dreamId}`, { headers: { Authorization: `Bearer ${token}` } });
      setLikeCount(c => c - 1);
    } else {
      await api.post(`/likes/${dreamId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setLikeCount(c => c + 1);
    }
    setLiked(!liked);
  };

  return { likeCount, liked, toggleLike };
}
