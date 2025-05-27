import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { MentionsInput, Mention } from 'react-mentions';

export default function NewDream() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    is_public: false
  });
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/users/usernames')
      .then(res => {
        setUsers(res.data.map(username => ({ id: username, display: username })));
      })
      .catch(err => console.error('Failed to fetch usernames', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const mentionedUsers = [...new Set((form.content.match(/@(\w+)/g) || []).map(u => u.slice(1)))];

    try {
      await api.post('/dreams', {
        title: form.title,
        content: form.content,
        is_public: form.is_public,
        tagged_usernames: mentionedUsers
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to submit dream:', err.response?.data || err.message);
    }
  };


  const mentionsStyle = {
    control: {
        backgroundColor: '#fff',
        fontSize: 14,
        border: '1px solid #ddd',
        padding: 10,
        borderRadius: 5,
    },
    suggestions: {
        list: {
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        fontSize: 14,
        },
        item: {
        padding: '5px 10px',
        '&focused': {
            backgroundColor: '#cee4e5',
        },
        },
    },
    };


  return (
    <form onSubmit={handleSubmit}>
      <h2>New Dream Entry</h2>
      <input
        name="title"
        placeholder="Dream title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <MentionsInput
        style={mentionsStyle}
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        placeholder="Describe your dream and tag users with @"
      >
        <Mention
          trigger="@"
          data={(query, callback) => {
            const results = users
            .filter((u) => u.id.toLowerCase().startsWith(query.toLowerCase()))
            .map((u) => ({ id: u.id, display: u.display }));
            callback(results);
          }}  
          markup="@\[__display__\](__id__)"
          displayTransform={(id) => `@${id}`}
        />
      </MentionsInput>
      <label>
        <input
          type="checkbox"
          name="is_public"
          checked={form.is_public}
          onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
        />
        Make public
      </label>
      <button type="submit">Submit Dream</button>
    </form>
  );
}
