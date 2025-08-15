// components/Navbar.jsx
import React from 'react';
import AvatarDropdown from './AvatarDropdown';
import Logo from './Logo';
import SearchButton from './SearchButton';
import NotificationButton from './NotificationButton';
import { getAvatarUrl } from '../utils/avatarUtils';

export default function Navbar({ loggedIn, onLogout, currentUser }) {
  const avatarUrl = getAvatarUrl(currentUser?.profile?.avatar);

  return (
    <div className="sticky top-5 z-50 px-4 sm:px-6 md:px-8 lg:px-12 mt-4">
      <div className="flex items-center justify-between bg-[#28243d] rounded-full max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center">
          <Logo />
        </div>

        <div className="flex items-center gap-2">
          <SearchButton />
          <NotificationButton />
          <AvatarDropdown loggedIn={loggedIn} onLogout={onLogout} avatarUrl={avatarUrl} />
        </div>
      </div>
    </div>
  );
}