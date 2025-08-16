import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const hasCalledAPI = useRef(false);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    console.log('VerifyEmail component mounted/updated');
    console.log('Current status:', status);
    console.log('Has called API:', hasCalledAPI.current);
    console.log('Has succeeded:', hasSucceeded.current);
    
    const verifyEmail = async () => {
      // Prevent multiple API calls across re-mounts
      if (hasCalledAPI.current) {
        console.log('API already called, skipping');
        return;
      }
      
      const token = searchParams.get('token');
      console.log('Token from URL:', token);
      
      if (!token) {
        console.log('No token found, setting error state');
        setStatus('error');
        setMessage('No verification token provided.');
        hasCalledAPI.current = true;
        return;
      }

      try {
        console.log('=== STARTING VERIFICATION ===');
        console.log('Attempting to verify email with token:', token);
        
        // Mark that we've called the API
        hasCalledAPI.current = true;
        console.log('hasCalledAPI set to true');
        
        const response = await api.get(`/auth/verify/${token}`);
        console.log('=== VERIFICATION SUCCESS ===');
        console.log('Verification response:', response);
        
        // If we get here, verification was successful
        hasSucceeded.current = true;
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
        console.log('Success state set, hasSucceeded = true');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          console.log('Redirecting to login...');
          navigate('/login');
        }, 3000);
        
      } catch (error) {
        // If we've already succeeded, don't show error
        if (hasSucceeded.current) {
          console.log('Error occurred but verification already succeeded, ignoring error');
          return;
        }
        
        console.log('=== VERIFICATION ERROR ===');
        console.log('hasCalledAPI value at error:', hasCalledAPI.current);
        console.log('hasSucceeded value at error:', hasSucceeded.current);
        console.log('Current status at error:', status);
        console.error('Verification error details:', error);
        console.error('Error response:', error.response);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        
        // Only show error for actual HTTP errors
        if (error.response && (error.response.status === 400 || error.response.status === 500)) {
          console.log('Setting error state for HTTP error');
          setStatus('error');
          setMessage(error.response.data?.error || 'Verification failed. Please try again.');
        } else {
          // For network errors or other issues, show a generic error
          console.log('Setting error state for network error');
          setStatus('error');
          setMessage('Network error. Please try again or check your connection.');
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate, status]);

  const getStatusIcon = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-highlight"></div>
        );
      case 'success':
        return (
          <div className="text-green-500 text-6xl">✓</div>
        );
      case 'error':
        return (
          <div className="text-red-500 text-6xl">✗</div>
        );
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-[var(--cream-color)]';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-lg text-center">
        <div className="mb-6">
          {getStatusIcon()}
        </div>
        
        <h2 className={`text-2xl font-pixelify mb-4 ${getStatusColor()}`}>
          {status === 'verifying' && 'Verifying Your Email...'}
          {status === 'success' && 'Email Verified!'}
          {status === 'error' && 'Verification Failed'}
        </h2>
        
        <p className="text-[var(--cream-color)] jersey-10-regular mb-6">
          {message}
        </p>
        
        {status === 'success' && (
          <p className="text-sm text-[var(--cream-color)] opacity-75">
            Redirecting to login page in 3 seconds...
          </p>
        )}
        
        {status === 'error' && (
          <div className="space-y-3">
            <button
              onClick={() => navigate('/register')}
              className="w-full btn bg-highlight hover:bg-[#b80c7e] text-[var(--cream-color)] font-pixelify"
            >
              Try Registering Again
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full btn bg-gray-600 hover:bg-gray-700 text-[var(--cream-color)] font-pixelify"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 