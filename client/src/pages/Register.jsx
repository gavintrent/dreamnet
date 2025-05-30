import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    bio: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', formData);
      console.log('Registered:', res.data);
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} type="email" required />
      <input name="password" placeholder="Password" onChange={handleChange} type="password" required />
      <input name="name" placeholder="Full Name (optional)" onChange={handleChange} />
      <textarea name="bio" placeholder="Short Bio (optional)" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
}
