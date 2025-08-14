// components/FeedTabs.jsx
import React from 'react';

export default function FeedTabs({ feedType, switchFeed }) {
  return (
    <div className="sticky top-[0.5rem] z-[70] bg-transparent pt-4">
      <div className="flex justify-center mb-4 gap-4">
        <div className="relative flex justify-center mb-6">
          <div className="flex w-full max-w-md relative z-20">
            {/* Animated underline that slides between tabs */}
            <div
              className="absolute bottom-0 h-1 bg-[#75d2a5] transition-transform duration-300 ease-in-out"
              style={{
                width: '50%',
                transform: feedType === 'following' ? 'translateX(100%)' : 'translateX(0%)',
              }}
            />
            
            <button
              className="w-1/2 font-pixelify text-lg py-3 px-4 transition-all duration-200 text-white relative"
              onClick={() => switchFeed('discover')}
            >
              Discover
            </button>

            <button
              className="w-1/2 font-pixelify text-lg py-3 px-4 transition-all duration-200 text-white relative"
              onClick={() => switchFeed('following')}
            >
              Following
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}