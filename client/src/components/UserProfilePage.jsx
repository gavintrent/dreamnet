import React, { useState } from 'react';
import DreamGrid from './DreamGrid';
import { Link, useNavigate } from 'react-router-dom';

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
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  return (
    <div className="mt-[4.5rem]">
      {/* Outer centered container */}
      <div className="mx-auto w-[80vw] relative text-white">
        {/* Avatar + header */}
        <div className="flex items-center">
            {profile?.avatar && (
              <img
                src={profile.avatar}
                alt={`${username}'s avatar`}
                className="w-24 h-24 rounded-full mr-4 object-cover border border-base-300"
                onMouseEnter={() => setIsAvatarHovered(true)}
                onMouseLeave={() => setIsAvatarHovered(false)}
              />
            )}
          <div className="font-pixelify -translate-y-12">
            <h2 className={`text-xl translate-x-8 m-0 ${isAvatarHovered ? 'float-username' : ''}`}>
              @{username}'s Dream Journal
            </h2>
            {profile?.name && (
              <h3 className={`text-md jersey-10-thin m-0 translate-x-4 ${isAvatarHovered ? 'float-name' : ''}`}>
                {profile.name}
              </h3>
            )}
            {profile?.bio && (
              <p className={`text-sm jersey-10-thin mt-1 mb-0 ${isAvatarHovered ? 'float-bio' : ''}`}>{profile.bio}</p>
            )}
          </div>
        </div>

        <div className="relative mt-4 h-10">
          {editable ? (
            <>
              
              <button
                onClick={() => navigate('/edit-profile')}
                className="absolute left-4 jersey-10-thin"
              >
                Edit Profile
              </button>
              
              
              <Link
                to="/new-dream"
                className="absolute left-1/2 transform -translate-x-1/2"
              >
                <button className="btn btn-circle text-3xl font-pixelify">
                +
                </button>
              </Link>
            </>
          ) : onFollowToggle ? (
            
            <button
              onClick={onFollowToggle}
              className="absolute left-0 jersey-10-thin"
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          ) : null}
        </div>
      </div>

      {dreams.length === 0 ? (
        <p className="text-center">
          {editable ? 'You have no dreams yet.' : 'No public dreams yet.'}
        </p>
      ) : (
        <DreamGrid dreams={dreams} users={users} onUpdate={onUpdate} onDelete={onDelete} />
      )}
    </div>
  );
}
