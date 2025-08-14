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
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/register', formData)
      navigate('/login')
    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="mb-8 scale-150">
        <Logo />
      </div>
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h2 className="text-4xl text-center jersey-10-regular text-white mb-6">
          Register
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-white jersey-10-regular">
              Username (Letters, numbers, underscores, and dots.)
            </label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              maxLength={15}
              required
              className="w-full input input-bordered bg-white text-black jersey-10-regular"
              placeholder="Username"
            />
          </div>

          <div>
            <label className="block mb-1 text-white jersey-10-regular">
              Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              maxLength={254}
              required
              className="w-full input input-bordered bg-white text-black jersey-10-regular"
              placeholder="Email"
            />
          </div>

          <div>
            <label className="block mb-1 text-white jersey-10-regular">
              Password
            </label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              maxLength={100}
              required
              className="w-full input input-bordered bg-white text-black jersey-10-regular"
              placeholder="Password"
            />
          </div>

          <div>
            <label className="block mb-1 text-white jersey-10-regular">
              Name (optional)
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={30}
              className="w-full input input-bordered bg-white text-black jersey-10-regular"
              placeholder="Your display name"
            />
          </div>

          <div>
            <label className="block mb-1 text-white jersey-10-regular">
              Short Bio (optional)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={200}
              className="w-full textarea textarea-bordered bg-white text-black jersey-10-regular resize-none h-24"
              placeholder="Tell us a bit about yourself"
            />
          </div>

          <button
            type="submit"
            className="w-full btn bg-highlight hover:bg-[#b80c7e] text-white font-pixelify"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-white jersey-10-regular">
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
