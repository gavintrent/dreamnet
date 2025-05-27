import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!query) return setSuggestions([]);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/users/search?q=${query}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error('Search failed:', err);
      }
    }, 200);
  }, [query]);

  const handleSelect = (username) => {
    setQuery('');
    setSuggestions([]);
    navigate(`/users/${username}`);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
        style={{ padding: '0.4rem', borderRadius: '4px' }}
      />
      {suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          background: 'white',
          listStyle: 'none',
          padding: '0.5rem',
          border: '1px solid #ccc',
          zIndex: 1000
        }}>
          {suggestions.map(username => (
            <li
              key={username}
              style={{ cursor: 'pointer', padding: '0.2rem 0' }}
              onClick={() => handleSelect(username)}
            >
              @{username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
