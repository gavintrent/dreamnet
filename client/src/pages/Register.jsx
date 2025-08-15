import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    bio: '',
  })
  const [avatar, setAvatar] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('name', formData.name);
      data.append('bio', formData.bio);
      if (avatar) data.append('avatar', avatar);

      await api.post('/auth/register', data)
      navigate('/login')
    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="mb-8 mt-8 scale-150">
        <Logo />
      </div>
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h2 className="text-4xl text-center jersey-10-regular text-[var(--cream-color)] mb-6">
          Create Account
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-[var(--cream-color)] jersey-10-regular">
              Username
            </label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              maxLength={15}
              required
              className="w-full input input-bordered bg-[var(--cream-color)] text-black jersey-10-regular"
              placeholder="Username"
            />
          </div>

          <div>
            <label className="block mb-1 text-[var(--cream-color)] jersey-10-regular">
              Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              maxLength={254}
              required
              className="w-full input input-bordered bg-[var(--cream-color)] text-black jersey-10-regular"
              placeholder="Email"
            />
          </div>

          <div>
            <label className="block mb-1 text-[var(--cream-color)] jersey-10-regular">
              Password
            </label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              maxLength={100}
              required
              className="w-full input input-bordered bg-[var(--cream-color)] text-black jersey-10-regular"
              placeholder="Password"
            />
          </div>

          <div>
            <label className="block mb-1 text-[var(--cream-color)] jersey-10-regular">
              Name (optional)
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={30}
              className="w-full input input-bordered bg-[var(--cream-color)] text-black jersey-10-regular"
              placeholder="Your display name"
            />
          </div>

          <div>
            <label className="block mb-1 text-[var(--cream-color)] jersey-10-regular">
              Short Bio (optional)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={200}
              className="w-full textarea textarea-bordered bg-[var(--cream-color)] text-black jersey-10-regular resize-none h-24"
              placeholder="Tell us a bit about yourself"
            />
          </div>

          <div>
            <label className="block mb-1 text-[var(--cream-color)] jersey-10-regular">
              Avatar (optional)
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-full btn bg-highlight hover:bg-[#b80c7e] text-[var(--cream-color)] font-pixelify text-center">
                Choose Avatar
              </div>
            </div>
            {avatar && (
              <div className="mt-4 p-4 bg-white bg-opacity-20 rounded-lg">
                <p className="mb-2 text-[var(--cream-color)] jersey-10-regular">Preview:</p>
                <img
                  src={URL.createObjectURL(avatar)}
                  alt="Avatar preview"
                  className="h-24 w-24 rounded-full object-cover border-2 border-white mx-auto"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn bg-highlight hover:bg-[#b80c7e] text-[var(--cream-color)] font-pixelify"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--cream-color)] jersey-10-regular">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="underline text-highlight"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  )
}
