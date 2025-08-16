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

  const handleAvatarChange = (e) => {
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
  };

  return (
    <div className="relative min-h-screen px-4">
      <div className="flex items-center justify-center h-full pt-4">
        <div className="w-full max-w-2xl bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-lg mt-16">
          <h2 className="text-4xl text-center font-pixelify-italic text-[var(--cream-color)] mb-8">
            Edit Profile
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-[var(--cream-color)] font-pixelify text-lg">Your Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--cream-color)] text-black jersey-10-regular text-lg rounded-lg border-2 border-gray-300 focus:border-highlight focus:outline-none transition-colors duration-200"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block mb-2 text-[var(--cream-color)] font-pixelify text-lg">
                Short Bio <span className="text-sm text-gray-300">({form.bio.length} / {MAX_BIO})</span>
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full px-4 py-3 bg-[var(--cream-color)] text-black jersey-10-regular text-lg rounded-lg border-2 border-gray-300 focus:border-highlight focus:outline-none transition-colors duration-200 resize-none"
                placeholder="Tell us about yourself"
                rows="3"
              />
            </div>

            <div>
              <label className="block mb-2 text-[var(--cream-color)] font-pixelify text-lg">Avatar (JPG/PNG, &lt;2MB)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="jersey-10-regular file:text-lg file:px-4 file:py-2 file:bg-highlight file:text-[var(--cream-color)] file:hover:bg-[#b80c7e] file:rounded-lg file:border-0 file:cursor-pointer"
              />
              {avatar && (
                <div className="mt-4 p-4 bg-white bg-opacity-20 rounded-lg">
                  <p className="mb-2 text-[var(--cream-color)] font-pixelify">Preview:</p>
                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="Avatar preview"
                    className="h-24 w-24 rounded-full object-cover border-2 border-white"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-[var(--cream-color)] font-pixelify rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-highlight hover:bg-[#b80c7e] text-[var(--cream-color)] font-pixelify rounded-lg transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
