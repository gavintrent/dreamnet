// components/SearchButton.jsx
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import { ReactComponent as PixelSearchIcon } from '../assets/icons/search-svgrepo-com.svg';

export default function SearchButton() {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        className="btn btn-ghost hover:bg-[#52489f] btn-circle shadow-none border-none"
        onClick={() => setShow((s) => !s)}
      >
        <PixelSearchIcon className="w-6 h-6 text-[#EB5FC1]"/>
      </button>

      {show && (
          <SearchBar />
      )}
    </>
  );
}
