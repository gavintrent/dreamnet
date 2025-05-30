import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Navbar({ loggedIn, onLogout, currentUser}) {
  const [showSearch, setShowSearch] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleDropdownSelect = (pathOrAction) => {
    setDropdownOpen(false); // Close dropdown
    if (typeof pathOrAction === "string") {
      navigate(pathOrAction);
    } else if (typeof pathOrAction === "function") {
      pathOrAction();
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const avatarUrl = loggedIn && currentUser?.profile?.avatar
    ? currentUser.profile.avatar
    : "/avatars/default-avatar-1.jpg";

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 mt-4">
        <div className="navbar bg-[#5e0943] shadow-lg rounded-full">
        <div className="navbar-start">
            <div className="relative" ref={dropdownRef}>
            <button
                className="btn btn-ghost btn-circle avatar"
                onClick={() => setDropdownOpen(prev => !prev)}
            >
                <div className="w-8 rounded-full">
                    <img src={avatarUrl} alt="profile" />
                </div>
            </button>

            {dropdownOpen && (
                <ul className="absolute mt-3 z-50 w-52 p-2 shadow bg-base-100 rounded-box">
                <li><button 
                        onClick={() => handleDropdownSelect("/")}
                        className={"w-full text-left px-4 py-2 hover:bg-base-200 rounded"}
                    >
                        Home
                </button></li>
                <li><button 
                        onClick={() => handleDropdownSelect("/dashboard")}
                        className={"w-full text-left px-4 py-2 hover:bg-base-200 rounded"}
                        >Dashboard
                </button></li>
                {!loggedIn && <li><button 
                                        onClick={() => handleDropdownSelect("/login")}
                                        className={"w-full text-left px-4 py-2 hover:bg-base-200 rounded"}
                                        >Login
                                </button></li>}
                {!loggedIn && <li><button 
                                        onClick={() => handleDropdownSelect("/register")}
                                        className={"w-full text-left px-4 py-2 hover:bg-base-200 rounded"}
                                        >Register
                                </button></li>}
                {loggedIn && <li><button 
                                        onClick={() => handleDropdownSelect(onLogout)}
                                        className={"w-full text-left px-4 py-2 hover:bg-base-200 rounded"}
                                        >Logout
                                </button></li>}
                </ul>
            )}
            </div>
        </div>

        <div className="relative inline-block">
            <Link to="/" className="btn btn-ghost text-2xl normal-case font-pixelify-italic animate-pulse [animation-duration:3s] ease-in-out [color:#d40f95]">
              DreamNet
            </Link>
            <div className="absolute -top-6 left-[110%] ml-[-1.7rem] flex flex-col items-center space-y-[-0.5rem] pointer-events-none select-none z-10">
              <span className="animate-z1 text-[1rem] text-white translate-x-1 font-pixelify">Z</span>
              <span className="animate-z2 text-[0.8rem] text-white translate-x-0 font-pixelify">Z</span>
              <span className="animate-z3 text-[0.6rem] text-white translate-x-[-0.5rem] font-pixelify">Z</span>
              <span className="animate-z4"></span>
            </div>
        </div>

        <div className="navbar-end">
            <button className="btn btn-ghost btn-circle" onClick={() => setShowSearch(prev => !prev)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            </button>

            <button className="btn btn-ghost btn-circle">
            <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
            </button>
        </div>

        {showSearch && (
            <div className="absolute right-4 top-16 z-50 w-80 max-w-full rounded-box bg-base-100 p-4 shadow-md">
            <SearchBar />
            </div>
        )}
        </div>
    </div>
  );
}