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
    <div className="relative w-half rounded-full bg-[#EB5FC1] jersey-10-regular ">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
        className="w-full p-2 pl-4 pr-4 rounded-full bg-white text-black border border-gray-300"
      />
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-2 bg-[#EB5FC1] rounded-full shadow z-50 border border-[#EB5FC1] overflow-hidden">
          {suggestions.map((username, idx) => (
            <li
              key={username}
              onClick={() => handleSelect(username)}
              className={`px-4 py-2 cursor-pointer text-white hover:bg-[#d64daf] ${
                idx !== suggestions.length - 1 ? 'border-b border-pink-300' : ''
              }`}
            >
              @{username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
