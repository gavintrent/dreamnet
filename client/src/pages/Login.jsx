import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login( { onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      console.log('Logged in:', res.data);
      localStorage.setItem('token', res.data.token);
      onLogin();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input name="email" placeholder="Email" onChange={handleChange} type="email" required />
      <input name="password" placeholder="Password" onChange={handleChange} type="password" required />
      <button type="submit">Login</button>
    </form>
  );
}
