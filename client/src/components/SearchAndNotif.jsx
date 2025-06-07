// components/SearchToggle.jsx
import React from 'react';
import SearchBar from './SearchBar';
import PixelSearchIcon from '../assets/icons/search-svgrepo-com.svg';
import PixelBellIcon from '../assets/icons/notification-svgrepo-com.svg';

export default function SearchAndNotif() {
  const [show, setShow] = React.useState(false);

  return (
    <>
      <button className="btn btn-ghost btn-circle" onClick={() => setShow((s) => !s)}>
        <img src={PixelSearchIcon} alt="Search" className="w-6 h-6 object-contain" />
      </button>

      <button className="btn btn-ghost btn-circle">
        <div className="indicator">
          <img src={PixelBellIcon} alt="Notifications" className="w-6 h-6 object-contain" />
        </div>
      </button>

      {show && (
        <div className="absolute right-4 top-16 z-50 w-80 max-w-full rounded-box bg-base-100 p-4 shadow-md">
          <SearchBar />
        </div>
      )}
    </>
  );
}