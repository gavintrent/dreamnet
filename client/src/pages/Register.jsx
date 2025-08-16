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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'
  const navigate = useNavigate()

  const handleChange = (e) => {
    if (!isSuccess) {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleAvatarChange = (e) => {
    if (isSuccess) return;
    
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
    if (isSuccess || isSubmitting) return;
    
    setIsSubmitting(true)
    setMessage('')
    setMessageType('')
    
    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('name', formData.name);
      data.append('bio', formData.bio);
      if (avatar) data.append('avatar', avatar);

      const response = await api.post('/auth/register', data)
      
      setIsSuccess(true)
      setMessageType('success')
      setMessage(response.data.message)
      
      // Navigate to check email page after a short delay
      setTimeout(() => {
        navigate('/check-email', { 
          state: { email: formData.email }
        });
      }, 1500);
      
    } catch (err) {
      setMessageType('error')
      // Extract error message safely and provide user-friendly messages
      let errorMessage = 'Registration failed. Please try again.'
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data
        } else if (err.response.data.error) {
          // Handle specific backend error messages
          const backendError = err.response.data.error
          if (backendError.includes('username') && backendError.includes('already exists')) {
            errorMessage = 'Username already exists. Please choose a different username.'
          } else if (backendError.includes('email') && backendError.includes('already exists')) {
            errorMessage = 'Email address already in use. Please use a different email or try logging in.'
          } else if (backendError.includes('username') && backendError.includes('invalid')) {
            errorMessage = 'Username must be 3-15 characters and contain only letters, numbers, dots, and underscores.'
          } else if (backendError.includes('password') && backendError.includes('weak')) {
            errorMessage = 'Password is too weak. Please choose a stronger password.'
          } else if (backendError.includes('avatar') && backendError.includes('upload')) {
            errorMessage = 'Failed to upload avatar. Please try again or skip avatar upload.'
          } else {
            errorMessage = backendError
          }
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message
        }
      } else if (err.message) {
        if (err.message.includes('Network Error')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = err.message
        }
      }
      
      setMessage(errorMessage)
      console.error('Registration error:', err)
    } finally {
      setIsSubmitting(false)
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
              disabled={isSuccess}
              className={`w-full px-4 py-3 bg-[var(--cream-color)] text-black jersey-10-regular rounded-lg border-2 border-gray-300 focus:border-highlight focus:outline-none transition-colors duration-200 ${
                isSuccess ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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
              disabled={isSuccess}
              className={`w-full px-4 py-3 bg-[var(--cream-color)] text-black jersey-10-regular rounded-lg border-2 border-gray-300 focus:border-highlight focus:outline-none transition-colors duration-200 ${
                isSuccess ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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
              disabled={isSuccess}
              className={`w-full px-4 py-3 bg-[var(--cream-color)] text-black jersey-10-regular rounded-lg border-2 border-gray-300 focus:border-highlight focus:outline-none transition-colors duration-200 ${
                isSuccess ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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
              disabled={isSuccess}
              className={`w-full px-4 py-3 bg-[var(--cream-color)] text-black jersey-10-regular rounded-lg border-2 border-gray-300 focus:border-highlight focus:outline-none transition-colors duration-200 ${
                isSuccess ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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
              disabled={isSuccess}
              className={`w-full px-4 py-3 bg-[var(--cream-color)] text-black jersey-10-regular rounded-lg border-2 border-gray-300 focus:border-highlight focus:outline-none transition-colors duration-200 resize-none h-24 ${
                isSuccess ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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
                disabled={isSuccess}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className={`w-full px-6 py-3 text-center font-pixelify rounded-lg transition-colors duration-200 ${
                isSuccess 
                  ? 'bg-gray-500 cursor-not-allowed opacity-50' 
                  : 'bg-highlight hover:bg-[#b80c7e]'
              } text-[var(--cream-color)]`}>
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

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg text-center ${
              messageType === 'success' 
                ? 'bg-green-500 bg-opacity-20 text-green-300 border border-green-500' 
                : 'bg-red-500 bg-opacity-20 text-red-300 border border-red-500'
            }`}>
              <p className="jersey-10-regular text-sm leading-relaxed">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`w-full px-6 py-3 font-pixelify rounded-lg transition-colors duration-200 ${
              isSuccess 
                ? 'bg-green-600 cursor-not-allowed' 
                : isSubmitting 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-highlight hover:bg-[#b80c7e]'
            } text-[var(--cream-color)]`}
          >
            {isSuccess ? 'Registration Successful!' : isSubmitting ? 'Creating Account...' : 'Register'}
          </button>

          {isSuccess && (
            <div className="text-center">
              <p className="text-sm text-[var(--cream-color)] opacity-75 mb-2">
                Redirecting to email verification page...
              </p>
              <button
                type="button"
                onClick={() => navigate('/check-email', { state: { email: formData.email } })}
                className="text-highlight hover:underline jersey-10-regular"
              >
                Go Now
              </button>
            </div>
          )}
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