import React from 'react';
import DreamGrid from './DreamGrid';
import StarrySky from './StarrySky';
import ProfileHeader from './ProfileHeader';
import ProfileActions from './ProfileActions';
import { useEffect } from 'react';

export default function UserProfilePage({
  username,
  profile,
  dreams,
  users,
  editable,
  onUpdate,
  onDelete,
  onFollowToggle,
  isFollowing
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mt-[2rem] z-10">
      <div className="mx-auto w-[80vw] relative text-white">
        <StarrySky numStars={20} minDistance={10}/>
        <ProfileHeader username={username} profile={profile} />
        <ProfileActions
          editable={editable}
          onFollowToggle={onFollowToggle}
          isFollowing={isFollowing}
        />
      </div>

      {dreams.length === 0 ? (
        <p className="text-center font-pixelify mt-4">
          {editable ? 'You have no dreams yet.' : 'No public dreams yet.'}
        </p>
      ) : (
        <DreamGrid
          dreams={dreams}
          users={users}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}