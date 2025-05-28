import React, { useEffect, useState } from 'react';
import api from '../api';
import UserProfilePage from '../components/UserProfilePage';

export default function Dashboard() {
  const [dreams, setDreams] = useState([]);
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState({ name: '', bio: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const userRes = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsername(userRes.data.username);

        const [dreamRes, profileRes, usersRes] = await Promise.all([
          api.get('/dreams', { headers: { Authorization: `Bearer ${token}` } }),
          api.get(`/users/${userRes.data.username}/profile`),
          api.get('/users/usernames')
        ]);

        setDreams(dreamRes.data);
        setProfile(profileRes.data);
        setUsers(usersRes.data.map(u => ({ id: u, display: u })));
      } catch (err) {
        console.error('Error loading dashboard:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <UserProfilePage
      username={username}
      profile={profile}
      dreams={dreams}
      users={users}
      editable={true}
      onUpdate={(updated) => setDreams((prev) => prev.map(d => d.id === updated.id ? updated : d))}
      onDelete={(id) => setDreams((prev) => prev.filter(d => d.id !== id))}
    />
  );
}
