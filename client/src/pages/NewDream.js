import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function NewDream() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    is_public: false,
    tagged: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
        const payload = {
            title: form.title,
            content: form.content,
            is_public: form.is_public,
            tagged_usernames: form.tagged.split(',').map(u => u.trim()).filter(Boolean)
        };
      await api.post('/dreams', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to submit dream:', err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>New Dream Entry</h2>
      <input name="title" placeholder="Dream title" onChange={handleChange} required />
      <textarea name="content" placeholder="What happened in the dream?" onChange={handleChange} required />
      <label>
        <input type="checkbox" name="is_public" onChange={handleChange} />
        Make public
      </label>
      <input
        name="tagged"
        placeholder="Tag usernames (comma separated)"
        onChange={handleChange}
        />  
      <button type="submit">Submit Dream</button>
    </form>
  );
}
