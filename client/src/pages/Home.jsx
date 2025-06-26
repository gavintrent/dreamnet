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
    discoverState, // eslint-disable-next-line
    followingState,
    setDiscoverState,
    setFollowingState,
    fetchDiscover,
  } = useDreamFeed(loggedIn, feedType);

  const switchFeed = async (newFeed) => {
    if (newFeed === 'discover' && discoverState.dreams.length === 0) {
      await fetchDiscover(0, true);
    }

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
      <div className="mt-4">
        <UserSuggestions></UserSuggestions>
      </div>
    </div>
  );
}