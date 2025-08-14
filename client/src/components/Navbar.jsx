// components/Navbar.jsx
import React from 'react';
import AvatarDropdown from './AvatarDropdown';
import Logo from './Logo';
import SearchButton from './SearchButton';
import NotificationButton from './NotificationButton';

export default function Navbar({ loggedIn, onLogout, currentUser }) {
  const avatarUrl =
    loggedIn && currentUser?.profile?.avatar
      ? currentUser.profile.avatar
      : '/avatars/default-avatar-1.jpg';

  return (
    <div className="sticky top-5 z-50 px-4 sm:px-6 md:px-8 lg:px-12 mt-4">
      <div className="navbar bg-[#28243d] rounded-full max-w-6xl mx-auto">
        <div className="navbar-start">
          <Logo />
        </div>

        <div className="navbar-end flex gap-2">
          <SearchButton />
          <NotificationButton />
          <AvatarDropdown loggedIn={loggedIn} onLogout={onLogout} avatarUrl={avatarUrl} />
        </div>
      </div>
    </div>
  );
}