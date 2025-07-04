// components/Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <div className="relative inline-block">
      <Link
        to="/"
        className="btn bg-transparent shadow-none border-none rounded-full text-3xl normal-case font-pixelify-italic animate-pulse [animation-duration:4s] ease-in-out [color:#EB5FC1]"
      >
        DreamNet
      </Link>
      <div className="absolute -top-6 left-[110%] ml-[-1.7rem] flex flex-col items-center space-y-[-0.5rem] pointer-events-none select-none z-10">
        <span className="animate-z1 text-[1rem] text-white translate-x-1 jersey-10-regular">Z</span>
        <span className="animate-z2 text-[0.8rem] text-white translate-x-0 jersey-10-regular">Z</span>
        <span className="animate-z3 text-[0.6rem] text-white translate-x-[-0.5rem] jersey-10-regular">Z</span>
      </div>
    </div>
  );
}
