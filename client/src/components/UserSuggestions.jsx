import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function UserSuggestions() {
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    api.get('/users/suggestions', {
        headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {setUsers(res.data)
    console.log(res.data)})
      .catch(err => console.error('Failed to load suggestions', err));
  }, []);

  const handleFollow = async (username) => {
    try {
      await api.post(`/users/${username}/follow`);
      setFollowing((prev) => new Set(prev).add(username));
    } catch (err) {
      console.error(`Failed to follow ${username}:`, err);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
      {users.map((user) => (
        <div key={user.id} className="flex flex-col items-center text-center relative group">
          <div
            className="cursor-pointer w-20 h-20 rounded-full border-2 border-[#4c2f6f] overflow-hidden hover:scale-105 transition-transform"
            onClick={() => navigate(`/users/${user.username}`)}
          >
            <img
              src={user.avatar?.trim() ? user.avatar : 'public/avatars/default-avatar-1.jpg'}
              alt={user.username}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="mt-2 text-sm text-white jersey-10-regular truncate w-24">
            {user.name || `@${user.username}`}
          </div>
          {!following.has(user.username) && (
            <button
              className="absolute top-0 right-0 bg-[#EB5FC1] text-white w-6 h-6 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleFollow(user.username)}
              title="Follow"
            >
              +
            </button>
          )}
        </div>
      ))}
    </div>
  );
}