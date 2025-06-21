import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', formData)
      localStorage.setItem('token', res.data.token)
      onLogin()
      navigate('/')
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#471692] px-4 pb-8 mt-8">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 scale-150">
        <Logo />
      </div>
      <div className="flex items-center justify-center h-full pt-24">
        <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-lg mt-16">
          <h2 className="text-4xl text-center font-pixelify-italic text-white mb-6">
            Login
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
                className="w-full input input-bordered bg-white text-black jersey-10-regular text-lg"
                placeholder="Email"
              />
            </div>

            <div>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                required
                className="w-full input input-bordered bg-white text-black jersey-10-regular text-lg"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              className="w-full btn bg-[#d40f95] hover:bg-[#b80c7e] text-white font-pixelify"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-white jersey-10-regular">
            Don’t have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="underline text-[#d40f95]"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
