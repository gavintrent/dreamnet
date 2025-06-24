// components/FeedTabs.jsx
import React from 'react';

export default function FeedTabs({ feedType, switchFeed }) {
  return (
    <div className="sticky top-[4.25rem] z-30 bg-transparent pt-4">
      <div className="flex justify-center mb-4 gap-4">
        <div className="relative flex justify-center mb-6">
          <div className="absolute inset-0 bg-[#EB5FC1] rounded-full z-0" />

          <div
            className="absolute left-[2px] top-[2px] bottom-[2px] w-[calc(50%-4px)] rounded-full border-4 border-[#FFFFF2] transition-transform duration-300 z-10 pointer-events-none"
            style={{
              transform: feedType === 'following'
                ? 'translateX(calc(100% + 4px))'
                : 'translateX(0%)',
            }}
          />

          <div className="flex w-full max-w-md relative z-20 rounded-full overflow-hidden">
            <button
              className={`w-1/2 font-pixelify text-lg py-3 px-4 transition-all duration-200 ${
                feedType === 'discover'
                  ? 'text-[#4c2f6f]'
                  : 'text-[#4c2f6f] text-opacity-50'
              }`}
              onClick={() => switchFeed('discover')}
            >
              Discover
            </button>

            <button
              className={`w-1/2 font-pixelify text-lg py-3 px-4 transition-all duration-200 ${
                feedType === 'following'
                  ? 'text-white'
                  : 'text-white text-opacity-50'
              }`}
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