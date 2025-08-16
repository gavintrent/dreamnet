// components/Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <div className="relative inline-block">
      <Link
        to="/"
        className="inline-flex items-center justify-center px-6 py-3 bg-transparent shadow-none border-none rounded-full text-3xl normal-case font-pixelify-italic animate-pulse [animation-duration:4s] ease-in-out text-highlight hover:opacity-80 transition-opacity duration-200"
      >
        DreamNet
      </Link>
      <div className="absolute -top-6 left-full ml-2 flex flex-col items-center space-y-[-0.5rem] pointer-events-none select-none z-10">
        <span className="animate-z1 text-[1rem] text-white translate-x-1 jersey-10-regular">Z</span>
        <span className="animate-z2 text-[0.8rem] text-white translate-x-0 jersey-10-regular">Z</span>
        <span className="animate-z3 text-[0.6rem] text-white translate-x-[-0.5rem] jersey-10-regular">Z</span>
      </div>
    </div>
  );
}
