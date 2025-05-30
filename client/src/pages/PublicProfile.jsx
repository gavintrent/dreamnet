import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import UserProfilePage from '../components/UserProfilePage';

export default function PublicProfile({ loggedIn, currentUser }) {
  const { username } = useParams();
  const [dreams, setDreams] = useState([]);
  const [users, setUsers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [profile, setProfile] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dreamRes, profileRes, userRes] = await Promise.all([
          api.get(`/users/${username}/dreams`),
          api.get(`/users/${username}/profile`),
          api.get('/users/usernames')
        ]);

        setDreams(dreamRes.data);
        setProfile(profileRes.data);
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
    <UserProfilePage
      username={username}
      profile={profile}
      dreams={dreams}
      users={users}
      editable={false}
      isFollowing={isFollowing}
      onFollowToggle={loggedIn && currentUser?.username !== username ? handleFollowToggle : undefined}
    />
  );
}
