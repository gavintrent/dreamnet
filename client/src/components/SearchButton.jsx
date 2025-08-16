// components/SearchButton.jsx
import React, { useState, useEffect, useRef } from 'react';
import SearchBar from './SearchBar';
import { ReactComponent as PixelSearchIcon } from '../assets/icons/search-svgrepo-com.svg';

export default function SearchButton() {
  const [show, setShow] = useState(false);
  const searchRef = useRef(null);

  // Handle clicks outside the search area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    // Add event listener when search is shown
    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show]);

  return (
    <div className="relative" ref={searchRef}>
      <button
        className="btn btn-ghost hover:bg-[#52489f] btn-circle shadow-none border-none w-10 h-10 min-h-0"
        onClick={() => setShow((s) => !s)}
      >
        <PixelSearchIcon className="w-6 h-6 text-highlight"/>
      </button>

      {show && (
        <div className="absolute top-full right-0 mt-2 z-50">
          <SearchBar />
        </div>
      )}
    </div>
  );
}
