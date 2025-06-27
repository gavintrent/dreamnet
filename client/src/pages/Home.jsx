// pages/Home.jsx
import React, { useState } from 'react';
import DreamGrid from '../components/DreamGrid';
import FeedTabs from '../components/FeedTabs';
import useDreamFeed from '../hooks/useDreamFeed';
import UserSuggestions from '../components/UserSuggestions';

export default function Home({ loggedIn }) {
  const [feedType, setFeedType] = useState('discover');

  const {
    users,
    dreams,
    setDiscoverState,
    setFollowingState,
  } = useDreamFeed(loggedIn, feedType);

  const switchFeed = async (newFeed) => {
    // Save current scroll position
    if (feedType === 'discover') {
      setDiscoverState(prev => ({ ...prev, scrollY: window.scrollY }));
    } else {
      setFollowingState(prev => ({ ...prev, scrollY: window.scrollY }));
    }

    setFeedType(newFeed);
  };

  return (
    <div className="p-8">
      <FeedTabs feedType={feedType} switchFeed={switchFeed} />

      {dreams.length === 0 ? (
        <></>
      ) : (
        <div key={feedType} className="retro-fade-in">
          <DreamGrid dreams={dreams} users={users} />
        </div>
      )}
      {feedType === "following" && (
        <div className="mt-4">
          <UserSuggestions></UserSuggestions>
        </div>
      )}
    </div>
  );
}