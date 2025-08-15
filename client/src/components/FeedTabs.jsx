// components/FeedTabs.jsx
import React from 'react';

export default function FeedTabs({ feedType, switchFeed }) {
  return (
    <div className="bg-transparent pt-4">
      <div className="flex justify-center mb-4 gap-4">
        <div className="relative flex justify-center mb-6">
          <div className="flex w-full max-w-md relative z-20">
            {/* Animated underline that slides between tabs */}
            <div
              className="absolute bottom-0 h-1 bg-highlight transition-transform duration-300 ease-in-out"
              style={{
                width: '50%',
                transform: feedType === 'following' ? 'translateX(100%)' : 'translateX(0%)',
              }}
            />
            
            <button
              onClick={() => switchFeed('following')}
              className="w-1/2 font-pixelify text-lg py-3 px-4 transition-all duration-200 text-[var(--cream-color)] relative"
            >
              Following
            </button>
            <button
              onClick={() => switchFeed('discover')}
              className="w-1/2 font-pixelify text-lg py-3 px-4 transition-all duration-200 text-[var(--cream-color)] relative"
            >
              Discover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}