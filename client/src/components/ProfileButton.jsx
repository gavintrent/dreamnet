// components/ProfileButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as ProfileButtonIcon } from '../assets/icons/book-open-svgrepo-com.svg';

export default function ProfileButton({ currentUser }) {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (currentUser?.username) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative">
      <button
        className="btn btn-ghost hover:bg-[#52489f] btn-circle shadow-none border-none"
        onClick={handleProfileClick}
        title="Go to Profile"
      >
        <ProfileButtonIcon className="w-6 h-6 text-highlight"/>
      </button>
    </div>
  );
}
