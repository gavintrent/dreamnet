import React, { useEffect, useState } from 'react';
import DreamGrid from './DreamGrid';
import { Link, useNavigate } from 'react-router-dom';
import StarrySky from './StarrySky';

const STAR_COUNT = 40;

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
  const navigate = useNavigate();
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const MIN_DISTANCE = 8;
    const MAX_ATTEMPTS = 100;
    const generatedStars = [];
    const placed = [];

    for (let i = 0; i < STAR_COUNT; i++) {
      let attempts = 0;
      let x, y;
      let tooClose;

      do {
        x = Math.random() * 85 + 5;
        y = Math.random() * 50 + 5; // eslint-disable-next-line
        tooClose = placed.some(p => Math.hypot(p.x - x, p.y - y) < MIN_DISTANCE);
        attempts++;
      } while (tooClose && attempts < MAX_ATTEMPTS);

      if (attempts < MAX_ATTEMPTS) {
        placed.push({ x, y });
        generatedStars.push({
          x,
          y,
          delay: Math.random() * 3,
          variant: Math.random() < 0.5 ? 'star1' : 'star2'
        });
      }
    }
    setStars(generatedStars);
  }, []);

  return (
    <div className="mt-[2rem] z-10">
      <div className="mx-auto w-[80vw] relative text-white">
        <StarrySky></StarrySky>

        {/* Avatar + Floaty Info */}
        <div className="relative z-10 flex items-start">
          <img
            src={profile?.avatar?.trim() ? profile.avatar : '/avatars/default-avatar-1.jpg'}
            alt={`${username}'s avatar`}
            className="w-24 h-24 rounded-full object-cover border border-base-300 ml-6 mr-8 animate-[floatFade3_6s_ease-in-out_infinite]"
          />
          <div className="flex flex-col jersey-10-thin mt-2">
            <h2 className="float-username text-3xl m-0">@{username}'s Dream Journal</h2>
            {profile?.name && (
              <h3 className="text-lg jersey-10-thin m-0 mt-1 float-name">{profile.name}</h3>
            )}
            {profile?.bio && (
              <p className="text-sm jersey-10-thin mt-2 max-w-[60ch] float-bio">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6 z-10 mb-4">
          {editable ? (
            <>
              <button
                onClick={() => navigate('/edit-profile')}
                className="px-4 py-1 bg-yellow-100 border border-yellow-300 text-yellow-900 rounded-full font-pixelify text-sm hover:bg-yellow-300 hover:scale-105 transition-transform shadow-md"
              >
                Edit Profile
              </button>

              <Link to="/new-dream">
                <button className="px-4 py-1 bg-yellow-100 border border-yellow-300 text-yellow-900 rounded-full font-pixelify text-sm hover:bg-yellow-300 hover:scale-105 transition-transform shadow-md">
                  + New Journal Entry
                </button>
              </Link>
            </>
          ) : onFollowToggle ? (
            <button
              onClick={onFollowToggle}
              className="mb-4 px-4 py-1 bg-yellow-100 border border-yellow-300 text-yellow-900 rounded-full font-pixelify text-sm hover:bg-yellow-300 hover:scale-105 transition-transform shadow-md"
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          ) : null}
        </div>
      </div>

      {/* Dreams */}
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