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
    <div className="sticky top-5 z-50 px-4 sm:px-8 md:px-16 lg:px-24 mt-4">
      <div className="navbar bg-[#4c2f6f] rounded-full">
        <div className="navbar-start ml-1">
          <AvatarDropdown loggedIn={loggedIn} onLogout={onLogout} avatarUrl={avatarUrl} />
        </div>

        <Logo />

        <div className="navbar-end mr-2 flex gap-2">
          <SearchButton />
          <NotificationButton />
        </div>
      </div>
    </div>
  );
}