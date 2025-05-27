import React, { useEffect, useState } from 'react';
import api from '../api';
import DreamEntry from '../components/DreamEntry';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [dreams, setDreams] = useState([]);
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState({ name: '', bio: '' });
  const navigate = useNavigate();


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

        const profileRes = await api.get(`/users/${userRes.data.username}/profile`);
        setProfile(profileRes.data);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{username}'s Dream Journal 🌙</h2>
        <button onClick={() => navigate('/edit-profile')}>
            Edit Profile
        </button>
      </div>
      {profile?.name && <h3>{profile.name}</h3>}
      {profile?.bio && <p>{profile.bio}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <Link to="/new-dream">
          <button>Add New Dream</button>
        </Link>
      </div>

      {dreams.map((dream) => (
        <DreamEntry
          key={dream.id}
          dream={dream}
          users={users}
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
