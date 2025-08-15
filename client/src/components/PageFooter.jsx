import React from 'react';
import { Link } from 'react-router-dom';

export default function PageFooter() {
  return (
    <footer className="bg-base-100 shadow-sm rounded-2xl p-6 mt-4 mb-4 mt-100 center mx-auto w-[80vw] text-[var(--cream-color)]">
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Left: copyright */}
        <div className="text-sm">
          © {new Date().getFullYear()} DreamNet, Inc.
        </div>

        {/* Center: nav links */}
        <nav className="flex space-x-4 my-4 md:my-0">
          <Link to="/" className="jersey-10-thin hover:text-gray-300">
            Home
          </Link>
          <Link to="/dashboard" className="jersey-10-thin hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/about" className="jersey-10-thin hover:text-gray-300">
            About
          </Link>
          <Link to="/contact" className="jersey-10-thin hover:text-gray-300">
            Contact
          </Link>
        </nav>

        {/* Right: social icons (example) */}
        <div className="flex space-x-4">
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-gray-300">
            🐦
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-gray-300">
            🐙
          </a>
        </div>
      </div>
    </footer>
  );
}
