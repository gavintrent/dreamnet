import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import PixelSearchIcon from '../assets/icons/search-svgrepo-com.svg';
import PixelBellIcon from '../assets/icons/notification-svgrepo-com.svg';

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
    
      <div className="sticky top-5 z-50 px-4 sm:px-8 md:px-16 lg:px-24 mt-4">
          <div className="navbar bg-[#5e0943] rounded-full">
            <div className="navbar-start">
                <div className="relative" ref={dropdownRef}>
                  <button
                      className="btn btn-ghost btn-circle avatar ml-2"
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
                              className={"font-pixelify w-full text-left px-4 py-2 hover:text-gray-300 text-white rounded"}
                          >
                              Home
                      </button></li>
                      <li><button 
                            onClick={() => handleDropdownSelect("/dashboard")}
                            className={"font-pixelify w-full text-left px-4 py-2 hover:text-gray-300 text-white rounded"}
                            >Profile
                      </button></li>
                      {!loggedIn && <li><button 
                                              onClick={() => handleDropdownSelect("/login")}
                                              className={"font-pixelify w-full text-left px-4 py-2 hover:text-gray-300 text-white rounded"}
                                              >Login
                                      </button></li>}
                      {!loggedIn && <li><button 
                                              onClick={() => handleDropdownSelect("/register")}
                                              className={"font-pixelify w-full text-left px-4 py-2 hover:text-gray-300 text-white rounded"}
                                              >Register
                                      </button></li>}
                      {loggedIn && <li><button 
                                            onClick={() => handleDropdownSelect(onLogout)}
                                            className={"font-pixelify w-full text-left px-4 py-2 hover:text-gray-300 text-white rounded"}
                                            >Logout
                                    </button></li>}
                    </ul>
                )}
                </div>
            </div>

            <div className="relative inline-block">
                <Link to="/" className="btn btn-ghost rounded-full text-3xl normal-case font-pixelify-italic animate-pulse [animation-duration:4s] ease-in-out [color:#d40f95]">
                  DreamNet
                </Link>
                <div className="absolute -top-6 left-[110%] ml-[-1.7rem] flex flex-col items-center space-y-[-0.5rem] pointer-events-none select-none z-10">
                  <span className="animate-z1 text-[1rem] text-white translate-x-1 font-pixelify">Z</span>
                  <span className="animate-z2 text-[0.8rem] text-white translate-x-0 font-pixelify">Z</span>
                  <span className="animate-z3 text-[0.6rem] text-white translate-x-[-0.5rem] font-pixelify">Z</span>
                  <span className="animate-z4"></span>
                </div>
            </div>

            <div className="navbar-end mr-2">
                <button className="btn btn-ghost btn-circle" onClick={() => setShowSearch(prev => !prev)}>
                  <img src={PixelSearchIcon} alt="Search" className="w-6 h-6 object-contain">
                  </img>
                </button>

                <button className="btn btn-ghost btn-circle">
                <div className="indicator">
                    <img src={PixelBellIcon} alt="Notifications" className="w-6 h-6 object-contain">
                    </img>
                    
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