import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom'

export default function EditProfile() {
  const [form, setForm] = useState({ name: '', bio: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setForm({ name: res.data.name || '', bio: res.data.bio || '' });
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await api.patch('/users/me', form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate('/dashboard')
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Your Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <textarea
        placeholder="Short Bio"
        value={form.bio}
        onChange={e => setForm({ ...form, bio: e.target.value })}
      />
      <button type="submit">Save</button>
    </form>
  );
}
