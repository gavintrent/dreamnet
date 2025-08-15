import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as MailIcon } from '../assets/icons/mail-svgrepo-com.svg';

export default function CheckEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';

  return (
    <div className="flex flex-col items-center justify-center mt-8 px-4">
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-lg text-center">
        <MailIcon className="w-16 h-16 mx-auto mb-4 text-[var(--highlight-color)]" />
        
        <h2 className="text-3xl font-pixelify text-[var(--cream-color)] mb-6">
          Check Your Email!
        </h2>
        
        <div className="space-y-4 text-[var(--cream-color)] jersey-10-regular">
          <p>
            We've sent a verification link to <strong>{email}</strong>
          </p>
          
          <p className="text-sm opacity-75">
            Click the link in your email to verify your account and start using DreamNet!
          </p>
          
          <div className="bg-highlight bg-opacity-20 p-4 rounded-lg border border-highlight">
            <p className="text-sm">
              <strong>Can't find the email?</strong>
            </p>
            <ul className="text-xs mt-2 space-y-1 text-left">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure you entered the correct email</li>
              <li>• Wait a few minutes for delivery</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate('/login')}
            className="w-full btn bg-highlight hover:bg-[#b80c7e] text-[var(--cream-color)] font-pixelify"
          >
            Go to Login
          </button>
          
          <button
            onClick={() => navigate('/register')}
            className="w-full btn bg-gray-600 hover:bg-gray-700 text-[var(--cream-color)] font-pixelify"
          >
            Register Different Account
          </button>
        </div>
        
        <p className="jersey-10-regular mt-6 text-xs text-[var(--cream-color)] opacity-75">
          Verification links expire in 24 hours
        </p>
      </div>
    </div>
  );
} 