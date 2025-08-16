import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const res = await api.post('/auth/login', formData)
      localStorage.setItem('token', res.data.token)
      onLogin()
      navigate('/')
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message)
      
      // Handle specific error cases
      if (err.response?.status === 401) {
        if (err.response.data?.error?.includes('verify your email')) {
          setError('Please verify your email address before logging in. Check your inbox for a verification link.')
        } else if (err.response.data?.error?.includes('Invalid credentials')) {
          setError('Incorrect email or password. Please try again.')
        } else {
          setError(err.response.data?.error || 'Invalid credentials. Please try again.')
        }
      } else if (err.response?.status === 404) {
        setError('Email address not found. Please check your email or register a new account.')
      } else if (err.response?.status === 429) {
        setError('Too many login attempts. Please wait a moment before trying again.')
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.')
      } else if (!err.response) {
        setError('Network error. Please check your connection and try again.')
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative px-4 pb-8 mt-8">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 scale-150">
        <Logo />
      </div>
      <div className="flex items-center justify-center h-full pt-24">
        <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-lg mt-16">
          <h2 className="text-4xl text-center font-pixelify-italic text-[var(--cream-color)] mb-6">
            Welcome Back
          </h2>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
              <p className="text-red-300 text-sm jersey-10-regular">{error}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-[var(--cream-color)] jersey-10-regular text-lg">
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-[var(--cream-color)] text-black jersey-10-regular text-lg rounded-lg border-2 border-gray-300 focus:border-highlight focus:outline-none transition-colors duration-200"
                placeholder="Email"
              />
            </div>

            <div>
              <label className="block mb-1 text-[var(--cream-color)] jersey-10-regular text-lg">
                Password
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-[var(--cream-color)] text-black jersey-10-regular text-lg rounded-lg border-2 border-gray-300 focus:border-highlight focus:outline-none transition-colors duration-200"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-highlight hover:bg-[#b80c7e] text-[var(--cream-color)] font-pixelify rounded-lg transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-[var(--cream-color)] jersey-10-regular">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="underline text-highlight"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
