import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import DreamEntry from '../components/DreamEntry';

export default function PublicProfile( { loggedIn, currentUser }) {
  const { username } = useParams();
  const [dreams, setDreams] = useState([]);
  const [users, setUsers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [profile, setProfile] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/users/${username}/dreams`);
        setDreams(res.data);
      
        const profileRes = await api.get(`/users/${username}/profile`);
        setProfile(profileRes.data);

        const userRes = await api.get('/users/usernames');
        setUsers(userRes.data.map((u) => ({ id: u, display: u })));
      } catch (err) {
        console.error('Failed to load public profile:', err);
      }
    };

    fetchData();
  }, [username]);

  useEffect(() => {
    if (!loggedIn) return;
    api.get(`/follows/is-following/${username}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setIsFollowing(res.data.following))
      .catch(err => console.error('Follow check failed', err));
  }, [username, loggedIn]);

  const handleFollowToggle = async () => {
  const token = localStorage.getItem('token');
  try {
    if (isFollowing) {
      await api.delete(`/follows/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      await api.post(`/follows/${username}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    setIsFollowing(!isFollowing);
  } catch (err) {
    console.error('Follow/unfollow failed:', err);
  }
};

  return (
    <div style={{ padding: '2rem' }}>
      <h2>@{username}'s Dream Journal</h2>
      {profile?.name && <h3>{profile.name}</h3>}
      {profile?.bio && <p>{profile.bio}</p>}
      {loggedIn && currentUser?.username !== username && (
        <button onClick={handleFollowToggle}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
      {dreams.length === 0 ? (
        <p>No public dreams yet.</p>
      ) : (
        dreams.map((dream) => (
          <DreamEntry key={dream.id} dream={dream} users={users} />
        ))
      )}
    </div>
  );
}
