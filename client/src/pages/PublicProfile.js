import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import DreamEntry from '../components/DreamEntry';

export default function PublicProfile() {
  const { username } = useParams();
  const [dreams, setDreams] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/users/${username}/dreams`);
        setDreams(res.data);

        const userRes = await api.get('/users/usernames');
        setUsers(userRes.data.map((u) => ({ id: u, display: u })));
      } catch (err) {
        console.error('Failed to load public profile:', err);
      }
    };

    fetchData();
  }, [username]);


  return (
    <div style={{ padding: '2rem' }}>
      <h2>@{username}'s Dream Journal</h2>
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
