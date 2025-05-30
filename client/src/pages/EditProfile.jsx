import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom'

export default function EditProfile() {
  const MAX_BIO = 200;

  const [form, setForm] = useState({ name: '', bio: '' });
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setForm({
          name: res.data.name || '',
          bio: res.data.bio?.slice(0, MAX_BIO) || ''
        });
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.bio.length > MAX_BIO) {
      alert(`Bio cannot exceed ${MAX_BIO} characters.`);
      return;
    }
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('name', form.name);
    data.append('bio', form.bio);
    if (avatar) data.append('avatar', avatar);

    await api.patch('/users/me', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Your Name</label>
        <input
          className="w-full border p-2 rounded"
          placeholder="Your Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block mb-1">
          Short Bio <span className="text-sm text-gray-500">({form.bio.length} / {MAX_BIO})</span>
        </label>
        <textarea
          className="w-full border p-2 rounded resize-none"
          placeholder="Short Bio"
          value={form.bio}
          maxLength={MAX_BIO}
          onChange={e => setForm({ ...form, bio: e.target.value })}
        />
      </div>

      <div>
        <label className="block mb-1">Avatar (JPG/PNG, &lt;2MB)</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={e => {
            const file = e.target.files[0];
            if (!file) return;
            if (!['image/jpeg','image/png'].includes(file.type)) {
              alert('Only JPG or PNG allowed.');
              return;
            }
            if (file.size > 2 * 1024 * 1024) {
              alert('Must be under 2MB.');
              return;
            }
            setAvatar(file);
          }}
        />
        {avatar && (
          <div className="mt-2">
            <p className="mb-1">Preview:</p>
            <img
              src={URL.createObjectURL(avatar)}
              alt="Avatar preview"
              className="h-24 w-24 rounded-full object-cover"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </form>
  );
}
