import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom'

export default function EditProfile() {
  const [form, setForm] = useState({ name: '', bio: '' });
  const [avatar, setAvatar] = useState(null);
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

    const data = new FormData();
    data.append('name', form.name);
    data.append('bio', form.bio);
    if (avatar) {
      data.append('avatar', avatar);
    }

    await api.patch('/users/me', data, {
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
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={e => {
            const file = e.target.files[0];
            if (!file) return;

            const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
            const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB

            if (!isValidType) {
            alert('Only JPG or PNG files are allowed.');
            return;
            }

            if (!isValidSize) {
            alert('File size must be under 2MB.');
            return;
            }

            setAvatar(file);
        }}
        />
        {avatar && (
            <div>
                <p>Preview:</p>
                <img src={URL.createObjectURL(avatar)} alt="Avatar preview" style={{ height: 100, borderRadius: '50%' }} />
            </div>
            )}
      <button type="submit">Save</button>
    </form>
  );
}
