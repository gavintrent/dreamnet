import React, { useEffect, useState } from 'react';
import api from '../api';
import DreamEntry from '../components/DreamEntry';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [dreams, setDreams] = useState([]);
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const userRes = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsername(userRes.data.username);

        const dreamRes = await api.get('/dreams', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDreams(dreamRes.data);

        const usersRes = await api.get('/users/usernames');
        setUsers(usersRes.data.map(u => ({ id: u, display: u })));

      } catch (err) {
        console.error('Error loading dashboard:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{username}'s Dream Journal 🌙</h2>

      <div style={{ marginBottom: '1rem' }}>
        <Link to="/new-dream">
          <button>Add New Dream</button>
        </Link>
      </div>

      {/* List of dreams */}
      {dreams.map((dream) => (
        <DreamEntry
          key={dream.id}
          dream={dream}
          users={users} // ✅ pass it down
          onUpdate={(updated) => {
            setDreams((prev) =>
              prev.map((d) => (d.id === updated.id ? updated : d))
            );
          }}
          onDelete={(id) => {
            setDreams((prev) => prev.filter((d) => d.id !== id));
          }}
        />
      ))}
    </div>

  );
}
