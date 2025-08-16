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
        className="w-10 h-10 min-h-0 rounded-full bg-transparent hover:bg-[#52489f] transition-colors duration-200 flex items-center justify-center border-none shadow-none focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 focus:ring-offset-[#28243d]"
        onClick={handleProfileClick}
        title="Go to Profile"
      >
        <ProfileButtonIcon className="w-6 h-6 text-highlight"/>
      </button>
    </div>
  );
}
